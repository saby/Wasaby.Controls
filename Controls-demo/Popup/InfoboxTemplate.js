define('Controls-demo/Popup/InfoboxTemplate',
   [
      'Core/Control',
      'wml!Controls-demo/Popup/InfoboxTemplate',
      'Controls-demo/Popup/TestDialog',
   ],
   function(Control, template) {
      'use strict';

      var InfoboxTemplate = Control.extend({
         _template: template,
         _beforeMount: function() {
            this._verticalDirection = true;
            this._horizontalDirection = true;
            this._verticalPoint = true;
            this._horizontalPoint = true;
         },

         openSticky: function() {
            this._children.sticky.open({
               target: this._children.stickyButton._container,
               opener: this._children.stickyButton,
               templateOptions: {
                  template: 'Controls-demo/Popup/TestDialog',
                  type: this._firstClick ? 'sticky' : 'dialog'
               }
            });
            this._firstClick = true;
         }
      });

      return InfoboxTemplate;
   });
