/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Collection.LoadableTreeChildren', [
   'js!SBIS3.CONTROLS.Data.Collection.TreeChildren',
   'js!SBIS3.CONTROLS.Data.Collection.ObservableListMixin',
   'js!SBIS3.CONTROLS.Data.Collection.LoadableListMixin',
   'js!SBIS3.CONTROLS.Data.Collection.ObservableTreeChildrenMixin',
   'js!SBIS3.CONTROLS.Data.Collection.LoadableTreeChildrenMixin'
], function (TreeChildren, ObservableListMixin, LoadableListMixin, ObservableTreeChildrenMixin, LoadableTreeChildrenMixin) {
   'use strict';

   /**
    * Коллекция дочерних элементов узла дерева, в которой можно отслеживать изменения.
    * @class SBIS3.CONTROLS.Data.Collection.LoadableTreeChildren
    * @extends SBIS3.CONTROLS.Data.Collection.TreeChildren
    * @mixes SBIS3.CONTROLS.Data.Collection.ObservableListMixin
    * @mixes SBIS3.CONTROLS.Data.Collection.ObservableTreeChildrenMixin
    * @mixes SBIS3.CONTROLS.Data.Collection.LoadableListMixin
    * @mixes SBIS3.CONTROLS.Data.Collection.LoadableTreeChildrenMixin
    * @public
    * @author Мальцев Алексей
    */

   var LoadableTreeChildren = TreeChildren.extend([ObservableListMixin, ObservableTreeChildrenMixin, LoadableListMixin, LoadableTreeChildrenMixin], /** @lends SBIS3.CONTROLS.Data.Collection.LoadableTreeChildren.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Collection.LoadableTreeChildren'
   });

   return LoadableTreeChildren;
});
