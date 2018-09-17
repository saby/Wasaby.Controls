/**
 * Created by as.krasilnikov on 31.08.2018.
 */
define('Controls/Utils/isNewEnvironment', [], function() {

   'use strict';

   /**
    * Returns information about the environment
    */

   return function isNewEnvironment() {
      var cn = document && document.getElementsByTagName('html')[0].controlNodes,
         compat = cn && cn[0] && cn[0].options && cn[0].options.compat || false;

      // Существуют Application.Compatible - там все старое
      return !!cn && !compat;
   };
});
