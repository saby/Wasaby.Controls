/* global define, console, $ws */
define('js!SBIS3.CONTROLS.TreeCompositeViewControl', [
   'js!SBIS3.CONTROLS.TreeDataGridControl',
   'js!SBIS3.CONTROLS.CompositeViewMixinNew',   
   'js!SBIS3.CONTROLS.CompositeViewControl.CompositeView'
], function (TreeDataGridControl, CompositeViewMixin, CompositeView) {
   'use strict';

   /**
    * Контрол, отображающий набор данных в виде таблицы с несколькими колонками.
    * *Это экспериментальный модуль, API будет меняться!*
    * @class SBIS3.CONTROLS.DataGridControl
    * @extends SBIS3.CONTROLS.ListControl
    * @control
    * @public
    * @state mutable
    * @demo SBIS3.CONTROLS.Demo.MyDataGridView
    * @initial
    * <component data-component='SBIS3.CONTROLS.DataGridControl'>
    *    <options name="columns" type="array">
    *       <options>
    *          <option name="title">Поле 1</option>
    *          <option name="width">100</option>
    *       </options>
    *       <options>
    *          <option name="title">Поле 2</option>
    *       </options>
    *    </options>
    * </component>
    */

   var CompositeViewControl = TreeDataGridControl.extend([CompositeViewMixin],/** @lends SBIS3.CONTROLS.CompositeViewControl.prototype*/ {
      _moduleName: 'SBIS3.CONTROLS.TreeCompositeViewControl',
      $protected: {
         _options: {

         },

         _viewConstructor: CompositeView,

         _view: undefined
      },

      $constructor: function () {

      },
   });

   return CompositeViewControl;
});