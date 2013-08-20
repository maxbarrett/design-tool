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
			imgData = {};


// Use this:
// http://html5doctor.com/drag-and-drop-to-server/
		
		// fileselect.on('change', function(e){
		// 	// fetch FileList object
		// 	var files = e.target.files || e.dataTransfer.files;
		// 	
		// 	// process all File objects
		// 	for (var i = 0, f; f = files[i]; i++) {
		// 		
		// 		App.uploader.ParseFile(f);
		// 		console.log(f)
		// 
		// 		var concatFileName = f.name.replace(/ /g, '+'),
		// 			dotPosition = concatFileName.lastIndexOf('.'),
		// 			date = new Date().getTime(),
		// 			newFileName = [concatFileName.slice(0, dotPosition), '-' + date, concatFileName.slice(dotPosition)].join('');
		// 
		// 		var reader = new FileReader();
		// 
		// 		imgData[newFileName] = '';
		// 
		// 		reader.onload = function(e) {
		// 			var fileToUpload = e.srcElement.result;
		// 			imgData[newFileName] = fileToUpload;
		// 		}
		// 
		// 		reader.readAsDataURL(f);
		// 	}
		// 
		// });

	
		npf.on('submit', function(e){
			e.stopPropagation();
			e.preventDefault();
			console.log(imgData);
			
			// var theData = {title: $('#title').val(),
			// 		category: $('#cats').val(),
			// 		imgs: imgData}
			// 
			// $.ajax({
			// 	url: '/api/projects',
			// 	type: 'post',
			// 	dataType: 'json',
			// 	data: theData,
			// 	success: function(data){ 
			// 		console.log(data);
			// 	}
			// });
			// 
			// return false;
			
		});
		
	}
});