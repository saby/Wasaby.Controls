define('Controls/Filter/Button/Panel/Editor/Keys', [
   'Core/Control',
   'tmpl!Controls/Filter/Button/Panel/Editor/Keys/KeysEditor',
   'css!Controls/Filter/Button/Panel/PropertyGrid/PropertyGrid'
], function(Control, template) {

   'use strict';

   var KeysEditor = Control.extend({
      _template: template,

      _beforeUpdate: function() {
         this._notify('valueChanged', [this._options.item.value]);
      }
   });

   return KeysEditor;
});
