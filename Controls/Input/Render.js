define('Controls/Input/Render',
   [
      'Core/Control',
      'WS.Data/Type/descriptor',
      'Controls/Utils/tmplNotify',

      'wml!Controls/Input/Render/Render',
      'css!theme?Controls/Input/Render/Render'
   ],
   function(Control, descriptor, tmplNotify, template) {
      'use strict';

      var Render = Control.extend({
         _template: template,

         _notifyHandler: tmplNotify,

         _getState: function() {
            if (this._options.readOnly) {
               return '_readOnly';
            } if (this._active) {
               return '_active';
            }

            return '';
         }
      });

      Render.getDefaultTypes = function() {
         return {
            content: descriptor(Function).required(),
            afterFieldWrapper: descriptor(Function),
            beforeFieldWrapper: descriptor(Function),
            multiline: descriptor(Boolean),
            size: descriptor(String).oneOf([
               's',
               'm',
               'l'
            ]).required(),
            fontStyle: descriptor(String).oneOf([
               'default',
               'primary',
               'secondary'
            ]).required(),
            textAlign: descriptor(String).oneOf([
               'left',
               'right'
            ]).required(),
            style: descriptor(String).oneOf([
               'info',
               'danger',
               'invalid',
               'primary',
               'success',
               'warning'
            ]).required(),
            tagStyle: descriptor(String).oneOf([
               'info',
               'danger',
               'primary',
               'success',
               'warning',
               'secondary'
            ])
         };
      };

      return Render;
   });
