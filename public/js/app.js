App = Ember.Application.create({ 
	LOG_TRANSITIONS:true
});

App.RESTAdapter = DS.RESTAdapter.extend({
    url: 'http://192.168.33.10:3000/api',

    serializer: DS.RESTSerializer.extend({
        primaryKey: function(type) {
            return '_id';
        }
    })
});


App.Store = DS.Store.extend({
    revision: 12,
    adapter: App.RESTAdapter
	//adapter: 'DS.FixtureAdapter'
});


Ember.Handlebars.registerBoundHelper('date', function(date) {
  return moment(date).fromNow();
});


// Enable html5 required attribute for text fields
App.TextField = Ember.TextField.extend({
    attributeBindings: 'required'
});


// Create html5 file input element
App.FileField = Ember.TextField.extend({
    type: 'file',
	attributeBindings: ['name', 'multiple'],
    multiple : true,
    change: function(evt) {
        evt.preventDefault();
        evt.stopPropagation();
		this.get('controller').bindImgs(evt);
		return false;
    }
});


DragNDrop = Ember.Namespace.create();

// App.Box = Ember.View.extend(DragNDrop.Dragable);
App.DropTarget = Ember.View.extend({
    drop: function(evt) {
        evt.preventDefault();
        evt.stopPropagation();
     	this.get('controller').bindImgs(evt);
        return false;
    }
});

// Create hidden input
App.InputField = Ember.TextField.extend({
    type: 'hidden'
});


App.categories = [
	Ember.Object.create({cat: 'Choose a category', 	val: null }),
	Ember.Object.create({cat: 'Branding', 		val: 'branding' }),
	Ember.Object.create({cat: 'Deals',   	 	val: 'deals'}),
	Ember.Object.create({cat: 'Email',			val: 'email'}),
	Ember.Object.create({cat: 'Most Wanted',  	val: 'most-wanted'}),
	Ember.Object.create({cat: 'Reporting',    	val: 'reporting'}),
	Ember.Object.create({cat: 'App',    		val: 'app'}),
	Ember.Object.create({cat: 'Communications',	val: 'communications'}),
	Ember.Object.create({cat: 'Guidelines',    	val: 'guidelines'}),
	Ember.Object.create({cat: 'Layout',    		val: 'layout'}),
	Ember.Object.create({cat: 'Mobile',    		val: 'mobile'})
];


// App.uploader = {
// 
// 	// file drag hover
// 	FileDragHover: function(e) {
// 		e.stopPropagation();
// 		e.preventDefault();
// 		// add hover class when necessary
// 		e.target.className = (e.type == "dragover" ? "hover" : "");
// 	},
// 	
// 	// output file information
// 	listFile: function(file) {
// 		var list = $("#messages"),
// 			msg = "<p>" + file.name + " " + Math.ceil(file.size / 1000) + "KB</p>";
// 			
// 		list.append(msg);
// 	},
// 	
// 	// file selection
// 	FileSelectHandler: function(e, images, projId) {
// 		// cancel event and hover styling
// 		App.uploader.FileDragHover(e);
// 
// 		// fetch FileList object
// 		var files = e.target.files || e.dataTransfer.files;
// 		// process all File objects
// 		for (var i = 0, f; f = files[i]; i++) {
// 			App.uploader.listFile(f);
// 			// App.uploader.FileUploader(f, images, projId);
// 		}
// 	},
// 	
// 	FileUploader: function(f, images, projId){
// 		var reader = new FileReader();
// 
// 		reader.onload = function(e) {
// 			var fileToUpload = e.srcElement.result;
// 			images.createRecord({ 	uri: f.name, 
// 									imgdata: fileToUpload,
// 									proj: projId
// 			});
// 		}
// 		reader.readAsDataURL(f);
// 	}
// 	
// 	
// }


App.existingProject = function(form, fileselect, dragArea, controller, id){
	
	var formData = new FormData();

	function processFiles(e) {
		e.stopPropagation();
		e.preventDefault();
		
		// fetch FileList object
		var files = e.target.files || e.dataTransfer.files,
			list = $("#messages");
			
		// process all File objects
		for (var i = 0, f; f = files[i]; i++) {			
			var msg = "<p>" + f.name + " " + Math.ceil(f.size / 1000) + "KB</p>";
			list.append(msg);
			formData.append('files', files[i]);
		}
		return false;
	};
	
	// file drag hover
	function fileDragHover(e) {
		e.stopPropagation();
		e.preventDefault();
		// add hover class when necessary
		e.target.className = (e.type == "dragover" ? "hover" : "");
	};
	

	dragArea.on("dragover", fileDragHover);
	dragArea.on("dragleave", fileDragHover);
	dragArea.on("drop", processFiles);
	fileselect.on('change', processFiles);
	
	form.on('submit', function(e){
		e.stopPropagation();
		e.preventDefault();
		
		formData.append('title', $('#title').val());
		formData.append('category', $('#cats').val());

		// processData:false to prevent FromData
		// being serialised through jQuery.param().
		
		// contentType:false stops jQuery using its
		// default: "application/x-www-form-urlencoded"
		// Uses default browser Content-Type header 
		// implementation instead
		$.ajax('/api/projects/' + id, {
		    processData: false,
		    contentType: false,
			type: 'put',
		    data: formData,
			success: function(data) {
				controller.get('target.router').transitionTo('projects.index');
				App.Project.find();
			}
		});
	});
	
};


App.newProject = function(form, fileselect, dragArea, controller){
	
	var formData = new FormData();

	function processFiles(e) {
		e.stopPropagation();
		e.preventDefault();
		
		// fetch FileList object
		var files = e.target.files || e.dataTransfer.files,
			list = $("#messages");
			
		// process all File objects
		for (var i = 0, f; f = files[i]; i++) {			
			var msg = "<p>" + f.name + " " + Math.ceil(f.size / 1000) + "KB</p>";
			list.append(msg);
			formData.append('files', files[i]);
		}
		return false;
	};
	
	// file drag hover
	function fileDragHover(e) {
		e.stopPropagation();
		e.preventDefault();
		// add hover class when necessary
		e.target.className = (e.type == "dragover" ? "hover" : "");
	};
	

	dragArea.on("dragover", fileDragHover);
	dragArea.on("dragleave", fileDragHover);
	dragArea.on("drop", processFiles);
	fileselect.on('change', processFiles);
	
	form.on('submit', function(e){
		e.stopPropagation();
		e.preventDefault();

		formData.append('title', $('#title').val());
		formData.append('category', $('#cats').val());

		// processData:false to prevent FromData
		// being serialised through jQuery.param().
		
		// contentType:false stops jQuery using its
		// default: "application/x-www-form-urlencoded"
		// Uses default browser Content-Type header 
		// implementation instead
		$.ajax('/api/projects/', {
		    processData: false,
		    contentType: false,
			type: 'post',
		    data: formData,
			success: function(data) {
				controller.get('target.router').transitionTo('projects.index');
				App.Project.find();
			}
		});
	});
	
}
