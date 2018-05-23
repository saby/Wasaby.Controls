/**
 * Created by am.gerasimov on 21.03.2018.
 */
define('Controls/History/Source', [
   'WS.Data/Entity/Abstract',
   'WS.Data/Entity/OptionsMixin',
   'WS.Data/Source/ISource',
   'Core/ParallelDeferred',
   'WS.Data/Collection/RecordSet',
   'Controls/History/Constants',
   'WS.Data/Entity/Model',
   'WS.Data/Source/DataSet',
   'WS.Data/Chain',
   'WS.Data/Collection/Factory/RecordSet'
], function(Abstract,
   OptionsMixin,
   ISource,
   ParallelDeferred,
   RecordSet,
   Constants,
   Model,
   DataSet,
   Chain,
   recordSetFactory) {
   /**
    * Source
    * @class Controls/History/Source
    * @extends WS.Data/Entity/Abstract
    * @mixes WS.Data/Entity/OptionsMixin
    * @control
    * @public
    * @category Menu
    @example
    *  <pre>
    *    var solarSystem = new historySource({
     *           originSource: new Memory({
     *               idProperty: 'id',
     *               data: items
     *           }),
     *           historySource: new historyService({
     *               historyId: 'TEST_HISTORY_ID'
     *           }),
     *           parentProperty: 'parent'
     *       });
    * </pre>
    */

   'use strict';

   var historyMetaFields = ['$_favorite', '$_pinned', '$_history'];

   var _private = {
      getSourceByMeta: function(self, meta) {
         for (var i in meta) {
            if (meta.hasOwnProperty(i)) {
               if (historyMetaFields.indexOf(i) !== -1) {
                  return self.historySource;
               }
            }
         }
         return self.originSource;
      },

      initHistory: function(self, dataSet) {
         var rows = dataSet.getRow();
         var pinned = rows.get('pinned');
         var recent = rows.get('recent');
         var frequent = rows.get('frequent');

         self._history = {
            pinned: pinned || [],
            frequent: frequent || [],
            recent: recent || []
         };
      },

      getFilterHistory: function(self, rawHistoryData) {
         var pinned = rawHistoryData.pinned;
         var countAll = pinned.length;
         var filteredFrequent = this.filterFrequent(self, rawHistoryData, countAll);
         var filteredRecent = this.filterRecent(self, rawHistoryData, countAll, filteredFrequent);

         return {
            pinned: pinned,
            frequent: filteredFrequent,
            recent: filteredRecent
         };
      },

      filterFrequent: function(self, rawHistoryData, countAll) {
         var filteredFrequent = [];

         // рассчитываем количество популярных пунктов
         var frequentLength = (Constants.MAX_HISTORY - rawHistoryData.pinned.length - (self.countRecent > Constants.MIN_RECENT ? self.countRecent : Constants.MIN_RECENT));
         var countFrequent = 0;
         var item;

         rawHistoryData.frequent.forEach(function(id) {
            item = self._oldItems.getRecordById(id);
            if (countAll < Constants.MAX_HISTORY && countFrequent < frequentLength && rawHistoryData.pinned.indexOf(id) === -1 && !item.get(self._nodeProperty)) {
               filteredFrequent.push(id);
               countFrequent++;
               countAll++;
            }
         });
         return filteredFrequent;
      },

      filterRecent: function(self, rawHistoryData, countAll, filteredFrequent) {
         var filteredRecent = [];
         var countRecent = 0;
         var maxCountRecent = (self.countRecent > Constants.MIN_RECENT ? self.countRecent : Constants.MIN_RECENT);
         var item;

         rawHistoryData.recent.forEach(function(id) {
            item = self._oldItems.getRecordById(id);
            if (countAll < Constants.MAX_HISTORY && rawHistoryData.pinned.indexOf(id) === -1 && filteredFrequent.indexOf(id) === -1 && countRecent < maxCountRecent && !item.get(self._nodeProperty)) {
               filteredRecent.push(id);
               countRecent++;
               countAll++;
            }
         });
         return filteredRecent;
      },

      getItemsWithHistory: function(self, history, oldItems) {
         var items = new RecordSet({
            adapter: oldItems.getAdapter(),
            keyProperty: oldItems.keyProperty,
            format: oldItems.getFormat().clone()
         });
         var filteredHistory, historyIds;

         filteredHistory = this.getFilterHistory(self, self._history);
         historyIds = filteredHistory.pinned.concat(filteredHistory.frequent.concat(filteredHistory.recent));

         this.addProperty(this, items, 'pinned', 'boolean', false);

         this.fillItems(self, filteredHistory, 'pinned', oldItems, items);
         this.fillFrequentItems(self, filteredHistory, oldItems, items);
         this.fillItems(self, filteredHistory, 'recent', oldItems, items);

         oldItems.forEach(function(item) {
            var id = item.getId();
            var historyItem = historyIds.indexOf(id);
            var newItem;

            if (historyItem === -1 || item.get(self._parentProperty)) {
               newItem = new Model({
                  rawData: item.getRawData(),
                  adapter: items.getAdapter(),
                  format: items.getFormat()
               });
               if (filteredHistory.pinned.indexOf(id) !== -1) {
                  newItem.set('pinned', true);
               }
               items.add(newItem);
            }
         });

         return items;
      },

      fillItems: function(self, history, historyType, oldItems, items) {
         var item, oldItem;

         history[historyType].forEach(function(id) {
            oldItem = oldItems.getRecordById(id);
            item = new Model({
               rawData: oldItem.getRawData(),
               adapter: items.getAdapter(),
               format: items.getFormat()
            });
            if (self._parentProperty) {
               item.set(self._parentProperty, null);
            }
            if (historyType === 'pinned') {
               item.set('pinned', true);
            }
            items.add(item);
         });
      },

      fillFrequentItems: function(self, history, oldItems, items) {
         var config = {
            adapter: items.getAdapter(),
            keyProperty: items.keyProperty,
            format: items.getFormat()
         };
         var frequentItems = new RecordSet(config);
         var displayProperty = self._displayProperty || 'title';
         var firstName, secondName;

         this.fillItems(self, history, 'frequent', oldItems, frequentItems);

         // alphabet sorting
         frequentItems = Chain(frequentItems).sort(function(first, second) {
            firstName = first.get(displayProperty);
            secondName = second.get(displayProperty);

            return (firstName < secondName) ? -1 : (firstName > secondName) ? 1 : 0;
         }).value(recordSetFactory, config);

         items.append(frequentItems);
      },

      addProperty: function(self, record, name, type, defaultValue) {
         if (record.getFormat().getFieldIndex(name) === -1) {
            record.addField({
               name: name,
               type: type,
               defaultValue: defaultValue
            });
         }
      },
      updatePinned: function(self, item) {
         var id = item.getId();
         var pinned = self._history.pinned;
         if (item.get('pinned')) {
            item.set('pinned', false);
            pinned.splice(pinned.indexOf(id), 1);
         } else {
            item.set('pinned', true);
            self._history.pinned.push(id);
         }
      },
      updateRecent: function(self, item) {
         var id = item.getId();
         var index = self._history.recent.indexOf(id);

         if (!item.get(self._nodeProperty)) {
            if (index !== -1) {
               self._history.recent.splice(index, 1);
            }
            self._history.recent.unshift(id);
         }
      }
   };

   var Source = Abstract.extend([ISource, OptionsMixin], {
      _history: null,
      _oldItems: null,
      _parentProperty: null,
      _nodeProperty: null,
      _displayProperty: null,
      _parents: null,

      constructor: function Memory(cfg) {
         this.originSource = cfg.originSource;
         this.historySource = cfg.historySource;
         this._parentProperty = cfg.parentProperty;
         this._nodeProperty = cfg.nodeProperty;
         this._displayProperty = cfg.displayProperty;
      },

      create: function(meta) {
         return _private.getSourceByMeta(this, meta).create(meta);
      },

      read: function(key, meta) {
         return _private.getSourceByMeta(this, meta).read(key, meta);
      },

      update: function(data, meta) {
         if (meta.hasOwnProperty('$_pinned')) {
            _private.updatePinned(this, data);
         }
         if (meta.hasOwnProperty('$_history')) {
            _private.updateRecent(this, data);
         }
         return _private.getSourceByMeta(this, meta).update(data, meta);
      },

      destroy: function(keys, meta) {
         return _private.getSourceByMeta(this, meta).destroy(keys, meta);
      },

      query: function(query) {
         var self = this;
         var pd = new ParallelDeferred();
         var where = query.getWhere();
         var newItems;

         if (where && where['$_history'] === true) {
            delete query._where['$_history'];

            pd.push(self.historySource.query());
            pd.push(self.originSource.query(query));

            return pd.done().getResult().addCallback(function(data) {
               _private.initHistory(self, data[0]);
               self._oldItems = data[1].getAll();
               newItems = _private.getItemsWithHistory(self, self._history, self._oldItems);
               return new DataSet({
                  rawData: newItems.getRawData(),
                  keyProperty: newItems.keyProperty
               });
            });
         }
         return self.originSource.query(query);
      },

      getItems: function() {
         return _private.getItemsWithHistory(this, this._history, this._oldItems);
      }
   });

   Source._private = _private;

   return Source;
});
