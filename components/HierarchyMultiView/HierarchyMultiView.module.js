define('js!SBIS3.CONTROLS.HierarchyMultiView', ['js!SBIS3.CONTROLS.TreeDataGrid', 'js!SBIS3.CONTROLS.MultiViewMixin'], function(TreeDataGrid, MultiViewMixin) {
   'use strict';

   var HierarchyMultiView = TreeDataGrid.extend([MultiViewMixin],/** @lends SBIS3.CONTROLS.TreeDataGrid.prototype*/ {

      _elemClickHandler: function (id, data, target) {
         if (this._options.viewMode == 'table') {
            HierarchyMultiView.superclass._elemClickHandler.call(this, id, data, target);
         }
         else {
            if (this._options.multiselect) {
               if ($(target).hasClass('js-controls-ListView__itemCheckBox') || $(target).hasClass('controls-ListView__itemCheckBox')) {
                  var key = $(target).closest('.controls-ListView__item').data('id');
                  this.toggleItemsSelection([key]);
               }
               else {
                  this._notify('onItemClick', id, data, target);
                  if (this._options.elemClickHandler) {
                     this._options.elemClickHandler.call(this, id, data, target);
                  }
                  var nodeID = $(target).closest('.controls-ListView__item').data('id');
                  var rec = this._dataSet.getRecordByKey(nodeID);
                  if (rec.get(this._options.hierField + '@')) {
                     this.setCurrentRoot(nodeID);
                  }
               }
            } else {
               this._notify('onItemClick', id, data, target);
               this.setSelectedKeys([id]);
               if (this._options.elemClickHandler) {
                  this._options.elemClickHandler.call(this, id, data, target);
               }
            }
         }
      },

      _getTargetContainer: function (item) {
         if (this.getViewMode() != 'table' && item.get(this._options.hierField + '@')) {
            return  $('.controls-MultiView__foldersContainer',this._container);
         }
         return this._getItemsContainer();
      },
      _getItemActionsPosition: function(hoveredItem) {
         var viewMode = this.getViewMode(),
             itemActions = this.getItemsActions().getContainer(),
             height = itemActions.height(),
             width = itemActions.width();

         return {
            top: hoveredItem.position.top + ((viewMode !== 'tile' && viewMode !== 'list') ? (hoveredItem.size.height > height ? hoveredItem.size.height - height : 0) : 0),
            right: this._container[0].offsetWidth - (hoveredItem.position.left + hoveredItem.size.width)
         };
      }

   });

   return HierarchyMultiView;

});