define('Controls-demo/List/List/resources/EditableListPG/EditingConfigEditor', [
   'Core/Control',
   'wml!Controls-demo/List/List/resources/EditableListPG/EditingConfigEditor'
], function(
   Control,
   template
) {
   'use strict';

   var EditableConfigEditor = Control.extend({
      _template: template,
      _value: {},
      _beforeMount: function(cfg) {
         this._value.editOnClick = cfg.value.editOnClick;
         this._value.sequentialEditing = cfg.value.sequentialEditing;
         this._value.autoAdd = cfg.value.autoAdd;
         this._value.toolbarVisibility = cfg.value.toolbarVisibility;
      },
      _onValueChanged: function() {
         this._notify('valueChanged', [this._value]);
      }
   });
   return EditableConfigEditor;
});
