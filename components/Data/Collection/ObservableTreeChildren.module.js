/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Collection.ObservableTreeChildren', [
   'js!SBIS3.CONTROLS.Data.Collection.TreeChildren',
   'js!SBIS3.CONTROLS.Data.Collection.ObservableListMixin',
   'js!SBIS3.CONTROLS.Data.Collection.ObservableTreeChildrenMixin'
], function (TreeChildren, ObservableListMixin, ObservableTreeChildrenMixin) {
   'use strict';

   /**
    * Коллекция дочерних элементов узла дерева, в которой можно отслеживать изменения.
    * @class SBIS3.CONTROLS.Data.Collection.ObservableTreeChildren
    * @extends SBIS3.CONTROLS.Data.Collection.TreeChildren
    * @mixes SBIS3.CONTROLS.Data.Collection.ObservableListMixin
    * @mixes SBIS3.CONTROLS.Data.Collection.ObservableTreeChildrenMixin
    * @public
    * @author Мальцев Алексей
    */

   var ObservableTreeChildren = TreeChildren.extend([ObservableListMixin, ObservableTreeChildrenMixin], /** @lends SBIS3.CONTROLS.Data.Collection.TreeChildren.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Collection.ObservableTreeChildren'
   });

   $ws.single.ioc.bind('SBIS3.CONTROLS.Data.Collection.ObservableTreeChildren', function(config) {
      return new ObservableTreeChildren(config);
   });

   return ObservableTreeChildren;
});
