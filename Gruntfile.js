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
      'less1by1:online'
   ]);

   grunt.registerTask('js', [
      'jshint:gruntfile',
      // TODO: fix warnings in components
      /*'jshint:components',*/
      'build-dependencies'
   ]);

   grunt.registerTask('build', [
      'js',
      'css',
      'copy'
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
};