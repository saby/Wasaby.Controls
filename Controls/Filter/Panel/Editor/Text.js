define('Controls/Filter/Panel/Editor/Text', [
   'Core/Control',
   'tmpl!Controls/Filter/Panel/Editor/Text/TextEditor'

], function(Control, template) {

   'use strict';

   var TextEditor = Control.extend({
      _template: template,

      _beforeMount: function(options) {
         this._item = options.item;
      }
   });

   return TextEditor;

});
