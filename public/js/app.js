App = Ember.Application.create({ LOG_TRANSITIONS:true});

App.RESTAdapter = DS.RESTAdapter.extend({
    url: 'http://192.168.33.10:3000/api',

    serializer: DS.RESTSerializer.extend({
        primaryKey: function(type) {
            return '_id';
        }
    })
});


App.Store = DS.Store.extend({
    revision: 12,
    adapter: App.RESTAdapter
	// adapter: 'DS.FixtureAdapter'
});


Ember.Handlebars.registerBoundHelper('date', function(date) {
  return moment(date).fromNow();
});


// Enable html5 required attribute for text fields
App.TextField = Ember.TextField.extend({
    attributeBindings: 'required'
});


App.FileField = Ember.TextField.extend({
    type: 'file',
	attributeBindings: ['name'],
    multiple : true,
    // change: function(evt) {
    //     evt.preventDefault();
    //     evt.stopPropagation();
    //     this.get('controller').bindImgs(evt);
    // }
	change: function(evt) {
		var self = this;
		var input = evt.target;
		if (input.files && input.files[0]) {
			var reader = new FileReader();
			var that = this;
			reader.onload = function(e) {
				var fileToUpload = e.srcElement.result;
				self.get('controller').set(self.get('name'), fileToUpload);
			}
			reader.readAsDataURL(input.files[0]);
		}
	}
});
