define('js!SBIS3.CONTROLS.TreeDataGridView', [
   'js!SBIS3.CONTROLS.HierarchyDataGridView',
   'js!SBIS3.CONTROLS.TreeMixinDS',
   'html!SBIS3.CONTROLS.TreeDataGridView/resources/rowTpl'
], function(HierarchyDataGridView, TreeMixinDS, rowTpl) {

   var HIER_WRAPPER_WIDTH = 16,
       //Число 17 это сумма padding'ов, margin'ов элементов которые составляют отступ у первого поля, по которому строится лесенка отступов в дереве
       ADDITIONAL_LEVEL_OFFSET = 17;

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

   var TreeDataGridView = HierarchyDataGridView.extend([TreeMixinDS], /** @lends SBIS3.CONTROLS.TreeDataGridView.prototype*/ {
      $protected: {
         _rowTpl : rowTpl,
         _options: {
            /**
             * @cfg {Function} Устанавливает функцию, которая будет выполнена при клике по .
             * Обработчик нажатия на стрелку у папок. Если не задан, стрелка показана не будет
             */
            arrowActivatedHandler: undefined,
            /**
             * @cfg {String} Разрешено или нет перемещение элементов "Drag-and-Drop"
             * @variant "" Запрещено
             * @variant allow Разрешено
             * @variant onlyChangeOrder Разрешено только изменение порядка
             * @variant onlyChangeParent Разрешено только перемещение в папку
             * @example
             * <pre>
             *     <option name="itemsDragNDrop">onlyChangeParent</option>
             * </pre>
             */
            itemsDragNDrop: 'allow'
         },
         _paddingSize: 16,
         _dragStartHandler: undefined
      },

      $constructor: function() {
      },

      _drawItemsFolder: function(records) {
         var self = this;
         for (var j = 0; j < records.length; j++) {
            var record = records[j];
            var
               recKey = record.getId(),
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
                        if ((Array.indexOf(childKeys,$(allContainers[i]).attr('data-id')) >= 0) || (Array.indexOf(childKeys, $(allContainers[i]).data('id')) >= 0)) {
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

      init: function(){
         TreeDataGridView.superclass.init.call(this);
         if (this._container.hasClass('controls-TreeDataGridView__withPhoto')){
            this._paddingSize = 30;
         }
      },

      _drawLoadedNode : function(key, records) {
         this._drawExpandArrow(key);
         this._drawItemsFolder(records);
         this._updateItemsToolbar();
      },
      _drawItemsCallback: function() {
         var
            model,
            dataSet = this._dataSet;
         $ws.helpers.forEach(this._options.openedPath, function(val, key) {
            /*TODO:
               Не нужно создавать футер у узла, если данный узел не отображается.
               Прежде чем создавать футер у развёрнутого узла проверим что данный узел присутствует в наборе элементов.
               Возможна такая ситуация что списочный метод вернул сразу все данные и узел может являться развёрнутым,
               но не отображаться, тогда для такого случая проверим необходимость создания футера путём поиска узла
               среди текущего набора элементов в DOM.
            */
            model = dataSet.getRecordByKey(key);
             if (model && this._getElementByModel(model).length) {
                this._createFolderFooter(key);
             }
         }, this);
         TreeDataGridView.superclass._drawItemsCallback.apply(this, arguments);
      },
      _createFolderFooter: function(key) {
         var container,
             nextContainer,
             currentContainer,
             level = this._getTreeLevel(key);

         TreeDataGridView.superclass._createFolderFooter.apply(this, arguments);
         this._foldersFooters[key].css('padding-left', level * HIER_WRAPPER_WIDTH);
         container = $('<tr class="controls-TreeDataGridView__folderFooter" data-parent="' + key + '">\
            <td colspan="' + (this._options.columns.length + (this._options.multiselect ? 1 : 0)) + '"></td>\
         </tr>');
         container.find('td').append(this._foldersFooters[key]);
         this._foldersFooters[key] = container;

         currentContainer = $('.controls-ListView__item[data-id="' + key + '"]', this._getItemsContainer().get(0));
         while (currentContainer.length) {
            nextContainer = currentContainer;
            currentContainer =  $('.controls-ListView__item[data-parent="' + currentContainer.data('id') + '"]', this._getItemsContainer().get(0)).last();
         }
         this._foldersFooters[key].insertAfter(nextContainer);

         this.reviveComponents();
      },
      _getFolderFooterOptions: function(key) {
         return {
            item: this.getDataSet().getRecordByKey(key),
            more: this._folderHasMore[key],
            level: this._getTreeLevel(key)
         }
      },
      //Временное решение, пока не перейдём на проекции
      _getTreeLevel: function(key) {
         var
             level = 0,
             dataSet = this.getDataSet(),
             item = dataSet.getRecordByKey(key);
         while (key != this.getCurrentRoot()) {
            key = dataSet.getParentKey(item, this._options.hierField);
            item = dataSet.getRecordByKey(key);
            level++;
         }
         return level;
      },
      _getEditorOffset: function(model) {
         var
             offset,
             parentKey = model.get(this._options.hierField),
             treeLevel = this._getTreeLevel(parentKey);
         offset = treeLevel * HIER_WRAPPER_WIDTH + ADDITIONAL_LEVEL_OFFSET;
         return offset;
      },
      _onResizeHandler: function() {
         TreeDataGridView.superclass._onResizeHandler.apply(this, arguments);
         this._resizeFoldersFooters();
      },

      _resizeFoldersFooters: function() {
         var footers = $('.controls-TreeDataGridView__folderFooterContainer', this._container.get(0));
         var width = this._container.width();
         footers.width(width);
      },

      _keyboardHover: function(e) {
         var parentResult = TreeDataGridView.superclass._keyboardHover.apply(this, arguments),
             selectedKey = this.getSelectedKey(),
             rec = this.getDataSet().getRecordById(selectedKey),
             isBranch = rec && rec.get(this._options.hierField + '@');

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

      _nodeClosed : function(key) {
         var childKeys = this._dataSet.getChildItems(key, true, this._options.hierField);
         for (var i = 0; i < childKeys.length; i++) {
            $('.controls-ListView__item[data-id="' + childKeys[i] + '"]', this._getItemsContainer().get(0)).remove();
            delete(this._options.openedPath[childKeys[i]]);
         }
         //Уничтожим все дочерние footer'ы и footer текущего узла
         this._destroyFolderFooter(childKeys.concat(key));
      },
      //TODO: код понадобится для частичной перерисовки после перемещения
      /*_updateItem: function(item) {
         var
             isMove = item.getContents().isChanged(this._options.hierField),
             parentKey = this._items.getParentKey(item.getContents(), this._options.hierField),
             parentItem = this._items.getRecordById(parentKey);
         *//*
          Если обновление вызвано не из того, что поменялось поле иерархии (произошло перемещение), то удалять его точно не надо.
          Если элемент переместился в закрытую папку и она не не является текущим корнем, то его нужно просто удалить из
          DOM'а т.к. его не должно быть видно. Так же возможна ситуация когда с помощью диалога перемещения запись переместили
          в папку, которая является открытой но её нет в текущем наборе элементов(например текущий корень где-то глубоко в
          иерархии, а ниже по иерархии были открытые папки), то такую запись тоже нужно просто удалить. Так же проверяем на
          наличие папки в которую перемещаем в наборе DOM элементов с помощью _getElementByModel т.к. у некоторых людей все
          данные сразу присутствуют и проверка в наборе данных даст неверный результат.
          *//*
         if (isMove && (!this._options.openedPath[parentKey] || !this._getElementByModel(parentItem).length) && parentKey != this.getCurrentRoot()) {
            this._removeItem(item)
         } else {
            TreeDataGridView.superclass._updateItem.apply(this, arguments);
         }
      },*/
      _addItemAttributes : function(container, item) {
         TreeDataGridView.superclass._addItemAttributes.call(this, container, item);
         var hierType = item.get(this._options.hierField + '@'),
            itemType = hierType == null ? 'leaf' : hierType == true ? 'node' : 'hidden';
         container.addClass('controls-ListView__item-type-' + itemType);
         var
            key = item.getId(),
            parentKey = this._dataSet.getParentKey(item, this._options.hierField),
         	parentContainer = $('.controls-ListView__item[data-id="' + parentKey + '"]', this._getItemsContainer().get(0)).get(0);
         container.attr('data-parent', parentKey);

         if (this._options.openedPath[key]) {
            var tree = this._dataSet.getTreeIndex(this._options.hierField);
            if (tree[key]) {
               $('.js-controls-TreeView__expand', container).addClass('controls-TreeView__expand__open');
            } else {
               /*TODO:
                  После перезагрузки у браузера в опции openedPath остаются значения с открытыми узлами,
                  и если впоследствии попытаться открыть такой узел, то он не откроется, т.к. считается
                  что он уже открыт. Единственный вариант проверить может ли быть открыт узел, посмотреть
                  есть ли у него дочерние элементы, и если их нет значит необходимо удалить данный узел
                  из набора открытых. В будущем когда будет определено поведение после перезагрузки (
                  сохранять состояние открытых узлов или сбрасывать) данный костыль не понадобится.
               */
               delete this._options.openedPath[key];
            }
         }
         /*TODO пока придрот*/
         if (typeof parentKey != 'undefined' && parentKey !== null && parentContainer) {
            var parentMargin = parseInt($('.controls-TreeView__expand', parentContainer).parent().css('padding-left'));
            $('.controls-TreeView__expand', container).parent().css('padding-left', parentMargin + this._paddingSize);
         }
      },

      _notifyOnItemClick: function(id, data, target) {
         var
             res,
             self = this,
             elClickHandler = this._options.elemClickHandler,
             nodeID = $(target).closest('.controls-ListView__item').data('id'),
             closestExpand = this._findExpandByElement($(target));

         if ($(closestExpand).hasClass('js-controls-TreeView__expand') && $(closestExpand).hasClass('has-child')) {
            this.toggleNode(nodeID);
         }
         else {
            res = this._notify('onItemClick', id, data, target);
            if (res instanceof $ws.proto.Deferred) {
               res.addCallback(function(result) {
                  if (!result) {
                     self._elemClickHandlerInternal(data, id, target);
                     elClickHandler && elClickHandler.call(self, id, data, target);
                  }
               });
            } else if (res !== false) {
               this._elemClickHandlerInternal(data, id, target);
               elClickHandler && elClickHandler.call(this, id, data, target);
            }
         }
         return res;
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
      _notifyOnDragMove: function(target, insertAfter) {
         //Если происходит изменение порядкового номера и оно разрешено или если происходит смена родителся и она разрешена, стрельнём событием
         if (typeof insertAfter === 'boolean' && this._options.itemsDragNDrop !== 'onlyChangeParent' || insertAfter === undefined && this._options.itemsDragNDrop !== 'onlyChangeOrder') {
            return this._notify('onDragMove', this.getCurrentElement().keys, target.data('id'), insertAfter) !== false;
         }
      },
      /**
       * Говорят, что группировка должна быть только в текущем разделе. Поддерживаем
       * @param record
       * @private
       */
      _groupByDefaultMethod: function(record){
         if (record.get(this._options.hierField) != this.getCurrentRoot()){
            return false;
         }
         return TreeDataGridView.superclass._groupByDefaultMethod.apply(this, arguments);
      },
      _getEditInPlaceConfig: function() {
         var config = TreeDataGridView.superclass._getEditInPlaceConfig.apply(this, arguments);
         config.getEditorOffset = this._getEditorOffset.bind(this);
         return config;
      }
   });

   return TreeDataGridView;

});