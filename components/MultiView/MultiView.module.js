define('js!SBIS3.CONTROLS.MultiView', ['js!SBIS3.CONTROLS.DataGrid', 'js!SBIS3.CONTROLS.CompositeViewMixin'], function(DataGrid, MultiViewMixin) {
   'use strict';

   var MultiView = DataGrid.extend([MultiViewMixin],/** @lends SBIS3.CONTROLS.DataGrid.prototype*/ {

      $protected: {

      }

   });

   return MultiView;

});