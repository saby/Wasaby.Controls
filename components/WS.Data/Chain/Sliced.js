/* global define, require */
define('js!WS.Data/Chain/Sliced', [
   'js!WS.Data/Chain/Abstract',
   'js!WS.Data/Di'
], function (
   Abstract,
   Di
) {
   'use strict';

   /**
    * Вырезающее звено цепочки.
    * @class WS.Data/Chain/Sliced
    * @extends WS.Data/Chain/Abstract
    * @public
    * @author Мальцев Алексей
    */

   var SlicedChain = Abstract.extend(/** @lends WS.Data/Chain/Sliced.prototype */{
      _moduleName: 'WS.Data/Chain/Sliced',

      /**
       * @member {Number} Индекс, по которому начинать извлечение
       */
      _begin: 0,

      /**
       * @member {Number} Индекс, по которому заканчивать извлечение (будут извлечены элементы с индексом меньше end)
       */
      _end: 0,

      /**
       * Конструктор вырезающего звена цепочки.
       * @param {WS.Data/Chain/Abstract} previous Предыдущее звено.
       * @param {Number} begin Индекс, по которому начинать извлечение
       * @param {Number} end Индекс, по которому заканчивать извлечение (будут извлечены элементы с индексом меньше end)
       */
      constructor: function $Sliced(previous, begin, end) {
         SlicedChain.superclass.constructor.call(this, previous._source);
         this._start = previous._start;
         this._previous = previous;
         this._begin = begin;
         this._end = end;
      },

      //region WS.Data/Collection/IEnumerable

      getEnumerator: function () {
         return new SlicedEnumerator(
            this._previous,
            this._begin,
            this._end
         );
      }

      //endregion WS.Data/Collection/IEnumerable

      //region WS.Data/Chain/Abstract

      //endregion WS.Data/Chain/Abstract

   });

   /**
    * Конструктор вырезающего энумератора.
    * @param {WS.Data/Chain/Abstract} previous Предыдущее звено.
    * @param {Number} begin Индекс, по которому начинать извлечение
    * @param {Number} end Индекс, по которому заканчивать извлечение (будут извлечены элементы с индексом меньше end)
    * @protected
    */
   var SlicedEnumerator = function(previous, begin, end) {
      this.previous = previous;
      this.begin = begin;
      this.end = end;
      this.reset();
   };

   SlicedEnumerator.prototype.previous = null;
   SlicedEnumerator.prototype.now = 0;
   SlicedEnumerator.prototype.begin = 0;
   SlicedEnumerator.prototype.end = 0;
   SlicedEnumerator.prototype.enumerator = null;

   SlicedEnumerator.prototype.getCurrent = function() {
      return this.enumerator.getCurrent();
   };

   SlicedEnumerator.prototype.getCurrentIndex = function() {
      return this.enumerator.getCurrentIndex();
   };

   SlicedEnumerator.prototype.moveNext = function() {
      while (this.now < this.begin - 1 && this.enumerator.moveNext()) {
         this.now++;
      }

      var next = this.now + 1;
      if (
         next >= this.begin &&
         next < this.end &&
         this.enumerator.moveNext()
      ) {
         this.now = next;
         return true;
      }

      return false;
   };

   SlicedEnumerator.prototype.getNext = function() {
      return this.moveNext() ? this.getCurrent() : undefined;
   };

   SlicedEnumerator.prototype.reset = function() {
      this.enumerator = this.previous.getEnumerator();
      this.now = -1;
   };

   Di.register('chain.$sliced', SlicedChain, {instantiate: false});
   Di.register('chain.sliced', SlicedChain);

   return SlicedChain;
});
