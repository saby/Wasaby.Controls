/* global module: false */
module.exports = function() {
   'use strict';

   return {
      options: {
         port: 666
      },
      development: {
         options: {
            script: 'app.js'
         }
      }
   };
};