define('js!SBIS3.CONTROLS.HierarchyMultiView', ['js!SBIS3.CONTROLS.HierarchyDataGrid', 'js!SBIS3.CONTROLS.MultiViewMixin'], function(DataGrid, MultiViewMixin) {
   'use strict';

   var HierarchyMultiView = DataGrid.extend([MultiViewMixin],/** @lends SBIS3.CONTROLS.DataGrid.prototype*/ {
      _elemClickHandler: function (id, data, target) {
         if (this._options.viewMode == 'table') {
            HierarchyMultiView.superclass._elemClickHandler.call(this, id, data, target);
         }
         else {
            var nodeID = $(target).closest('.controls-ListView__item').data('id');
            var rec = this._dataSet.getRecordByKey(nodeID);
            if (rec.get('par@')) {
               this.toggleNode(nodeID);
            }
         }
      },

      _getTargetContainer: function (item) {
         if (this.getViewMode() == 'tile' && item.get('par@')) {
            return  $('.controls-MultiView__foldersContainer',this._container);
         }
         return this._getItemsContainer();
      }
   });

   return HierarchyMultiView;

});