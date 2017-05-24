var mongoose = require("mongoose");
var mongoURI = 'mongodb://localhost:27017/recovree';

// process.env.MONGODB_URI will only be defined if you are running on Heroku
<<<<<<< HEAD
if(process.env.MONGODB_URI) {
    mongoURI = process.env.MONGODB_URI;

}

var MongoDB = mongoose.connect(mongoURI).connection;
=======
if(process.env.MONGODB_URI !== undefined) {
    mongoURI = process.env.MONGODB_URI;
} else {
    mongoURI = 'mongodb://localhost:27017/recovree';
}
>>>>>>> 9f40324b3aa3aeeb2efe54c8eeb6005769d5af88

//If there is an error connecting to the database, let us know!
MongoDB.on("error", function(err){
  console.log("Mongo Connection Error :" + err);
  //res.sendStatus(500);
});

//If we successfully hooked up to the database, let us know!
MongoDB.once("open", function(){
  console.log("Connected to Mongo, Meow!");
});







module.exports = MongoDB;
