/* global module: false */
module.exports = function() {
   'use strict';

   return {
      less: {
         files: [
            'themes/**/*.less',
            'components/**/*.less'
         ],
         tasks: ['less:normal'],
         options: {
            spawn: false
         }
      }
   };
};