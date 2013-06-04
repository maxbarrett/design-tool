// App.FileSelectionView = Ember.View.extend({
//     files: null,
// 
//     fileSelectionChanged: function(evt) {
//         var inputFiles = evt.target.files;
//         var files = [];
//         for (var i = 0, f; f = inputFiles[i]; i++) {
//             files.pushObject({
//                 name: escape(f.name),
//                 type: f.type || 'n/a', 
//                 size: f.size,
//                 date: f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a'
//             });
//         }
//         this.set('files', files);
//     }
// });


// App.ProjectNewView = Ember.View.extend({
// 	
// 	templateName: 'projects/new',
// 	submitFileUpload: function(event) {
// 		event.preventDefault();
// 		var person = PersonApp.Person.createRecord({ 	username: 'heyo', 
// 														attachment: this.get('controller').get('logo'), 
// 														other: this.get('controller').get('other') });
// 														this.get('controller.target').get('store').commit();
// 	}
// 	
// });