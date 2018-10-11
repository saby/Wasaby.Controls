define('Controls/Input/Lookup/_Collection',
   [
      'Core/Control',
      'wml!Controls/Input/Lookup/_Collection',
      'wml!Controls/Input/Lookup/ItemTemplate',
      'wml!Controls/Input/Lookup/_ContentTemplate',
      'wml!Controls/Input/Lookup/_CrossTemplate',
      'css!theme?Controls/Input/Lookup/Collection'
   ],
   
   function(Control, template, ItemTemplate) {
      
      'use strict';
      
      var Collection = Control.extend({
         _template: template,

         _itemClick: function(event, item) {
            this._notify('itemClick', [item]);
         },
         
         _crossClick: function(event, index) {
            this._notify('crossClick', [this._options.items.at(index)]);
         }
      });
      
      Collection.getDefaultOptions = function() {
         return {
            itemTemplate: ItemTemplate,
            itemsLayout: 'default',
            displayItemsIndex: 0
         };
      };
      
      return Collection;
   });
