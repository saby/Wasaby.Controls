/* global define, require */
define('js!WS.Data/Chain/Uniquely', [
   'js!WS.Data/Chain/Abstract',
   'js!WS.Data/Di'
], function (
   Abstract,
   Di
) {
   'use strict';

   /**
    * Звено цепочки, обеспечивающее уникальность.
    * @class WS.Data/Chain/Uniquely
    * @extends WS.Data/Chain/Abstract
    * @public
    * @author Мальцев Алексей
    */

   var UniquelyChain = Abstract.extend(/** @lends WS.Data/Chain/Uniquely.prototype */{
      _moduleName: 'WS.Data/Chain/Uniquely',

      /**
       * @member {Function(*): String|Number>} [idExtractor] Функция, возвращающий уникальный идентификатор для каждого элемента коллекции.
       */
      _idExtractor: null,

      /**
       * Конструктор звена цепочки, обеспечивающего уникальность.
       * @param {WS.Data/Chain/Abstract} previous Предыдущее звено.
       * @param {Function(*): String|Number>} [idExtractor] Функция, возвращающий уникальный идентификатор для каждого элемента коллекции.
       */
      constructor: function $Uniquely(previous, idExtractor) {
         UniquelyChain.superclass.constructor.call(this, previous._source);
         this._start = previous._start;
         this._previous = previous;
         this._idExtractor = idExtractor;
      },

      destroy: function() {
         this._idExtractor = null;
         UniquelyChain.superclass.destroy.call(this);
      },

      //region WS.Data/Collection/IEnumerable

      getEnumerator: function () {
         return new UniquelyEnumerator(
            this._previous,
            this._idExtractor
         );
      }

      //endregion WS.Data/Collection/IEnumerable

      //region WS.Data/Chain/Abstract

      //endregion WS.Data/Chain/Abstract

   });

   /**
    * Конструктор энумератора, обеспечивающего уникальность.
    * @param {WS.Data/Chain/Abstract} previous Предыдущее звено.
    * @param {Function(*, String|Number): String|Number>} [idExtractor] Функция, возвращающий уникальный идентификатор для каждого элемента коллекции.
    * @protected
    */
   var UniquelyEnumerator = function(previous, idExtractor) {
      this.previous = previous;
      this.idExtractor = idExtractor;
      this.reset();
   };

   UniquelyEnumerator.prototype.previous = null;
   UniquelyEnumerator.prototype.enumerator = null;
   UniquelyEnumerator.prototype.idExtractor = null;
   UniquelyEnumerator.prototype.keysHash = null;
   UniquelyEnumerator.prototype.objectsHash = null;

   UniquelyEnumerator.prototype.getCurrent = function() {
      return this.enumerator.getCurrent();
   };

   UniquelyEnumerator.prototype.getCurrentIndex = function() {
      return this.enumerator.getCurrentIndex();
   };

   UniquelyEnumerator.prototype.moveNext = function() {
      var hasNext = this.enumerator.moveNext(),
         current;
      if (hasNext) {
         current = this.enumerator.getCurrent();
         if (this.idExtractor) {
            current = this.idExtractor(current, this.enumerator.getCurrentIndex());
         }
         if (current instanceof Object) {
            if (this.objectsHash.indexOf(current) > -1) {
               return this.moveNext();
            } else {
               this.objectsHash.push(current);
            }
         } else {
            if (current in this.keysHash) {
               return this.moveNext();
            } else {
               this.keysHash[current] = true;
            }
         }
      }

      return hasNext;
   };

   UniquelyEnumerator.prototype.getNext = function() {
      return this.moveNext() ? this.getCurrent() : undefined;
   };

   UniquelyEnumerator.prototype.reset = function() {
      this.enumerator = this.previous.getEnumerator();
      this.keysHash = {};
      this.objectsHash = [];
   };

   Di.register('chain.$uniquely', UniquelyChain, {instantiate: false});
   Di.register('chain.uniquely', UniquelyChain);

   return UniquelyChain;
});
