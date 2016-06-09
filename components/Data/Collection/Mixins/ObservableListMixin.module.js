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
       * @member {boolean} флаг показывает выполняется ли в данный момент событие изменения коллекции
       */
      _isChangingYet: false,

      constructor: function $ObservableListMixin() {
         this._publish('onCollectionChange', 'onCollectionItemChange');
      },

      $around: {

         //region SBIS3.CONTROLS.Data.Collection.List

         assign: function (parentFnc, items) {
            var oldItems = this._$items.slice(),
               eventsWasEnabled = this._eventsEnabled;

            this._eventsEnabled = false;
            parentFnc.call(this, items);
            this._eventsEnabled = eventsWasEnabled;

            this._notifier(
               this.notifyCollectionChange,
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

            this._notifier(
               this.notifyCollectionChange,
               IBindCollection.ACTION_ADD,
               this._$items.slice(count),
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

            this._notifier(
               this.notifyCollectionChange,
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

            this._notifier(
               this.notifyCollectionChange,
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
            this._notifier(
               this.notifyCollectionChange,
               IBindCollection.ACTION_ADD,
               [this._$items[at]],
               at,
               [],
               0
            );
         },

         removeAt: function (parentFnc, index) {
            var item = this._$items[index];
            parentFnc.call(this, index);
            this._notifier(
               this.notifyCollectionChange,
               IBindCollection.ACTION_REMOVE,
               [],
               0,
               [item],
               index
            );

         },

         replace: function (parentFnc, item, at) {
            var oldItem = this._$items[at];
            parentFnc.call(this, item, at);
            this._notifier(
               this.notifyCollectionChange,
               IBindCollection.ACTION_REPLACE,
               [this._$items[at]],
               at,
               [oldItem],
               at
            );
         }

         //endregion SBIS3.CONTROLS.Data.Collection.List

      },

      //region SBIS3.CONTROLS.Data.Mediator.IReceiver

      relationChanged: function (which, name, data) {
         if (name === 'owner') {
            this._notifier(
               this.notifyItemChange,
               which,
               data
            );
            //this.notifyItemChange(which, data);
         }
      },

      //endregion SBIS3.CONTROLS.Data.Mediator.IReceiver

      //region Public methods

      /**
       * Генерирует событие об изменении коллеции
       * @param {String} action Действие, приведшее к изменению.
       * @param {*[]} newItems Новые элементы коллеции.
       * @param {Number} newItemsIndex Индекс, в котором появились новые элементы.
       * @param {*[]} oldItems Удаленные элементы коллекции.
       * @param {Number} oldItemsIndex Индекс, в котором удалены элементы.
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
      },

      /**
       * Генерирует событие об изменении элемента
       * @param {*} item Элемент
       * @param {Object.<String, *>} properties Изменившиеся свойства
       */
      notifyItemChange: function (item, properties) {
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
            properties
         );
      },

      //endregion Public methods

      //region Protected methods

      _notifier: function (func /*, arguments*/) {
         var args = Array.prototype.slice.call(arguments, 1);
         if (this._isChangingYet) {
            setTimeout((function () {
               func.apply(this, args);
            }).bind(this), 0);
            return;
         }
         this._isChangingYet = true;
         func.apply(this, args);
         this._isChangingYet = false;
      }

      //endregion Protected methods
   };

   return ObservableListMixin;
});
