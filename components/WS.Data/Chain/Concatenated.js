/* global define, require */
define('js!WS.Data/Chain/Concatenated', [
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
    * @class WS.Data/Chain/Concatenated
    * @extends WS.Data/Chain/Abstract
    * @public
    * @author Мальцев Алексей
    */

   var ConcatenatedChain = Abstract.extend(/** @lends WS.Data/Chain/Concatenated.prototype */{
      _moduleName: 'WS.Data/Chain/Concatenated',

      /**
       * @member {Array.<Array>|Array.<WS.Data/Collection/IEnumerable>} Коллекции для объединения
       */
      _items: null,

      /**
       * Конструктор объединяющего звена цепочки.
       * @param {WS.Data/Chain/Abstract} previous Предыдущее звено.
       * @param {Array.<Array>|Array.<WS.Data/Collection/IEnumerable>} items Коллекции для объединения.
       */
      constructor: function $Concatenated(previous, items) {
         ConcatenatedChain.superclass.constructor.call(this, previous._source);
         this._start = previous._start;
         this._previous = previous;
         this._items = items;
      },

      destroy: function() {
         this._items = null;
         ConcatenatedChain.superclass.destroy.call(this);
      },

      //region WS.Data/Collection/IEnumerable

      getEnumerator: function () {
         return new ConcatenatedEnumerator(
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
   var ConcatenatedEnumerator = function(previous, items) {
      this.previous = previous;
      this.items = items;
      this.reset();
   };

   ConcatenatedEnumerator.prototype.previous = null;
   ConcatenatedEnumerator.prototype.enumerator = null;
   ConcatenatedEnumerator.prototype.index = null;
   ConcatenatedEnumerator.prototype.current = undefined;
   ConcatenatedEnumerator.prototype.currentItem = null;
   ConcatenatedEnumerator.prototype.currentItemIndex = null;

   ConcatenatedEnumerator.prototype.getCurrent = function() {
      return this.current;
   };

   ConcatenatedEnumerator.prototype.getCurrentIndex = function() {
      return this.index;
   };

   ConcatenatedEnumerator.prototype.moveNext = function() {
      this.enumerator = this.enumerator || (this.enumerator = this.previous.getEnumerator());

      var hasNext = this.enumerator.moveNext();
      if (hasNext) {
         this.current = this.enumerator.getCurrent();
         this.index++;
         return hasNext;
      }

      if (this.currentItem) {
         hasNext = this.currentItem.moveNext();
         if (hasNext) {
            this.current = this.currentItem.getCurrent();
            this.index++;
            return hasNext;
         }
      }

      if (this.currentItemIndex < this.items.length - 1) {
         this.currentItemIndex++;
         this.currentItem = this.items[this.currentItemIndex];
         if (this.currentItem instanceof Array) {
            this.currentItem = new ArrayEnumerator(this.currentItem);
         } else if (this.currentItem && this.currentItem._wsDataCollectionIEnumerable) {
            this.currentItem = this.currentItem.getEnumerator();
         } else {
            throw new TypeError('Collection at argument ' + this.currentItemIndex + ' should implement WS.Data/Collection/IEnumerable');
         }
         return this.moveNext();
      }

      return false;
   };

   ConcatenatedEnumerator.prototype.getNext = function() {
      return this.moveNext() ? this.getCurrent() : undefined;
   };

   ConcatenatedEnumerator.prototype.reset = function() {
      this.enumerator = null;
      this.index = -1;
      this.current = undefined;
      this.currentItem = null;
      this.currentItemIndex = -1;
   };

   Di.register('chain.$concatenated', ConcatenatedChain, {instantiate: false});
   Di.register('chain.concatenated', ConcatenatedChain);

   return ConcatenatedChain;
});
