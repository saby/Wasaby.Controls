define('Controls/PropertyGrid', [
   'Core/Control',
   'wml!Controls/PropertyGrid/PropertyGrid',
   'tmpl!Controls-demo/PropertyGrid/PropertyGridTemplate'
], function(Control, template, pgTemplate) {
   /**
    * Control PropertyGrid
    * Provides a user interface for browsing and editing the properties of an object.
    *
    * @class Controls/PropertyGrid
    * @extends Core/Control
    * @mixes Controls/interface/IPropertyGrid
    * @mixes Controls/interface/ISource
    * @mixes Controls/interface/IItemTemplate
    * @control
    * @public
    * @author Золотова Э.Е.
    *
    * @css @height_PropertyGrid-item Height of item in the block.
    * @css @spacing_PropertyGrid-between-items Spacing between items.
    */

   'use strict';

   var PropertyGrid = Control.extend({
      _template: template,
      _defaultTemplate: pgTemplate,
      _index: '',
      _valueChangedHandler: function(event, index) {
         this._notify('itemsChanged', [this._options.scopeObject[index]]);
      },
      _valueChanged: function(event, value) {
         this._notify('valueChanged', [value]);
      },
      _selectedKeyChanged: function(event, value) {
         this._notify('selectedKeyChanged', [value]);
      }
   });
   return PropertyGrid;
});
