/* global define */
define('js!WS.Data/Collection/ObservableList', [
   'js!WS.Data/Collection/List',
   'js!WS.Data/Mediator/IReceiver',
   'js!WS.Data/Collection/IBind',
   'js!WS.Data/Entity/SerializableMixin',
   'js!WS.Data/Collection/EventRaisingMixin',
   'js!WS.Data/Collection/ObservableListMixin',
   'js!WS.Data/Di'
], function (
   List,
   IMediatorReceiver,
   IBindCollection,
   SerializableMixin,
   EventRaisingMixin,
   ObservableListMixin,
   Di
) {
   'use strict';

   /**
    * Список, в котором можно отслеживать изменения.
    * <pre>
    *    define(['js!WS.Data/Collection/ObservableList', 'js!WS.Data/Collection/IBind'], function(ObservableList, IBindCollection) {
    *       var list = new ObservableList({
    *          items: [1, 2, 3]
    *       });
    *
    *       list.subscribe('onCollectionChange', function(eventObject, action, newItems, newItemsIndex, oldItems, oldItemsIndex) {
    *          if (action == IBindCollection.ACTION_REMOVE){
    *             console.log(oldItems);//[1]
    *             console.log(oldItemsIndex);//0
    *          }
    *       });
    *
    *       list.removeAt(0);
    *    });
    * </pre>
    * @class WS.Data/Collection/ObservableList
    * @extends WS.Data/Collection/List
    * @implements WS.Data/Collection/IBind
    * @implements WS.Data/Mediator/IReceiver
    * @mixes WS.Data/Collection/EventRaisingMixin
    * @mixes WS.Data/Collection/ObservableListMixin
    * @public
    * @author Мальцев Алексей
    */

   var ObservableList = List.extend([IBindCollection, IMediatorReceiver, EventRaisingMixin, ObservableListMixin], /** @lends WS.Data/Collection/ObservableList.prototype */{
      _moduleName: 'WS.Data/Collection/ObservableList',

      /**
       * @member {Number} Количество измененившихся элементов, при превышении которого генерируется одно событие onCollectionChange с ACTION_RESET, вместо нескольких c другими action
       */
      _resetChangesCount: 100,

      constructor: function $ObservableList(options) {
         ObservableList.superclass.constructor.call(this, options);
         EventRaisingMixin.constructor.call(this, options);
         ObservableListMixin.constructor.call(this, options);
      },
      
      //region WS.Data/Mediator/IReceiver

      relationChanged: function (which, name, data) {
         if (name === 'owner') {
            this._reindex(
               '',
               this.getIndex(which),
               1
            );
         }

         ObservableListMixin.relationChanged.call(this, which, name, data);
      },

      //endregion WS.Data/Mediator/IReceiver

      //region WS.Data/Collection/ObservableListMixin

      _notifyItemChange: function (item, properties) {
         ObservableListMixin._notifyItemChange.call(this, item, properties);
         
         if (
            (this.hasEventHandlers('onCollectionItemChange') || this.hasEventHandlers('onCollectionChange')) &&
            !this._eventRaising
         ) {
            if (!this._silentChangedItems) {
               this._silentChangedItems = [];
            }
            this._silentChangedItems.push(arguments);
         }
      },
      
      //region WS.Data/Collection/ObservableListMixin
      
      //region WS.Data/Collection/EventRaisingMixin
      
      setEventRaising: function(enabled, analyze) {
         EventRaisingMixin.setEventRaising.call(this, enabled, analyze);

         //если стрелять событиями до синхронизации то проекция не всегда сможет найти стрельнувший item или найдет не тот
         if (enabled && analyze && this._silentChangedItems) {
            //Если изменилось критическое число элементов, то генерируем reset
            if (this._silentChangedItems.length >= Math.min(this._resetChangesCount, this._$items.length)) {
               this._notifyCollectionChange(
                  IBindCollection.ACTION_RESET,
                  this._$items.slice(),
                  0,
                  [],
                  0
               );
            } else {
               //Собираем изменившиеся элементы в пачки и генерируем replace
               var items = [],
                  pack,
                  packIndex,
                  sendPack,
                  item,
                  index,
                  maxIndex;

               for (var i = 0; i < this._silentChangedItems.length; i++) {
                  item = this._silentChangedItems[i][0];
                  index = this.getIndex(item);
                  items[index] = item;
               }

               pack = [];
               packIndex = 0;
               sendPack = (function(pack, packIndex) {
                  var eventPack = pack.slice();
                  this._notifyCollectionChange(
                     IBindCollection.ACTION_REPLACE,
                     eventPack,
                     packIndex,
                     eventPack,
                     packIndex
                  );
                  eventPack = null;
                  pack.length = 0;
               }).bind(this);
               maxIndex = items.length - 1;

               for (index = 0; index <= maxIndex; index++) {
                  item = items[index];

                  if (!item) {
                     if (pack.length) {
                        sendPack(pack, packIndex);
                     }
                     continue;
                  }

                  if (pack.length === 0) {
                     packIndex = index;
                  }
                  pack.push(item);

                  if (index === maxIndex) {
                     sendPack(pack, packIndex);
                  }
               }
            }
         }
         delete this._silentChangedItems;
      }
      
      //endregion WS.Data/Collection/EventRaisingMixin
   });

   Di.register('collection.observable-list', ObservableList);

   return ObservableList;
});
