module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            files: ['public/js/*.js', 'public/js/plugins/*.js'],
            options: {
                //jshintrc: '.jshintrc'
            }
        }
    });
 
    // Load the plugin that provides the "jshint" task.
    grunt.loadNpmTasks('grunt-contrib-jshint');
 
    // Default task(s).
    grunt.registerTask('default', ['jshint']);
};