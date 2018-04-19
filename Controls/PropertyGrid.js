define('Controls/PropertyGrid', [
   'Core/Control',
   'tmpl!Controls/PropertyGrid/PropertyGrid',
   'css!Controls/PropertyGrid/PropertyGrid'
], function(Control, template) {

   /**
    * Control PropertyGrid
    * Provides a user interface for browsing and editing the properties of an object.
    *
    * @class Controls/PropertyGrid
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
