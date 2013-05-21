var application_root = __dirname,
    express = require("express"),
	fs = require('fs'),
    path = require("path"),
    mongoose = require('mongoose');

var app = express();


// Express Config
app.configure(function () {
	app.use(express.bodyParser({
		uploadDir:'./public/uploads',
		keepExtensions: true
	}));
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(path.join(application_root, "public")));
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});


// Mongo Database
mongoose.connect('mongodb://192.168.33.10:27017/test', function(err){
  if (err) {
    console.log('Could not connect to mongo');
	console.log(err);
  } else {
	console.log('Connected to mongodb://192.168.33.10:27017/test successfully!');
}
});


// Define Schema
var Schema   = mongoose.Schema;

// Create a new Schema
var ProjectSchema = new Schema({
	id: 			Number, 
	title: 			String,
	publishedAt: 	{ type: Date, default: Date.now },
    category: 		String,
	author: 		String,
	image: 			String
});

// Create new record type
var ProjectModel = mongoose.model('Project', ProjectSchema);


// // Populate new record
// var newProject = new ProjectModel({
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
// ProjectModel.find(function(err,doc){
//   console.log(doc);
// });


// var findDocument = ProjectModel.find({ 'title': '' });
// findDocument.remove();


// Setup the RESTful web service endpoint
app.get('/api', function (req, res) {
  res.send('API is running!');
});


// READ a List of Projects
app.get('/api/projects', function (req, res){
  return ProjectModel.find(function (err, projects) {
    if (!err) {
      return res.send( {'projects' : projects} );
    } else {
      return console.log(err);
    }
  });
});

// CREATE a single Project
app.post('/api/projects', function (req, res){
	
	console.log(req.files);
	
	var project;
	console.log("POST: ");
	console.log(req.body);
	
	project = new ProjectModel({
		title: req.body.project.title,
		// publishedAt: req.body.project.publishedAt,
		category: req.body.project.category,
		author: req.body.project.author,
		image: req.body.project.image
	});

	project.save(function (err) {
		if (!err) {
			return console.log("created");
		} else {
			return console.log(err);
		}
	});

	return res.send( {'project' : project} );
});



app.get('/api/fileUpload', function (req, res) {
  res.send('API is running! WOO');
});


app.post('/api/fileUpload', function(req, res) {
    console.log(req.body);
    console.log(req.files);
    res.send('File uploaded successfully!');


    // var uploadedFile = req.files.uploadingFile;
    // var tmpPath = uploadedFile.path;
    // var targetPath = './public/uploads/' + uploadedFile.name;
    //  
    // fs.rename(tmpPath, targetPath, function(err) {
    // 	if (err) throw err;
    // 	    fs.unlink(tmpPath, function() {
    // 	        if (err) throw err;
    // 	            res.send('File Uploaded to ' + targetPath + ' - ' + uploadedFile.size + ' bytes');
    // 	        });
    // });


});




// READ a Single Project by ID
app.get('/api/projects/:id', function (req, res){
	return ProjectModel.findOne( {id : req.params.id}, function (err, project) {
		if (!err) {
			console.log('No error reading a project')
			return res.send({'project':project});
		} else {
			console.log('Error reading a project')
			return console.log(err);
		}
	});
});


// UPDATE a Single Project by ID
app.put('/api/projects/:id', function (req, res){
console.log(req.params._id)
	return ProjectModel.findOne( {id : req.params._id}, function (err, project) {
		
		var thisProject = req.body.project;
		
		project.title = thisProject.title;
		// Do we need this if it defaults to 'now'?
		// project.publishedAt = thisProject.publishedAt;
		project.category = thisProject.category;
		project.author = thisProject.author;
		project.image = thisProject.image;
		
		return project.save(function (err) {
			if (!err) {
				console.log("Project updated");
			} else {
				console.log("Error updating project");
				console.log(err);
			}
			
			console.log(project);
			return res.send({'project' : project});
		});
		
	});
});


// DELETE a Single Project by ID
app.delete('/api/projects/:id', function (req, res){
	return ProjectModel.findById(req.params.id, function (err, project) {
		return project.remove(function (err) {
			if (!err) {
				console.log("removed");
				return res.send('');
			} else {
				console.log(err);
			}
		});
	});
});


// Launch server
app.listen(3000);
console.log('listening on port 3000');









