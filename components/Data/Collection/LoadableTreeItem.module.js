/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Collection.LoadableTreeItem', [
   'js!SBIS3.CONTROLS.Data.Collection.ObservableTreeItem',
   'js!SBIS3.CONTROLS.Data.Query.IQueryable',
   'js!SBIS3.CONTROLS.Data.Collection.ISourceLoadable',
   'js!SBIS3.CONTROLS.Data.Collection.LoadableTreeChildren',
   'js!SBIS3.CONTROLS.Data.Collection.LoadableTreeItemMixin'
], function (ObservableTreeItem, IQueryable, ISourceLoadable, LoadableTreeChildren, LoadableTreeItemMixin) {
   'use strict';

   /**
    * Элемент дерева, который можно загружать через источник
    * @class SBIS3.CONTROLS.Data.Collection.LoadableTreeItem
    * @extends SBIS3.CONTROLS.Data.Collection.ObservableTreeItem
    * @mixes SBIS3.CONTROLS.Data.Query.IQueryable
    * @mixes SBIS3.CONTROLS.Data.Collection.ISourceLoadable
    * @mixes SBIS3.CONTROLS.Data.Collection.ISourceLoadable
    * @mixes SBIS3.CONTROLS.Data.Collection.LoadableTreeItemMixin
    * @public
    * @author Мальцев Алексей
    */
   var LoadableTreeItem = ObservableTreeItem.extend([IQueryable, ISourceLoadable, LoadableTreeItemMixin], /** @lends SBIS3.CONTROLS.Data.Collection.LoadableTreeItem.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Collection.LoadableTreeItem'
   });

   $ws.single.ioc.bind('SBIS3.CONTROLS.Data.Collection.LoadableTreeItem', function(config) {
      return new LoadableTreeItem(config);
   });

   return LoadableTreeItem;
});
