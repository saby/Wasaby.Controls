define('Controls/Filter/Panel/PropertyGrid', [
   'Core/Control',
   'WS.Data/Chain',
   'tmpl!Controls/Filter/Panel/PropertyGrid/PropertyGrid',
   'Controls/Filter/Panel/Editor/Boolean',
   'Controls/Filter/Panel/Editor/Text',
   'Controls/Filter/Panel/Editor/Keys',
   'css!Controls/Filter/Panel/PropertyGrid/PropertyGrid'
], function(Control, Chain, template) {
   /**
    * Control PropertyGrid
    * Provides a user interface for browsing and editing the properties of an object.
    *
    * @class Controls/Filter/Panel/PropertyGrid
    * @extends Controls/Control
    * @control
    * @public
    * @author Золотова Э.Е.
    */

   'use strict';

   var PropertyGrid = Control.extend({
      _template: template,

      _beforeMount: function(options) {
         this.items = options.items;
      }
   });

   return PropertyGrid;

});
