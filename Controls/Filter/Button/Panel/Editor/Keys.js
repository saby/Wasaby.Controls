define('Controls/Filter/Button/Panel/Editor/Keys', [
   'Core/Control',
   'WS.Data/Utils',
   'tmpl!Controls/Filter/Button/Panel/Editor/Keys/KeysEditor',
   'css!Controls/Filter/Button/Panel/PropertyGrid/PropertyGrid'
], function(Control, Utils, template) {

   'use strict';

   var KeysEditor = Control.extend({
      _template: template,

      _keysChangedHandler: function() {
         this._notify('valueChanged', [this._options.item.value]);
      },

      _clickHandler: function() {
         Utils.setItemPropertyValue(this._options.item, 'visibility', false);
         this._notify('valueChanged');
      }
   });

   return KeysEditor;
});
