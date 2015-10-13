/* global define, $ws */
define('js!SBIS3.CONTROLS.HierarchyControl', [
   'js!SBIS3.CORE.CompoundControl',
   'js!SBIS3.CONTROLS.ListControlMixin',
   'js!SBIS3.CONTROLS.HierarchyControlMixin',
   'js!SBIS3.CONTROLS.HierarchyControl.HierarchyView'
], function(CompoundControl, ListControlMixin, HierarchyControlMixin, HierarchyControlView) {
   'use strict';

   /**
    * Контрол иерархии
    * *Это экспериментальный модуль, API будет меняться!*
    * @class SBIS3.CONTROLS.HierarchyControl
    * @extends SBIS3.CORE.CompoundControl
    * @mixes SBIS3.CONTROLS.ListControlMixin
    * @mixes SBIS3.CONTROLS.HierarchyControlMixin
    * @public
    * @state mutable
    * @author Крайнов Дмитрий Олегович
    */

   var HierarchyControl = CompoundControl.extend([ListControlMixin, HierarchyControlMixin], /** @lends SBIS3.CONTROLS.HierarchyControl.prototype */{
      _moduleName: 'SBIS3.CONTROLS.HierarchyControl',

      $constructor: function() {
         this._initView();
      }
   });

   return HierarchyControl;
});
