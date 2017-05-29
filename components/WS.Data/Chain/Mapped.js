/* global define, require */
define('js!WS.Data/Chain/Mapped', [
   'js!WS.Data/Chain/Abstract',
   'js!WS.Data/Di'
], function (
   Abstract,
   Di
) {
   'use strict';

   /**
    * Преобразующее звено цепочки.
    * @class WS.Data/Chain/Mapped
    * @extends WS.Data/Chain/Abstract
    * @public
    * @author Мальцев Алексей
    */

   var MappedChain = Abstract.extend(/** @lends WS.Data/Chain/Mapped.prototype */{
      _moduleName: 'WS.Data/Chain/Mapped',

      /**
       * @member {Function(*, Number): *} Функция, возращающая новый элемент
       */
      _callback: null,

      /**
       * @member {Object} Контекст вызова _callback
       */
      _callbackContext: null,

      /**
       * Конструктор преобразующего звена цепочки.
       * @param {WS.Data/Chain/Abstract} previous Предыдущее звено.
       * @param {Function(*, Number): *} callback Функция, возвращающая новый элемент.
       * @param {Object} [callbackContext] Контекст вызова callback
       */
      constructor: function $Mapped(previous, callback, callbackContext) {
         MappedChain.superclass.constructor.call(this, previous._source);
         this._start = previous._start;
         this._previous = previous;
         this._callback = callback;
         this._callbackContext = callbackContext;
      },

      destroy: function() {
         this._callback = null;
         this._callbackContext = null;
         MappedChain.superclass.destroy.call(this);
      },

      //region WS.Data/Collection/IEnumerable

      getEnumerator: function () {
         return new MappedEnumerator(
            this._previous,
            this._callback,
            this._callbackContext
         );
      }

      //endregion WS.Data/Collection/IEnumerable

      //region WS.Data/Chain/Abstract

      //endregion WS.Data/Chain/Abstract

   });

   /**
    * Конструктор преобразующего энумератора.
    * @param {WS.Data/Chain/Abstract} previous Предыдущее звено.
    * @param {Function(*, Number): *} callback Функция, возвращающая новый элемент.
    * @param {Object} [callbackContext] Контекст вызова callback
    * @protected
    */
   var MappedEnumerator = function(previous, callback, callbackContext) {
      this.previous = previous;
      this.callback = callback;
      this.callbackContext = callbackContext;
      this.reset();
   };

   MappedEnumerator.prototype.previous = null;
   MappedEnumerator.prototype.callback = null;
   MappedEnumerator.prototype.callbackContext = null;
   MappedEnumerator.prototype.enumerator = null;
   MappedEnumerator.prototype.current = null;

   MappedEnumerator.prototype.getCurrent = function() {
      return this.current;
   };

   MappedEnumerator.prototype.getCurrentIndex = function() {
      return this.enumerator.getCurrentIndex();
   };

   MappedEnumerator.prototype.moveNext = function() {
      if (this.enumerator.moveNext()) {
         this.current = this.callback.call(
            this.callbackContext,
            this.enumerator.getCurrent(),
            this.enumerator.getCurrentIndex()
         );
         return true;
      }

      return false;
   };

   MappedEnumerator.prototype.getNext = function() {
      return this.moveNext() ? this.getCurrent() : undefined;
   };

   MappedEnumerator.prototype.reset = function() {
      this.enumerator = this.previous.getEnumerator();
      this.current = undefined;
   };

   Di.register('chain.$mapped', MappedChain, {instantiate: false});
   Di.register('chain.mapped', MappedChain);

   return MappedChain;
});
