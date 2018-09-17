/**
 * Created by kraynovdo on 31.01.2018.
 */
define('Controls/Filter/Button/History/List', [
   'Core/Control',
   'wml!Controls/Filter/Button/History/List',
   'WS.Data/Adapter/Sbis',
   'Controls/Controllers/SourceController',
   'WS.Data/Collection/RecordSet',
   'WS.Data/Chain',
   'WS.Data/Utils',
   'Controls/Filter/Button/History/resources/historyUtils',
   'css!?Controls/Filter/Button/History/List'
], function(BaseControl, template, SbisAdapter, SourceController, RecordSet, Chain, Utils, historyUtils) {
   'use strict';

   var MAX_NUMBER_ITEMS = 5;

   var getPropValue = Utils.getItemPropertyValue.bind(Utils);

   var _private = {
      loadItems: function(instance, source) {
         var filter = {
            '$_history': true
         };
         instance._sourceController = new SourceController({
            source: source
         });
         return instance._sourceController.load(filter).addCallback(function(items) {
            instance._listItems = new RecordSet({
               rawData: items.getRawData(),
               adapter: new SbisAdapter()
            });
            return items;
         });
      },

      getHistorySource: function(self, hId) {
         if (!self._historySource) {
            self._historySource = historyUtils.getHistorySource(hId);
         }
         return self._historySource;
      },

      getStringHistoryFromItems: function(items) {
         var text = [];
         Chain(items).each(function(elem) {
            var value = getPropValue(elem, 'value');

            if ((value !== getPropValue(elem, 'resetValue')) && (!elem.hasOwnProperty('visibility') || getPropValue(elem, 'visibility'))) {
               var textValue = getPropValue(elem, 'textValue');
               if (textValue) {
                  text.push(textValue);
               }
            }
         });
         return text.join(', ');
      },

      onResize: function(self) {
         self._arrowVisible = self._listItems.getCount() > MAX_NUMBER_ITEMS;

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

      _onPinClick: function(event, item) {
         _private.getHistorySource(this).update(item, {
            $_pinned: !item.get('pinned')
         });
         var self = this;
         return _private.loadItems(this, _private.getHistorySource(this, this._options.historyId)).addCallback(function() {
            self._forceUpdate();
         });
      },
      _contentClick: function(event, item) {
         var items = _private.getHistorySource(this).getDataObject(item.get('ObjectData'));
         this._notify('applyHistoryFilter', [items]);
      },

      _beforeMount: function(options) {
         if (options.historyId) {
            return _private.loadItems(this, _private.getHistorySource(this, options.historyId));
         }
      },
      _beforeUpdate: function(newOptions) {
         if (newOptions.historyId && newOptions.historyId !== this._options.historyId) {
            return _private.loadItems(this, _private.getHistorySource(this, newOptions.historyId));
         }
      },

      _afterMount: function() {
         _private.onResize(this);
      },

      _afterUpdate: function() {
         _private.onResize(this);
      },

      _getText: function(item) {
         var text = '';
         var items = JSON.parse(item.get('ObjectData'));
         if (items) {
            text = _private.getStringHistoryFromItems(items);
         }
         return text;
      },

      _clickSeparatorHandler: function() {
         this._isMaxHeight = !this._isMaxHeight;
      },

      destroy: function() {
         HistoryList.superclass.destroy.apply(this, arguments);
         _private.getHistorySource(this).destroy({}, {
            '$_history': true
         });
      }
   });

   HistoryList._private = _private;
   return HistoryList;
});
