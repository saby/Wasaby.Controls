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
                        //TODO сейчас ключи могут оказаться строками, а могут целыми числами, в 20 все должно быть строками и это можно выпилить
                        if ((childKeys.indexOf($(allContainers[i]).attr('data-id')) >= 0) || ((childKeys.indexOf($(allContainers[i]).data('id')) >= 0))) {
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

      _drawLoadedNode : function(key, records, more) {
         this._drawExpandArrow(key);
         this._drawItemsFolder(records);

         //TODO пока не очень общо создаем внутренние пэйджинги
         var allContainers = $('.controls-ListView__item[data-parent="' + key + '"]', this._getItemsContainer().get(0));
         var row = $('<tr class="controls-TreeDataGridView__folderToolbar">' +
            '<td colspan="' + (this._options.columns.length + (this._options.multiselect ? 1 : 0)) + '"><div style="overflow:hidden" class="controls-TreeDataGridView__folderToolbarContainer"><div class="controls-TreePager-container"></div></div></td>' +
            '</tr>').attr('data-parent', key);
         $(allContainers.last()).after(row);
         this._resizeFolderToolbars();
         var elem = $('.controls-TreePager-container', row.get(0));

         this._createFolderPager(key, elem, more);
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

      collapseNode: function (key) {
         this._clearLadderData(key);
         TreeDataGridView.superclass.collapseNode.apply(this, arguments);
      },

      expandNode: function (key) {
         this._clearLadderData(key);
         return TreeDataGridView.superclass.expandNode.apply(this, arguments);
      },


      _clearLadderData: function(key){
         var ladderDecorator = this._decorators.getByName('ladder');
         if (ladderDecorator){
            ladderDecorator.removeNodeData(key);
         }
      },

      _drawItemsFolderLoad: function(records, id) {
         if (!id) {
            this._drawItems(records);
         }
         else {
            this._drawItemsFolder(records);
         }
      },

      _drawExpandArrow: function(key, flag){
         var itemCont = $('.controls-ListView__item[data-id="' + key + '"]', this.getContainer().get(0));
         $('.js-controls-TreeView__expand', itemCont).toggleClass('controls-TreeView__expand__open', flag);
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
            var tree = this._dataSet.getTreeIndex(this._options.hierField);
            if (tree[key]) {
               $('.js-controls-TreeView__expand', container).addClass('controls-TreeView__expand__open');
            }
         }
         /*TODO пока придрот*/
         if (typeof parentKey != 'undefined' && parentKey !== null && parentContainer) {
            var parentWrappersCount = $('.controls-TreeView__hierWrapper', parentContainer).length;
            for (var i = 0; i <= parentWrappersCount; i++) {
              $('.controls-TreeView__expand', container).before('<div class="controls-TreeView__hierWrapper"></div>');
            }
         }
      },

      _elemClickHandler: function (id, data, target) {
         var $target = $(target);

         this.setSelectedKey(id);
         if (this._options.multiselect) {
            //TODO: оставить только js класс
            if ($target.hasClass('js-controls-ListView__itemCheckBox') || $target.hasClass('controls-ListView__itemCheckBox')) {
               this.toggleItemsSelection([$target.closest('.controls-ListView__item').attr('data-id')]);
            }
            else {
               this._notifyOnItemClick(id, data, target);
            }
         }
         else {
            this._notifyOnItemClick(id, data, target);
         }
      },
      _notifyOnItemClick: function(id, data, target) {
         var
             res,
             elClickHandler = this._options.elemClickHandler,
             nodeID = $(target).closest('.controls-ListView__item').data('id'),
             closestExpand = this._findExpandByElement($(target));

         if ($(closestExpand).hasClass('js-controls-TreeView__expand') && $(closestExpand).hasClass('has-child')) {
            this.toggleNode(nodeID);
         }
         else {
            res = this._notify('onItemClick', id, data, target);
            if (res !== false) {
               this._elemClickHandlerInternal(data, id, target);
               elClickHandler && elClickHandler.call(this, id, data, target);
            }
         }
      },
      _elemClickHandlerInternal: function(data, id, target) {
         var nodeID = $(target).closest('.controls-ListView__item').data('id');
         if (this._options.allowEnterToFolder){
            if ($(target).hasClass('js-controls-TreeView__editArrow')) {
               if (this._options.arrowActivatedHandler) {

                  //TODO оставляем для совеместимости с номенклатурой
                  if (this._options.arrowActivatedHandler instanceof Function) {
                     this._options.arrowActivatedHandler.apply(this, arguments);
                  }
                  else {
                     this._activateItem(id);
                  }
               }
            } else if (data.get(this._options.hierField + '@')) {
               this.setCurrentRoot(nodeID);
               this.reload();
            }
            else {
               this._activateItem(id);
            }
         }
         else {
            if (data.get(this._options.hierField + '@')) {
               this.toggleNode(nodeID);
            }
            else {
               this._activateItem(id);
            }
         }
      },
      //Переопределим метод, чтобы при DRAG&DROP не показывать операции по ховеру
      _showItemActions: function() {
         if (!this._isShifted) {
            TreeDataGridView.superclass._showItemActions.apply(this, arguments);
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
         //TODO: придумать как избавиться от второй проверки. За поля ввода DragNDrop происходить не должен.
         if (this._isShifted || $ws.helpers.instanceOfModule($(e.target).wsControl(), 'SBIS3.CONTROLS.TextBoxBase')) {
            return;
         }
         var
            target = $(e.target).closest('.controls-ListView__item'),
            id = target.data('id');
         if (id) {
            this.setCurrentElement(e, {
               keys: this._getDragItems(id),
               targetId: id,
               target: target,
               insertAfter: undefined
             });
         }
         //Предотвращаем нативное выделение текста на странице
         if (!$ws._const.compatibility.touch) {
            e.preventDefault();
         }
      },
      _callMoveOutHandler: function() {
      },
      _callMoveHandler: function(e) {
         var
             insertAfter,
             isCorrectDrop,
             currentElement = this.getCurrentElement(),
             target = $(e.target).closest('.js-controls-ListView__item');
         if (!this._containerCoords) {
            this._containerCoords = {
               x: this._moveBeginX - parseInt(this._avatar.css('left'), 10),
               y: this._moveBeginY - parseInt(this._avatar.css('top'), 10)
            };
         }
         if (currentElement.targetId != target.data('id')) {
            insertAfter = this._getDirectionOrderChange(e, target);
         }
         isCorrectDrop = this._notify('onDragMove', currentElement.keys, target.data('id'), insertAfter);
         if (isCorrectDrop !== false) {
            this._setDragTarget(target, insertAfter);
         } else {
            this._clearDragHighlight();
         }
         this._avatar.css({
            top: e.pageY - this._containerCoords.y,
            left: e.pageX - this._containerCoords.x
         });
      },
      _setDragTarget: function(target, insertAfter) {
         var currentElement = this.getCurrentElement();
         this._clearDragHighlight();
         if (target.length) {
            if (insertAfter === true && target.next().data('id') !== currentElement.targetId) {
               target.addClass('controls-DragNDrop__insertAfter');
            } else if (insertAfter === false && target.prev().data('id') !== currentElement.targetId) {
               target.addClass('controls-DragNDrop__insertBefore');
            }
         }
         currentElement.insertAfter = insertAfter;
         currentElement.target = target;
      },
      _clearDragHighlight: function() {
         this.getCurrentElement().target.removeClass('controls-DragNDrop__insertBefore controls-DragNDrop__insertAfter');
      },
      _getDirectionOrderChange: function(e, target) {
         if (target.length) {
            return this._getOrderPosition(e.pageY - target.offset().top, target.height());
         }
      },
      _getOrderPosition: function(offset, metric) {
         if (offset < 10) {
            return false;
         } else if (offset > metric - 10) {
            return true;
         }
      },
      _createAvatar: function(e){
         var count = this.getCurrentElement().keys.length;
         this._avatar = $('<div class="controls-DragNDrop__draggedItem"><span class="controls-DragNDrop__draggedCount">' + count + '</span></div>')
            .css({
               'left': window.scrollX + e.clientX + 5,
               'top': window.scrollY + e.clientY + 5,
               'z-index': $ws.single.WindowManager.acquireZIndex(false)
            }).appendTo($('body'));
      },
      _callDropHandler: function(e) {
         var
            clickHandler,
            currentElement = this.getCurrentElement(),
            moveTo = currentElement.target.data('id');
         //TODO придрот для того, чтобы если перетащить элемент сам на себя не отработал его обработчик клика
         if (this.getSelectedKey() === moveTo) {
            clickHandler = this._elemClickHandler;
            this._elemClickHandler = function() {
               this._elemClickHandler = clickHandler;
            }
         }
         this._move(currentElement.keys, moveTo, currentElement.insertAfter);
      },
      _beginDropDown: function(e) {
         this.setSelectedKey(this.getCurrentElement().targetId);
         this._isShifted = true;
         this._createAvatar(e);
         this._hideItemActions();
      },
      _endDropDown: function() {
         this._containerCoords = null;
         $ws.single.WindowManager.releaseZIndex(this._avatar.css('z-index'));
         this._avatar.remove();
         this._isShifted = false;
      }
      /*DRAG_AND_DROP END*/
   });

   return TreeDataGridView;

});