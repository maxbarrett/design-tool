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
