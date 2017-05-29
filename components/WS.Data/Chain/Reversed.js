/* global define, require */
define('js!WS.Data/Chain/Reversed', [
   'js!WS.Data/Chain/Abstract',
   'js!WS.Data/Chain/IndexedEnumerator',
   'js!WS.Data/Di'
], function (
   Abstract,
   IndexedEnumerator,
   Di
) {
   'use strict';

   /**
    * Реверсивное звено цепочки.
    * @class WS.Data/Chain/Reversed
    * @extends WS.Data/Chain/Abstract
    * @public
    * @author Мальцев Алексей
    */

   var ReversedChain = Abstract.extend(/** @lends WS.Data/Chain/Reversed.prototype */{
      _moduleName: 'WS.Data/Chain/Reversed',

      /**
       * Конструктор реверсивного звена цепочки.
       * @param {WS.Data/Chain/Abstract} previous Предыдущее звено.
       */
      constructor: function $Reversed(previous) {
         ReversedChain.superclass.constructor.call(this, previous._source);
         this._start = previous._start;
         this._previous = previous;
      },

      destroy: function() {
         ReversedChain.superclass.destroy.call(this);
      },

      //region WS.Data/Collection/IEnumerable

      getEnumerator: function () {
         return new ReversedEnumerator(
            this._previous
         );
      }

      //endregion WS.Data/Collection/IEnumerable

      //region WS.Data/Chain/Abstract

      //endregion WS.Data/Chain/Abstract

   });

   /**
    * Конструктор реверсивного энумератора.
    * @param {WS.Data/Chain/Abstract} previous Предыдущее звено.
    * @protected
    */
   var ReversedEnumerator = function(previous) {
      IndexedEnumerator.call(this, previous);
   };

   ReversedEnumerator.prototype = Object.create(IndexedEnumerator.prototype);
   ReversedEnumerator.prototype.constructor = ReversedEnumerator;

   ReversedEnumerator.prototype._getItems = function() {
      if (!this._items) {
         IndexedEnumerator.prototype._getItems.call(this);
         this._items.reverse();
      }

      return this._items;
   };

   Di.register('chain.$reversed', ReversedChain, {instantiate: false});
   Di.register('chain.reversed', ReversedChain);

   return ReversedChain;
});
