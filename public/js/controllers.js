App.ProjectController = Ember.ObjectController.extend({
	isEditing: false,
	
	edit: function() {
		this.set('isEditing', true);
		$('#overlay').show();
		$('.overlay-module').css({margin:'90px auto 0 auto'});
	},

	doneEditing: function (){
		this.set('isEditing', false);
		// update the publish date now that we have finished editing
		// this.set('publishedAt', new Date());
		this.get('store').commit();
		// var myplugin = new $.vcSlider($('#vcslider-home'), { 
		// labelLinks : false
		// });
	},

	
	bindImgs: function(e){
		var project = this.get('model'),
			images = project.get('images'),
			projId = $('#projid').val();
		App.uploader.FileSelectHandler(e, images, projId);
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
			};
			setTimeout(transition,100);
		}
	},
	
	deleteImg: function(img) {
		if (window.confirm("Are you sure you want to delete this image?")) {
			img.deleteRecord();
			this.get('store').commit();
		}
    }
});


App.ProjectsController = Ember.ObjectController.extend({
	destroyRecord: function(project) {
		if (window.confirm("Are you sure you want to delete this project?")) {
			project.deleteRecord();
			this.get('store').commit();
		}
	}
});

