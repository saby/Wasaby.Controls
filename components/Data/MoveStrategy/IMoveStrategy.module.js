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
       * @param {SBIS3.CONTROLS.Data.Model} from - Перемещаемая запись
       * @param {SBIS3.CONTROLS.Data.Model} to - запись к которой надо преместить
       * @param {Boolean} after - Если true - вставить после записи, указанной в to. Если false - перед записью, указанной в to.
       * @returns {$ws.proto.Deferred}
       */
      move: function (from, to, after) {
         throw new Error('Method must be implemented');
      },
      /**
       * Перемещние по иерархии, смена родителя.
       * @param {SBIS3.CONTROLS.Data.Model} from - Перемещаемая запись
       * @param {SBIS3.CONTROLS.Data.Model} to - запись в которую надо преместить
       * @returns {$ws.proto.Deferred}
       */
      hierarhyMove: function (from, to) {
         throw new Error('Method must be implemented');
      }
   };
});
