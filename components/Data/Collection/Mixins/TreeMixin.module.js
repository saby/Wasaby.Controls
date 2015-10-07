/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Collection.TreeMixin', [
   'js!SBIS3.CONTROLS.Data.Collection.TreeItem'
], function (TreeItem) {
   'use strict';

   /**
    * Миксин, реализующий корневой узел дерева
    * @mixin SBIS3.CONTROLS.Data.Collection.TreeMixin
    * @public
    * @author Мальцев Алексей
    */

   return /** @lends SBIS3.CONTROLS.Data.Collection.TreeMixin.prototype */{
      $constructor: function (cfg) {
         cfg = cfg || {};

         this._options.node = cfg.node = true;

         if ('parent' in cfg && cfg.parent) {
            throw new Error('Tree can\'t have a parent');
         }
      },

      //region SBIS3.CONTROLS.Data.Collection.ITreeItem

      setParent: function (parent) {
         throw new Error('Tree root can\'t have a parent');
      }

      //endregion SBIS3.CONTROLS.Data.Collection.ITreeItem
   };
});
