/* global define */
define('js!WS.Data/Collection/ObservableListMixin', [
   'js!WS.Data/Collection/IBind'
], function (
   IBindCollection
) {
   'use strict';

   /**
    * Миксин, поддерживающий отcлеживание изменений в списках
    * @mixin WS.Data/Collection/ObservableListMixin
    * @public
    * @author Мальцев Алексей
    */

   var ObservableListMixin = /** @lends WS.Data/Collection/ObservableListMixin.prototype */{
      constructor: function $ObservableListMixin() {
         this._publish('onCollectionChange', 'onCollectionItemChange');
      },

      $around: {

         //region WS.Data/Collection/List

         assign: function (parentFnc, items) {
            var oldItems = this._$items.slice(),
               eventsWasRaised = this._eventRaising;

            this._eventRaising = false;
            parentFnc.call(this, items);
            this._eventRaising = eventsWasRaised;

            this._notifyCollectionChange(
               IBindCollection.ACTION_RESET,
               this._$items.slice(),
               0,
               oldItems,
               0
            );
         },

         append: function (parentFnc, items) {
            var eventsWasRaised = this._eventRaising;

            this._eventRaising = false;
            var count = this.getCount();
            parentFnc.call(this, items);
            this._eventRaising = eventsWasRaised;

            this._notifyCollectionChange(
               IBindCollection.ACTION_ADD,
               this._$items.slice(count),
               count,
               [],
               0
            );
         },

         prepend: function (parentFnc, items) {
            var eventsWasRaised = this._eventRaising;

            this._eventRaising = false;
            var length = this.getCount();
            parentFnc.call(this, items);
            this._eventRaising = eventsWasRaised;

            this._notifyCollectionChange(
               IBindCollection.ACTION_ADD,
               this._$items.slice(0, this.getCount() - length),
               0,
               [],
               0
            );
         },

         clear: function (parentFnc) {
            var oldItems = this._$items.slice(),
               eventsWasRaised = this._eventRaising;

            this._eventRaising = false;
            parentFnc.call(this);
            this._eventRaising = eventsWasRaised;

            this._notifyCollectionChange(
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
            this._notifyCollectionChange(
               IBindCollection.ACTION_ADD,
               [this._$items[at]],
               at,
               [],
               0
            );
         },

         removeAt: function (parentFnc, index) {
            var item = parentFnc.call(this, index);
            this._notifyCollectionChange(
               IBindCollection.ACTION_REMOVE,
               [],
               0,
               [item],
               index
            );
            return item;
         },

         replace: function (parentFnc, item, at) {
            var oldItem = this._$items[at];
            parentFnc.call(this, item, at);

            //Replace with itself has no effect
            if (oldItem !== item) {
               this._notifyCollectionChange(
                  IBindCollection.ACTION_REPLACE,
                  [this._$items[at]],
                  at,
                  [oldItem],
                  at
               );
            }
         },

         move: function (parentFnc, from, to) {
            var item = this._$items[from];
            parentFnc.call(this, from, to);

            if (from !== to) {
               this._notifyCollectionChange(
                  IBindCollection.ACTION_MOVE,
                  [item],
                  to,
                  [item],
                  from
               );
            }
         }

         //endregion WS.Data/Collection/List

      },

      //region WS.Data/Mediator/IReceiver

      relationChanged: function (which, name, data) {
         if (name === 'owner') {
            this._notifyItemChange(
               which,
               data || {}
            );
         }
      },

      //endregion WS.Data/Mediator/IReceiver

      //region Public methods

      //endregion Public methods

      //region Protected methods

      /**
       * Генерирует событие об изменении элемента
       * @param {*} item Элемент
       * @param {Object.<String, *>} properties Изменившиеся свойства
       */
      _notifyItemChange: function (item, properties) {
         if (!this._isNeedNotifyCollectionItemChange()) {
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

      /**
       * Возвращает признак, что нужно генерировать события об изменениях элементов коллекции
       * @return {Boolean}
       * @protected
       */
      _isNeedNotifyCollectionItemChange: function () {
         return this._eventRaising && this.hasEventHandlers('onCollectionItemChange');
      }

      //endregion Protected methods
   };

   return ObservableListMixin;
});
