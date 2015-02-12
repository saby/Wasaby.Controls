/* global module: false */
module.exports = function(grunt) {
   'use strict';

   grunt.registerTask('build-dependencies', function() {
      // TODO: implement dependencyCollector.js as Grunt task here

      if ([
         'components/contents.js',
         'components/contents.json'
      ].every(function(file) {
         return grunt.file.exists(file) && grunt.file.isFile(file);
      })) {
         // All files are built, no need to rebuild them
         return;
      }

      var done = this.async();
      grunt.util.spawn({
         cmd: 'node',
         args: ['depencyCollector.js']
      }, function(error) {
         if (error) {
            console.log(error);
         }
         done();
      });
   });
};