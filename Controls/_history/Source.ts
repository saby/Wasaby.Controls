/**
 * Created by am.gerasimov on 21.03.2018.
 */
import CoreExtend = require('Core/core-extend');
import ParallelDeferred = require('Core/ParallelDeferred');
import Deferred = require('Core/Deferred');
import collection = require('Types/collection');
import Constants = require('Controls/_history/Constants');
import entity = require('Types/entity');
import sourceLib = require('Types/source');
import chain = require('Types/chain');
import clone = require('Core/core-clone');

/**
 * Source
 * Proxy source adding history data to the original source
 * @class Controls/_history/Source
 * @extends Core/core-extend
 * @mixes Types/_entity/OptionsToPropertyMixin
 * @control
 * @public
 * @author Герасимов А.М.
 * @category Menu
 * @example
 * <pre>
 *    var source = new historySource({
 *        originSource: new Memory({
 *           idProperty: 'id',
 *           data: items
 *        }),
 *        historySource: new historyService({
 *           historyId: 'TEST_HISTORY_ID'
 *        }),
 *        parentProperty: 'parent'
 *    });
 * </pre>
 */

/**
 * @name Controls/_history/Source#originSource
 * @cfg {Source} A data source
 */

/**
 * @name Controls/_history/Source#historySource
 * @cfg {Source} A source which work with history
 * @see {Controls/_history/Service} Source working with the service of InputHistory
 */

var historyMetaFields = ['$_favorite', '$_pinned', '$_history', '$_addFromData'];

