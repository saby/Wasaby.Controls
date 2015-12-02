/* global define */
define('js!SBIS3.CONTROLS.Data.IMoveStrategy', [], function () {
   'use strict';

   /**
    * Интерфейс стратегии перемещения записей
    * @mixin SBIS3.CONTROLS.Data.IMoveStrategy
    * @public
    * @author Ганшин Ярослав
    */

   return /** @lends SBIS3.CONTROLS.Data.IMoveStrategy.prototype */{

      /**
       * Перемещение, смена порядка.
       * @param {SBIS3.CONTROLS.Data.Model} move
       * @param {SBIS3.CONTROLS.Data.Model} to
       * @param {SBIS3.CONTROLS.Data.Model} up
       * @returns {$ws.proto.Deferred}
       */
      move: function (move, to, up) {
         throw new Error('Method must be implemented');
      },
      /**
       * Перемещние по иерархии, смена родителя.
       * @param {SBIS3.CONTROLS.Data.Model} move
       * @param {SBIS3.CONTROLS.Data.Model} to
       * @returns {$ws.proto.Deferred}
       */
      hierarhyMove: function (move, to) {
         throw new Error('Method must be implemented');
      }
   };
});
