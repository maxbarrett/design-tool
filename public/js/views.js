// views

App.ProjectView = Ember.View.extend({
	templateName: 'project',
	didInsertElement: function() {	
		
		// New slider
		if ($('#vcslider-home').length) {
			var myplugin = new $.vcSlider($('#vcslider-home'), { 
				labelLinks : false
			});
		}
	}
});