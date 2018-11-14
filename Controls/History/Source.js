/**
 * Created by am.gerasimov on 21.03.2018.
 */
define('Controls/History/Source', [
   'Core/core-extend',
   'WS.Data/Entity/OptionsMixin',
   'WS.Data/Source/ISource',
   'Core/ParallelDeferred',
   'Core/Deferred',
   'WS.Data/Collection/RecordSet',
   'Controls/History/Constants',
   'WS.Data/Entity/Model',
   'WS.Data/Source/DataSet',
   'WS.Data/Chain',
   'WS.Data/Collection/Factory/RecordSet'
], function(CoreExtend,
   OptionsMixin,
   ISource,
   ParallelDeferred,
   Deferred,
   RecordSet,
   Constants,
   Model,
   DataSet,
   Chain,
   recordSetFactory) {
   /**
    * Source
    * Proxy source adding history data to the original source
    * @class Controls/History/Source
    * @extends WS.Data/Entity/Abstract
    * @mixes WS.Data/Entity/OptionsMixin
    * @control
    * @public
    * @author Герасимов А.М.
    * @category Menu
    * @example
    *  <pre>
    *    var source = new historySource({
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
    * @name Controls/MenuButton#originSource
    * @cfg {Source} A data source
    *
    * @name Controls/MenuButton#historySource
    * @cfg {Source} A source which work with history
    * @see {Controls/History/Service} Source working with the service of InputHistory
    */

   'use strict';

   var historyMetaFields = ['$_favorite', '$_pinned', '$_history', '$_addFromData'];

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

      initHistory: function(self, data, sourceItems) {
         if (data.getRow) {
            var rows = this.prepareHistoryBySourceItems(self, data.getRow(), sourceItems);
            var pinned = rows.get('pinned');
            var recent = rows.get('recent');
            var frequent = rows.get('frequent');

            self._history = {
               pinned: pinned,
               frequent: frequent,
               recent: recent
            };
         } else {
            self._history = data;
         }
      },

      /* После изменения оригинального рекордсета, в истории могут остаться записи,
         которых уже нет в рекордсете, поэтому их надо удалить из истории */
      prepareHistoryBySourceItems: function(self, history, sourceItems) {
         history.each(function(field, historyItems) {
            var toDelete = [];

            historyItems.each(function(rec) {
               if (!sourceItems.getRecordById(rec.getId())) {
                  toDelete.push(rec);
               }
            });

            toDelete.forEach(function(rec) {
               historyItems.remove(rec);
            });
         });

         return history;
      },

      getFilterHistory: function(self, rawHistoryData) {
         var pinned = this.getPinnedIds(rawHistoryData);
         var countAll = pinned.length;
         var filteredFrequent = this.filterFrequent(self, rawHistoryData, countAll);
         var filteredRecent = this.filterRecent(self, rawHistoryData, countAll, filteredFrequent);

         return {
            pinned: pinned,
            frequent: filteredFrequent,
            recent: filteredRecent
         };
      },

      getPinnedIds: function(rawHistoryData) {
         var pinnedIds = [];

         rawHistoryData.pinned.forEach(function(element) {
            pinnedIds.push(element.getId());
         });

         return pinnedIds;
      },

      filterFrequent: function(self, rawHistoryData, countAll) {
         var filteredFrequent = [];

         // рассчитываем количество популярных пунктов
         var frequentLength = (Constants.MAX_HISTORY - rawHistoryData.pinned.getCount() - (self.countRecent > Constants.MIN_RECENT ? self.countRecent : Constants.MIN_RECENT));
         var countFrequent = 0;
         var item;

         rawHistoryData.frequent.forEach(function(element) {
            var id = element.getId();
            item = self._oldItems.getRecordById(id);
            if (countAll < Constants.MAX_HISTORY && countFrequent < frequentLength && !rawHistoryData.pinned.getRecordById(id) && !item.get(self._nodeProperty)) {
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
         var item, id;

         rawHistoryData.recent.forEach(function(element) {
            id = element.getId();
            item = self._oldItems.getRecordById(id);
            if (countAll < Constants.MAX_HISTORY && !rawHistoryData.pinned.getRecordById(id) && filteredFrequent.indexOf(id) === -1 && countRecent < maxCountRecent && !item.get(self._nodeProperty)) {
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
            idProperty: oldItems.getIdProperty(),
            format: oldItems.getFormat().clone()
         });
         var filteredHistory, historyIds;

         filteredHistory = this.getFilterHistory(self, self._history);
         historyIds = filteredHistory.pinned.concat(filteredHistory.frequent.concat(filteredHistory.recent));

         this.addProperty(this, items, 'pinned', 'boolean', false);
         this.addProperty(this, items, 'recent', 'boolean', false);
         this.addProperty(this, items, 'frequent', 'boolean', false);
         this.addProperty(this, items, 'HistoryId', 'string', self.historySource.getHistoryId() || '');

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
         var item, oldItem, historyId, historyItem;

         history[historyType].forEach(function(id) {
            oldItem = oldItems.getRecordById(id);
            historyItem = self._history[historyType].getRecordById(id);
            historyId = historyItem.get('HistoryId');

            item = new Model({
               rawData: oldItem.getRawData(),
               adapter: items.getAdapter(),
               format: items.getFormat()
            });
            if (self._parentProperty) {
               item.set(self._parentProperty, null);
            }

            //removing group allows items to be shown in history items
            if (historyType === 'pinned') {
               item.set('pinned', true);
               item.has('group') && item.set('group', null);
            }
            if (historyType === 'recent') {
               item.set('recent', true);
               item.has('group') && item.set('group', null);
            }
            if (historyType === 'frequent') {
               item.set('frequent', true);
               item.has('group') && item.set('group', null);
            }
            item.set('HistoryId', historyId);
            items.add(item);
         });
      },

      fillFrequentItems: function(self, history, oldItems, items) {
         var config = {
            adapter: items.getAdapter(),
            idProperty: items.getIdProperty(),
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

      updatePinned: function(self, item, meta) {
         var pinned = self._history.pinned;
         if (item.get('pinned')) {
            item.set('pinned', false);
            pinned.remove(pinned.getRecordById(item.getId()));
         } else {
            if (_private.checkPinnedAmount(pinned)) {
               item.set('pinned', true);
               pinned.add(this.getRawHistoryItem(self, item.getId()));
            } else {
               return false;
            }
         }
         self.historySource.saveHistory(self._history);
         return _private.getSourceByMeta(self, meta).update(item, meta);
      },

      updateRecent: function(self, item, meta) {
         var id = item.getId();
         var recent = self._history.recent;
         var hItem = recent.getRecordById(id);
         var records;

         if (!(self._nodeProperty && item.get(self._nodeProperty))) {
            if (hItem) {
               recent.remove(hItem);
            }
            records = new RecordSet({
               items: [this.getRawHistoryItem(self, item.getId(), item.get('HistoryId') || self.historySource.getHistoryId())]
            });
            recent.prepend(records);
            self.historySource.saveHistory(self._history);
         }
         return _private.getSourceByMeta(self, meta).update(item, meta);
      },

      getRawHistoryItem: function(self, id, hId) {
         return new Model({
            rawData: {
               d: [id, hId],
               s: [
                  {n: 'ObjectId', t: 'Строка'},
                  {n: 'HistoryId', t: 'Строка'}
               ]
            },
            adapter: self._history.recent.getAdapter()
         });
      },

      checkPinnedAmount: function(pinned) {
         return pinned.getCount() !== Constants.MAX_HISTORY;
      }
   };

   var Source = CoreExtend.extend([ISource, OptionsMixin], {
      _history: null,
      _oldItems: null,
      _parentProperty: null,
      _nodeProperty: null,
      _displayProperty: null,
      _parents: null,
      _serialize: false,

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
         var self = this;
         if (meta.hasOwnProperty('$_pinned')) {
            return Deferred.success(_private.updatePinned(self, data, meta));
         }
         if (meta.hasOwnProperty('$_history')) {
            return Deferred.success(_private.updateRecent(self, data, meta));
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
               self._oldItems = data[1].getAll();
               _private.initHistory(self, data[0], self._oldItems);
               newItems = _private.getItemsWithHistory(self, self._history, self._oldItems);
               self.historySource.saveHistory(self.historySource.getHistoryId(), self._history);
               return new DataSet({
                  rawData: newItems.getRawData(),
                  idProperty: newItems.getIdProperty(),
                  adapter: newItems.getAdapter()
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
