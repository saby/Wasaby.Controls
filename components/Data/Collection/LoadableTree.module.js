/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Collection.LoadableTree', [
   'js!SBIS3.CONTROLS.Data.Collection.ObservableTreeItem',
   'js!SBIS3.CONTROLS.Data.Collection.LoadableTreeChildren',
   'js!SBIS3.CONTROLS.Data.Query.IQueryable',
   'js!SBIS3.CONTROLS.Data.Collection.ISourceLoadable',
   'js!SBIS3.CONTROLS.Data.Collection.LoadableTreeItemMixin',
   'js!SBIS3.CONTROLS.Data.Collection.TreeMixin'
], function (ObservableTreeItem, LoadableTreeChildren, IQueryable, ISourceLoadable, LoadableTreeItemMixin, TreeMixin) {
   'use strict';

   /**
    * Дерево, загружаемое через источник данных
    * @class SBIS3.CONTROLS.Data.Collection.LoadableTree
    * @extends SBIS3.CONTROLS.Data.Collection.ObservableTreeItem
    * @mixes SBIS3.CONTROLS.Data.Query.IQueryable
    * @mixes SBIS3.CONTROLS.Data.Collection.ISourceLoadable
    * @mixes SBIS3.CONTROLS.Data.Collection.LoadableTreeItemMixin
    * @mixes SBIS3.CONTROLS.Data.Collection.TreeMixin
    * @public
    * @author Мальцев Алексей
    */

   var LoadableTree = ObservableTreeItem.extend([IQueryable, ISourceLoadable, LoadableTreeItemMixin, TreeMixin], /** @lends SBIS3.CONTROLS.Data.Collection.LoadableTree.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Collection.LoadableTree'
   });

   return LoadableTree;
});
