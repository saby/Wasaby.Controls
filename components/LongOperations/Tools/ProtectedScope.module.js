/**
 */

/**
 * Защищённая область для хранения защищённых членов классов
 * @class SBIS3.CONTROLS.LongOperations.Tools.ProtectedScope
 * @public
 * ^^^Использование:
 *
 * var protectedOf = ProtectedScope.create();
 * protectedOf(this).memeber = 123;
 * return 300 + protectedOf(this).memeber;
 *
 * protectedOf(this).clear();
 */

define('js!SBIS3.CONTROLS.LongOperations.Tools.ProtectedScope',
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
          * @return {object}
          */
         scope: USE_NATIVE ?
            function (owner) {
               var map = this.members = this.members || new WeakMap();
               if (!map.has(owner)) {
                  map.set(owner, {});
               }
               return map.get(owner);
            } :
            function (owner) {
               var prop = '__pr0tected__';
               var map = this.members = this.members || {};
               if (!(prop in owner)) {
                  var n = (this.oldCounter || 0) + 1;
                  Object.defineProperty(owner, prop, {value:n});
                  this.oldCounter = n;
               }
               var id = owner[prop];
               if (!(id in map)) {
                  map[id] = {};
               }
               return map[id];
               // Альтернативно
               /*if (!(prop in owner)) {
                  owner[prop] = {};
               }
               return owner[prop];*/
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
                  if (this.members) {
                     delete this.members[owner[prop]];
                  }
                  // Альтернативно
                  /*delete owner[prop];*/
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