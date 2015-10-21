define('js!SBIS3.CONTROLS.TreeDataGridView', [
   'js!SBIS3.CONTROLS.HierarchyDataGridView',
   'js!SBIS3.CONTROLS.TreeMixinDS',
   'js!SBIS3.CONTROLS.DragNDropMixin',
   'html!SBIS3.CONTROLS.TreeDataGridView/resources/rowTpl'
], function(HierarchyDataGridView, TreeMixinDS, DragNDropMixin, rowTpl) {
   'use strict';
   /**
    * Контрол отображающий набор данных, имеющих иерархическую структуру, в виде в таблицы с несколькими колонками.
    * @class SBIS3.CONTROLS.TreeDataGridView
    * @extends SBIS3.CONTROLS.HierarchyDataGridView
    * @mixes SBIS3.CONTROLS.TreeMixinDS
    * @public
    * @author Крайнов Дмитрий Олегович
    * @control
    * @initial
    * <component data-component='SBIS3.CONTROLS.TreeDataGridView'>
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
    *
    * @demo SBIS3.CONTROLS.Demo.MyTreeDataGridView
    *
    */

   var TreeDataGridView = HierarchyDataGridView.extend([TreeMixinDS, DragNDropMixin], /** @lends SBIS3.CONTROLS.TreeDataGridView.prototype*/ {
      $protected: {
         _rowTpl : rowTpl,
         _options: {
            /**
             * @cfg {Boolean}
             * Разрешить проваливаться в папки
             * Если выключено, то папки можно открывать только в виде дерева, проваливаться в них нельзя
             */
            allowEnterToFolder: true,
            /**
             * @cfg {Function}
             * Обработчик нажатия на стрелку у папок. Если не задан, стрелка показана не будет
             */
            arrowActivatedHandler: undefined,
            /**
            * @cfg {Boolean}
            * Разрешить перемещать элементы с помощью DragAndDrop
            */
            allowDragNDropMove: true
         },
         _dragStartHandler: undefined
      },

      $constructor: function() {
         if (this._options.allowDragNDropMove) {
            this._dragStartHandler = this._onDragStart.bind(this);
            this._getItemsContainer().bind('mousedown', this._dragStartHandler);
         }
      },

      _drawItemsFolder: function(records) {
         var self = this;
         for (var j = 0; j < records.length; j++) {
            var record = records[j];
            var
               recKey = record.getKey(),
               parKey = self._dataSet.getParentKey(record, self._options.hierField),
               childKeys = this._dataSet.getChildItems(parKey, true),
               targetContainer = self._getTargetContainer(record);

            if (!$('.controls-ListView__item[data-id="'+recKey+'"]', self._getItemsContainer().get(0)).length) {

               if (targetContainer) {
                  /*TODO пока придрот для определения позиции вставки*/
                  var
                     parentContainer = $('.controls-ListView__item[data-id="' + parKey + '"]', self._getItemsContainer().get(0)),
                     allContainers = $('.controls-ListView__item', self._getItemsContainer().get(0)),
                     startRow = 0;

                  for (var i = 0; i < allContainers.length; i++) {
                     if (allContainers[i] == parentContainer.get(0)) {
                        startRow = i + 1;
                     } else {
                        if (childKeys.indexOf($(allContainers[i]).data('id')) >= 0) {
                           startRow++;
                        }
                     }
                     /*else {
                        if ()
                     }*/
                  }
                  /**/
                  if (self._options.displayType == 'folders') {
                     if (record.get(self._options.hierField + '@')) {
                        self._drawAndAppendItem(record, {at : startRow});
                     }

                  }
                  else {
                     self._drawAndAppendItem(record, {at : startRow});
                  }
               }
            }
         }
         self._drawItemsCallback();
      },

      _nodeDataLoaded : function(key, dataSet) {
         /*TODO Копипаст с TreeView*/
         var
            self = this,
            itemCont = $('.controls-ListView__item[data-id="' + key + '"]', this.getContainer().get(0));
         $('.js-controls-TreeView__expand', itemCont).first().addClass('controls-TreeView__expand__open');
         this._options.openedPath[key] = true;

         //при раскрытии узла по стрелке приходит новый датасет, в котором только содержимое узла
         //поэтому удалять из текущего датасета ничего не нужно, только добавить новое.
         this._dataSet.merge(dataSet, {remove: false});
         this._dataSet._reindexTree(this._options.hierField);

         var
            records = dataSet._getRecords();

         this._drawItemsFolder(records);
         /*TODO пока не очень общо создаем внутренние пэйджинги*/
         var allContainers = $('.controls-ListView__item[data-parent="'+key+'"]', self._getItemsContainer().get(0));
         var row = $('<tr class="controls-TreeDataGridView__folderToolbar">' +
            '<td colspan="'+(this._options.columns.length+(this._options.multiselect ? 1 : 0))+'"><div style="overflow:hidden" class="controls-TreeDataGridView__folderToolbarContainer"><div class="controls-TreePager-container"></div></div></td>' +
            '</tr>').attr('data-parent',key);
         $(allContainers.last()).after(row);
         this._resizeFolderToolbars();
         var elem = $('.controls-TreePager-container', row.get(0));
         this._createFolderPager(key, elem, dataSet.getMetaData().more);
      },

      _onResizeHandler: function() {
         TreeDataGridView.superclass._onResizeHandler.apply(this, arguments);
         this._resizeFolderToolbars();
      },

      _resizeFolderToolbars: function() {
         var toolbars = $('.controls-TreeDataGridView__folderToolbarContainer', this._container.get(0));
         var width = this._container.width();
         toolbars.width(width);
      },

      _keyboardHover: function(e) {
         var parentResult = TreeDataGridView.superclass._keyboardHover.apply(this, arguments),
             selectedKey = this.getSelectedKey(),
             rec = this._dataSet.getRecordByKey(selectedKey),
             isBranch = rec && rec.get(this._options.hierField);

         switch(e.which) {
            case $ws._const.key.right:
               isBranch && this.expandNode(selectedKey);
               break;
            case $ws._const.key.left:
               isBranch && this.collapseNode(selectedKey);
               break;
         }
         return parentResult;
      },

      _drawItemsFolderLoad: function(records, id) {
         if (!id) {
            this._drawItems(records);
         }
         else {
            this._drawItemsFolder(records);
         }
      },

      destroyFolderToolbar: function(id) {
         var
            container = $('.controls-TreeDataGridView__folderToolbar' + (id ? '[data-parent="' + id + '"]' : ''), this._container.get(0));
            container.remove();

         if (id) {
            if (this._treePagers[id]) {
               this._treePagers[id].destroy();
            }
         }
         else {
            for (var i in this._treePagers) {
               if (this._treePagers.hasOwnProperty(i)) {
                  this._treePagers[i].destroy();
               }
            }
         }
      },

      _nodeClosed : function(key) {
         var childKeys = this._dataSet.getChildItems(key, true, this._options.hierField);
         for (var i = 0; i < childKeys.length; i++) {
            $('.controls-ListView__item[data-id="' + childKeys[i] + '"]', this._getItemsContainer().get(0)).remove();
            delete(this._options.openedPath[childKeys[i]]);
         }
         /*TODO кажется как то нехорошо*/
         $('.controls-TreeDataGridView__folderToolbar[data-parent="'+key+'"]').remove();
         if (this._treePagers[key]) {
            this._treePagers[key].destroy();
         }

      },

      _addItemAttributes : function(container, item) {
         TreeDataGridView.superclass._addItemAttributes.call(this, container, item);
         if (item.get(this._options.hierField + '@')){
         	container.addClass('controls-ListView__folder');
         }
         var
            key = item.getKey(),
            parentKey = this._dataSet.getParentKey(item, this._options.hierField),
         	parentContainer = $('.controls-ListView__item[data-id="' + parentKey + '"]', this._getItemsContainer().get(0)).get(0);
         container.attr('data-parent', parentKey);

         if (this._options.openedPath[key]) {
            $('.js-controls-TreeView__expand', container).addClass('controls-TreeView__expand__open');
         }
         /*TODO пока придрот*/
         if (typeof parentKey != 'undefined' && parentKey !== null && parentContainer) {
            var parentWrappersCount = $('.controls-TreeView__hierWrapper', parentContainer).length;
            for (var i = 0; i <= parentWrappersCount; i++) {
              $('.controls-TreeView__expand', container).before('<div class="controls-TreeView__hierWrapper"></div>');
            }
         }
      },

      _elemClickHandlerInternal: function(data, id, target) {
         var nodeID = $(target).closest('.controls-ListView__item').data('id');
         if ($(target).hasClass('js-controls-TreeView__expand') && $(target).hasClass('has-child')) {
            this.toggleNode(nodeID);
         } else {
            if (this._options.allowEnterToFolder){
               if ($(target).hasClass('js-controls-TreeView__editArrow')) {
                  if (this._options.arrowActivatedHandler) {
                     this._options.arrowActivatedHandler.apply(this, arguments);
                  }
               } else if (data.get(this._options.hierField + '@')) {
                  this.setCurrentRoot(nodeID);
                  this.reload();
               }
            } else {
               if (data.get(this._options.hierField + '@')) {
                  this.toggleNode(nodeID);
               }
            }
         }
      },
      /*DRAG_AND_DROP START*/
      _findDragDropContainer: function() {
         return this._getItemsContainer();
      },
      _getDragItems: function(key) {
         var keys = this._options.multiselect ? $ws.core.clone(this.getSelectedKeys()) : [];
         if ($.inArray(key, keys) < 0) {
            keys.push(key);
         }
         return keys;
      },
      _onDragStart: function(e) {
         var
            target = $(e.target),
            id = target.closest('.controls-ListView__item').data('id');
         if (id) {
            this.setSelectedKey(id);
            this.setCurrentElement(e, this._getDragItems(id));
         }
         e.preventDefault();
      },
      _callMoveOutHandler: function() {
      },
      _callMoveHandler: function(e) {
         if (!this._containerCoords) {
            this._containerCoords = {
               x: this._moveBeginX - parseInt(this._avatar.css('left'), 10),
               y: this._moveBeginY - parseInt(this._avatar.css('top'), 10)
            };
         }
         this._avatar.css({
            top: e.pageY - this._containerCoords.y,
            left: e.pageX - this._containerCoords.x
         });
         this._hideItemActions();
      },
      _createAvatar: function(e){
         var count = this.getCurrentElement().length;
         this._avatar = $('<div class="controls-DragNDrop__draggedItem"><span class="controls-DragNDrop__draggedCount">' + count + '</span></div>')
            .css({
               'left': window.scrollX + e.clientX + 5,
               'top': window.scrollY + e.clientY + 5
            }).appendTo($('body'));
      },
      _callDropHandler: function(e) {
         var
            target = $(e.target),
            keys = this.getCurrentElement(),
            moveTo = target.closest('.controls-ListView__item').data('id');
         //TODO придрот для того, чтобы если перетащить элемент сам на себя не отработал его обработчик клика
         if (this.getSelectedKey() === moveTo) {
            this._elemClickHandler = function() {
               this._elemClickHandler = TreeDataGridView.superclass._elemClickHandler;
            }
         }
         this._move(keys, moveTo);
      },
      _beginDropDown: function(e) {
         this._isShifted = true;
         this._createAvatar(e);
      },
      _endDropDown: function() {
         this._containerCoords = null;
         this._avatar.remove();
         this._isShifted = false;
      }
      /*DRAG_AND_DROP END*/
   });

   return TreeDataGridView;

});