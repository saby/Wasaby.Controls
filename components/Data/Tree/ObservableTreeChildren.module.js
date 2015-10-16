/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Tree.ObservableTreeChildren', [
   'js!SBIS3.CONTROLS.Data.Tree.TreeChildren',
   'js!SBIS3.CONTROLS.Data.Collection.ObservableListMixin',
   'js!SBIS3.CONTROLS.Data.Tree.ObservableTreeChildrenMixin'
], function (TreeChildren, ObservableListMixin, ObservableTreeChildrenMixin) {
   'use strict';

   /**
    * Коллекция дочерних элементов узла дерева, в которой можно отслеживать изменения.
    * @class SBIS3.CONTROLS.Data.Tree.ObservableTreeChildren
    * @extends SBIS3.CONTROLS.Data.Tree.TreeChildren
    * @mixes SBIS3.CONTROLS.Data.Collection.ObservableListMixin
    * @mixes SBIS3.CONTROLS.Data.Tree.ObservableTreeChildrenMixin
    * @public
    * @author Мальцев Алексей
    */

   var ObservableTreeChildren = TreeChildren.extend([ObservableListMixin, ObservableTreeChildrenMixin], /** @lends SBIS3.CONTROLS.Data.Tree.TreeChildren.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Tree.ObservableTreeChildren'
   });

   $ws.single.ioc.bind('SBIS3.CONTROLS.Data.Tree.ObservableTreeChildren', function(config) {
      return new ObservableTreeChildren(config);
   });

   return ObservableTreeChildren;
});
