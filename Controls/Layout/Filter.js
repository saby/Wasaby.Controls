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
         
         getItemsFromSource: function(self, source, itemsField) {
            if (source) {
               return _private.getFilterSourceController(self, source).load().addCallback(function (result) {
                  self[itemsField] = result;
                  return result;
               });
            }
         },
         
         getHistoryItems: function(self, historyId) {
            //TODO сделать, как будет готов сервис истории
            if (historyId) {
               self._historyItems = [{
                  id: 'title', value: 'Sasha'
               }];
               return Deferred.success(self._historyItems);
            }
         },
         
         resolveItemsDeferred: function(self, historyDeferred, filterButtonDeferred, fastDataDeferred) {
            var waitItemsDef = new ParallelDeferred(),
                historyItems, filterButtonItems, fastFilterItems;
            
            if (historyDeferred) {
               waitItemsDef.push(historyDeferred);
            }
            
            if (filterButtonDeferred) {
               waitItemsDef.push(filterButtonDeferred);
            }
            
            if (fastDataDeferred) {
               waitItemsDef.push(fastDataDeferred);
            }
   
            return waitItemsDef.done().getResult().addCallback(function() {
               if (historyItems) {
                  if (filterButtonItems) {
                     _private.mergeFilterItems(filterButtonItems, historyItems);
                  }
                  
                  if (fastFilterItems) {
                     _private.mergeFilterItems(fastFilterItems, historyItems);
                  }
               }
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
            return _private.resolveItemsDeferred(
               this,
               _private.getHistoryItems(this, options.historyId),
               _private.getItemsFromSource(this, options.filterButtonSource, '_filterButtonItems'),
               _private.getItemsFromSource(this, options.fastFilterSource, '_fastFilterItems')
            );
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