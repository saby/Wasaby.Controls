define('Controls/Filter/Controller',
   [
      'Core/Control',
      'wml!Controls/Filter/Controller',
      'Core/Deferred',
      'WS.Data/Chain',
      'WS.Data/Utils',
      'Core/helpers/Object/isEqual',
      'Controls/Filter/Button/History/resources/historyUtils',
      'Controls/Controllers/SourceController',
      'Core/core-merge',
      'Core/core-clone',
      'Controls/Container/Data/ContextOptions'
   ],

   function(Control, template, Deferred, Chain, Utils, isEqual, historyUtils, SourceController, merge, clone) {
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

         prepareItems: function(filterButtonItems, fastFilterItems, prepareCallback) {
            Chain(filterButtonItems).each(function(buttonItem, index) {
               Chain(fastFilterItems).each(function(fastItem) {
                  if (getPropValue(buttonItem, 'id') === getPropValue(fastItem, 'id') && fastItem.hasOwnProperty('textValue') && buttonItem.hasOwnProperty('textValue')) {
                     prepareCallback(index, fastItem);
                  }
               });
            });
         },

         prepareHistoryItems: function(filterButtonItems, fastFilterItems) {
            var historyItems = _private.cloneItems(filterButtonItems);
            function setTextValue(index, item) {
               setPropValue(historyItems[index], 'textValue', getPropValue(item, 'textValue'));
            }
            _private.prepareItems(filterButtonItems, fastFilterItems, setTextValue);
            return _private.minimizeFilterItems(historyItems);
         },

         minimizeFilterItems: function(items) {
            var minItems = [];
            Chain(items).each(function(item) {
               minItems.push({
                  id: getPropValue(item, 'id'),
                  value: getPropValue(item, 'value'),
                  textValue: getPropValue(item, 'textValue'),
                  visibility: getPropValue(item, 'visibility')
               });
            });
            return minItems;
         },

         getHistoryItems: function(self, id) {
            if (!id) {
               return Deferred.success([]);
            }
            var recent, lastFilter,
               source = historyUtils.getHistorySource(id);

            if (!self._sourceController) {
               self._sourceController = new SourceController({
                  source: source
               });
            }

            return self._sourceController.load({ $_history: true }).addCallback(function() {
               recent = historyUtils.getHistorySource(id).getRecent();
               if (recent.getCount()) {
                  lastFilter = recent.at(0);
                  return historyUtils.getHistorySource(id).getDataObject(lastFilter.get('ObjectData'));
               }
            });
         },

         itemsIterator: function(filterButtonItems, fastDataItems, differentCallback, equalCallback) {
            function processItems(items) {
               Chain(items).each(function(elem) {
                  var value = getPropValue(elem, 'value');
                  var visibility = getPropValue(elem, 'visibility');

                  if (value && (visibility === undefined || visibility === true)) {
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

         setFilterButtonItems: function(filterButtonItems, fastFilterItems) {
            function clearTextValue(index) {
               setPropValue(filterButtonItems[index], 'textValue', '');
            }
            _private.prepareItems(filterButtonItems, fastFilterItems, clearTextValue);
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

            if (self._filterButtonItems && self._fastFilterItems) {
               _private.setFilterButtonItems(self._filterButtonItems, self._fastFilterItems);
            }
         },

         resolveItems: function(self, historyId, filterButtonItems, fastFilterItems) {
            return _private.getHistoryItems(self, historyId).addCallback(function(historyItems) {
               _private.setFilterItems(self, filterButtonItems, fastFilterItems, historyItems);
               return historyItems;
            });
         },

         mergeFilterItems: function(items, historyItems) {
            Chain(items).each(function(item) {
               Chain(historyItems).each(function(historyItem) {
                  if (getPropValue(item, 'id') === getPropValue(historyItem, 'id')) {
                     var value = getPropValue(historyItem, 'value');
                     var textValue = getPropValue(historyItem, 'textValue');
                     var visibility = getPropValue(historyItem, 'visibility');

                     if (value !== undefined) {
                        setPropValue(item, 'value', value);
                     }

                     if (textValue !== undefined && item.hasOwnProperty('textValue')) {
                        setPropValue(item, 'textValue', textValue);
                     }

                     if (visibility !== undefined && item.hasOwnProperty('visibility')) {
                        setPropValue(item, 'visibility', visibility);
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
            }
            return clone(items);
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
       * @example
       * TMPL:
       * <pre>
       *    <Controls.Filter.Controller
       *       historyId="myHistoryId"
       *       filterButtonSource="{{_filterButtonData}}">
       *          ...
       *          <Controls.Filter.Button.Container>
       *             <Controls.Filter.Button />
       *          </Controls.Filter.Button.Container>
       *          ...
       *    </Controls.Filter.Controller>
       * </pre>
       * JS:
       * <pre>
       *    this._filterButtonData = function(fromHistoryItems) {
       *       var filterButtonItems = [{
       *           id: '1',
       *           resetValue: 'Yaroslavl'
       *       }];
       *
       *       if (fromHistoryItems) {
       *           filterButtonItems[0].value = fromHistoryItems[0].value + 'city'
       *       }
       *
       *       return filterButtonItems;
       *    }
       * </pre>
       * @see Controls/Filter/Button#items
       */

      /**
       * @name Controls/Filter/Controller#fastFilterSource
       * @cfg {Array|Function|WS.Data/Collection/IList} FastFilter items or function, that return FastFilter items
       * @remark if the historyId option is setted, function will recive filter history
       * @example
       * TMPL:
       * <pre>
       *    <Controls.Filter.Controller
       *       historyId="myHistoryId"
       *       fastFilterSource="{{_fastFilterSource}}">
       *       <Controls.Container.Data>
       *          ...
       *          <Controls.Filter.Fast.Container>
       *             <Controls.Filter.Fast />
       *          </Controls.Filter.Fast.Container>
       *          ...
       *       </Controls.Container.Data>
       *    </Controls.Filter.Controller>
       * </pre>
       * JS:
       * <pre>
       *    this._fastFilterSource = function(fromHistoryItems) {
       *        var fastFilterItems = [{
       *            id: '1',
       *            resetValue: 'Yaroslavl',
       *            properties: {
       *               keyProperty: 'title',
       *               displayProperty: 'title',
       *               source: new MemorySource({
       *                  idProperty: 'title',
       *                  data: [
       *                      { key: '1', title: 'Yaroslavl' },
       *                      { key: '2', title: 'Moscow' },
       *                      { key: '3', title: 'St-Petersburg' }
       *                  ]
       *               })
       *            }
       *        }];
       *        if (fromHistoryItems) {
       *          fastFilterItems[0].value = fromHistoryItems[0].value + 'city'
       *        }
       *    }
       * </pre>
       * @see Controls/Filter/Fast#items
       */

      /**
       * @name Controls/Filter/Controller#historyId
       * @cfg {String} The identifier under which the filter history will be saved.
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
            var meta;

            _private.updateFilterItems(this, items);

            if (this._options.historyId) {
               meta = {
                  '$_addFromData': true
               };
               historyUtils.getHistorySource(this._options.historyId).update(_private.prepareHistoryItems(this._filterButtonItems, this._fastFilterItems), meta);
            }

            _private.applyItemsToFilter(this, this._options.filter, items);
            _private.notifyFilterChanged(this);
         },

         _filterChanged: function(event, filter) {
            _private.setFilter(this, filter);
            _private.notifyFilterChanged(this);
         }

      });

      Container._private = _private;
      return Container;
   });
