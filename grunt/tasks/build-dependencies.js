/* global module: false */
module.exports = function(grunt) {
   'use strict';

   grunt.registerTask('build-dependencies', function() {
      if ([
         'components/contents.js',
         'components/contents.json'
      ].every(function(file) {
         return grunt.file.exists(file) && grunt.file.isFile(file);
      })) {
         // All files are built, no need to rebuild them
         return;
      }

      // TODO: implement dependencyCollector.js as Grunt task here
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