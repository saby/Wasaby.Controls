define('Controls/Filter/Button/Panel/Editor/Boolean', [
   'Core/Control',
   'tmpl!Controls/Filter/Button/Panel/Editor/Boolean/BooleanEditor'

], function(Control, template) {

   'use strict';

   var BooleanEditor = Control.extend({
      _template: template,

      _valueChangedHandler: function() {
         this._notify('valueChanged', [this._options.item.value]);
      }
   });

   return BooleanEditor;
});
