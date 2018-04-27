define('Controls/Filter/Button/Panel/Editor/Boolean', [
   'Core/Control',
   'WS.Data/Utils',
   'tmpl!Controls/Filter/Button/Panel/Editor/Boolean/BooleanEditor'

], function(Control, Utils, template) {

   'use strict';

   var BooleanEditor = Control.extend({
      _template: template,

      _valueChangedHandler: function(event, value, visibility) {
         if (visibility !== undefined) {
            Utils.setItemPropertyValue(this._options.item, 'visibility', visibility);
         }
         this._notify('valueChanged', [this._options.item.value]);
      }
   });

   return BooleanEditor;
});
