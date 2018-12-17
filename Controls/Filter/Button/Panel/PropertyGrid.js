define('Controls/Filter/Button/Panel/PropertyGrid', [
   'Core/Control',
   'wml!Controls/Filter/Button/Panel/PropertyGrid/PropertyGrid',
   'WS.Data/Utils',
   'css!theme?Controls/Filter/Button/Panel/PropertyGrid/PropertyGrid'
], function(Control, template, Utils) {

   /**
    * Control PropertyGrid
    * Provides a user interface for browsing and editing the properties of an object.
    *
    * @class Controls/Filter/Button/Panel/PropertyGrid
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

      _isItemVisible: function(item) {
         return Utils.getItemPropertyValue(item, 'visibility') === undefined ||
            Utils.getItemPropertyValue(item, 'visibility');
      },

      _valueChangedHandler: function(event, index, value) {
         this._options.items[index].value = value;
         this._notify('itemsChanged', [this._options.items]);
      },

      _textValueChangedHandler: function(event, index, textValue) {
         this._options.items[index].textValue = textValue;
         this._notify('itemsChanged', [this._options.items]);
      },

      _visibilityChangedHandler: function(event, index, visibility) {
         this._options.items[index].visibility = visibility;
         this._notify('itemsChanged', [this._options.items]);
      }
   });

   return PropertyGrid;

});
