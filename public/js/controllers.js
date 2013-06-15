App.ProjectController = Ember.ObjectController.extend({
	isEditing: false,

	edit: function() {
		this.set('isEditing', true);
	},

	doneEditing: function (){
		this.set('isEditing', false);
		// update the publish date now that we have finished editing
		// this.set('publishedAt', new Date());
		this.get('store').commit();
	},
	
	bindImgs: function(evt){
		// var files = []
		// var len = evt.target.files.length; 		
		// 
		// if (len) {
		// 	for (var i = 0; i < len; i++) {
		// 		files.push(evt.target.files[i].name);
		// 	}
		// }

		var project = this.get('model'),
			images = project.get('images'),
			input = evt.target,
			imgName = input.files[0].name,
			projId = $('#projid').val();

		var concatFileName = imgName.replace(/ /g, '+'),
			dotPosition = concatFileName.lastIndexOf('.'),
			date = new Date().getTime(),
			newFileName = [concatFileName.slice(0, dotPosition), '-' + date, concatFileName.slice(dotPosition)].join('');

		if (input.files && input.files[0]) {
			var reader = new FileReader();

			reader.onload = function(e) {
				var fileToUpload = e.srcElement.result;
				images.createRecord({ 	uri: newFileName, 
										imgdata: fileToUpload,
										proj: projId
				});
			}
			reader.readAsDataURL(input.files[0]);
		}
	},

	destroyRecord: function() {
		if (window.confirm("Are you sure you want to delete this project?")) {
			var that = this;
			
			this.get('content').deleteRecord();
			this.get('store').commit();
			
			// This is hacky, I need to wait a bit before transitioning to the homepage
			// or else the it will try to request the project
			var transition = function(){
				that.transitionToRoute('projects.index');
			}
			setTimeout(transition,100);			
		}
	},
	
	deleteImg: function(img) {
        img.deleteRecord();
		this.get('store').commit();
    }
});


App.ProjectsNewController = Ember.ObjectController.extend({
	newRecord: function() {
		console.log('new record');	
		this.set('content', App.Project.createRecord({title: ''}));
	},
	
	save: function() {
		this.get('store').commit();
		console.log('save');
		this.get('target.router').transitionTo('projects.index');	
	}	
});
