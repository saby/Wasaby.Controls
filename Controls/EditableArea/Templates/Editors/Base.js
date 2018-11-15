define('Controls/EditableArea/Templates/Editors/Base',
   [
      'Core/Control',
      'wml!Controls/EditableArea/Templates/Editors/Base/Base'
   ],
   function(Control, template) {
      'use strict';

      var Base = Control.extend({
         _template: template,

         _prepareValueForEditor: function(value) {
            return value;
         },

         _editorValueChangeHandler: function(event, value) {
            this._notify('valueChanged', [value]);
         }
      });

      return Base;
   }
);
