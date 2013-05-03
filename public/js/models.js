App.Project = DS.Model.extend({
	title: DS.attr('string'),
	publishedAt: DS.attr('date'),
	category: DS.attr('string'),
	author: DS.attr('string'),
	image: DS.attr('string')
});


// The data, will eventually come from MongoDB on Node.js
// App.Project.FIXTURES = [{
// 	id: 1,
// 	title: "Dealio",
// 	author: "Sam King",
// 	publishedAt: new Date('12-27-2012'),
// 	image: "http://lorempixel.com/180/180/"
// }, {
// 	id: 2,
// 	title: "Partner Reporting",
// 	author: "Tim Davey",
// 	publishedAt: new Date('12-30-2011'),
// 	image: "http://lorempixel.com/180/180/"
// }, {
// 	id: 3,
// 	title: "Another project",
// 	author: "Humberto De Souza",
// 	publishedAt: new Date('01-15-2013'),
// 	image: "http://lorempixel.com/180/180/"
// }, {
// 	id: 4,
// 	title: "Project title",
// 	author: "Ed Vidicombe",
// 	publishedAt: new Date('02-15-2013'),
// 	image: "http://lorempixel.com/180/180/"
// }, {
// 	id: 5,
// 	title: "More Work",
// 	author: "Tim Davey",
// 	publishedAt: new Date('04-25-2013'),
// 	image: "http://lorempixel.com/180/180/"
// }, {
// 	id: 6,
// 	title: "Partner Reporting",
// 	author: "Tim Davey",
// 	publishedAt: new Date('12-30-2012'),
// 	image: "http://lorempixel.com/180/180/"
// }, {
// 	id: 7,
// 	title: "Another project",
// 	author: "Humberto De Souza",
// 	publishedAt: new Date('01-15-2013'),
// 	image: "http://lorempixel.com/180/180/"
// }, {
// 	id: 8,
// 	title: "Project title",
// 	author: "Ed Vidicombe",
// 	publishedAt: new Date('02-15-2013'),
// 	image: "http://lorempixel.com/180/180/"
// }, {
// 	id: 9,
// 	title: "More Work",
// 	author: "Tim Davey",
// 	publishedAt: new Date('04-20-2013'),
// 	image: "http://lorempixel.com/180/180/"
// }];