/**
 * Created by kraynovdo on 31.01.2018.
 */
import BaseControl = require('Core/Control');
import template = require('wml!Controls/_filterPopup/History/List');
import Utils = require('Types/util');
import {isEqual} from 'Types/object';
import {HistoryUtils} from 'Controls/filter';
import {factory} from 'Types/chain';
import {Constants} from 'Controls/history';
import {convertToFilterStructure, convertToSourceDataArray} from 'Controls/_filterPopup/converterFilterStructure';
import 'css!theme?Controls/filterPopup';

var MAX_NUMBER_ITEMS = 5;

   const FILTER_STATUS = {
      FOR_ME: 0,
      FOR_ALL: 1
   };

   var getPropValue = Utils.object.getPropertyValue.bind(Utils);

   var _private = {
      getSource: function(historyId) {
         return HistoryUtils.getHistorySource({ historyId: historyId });
      },

      getItemId: function(item) {
         let id;
         if (item.hasOwnProperty('id')) {
            id = getPropValue(item, 'id');
         } else {
            id = getPropValue(item, 'name');
         }
         return id;
      },

      getStringHistoryFromItems: function(items, resetValues) {
         var textArr = [];
         factory(items).each(function(elem) {
            var value = getPropValue(elem, 'value'),
               resetValue = resetValues[_private.getItemId(elem)],
               textValue = getPropValue(elem, 'textValue'),
               visibility = getPropValue(elem, 'visibility');

            if (!isEqual(value, resetValue) && (visibility === undefined || visibility) && textValue) {
               textArr.push(textValue);
            }
         });
         return textArr.join(', ');
      },

      mapByField: function(items: Array, field: string): object {
         const result = {};
         let value;

         factory(items).each((item) => {
            value = getPropValue(item, field);

            if (value !== undefined) {
               result[_private.getItemId(item)] = getPropValue(item, field);
            }
         });

         return result;
      },

      onResize: function(self) {
         if (self._options.orientation === 'vertical') {
            var arrowVisibility = self._arrowVisible;
            self._arrowVisible = self._options.items.getCount() > MAX_NUMBER_ITEMS;

            if (arrowVisibility !== self._arrowVisible) {
               self._isMaxHeight = true;
               self._forceUpdate();
            }
         }
      },

      removeRecord: function(self, item, needSave?) {
         let storage = self._historyStorage;
         if (item.get('data') && item.get('data').get('globalParams')) {
            storage = self._historyGlobalStorage;
         }
         let recordIndex = storage.getIndexByValue('id', item.get('id'));
         if (recordIndex !== -1) {
            storage.removeAt(recordIndex, needSave);
         }
      },

      minimizeHistoryItems: function(record) {
         let historyItems = [];
         factory(record.get('filterPanelItems')).each((item) => {
            delete item.caption;
            historyItems.push(item);
         });
         record.set('filterPanelItems', historyItems);
      },

      getEditDialogOptions: function(self, item, historyId, savedTextValue) {
         let favoriteItem = item.get('data');
         let items;
         if (favoriteItem) {
            items = item.get('data').get('filterPanelItems');
         } else {
            let history = _private.getSource(historyId).getDataObject(item.get('ObjectData'));
            items = history.items || history;
         }
         let captionsObject = _private.mapByField(self._options.filterItems, 'caption');
         items = factory(items).map((historyItem) => {
            historyItem.caption = captionsObject[historyItem.id];
            return historyItem;
         }).value();
         return {
            items: items,
            editedTextValue: savedTextValue || '',
            globalParams: item.get('data') && item.get('data').get('globalParams') ? FILTER_STATUS.FOR_ALL : FILTER_STATUS.FOR_ME,
            isFavorite: !!favoriteItem
         };
      },

      deleteFavorite: function(self) {
         _private.removeRecord(self, self._editItem);
         _private.updateFavoriteList(self._favoriteList, self._historyStorage, self._historyGlobalStorage, self._options.filterItems);
         self._children.stickyOpener.close();
         self._notify('historyChanged');
      },

      saveFavorite: function(self, record) {
         let editItemData = self._editItem.get('data');
         if (self._editItem.has('pinned')) {
            _private.getSource(self._options.historyId).update(self._editItem, {
               $_pinned: true
            });
         }

         _private.minimizeHistoryItems(record);

         if (!record.get('linkText')) {
            let linkText = _private.getStringHistoryFromItems(record.get('filterPanelItems'), {});
            record.set('linkText', linkText);
         }

         // TODO Remove after https://online.sbis.ru/opendoc.html?guid=68e3c08e-3064-422e-9d1a-93345171ac39
         // convert items to old structure
         const filterPanelItems = record.get('filterPanelItems');
         record.set('filter', convertToFilterStructure(filterPanelItems));
         record.set('viewFilter', _private.mapByField(filterPanelItems, 'value'));

         record.removeField('filterPanelItems');
         _private.removeRecord(self, self._editItem, record, editItemData && record.get('globalParams') !== editItemData.get('globalParams'));

         if (record.get('globalParams')) {
            self._historyGlobalStorage.prepend(record);
         } else {
            self._historyStorage.prepend(record);
         }
         _private.updateFavoriteList(self._favoriteList, self._historyStorage, self._historyGlobalStorage, self._options.filterItems);
         record.acceptChanges();
         self._notify('historyChanged');
      },

      updateFavoriteList: function(favoriteList, localStorage, globalStorage, filterItems) {
         favoriteList.assign(localStorage.getHistory());
         favoriteList.prepend(globalStorage.getHistory());
         _private.convertToItems(favoriteList, filterItems);
      },

      updateFavorite(self, item, text, target): void {
         const templateOptions = _private.getEditDialogOptions(self, item, self._options.historyId, text);
         const popupOptions = {
            opener: self,
            target,
            templateOptions,
            targetPoint: {
               vertical: 'bottom',
               horizontal: 'left'
            },
            direction: {
               horizontal: 'left'
            }
         };
         self._children.stickyOpener.open(popupOptions);
      },

      convertToItems: function(favoriteList, items) {
         factory(favoriteList).each((favoriteItem) => {
            favoriteItem.get('data').set('filterPanelItems', convertToSourceDataArray(favoriteItem.get('data').get('filter'),
                _private.mapByField(items, 'visibility')));
         });
      }
   };

   var HistoryList = BaseControl.extend({
      _template: template,
      _historySource: null,
      _isMaxHeight: true,
      _itemsText: null,
      _historyStorage: null,
      _historyGlobalStorage: null,
      _editItem: null,
      _historyCount: Constants.MAX_HISTORY,

      // old "favorite" allows to save 10 records. We should show only 7 records, other records are not displayed
      // TODO https://online.sbis.ru/opendoc.html?guid=68e3c08e-3064-422e-9d1a-93345171ac39
      _favoriteCount: Constants.MAX_HISTORY_REPORTS,

      _beforeMount: function(options) {
         if (options.items) {
            this._items = options.items.clone();
            this._itemsText = this._getText(options.items, options.filterItems, _private.getSource(options.historyId));
         }
         if (options.saveMode === 'favorite') {
             this._favoriteList = options.favoriteItems;
             this._historyStorage = options.historyStorage;
             this._historyGlobalStorage = options.historyGlobalStorage;
             _private.convertToItems(this._favoriteList, options.filterItems);
             this._historyCount = Constants.MAX_HISTORY_REPORTS - this._favoriteList.getCount();
         }
      },

      _beforeUpdate: function(newOptions) {
         if (!isEqual(this._options.items, newOptions.items)) {
            this._items = newOptions.items.clone();
            this._itemsText = this._getText(newOptions.items, newOptions.filterItems, _private.getSource(newOptions.historyId));
         }
         if (newOptions.saveMode === 'favorite') {
            this._historyCount = Constants.MAX_HISTORY_REPORTS - this._favoriteList.getCount();
         }
      },

      _onPinClick: function(event, item) {
           _private.getSource(this._options.historyId).update(item, {
               $_pinned: !item.get('pinned')
           });
           this._notify('historyChanged');
      },

      _onFavoriteClick: function(event, item, text) {
         this._editItem = item;
         _private.updateFavorite(this, item, text, event.target);
      },

      _editDialogResult: function(event, data) {
         if (data.action === 'save') {
            _private.saveFavorite(this, data.record);
         } else if (data.action === 'delete') {
            _private.deleteFavorite(this);
         }
      },

      _clickHandler: function(event, item, isFavorite) {
         let history;
         if (isFavorite) {
             history = item.get('data').get('filterPanelItems');
         } else {
             history = _private.getSource(this._options.historyId).getDataObject(item.get('ObjectData'));
         }
         this._notify('applyHistoryFilter', [history]);
      },

      _afterMount: function() {
         _private.onResize(this);
      },

      _afterUpdate: function() {
         _private.onResize(this);
      },

      _getText: function(items, filterItems, historySource) {
         const itemsText = {};
         // the resetValue is not stored in history, we take it from the current filter items
         const resetValues = _private.mapByField(filterItems, 'resetValue');

         factory(items).each((item, index) => {
            let text = '';
            const history = historySource.getDataObject(item.get('ObjectData'));

            if (history) {
               text = _private.getStringHistoryFromItems(history.items || history, resetValues);
            }
            itemsText[index] = text;
         });
         return itemsText;
      },

      _clickSeparatorHandler: function() {
         this._isMaxHeight = !this._isMaxHeight;
      }
   });

   HistoryList._private = _private;
   export = HistoryList;

