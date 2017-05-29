/* global define, require */
define('js!WS.Data/Chain/IndexedEnumerator', [
], function (
) {
   'use strict';

   /**
    * Индексирующий энумератор
    * @class WS.Data/Chain/IndexedEnumerator
    * @author Мальцев Алексей
    */

   /**
    * Конструктор.
    * @param {WS.Data/Chain/Abstract} previous Предыдущее звено.
    * @protected
    */
   var IndexedEnumerator = function(previous) {
      this.previous = previous;
      this.reset();
   };

   IndexedEnumerator.prototype.previous = null;
   IndexedEnumerator.prototype.index = -1;
   IndexedEnumerator.prototype._items = null;

   IndexedEnumerator.prototype.getCurrent = function() {
      var items = this._getItems(),
         current = items[this.index];
      return current ? current[1] : undefined;
   };

   IndexedEnumerator.prototype.getCurrentIndex = function() {
      var items = this._getItems(),
         current = items[this.index];
      return current ? current[0] : -1;
   };

   IndexedEnumerator.prototype.moveNext = function() {
      if (this.index >= this._getItems().length - 1) {
         return false;
      }
      this.index++;
      return true;
   };

   IndexedEnumerator.prototype.getNext = function() {
      return this.moveNext() ? this.getCurrent() : undefined;
   };

   IndexedEnumerator.prototype.reset = function() {
      delete this._items;
      this.index = -1;
   };

   IndexedEnumerator.prototype._getItems = function() {
      if (!this._items) {
         this._items = [];
         var enumerator = this.previous.getEnumerator();
         while (enumerator.moveNext()) {
            this._items.push([enumerator.getCurrentIndex(), enumerator.getCurrent()]);
         }
      }

      return this._items;
   };

   return IndexedEnumerator;
});
