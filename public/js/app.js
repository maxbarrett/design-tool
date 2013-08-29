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

DragNDrop.cancel = function(e) {
	e.stopPropagation();
	e.preventDefault();
	// var target = $(e.target);
	// console.log(e.type)

	//	e.target.className = (e.type == "dragover" ? "hover" : "");
    return false;
};

DragNDrop.Droppable = Ember.Mixin.create({
    dragEnter: DragNDrop.cancel,
    dragOver: DragNDrop.cancel,
    drop: function(evt) {
        evt.preventDefault();
        evt.stopPropagation();
     	this.get('controller').bindImgs(evt);
        return false;
    }
});

// App.Box = Ember.View.extend(DragNDrop.Dragable);
App.DropTarget = Ember.View.extend(DragNDrop.Droppable);



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


App.uploader = {
	
	// DragDrop: function(){
	// 	$('#filedrag').on("dragover", App.uploader.FileDragHover);
	// 	$('#filedrag').on("dragleave", App.uploader.FileDragHover);
	// 	$('#filedrag').on("drop", App.uploader.FileSelectHandler);
	// },
	
	// output information
	Output: function(msg) {
		var m = $("#messages");
		m.append(msg);
	},
	
	// file drag hover
	// FileDragHover: function(e) {
	// 	e.stopPropagation();
	// 	e.preventDefault();
	// 	e.target.className = (e.type == "dragover" ? "hover" : "");
	// },
	
	// output file information
	ParseFile: function(file) {
		App.uploader.Output("<p>" + file.name + " " + Math.ceil(file.size / 1000) + "KB</p>");
	},
	
	// file selection
	FileSelectHandler: function(e, images, projId) {
		// cancel event and hover styling
		// App.uploader.FileDragHover(e);

		// fetch FileList object
		var files = e.target.files || e.dataTransfer.files;
		// process all File objects
		for (var i = 0, f; f = files[i]; i++) {
			App.uploader.ParseFile(f);
			App.uploader.FileUploader(f, images, projId);
		}
	},
	
	FileUploader: function(f, images, projId){

		// var concatFileName = f.name.replace(/ /g, '+'),
		// 	dotPosition = concatFileName.lastIndexOf('.'),
		// 	date = new Date().getTime(),
		// 	newFileName = [concatFileName.slice(0, dotPosition), '-' + date, concatFileName.slice(dotPosition)].join('');

		var reader = new FileReader();

		reader.onload = function(e) {
			var fileToUpload = e.srcElement.result;
			images.createRecord({ 	uri: f.name, 
									imgdata: fileToUpload,
									proj: projId
			});
		}
		reader.readAsDataURL(f);
	}
	
	
}
