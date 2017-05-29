/* global define */
define('js!WS.Data/MoveStrategy/IMoveStrategy', [], function () {
   'use strict';

   /**
    * Интерфейс стратегии перемещения записей.
    * @interface WS.Data/MoveStrategy/IMoveStrategy
    * @public
    * @author Ганшин Ярослав
    */

   return /** @lends WS.Data/MoveStrategy/IMoveStrategy.prototype */{
      /**
       * Перемещение, смена порядка.
       * @param {Array} movedItems Массив перемещаемых записей.
       * @param {WS.Data/Entity/Model} target Запись к которой надо преместить.
       * @param {Boolean} after Если true - вставить после целевой записи, если false, то перед ней.
       * @return {Core/Deferred}
       */
      move: function (movedItems, target, after) {
         throw new Error('Method must be implemented');
      },
      /**
       * Перемещние по иерархии, смена родителя.
       * @param {Array} movedItems Массив перемещаемых записей.
       * @param {WS.Data/Entity/Model} target Запись в которую надо преместить.
       * @return {Core/Deferred}
       */
      hierarchyMove: function (movedItems, target) {
         throw new Error('Method must be implemented');
      }

   };
});
