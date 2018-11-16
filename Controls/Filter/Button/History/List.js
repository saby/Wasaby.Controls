/**
 * Created by kraynovdo on 31.01.2018.
 */
define('Controls/Filter/Button/History/List', [
   'Core/Control',
   'wml!Controls/Filter/Button/History/List',
   'WS.Data/Chain',
   'Core/helpers/Object/isEqual',
   'WS.Data/Utils',
   'Controls/Filter/Button/History/resources/historyUtils',
   'css!theme?Controls/Filter/Button/History/List'
], function(BaseControl, template, Chain, isEqual, Utils, historyUtils) {
   'use strict';

   var MAX_NUMBER_ITEMS = 5;

   var getPropValue = Utils.getItemPropertyValue.bind(Utils);

   var _private = {
      getStringHistoryFromItems: function(items) {
         var textArr = [];
         Chain(items).each(function(elem) {
            var value = getPropValue(elem, 'value'),
               resetValue = getPropValue(elem, 'resetValue'),
               textValue = getPropValue(elem, 'textValue'),
               visibility = getPropValue(elem, 'visibility');

            if (!isEqual(value, resetValue) && (visibility === undefined || visibility) && textValue) {
               textArr.push(textValue);
            }
         });
         return textArr.join(', ');
      },

      onResize: function(self) {
         self._arrowVisible = self._options.items.getCount() > MAX_NUMBER_ITEMS;

         if (!self._arrowVisible) {
            self._isMaxHeight = true;
         }
         self._forceUpdate();
      }
   };

   var HistoryList = BaseControl.extend({
      _template: template,
      _historySource: null,
      _isMaxHeight: true,
      _itemsText: null,

      _beforeMount: function(options) {
         if (options.items) {
            this._itemsText = this._getText(options.items, historyUtils.getHistorySource(options.historyId));
         }
      },

      _beforeUpdate: function(newOptions) {
         if (!isEqual(this._options.items, newOptions.items)) {
            this._itemsText = this._getText(newOptions.items, historyUtils.getHistorySource(newOptions.historyId));
         }
      },

      _onPinClick: function(event, item) {
         historyUtils.getHistorySource(this._options.historyId).update(item, {
            $_pinned: !item.get('pinned')
         });
         this._notify('historyChanged');
      },
      _contentClick: function(event, item) {
         var items = historyUtils.getHistorySource(this._options.historyId).getDataObject(item.get('ObjectData'));
         this._notify('applyHistoryFilter', [items]);
      },

      _afterMount: function() {
         _private.onResize(this);
      },

      _afterUpdate: function() {
         _private.onResize(this);
      },

      _getText: function(items, historySource) {
         var itemsText = {};
         Chain(items).each(function(item, index) {
            var text = '';
            var historyItems = historySource.getDataObject(item.get('ObjectData'));
            if (historyItems) {
               text = _private.getStringHistoryFromItems(historyItems);
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
   return HistoryList;
});
