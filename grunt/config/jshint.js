/* global module: false */
module.exports = function() {
   'use strict';

   return {
      options: {
         jshintrc: 'sbis3-ws/.jshintrc'
      },
      gruntfile: {
         files: {
            src: [
               'Gruntfile.js',
               'grunt/**/*.js'
            ]
         }
      },
      components: {
         files: {
            src: [
               'components/**/*.js'
            ]
         }
      }
   };
};