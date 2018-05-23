define('Controls/Container/Filter',
   [
      'Core/Control',
      'tmpl!Controls/Container/Filter/Filter',
      'Controls/Container/Filter/FilterContextField',
      'Core/Deferred',
      'WS.Data/Chain',
      'WS.Data/Utils',
      'Core/helpers/Object/isEqual'
   ],
   
   function(Control, template, FilterContextField, Deferred, Chain, Utils, isEqual) {
      
      'use strict';
      
      var getPropValue = Utils.getItemPropertyValue.bind(Utils);
      var setPropValue = Utils.setItemPropertyValue.bind(Utils);
      
      var _private = {
         getItemsByOption: function(option, history) {
            var result;
            
            if (option) {
               if (typeof option === 'function') {
                  result = option(history);
               } else if (history) {
                  _private.mergeFilterItems(option, history);
                  result = option;
               } else {
                  result = option;
               }
            }
            
            return result;
         },
         
         getHistoryItems: function(self, id) {
            //TODO сделать, как будет готов сервис истории
            var items;
            
            if (id) {
               items = [];
            }
            return Deferred.success(items);
         },
   
         getFilterByItems: function(filterButtonItems, fastFilterItems) {
            var filter = {};
            
            function processItems(items) {
               Chain(items).each(function(elem) {
                  var value = getPropValue(elem, 'value');
      
                  if (!isEqual(value, getPropValue(elem, 'resetValue'))) {
                     filter[getPropValue(elem, 'id')] = value;
                  }
               });
            }
            
            if (filterButtonItems) {
               processItems(filterButtonItems);
            }
            
            if (fastFilterItems) {
               processItems(fastFilterItems);
            }
            
            return filter;
         },
         
         resolveItems: function(self, historyId, filterButtonItems, fastFilterItems) {
            return _private.getHistoryItems(self, historyId).addCallback(function(historyItems) {
               self._filterButtonItems = _private.getItemsByOption(filterButtonItems, historyItems);
               self._fastFilterItems = _private.getItemsByOption(fastFilterItems, historyItems);
               return historyItems;
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
   
      /**
       * Container for content that can be filtered by Controls/Filter/Button or Controls/Filter/FastFilter.
       *
       * @class Controls/Container/Filter
       * @extends Core/Control
       * @control
       * @public
       */
   
      /**
       * @name Controls/Container/Filter#filterButtonSource
       * @cfg {Array|Function} FilterButton structure
       * @see Controls/Filter/Button#items
       */
   
      /**
       * @name Controls/Container/Filter#fastFilterSource
       * @cfg {Array|Function} FastFilter structure
       * @see Controls/Filter/FastFilter#items
       */
   
      /**
       * @name Controls/Container/Filter#historyId
       * @cfg {String} The identifier under which the filter history will be saved.
       */
      
      var Filter = Control.extend({
         
         _template: template,
         _historySource: null,
         _filter: null,
         _filterButtonItems: null,
         _fastFilterItems: null,
         
         _beforeMount: function(options) {
            var itemsDef = _private.resolveItems(this, options.historyId, options.filterButtonSource, options.fastFilterSource),
               self = this;
            
            itemsDef.addCallback(function() {
               self._filter = _private.getFilterByItems(self._filterButtonItems, self._fastFilterItems);
            });
            
            return itemsDef;
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
   
      Filter._private = _private;
      return Filter;
   });
