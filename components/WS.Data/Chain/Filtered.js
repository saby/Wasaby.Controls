/* global define, require */
define('js!WS.Data/Chain/Filtered', [
   'js!WS.Data/Chain/Abstract',
   'js!WS.Data/Di'
], function (
   Abstract,
   Di
) {
   'use strict';

   /**
    * Фильтрующее звено цепочки.
    * @class WS.Data/Chain/Filtered
    * @extends WS.Data/Chain/Abstract
    * @public
    * @author Мальцев Алексей
    */

   var FilteredChain = Abstract.extend(/** @lends WS.Data/Chain/Filtered.prototype */{
      _moduleName: 'WS.Data/Chain/Filtered',

      /**
       * @member {Function(*, Number): Boolean} Фильтр
       */
      _callback: null,

      /**
       * @member {Object} Контекст вызова _callback
       */
      _callbackContext: null,

      /**
       * Конструктор фильтрующего звена цепочки.
       * @param {WS.Data/Chain/Abstract} previous Предыдущее звено.
       * @param {Function(*, Number): Boolean} callback Фильтр
       * @param {Object} [callbackContext] Контекст вызова callback
       */
      constructor: function $Filtered(previous, callback, callbackContext) {
         FilteredChain.superclass.constructor.call(this, previous._source);
         this._start = previous._start;
         this._previous = previous;
         this._callback = callback;
         this._callbackContext = callbackContext;
      },

      destroy: function() {
         this._callback = null;
         this._callbackContext = null;
         FilteredChain.superclass.destroy.call(this);
      },

      //region WS.Data/Collection/IEnumerable

      getEnumerator: function () {
         return new FilteredEnumerator(
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
    * Конструктор фильтрующего энумератора.
    * @param {WS.Data/Chain/Abstract} previous Предыдущее звено.
    * @param {Function(*, Number): Boolean} callback Фильтр
    * @param {Object} [callbackContext] Контекст вызова callback
    * @protected
    */
   var FilteredEnumerator = function(previous, callback, callbackContext) {
      this.previous = previous;
      this.callback = callback;
      this.callbackContext = callbackContext;
      this.reset();
   };

   FilteredEnumerator.prototype.previous = null;
   FilteredEnumerator.prototype.callback = null;
   FilteredEnumerator.prototype.callbackContext = null;
   FilteredEnumerator.prototype.enumerator = null;

   FilteredEnumerator.prototype.getCurrent = function() {
      return this.enumerator.getCurrent();
   };

   FilteredEnumerator.prototype.getCurrentIndex = function() {
      return this.enumerator.getCurrentIndex();
   };

   FilteredEnumerator.prototype.moveNext = function() {
      while (this.enumerator.moveNext()) {
         if (this.callback.call(
            this.callbackContext,
            this.enumerator.getCurrent(),
            this.enumerator.getCurrentIndex()
         )) {
            return true;
         }
      }

      return false;
   };

   FilteredEnumerator.prototype.getNext = function() {
      return this.moveNext() ? this.getCurrent() : undefined;
   };

   FilteredEnumerator.prototype.reset = function() {
      this.enumerator = this.previous.getEnumerator();
   };

   Di.register('chain.$filtered', FilteredChain, {instantiate: false});
   Di.register('chain.filtered', FilteredChain);

   return FilteredChain;
});
