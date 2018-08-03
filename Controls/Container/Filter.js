define('Controls/Container/Filter',
   [
      'Core/Control',
      'tmpl!Controls/Container/Filter/Filter',
      'Controls/Container/Filter/FilterContextField',
      'Core/Deferred',
      'WS.Data/Chain',
      'WS.Data/Utils',
      'Core/helpers/Object/isEqual',
      'Controls/Filter/Button/History/resources/historyUtils',
      'Controls/Controllers/SourceController',
      'Core/helpers/Object/isEmpty'
   ],
   
   function(Control, template, FilterContextField, Deferred, Chain, Utils, isEqual, historyUtils, SourceController, isEmptyObject) {
      
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

         getHistorySource: function(self, hId) {
            if (!self._historySource) {
               self._historySource = historyUtils.getHistorySource(hId);
            }
            return self._historySource;
         },
         
         getHistoryItems: function(self, id) {
            if (!id) {
               return Deferred.success([]);
            }
            var that = this;
            var recent, lastFilter;

            if (!self._sourceController) {
               self._sourceController = new SourceController({
                  source: this.getHistorySource(self, id)
               });
            }

            return self._sourceController.load({$_history: true}).addCallback(function() {
               recent = that.getHistorySource(self, id).getRecent();
               if (recent.getCount()) {
                  lastFilter = recent.at(0);
                  return that.getHistorySource(self, id).getDataObject(lastFilter.get('ObjectData'));
               }
            });
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

                     if (value !== undefined && value !== getPropValue(historyItem, 'resetValue')) {
                        setPropValue(item, 'value', value);
                     }

                     if (textValue !== undefined && item.hasOwnProperty('textValue')) {
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
       * <a href="/materials/demo-ws4-filter-container">Demo with Filter/Button and List component</a>.
       * <a href="/materials/demo-ws4-filter-search-new">Demo with Filter/Button, Input/Search and List component</a>.
       *
       * @class Controls/Container/Filter
       * @extends Core/Control
       * @author Герасимов Александр
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

         _itemsChanged: function(event, items) {
            var filter = _private.getFilterByItems(items);
            var meta;

            if (this._options.historyId) {
               meta = {
                  '$_addFromData': true
               };
               _private.getHistorySource(this).update(isEmptyObject(filter) ? filter : items, meta);
            }
            _private.resolveItems(this, this._options.historyId, this._options.filterButtonSource, this._options.fastFilterSource);
            this._filter = filter;
         },
   
         _getChildContext: function() {
            return {
               filterLayoutField: new FilterContextField({
                  filter: this._filter,
                  filterButtonItems: this._filterButtonItems,
                  fastFilterItems: this._fastFilterItems,
                  historyId: this._options.historyId
               })
            };
         }
      });
   
      Filter._private = _private;
      return Filter;
   });
