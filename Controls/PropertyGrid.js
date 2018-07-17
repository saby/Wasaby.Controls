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
    * @extends Core/Control
    * @mixes Controls/interface/IPropertyGrid
    * @mixes Controls/interface/ISource
    * @control
    * @public
    * @author Золотова Э.Е.
    */

   'use strict';

   var PropertyGrid = Control.extend({
      _template: template,

      _valueChangedHandler: function(event, index, value) {
         this._options.items[index].value = value;
         this._notify('valueChanged', [value]);
      },

      _visibilityChangedHandler: function(event, index, visibility) {
         this._options.items[index].visibility = visibility;
         this._notify('visibilityChanged', [visibility]);
      },

      _textChangedHandler: function(event, index, text) {
         this._options.items[index].textValue = text;
      }
   });

   return PropertyGrid;

});
