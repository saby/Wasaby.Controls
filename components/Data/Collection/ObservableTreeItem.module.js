/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Collection.ObservableTreeItem', [
   'js!SBIS3.CONTROLS.Data.Collection.TreeItem',
   'js!SBIS3.CONTROLS.Data.Collection.ObservableTreeChildren',
   'js!SBIS3.CONTROLS.Data.Bind.ICollection',
   'js!SBIS3.CONTROLS.Data.Bind.ITree',
   'js!SBIS3.CONTROLS.Data.Bind.IProperty',
   'js!SBIS3.CONTROLS.Data.Collection.ObservableTreeItemMixin'
], function (TreeItem, ObservableTreeChildren, IBindCollection, IBindTree, IBindProperty, ObservableTreeItemMixin) {
   'use strict';

   /**
    * Элемент дерева, в котором можно отслеживать изменения.
    * @class SBIS3.CONTROLS.Data.Collection.ObservableTreeItem
    * @extends SBIS3.CONTROLS.Data.Collection.TreeItem
    * @mixes SBIS3.CONTROLS.Data.Bind.ICollection
    * @mixes SBIS3.CONTROLS.Data.Bind.ITree
    * @mixes SBIS3.CONTROLS.Data.Bind.IProperty
    * @mixes SBIS3.CONTROLS.Data.Collection.ObservableTreeItemMixin
    * @public
    * @author Мальцев Алексей
    */
   var ObservableTreeItem = TreeItem.extend([IBindCollection, IBindTree, IBindProperty, ObservableTreeItemMixin], /** @lends SBIS3.CONTROLS.Data.Collection.ObservableTreeItem.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Collection.ObservableTreeItem'
   });

   $ws.single.ioc.bind('SBIS3.CONTROLS.Data.Collection.ObservableTreeItem', function(config) {
      return new ObservableTreeItem(config);
   });

   return ObservableTreeItem;
});
