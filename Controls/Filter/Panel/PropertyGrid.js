define('Controls/Filter/Panel/PropertyGrid', [
   'Core/Control',
   'WS.Data/Chain',
   'Core/helpers/Object/isEqual',
   'tmpl!Controls/Filter/Panel/PropertyGrid/PropertyGrid',
   'Controls/Filter/Panel/Editor/Boolean',
   'Controls/Filter/Panel/Editor/Text',
   'Controls/Filter/Panel/Editor/Keys',
   'css!Controls/Filter/Panel/PropertyGrid/PropertyGrid'
], function(Control, Chain, isEqual, template) {

   'use strict';

   var PropertyGrid = Control.extend({
      _template: template,

      _beforeMount: function(opts) {
         this.items = opts.items;
      }

   });

   return PropertyGrid;

});
