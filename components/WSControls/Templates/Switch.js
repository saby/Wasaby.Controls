define('js!WSControls/Templates/Switch',
   [
      'Core/Control',
      'tmpl!WSControls/Templates/Switch',
      'Core/helpers/URLHelpers'
   ],

   function (Control, template, URLHelpers) {
      'use strict';

      var Switch = Control.extend({
         _template: template,
         iWantVDOM: true,

         _beforeMount: function(cfg, receivedState) {
            var path = URLHelpers.getQueryParam('currentTab') || 0;
            var match = cfg.items.filter(function(elem) {
               return elem.path == path;
            })[0];
            if (match) {
               this._component = match.component;
            }
         },

         _beforeUpdate: function(cfg) {
            var path = URLHelpers.getQueryParam('currentTab') || 0;
            var match = cfg.items.filter(function(elem) {
               return elem.path == path;
            })[0];
            if (match) {
               this._component = match.component;
            }
         }
      });

      return Switch;
   }
);