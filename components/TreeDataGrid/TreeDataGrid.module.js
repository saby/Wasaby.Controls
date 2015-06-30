define('js!SBIS3.CONTROLS.TreeDataGrid', [
   'js!SBIS3.CONTROLS.HierarchyDataGrid',
   'js!SBIS3.CONTROLS.TreeMixinDS',
   'html!SBIS3.CONTROLS.TreeDataGrid/resources/rowTpl'
], function(HierarchyDataGrid, TreeMixin, rowTpl) {
   'use strict';
   /**
    * Контрол отображающий набор данных, имеющих иерархическую структуру, в виде в таблицы с несколькими колонками.
    * @class SBIS3.CONTROLS.TreeDataGrid
    * @extends SBIS3.CONTROLS.DataGrid
    * @mixes SBIS3.CONTROLS.TreeMixin
    * @public
    * @control
    * @initial
    * <component data-component='SBIS3.CONTROLS.TreeDataGrid'>
    *    <options name="columns" type="array">
    *       <options>
    *          <option name="title">Поле 1</option>
    *          <option name="width">100</option>
    *       </options>
    *       <options>
    *          <option name="title">Поле 2</option>
    *       </options>
    *    </options>
    * </component>
    */

   var TreeDataGrid = HierarchyDataGrid.extend([TreeMixin], /** @lends SBIS3.CONTROLS.TreeDataGrid.prototype*/ {
      $protected: {
         _rowTpl : rowTpl,
         _options: {
           arrowActivatedHandler: undefined
         }
      },

      $constructor: function() {
      },

      _nodeDataLoaded : function(key, dataSet) {
         /*TODO Копипаст с TreeView*/
         var
            self = this,
            itemCont = $('.controls-ListView__item[data-id="' + key + '"]', this.getContainer().get(0));
         $('.js-controls-TreeView__expand', itemCont).first().addClass('controls-TreeView__expand__open');

         //при раскрытии узла по стрелке приходит новый датасет, в котором только содержимое узла
         //поэтому удалять из текущего датасета ничего не нужно, только добавить новое.
         this._dataSet.merge(dataSet, {remove: false});
         this._dataSet._reindexTree(this._options.hierField);

         dataSet.each(function (record) {
            var
               recKey = record.getKey(),
               parKey = self._dataSet.getParentKey(record, self._options.hierField),
               targetContainer = self._getTargetContainer(record);

            if (!$('.controls-ListView__item[data-id="'+recKey+'"]', self._getItemsContainer().get(0)).length) {

               if (targetContainer) {
                  /*TODO пока придрот для определения позиции вставки*/
                  var
                     parentContainer = $('.controls-ListView__item[data-id="' + parKey + '"]', self._getItemsContainer().get(0)),
                     allContainers = $('.controls-ListView__item', self._getItemsContainer().get(0)),
                     at = {at: 0};
                  for (var i = 0; i < allContainers.length; i++) {
                     if (allContainers[i] == parentContainer.get(0)) {
                        at = {at: i + 1};
                     } else if ($(allContainers[i]).data('parent') == parentContainer.data('id')) {
                        at.at++;
                     }
                  }
                  /**/
                  if (self._options.displayType == 'folders') {
                     if (record.get(self._options.hierField + '@')) {
                        self._drawItem(record, at);
                     }

                  }
                  else {
                     self._drawItem(record, at);
                     self._drawItemsCallback();
                  }
               }
            }
         });
      },

      _nodeClosed : function(key) {
         var childKeys = this._dataSet.getChildItems(key, true, this._options.hierField);
         for (var i = 0; i < childKeys.length; i++) {
            $('.controls-ListView__item[data-id="' + childKeys[i] + '"]', this._container.get(0)).remove();
         }

      },

      _addItemAttributes : function(container, item) {
          TreeDataGrid.superclass._addItemAttributes.call(this, container, item);
          var parentKey = this._dataSet.getParentKey(item, this._options.hierField),
            parentContainer = $('.controls-ListView__item[data-id="' + parentKey + '"]', this._container.get(0)).get(0);
          container.attr('data-parent', parentKey);
          /*TODO пока придрот*/
          if (typeof parentKey != 'undefined' && parentKey !== null && parentContainer) {
            var parentWrappersCount = $('.controls-TreeView__hierWrapper', parentContainer).length;
            for (var i = 0; i <= parentWrappersCount; i++) {
              $('.controls-TreeView__expand', container).before('<div class="controls-TreeView__hierWrapper"></div>');
            }
         }
      },

      _elemClickHandlerInternal: function (data, id, target) {
         var nodeID = $(target).closest('.controls-ListView__item').data('id');
         if ($(target).hasClass('js-controls-TreeView__expand') && $(target).hasClass('has-child')) {
            this.toggleNode(nodeID);
         }
         else {
          if($(target).hasClass('js-controls-TreeView__editArrow')){
            if (this._options.arrowActivatedHandler) {
              this._options.arrowActivatedHandler.apply(this, arguments);
            }
          } else if (data.get(this._options.hierField+'@')) {
               var self = this;
               self.setCurrentRoot(nodeID);
            }
         }
      }
   });

   return TreeDataGrid;

});