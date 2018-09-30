define('Controls/SelectedCollection',
   [
      'Core/Control',
      'wml!Controls/SelectedCollection/SelectedCollection',
      'wml!Controls/SelectedCollection/ItemTemplate',
      'css!Controls/SelectedCollection/SelectedCollection'
   ],

   function(Control, template, ItemTemplate) {
      'use strict';

      var Collection = Control.extend({
         _template: template,

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
