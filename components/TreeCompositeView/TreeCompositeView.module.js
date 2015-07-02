define('js!SBIS3.CONTROLS.TreeCompositeView', ['js!SBIS3.CONTROLS.TreeDataGrid', 'js!SBIS3.CONTROLS.CompositeViewMixin'], function(TreeDataGrid, CompositeViewMixin) {
   'use strict';

   var TreeCompositeView = TreeDataGrid.extend([CompositeViewMixin],/** @lends SBIS3.CONTROLS.TreeDataGrid.prototype*/ {

      _elemClickHandler: function (id, data, target) {
         var $target = $(target),
             nodeID,
             handler = function() {
                this._notify('onItemClick', id, data, target);
                this._options.elemClickHandler && this._options.elemClickHandler.call(this, id, data, target);
                nodeID = $target.closest('.controls-ListView__item').data('id');
                if (this._dataSet.getRecordByKey(nodeID).get(this._options.hierField + '@')) {
                   this.setCurrentRoot(nodeID);
                }
             }.bind(this);

         if (this._options.viewMode == 'table') {
            TreeCompositeView.superclass._elemClickHandler.call(this, id, data, target);
         }
         else {
            if (this._options.multiselect) {
               if ($target.hasClass('js-controls-ListView__itemCheckBox') || $target.hasClass('controls-ListView__itemCheckBox')) {
                  this.toggleItemsSelection([$target.closest('.controls-ListView__item').data('id')]);
               }
               else {
                  handler();
               }
            } else {
               this.setSelectedKeys([id]);
               handler();
            }
         }
      },
      _updateEditInPlaceDisplay: function() {
         if(this.getViewMode() === 'table') {
            TreeCompositeView.superclass._updateEditInPlaceDisplay.apply(this, arguments);
         }
      },
      _getTargetContainer: function (item) {
         if (this.getViewMode() != 'table' && item.get(this._options.hierField + '@')) {
            return  $('.controls-CompositeView__foldersContainer',this._container);
         }
         return this._getItemsContainer();
      },
      _getItemActionsPosition: function(hoveredItem) {
         var itemActions = this.getItemsActions().getContainer(),
             height = itemActions[0].offsetHeight || itemActions.height(),
             isTableView = this.getViewMode() === 'table';

         return {
            top: hoveredItem.position.top + ((isTableView) ? (hoveredItem.size.height > height ? hoveredItem.size.height - height : 0) : 0),
            right: isTableView ? 0 : this._container[0].offsetWidth - (hoveredItem.position.left + hoveredItem.size.width)
         };
      }

   });

   return TreeCompositeView;

});