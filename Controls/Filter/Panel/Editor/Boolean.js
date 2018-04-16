define('Controls/Filter/Panel/Editor/Boolean', [
   'Core/Control',
   'tmpl!Controls/Filter/Panel/Editor/Boolean/BooleanEditor'

], function(Control, template) {

   'use strict';

   var BooleanEditor = Control.extend({
      _template: template,

      _beforeMount: function(options) {
         this._item = options.item;
      }

   });

   return BooleanEditor;

});
