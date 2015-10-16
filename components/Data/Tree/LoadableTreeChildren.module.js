/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Tree.LoadableTreeChildren', [
   'js!SBIS3.CONTROLS.Data.Tree.TreeChildren',
   'js!SBIS3.CONTROLS.Data.Query.IQueryable',
   'js!SBIS3.CONTROLS.Data.Collection.ISourceLoadable',
   'js!SBIS3.CONTROLS.Data.Collection.ObservableListMixin',
   'js!SBIS3.CONTROLS.Data.Collection.LoadableListMixin',
   'js!SBIS3.CONTROLS.Data.Tree.ObservableTreeChildrenMixin',
   'js!SBIS3.CONTROLS.Data.Tree.LoadableTreeChildrenMixin'
], function (TreeChildren, IQueryable, ISourceLoadable, ObservableListMixin, LoadableListMixin, ObservableTreeChildrenMixin, LoadableTreeChildrenMixin) {
   'use strict';

   /**
    * Коллекция дочерних элементов узла дерева, в которой можно отслеживать изменения.
    * @class SBIS3.CONTROLS.Data.Tree.LoadableTreeChildren
    * @extends SBIS3.CONTROLS.Data.Tree.TreeChildren
    * @mixes SBIS3.CONTROLS.Data.Query.IQueryable
    * @mixes SBIS3.CONTROLS.Data.Collection.ISourceLoadable
    * @mixes SBIS3.CONTROLS.Data.Collection.ObservableListMixin
    * @mixes SBIS3.CONTROLS.Data.Tree.ObservableTreeChildrenMixin
    * @mixes SBIS3.CONTROLS.Data.Collection.LoadableListMixin
    * @mixes SBIS3.CONTROLS.Data.Tree.LoadableTreeChildrenMixin
    * @public
    * @author Мальцев Алексей
    */

   var LoadableTreeChildren = TreeChildren.extend([IQueryable, ISourceLoadable, ObservableListMixin, ObservableTreeChildrenMixin, LoadableListMixin, LoadableTreeChildrenMixin], /** @lends SBIS3.CONTROLS.Data.Tree.LoadableTreeChildren.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Tree.LoadableTreeChildren'
   });

   $ws.single.ioc.bind('SBIS3.CONTROLS.Data.Tree.LoadableTreeChildren', function(config) {
      return new LoadableTreeChildren(config);
   });

   return LoadableTreeChildren;
});
