/**
 * Array to store the subjects and topics with global counters (to be saved in the end)
 * Initialize as an array of tuples (name, counter).
 */
let subjectsArray = []; 
//let subjectsNames = new Set(); 

/**
 * Access the JSON containing the subjects and topics, parses it and creates new tuples to 
 * ass to subjectsArray. 
 */
async function loadData() {
    try {
        let response = await fetch("./data/data.JSON");
        let data = await response.json();

        let allSubjects = data.subjects;
        for (let i in allSubjects) {
            let subject = allSubjects[i];
            let subjectName = subject.name;
            //subjectsNames.add(subjectName);

            for (let j in subject.subtopics) {
                let subtopic = subject.subtopics[j];
                let tuple = {
                    name: `${subjectName}: ${subtopic.name}`,
                    counter: subtopic.counter
                };
                subjectsArray.push(tuple);
            }
        }

        console.log(subjectsArray); // Debugging purposes
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

/**
 * A function to retrieve a random index given the boundaries
 * @param {*} min minimum boundary (0)
 * @param {*} max maximum boundary (size of the array containing the subjects)
 * @returns a random index between the boundaries
 */
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * A function to find 5 different index variables (using a set)
 * @param {*} howMany 5 random questions
 * @returns an array of index 
 */
function drawRandom(howMany) {
    let indexes = new Set();
    const length = subjectsArray.length;

    while(indexes.size < howMany){
        let randomIndex = getRandomInt(0, length - 1);
        indexes.add(randomIndex);
    }

    return indexes;
}

/**
 * A function to convert the struct data into a JSON downloaded
 * @param {*} data struct containing data
 * @param {*} filename name of the JSON file to create
 */
function saveJsonToFile(data, filename) {
    // Convert JSON data to string with pretty formatting (indentation)
    let jsonData = JSON.stringify(data, null, 4);

    // Create a Blob object to represent the data
    const blob = new Blob([jsonData], { type: 'application/json' });

    // Create a link element
    const a = document.createElement('a');
    a.style.display = 'none';

    // Create a URL for the Blob and attach it to the link
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = filename; // Set the file name for the download

    // Append the link to the body and click it programmatically
    document.body.appendChild(a);
    a.click();

    // Clean up: remove the link and revoke the URL
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

/**
 * Function to convert the array of data (subject, counter) into 
 * a JSON. 
 */
function convertToJson(){
    let dataToSave = {
        subjects: []
    };

    subjectsArray.forEach(item => {
        let [subjectName, subtopicName] = item.name.split(': '); // Splitting "Subject: Subtopic" into parts
        let existingSubject = dataToSave.subjects.find(subject => subject.name === subjectName);

        if (!existingSubject) {
            existingSubject = {
                name: subjectName,
                subtopics: []
            };
            dataToSave.subjects.push(existingSubject);
        }

        existingSubject.subtopics.push({
            name: subtopicName,
            counter: item.counter
        });
    });

     // Convert object to pretty-printed JSON string
    saveJsonToFile(dataToSave, 'data.json'); 
}

/**
 * Function to create the question buttons from the randomly 
 * selected indexes and the array of subjects. 
 */
function createQuestionButtons () {
    let indexesToDisplay = drawRandom(1);
    console.log(indexesToDisplay);

    const buttonContainer = document.getElementById('upper-buttons');
    //const buttonsToKeep = ['save', 'next']; // Example IDs

    // Remove all buttons except those in buttonsToKeep
    buttonContainer.innerHTML = '';
    

    indexesToDisplay.forEach(index => {
        const { name, counter } = subjectsArray[index];
        const btn = document.createElement('button');
        btn.textContent = `${name} (Repeated ${counter} times)`;
        btn.style.display = 'flex';
        btn.style.flexDirection = 'column'; 
        btn.style.alignItems = 'center'; 
        btn.style.marginBottom = '170px';

        btn.onclick = () => {
            subjectsArray[index].counter++;
            btn.style.backgroundColor = 'green';
            btn.textContent = `${name} (Repeated ${subjectsArray[index].counter} times)`;
            btn. disabled= true; 
            updateChart(name);
        };
        buttonContainer.appendChild(btn);
    });

}

/**
 * Function to create a pie chart
 */
let doughnutChart; 
let completed = {
    "SPLANCO": 0, 
    "LOCOMOTORE": 0, 
    "NERVOSO": 0
};
const totalQuestions = {
    "SPLANCO": 7, 
    "LOCOMOTORE": 16, 
    "NERVOSO": 16
} 
function updateChart(subjectName){
    const subject = subjectName.substring(0, subjectName.indexOf(":"));
    
    if(completed[subject] !== undefined){
        completed[subject]++; 
    }

    const completedPercentages = {
        "SPLANCO": (completed["SPLANCO"]/ totalQuestions["SPLANCO"]) * 100, 
        "LOCOMOTORE": (completed["LOCOMOTORE"]/ totalQuestions["LOCOMOTORE"]) * 100,
        "NERVOSO": (completed["NERVOSO"]/ totalQuestions["NERVOSO"]) * 100,
        "DA_FARE": (((7+16+16)-(completed["SPLANCO"]) - (completed["LOCOMOTORE"]) - (completed["NERVOSO"]))/(7+16+16))*100
    }; 
    
    const graph = document.getElementById('graph'); 
    graph.innerHTML=''; 
    
    const canvas = document.createElement('canvas'); 
    graph.appendChild(canvas); 
    const ctx = canvas.getContext('2d'); 
    console.log(Object.values(completedPercentages))
    doughnutChart = new Chart(ctx, {
        type: 'doughnut', 
        data: {
            labels: Object.keys(completedPercentages), 
            datasets: [{
                data: Object.values(completedPercentages), 
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', 'white'], 
                hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', 'white'],
                borderColor: ['#000000', '#000000', '#000000', '#000000'], // Set black border color for each segment
                borderWidth: 0.5
            }]
        }, 
        options: {
            responsive: true, 
            maintainAspectRatio: false,
            plugins: {
                
                title: {
                    display: true, 
                    text: 'Progress Graph', 
                    color: 'black',
                    font: {
                        size: 18
                    }
                    
                }
            }
        }

    });

}

/**
 * Function started when the window is opened. 
 */
window.onload = async () => {
    await loadData();

    const button = document.querySelector("#button");
    button.addEventListener("click", () => {
        createQuestionButtons(); 
        button.remove(); // Remove the "Next" button after displaying questions
        });

    const next = document.querySelector("#next"); // Corrected selector for "Next" button
    next.addEventListener("click", () => {
        createQuestionButtons();
    });

    const save = document.querySelector("#save");
    save.addEventListener("click", () => {
        convertToJson();
        console.log("saved successfully!"); 
    }); 

     
     
};
