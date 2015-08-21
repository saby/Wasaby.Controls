define('js!SBIS3.CONTROLS.CompositeView', ['js!SBIS3.CONTROLS.DataGridView', 'js!SBIS3.CONTROLS.CompositeViewMixin'], function(DataGridView, CompositeViewMixin) {
   'use strict';

   var CompositeView = DataGridView.extend([CompositeViewMixin],/** @lends SBIS3.CONTROLS.DataGridView.prototype*/ {

      $protected: {

      }

   });

   return CompositeView;

});