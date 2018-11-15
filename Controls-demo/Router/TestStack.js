define('Controls-demo/Router/TestStack',
   [
      'Core/Control',
      'Controls-demo/Router/Panel',
      'wml!Controls-demo/Router/TestStack'
   ],
   function (Control, Panel, template) {
      'use strict';

      var TestDialog = Control.extend({
         _template: template,
         _beforeMount: function() {
            this._depth = Panel.getDepth();
         },
         getDepth: function getDepth() {
            return this._depth;
         }
      });

      return TestDialog;
   }
);
