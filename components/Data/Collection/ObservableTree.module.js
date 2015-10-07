/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Collection.ObservableTree', [
   'js!SBIS3.CONTROLS.Data.Collection.ObservableTreeItem',
   'js!SBIS3.CONTROLS.Data.Collection.TreeMixin'
], function (ObservableTreeItem, TreeMixin) {
   'use strict';

   /**
    * Дерево в котором можно отслеживать изменения.
    * @class SBIS3.CONTROLS.Data.Collection.ObservableTree
    * @extends SBIS3.CONTROLS.Data.Collection.ObservableTreeItem
    * @mixes SBIS3.CONTROLS.Data.Collection.TreeMixin
    * @public
    * @author Мальцев Алексей
    */

   var ObservableTree = ObservableTreeItem.extend([TreeMixin], /** @lends SBIS3.CONTROLS.Data.Collection.ObservableTree.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Collection.ObservableTree'
   });

   return ObservableTree;
});
