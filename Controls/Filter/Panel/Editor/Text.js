define('Controls/Filter/Panel/Editor/Text', [
   'Core/Control',
   'tmpl!Controls/Filter/Panel/Editor/Text/TextEditor'

   // 'css!Controls/Filter/Panel/Panel'
], function(Control, template) {

   'use strict';

   var TextEditor = Control.extend({
      _template: template,
      value: '123',

      constructor: function(cfg) {
         TextEditor.superclass.constructor.apply(this, arguments);
      },

      _beforeMount: function(options) {
         this._item = options.item;
      },

      _beforeUpdate: function(newOptions) {
         return newOptions.item;
      }
   });

   return TextEditor;

});
