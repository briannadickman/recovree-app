# RECOVREE APP

Utilizing known aftercare strategies and cognitive behavioral therapy (CBT), Recovree is a mobile first web application that aims to encourage journaling for recovering drug and alcohol addicts. Through the use of a fast, simple, and engaging daily  reflection form, registered members can track and visualize personal trends through daily, weekly, and monthly summaries captured in charts and graphs. 

Recovree perserves anonymity by assigning a unique, randomly generated memeber ID upon registration. Server side logic separates members' demomgraphic information and daily reflection data by substituting the provided phone number with a member ID. This is intended to allow Recovree administrators to export the data collected via CSV and determine which direction to grow the applicaiton. 

## Getting Started 
These directions will get a copy of the project running on your local machine for development and testing purposes. 

### Prerequisites 
* Must have installed Git, Node, Robomongo, MongoDB, and a text editor such as Atom, Visual Studio Code, or Sublime Text. 

### Environment Setup
* Download a ZIP or fork the project
* If you download a ZIP file, create a github repository without a README.md
* Create a folder for the project on your local machine and open using a text editor
* Open Terminal and run `git init` to initialize a git repository
* Once that's complete, run `git remote add origin` followed by the url of the github repository and then .git
   ```
   git remote add origin https://github.com/username/recovree_project.git
   ```
 * Run `git pull origin master` if you forked the project repository. Otherwise, run `git push origin master` if you downloaded a ZIP file and have an empty github repository. This command will sync your local and github repository
 * Run `npm install` to install all dependencies specified in the package.json
 * Open Robomongo
 
* create a .env file and add the following environmental variables 
TWILIO_ACCOUNT_SID 
TWILIO_AUTH_TOKEN 
TWILIO_NUMBER 
PASSPORT_SECRET
MONGODB_URI

- You can delete or comment out the twilio.js code if you don't have a twilio account or don't want to use this portion of the project

In seperate terminal tabs run the commands below:
* `mongod` - starts the database
* `mongo` - provides javascript API for database operations
* `grunt` - copies the client folder, minifies client.js, and watches for any changes
* `npm start` - starts the node server. You should see "Listening on port: 500" in the terminal. 


## Built With
* AngularJS 
* Angular Material
* Passport - Base code provided by instructors
* grunt
* twilio
* json2csv
* async
* nodemailer
* cron
* moment.js
* bcrypt
* chart.js
* chance.js
* express

## Deployment
* Heroku

## Contributors
* Anisa Abdulkadir
* Brianna Dickman
* Logan Kelly
* Keith Tomlinson


## Acknowledgments
* Scott Bromander, Chris Black, Luke Schlangen
* Luke Kjolsing and Melissa Kjolsing

