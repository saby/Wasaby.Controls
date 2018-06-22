/* global module:false, process:false */
module.exports = function(grunt) {
   'use strict';

   var path = require('path');
   require('load-grunt-config')(grunt, {
      configPath: path.join(process.cwd(), 'grunt/config'),
      init: true,
      data: {
         pkg: grunt.file.readJSON('package.json')
      }
   });

   grunt.loadTasks('grunt/tasks');

   grunt.registerTask('css', [
      'less1by1'
   ]);

   grunt.registerTask('cssV', [
      'lessVDOM'
   ]);

   grunt.registerTask('cssC', [
      'lessControls'
   ]);

   grunt.registerTask('cssD', [
      'lessDemo'
   ]);

   grunt.registerTask('cssE', [
      'lessExamples'
   ]);

   grunt.registerTask('js', [

      'build-dependencies'
   ]);

   grunt.registerTask('build', [
      'js',
      'css'
   ]);

   grunt.registerTask('rebuild', [
      'clean',
      'build'
   ]);

   grunt.registerTask('run', [
      'build',
      'express:development',
      'watch'
   ]);

   grunt.registerTask('default', [
      'build'
   ]);


    // Event handling
    grunt.event.on('watch', function(action, filepath){
        // Update the config to only build the changed less file.
        console.log('zdarove');
        console.log(filepath);
        grunt.config.set('changed', filepath );
    });
};