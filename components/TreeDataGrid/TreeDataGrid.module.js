define('js!SBIS3.CONTROLS.TreeDataGrid', [
   'js!SBIS3.CONTROLS.HierarchyDataGrid',
   'js!SBIS3.CONTROLS.TreeMixinDS',
   'js!SBIS3.CONTROLS.DragNDropMixin',
   'html!SBIS3.CONTROLS.TreeDataGrid/resources/rowTpl'
], function(HierarchyDataGrid, TreeMixin, DragNDropMixin, rowTpl) {
   'use strict';
   /**
    * Контрол отображающий набор данных, имеющих иерархическую структуру, в виде в таблицы с несколькими колонками.
    * @class SBIS3.CONTROLS.TreeDataGrid
    * @extends SBIS3.CONTROLS.DataGrid
    * @mixes SBIS3.CONTROLS.TreeMixinDS
    * @public
    * @author Крайнов Дмитрий Олегович
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

   var TreeDataGrid = HierarchyDataGrid.extend([TreeMixin, DragNDropMixin], /** @lends SBIS3.CONTROLS.TreeDataGrid.prototype*/ {
      $protected: {
         _rowTpl : rowTpl,
         _options: {
            /**
             * Разрешить проваливаться в папки
             * Если выключено, то папки можно открывать только в виде дерева, проваливаться в них нельзя
             * @type {Boolean}
             */
            allowEnterToFolder: true,
            /**
             * Обработчик нажатия на стрелку у папок. Если не задан, стрелка показана не будет
             * @type {Function}
             */
            arrowActivatedHandler: undefined,
            /**
            * Разрешить перемещать элементы с помощью DragAndDrop
            * @type {Boolean}
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
                        self._drawItem(record, {at : startRow});
                     }

                  }
                  else {
                     self._drawItem(record, {at : startRow});
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
         var row = $('<tr class="controls-TreeDataGrid__folderToolbar">' +
            '<td colspan="'+(this._options.columns.length+(this._options.multiselect ? 1 : 0))+'"><div class="controls-TreePager-container"></div></td>' +
            '</tr>').attr('data-parent',key);
         $(allContainers.last()).after(row);
         var elem = $('.controls-TreePager-container', row.get(0));
         this._createFolderPager(key, elem, dataSet.getMetaData().more);
      },

      _keyboardHover: function(e) {
         TreeDataGrid.superclass._keyboardHover.apply(this, arguments);
         var selectedKey = this.getSelectedKey()
         if (e.which === $ws._const.key.enter) {
            var rec = this._dataSet.getRecordByKey(selectedKey);
            if (rec.get(this._options.hierField)) {
               this.setCurrentRoot(selectedKey);
            }
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

      _nodeClosed : function(key) {
         var childKeys = this._dataSet.getChildItems(key, true, this._options.hierField);
         for (var i = 0; i < childKeys.length; i++) {
            $('.controls-ListView__item[data-id="' + childKeys[i] + '"]', this._getItemsContainer().get(0)).remove();
            delete(this._options.openedPath[childKeys[i]]);
         }
         /*TODO кажется как то нехорошо*/
         $('.controls-TreeDataGrid__folderToolbar[data-parent="'+key+'"]').remove();
         if (this._treePagers[key]) {
            this._treePagers[key].destroy();
         }

      },

      _addItemAttributes : function(container, item) {
         TreeDataGrid.superclass._addItemAttributes.call(this, container, item);
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
               this._elemClickHandler = TreeDataGrid.superclass._elemClickHandler;
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

   return TreeDataGrid;

});