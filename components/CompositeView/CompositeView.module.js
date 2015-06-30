define('js!SBIS3.CONTROLS.CompositeView', ['js!SBIS3.CONTROLS.DataGrid', 'js!SBIS3.CONTROLS.CompositeViewMixin'], function(DataGrid, CompositeViewMixin) {
   'use strict';

   var CompositeView = DataGrid.extend([CompositeViewMixin],/** @lends SBIS3.CONTROLS.DataGrid.prototype*/ {

      $protected: {

      }

   });

   return CompositeView;

});