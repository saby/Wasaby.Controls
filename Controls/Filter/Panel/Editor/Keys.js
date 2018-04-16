define('Controls/Filter/Panel/Editor/Keys', [
   'Core/Control',
   'tmpl!Controls/Filter/Panel/Editor/Keys/KeysEditor',
   'css!Controls/Filter/Panel/PropertyGrid/PropertyGrid'
], function(Control, template) {

   'use strict';

   var KeysEditor = Control.extend({
      _template: template,

      _beforeMount: function(options) {
         this._item = options.item;
      }
   });

   return KeysEditor;

});
