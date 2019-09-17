define('Controls-demo/Popup/TestMaximizedStack',
   [
      'Core/Control',
      'wml!Controls-demo/Popup/TestMaximizedStack'
   ],
   function (Control, template) {
      'use strict';

      var TestMaximizedStack = Control.extend({
         _template: template,
         _showMaximizedButton: false,
         _beforeMount: function(options) {
            this.updateMaximizeButton(options);
         },
         _beforeUpdate: function(options) {
            this.updateMaximizeButton(options);
         },
         updateMaximizeButton: function(options) {
            this._showMaximizedButton = options.stackMaxWidth - options.stackMinWidth > 200;
         },
         _close: function() {
            this._notify('close', [], { bubbling: true });
         }
      });

      TestMaximizedStack.getDefaultOptions = function() {
         return {
            minWidth: 500,
            width: 800,
            maxWidth: 1200
         }
      };

      return TestMaximizedStack;
   }
);
