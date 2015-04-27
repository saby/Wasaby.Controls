define('js!SBIS3.CONTROLS.MultiView', ['js!SBIS3.CONTROLS.DataGrid', 'js!SBIS3.CONTROLS.MultiViewMixin'], function(DataGrid, MultiViewMixin) {
   'use strict';

   var MultiView = DataGrid.extend([MultiViewMixin],/** @lends SBIS3.CONTROLS.DataGrid.prototype*/ {

      $protected: {

      },

      _getHoveredItemConfig: function(target){
         if (this._options.viewMode != 'tile'){
            return MultiView.superclass._getHoveredItemConfig.call(this, target);
         }
         return {
            key: target.data('id'),
            container: target,
            position: {
               top: target[0].offsetTop + 30,
               left: target[0].offsetLeft - 5
            },
            size: {
               height: 0,
               width: target[0].offsetWidth
            }
         };
      }

   });

   return MultiView;

});