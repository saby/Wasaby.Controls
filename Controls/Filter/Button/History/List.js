/**
 * Created by kraynovdo on 31.01.2018.
 */
define('Controls/Filter/Button/History/List', [
   'Core/Control',
   'tmpl!Controls/Filter/Button/History/List',
   'WS.Data/Source/Memory',
   'WS.Data/Adapter/Sbis',
   'Controls/History/FilterSource',
   'Controls/History/Service',
   'Controls/Controllers/SourceController',
   'WS.Data/Collection/RecordSet',
   'WS.Data/Chain',
   'WS.Data/Utils',
   'css!Controls/Filter/Button/History/List'
], function(BaseControl, template, MemorySource, SbisAdapter, HistorySource, HistoryService, SourceController, RecordSet, Chain, Utils) {
   'use strict';

   var getPropValue = Utils.getItemPropertyValue.bind(Utils);

   var actionType = {

      //show only in Menu
      PINNED: 0,

      //show in Menu and Toolbar
      UNPINNED: 1
   };

   var _itemsAction = [
      {
         id: 0,
         icon: 'icon-PinNull',
         showType: 2
      },
      {
         id: 1,
         icon: 'icon-PinOff',
         showType: 2
      }
   ];

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
            self._historySource = new HistorySource({
               originSource: new MemorySource({
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

      createHistoryMemory: function(items) {
         return new MemorySource({
            idProperty: 'ObjectId',
            adapter: new SbisAdapter(),
            data: items.getRawData()
         });
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

      updateItems: function(self) {
         var historySource = this.getHistorySource(self);
         self._listMemory = this.createHistoryMemory(historySource.getItems());
      }
   };

   var HistoryList = BaseControl.extend({
      _items: null,
      _historySource: null,
      _listMemory: null,

      _showAction: function(action, item) {
         if (item.get('pinned') === true) {
            if (action.id === actionType.PINNED) {
               return false;
            }
         } else {
            if (action.id === actionType.UNPINNED) {
               return false;
            }
         }
         return true;
      },
      _itemActions: _itemsAction,
      _template: template,

      _onItemActionsClick: function(event, action, item) {
         _private.getHistorySource(this).update(item, {
            $_pinned: !item.get('pinned')
         });
         _private.updateItems(this);
      },
      _contentClick: function(event, data) {
         var items = _private.getHistorySource(this).getDataObject(data.item.get('ObjectData'));
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

      _getText: function(item) {
         var text = '';
         var items = JSON.parse(item.get('ObjectData'));
         if (items) {
            text = _private.getStringHistoryFromItems(items);
         }
         return text;
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
