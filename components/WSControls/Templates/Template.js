define('js!WSControls/Templates/Template',
   [
      'Core/Control',
      'tmpl!WSControls/Templates/Template',
      'Core/moduleStubs'
   ],

   function (Control, template, moduleStubs) {
      'use strict';

      var Template = Control.extend({
         _template: template,
         iWantVDOM: true,

         _beforeMount: function(cfg, receivedState) {
            var self = this;
            return moduleStubs.require([cfg.component]).addCallback(function() {
               self._component = cfg.component;
               self._forceUpdate();
            });
         },

         _beforeUpdate: function(newOptions) {
            var self = this;
            return moduleStubs.require([newOptions.component]).addCallback(function() {
               self._component = newOptions.component;
               self._forceUpdate();
            });
         }
      });

      return Template;
   }
);