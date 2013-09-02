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
	
		var fileselect = $('#fileselect'),
			dragArea = $('#filedrag'),
			npf = this.$('#new-project-form'),
			formData = new FormData(),
			that = this.get('controller');

		function processFiles (e){
				e.stopPropagation();
				e.preventDefault();
				
				var files = e.target.files || e.dataTransfer.files;
				
				App.uploader.FileSelectHandler(e);
				readfiles(files);
				return false;
		}
		
		function readfiles(files) {
			for (var i = 0; i < files.length; i++) {
				formData.append('files', files[i]);
			}
		}

		// http://html5doctor.com/drag-and-drop-to-server/
		fileselect.on('change', function(e){
			App.uploader.FileSelectHandler(e);
			readfiles(this.files);
		});

		dragArea.on("dragover", App.uploader.FileDragHover);
		dragArea.on("dragleave", App.uploader.FileDragHover);
		dragArea.on("drop", processFiles);



		
		npf.on('submit', function(e){
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
					that.get('target.router').transitionTo('projects.index');
					App.Project.find();
				}
			});
		});
		
	}
});