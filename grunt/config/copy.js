/* global module: false */
module.exports = function() {
   'use strict';

   return {
      components: {
         files: [{
            expand: true,
            cwd: 'components',
            src: [
               '**/*'
            ],
            dest: 'SBIS3.CONTROLS/components'
         }]
      },
      themes: {
         files: [{
            expand: true,
            cwd: 'themes',
            src: [
               '**/*',
               '!**/*.less',
               '!**/*.html'
            ],
            dest: 'SBIS3.CONTROLS/themes'
         }]
      }
   };
};