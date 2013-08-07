var application_root = __dirname,
    express = require("express"),
	fs = require('fs-extra'),
    path = require("path"),
    mongoose = require('mongoose'),
	ProjectController = require('./ProjectController.js').ProjectController,
	ImageController = require('./ImageController.js').ImageController;

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

Schema = mongoose.Schema;

var ProjectSchema = new Schema({ 
	title: 			String,
	publishedAt: 	{ type: Date, default: Date.now },
	month: 			String,
    category: 		String,
	author: 		String,
	image_ids: 		[{ type: Schema.Types.ObjectId, ref: 'Image' }]
});

var ImageSchema = new Schema({
	uri: 		String,
	proj: 		{ type: Schema.Types.ObjectId, ref: 'Project' },
	imgdata: 	String
});

var ProjectModel = mongoose.model('Project', ProjectSchema);
var ImageModel = mongoose.model('Image', ImageSchema);


// Authenticator
auth = express.basicAuth('user', 'password');

// Homepage route
app.get('/', auth, function(req, res) {
	// console.log(auth);
 	res.sendfile('public/index.html');
});

// Error handler
function errorHandler(err){
	console.log('We have an error...');
	console.log(err);
}

// Mongo Database
mongoose.connect('mongodb://192.168.33.10:27017/test', function(err){
  if (err) return errorHandler(err);
	console.log('Connected to mongodb://192.168.33.10:27017/test successfully!');
});

var projectController = new ProjectController(ProjectModel, ImageModel, fs);
var imageController = new ImageController(ProjectModel, ImageModel, fs);

// // Delete all projects
// var tt = ProjectModel.find(function(err,doc){
//   console.log(doc);
// });
// tt.remove();
// 
// // Delete all images
// var tt = ImageModel.find(function(err,doc){
//   console.log(doc);
// });
// tt.remove();


// Setup the RESTful web service endpoint
app.get('/api', function (req, res) {
  res.send('API is running!');
});


/////////////////////////////////////////////////////////////////
// REST API FOR PROJECTS

// READ a List of Projects
app.get('/api/projects', function(req, res){
	projectController.readAll(req, res)
});

// CREATE a project
app.post('/api/projects', function(req, res){
	projectController.create(req, res)
});

// READ a Single Project by ID
app.get('/api/projects/:id', function(req, res){
	projectController.readOne(req, res)
});

// UPDATE a Single Project by ID
app.put('/api/projects/:id', function(req, res){
	projectController.update(req, res)
});

// DELETE a Single Project by ID
app.delete('/api/projects/:id', function(req, res){
	projectController.del(req, res)
});



/////////////////////////////////////////////////////////////////
// REST API FOR IMAGES

// READ a List of Images
app.get('/api/images', function(req, res){
	imageController.readAll(req, res)
});

// Add an image to existing project
app.post('/api/images', function(req, res){
	imageController.create(req, res)
});

// READ a Single Image by ID
app.get('/api/images/:id', function(req, res){
imageController.readOne(req, res)
});

// DELETE a Single Image by ID
app.delete('/api/images/:id', function(req, res){
	imageController.del(req, res)
});



// Launch server
app.listen(3000);
console.log('listening on port 3000');

