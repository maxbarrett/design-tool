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


App.NewView = Ember.View.extend({
	templateName: 'new',
	didInsertElement: function() {
		var fileselect = $('#fileselect'),
			npf = this.$('#new-project-form'),
			formData = new FormData();

		// http://html5doctor.com/drag-and-drop-to-server/

		
		fileselect.on('change', function(){
			readfiles(this.files);
		});

		function readfiles(files) {
			for (var i = 0; i < files.length; i++) {
				formData.append('files', files[i]);
			}
		}
		
		npf.on('submit', function(e){
			e.stopPropagation();
			e.preventDefault();

			var title = $('#title').val(),
				category = $('#cats').val();
			
			formData.append('title', title);
			formData.append('category', category);

			// jQuery runs anything that isn’t a string through 
			// jQuery.param() to serialize the objects keys into 
			// key1=a&key2=b etc; running FormData through doesn't work
			// processData turns this off.
			
			// unless contentType is specified as an option to jQuery.ajax(), 
			// jQuery reverts to the default of "application/x-www-form-urlencoded". 
			// By setting contentType to false we prevent this option from being set, 
			// and the browser implementation of XMLHttpRequest (which jQuery uses 
			// behind the scenes of course) will set the correct Content-Type header for us
			
			$.ajax('/api/projects/', {
			    processData: false,
			    contentType: false,
				type: 'post',
			    data: formData,
				success: function(data) {
					console.log(data);
					window.location.replace('/#/')
				}
			});
			
			return false;
		});
		
	}
});