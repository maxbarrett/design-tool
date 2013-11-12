module.exports = function(grunt) {
	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			files: ['public/js/*.js', 'public/js/plugins/*.js'],
			options: {
				//jshintrc: '.jshintrc'
			}
		},
		uglify: {
			my_target: {
				files: {
					'dest/output.min.js': ['public/js/*.js']
				}
			}
		}
	});

	// Load the plugin that provides the "jshint" task.
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	// Default task(s).
	grunt.registerTask('default', ['jshint', 'uglify']);
};