/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Collection.Tree', [
   'js!SBIS3.CONTROLS.Data.Collection.TreeItem',
   'js!SBIS3.CONTROLS.Data.Collection.TreeMixin'
], function (TreeItem, TreeMixin) {
   'use strict';

   /**
    * Дерево.
    * @class SBIS3.CONTROLS.Data.Collection.Tree
    * @extends SBIS3.CONTROLS.Data.Collection.TreeItem
    * @mixes SBIS3.CONTROLS.Data.Collection.TreeMixin
    * @public
    * @author Мальцев Алексей
    */

   return TreeItem.extend([TreeMixin], /** @lends SBIS3.CONTROLS.Data.Collection.Tree.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Collection.Tree'
   });
});
