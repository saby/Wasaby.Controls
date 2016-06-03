define('js!SBIS3.CONTROLS.TreeDataGridView', [
   'js!SBIS3.CONTROLS.DataGridView',
   'html!SBIS3.CONTROLS.TreeDataGridView',
   'js!SBIS3.CONTROLS.TreeMixin',
   'js!SBIS3.CONTROLS.TreeViewMixin',
   'js!SBIS3.CONTROLS.IconButton',
   'browser!html!SBIS3.CONTROLS.TreeDataGridView/resources/ItemTemplate',
   'browser!html!SBIS3.CONTROLS.TreeDataGridView/resources/ItemContentTemplate',
   'browser!html!SBIS3.CONTROLS.TreeDataGridView/resources/FooterWrapperTemplate'
], function(DataGridView, dotTplFn, TreeMixin, TreeViewMixin, IconButton, ItemTemplate, ItemContentTemplate, FooterWrapperTemplate) {

   var HIER_WRAPPER_WIDTH = 16,
       //Число 17 это сумма padding'ов, margin'ов элементов которые составляют отступ у первого поля, по которому строится лесенка отступов в дереве
       ADDITIONAL_LEVEL_OFFSET = 17;

   'use strict';

   /**
    * Контрол отображающий набор данных, имеющих иерархическую структуру, в виде в таблицы с несколькими колонками.
    * @class SBIS3.CONTROLS.TreeDataGridView
    * @extends SBIS3.CONTROLS.DataGridView
    * @mixes SBIS3.CONTROLS.TreeMixin
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
    * @demo SBIS3.CONTROLS.Demo.AutoAddHierarchy Пример 2. Автодобавление записей в иерархическом представлении данных.
    * Инициировать добавление можно как по нажатию кнопок в футерах, так и по кнопке Enter из режима редактирования последней записи.
    * Подробное описание конфигурации компонента и футеров вы можете найти в разделе {@link http://wi.sbis.ru/doc/platform/developmentapl/interfacedev/components/list/list-settings/records-editing/edit-in-place/users/add-in-place-hierarchy/ Добавление по месту в иерархическом списке}.
    */

   var TreeDataGridView = DataGridView.extend([TreeMixin, TreeViewMixin], /** @lends SBIS3.CONTROLS.TreeDataGridView.prototype*/ {
      _dotTplFn : dotTplFn,
       /**
        * @event onDragMove Происходит при перемещении записей.
        * @remark
        * <ul>
        *   <li>В режиме единичного выбора значения (опция {@link multiselect} установлена в значение false) возможно перемещать только одну запись.</li>
        *   <li>В режиме множественного выбора значений (опция {@link multiselect} установлена в значение true) возможно перемещать несколько записей.</li>
        * </ul>
        * Перемещение производится через удержание ЛКМ на выделенных записях и перемещение их в нужный элемент списка.
        * Событие будет происходить каждый раз, когда под курсором изменяется целевая запись списка, а удержание выделенных записей продолжается.
        * @param {$ws.proto.EventObject} eventObject Дескриптор события.
        * @param {Array.<Number|String>} key Массив идентификаторов перемещаемых записей.
        * <ul>
        *   <li>В режиме единичного выбора параметр возвращает либо строку, либо число.</li>
        *   <li>В режиме множественного выбора параметр возвращает массив строки или чисел.</li>
        * </ul>
        * @param {Number|String} id Идентификатор целевой записи, куда производится перемещение.
        * @param {Boolean|undefined} insertAfter Признак: куда были перемещены записи.
        * <ul>
        *   <li>undefined - перемещение произвели в папку;</li>
        *   <li>false - перемещаемые записи были вставлены перед целевой записью;</li>
        *   <li>true - перемещаемые записи были вставлены после целевой записи.</li>
        * </ul>
        */
      $protected: {
         _defaultItemTemplate: ItemTemplate,
         _defaultItemContentTemplate: ItemContentTemplate,
         _footerWrapperTemplate: FooterWrapperTemplate,
         _options: {
            /**
             * @cfg {Function} Устанавливает функцию, которая будет выполнена при клике по кнопке справа от названия узла (папки) или скрытого узла.
             * @remark
             * По умолчанию кнопка скрыта. Она будет отображена при наведении курсора мыши, когда установлена опция arrowActivatedHandler.
             * Кнопка отображается в виде иконки с классом icon-16 icon-View icon-primary (синяя двойная стрелочка). Изменение иконки не поддерживается.
             *
             * Как правило, эта функция выполняет открытие диалога редактирования узла или скрытого узла.
             * Подробнее о настройке диалогов вы можете прочитать в разделе {@link https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/components/list/list-settings/records-editing/editing-dialog/ Диалоги редактирования}.
             *
             * Аргументы функции:
             * <ol>
             *    <li>item - элемент коллекции (узел или скрытый узел), по кнопке которого был произведён клик. Экземпляр класса {@link SBIS3.CONTROLS.Data.Model}.</li>
             *    <li>id - идентификатор элемента коллекции (узел или скрытый узел), по кнопке которого был произведён клик.</li>
             *    <li>target - контейнер визуального отображения (DOM-элемент) кнопки, по которой произвели клик.</li>
             * </ol>
             * Указатель this внутри функции обработчика возвращает экземпляр класса элемента коллекции.
             * @example
             * В JS-коде компонента создаём функцию для обработки клика по кнопке:
             * <pre>
             * init: function() {
             *    ...
             * },
             * myButtonHandler: function(item, id, target) {
             *    this.sendCommand('activateItem', id); // Команда будет отправлена представлению данных, инициировав событие onItemActivate
             *    // В обработчике на событие onItemActivate устанавливается открытие нужного диалога редактирования, подробнее о которых можно прочитать по ссылке из раздела "Примечание".
             * }
             * </pre>
             * Устанавливаем опцию в вёрстке компонента:
             * <pre>
             *    <option name="arrowActivatedHandler" type="function">js!SBIS3.MyArea.MyComponent:prototype.myButtonHandler</option>
             * </pre>
             * @see $ws.proto.Control#sendCommand
             * @see SBIS3.CONTROLS.ListView#onItemActivate
             * @see SBIS3.CONTROLS.ListView#activateItem
             */
            arrowActivatedHandler: undefined,
            /**
             * @cfg {String} Отображать кнопку редактирования папки или нет ( >> рядом с названием папки ).
             * @example
             * <pre>
             *     <option name="editArrow" type="boolean">false</option>
             * </pre>
             */
            editArrow: true,
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
         _dragStartHandler: undefined,
         _editArrow: undefined
      },

      $constructor: function() {
      },
      _buildTplArgs: function(item) {
         var
            args = TreeDataGridView.superclass._buildTplArgs.apply(this, arguments);
         args.arrowActivatedHandler = this._options.arrowActivatedHandler;
         return args;
      },
      init: function(){
         TreeDataGridView.superclass.init.call(this);
         if (this._container.hasClass('controls-TreeDataGridView__withPhoto')){
            this._paddingSize = 42;
         }
      },

      _drawItemsCallback: function() {
         var
            model,
            dataSet = this._dataSet;
         for (var key in this._options.openedPath) {
            if (this._options.openedPath.hasOwnProperty(key)) {
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
            }
         }
         this._updateEditArrow();
         TreeDataGridView.superclass._drawItemsCallback.apply(this, arguments);
      },
      _createFolderFooter: function(key) {
         TreeDataGridView.superclass._createFolderFooter.apply(this, arguments);
         var
            pagerContainer,
            lastContainer = this._getLastChildByParent(this._getItemsContainer(), this._getItemProjectionByItemId(key));

         //TODO: Сделать FolderPager отдельным контроллом и перенести создание в шаблон FolderFooterTemplate
         pagerContainer = $('<div class="controls-TreePager-container">').appendTo(this._foldersFooters[key].find('.controls-TreeView__folderFooterContainer'));
         this._createFolderPager(key, pagerContainer, this._folderHasMore[key]);

         this._foldersFooters[key].insertAfter(lastContainer);
         this.reviveComponents();
      },
      _getFolderFooterOptions: function(key) {
         return {
            key: key,
            item: this.getItems().getRecordByKey(key),
            level: this._getItemProjectionByItemId(key).getLevel(),
            footerTpl: this._options.folderFooterTpl,
            multiselect: this._options.multiselect,
            colspan: this._options.columns.length,
            levelOffsetWidth: HIER_WRAPPER_WIDTH
         }
      },
      _getFolderFooterWrapper: function() {
         return this._footerWrapperTemplate;
      },
      _getEditorOffset: function(model) {
         var
             treeLevel = 0,
             parentProj = this._getItemProjectionByItemId(model.get(this._options.hierField));
         if (parentProj) {
            treeLevel = parentProj.getLevel();
         }
         return treeLevel * HIER_WRAPPER_WIDTH + ADDITIONAL_LEVEL_OFFSET;
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
             rec = this.getItems().getRecordById(selectedKey),
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

      /**
       * Возвращает стрелку редактирования папки
       * @returns {IconButton|undefined}
       */
      getEditArrow: function() {
         var self = this;
         if(!this._editArrow && this._options.editArrow) {
            this._editArrow = new IconButton({
               element: this._container.find('> .controls-TreeView__editArrow-container'),
               icon: 'icon-16 icon-View icon-primary action-hover',
               parent: this,
               allowChangeEnable: false,
               handlers: {
                  onActivated: function () {
                     var hoveredItem = self.getHoveredItem();

                     // TODO для обратной совместимости - удалить позже
                     if(self._options.arrowActivatedHandler) {
                        self._options.arrowActivatedHandler.call(this,
                            hoveredItem.record,
                            hoveredItem.key,
                            hoveredItem.container
                        );
                     } else {
                        self._activateItem(hoveredItem.key);
                     }
                  }
               }
            });
         }
         return this._editArrow;
      },

      _getEditArrowPosition: function(hoveredItem) {
         var folderTitle = hoveredItem.container.find('.controls-TreeView__folderTitle'),
             td = folderTitle.closest('.controls-DataGridView__td', hoveredItem.container),
             containerCords = this._container[0].getBoundingClientRect(),
             /* в 3.7.3.200 сделать это публичным маркером для стрелки */
             arrowContainer = td.find('.js-controls-TreeView__editArrow'),
             arrowCords;

         if(!arrowContainer.length) {
            arrowContainer = td.find('.controls-TreeView__editArrow');
         }

         /* Контейнера для стрелки может не быть, тогда не показываем */
         if(!arrowContainer.length) {
            return false;
         }

         /* Т.к. у нас в вёрстке две иконки, то позиционируем в зависимости от той, которая показывается,
            в .200 переделаем на маркер */
         if(arrowContainer.length === 2) {
            if (folderTitle[0].offsetWidth > td[0].offsetWidth) {
               arrowContainer = arrowContainer[1];
            } else {
               arrowContainer = arrowContainer[0];
            }
         } else {
            arrowContainer = arrowContainer[0];
         }

         arrowCords = arrowContainer.getBoundingClientRect();

         return {
            top: arrowCords.top - containerCords.top + this._container[0].scrollTop,
            left: arrowCords.left - containerCords.left
         }
      },

      _onChangeHoveredItem: function() {
         /* Т.к. механизм отображения стрелки и операций над записью на ipad'e релизован с помощью свайпов,
            а на PC через mousemove, то и скрывать/показывать их надо по-разному */
         if(!this._touchSupport) {
            this._updateEditArrow();
         }
         TreeDataGridView.superclass._onChangeHoveredItem.apply(this, arguments);
      },

      _updateEditArrow: function() {
         if(this._options.editArrow) {
            if(this.getHoveredItem().container) {
               this._showEditArrow();
            } else {
               this._hideEditArrow();
            }
         }
      },

      reload: function() {
         this._hideEditArrow();
         return TreeDataGridView.superclass.reload.apply(this, arguments);
      },

      _showEditArrow: function() {
         var hoveredItem = this.getHoveredItem(),
             editArrowContainer = this.getEditArrow().getContainer(),
             needShowArrow, hiContainer, editArrowPosition;

         hiContainer = hoveredItem.container;
         /* Если иконку скрыли или не папка - показывать не будем */
         needShowArrow = hiContainer && hiContainer.hasClass('controls-ListView__item-type-node') && this.getEditArrow().isVisible();

         if(hiContainer && needShowArrow) {
            editArrowPosition = this._getEditArrowPosition(hoveredItem);

            if(editArrowPosition) {
               editArrowContainer.css(editArrowPosition);
               editArrowContainer.removeClass('ws-hidden');
            }
         } else {
            this._hideEditArrow();
         }
      },

      _hideEditArrow: function() {
         if(this._editArrow) {
            this._editArrow.getContainer().addClass('ws-hidden');
         }
      },

      _onLeftSwipeHandler: function() {
         if(this._options.editArrow) {
            this._showEditArrow();
         }
         TreeDataGridView.superclass._onLeftSwipeHandler.apply(this, arguments);
      },

      _onRightSwipeHandler: function() {
         if(this._options.editArrow) {
            this._hideEditArrow();
         }
         TreeDataGridView.superclass._onRightSwipeHandler.apply(this, arguments);
      },

      _isHoverControl: function(target) {
         var res = TreeDataGridView.superclass._isHoverControl.apply(this, arguments);

         if(!res && this._options.editArrow) {
            return this.getEditArrow().getContainer()[0] === target[0];
         }
         return res;
      },
      _addItemAttributes : function(container, itemProjection) {
         TreeDataGridView.superclass._addItemAttributes.call(this, container, itemProjection);
         var
            item = itemProjection.getContents(),
            hierType = item.get(this._options.hierField + '@'),
            itemType = hierType == null ? 'leaf' : hierType == true ? 'node' : 'hidden';
         container.addClass('controls-ListView__item-type-' + itemType);
         var
            key = item.getId(),
            parentKey = this._items.getParentKey(item, this._options.hierField),
         	parentContainer = $('.controls-ListView__item[data-id="' + parentKey + '"]', this._getItemsContainer().get(0)).get(0);
         container.attr('data-parent', parentKey);

         if (this._options.openedPath[key]) {
            var tree = this._items.getTreeIndex(this._options.hierField);
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
                  if (result !== false) {
                     self._elemClickHandlerInternal(data, id, target);
                     elClickHandler && elClickHandler.call(self, id, data, target);
                  }
                  return result;
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

      _getDirectionOrderChange: function() {
         if (this._options.itemsDragNDrop !== 'onlyChangeParent') {
            return TreeDataGridView.superclass._getDirectionOrderChange.apply(this, arguments);
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
         config.hierField = this._options.hierField;
         return config;
      }
   });

   return TreeDataGridView;

});