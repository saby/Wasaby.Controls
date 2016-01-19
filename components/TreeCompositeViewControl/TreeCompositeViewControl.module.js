/* global define, console, $ws */
define('js!SBIS3.CONTROLS.TreeCompositeViewControl', [
   'js!SBIS3.CONTROLS.TreeDataGridControl',
   'js!SBIS3.CONTROLS.CompositeViewMixinNew',   
   'js!SBIS3.CONTROLS.CompositeViewControl.CompositeView'
], function (TreeDataGridControl, CompositeViewMixin, CompositeView) {
   'use strict';

   var CompositeViewControl = TreeDataGridControl.extend([CompositeViewMixin],/** @lends SBIS3.CONTROLS.CompositeViewControl.prototype*/ {
      _moduleName: 'SBIS3.CONTROLS.TreeCompositeViewControl',
      $protected: {
         _options: {

         },

         _viewConstructor: CompositeView,

         _view: undefined
      },

      $constructor: function () {

      }
   });

   return CompositeViewControl;
});