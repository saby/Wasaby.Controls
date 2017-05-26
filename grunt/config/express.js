/* global module: false */
module.exports = function() {
   'use strict';

   return {
      options: {
         port:  process.env.PORT || 666
      },
      development: {
         options: {
            script: 'app.js'
         }
      }
   };
};