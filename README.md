# Study Helper
This is a first version, I am continuing to improve and generalize it. I created it for 
my sister to have a tracker of the subjects and topics she still has to go through and has already seen to prepare for her Anatomy exam. 

It accepts JSON files and selects random questions from them, showing the progress on a dounghnut graph. 

## Set up
The set up is pretty straightforward. 
It is enough to substitute the 'data.JSON' file 
with your file (same name). CLicking on 'index.html' is enough to run the project on any browser. If you have CORS errors, the easiest solution is to run the application on a local server. I use live-server. 

From terminal, 
```
npm install -g live-server 
```
Then navigate to the project's root directory
```
cd path/to/your/project
```
Start the server: 
```
live-server
```

To then save the progress made, click the "save" button on your page and a new JSON file that keeps track of the subjects you've already gone through will be downloaded. Put this file as your data file in the project for the next time.  