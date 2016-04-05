/* global define, require, $ws */
define('js!SBIS3.CONTROLS.Data.Projection.TreeChildren', [
   'js!SBIS3.CONTROLS.Data.Collection.List',
   'js!SBIS3.CONTROLS.Data.Di'
], function (List, Di) {
   'use strict';

   /**
    * Список дочерних элементов узла дерева.
    * @class SBIS3.CONTROLS.Data.Projection.TreeChildren
    * @extends SBIS3.CONTROLS.Data.Collection.List
    * @public
    * @author Мальцев Алексей
    */

   var TreeChildren = List.extend(/** @lends SBIS3.CONTROLS.Data.Projection.TreeChildren.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Projection.TreeChildren',
      $protected: {
         _options: {
            /**
             * @cfg {SBIS3.CONTROLS.Data.Projection.TreeItem} Узел-владелец
             */
            owner: false
         }
      },

      $constructor: function (cfg) {
         cfg = cfg || {};

         if (typeof cfg.owner !== 'object') {
            throw new Error('Tree children owner should be an object');
         }
         if (!$ws.helpers.instanceOfModule(cfg.owner, 'SBIS3.CONTROLS.Data.Projection.TreeItem')) {
            throw new Error('Tree children owner should be an instance of SBIS3.CONTROLS.Data.Projection.TreeItem');
         }
      },

      //region SBIS3.CONTROLS.Data.Collection.IEnumerable

      //endregion SBIS3.CONTROLS.Data.Collection.IEnumerable

      //region SBIS3.CONTROLS.Data.Collection.IList

      //endregion SBIS3.CONTROLS.Data.Collection.IList

      //region Public methods

      /**
       * Возвращает узел-владелец
       * @returns {SBIS3.CONTROLS.Data.Projection.TreeItem}
       */
      getOwner: function () {
         return this._options.owner;
      }

      //endregion Public methods

      //region Protected methods

      //endregion Protected methods

   });

   Di.register('projection.tree-children', TreeChildren);

   return TreeChildren;
});
