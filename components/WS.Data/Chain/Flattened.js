/* global define, require */
define('js!WS.Data/Chain/Flattened', [
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
    * Разворачивающее звено цепочки.
    * @class WS.Data/Chain/Flattened
    * @extends WS.Data/Chain/Abstract
    * @public
    * @author Мальцев Алексей
    */

   var FlattenedChain = Abstract.extend(/** @lends WS.Data/Chain/Flattened.prototype */{
      _moduleName: 'WS.Data/Chain/Flattened',

      /**
       * Конструктор разворачивающего звена цепочки.
       * @param {WS.Data/Chain/Abstract} previous Предыдущее звено.
       */
      constructor: function $Flattened(previous) {
         FlattenedChain.superclass.constructor.call(this, previous._source);
         this._start = previous._start;
         this._previous = previous;
      },

      //region WS.Data/Collection/IEnumerable

      getEnumerator: function () {
         return new FlattenedEnumerator(
            this._previous
         );
      }

      //endregion WS.Data/Collection/IEnumerable

      //region WS.Data/Chain/Abstract

      //endregion WS.Data/Chain/Abstract

   });

    /**
    * Конструктор разворачивающего энумератора.
    * @param {WS.Data/Chain/Abstract} previous Предыдущее звено.
    * @protected
    */
   var FlattenedEnumerator = function(previous) {
      this.previous = previous;
      this.reset();
   };

   FlattenedEnumerator.prototype.previous = null;
   FlattenedEnumerator.prototype.mover = null;
   FlattenedEnumerator.prototype.index = null;
   FlattenedEnumerator.prototype.current = undefined;

   FlattenedEnumerator.prototype.getCurrent = function() {
      return this.mover ? this.mover.getCurrent() : undefined;
   };

   FlattenedEnumerator.prototype.getCurrentIndex = function() {
      return this.index;
   };

   FlattenedEnumerator.prototype.moveNext = function() {
      this.mover = this.mover || (this.mover = new FlattenedMover(this.previous.getEnumerator()));
      var hasNext = this.mover.moveNext();
      if (hasNext) {
         this.index++;
      }
      return hasNext;
   };

   FlattenedEnumerator.prototype.getNext = function() {
      return this.moveNext() ? this.getCurrent() : undefined;
   };

   FlattenedEnumerator.prototype.reset = function() {
      delete this.mover;
      this.index = -1;
      this.current = undefined;
   };

   /**
    * Конструктор передвигаемого рекурсивного указателя.
    * @param {WS.Data/Collection/IEnumerator|Array} parent
    * @protected
    */
   var FlattenedMover = function(parent) {
      if (parent instanceof Array) {
         parent = new ArrayEnumerator(parent);
      }
      this.parent = parent;
   };

   FlattenedMover.prototype.moveNext = function() {
      if (!this.parent) {
         return false;
      }

      if (this.hasOwnProperty('current')) {
         if (this.current instanceof FlattenedMover) {
            var hasNext = this.current.moveNext();
            if (hasNext) {
               return hasNext;
            }
         }
         delete this.current;
      }

      if (!this.hasOwnProperty('current')) {
         if (this.parent.moveNext()) {
            this.current = this.parent.getCurrent();
         } else {
            return false;
         }
      }

      if (this.current instanceof Array) {
         this.current = new FlattenedMover(this.current);
         return this.current.moveNext();
      } else if (this.current && this.current._wsDataCollectionIEnumerable) {//implements WS.Data/Collection/IEnumerable
         this.current = new FlattenedMover(this.current.getEnumerator());
         return this.current.moveNext();
      } else {
         return true;
      }
   };

   FlattenedMover.prototype.getCurrent = function() {
      if (!this.hasOwnProperty('current')) {
         return undefined;
      }

      if (this.current instanceof FlattenedMover) {
         return this.current.getCurrent();
      }
      return this.current;
   };

   Di.register('chain.$flattened', FlattenedChain, {instantiate: false});
   Di.register('chain.flattened', FlattenedChain);

   return FlattenedChain;
});
