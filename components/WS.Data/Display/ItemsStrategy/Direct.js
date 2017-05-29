/* global define */
define('js!WS.Data/Display/ItemsStrategy/Direct', [
   'js!WS.Data/Display/ItemsStrategy/Abstract'
], function (
   Abstract
) {
   'use strict';

   /**
    * Стратегия получения элементов проекции напрямую по коллекции
    * @class WS.Data/Display/ItemsStrategy/Direct
    * @extends WS.Data/Display/ItemsStrategy/Abstract
    * @public
    * @author Мальцев Алексей
    */

   var Direct = Abstract.extend(/** @lends WS.Data/Display/ItemsStrategy/Direct.prototype */{
      _moduleName: 'WS.Data/Display/ItemsStrategy/Direct',

      /**
       * @member {WS.Data/Collection/IEnumerator} Энумератор исходной коллекции
       */
      _collectionEnumerator: null,

      constructor: function $Direct(display, options) {
         Direct.superclass.constructor.call(this, display, options);
      },

      //region Public methods

      at: function (index) {
         if (this._items[index]) {
            return this._items[index];
         }

         var source;


         if (this._collection._wsDataCollectionIList) {//it's equal to CoreInstance.instanceOfMixin(this._collection, 'WS.Data/Collection/IList')
            source = this._collection.at(index);
         } else {
            var enumerator = this._getCollectionEnumerator(),
               itemIndex = 0;
            enumerator.reset();
            while (enumerator.moveNext()) {
               if (itemIndex === index) {
                  source = enumerator.getCurrent();
                  break;
               }
               itemIndex++;
            }
         }

         if (source === undefined) {
            throw new ReferenceError('Collection index ' + index + ' is out of bounds.');
         }

         return (this._items[index] = this.convertToItem(source));
      },

      getCount: function() {
         return this._items.length;
      },

      getItems: function () {
         var count = this._items.length,
            i;
         for (i = 0; i < count; i++) {
            this.at(i);
         }
         return this._items;
      },

      splice: function (start, deleteCount, added) {
         added = added || [];
         return Array.prototype.splice.apply(
            this._items,
            [start, deleteCount].concat(added.map(function(item) {
               return this.convertToItemIf(item);
            }.bind(this)))
         );
      },

      addSorters: function (sorters) {
         sorters.unshift({
            name: 'natural',
            enabled: true,
            method: Direct.sortItems
         });
      },

      //endregion Public methods

      //region Protected methods

      _initItems: function() {
         this._items.length = this._getCollectionCount();
      },

      _getCollectionCount: function() {
         if (this._collection._wsDataCollectionIList) {//it's equal to CoreInstance.instanceOfMixin(this._collection, 'WS.Data/Collection/IList')
            return this._collection.getCount();
         } else {
            var enumerator = this._getCollectionEnumerator(),
               count = 0;
            enumerator.reset();
            while (enumerator.moveNext()) {
               count++;
            }
            return count;
         }

      },

      /**
       * Возвращает энумератор коллекции
       * @return {WS.Data/Collection/IEnumerator}
       * @protected
       */
      _getCollectionEnumerator: function () {
         if (!this._collectionEnumerator) {
            this._collectionEnumerator = this._collection.getEnumerator();
         }
         return this._collectionEnumerator;
      }

      //endregion Protected methods
   });

   /**
    * Создает индекс сортировки в том же порядке, что и исходная коллекция
    * @param {Array.<WS.Data/Display/CollectionItem>} items Элементы проекции.
    * @return {Array.<Number>}
    */
   Direct.sortItems = function (items) {
      return items.map(function(item, index) {
         return index;
      });
   };

   return Direct;
});
