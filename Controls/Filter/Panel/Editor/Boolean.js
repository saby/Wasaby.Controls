define('Controls/Filter/Panel/Editor/Boolean', [
   'Core/Control',
   'tmpl!Controls/Filter/Panel/Editor/Boolean/BooleanEditor'

   // 'css!Controls/Filter/Panel/Panel'
], function(Control, template) {

   'use strict';

   var BooleanEditor = Control.extend({
      _template: template,

      _clickHandler: function() {
         this._item.value = !this._options.item.value;
      },

      _beforeMount: function(options) {
         this._item = options.item;
      }

   });

   return BooleanEditor;

});
