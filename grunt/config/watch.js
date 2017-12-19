/* global module: false */
module.exports = function() {
   'use strict';

   return {
      less: {
         files: [
            'components/themes/**/*.less',
            'components/**/*.less',
            'Controls/**/*.less'
         ],
         tasks: ['css:normal'],
         options: {
            spawn: false
         }
      }
   };
};
