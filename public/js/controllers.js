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
		// this.get('target.router').transitionTo('projects.index');
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

		var self = this;
		var input = evt.target;
		var imgName = input.files[0].name;
		
		if (input.files && input.files[0]) {
			var reader = new FileReader();
			var that = this;

			reader.onload = function(e) {
				var fileToUpload = e.srcElement.result;
				console.log(fileToUpload)
				App.Image.createRecord({ uri:imgName, imgdata:fileToUpload});
				self.get('store').commit();
			}
			reader.readAsDataURL(input.files[0]);	
		}
	},

	save: function() {
		this.get('store').commit();
		this.get('target.router').transitionTo('projects.index');
	},

	destroyRecord: function() {
		if (window.confirm("Are you sure you want to delete this project?")) {
			this.get('content').deleteRecord();
			this.get('store').commit();
			// ERROR ON TRANSITION
			this.get('target.router').transitionTo('projects.index');
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
