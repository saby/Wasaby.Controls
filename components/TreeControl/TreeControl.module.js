/* global define, $ws */
define('js!SBIS3.CONTROLS.TreeControl', [
   'js!SBIS3.CORE.CompoundControl',
   'js!SBIS3.CONTROLS.CollectionControlMixin',
   'js!SBIS3.CONTROLS.ListControlMixin',
   'js!SBIS3.CONTROLS.HierarchyControlMixin',
   'js!SBIS3.CONTROLS.TreeControlMixin'
], function(CompoundControl, CollectionControlMixin, ListControlMixin, HierarchyControlMixin, TreeControlMixin) {
   'use strict';

   /**
    * Контрол дерева
    * *Это экспериментальный модуль, API будет меняться!*
    * @class SBIS3.CONTROLS.TreeControl
    * @extends SBIS3.CORE.CompoundControl
    * @mixes SBIS3.CONTROLS.CollectionControlMixin
    * @mixes SBIS3.CONTROLS.ListControlMixin
    * @mixes SBIS3.CONTROLS.HierarchyControlMixin
    * @mixes SBIS3.CONTROLS.TreeControlMixin
    * @public
    * @state mutable
    * @author Крайнов Дмитрий Олегович
    */

   var TreeControl = CompoundControl.extend([CollectionControlMixin, ListControlMixin, HierarchyControlMixin, TreeControlMixin], /** @lends SBIS3.CONTROLS.TreeControl.prototype */{
      _moduleName: 'SBIS3.CONTROLS.TreeControl',

      $constructor: function() {
         this._initView();
      }
   });

   return TreeControl;
});
