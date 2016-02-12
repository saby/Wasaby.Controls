/* global define, console, $ws */
define('js!SBIS3.CONTROLS.CompositeViewControl', [
   'js!SBIS3.CONTROLS.DataGridControl',
   'js!SBIS3.CONTROLS.CompositeViewMixinNew',   
   'js!SBIS3.CONTROLS.CompositeViewControl.CompositeView'
], function (DataGridControl, CompositeViewMixin, CompositeView) {
   'use strict';

   var CompositeViewControl = DataGridControl.extend([CompositeViewMixin],/** @lends SBIS3.CONTROLS.CompositeViewControl.prototype*/ {
      _moduleName: 'SBIS3.CONTROLS.CompositeViewControl',
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