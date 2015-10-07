/* global define, $ws */
define('js!SBIS3.CONTROLS.HierarchyControl', [
   'js!SBIS3.CORE.CompoundControl',
   'js!SBIS3.CONTROLS.CollectionControlMixin',
   'js!SBIS3.CONTROLS.HierarchyControlMixin',
   'js!SBIS3.CONTROLS.HierarchyControl.HierarchyView'
], function(CompoundControl, CollectionControlMixin, HierarchyControlMixin, HierarchyControlView) {
   'use strict';

   /**
    * Контрол иерархии
    * @class SBIS3.CONTROLS.HierarchyControl
    * @extends SBIS3.CORE.CompoundControl
    * @mixes SBIS3.CONTROLS.CollectionControlMixin
    * @mixes SBIS3.CONTROLS.HierarchyControlMixin
    * @public
    * @author Крайнов Дмитрий Олегович
    */

   var HierarchyControl = CompoundControl.extend([CollectionControlMixin, HierarchyControlMixin], /** @lends SBIS3.CONTROLS.HierarchyControl.prototype */{
      _moduleName: 'SBIS3.CONTROLS.HierarchyControl',

      $constructor: function() {
         this._initView();
      }
   });

   return HierarchyControl;
});
