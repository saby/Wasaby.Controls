define('Controls/SelectedCollection',
   [
      'Core/Control',
      'wml!Controls/SelectedCollection/SelectedCollection',
      'wml!Controls/SelectedCollection/ItemTemplate',
      'WS.Data/Chain',
      'css!Controls/SelectedCollection/SelectedCollection'
   ],

   function(Control, template, ItemTemplate, Chain) {
      'use strict';

      var _private = {
         onResult: function(eventType, item) {
            if (eventType === 'crossClick') {
               this._notify('crossClick', [item]);
            } else if (eventType === 'itemClick') {
               this._notify('itemClick', [item]);
            }
         },

         getVisibleItems: function(items, maxVisibleItems) {
            return maxVisibleItems ? Chain(items).last(maxVisibleItems).value() : items;
         }
      };

      var Collection = Control.extend({
         _template: template,

         _beforeMount: function(options) {
            this._onResult = _private.onResult.bind(this);
            this._visibleItems = _private.getVisibleItems(options.items, options.maxVisibleItems);
         },

         _beforeUpdate: function(newOptions) {
            if (this._options.items !== newOptions.items) {
               this._visibleItems = _private.getVisibleItems(newOptions.items, newOptions.maxVisibleItems);
            }
         },

         _showAllItems: function() {
            this._children.stickyOpener.open({
               templateOptions: {
                  items: this._options.items,
                  displayProperty: this._options.displayProperty,
                  width: this._container.offsetWidth
               },
               target: this._children.collection,
               template: 'Controls/SelectedCollection/allCollectionTemplate'
            });
         },

         _itemClick: function(event, item) {
            this._notify('itemClick', [item]);
         },

         _crossClick: function(event, index) {
            var
               items = this._options.items,
               currentItem = items.at ? items.at(index) : items[index];

            this._notify('crossClick', [currentItem]);
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
