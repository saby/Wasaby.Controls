define('Controls/Filter/Button/Panel/PropertyGrid', [
   'Core/Control',
   'tmpl!Controls/Filter/Button/Panel/PropertyGrid/PropertyGrid',
   'css!Controls/Filter/Button/Panel/PropertyGrid/PropertyGrid'
], function(Control, template) {

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
      _valueChangedHandler: function(event, value) {
         this._notify('valueChanged', [value]);
      }
   });

   return PropertyGrid;

});
