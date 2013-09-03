// views
App.ProjectView = Ember.View.extend({
	templateName: 'project',
	didInsertElement: function() {	
		// Image gallery
		if ($('#vcslider-home').length) {
			var myplugin = new $.vcSlider($('#vcslider-home'), { 
				labelLinks : false
			});
		}
	
		var form = this.$('#existing-project-form'),
			fileselect = this.$('#fileselect'),
			dragArea = this.$('#filedrag'),
			controller = this.get('controller'),
			id = $('#projid').val();
	
		App.existingProject(form, fileselect, dragArea, controller, id);
		
	}		
});


App.ProjectsView = Ember.View.extend({
	templateName: 'projects',
	didInsertElement: function() {	
	
		var monthSplitter = function(){
			var projects = $('.project-thumb');
			
			for (var i = 0; i < projects.length; i++) {	
				var thisProj = $(projects[i]),
					nextProj = $(projects[i+1]),
					thisProjMonth = thisProj.data('month'),
					nextProjMonth = nextProj.data('month');
				
				if ( (thisProjMonth !== nextProjMonth) && (nextProjMonth !== null) && (nextProjMonth !== undefined) ) {
					thisProj.after('<h2 class="month-title" style="clear:both;">' + nextProjMonth + '</h2>');
				}
			}
		}
		monthSplitter();
		// setTimeout(monthSplitter,100);	
	}
});


App.ProjectsNewView = Ember.View.extend({
	templateName: 'projects.new',
	didInsertElement: function() {
	
		var form = this.$('#new-project-form'),
			fileselect = this.$('#fileselect'),
			dragArea = this.$('#filedrag'),
			controller = this.get('controller');
	
		App.newProject(form, fileselect, dragArea, controller);
	}
});