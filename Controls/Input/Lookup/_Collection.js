define('Controls/Input/Lookup/_Collection',
   [
      'Core/Control',
      'tmpl!Controls/Input/Lookup/_Collection',
      'tmpl!Controls/Input/Lookup/ItemTemplate',
      'Controls/Controllers/SourceController',
      'css!Controls/Input/Lookup/_Collection'
   ],
   
   function(Control, template, ItemTemplate, SourceController) {
      
      'use strict';
      
      var _private = {
         loadItems: function(self, source) {
            if (!self.sourceController) {
               self.sourceController = new SourceController({
                  source: source
               });
            }
            self.sourceController.load().addCallback(function(result) {
               return _private.loadItemsCallback(self, result);
            });
         },
         
         loadItemsCallback: function(self, result) {
            self._items = result;
            if (self._mounted) {
               self._forceUpdate();
            }
            return result;
         }
      };
      
      var Collection = Control.extend({
         _template: template,
         
         _beforeMount: function(options, context, recivedState) {
            if (recivedState) {
               this._items = recivedState;
            } else {
               return _private.loadItems(this, options.source);
            }
         },
         
         _beforeUpdate: function(newOptions) {
            if (newOptions.source !== this._options.source) {
               _private.loadItems(this, newOptions.source);
            }
         },
         
         _itemClick: function(event, item) {
            this._notify('onItemClick', [item]);
         }
      });
      
      Collection.getDefaultOptions = function() {
         return {
            size: 'default',
            style: 'default',
            itemTemplate: ItemTemplate
         };
      };
      
      return Collection;
   });
