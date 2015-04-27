define('js!SBIS3.CONTROLS.HierarchyMultiView', ['js!SBIS3.CONTROLS.HierarchyDataGrid', 'js!SBIS3.CONTROLS.MultiViewMixin'], function(DataGrid, MultiViewMixin) {
   'use strict';

   var HierarchyMultiView = DataGrid.extend([MultiViewMixin],/** @lends SBIS3.CONTROLS.DataGrid.prototype*/ {
      _elemClickHandler: function (id, data, target) {
         if (this._options.viewMode == 'table') {
            HierarchyMultiView.superclass._elemClickHandler.call(this, id, data, target);
         }
         else {
            var nodeID = $(target).closest('.controls-ListView__item').data('id');
            this.toggleNode(nodeID);
         }
      }
   });

   return HierarchyMultiView;

});