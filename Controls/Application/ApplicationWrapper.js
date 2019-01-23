define('Controls/Application/ApplicationWrapper', [
   'Core/Control',
   'Core/constants',
   'wml!Controls/Application/ApplicationWrapper'
], function(Control, constants, template) {
   'use strict';

   var _private = {

      /**
       * @param {Location.search} search
       * @return {String|null}
       */
      calculateVersion: function(search) {
         var matchVersion = search.match(/(^\?|&)v=(.*)/);

         return matchVersion && matchVersion[2];
      }
   };

   var ModuleClass = Control.extend({
      _template: template,

      _version: null,

      _beforeMount: function() {
         if (constants.isBrowserPlatform) {
            this._version = _private.calculateVersion(window.location.search);
         }
      }
   });
   return ModuleClass;
});
