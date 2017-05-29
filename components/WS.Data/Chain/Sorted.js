/* global define, require */
define('js!WS.Data/Chain/Sorted', [
   'js!WS.Data/Chain/Abstract',
   'js!WS.Data/Chain/IndexedEnumerator',
   'js!WS.Data/Di'
], function (
   Abstract,
   IndexedEnumerator,
   Di
) {
   'use strict';

   var global = (0, eval)('this');

   /**
    * Сортирующее звено цепочки.
    * @class WS.Data/Chain/Sorted
    * @extends WS.Data/Chain/Abstract
    * @public
    * @author Мальцев Алексей
    */

   var SortedChain = Abstract.extend(/** @lends WS.Data/Chain/Sorted.prototype */{
      _moduleName: 'WS.Data/Chain/Sorted',

      /**
       * @member {Function(*, *): Number} Функция сравнения
       */
      _compareFunction: null,

      /**
       * Конструктор сортирующего звена цепочки.
       * @param {WS.Data/Chain/Abstract} previous Предыдущее звено.
       * @param {Function(*, Number): *} [compareFunction] Функция сравнения
       */
      constructor: function $Sorted(previous, compareFunction) {
         SortedChain.superclass.constructor.call(this, previous._source);
         this._start = previous._start;
         this._previous = previous;
         this._compareFunction = compareFunction;
      },

      destroy: function() {
         this._compareFunction = null;
         SortedChain.superclass.destroy.call(this);
      },

      //region WS.Data/Collection/IEnumerable

      getEnumerator: function () {
         return new SortedEnumerator(
            this._previous,
            this._compareFunction
         );
      }

      //endregion WS.Data/Collection/IEnumerable

      //region WS.Data/Chain/Abstract

      //endregion WS.Data/Chain/Abstract

   });

   /**
    * Конструктор сортирующего энумератора.
    * @param {WS.Data/Chain/Abstract} previous Предыдущее звено.
    * @param {Function(*, Number): *} [compareFunction] Функция сравнения.
    * @protected
    */
   var SortedEnumerator = function(previous, compareFunction) {
      IndexedEnumerator.call(this, previous);
      this.compareFunction = compareFunction || SortedEnumerator.defaultCompare;
   };

   SortedEnumerator.prototype = Object.create(IndexedEnumerator.prototype);
   SortedEnumerator.prototype.constructor = SortedEnumerator;

   SortedEnumerator.prototype.compareFunction = null;

   SortedEnumerator.prototype._getItems = function() {
      if (!this._items) {
         var items = [];
         var enumerator = this.previous.getEnumerator();
         while (enumerator.moveNext()) {
            items.push(new SortWrapper(enumerator.getCurrent(), enumerator.getCurrentIndex()));
         }

         items.sort(this.compareFunction);
         this._items = items.map(function(item) {
            var result = [SortWrapper.indexOf(item), SortWrapper.valueOf(item)];
            SortWrapper.clear(item);
            return result;
         });
      }

      return this._items;
   };

   SortedEnumerator.defaultCompare = function defaultCompare(a, b) {
      return a > b;
   };

   /**
    * Обертка для элемента коллекции, позволяющая сохранить информацию о его индексе в коллекции.
    * @param {*} item Элемент коллекции.
    * @param {*} index Индекс элемента коллекции.
    * @protected
    */
   var SortWrapper = function(item, index) {
      if (item instanceof Object) {
         item[SortWrapper.indexKey] = index;
         return item;
      }
      this.item = item;
      this.index = index;
   };

   SortWrapper.prototype.valueOf = function() {
      return this.item;
   };

   SortWrapper.prototype.indexOf = function() {
      return this.index;
   };

   SortWrapper.indexKey = global.Symbol ? global.Symbol('[]') : ['[]'];

   SortWrapper.valueOf = function(item) {
      return item instanceof SortWrapper ? item.valueOf() : item;
   };

   SortWrapper.indexOf = function(item) {
      return item instanceof SortWrapper ? item.indexOf() : item[SortWrapper.indexKey];
   };

   SortWrapper.clear = function(item) {
      if (!(item instanceof SortWrapper)) {
         delete item[SortWrapper.indexKey];
      }
   };

   Di.register('chain.$sorted', SortedChain, {instantiate: false});
   Di.register('chain.sorted', SortedChain);

   return SortedChain;
});
