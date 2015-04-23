define('js!SBIS3.CONTROLS.MultiView', ['js!SBIS3.CONTROLS.DataGrid', 'html!SBIS3.CONTROLS.MultiView', 'js!SBIS3.CONTROLS.MultiViewMixin'], function(DataGrid, dotTpl, MultiViewMixin) {
   'use strict';

   var MultiView = DataGrid.extend([MultiViewMixin],/** @lends SBIS3.CONTROLS.DataGrid.prototype*/ {
      _dotTplFn : dotTpl,
      $protected: {

      }


   });

   return MultiView;

});