define('Controls-demo/DragBorders/DragBorders',
   [
      'Core/Control',
      'wml!Controls-demo/DragBorders/DragBorders',

      'Controls/dragBorders'
   ],
   function(Control, template) {
      'use strict';

      return Control.extend({
         _template: template,

         _width: 200,

         _offsetHandler: function(event, offset) {
            this._offset = offset;
            if (offset.border === 'left') {
               this._offset.border = 'левый';
               this._width -= offset.value;
            } else {
               this._offset.border = 'правый';
               this._width += offset.value;
            }
         }
      });
   });
