define('Controls/Application/ApplicationWrapper', [
   'Core/Control',
   'Env/Env',
   'wml!Controls/Application/ApplicationWrapper',
   'css!Controls/Application/ApplicationWrapper'
], function(Control, Env, template) {
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

      headJson: null,

      _beforeMount: function() {
         this.headJson = [
            ['link',
               {
                  rel: 'stylesheet',
                  type: 'text/css',
                  href: '/materials/resources/SBIS3.CONTROLS/themes/online/online.css'
               }
            ]
         ];

         if (Env.constants.isBrowserPlatform) {
            this._version = _private.calculateVersion(window.location.search);
         }
      }
   });
   return ModuleClass;
});
