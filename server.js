var application_root = __dirname,
    express = require("express"),
    path = require("path"),
    mongoose = require('mongoose');

var app = express();


// Config
app.configure(function () {
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(application_root, "public")));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});


// Database
mongoose.connect('mongodb://192.168.33.10:27017/test', function(err){
  if (err) {
    console.log('Could not connect to mongo');
  } else {
	console.log('Connected to mongodb://192.168.33.10:27017/test successfully!');
}
});


// // Define Schema
// var Schema   = mongoose.Schema;
// 
// // Create a new Schema
// var ProjectSchema = new Schema({
//     id: 			Number,
// 	title: 			String,
// 	author: 		String,
// 	publishedAt: 	{ type: Date, default: Date.now },
// 	image: 			String
// });
// 
// // Create new record type
// var Project = mongoose.model('Project', ProjectSchema);
// 
// // Populate new record
// var newProject = new Project({
//     id: 			99,
// 	title: 			'Test Name',
// 	author: 		'Mongo User',
// 	image: 			'http://lorempixel.com/180/179/'
// });
// 
// // Save that record
// newProject.save(function(err) {
//   if (err) {
//     console.log('Could not save new project');
//   } else {
//     console.log('New project saved!');
//   }
// });
// 
// // Find all records
// Project.find(function(err,doc){
//   console.log(doc);
// });



// Setup the RESTful web service
app.get('/api', function (req, res) {
  res.send('API is running!');
});

// Launch server

app.listen(3000);
console.log('listening on port 3000');









