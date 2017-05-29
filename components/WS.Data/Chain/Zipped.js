/* global define, require */
define('js!WS.Data/Chain/Zipped', [
   'js!WS.Data/Chain/Abstract',
   'js!WS.Data/Collection/ArrayEnumerator',
   'js!WS.Data/Di'
], function (
   Abstract,
   ArrayEnumerator,
   Di
) {
   'use strict';

   /**
    * Объединяющее звено цепочки.
    * @class WS.Data/Chain/Zipped
    * @extends WS.Data/Chain/Abstract
    * @public
    * @author Мальцев Алексей
    */

   var ZippedChain = Abstract.extend(/** @lends WS.Data/Chain/Zipped.prototype */{
      _moduleName: 'WS.Data/Chain/Zipped',

      /**
       * @member {Array.<Array>|Array.<WS.Data/Collection/IEnumerable>} Коллекции для объединения
       */
      _items: null,

      /**
       * Конструктор объединяющего звена цепочки.
       * @param {WS.Data/Chain/Abstract} previous Предыдущее звено.
       * @param {Array.<Array>|Array.<WS.Data/Collection/IEnumerable>} items Коллекции для объединения.
       */
      constructor: function $Zipped(previous, items) {
         ZippedChain.superclass.constructor.call(this, previous._source);
         this._start = previous._start;
         this._previous = previous;
         this._items = items;
      },

      destroy: function() {
         this._items = null;
         ZippedChain.superclass.destroy.call(this);
      },

      //region WS.Data/Collection/IEnumerable

      getEnumerator: function () {
         return new ZippedEnumerator(
            this._previous,
            this._items
         );
      }

      //endregion WS.Data/Collection/IEnumerable

      //region WS.Data/Chain/Abstract

      //endregion WS.Data/Chain/Abstract

   });

   /**
    * Конструктор объединяющего энумератора.
    * @param {WS.Data/Chain/Abstract} previous Предыдущее звено.
    * @param {Array.<Array>|Array.<WS.Data/Collection/IEnumerable>} items Коллекции для объединения.
    * @protected
    */
   var ZippedEnumerator = function(previous, items) {
      this.previous = previous;
      this.items = items;
      this.reset();
   };

   ZippedEnumerator.prototype.previous = null;
   ZippedEnumerator.prototype.items = null;
   ZippedEnumerator.prototype.itemsEnumerators = null;
   ZippedEnumerator.prototype.enumerator = null;
   ZippedEnumerator.prototype.index = null;
   ZippedEnumerator.prototype.current = undefined;

   ZippedEnumerator.prototype.getCurrent = function() {
      return this.current;
   };

   ZippedEnumerator.prototype.getCurrentIndex = function() {
      return this.index;
   };

   ZippedEnumerator.prototype.moveNext = function() {
      this.enumerator = this.enumerator || (this.enumerator = this.previous.getEnumerator());

      var hasNext = this.enumerator.moveNext(),
         current,
         item,
         itemEnumerator,
         i;
      if (hasNext) {
         this.index++;

         current = [this.enumerator.getCurrent()];
         for (i = 0; i < this.items.length; i++) {
            item = this.items[i];
            if (item instanceof Array) {
               current.push(item[this.index]);
            } else if (item && item._wsDataCollectionIEnumerable) {
               itemEnumerator = this.itemsEnumerators[i] || (this.itemsEnumerators[i] = item.getEnumerator());
               if (itemEnumerator.moveNext()) {
                  current.push(itemEnumerator.getCurrent());
               } else {
                  current.push(undefined);
               }
            } else {
               throw new TypeError('Collection at argument ' + i + ' should implement WS.Data/Collection/IEnumerable');
            }
         }
         this.current = current;
      }

      return hasNext;
   };

   ZippedEnumerator.prototype.getNext = function() {
      return this.moveNext() ? this.getCurrent() : undefined;
   };

   ZippedEnumerator.prototype.reset = function() {
      this.enumerator = null;
      this.index = -1;
      this.current = undefined;
      this.itemsEnumerators = [];
   };

   Di.register('chain.$zipped', ZippedChain, {instantiate: false});
   Di.register('chain.zipped', ZippedChain);

   return ZippedChain;
});
