define('Controls/Input/Lookup/_Collection',
   [
      'Core/Control',
      'tmpl!Controls/Input/Lookup/_Collection',
      'tmpl!Controls/Input/Lookup/ItemTemplate',
      'tmpl!Controls/Input/Lookup/_ContentTemplate',
      'tmpl!Controls/Input/Lookup/_CrossTemplate',
      'css!?Controls/Input/Lookup/Collection'
   ],
   
   function(Control, template, ItemTemplate) {
      
      'use strict';
      
      var Collection = Control.extend({
         _template: template,
         
         _itemClick: function(event, item) {
            this._notify('itemClick', [item]);
         },
         
         _crossClick: function(event, item) {
            this._notify('crossClick', [item]);
         }
      });
      
      Collection.getDefaultOptions = function() {
         return {
            itemTemplate: ItemTemplate
         };
      };
      
      return Collection;
   });
