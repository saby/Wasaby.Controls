define('Controls/Filter/Button/Panel/PropertyGrid', [
   'Core/Control',
   'wml!Controls/Filter/Button/Panel/PropertyGrid/PropertyGrid',
   'Types/util',
   'Core/helpers/Object/isEqual',
   'Core/core-clone',
   'Types/chain',
   'css!theme?Controls/Filter/Button/Panel/PropertyGrid/PropertyGrid'
], function(Control, template, Utils, isEqual, Clone, chain) {

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

   var _private = {
      cloneItems: function(items) {
         if (items['[Types/_entity/CloneableMixin]']) {
            return items.clone();
         }
         return Clone(items);
      },

      getIndexChangedVisibility: function(newItems, oldItems) {
         var result = -1;
         chain.factory(newItems).each(function(newItem, index) {
            // The items could change the order or quantity, so we find the same element by id
            var id = Utils.object.getPropertyValue(newItem, 'id'),
               visibility = Utils.object.getPropertyValue(newItem, 'visibility');

            if (visibility) {
               chain.factory(oldItems).each(function(oldItem) {
                  if (id === Utils.object.getPropertyValue(oldItem, 'id') &&
                     visibility !== Utils.object.getPropertyValue(oldItem, 'visibility')) {
                     result = index;
                  }
               });
            }
         });
         return result;
      }
   };

   var PropertyGrid = Control.extend({
      _template: template,

      _beforeMount: function(options) {
         this._items = _private.cloneItems(options.items);
      },

      _beforeUpdate: function(newOptions) {
         if (!isEqual(newOptions.items, this._items)) {
            this._changedIndex = _private.getIndexChangedVisibility(newOptions.items, this._items);
            this._items = _private.cloneItems(newOptions.items);
         }
      },

      _afterUpdate: function() {
         if (this._changedIndex !== -1) {
            this.activate();
         }
      },

      _isItemVisible: function(item) {
         return Utils.object.getPropertyValue(item, 'visibility') === undefined ||
            Utils.object.getPropertyValue(item, 'visibility');
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

   PropertyGrid._private = _private;

   return PropertyGrid;

});
