/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Collection.ObservableListMixin', [
   'js!SBIS3.CONTROLS.Data.Bind.ICollection'
], function (IBindCollection) {
   'use strict';

   /**
    * Миксин, поддерживающий отcлеживание изменений в списках
    * @mixin SBIS3.CONTROLS.Data.Collection.ObservableListMixin
    * @public
    * @ignoreMethods notifyCollectionChange notifyItemChange
    * @author Мальцев Алексей
    */

   var ObservableListMixin = /** @lends SBIS3.CONTROLS.Data.Collection.ObservableListMixin.prototype */{
      /**
       * @member {Boolean} Генерация событий включена
       */
      _eventsEnabled: true,

      /**
       * @member {Function} Обработчик изменения свойств элемента
       */
      _onItemPropertyChangeHandler: null,

      constructor: function $ObservableListMixin() {
         this._publish('onCollectionChange', 'onCollectionItemChange');
         this._onItemPropertyChangeHandler = onItemPropertyChangeHandler.bind(this);

         this._setObservableItems(this._$items);
      },

      $after: {
         subscribe: function(event) {
            if (this._eventBusChannel.getEventHandlers(event).length == 1) {
               this._setObservableItems(this._$items);
            }
         },

         destroy: function() {
            this._unsetObservableItems(this._$items);
         }
      },

      $around: {

         //region SBIS3.CONTROLS.Data.Collection.List

         assign: function (parentFnc, items) {
            var oldItems = this._$items.slice(),
               eventsWasEnabled = this._eventsEnabled;

            this._eventsEnabled = false;
            parentFnc.call(this, items);
            this._eventsEnabled = eventsWasEnabled;

            this.notifyCollectionChange(
               IBindCollection.ACTION_RESET,
               this._$items.slice(),
               0,
               oldItems,
               0
            );
         },

         append: function (parentFnc, items) {
            var eventsWasEnabled = this._eventsEnabled;

            this._eventsEnabled = false;
            var count = this.getCount();
            parentFnc.call(this, items);
            this._eventsEnabled = eventsWasEnabled;

            this.notifyCollectionChange(
               IBindCollection.ACTION_ADD,
               this._$items.slice(count, this._lenght),
               count,
               [],
               0
            );
         },

         prepend: function (parentFnc, items) {
            var eventsWasEnabled = this._eventsEnabled;

            this._eventsEnabled = false;
            var length = this.getCount();
            parentFnc.call(this, items);
            this._eventsEnabled = eventsWasEnabled;

            this.notifyCollectionChange(
               IBindCollection.ACTION_ADD,
               this._$items.slice(0, this.getCount() - length),
               0,
               [],
               0
            );
         },

         clear: function (parentFnc) {
            var oldItems = this._$items.slice(),
               eventsWasEnabled = this._eventsEnabled;

            this._eventsEnabled = false;
            parentFnc.call(this);
            this._eventsEnabled = eventsWasEnabled;

            this.notifyCollectionChange(
               IBindCollection.ACTION_RESET,
               this._$items.slice(),
               0,
               oldItems,
               0
            );
         },

         add: function (parentFnc, item, at) {
            parentFnc.call(this, item, at);
            at = this._isValidIndex(at) ? at : this.getCount() - 1;
            this.notifyCollectionChange(
               IBindCollection.ACTION_ADD,
               [this._$items[at]],
               at,
               [],
               0
            );
         },

         removeAt: function (parentFnc, index) {
            this.notifyCollectionChange(
               IBindCollection.ACTION_REMOVE,
               [],
               0,
               [this._$items[index]],
               index
            );
            parentFnc.call(this, index);
         },

         replace: function (parentFnc, item, at) {
            var oldItem = this._$items[at];
            parentFnc.call(this, item, at);
            this.notifyCollectionChange(
               IBindCollection.ACTION_REPLACE,
               [this._$items[at]],
               at,
               [oldItem],
               at
            );
         }

         //endregion SBIS3.CONTROLS.Data.Collection.List

      },

      /**
       * Генерирует событие об изменении коллеции
       * @param {String} action Действие, приведшее к изменению.
       * @param {*[]} newItems Новые элементы коллеции.
       * @param {Number} newItemsIndex Индекс, в котором появились новые элементы.
       * @param {*[]} oldItems Удаленные элементы коллекции.
       * @param {Number} oldItemsIndex Индекс, в котором удалены элементы.
       * @public
       */
      notifyCollectionChange: function (action, newItems, newItemsIndex, oldItems, oldItemsIndex) {
         if (!this._eventsEnabled) {
            return;
         }
         if (this.hasEventHandlers('onCollectionChange')) {
            this._notify(
               'onCollectionChange',
               action,
               newItems,
               newItemsIndex,
               oldItems,
               oldItemsIndex
            );
         }
         if (this.hasEventHandlers('onCollectionItemChange')) {
            this._checkWatchableOnCollectionChange(
               action,
               newItems,
               newItemsIndex,
               oldItems,
               oldItemsIndex
            );
         }
      },

      /**
       * Генерирует событие об изменении элемента
       * @param {*} item Элемент
       * @param {String} property Измененное свойство
       * @public
       */
      notifyItemChange: function (item, property) {
         if (
            !this._eventsEnabled ||
            !this.hasEventHandlers('onCollectionItemChange')
         ) {
            return;
         }

         var index = this.getIndex(item);
         this._notify(
            'onCollectionItemChange',
            this._$items[index],
            index,
            property
         );
      },

      //region Protected methods

      /**
       * При изменениях коллекции синхронизирует подписки на элементы
       * @param {String} action Действие, приведшее к изменению.
       * @param {*[]} newItems Новые элементы коллеции.
       * @param {Number} newItemsIndex Индекс, в котором появились новые элементы.
       * @param {*[]} oldItems Удаленные элементы коллекции.
       * @param {Number} oldItemsIndex Индекс, в котором удалены элементы.
       * @protected
       */
      _checkWatchableOnCollectionChange: function(action, newItems, newItemsIndex, oldItems) {
         switch (action){
            case IBindCollection.ACTION_ADD:
               this._setObservableItems(newItems);
               break;
            case IBindCollection.ACTION_REMOVE:
               this._unsetObservableItems(oldItems);
               break;
            case IBindCollection.ACTION_RESET:
            case IBindCollection.ACTION_REPLACE:
               this._unsetObservableItems(oldItems);
               this._setObservableItems(newItems);
               break;
         }
      },

      /**
       * Оформляет подписку на событие onPropertyChange для каждого из элементов массива, если на событие есть подписчики
       * @param items {Array} Элементы
       * @protected
       */
      _setObservableItems: function(items) {
         if (this.hasEventHandlers('onCollectionItemChange')) {
            $ws.helpers.forEach(items, this._watchForChanges, this);
         }
      },

      /**
       * Отменяет подписку на событие onPropertyChange для каждого из элементов массива
       * @param items {Array} Элементы
       * @protected
       */
      _unsetObservableItems: function(items) {
         $ws.helpers.forEach(items, this._cancelWatchForChanges, this);
      },

      /**
       * Подписывается на событие onPropertyChange на содержимом элемента коллекции
       * @param item {*} Элемент коллекции
       * @protected
       */
      _watchForChanges: function(item) {
         if (this._needWatchForChanges(item)) {
            var handlers = item.getEventHandlers('onPropertyChange');
            if (Array.indexOf(handlers, this._onItemPropertyChangeHandler) === -1) {
               item.subscribe('onPropertyChange', this._onItemPropertyChangeHandler);
            }
         }
      },

      /**
       * Отписываетсят события onPropertyChange
       * @param item {*} Элемент коллекции
       * @protected
       */
      _cancelWatchForChanges: function(item) {
         if (this._needWatchForChanges(item)) {
            item.unsubscribe('onPropertyChange', this._onItemPropertyChangeHandler);
         }
      },

      /**
       * Проверяет нужно ли следить за изменением содержимого элемента коллекции
       * @param item {*} Содержимое элемента коллекции
       * @returns {Boolean}
       * @protected
       */
      _needWatchForChanges: function(item) {
         if (
            item &&
            $ws.helpers.instanceOfMixin(item, 'SBIS3.CONTROLS.Data.IObject')
         ) {
            return true;
         }
         return false;
      }

      //endregion Protected methods
   };

   /**
    * Обработчк события изменения модели
    * @param {$ws.proto.EventObject} event Дескриптор события.
    * @param {String} property Измененное свойство
    * @param {*} value Значение свойства
    */
   var onItemPropertyChangeHandler = function (event, property) {
      this.notifyItemChange(
         event.getTarget(),
         property
      );
   };

   return ObservableListMixin;
});
