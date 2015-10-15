/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Collection.LoadableTree', [
   'js!SBIS3.CONTROLS.Data.Collection.Tree',
   'js!SBIS3.CONTROLS.Data.Collection.LoadableTreeChildren',
   'js!SBIS3.CONTROLS.Data.Bind.ICollection',
   'js!SBIS3.CONTROLS.Data.Query.IQueryable',
   'js!SBIS3.CONTROLS.Data.Collection.ISourceLoadable',
   'js!SBIS3.CONTROLS.Data.Collection.LoadableTreeItemMixin'
], function (Tree, LoadableTreeChildren, IBindCollection, IQueryable, ISourceLoadable, LoadableTreeItemMixin) {
   'use strict';

   /**
    * Дерево, загружаемое через источник данных
    * @class SBIS3.CONTROLS.Data.Collection.LoadableTree
    * @extends SBIS3.CONTROLS.Data.Collection.Tree
    * @mixes SBIS3.CONTROLS.Data.Bind.ICollection
    * @mixes SBIS3.CONTROLS.Data.Query.IQueryable
    * @mixes SBIS3.CONTROLS.Data.Collection.ISourceLoadable
    * @mixes SBIS3.CONTROLS.Data.Collection.LoadableTreeItemMixin
    * @public
    * @author Мальцев Алексей
    */

   var LoadableTree = Tree.extend([IBindCollection, IQueryable, ISourceLoadable, LoadableTreeItemMixin], /** @lends SBIS3.CONTROLS.Data.Collection.LoadableTree.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Collection.LoadableTree',
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
