define('Controls/Selector/SelectedCollection',
   [
      'Core/Control',
      'wml!Controls/Selector/SelectedCollection/SelectedCollection',
      'wml!Controls/Selector/SelectedCollection/ItemTemplate',
      'WS.Data/Chain',
      'css!theme?Controls/Selector/SelectedCollection/SelectedCollection'
   ],

   function(Control, template, ItemTemplate, Chain) {
      'use strict';

      /**
       * Control, that display collection of items.
       *
       * @class Controls/Selector/SelectedCollection
       * @extends Core/Control
       * @mixes Controls/Selector/SelectedCollection/SelectedCollectionStyles
       * @control
       * @public
       * @author Капустин И.А.
       */

      var _private = {
         onResult: function(eventType, item) {
            if (eventType === 'crossClick') {
               this._notify('crossClick', [item]);
            } else if (eventType === 'itemClick') {
               this._notify('itemClick', [item]);
            }
         },

         getItemsInArray: function(items) {
            return Chain(items).value();
         },

         getVisibleItems: function(items, maxVisibleItems) {
            return maxVisibleItems ? items.slice(Math.max(items.length - maxVisibleItems, 0)) : items;
         }
      };

      var Collection = Control.extend({
         _template: template,
         _templateOptions: null,
         _items: [],

         _beforeMount: function(options) {
            this._onResult = _private.onResult.bind(this);
            this._items = _private.getItemsInArray(options.items);
            this._visibleItems = _private.getVisibleItems(this._items, options.maxVisibleItems);
         },

         _beforeUpdate: function(newOptions) {
            this._items = _private.getItemsInArray(newOptions.items);
            this._visibleItems = _private.getVisibleItems(this._items, newOptions.maxVisibleItems);
            this._templateOptions.items = newOptions.items;
         },

         _afterUpdate: function() {
            if (this._templateOptions.width !== this._container.offsetWidth) {
               this._templateOptions.width = this._container.offsetWidth;
            }
         },

         _afterMount: function() {
            this._templateOptions = {
               items: this._options.items,
               readOnly: this._options.readOnly,
               displayProperty: this._options.displayProperty,
               width: this._container && this._container.offsetWidth,
               clickCallback: this._onResult.bind(this)
            };
            this._forceUpdate();
         },

         _onResult: function(event, item) {
            if (event === 'itemClick') {
               this._itemClick(event, item);
            } else if (event === 'crossClick') {
               this._crossClick(event, item);
            }
         },

         _itemClick: function(event, item) {
            this._notify('itemClick', [item]);
         },

         _crossClick: function(event, index) {
            this._notify('crossClick', [this._visibleItems[index]]);
         }
      });

      Collection.getDefaultOptions = function() {
         return {
            itemTemplate: ItemTemplate,
            itemsLayout: 'default'
         };
      };

      return Collection;
   });
