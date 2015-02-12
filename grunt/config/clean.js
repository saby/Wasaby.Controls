/* global module: false */
module.exports = function() {
   'use strict';

   return {
      contents: [
         'components/contents.js',
         'components/contents.json'
      ],
      'sbis3-controls': [
         'SBIS3.CONTROLS/components',
         'SBIS3.CONTROLS/themes'
      ],
      themes: [
         'themes/**/*.css'
      ]
   };
};