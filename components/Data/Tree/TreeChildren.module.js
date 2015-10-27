/* global define, require, $ws */
define('js!SBIS3.CONTROLS.Data.Tree.TreeChildren', [
   'js!SBIS3.CONTROLS.Data.Tree.ITreeChildren',
   'js!SBIS3.CONTROLS.Data.Collection.List'
], function (ITreeChildren, List) {
   'use strict';

   /**
    * Список дочерних элементов узла дерева.
    * @class SBIS3.CONTROLS.Data.Tree.TreeChildren
    * @extends SBIS3.CONTROLS.Data.Collection.List
    * @mixes SBIS3.CONTROLS.Data.Tree.ITreeChildren
    * @public
    * @author Мальцев Алексей
    */

   var TreeChildren = List.extend([ITreeChildren], /** @lends SBIS3.CONTROLS.Data.Tree.TreeChildren.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Tree.TreeChildren',

      $constructor: function (cfg) {
         cfg = cfg || {};

         if (typeof cfg.owner !== 'object') {
            throw new Error('Tree children owner should be an object');
         }
         if (!$ws.helpers.instanceOfModule(cfg.owner, 'SBIS3.CONTROLS.Data.Tree.TreeItem')) {
            throw new Error('Tree children owner should be an instance of SBIS3.CONTROLS.Data.Tree.TreeItem');
         }
      },

      //region SBIS3.CONTROLS.Data.Collection.IEnumerable

      //endregion SBIS3.CONTROLS.Data.Collection.IEnumerable

      //region SBIS3.CONTROLS.Data.Collection.IList

      //endregion SBIS3.CONTROLS.Data.Collection.IList

      //region SBIS3.CONTROLS.Data.Tree.ITreeChildren

      getOwner: function () {
         return this._options.owner;
      }

      //endregion SBIS3.CONTROLS.Data.Tree.ITreeChildren

      //region Protected methods

      //endregion Protected methods

   });

   $ws.single.ioc.bind('SBIS3.CONTROLS.Data.Tree.TreeChildren', function(config) {
      return new TreeChildren(config);
   });

   return TreeChildren;
});
