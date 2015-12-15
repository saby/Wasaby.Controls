/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Collection.ObservableListMixin', [
   'js!SBIS3.CONTROLS.Data.Bind.ICollection'
], function (IBindCollection) {
   'use strict';

   /**
    * Миксин, поддерживающий отcлеживание изменений в списках
    * @mixin SBIS3.CONTROLS.Data.Collection.ObservableListMixin
    * @public
    * @author Мальцев Алексей
    */

   var ObservableListMixin = /** @lends SBIS3.CONTROLS.Data.Collection.ObservableListMixin.prototype */{
      $protected: {
         /**
          * @var {Boolean} Генерация событий включена
          */
         _eventsEnabled: true,

         /**
          * @var {Function} Обработчик изменения свойств элемента
          */
         _onItemPropertyChangeHandler: undefined
      },

      $constructor: function () {
         this._publish('onCollectionChange', 'onCollectionItemChange');
         this._onItemPropertyChangeHandler = onItemPropertyChangeHandler.bind(this);
         $ws.helpers.forEach(this._items, this._watchForChanges, this);
      },

      before: {
         destroy: function() {
            $ws.helpers.forEach(this._items, this._cancelWatchForChanges, this);
         }
      },

      around: {

         //region SBIS3.CONTROLS.Data.Collection.IEnumerable

         concat: function (parentFnc, items, prepend) {
            var newItemsIndex = this.getCount();
            this._eventsEnabled = false;
            parentFnc.call(this, items, prepend);
            this._eventsEnabled = true;
            this.notifyCollectionChange(
               IBindCollection.ACTION_ADD,
               prepend ? this._items.slice(0, this.getCount() - newItemsIndex) : this._items.slice(newItemsIndex),
               prepend ? 0 : newItemsIndex,
               [],
               0
            );
         },

         //endregion SBIS3.CONTROLS.Data.Collection.IEnumerable

         //region SBIS3.CONTROLS.Data.Collection.List

         fill: function (parentFnc, instead) {
            var oldItems = this._items.slice();
            this._eventsEnabled = false;
            parentFnc.call(this, instead);
            this._eventsEnabled = true;
            this.notifyCollectionChange(
               IBindCollection.ACTION_RESET,
               this._items.slice(),
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
               [this._items[at]],
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
               [this._items[index]],
               index
            );
            parentFnc.call(this, index);
         },

         replace: function (parentFnc, item, at) {
            var oldItem = this._items[at];
            parentFnc.call(this, item, at);
            this.notifyCollectionChange(
               IBindCollection.ACTION_REPLACE,
               [this._items[at]],
               at,
               [oldItem],
               at
            );
         }

         //endregion SBIS3.CONTROLS.Data.Collection.List

         //region SBIS3.CONTROLS.Data.Bind.IBindProperty

         //endregion SBIS3.CONTROLS.Data.Bind.IBindProperty

      },

      /**
       * Генерирует событие об изменении коллеции
       * @param {String} action Действие, приведшее к изменению.
       * @param {*[]} newItems Новые элементы коллеции.
       * @param {Number} newItemsIndex Индекс, в котором появились новые элементы.
       * @param {*[]} oldItems Удаленные элементы коллекции.
       * @param {Number} oldItemsIndex Индекс, в котором удалены элементы.
       * @private
       */
      notifyCollectionChange: function (action, newItems, newItemsIndex, oldItems, oldItemsIndex) {
         if (!this._eventsEnabled) {
            return;
         }

         this._notify(
            'onCollectionChange',
            action,
            newItems,
            newItemsIndex,
            oldItems,
            oldItemsIndex
         );
         this._checkWatchableOnCollectionChange(
            action,
            newItems,
            newItemsIndex,
            oldItems,
            oldItemsIndex
         );
      },

      /**
       * Генерирует событие об изменении элемента
       * @param {*} item Элемент
       * @param {String} property Измененное свойство
       */
      notifyItemChange: function (item, property) {
         var index = this.getIndex(item);
         this._notify(
            'onCollectionItemChange',
            this._items[index],
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
       * @private
       */
      _checkWatchableOnCollectionChange: function(action, newItems, newItemsIndex, oldItems) {
         switch (action){
            case IBindCollection.ACTION_ADD:
               $ws.helpers.forEach(newItems, this._watchForChanges, this);
               break;
            case IBindCollection.ACTION_REMOVE:
               $ws.helpers.forEach(oldItems, this._cancelWatchForChanges, this);
               break;
            case IBindCollection.ACTION_RESET:
            case IBindCollection.ACTION_REPLACE:
               $ws.helpers.forEach(newItems, this._watchForChanges, this);
               $ws.helpers.forEach(oldItems, this._cancelWatchForChanges, this);
               break;
         }
      },

      /**
       * Подписывается на событие onPropertyChange на содержимом элемента коллекции
       * @param item {*} Элемент коллекции
       * @private
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
       * @private
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
       * @private
       */
      _needWatchForChanges: function(item) {
         if (item && $ws.helpers.instanceOfMixin(item, 'SBIS3.CONTROLS.Data.IPropertyAccess')) {
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
