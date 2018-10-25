define('Controls/Input/Render',
   [
      'Core/Control',
      'Controls/Utils/tmplNotify',
      'Controls/Input/resources/RenderHelper',

      'wml!Controls/Input/Render/Render',
      'css!Controls/Input/Render/Render'
   ],
   function(Control, tmplNotify, RenderHelper, template) {

      'use strict';

      var Render = Control.extend({
         _template: template,

         _notifyHandler: tmplNotify,

         _isShowPlaceholder: function() {
            return !(this._options.viewModel.displayValue || this._options.readOnly);
         },

         _getState: function() {
            if (this._options.readOnly) {
               return '_readOnly';
            } else if (this._active) {
               return '_active';
            } else {
               return '';
            }
         }
      });

      return Render;
   }
);
