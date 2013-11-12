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
			id = $('#projid').val(),
			formData = new FormData();
			
			function processFiles(e) {
				e.stopPropagation();
				e.preventDefault();

				// fancy new native method :)	
				e.target.classList.remove('hover');

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
			}

			dragArea.on("dragover", App.fileDragHover);
			dragArea.on("dragleave", App.fileDragHover);
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
						$('#overlay').hide();
						// controller.get('content');
						// controller.get('target.router').transitionTo('project', id);
						// var myplugin = new $.vcSlider($('#vcslider-home'), { 
						// labelLinks : false
						// });
					}
				});
			});
		
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
		};
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
			controller = this.get('controller'),
			formData = new FormData();

			function processFiles(e) {
				e.stopPropagation();
				e.preventDefault();

				// fancy new native method :)	
				e.target.classList.remove('hover');

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
			}

			dragArea.on("dragover", App.fileDragHover);
			dragArea.on("dragleave", App.fileDragHover);
			dragArea.on("drop", processFiles);
			fileselect.on('change', processFiles);

			form.on('submit', function(e){
				e.stopPropagation();
				e.preventDefault();

				formData.append('title', $('#title').val());
				formData.append('category', $('#cats').val());

				form.html('<img class="loading" src="img/loading.gif">');
				$('.close').remove();
				
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
});