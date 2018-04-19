define('Controls/Filter/Button/Panel/Editor/Text', [
   'Core/Control',
   'tmpl!Controls/Filter/Button/Panel/Editor/Text/TextEditor'

], function(Control, template) {

   'use strict';

   var TextEditor = Control.extend({
      _template: template,

      _valueChangedHandler: function() {
         this._notify('valueChanged', [this._options.item.value]);
      }
   });

   return TextEditor;
});