var _private = {
   getSourceByMeta: function (self, meta) {
      for (var i in meta) {
         if (meta.hasOwnProperty(i)) {
            if (historyMetaFields.indexOf(i) !== -1) {
               return self.historySource;
            }
         }
      }
      return self.originSource;
   },

   initHistory: function (self, data, sourceItems) {
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
         if (self._pinned instanceof Array) {
            self._pinned.forEach(function (pinId) {
               if (sourceItems.getRecordById(pinId)) {
                  self._history.pinned.add(_private.getRawHistoryItem(self, pinId, self.historySource.getHistoryId()));
               }
            });
         }
         self._recentCount = recent.getCount();
      } else {
         self._history = data;
      }
   },

   /* После изменения оригинального рекордсета, в истории могут остаться записи,
      которых уже нет в рекордсете, поэтому их надо удалить из истории */
   prepareHistoryBySourceItems: function (self, history, sourceItems) {
      history.each(function (field, historyItems) {
         var toDelete = [];

         historyItems.each(function (rec) {
            if (!sourceItems.getRecordById(rec.getId())) {
               toDelete.push(rec);
            }
         });

         toDelete.forEach(function (rec) {
            historyItems.remove(rec);
         });
      });

      return history;
   },

   getFilterHistory: function (self, rawHistoryData) {
      var pinnedIds = this.getPinnedIds(rawHistoryData.pinned);
      var frequentIds = this.getFrequentIds(self, rawHistoryData.frequent, rawHistoryData.pinned);
      var recentIds = this.getRecentIds(self, rawHistoryData.recent, rawHistoryData.frequent, rawHistoryData.pinned);

      return {
         pinned: pinnedIds,
         frequent: frequentIds,
         recent: recentIds
      };
   },

   getPinnedIds: function (pinned) {
      var pinnedIds = [];

      pinned.forEach(function (element) {
         pinnedIds.push(element.getId());
      });

      return pinnedIds;
   },

   getFrequentIds: function(self, frequent, pinned) {
      var frequentIds = [];

      // рассчитываем количество популярных пунктов
      var maxCountFrequent = (Constants.MAX_HISTORY - pinned.getCount() - (self._recentCount > Constants.MIN_RECENT ? self._recentCount : Constants.MIN_RECENT));
      var countFrequent = 0;
      var item;

      frequent.forEach(function(element) {
         var id = element.getId();
         item = self._oldItems.getRecordById(id);
         if (countFrequent < maxCountFrequent && !pinned.getRecordById(id) && !item.get(self._nodeProperty)) {
            frequentIds.push(id);
            countFrequent++;
         }
      });
      return frequentIds;
   },

   getRecentIds: function(self, recent, frequent, pinned) {
      var recentIds = [];
      var countRecent = 0;
      var maxCountRecent = Constants.MAX_HISTORY - (pinned.getCount() + frequent.getCount());
      var item, id;

      recent.forEach(function (element) {
         id = element.getId();
         item = self._oldItems.getRecordById(id);
         if (countRecent < maxCountRecent && !pinned.getRecordById(id) && !frequent.getRecordById(id) && !item.get(self._nodeProperty)) {
            recentIds.push(id);
            countRecent++;
         }
      });
      return recentIds;
   },

   getItemsWithHistory: function (self, history, oldItems) {
      var items = oldItems.clone();
      var filteredHistory, historyIds;
      filteredHistory = this.getFilterHistory(self, self._history);
      historyIds = filteredHistory.pinned.concat(filteredHistory.frequent.concat(filteredHistory.recent));

      // Нужно чтобы не потерялся формат https://online.sbis.ru/opendoc.html?guid=e76fca5b-3bda-401d-9eed-ead8f8a0d469
      items.getFormat();
      items.clear();
      this.addProperty(this, items, 'pinned', 'boolean', false);
      this.addProperty(this, items, 'recent', 'boolean', false);
      this.addProperty(this, items, 'frequent', 'boolean', false);
      this.addProperty(this, items, 'HistoryId', 'string', self.historySource.getHistoryId() || '');
      this.fillItems(self, filteredHistory, 'pinned', oldItems, items);
      this.fillFrequentItems(self, filteredHistory, oldItems, items);
      this.fillItems(self, filteredHistory, 'recent', oldItems, items);
      oldItems.forEach(function (item) {
         var id = item.getId();
         var historyItem = historyIds.indexOf(id);
         var newItem;
         if (historyItem === -1 || item.get(self._parentProperty)) {
            newItem = new entity.Model({
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

   fillItems: function (self, history, historyType, oldItems, items) {
      var item, oldItem, historyId, historyItem;

      history[historyType].forEach(function (id) {
         oldItem = oldItems.getRecordById(id);
         historyItem = self._history[historyType].getRecordById(id);
         historyId = historyItem.get('HistoryId');

         item = new entity.Model({
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

   fillFrequentItems: function (self, history, oldItems, items) {
      var config = {
         adapter: items.getAdapter(),
         idProperty: items.getIdProperty(),
         format: items.getFormat()
      };
      var frequentItems = new collection.RecordSet(config);
      var displayProperty = self._displayProperty || 'title';
      var firstName, secondName;

      this.fillItems(self, history, 'frequent', oldItems, frequentItems);

      // alphabet sorting
      frequentItems = chain.factory(frequentItems).sort(function (first, second) {
         firstName = first.get(displayProperty);
         secondName = second.get(displayProperty);

         return (firstName < secondName) ? -1 : (firstName > secondName) ? 1 : 0;
      }).value(collection.factory.recordSet, config);

      items.append(frequentItems);
   },

   addProperty: function (self, record, name, type, defaultValue) {
      if (record.getFormat().getFieldIndex(name) === -1) {
         record.addField({
            name: name,
            type: type,
            defaultValue: defaultValue
         });
      }
   },

   updatePinned: function (self, item, meta) {
      var pinned = self._history.pinned;
      var id;
      if (item.get('pinned')) {
         item.set('pinned', false);
         pinned.remove(pinned.getRecordById(item.getId()));
      } else {
         if (_private.checkPinnedAmount(pinned)) {
            id = item.getId();
            item.set('pinned', true);
            pinned.add(this.getRawHistoryItem(self, id, item.get('HistoryId') || id));
         } else {
            return false;
         }
      }
      self.historySource.saveHistory(self._history);
      return _private.getSourceByMeta(self, meta).update(item, meta);
   },

   resolveRecent: function (self, data) {
      var recent = self._history && self._history.recent;
      if (recent) {
         var items = [];
         chain.factory(data).each(function (item) {
            if (!(self._nodeProperty && item.get(self._nodeProperty))) {
               var hItem = recent.getRecordById(item.getId());
               if (hItem) {
                  recent.remove(hItem);
               }
               items.push(_private.getRawHistoryItem(self, item.getId(), item.get('HistoryId') || self.historySource.getHistoryId()));
            }
         });
         recent.prepend(items);
      }
   },

   updateRecent: function (self, data, meta) {
      var historyData;
      if (data instanceof Array) {
         historyData = {
            ids: []
         };
         chain.factory(data).each(function (item) {
            historyData.ids.push(item.getId());
         });
         _private.resolveRecent(self, data);
      } else {
         historyData = data;
         _private.resolveRecent(self, [data]);
      }

      self.historySource.saveHistory(self.historySource.getHistoryId(), self._history);
      return _private.getSourceByMeta(self, meta).update(historyData, meta);
   },

   getRawHistoryItem: function (self, id, hId) {
      return new entity.Model({
         rawData: {
            d: [id, hId],
            s: [{
                  n: 'ObjectId',
                  t: 'Строка'
               },
               {
                  n: 'HistoryId',
                  t: 'Строка'
               }
            ]
         },
         adapter: self._history.recent.getAdapter()
      });
   },

   checkPinnedAmount: function (pinned) {
      return pinned.getCount() !== Constants.MAX_HISTORY;
   }
};

var Source = CoreExtend.extend([sourceLib.ISource, entity.OptionsToPropertyMixin, entity.SerializableMixin], {

   //for compatibility with Types lib, will removed after rewriting module on typescript
   '[Types/_source/ICrud]': true,
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
      this._pinned = cfg.pinned;
   },

   create: function (meta) {
      return _private.getSourceByMeta(this, meta).create(meta);
   },

   read: function (key, meta) {
      return _private.getSourceByMeta(this, meta).read(key, meta);
   },

   update: function (data, meta) {
      var self = this;
      if (meta.hasOwnProperty('$_pinned')) {
         return Deferred.success(_private.updatePinned(self, data, meta));
      }
      if (meta.hasOwnProperty('$_history')) {
         return Deferred.success(_private.updateRecent(self, data, meta));
      }
      return _private.getSourceByMeta(this, meta).update(data, meta);
   },

   destroy: function (keys, meta) {
      return _private.getSourceByMeta(this, meta).destroy(keys, meta);
   },

   query: function (query) {
      var self = this;
      var pd = new ParallelDeferred({ stopOnFirstError: false });
      var where = query.getWhere();
      var newItems;

      // For Selector/Suggest load data from history, if there is a historyKeys
      if (where && (where['$_history'] === true || where['historyKeys'])) {
         delete query._where['$_history'];

         pd.push(self.historySource.query());

         if (where['historyKeys']) {
            where = clone(where);
            delete where['historyKeys'];
            query.where(where);
         }

         pd.push(self.originSource.query(query));

         return pd.done().getResult().addBoth(function (data) {
            self._oldItems = data[1].getAll();

            if (data[0] && !(data[0] instanceof Error)) {
               _private.initHistory(self, data[0], self._oldItems);
               newItems = _private.getItemsWithHistory(self, self._history, self._oldItems);
               self.historySource.saveHistory(self.historySource.getHistoryId(), self._history);
            } else {
               newItems = self._oldItems;
            }
            return new sourceLib.DataSet({
               rawData: newItems.getRawData(),
               idProperty: newItems.getIdProperty(),
               adapter: newItems.getAdapter()
            });
         });
      }
      return self.originSource.query(query);
   },

   getItems: function () {
      return _private.getItemsWithHistory(this, this._history, this._oldItems);
   },

   // <editor-fold desc="Types/_source/OptionsMixin">

   // Support options mixin
   // proxy getOptions, setOptions, addOptions methods to original source
   getOptions: function () {
      return this.originSource.getOptions();
   },

   setOptions: function (options) {
      return this.originSource.setOptions(options);
   },

   addOptions: function (options) {
      return this.originSource.addOptions(options);
   }

   // </editor-fold>
});

Source._private = _private;

export = Source;