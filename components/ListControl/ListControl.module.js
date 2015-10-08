/* global define, $ws */
define('js!SBIS3.CONTROLS.ListControl', [
   'js!SBIS3.CORE.CompoundControl',
   'js!SBIS3.CONTROLS.CollectionControlMixin',
   'js!SBIS3.CONTROLS.ListControlMixin',
   'js!SBIS3.CONTROLS.SelectableNew'
], function(CompoundControl, CollectionControlMixin, ListControlMixin, Selectable) {
   'use strict';

   /**
    * Контрол, отображающий внутри себя список элементов.
    * Умеет отображать каждый элемента списка по определенному шаблону.
    * @class SBIS3.CONTROLS.ListControl
    * @extends SBIS3.CORE.CompoundControl
    * @mixes SBIS3.CONTROLS.CollectionControlMixin
    * @mixes SBIS3.CONTROLS.ListControlMixin
    * @mixes SBIS3.CONTROLS.SelectableNew
    * @public
    * @author Крайнов Дмитрий Олегович
    */

   var ListControl = CompoundControl.extend([CollectionControlMixin, ListControlMixin, Selectable], /** @lends SBIS3.CONTROLS.ListControl.prototype */{
      _moduleName: 'SBIS3.CONTROLS.ListControl',

      $constructor: function() {
         this._initView();
      }
   });

   return ListControl;
});
