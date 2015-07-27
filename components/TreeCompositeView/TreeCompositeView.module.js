define('js!SBIS3.CONTROLS.TreeCompositeView', ['js!SBIS3.CONTROLS.TreeDataGrid', 'js!SBIS3.CONTROLS.CompositeViewMixin', 'html!SBIS3.CONTROLS.TreeCompositeView/resources/CompositeView__folderTpl'], function(TreeDataGrid, CompositeViewMixin, folderTpl) {
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
      _getItemTemplate: function(item) {
         var resultTpl, dotTpl;
            switch (this._options.viewMode) {
               case 'table': resultTpl = TreeCompositeView.superclass._getItemTemplate.call(this, item); break;
               case 'list': {
                  if (item.get(this._options.hierField + '@')) {
                     dotTpl = folderTpl;
                  } else {
                     if (this._options.listTemplate) {
                        if (this._options.listTemplate instanceof Function) {
                           dotTpl = this._options.listTemplate;
                        } else {
                           dotTpl = doT.template(this._options.listTemplate);
                        }
                     }
                     else {
                        dotTpl = doT.template('<div style="{{=it.decorators.apply(it.color, \'color\')}}">{{=it.decorators.apply($ws.helpers.escapeHtml(it.item.get(it.description)))}}</div>');
                     }
                  }
                  resultTpl = dotTpl({
                     item: item,
                     decorators: this._decorators,
                     color: this._options.colorField ? item.get(this._options.colorField) : '',
                     description: this._options.displayField,
                     image: this._options.imageField
                  });
                  break;
               }
               case 'tile' : {
                  if (item.get(this._options.hierField + '@')) {
                     dotTpl = folderTpl;
                  } else {
                     if (this._options.tileTemplate) {
                        if (this._options.tileTemplate instanceof Function) {
                           dotTpl = this._options.tileTemplate;
                        } else {
                           dotTpl = doT.template(this._options.tileTemplate);
                        }
                     }
                     else {
                        var src;
                        if (!item.get(this._options.imageField)) {
                           src = item.get(this._options.hierField + '@') ? $ws._const.resourceRoot + 'SBIS3.CONTROLS/themes/online/img/defaultFolder.png' : $ws._const.resourceRoot + 'SBIS3.CONTROLS/themes/online/img/defaultItem.png';
                        } else {
                           src = '{{=it.item.get(it.image)}}';
                        }
                        dotTpl = doT.template('<div><div class="controls-ListView__itemCheckBox js-controls-ListView__itemCheckBox"></div><img class="controls-CompositeView__tileImg" src="' + src + '"/><div class="controls-CompositeView__tileTitle" style="{{=it.decorators.apply(it.color, \'color\')}}">{{=it.decorators.apply($ws.helpers.escapeHtml(it.item.get(it.description)))}}</div></div>');
                     }
                  }
                  resultTpl = dotTpl({
                     item: item,
                     decorators: this._decorators,
                     color: this._options.colorField ? item.get(this._options.colorField) : '',
                     description: this._options.displayField,
                     image: this._options.imageField
                  });
                  break;
               }

            }
            return resultTpl;
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
            //TODO right = 5 hotFix для того чтобы меню разворачивалось в нужную сторону
            right: isTableView ? 5 : this._container[0].offsetWidth - (hoveredItem.position.left + hoveredItem.size.width)
         };
      },
      _processPaging: function() {
         TreeCompositeView.superclass._processPaging.call(this);
         this._processPagingStandart();
      }

   });

   return TreeCompositeView;

});