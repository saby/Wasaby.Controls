define('Controls-demo/ResizingLine/ResizingLine',
   [
      'Core/Control',
      'wml!Controls-demo/ResizingLine/ResizingLine',

      'Controls/dragnDrop'
   ],
   function(Control, template) {
      'use strict';

      return Control.extend({
         _template: template,

         _width: 200,

         _offsetHandlerRight: function(e, offset) {
            this._border = 'правый';
            this._offset = offset;
            this._width += offset;
         },

         _offsetHandlerLeft: function(e, offset) {
            this._border = 'левый';
            this._offset = offset;
            this._width += offset;
         }
      });
   });
