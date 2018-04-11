define('Controls/Filter/Panel/Editor/Keys', [
   'Core/Control',
   'tmpl!Controls/Filter/Panel/Editor/Keys/KeysEditor'

   // 'css!Controls/Filter/Panel/Panel'
], function(Control, template) {

   'use strict';

   var KeysEditor = Control.extend({
      _template: template,

      constructor: function(cfg) {
         KeysEditor.superclass.constructor.apply(this, arguments);
      },

      _beforeMount: function(options) {
         this._item = options.item;
      }
   });

   return KeysEditor;

});
