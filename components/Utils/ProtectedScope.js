/**
 * Защищённая область для хранения защищённых членов классов
 *
 * @class SBIS3.CONTROLS/Utils/ProtectedScope
 * @author Спирин В.А.
 * @public
 *
 * @example
 * Создание геттера защищённой области:
 * <pre class="darkula js">
 *    var protectedOf = ProtectedScope.create();
 * </pre>
 *
 * Использование геттера защищённой области объекта this:
 * <pre class="darkula js">
 *    protectedOf(this).memeber = 123;
 *    return 300 + protectedOf(this).memeber;
 * </pre>
 *
 * Принудительная очистка защищённой области объекта this:
 * <pre class="darkula js">
 *    protectedOf.clear(this);
 * </pre>
 */
define('SBIS3.CONTROLS/Utils/ProtectedScope',
   [],

   function () {
      'use strict';

      /**
       * Константа, показывающая достуность WeakMap
       * @protected
       * @type {boolean}
       */
      var USE_NATIVE = typeof WeakMap !== 'undefined';

      /**
       * Класс для создания защищённых членов классов
       * @protected
       * @class Pr0tected
       */
      function Pr0tected () {};

      Pr0tected.prototype = {
         /**
          * Возвращает объект - хранилище защищённых свойств для указанного объекта-владельцаа
          * @public
          * @param {object} owner Владелец защищённых свойств
          * @param {boolean} asIs Не создавать объект если его ещё нет, а вернуть как есть
          * @return {object}
          */
         scope: USE_NATIVE ?
            function (owner, asIs) {
               var map = this.members = this.members || new WeakMap();
               if (!map.has(owner) && !asIs) {
                  map.set(owner, {});
               }
               return map.get(owner);
            } :
            function (owner, asIs) {
               var prop = '__pr0tected__';
               /*^^^if (!(prop in owner) && !asIs) {
                  this.prefix = this.prefix || _uniqueHex(50) + ':';
                  var n = this.counter = (this.counter || 0) + 1;
                  Object.defineProperty(owner, prop, {value:this.prefix + n});
               }
               var map = this.members = this.members || {};
               var id = owner[prop];
               if (!(id in map) && !asIs) {
                  map[id] = {};
               }
               return map[id];*/
               // Альтернативно
               if (!(prop in owner) && !asIs) {
                  Object.defineProperty(owner, prop, {value:{}});
               }
               return owner[prop];
            },

         /**
          * Очищает хранилище защищённых свойств для указанного объекта-владельцаа
          * @public
          * @param {object} owner Владелец защищённых свойств
          */
         clear: USE_NATIVE ?
            function (owner) {
               if (this.members) {
                  this.members.delete(owner);
               }
            } :
            function (owner) {
               var prop = '__pr0tected__';
               if (prop in owner) {
                  /*^^^if (this.members) {
                     delete this.members[owner[prop]];
                     delete owner[prop];
                  }*/
                  // Альтернативно
                  delete owner[prop];
               }
            }
      };

      Pr0tected.prototype.constructor = Pr0tected;

      return {
         /**
          * Возвращает хранилище защищённых свойств в виде функции
          * @public
          * @static
          * @return {function}
          */
         create: function () {
            var p = new Pr0tected();
            var f = p.scope.bind(p);
            f.clear = p.clear.bind(p)
            return f;
         }
      };
   }
);