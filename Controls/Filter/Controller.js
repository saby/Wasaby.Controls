define('Controls/Filter/Controller',
   [
      'Core/Control',
      'tmpl!Controls/Filter/Controller',
      'Controls/Container/Filter/FilterContextField',
      'Core/Deferred',
      'WS.Data/Chain',
      'WS.Data/Utils',
      'Core/helpers/Object/isEqual',
      'Controls/History/FilterSource',
      'Controls/History/Service',
      'WS.Data/Source/Memory',
      'Controls/Controllers/SourceController',
      'Core/helpers/Object/isEmpty',
      'Core/core-merge',
      'Core/core-clone',
      'Controls/Container/Data/ContextOptions'
   ],
   
   function(Control, template, FilterContextField, Deferred, Chain, Utils, isEqual, HistorySource, HistoryService, Memory, SourceController, isEmptyObject, merge, clone) {
      
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
               self._historySource = new HistorySource({
                  originSource: new Memory({
                     idProperty: 'id',
                     data: []
                  }),
                  historySource: new HistoryService({
                     historyId: hId,
                     pinned: true,
                     dataLoaded: true
                  })
               });
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
         
         itemsIterator: function(filterButtonItems, fastDataItems, differentCallback, equalCallback) {
            function processItems(items) {
               Chain(items).each(function(elem) {
                  var value = getPropValue(elem, 'value');
                  var resetValue = getPropValue(elem, 'resetValue');
      
                  if (!isEqual(value, resetValue)) {
                     if (differentCallback) {
                        differentCallback(elem);
                     }
                  } else if (equalCallback) {
                     equalCallback(elem);
                  }
               });
            }
            
            if (filterButtonItems) {
               processItems(filterButtonItems);
            }
            
            if (fastDataItems) {
               processItems(fastDataItems);
            }
         },
         
         getFilterByItems: function(filterButtonItems, fastFilterItems) {
            var filter = {};
   
            function processItems(elem) {
               filter[getPropValue(elem, 'id')] = getPropValue(elem, 'value');
            }
            
            _private.itemsIterator(filterButtonItems, fastFilterItems, processItems);
            
            return filter;
         },
         
         getEmptyFilterKeys: function(filterButtonItems, fastFilterItems) {
            var removedKeys = [];
            
            function processItems(elem) {
               removedKeys.push(getPropValue(elem, 'id'));
            }
            
            _private.itemsIterator(filterButtonItems, fastFilterItems, null, processItems);
            
            return removedKeys;
         },
         
         setFilterItems: function(self, filterButtonOption, fastFilterOption, historyItems) {
            self._filterButtonItems = _private.getItemsByOption(filterButtonOption, historyItems);
            self._fastFilterItems = _private.getItemsByOption(fastFilterOption, historyItems);
         },
         
         updateFilterItems: function(self, newItems) {
            if (self._filterButtonItems) {
               self._filterButtonItems = _private.cloneItems(self._filterButtonItems);
               _private.mergeFilterItems(self._filterButtonItems, newItems);
            }
   
            if (self._fastFilterItems) {
               self._fastFilterItems = _private.cloneItems(self._fastFilterItems);
               _private.mergeFilterItems(self._fastFilterItems, newItems);
            }
         },
         
         resolveItems: function(self, historyId, filterButtonItems, fastFilterItems) {
            return _private.getHistoryItems(self, historyId).addCallback(function(historyItems) {
               _private.setFilterItems(self, filterButtonItems, fastFilterItems);
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
                     
                     if (textValue !== undefined && item.hasOwnProperty('textValue')) {
                        setPropValue(item, 'textValue', textValue);
                     }
                  }
               });
            });
         },
   
         applyItemsToFilter: function(self, filter, filterButtonItems, fastFilterItems) {
            var filterClone = clone(filter || {});
            var itemsFilter = _private.getFilterByItems(filterButtonItems, fastFilterItems);
            var emptyFilterKeys = _private.getEmptyFilterKeys(filterButtonItems, fastFilterItems);
   
            emptyFilterKeys.forEach(function(key) {
               delete filterClone[key];
            });
            
            merge(filterClone, itemsFilter);
            
            _private.setFilter(self, filterClone);
         },
         
         setFilter: function(self, filter) {
            self._filter = filter;
         },
         
         notifyFilterChanged: function(self) {
            self._notify('filterChanged', [self._filter]);
         },
   
         cloneItems: function(items) {
            if (items['[WS.Data/Entity/CloneableMixin]']) {
               return items.clone();
            } else {
               return clone(items);
            }
         },
      };
      
      /**
       * The filter controller allows you to filter data in a {@link Controls/List}using {@link Filter/Button} or {@link Filter/Fast}.
       * The filter controller allows you to save filter history and restore page after reload with last applied filter.
       *
       * More information you can read <a href='/doc/platform/developmentapl/interface-development/ws4/components/filter-search/'>here</a>.
       *
       * @class Controls/Filter/Controller
       * @extends Core/Control
       * @mixes Controls/interface/IFilter
       * @control
       * @public
       * @author Герасимов Александр
       */
   
      /**
       * @name Controls/Filter/Controller#filterButtonSource
       * @cfg {Array|Function|WS.Data/Collection/IList} FilterButton items or function, that return FilterButton items
       * @remark if the historyId option is setted, function will recive filter history
       * @see Controls/Filter/Button#items
       */
   
      /**
       * @name Controls/Filter/Controller#fastFilterSource
       * @cfg {Array|Function|WS.Data/Collection/IList} FastFilter items or function, that return FastFilter items
       * @remark if the historyId option is setted, function will recive filter history
       * @see Controls/Filter/Fast#items
       */
      
      /**
       * @name Controls/Filter/Controller#historyId
       * @cfg {String} The identifier under which the filter history will be saved.
       */

      /**
       * @name Controls/Filter/Container#filterMode
       * @cfg {String} Mode of forming a filter.
       * @variant onlyChanges - only changed fields
       * @variant full - all fields
       */

      var Container = Control.extend(/** @lends Controls/Filter/Container.prototype */{

         _template: template,
         _historySource: null,
         _filter: null,
         _filterButtonItems: null,
         _fastFilterItems: null,
   
         _beforeMount: function(options) {
            var itemsDef = _private.resolveItems(this, options.historyId, options.filterButtonSource, options.fastFilterSource),
               self = this;
            
            itemsDef.addCallback(function() {
               _private.applyItemsToFilter(self, options.filter, self._filterButtonItems, self._fastFilterItems);
            });
            
            return itemsDef;
         },
         
         _beforeUpdate: function(newOptions) {
            if (!isEqual(this._options.filter, newOptions.filter)) {
               _private.applyItemsToFilter(this, newOptions.filter, this._filterButtonItems, this._fastFilterItems);
            }
   
            if (this._options.filterButtonSource !== newOptions.filterButtonSource || this._options.fastFilterSource !== newOptions.fastFilterSource) {
               _private.setFilterItems(this, newOptions.filterButtonSource, newOptions.fastFilterSource);
            }
         },
         
         _itemsChanged: function(event, items) {
            var filter;
            var meta;
   
            _private.updateFilterItems(this, items);
            
            if (this._options.historyId) {
               filter = _private.getFilterByItems(this._filterButtonItems, this._fastFilterItems);
               meta = {
                  '$_addFromData': true
               };
               _private.getHistorySource(this).update(isEmptyObject(filter) ? filter : items, meta);
            }
            _private.applyItemsToFilter(this, this._options.filter, items);
            _private.notifyFilterChanged(this);
         },
   
         _filterChanged: function(event, filter) {
            _private.setFilter(this, filter);
            _private.notifyFilterChanged(this);
         },
         
         _getChildContext: function() {
            return {
               filterLayoutField: new FilterContextField({
                  filterButtonItems: this._filterButtonItems,
                  fastFilterItems: this._fastFilterItems,
                  historyId: this._options.historyId
               })
            };
         }
      });
   
      Container._private = _private;
      return Container;
   });
