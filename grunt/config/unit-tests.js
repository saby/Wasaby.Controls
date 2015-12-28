/* global module */
module.exports = function () {
   'use strict';

   var timeout = 60000;

   return {
      path: 'tests/unit/',
      timeout: timeout,
      packages: {
         'selenium-standalone': '4.4.2',
         'webdriverio': '2.4.5',
         'istanbul': '0.4.1'
      },
      mocha: {
         path: 'mocha',
         args: [
            '-t ' + timeout,
            '-R XUnit'
         ]
      }
   };
};
