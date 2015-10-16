/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Tree.LoadableTree', [
   'js!SBIS3.CONTROLS.Data.Tree.Tree',
   'js!SBIS3.CONTROLS.Data.Tree.LoadableTreeChildren',
   'js!SBIS3.CONTROLS.Data.Query.IQueryable',
   'js!SBIS3.CONTROLS.Data.Collection.ISourceLoadable',
   'js!SBIS3.CONTROLS.Data.Tree.LoadableTreeItemMixin'
], function (Tree, LoadableTreeChildren, IQueryable, ISourceLoadable, LoadableTreeItemMixin) {
   'use strict';

   /**
    * Дерево, загружаемое через источник данных
    * @class SBIS3.CONTROLS.Data.Tree.LoadableTree
    * @extends SBIS3.CONTROLS.Data.Tree.Tree
    * @mixes SBIS3.CONTROLS.Data.Query.IQueryable
    * @mixes SBIS3.CONTROLS.Data.Collection.ISourceLoadable
    * @mixes SBIS3.CONTROLS.Data.Tree.LoadableTreeItemMixin
    * @public
    * @author Мальцев Алексей
    */

   var LoadableTree = Tree.extend([IQueryable, ISourceLoadable, LoadableTreeItemMixin], /** @lends SBIS3.CONTROLS.Data.Tree.LoadableTree.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Tree.LoadableTree',
       $protected: {
          _options: {
             /**
              * @cfg {*} Идентификатор корневого узла, который будет отправлен в запросе на получение корневых записей
              */
             rootNodeId: undefined
          }
       },

      /**
       * Возвращает идентификатор корневого узла, который будет отправлен в запросе на получение корневых записей
       * @returns {String}
       */
      getRootNodeId: function () {
         return this._options.rootNodeId;
      },

      /**
       * Устанавливает идентификатор корневого узла, который будет отправлен в запросе на получение корневых записей
       * @param {*} rootNodeId Идентификатор корневого узла
       */
      setRootNodeId: function (rootNodeId) {
         this._options.rootNodeId = rootNodeId;
      }
   });

   return LoadableTree;
});
