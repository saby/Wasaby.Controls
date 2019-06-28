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
         _minOffsetLeft: -100,
         _maxOffsetLeft: 400,
         _minOffsetRight: -100,
         _maxOffsetRight: 400,

         _offsetHandlerRight: function(e, offset) {
            this._border = 'правый';
            this._offset = offset;
            this._width += offset;
            this._maxOffsetRight -= offset;
            this._minOffsetRight -= offset;
         },

         _offsetHandlerLeft: function(e, offset) {
            this._border = 'левый';
            this._offset = offset;
            this._width += offset;
            this._minOffsetLeft -= offset;
            this._maxOffsetLeft -= offset;
         }
      });
   });
