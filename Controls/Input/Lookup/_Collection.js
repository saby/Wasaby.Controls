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
            return self.sourceController.load().addCallback(function(result) {
               self._items = result;
               return result;
            });
         }
      };
      
      var Collection = Control.extend({
         _template: template,
         
         _beforeMount: function(options, context, receivedState) {
            if (receivedState) {
               this._items = receivedState;
            } else {
               return _private.loadItems(this, options.source);
            }
         },
         
         _beforeUpdate: function(newOptions) {
            var self = this;
            
            if (newOptions.source !== this._options.source) {
               _private.loadItems(this, newOptions.source).addCallback(function(result) {
                  self._forceUpdate();
                  return result;
               });
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
            itemTemplate: ItemTemplate,
            clickable: false
         };
      };
      
      return Collection;
   });
