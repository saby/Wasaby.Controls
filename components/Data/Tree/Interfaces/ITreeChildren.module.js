/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Tree.ITreeChildren', [
], function () {
   'use strict';

   /**
    * Интерфейс дочерних элементов узла дерева
    * @mixin SBIS3.CONTROLS.Data.Tree.ITreeChildren
    * @implements SBIS3.CONTROLS.Data.Collection.IList
    * @public
    * @author Мальцев Алексей
    */
   return /** @lends SBIS3.CONTROLS.Data.Tree.ITreeChildren.prototype */{
      $protected: {
         _options: {
            /**
             * @cfg {SBIS3.CONTROLS.Data.Tree.ITreeItem} Узел-владелец
             */
            owner: false
         }
      },

      /**
       * Возвращает узел-владелец
       * @returns {SBIS3.CONTROLS.Data.Tree.ITreeItem}
       */
      getOwner: function () {
         throw new Error('Method must be implemented');
      }
   };
});
