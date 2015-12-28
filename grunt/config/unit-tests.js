/* global module */
module.exports = function () {
   'use strict';

   var timeout = 60000;

   return {
      path: 'tests/unit/',
      packages: {
         'selenium-standalone': '4.4.2',
         'webdriverio': '2.4.5',
         'istanbul': '0.4.1'
      },
      mocha: [
         '-t ' + timeout,
         '-R XUnit'
      ]
   };
};
