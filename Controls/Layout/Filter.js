define('Controls/Layout/Filter',
   [
      'Core/Control',
      'tmpl!Controls/Layout/Filter/Filter',
      'Controls/Layout/Filter/FilterContextField',
      'Controls/Controllers/SourceController',
      'Core/Deferred',
      'WS.Data/Chain',
      'WS.Data/Utils',
      'Core/ParallelDeferred',
      'Core/core-instance'
   ],
   
   function(Control, template, FilterContextField, SourceController, Deferred, Chain, Utils, ParallelDeferred, cInstance) {
      
      /**
       * @class Controls/Filter/FilterLayout
       * @extends Controls/Control
       * @control
       * @public
       */
      
      'use strict';
      
      var getPropValue = Utils.getItemPropertyValue.bind(Utils);
      var setPropValue = Utils.setItemPropertyValue.bind(Utils);
      
      var _private = {
         getFilterSourceController: function(self, source) {
            return new SourceController({
               source: source
            });
         },
         
         getFilterItemsFromSource: function(self, source) {
            return _private.getFilterSourceController(self, source).load();
         },
         
         getFilterItemsFromHistory: function() {
            return Deferred.success([{
              id: 'title', value: 'Sasha'
            }]);
         },
         
         resolveItemsDeferred: function(self, historyDeferred, filterButtonDeferred, fastDataDeferred) {
            var waitItemsDef = new ParallelDeferred(),
                historyItems, filterButtonItems, fastFilterItems;
            
            if (historyDeferred) {
               waitItemsDef.push(historyDeferred.addCallback(function(history) {
                  historyItems = history;
               }));
            }
            
            if (filterButtonDeferred) {
               waitItemsDef.push(filterButtonDeferred.addCallback(function(filterButton) {
                  filterButtonItems = filterButton;
               }));
            }
            
            if (fastDataDeferred) {
               waitItemsDef.push(fastDataDeferred.addCallback(function(fastFilter) {
                  fastFilterItems = fastFilter;
               }));
            }
   
            return waitItemsDef.done().getResult().addCallback(function() {
               if (historyItems) {
                  if (filterButtonItems) {
                     _private.mergeFilterItems(filterButtonItems, historyItems);
                     self._filterButtonItems = filterButtonItems;
                  }
                  
                  if (fastFilterItems) {
                     _private.mergeFilterItems(fastFilterItems, historyItems);
                     self._fastFilterItems = filterButtonItems;
                  }
               } else {
                  self._filterButtonItems = filterButtonItems;
                  self._fastFilterItems = filterButtonItems;
               }
               return self;
            });
         },
         
         mergeFilterItems: function(items, historyItems) {
            Chain(items).each(function(item) {
               Chain(historyItems).each(function(historyItem) {
                  if (getPropValue(item, 'id') === getPropValue(historyItem, 'id')) {
                     var value = getPropValue(historyItem, 'value');
                     var textValue = getPropValue(historyItem, 'textValue');
                     
                     if (value !== undefined) {
                        setPropValue(item, 'value', value);
                     }
                     
                     if (textValue !== undefined) {
                        setPropValue(item, 'textValue', textValue);
                     }
                  }
               });
            });
         }
      };
      
      return Control.extend({
         
         _template: template,
         _historySource: null,
         _filter: null,
         _filterButtonItems: null,
         _fastFilterItems: null,
         
         _beforeMount: function(options) {
            var filterButtonItems, fastFilterItems, historyDeferred;
            
            if (options.filterButtonSource) {
               filterButtonItems = _private.getFilterItemsFromSource(this, options.filterButtonSource);
            }
            
            if (options.fastFilterSource) {
               fastFilterItems = _private.getFilterItemsFromSource(this, options.fastFilterSource);
            }
            
            if (options.historyId) {
               historyDeferred = _private.getFilterItemsFromHistory(this, options.historyId);
            }
            
            return _private.resolveItemsDeferred(this, historyDeferred, filterButtonItems, fastFilterItems);
         },
         
         _changeFilterHandler: function(event, filter) {
            this._filter = filter;
         },
   
         _getChildContext: function() {
            return {
               filterLayoutField: new FilterContextField({
                  filter: this._filter,
                  filterButtonItems: this._filterButtonItems,
                  fastFilterItems: this._fastFilterItems
               })
            };
         }
         
      });
   });