define('Controls/Layout/Filter',
   [
      'Core/Control',
      'tmpl!Controls/Layout/Filter/Filter',
      'Controls/Layout/Filter/FilterContextField',
      'Core/Deferred',
      'WS.Data/Chain',
      'WS.Data/Utils',
      'Core/helpers/Object/isEqual'
   ],
   
   function(Control, template, FilterContextField, Deferred, Chain, Utils, isEqual) {
      
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
         resolveOptions: function(self, options) {
            self._filterButtonItems = Utils.clone(options.filterButtonItems);
            self._fastFilterItems = Utils.clone(options.fastFilterItems);
            self._historyId = options.historyId;
         },
         
         getHistoryItems: function(self) {
            //TODO сделать, как будет готов сервис истории
            if (self._historyId && !self._historyItems) {
               self._historyItems = [{id: 'title', value: 'Sasha'}];
            }
            return Deferred.success(self._historyItems);
         },
         
         getFilterByItems: function(filterButtonItems, fastFilterItems) {
            var filter = {};
            
            function processItems (items) {
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
         
         resolveItems: function(self, filterButtonItems, fastFilterItems) {
            return _private.getHistoryItems(self).addCallback(function(historyItems) {
               if (historyItems) {
                  if (filterButtonItems) {
                     _private.mergeFilterItems(filterButtonItems, historyItems);
                  }
                  
                  if (fastFilterItems) {
                     _private.mergeFilterItems(fastFilterItems, historyItems);
                  }
               }
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
      
      var Filter = Control.extend({
         
         _template: template,
         _historySource: null,
         _filter: null,
         _filterButtonItems: null,
         _fastFilterItems: null,
         
         constructor: function(options) {
            Filter.superclass.constructor.call(this, options);
            _private.resolveOptions(this, options);
         },
         
         _beforeMount: function(options) {
            var itemsDef = _private.resolveItems(this, this._filterButtonItems, this._fastFilterItems),
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
      
      return Filter;
   });