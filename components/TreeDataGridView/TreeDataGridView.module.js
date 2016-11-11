define('js!SBIS3.CONTROLS.TreeDataGridView', [
   "Core/IoC",
   "Core/core-merge",
   "Core/constants",
   "js!SBIS3.CONTROLS.DataGridView",
   "html!SBIS3.CONTROLS.TreeDataGridView",
   "js!SBIS3.CONTROLS.TreeMixin",
   "js!SBIS3.CONTROLS.TreeViewMixin",
   "js!SBIS3.CONTROLS.IconButton",
   "html!SBIS3.CONTROLS.TreeDataGridView/resources/ItemTemplate",
   "html!SBIS3.CONTROLS.TreeDataGridView/resources/ItemContentTemplate",
   "html!SBIS3.CONTROLS.TreeDataGridView/resources/FooterWrapperTemplate",
   "tmpl!SBIS3.CONTROLS.TreeDataGridView/resources/searchRender",
   "Core/ConsoleLogger"
], function( IoC, cMerge, constants,DataGridView, dotTplFn, TreeMixin, TreeViewMixin, IconButton, ItemTemplate, ItemContentTemplate, FooterWrapperTemplate, searchRender) {


   var HIER_WRAPPER_WIDTH = 16,
       //Число 19 это сумма padding'ов, margin'ов элементов которые составляют отступ у первого поля, по которому строится лесенка отступов в дереве
       ADDITIONAL_LEVEL_OFFSET = 19,
      buildTplArgsTDG = function(cfg) {
         var tplOptions, tvOptions;
         tplOptions = cfg._buildTplArgsDG.call(this, cfg);
         tvOptions = cfg._buildTplArgsTV.call(this, cfg);
         cMerge(tplOptions, tvOptions);
         tplOptions.arrowActivatedHandler = cfg.arrowActivatedHandler;
         tplOptions.editArrow = cfg.editArrow;
         tplOptions.foldersColspan = cfg.foldersColspan;
         return tplOptions;
      },
      getSearchCfg = function(cfg) {
         return {
            keyField: cfg.keyField,
            displayField: cfg.displayField,
            highlightEnabled: cfg.highlightEnabled,
            highlightText: cfg.highlightText,
            colorMarkEnabled: cfg.colorMarkEnabled,
            colorField: cfg.colorField,
            allowEnterToFolder: cfg.allowEnterToFolder,
            colspan: cfg.columns.length + (cfg.multiselect ? 1 : 0)
         }
      };

   'use strict';

   /**
    * Контрол, отображающий набор данных с иерархической структурой в виде в таблицы с несколькими колонками. Подробнее о настройке контрола и его окружения вы можете прочитать в разделе <a href="https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/components/list/list-settings/">Настройка списков</a>.
    *
    * @class SBIS3.CONTROLS.TreeDataGridView
    * @extends SBIS3.CONTROLS.DataGridView
    * @mixes SBIS3.CONTROLS.TreeMixin
    * @author Крайнов Дмитрий Олегович
    *
    * @demo SBIS3.CONTROLS.Demo.MyTreeDataGridView Пример 1. Простое иерархическое представление данных в режиме множественного выбора записей.
    * @demo SBIS3.CONTROLS.DOCS.AutoAddHierarchy Пример 2. Автодобавление записей в иерархическом представлении данных.
    * Инициировать добавление можно как по нажатию кнопок в футерах, так и по кнопке Enter из режима редактирования последней записи.
    * Подробное описание конфигурации компонента и футеров вы можете найти в разделе <a href="http://wi.sbis.ru/doc/platform/developmentapl/interfacedev/components/list/list-settings/records-editing/edit-in-place/users/add-in-place-hierarchy/"> Добавление по месту в иерархическом списке</a>.
    *
    * @author Крайнов Дмитрий Олегович
    *
    * @control
    * @public
    * @category Lists
    * @initial
    * <component data-component='SBIS3.CONTROLS.TreeDataGridView'>
    *    <options name="columns" type="array">
    *       <options>
    *          <option name="title">№</option>
    *          <option name="field">@Идентификатор</option>
    *          <option name="width">100</option>
    *       </options>
    *       <options>
    *          <option name="title">Наименование</option>
    *          <option name="title">Наименование</option>
    *       </options>
    *    </options>
    * </component>
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
         _footerWrapperTemplate: FooterWrapperTemplate,
         _options: {
            _buildTplArgs: buildTplArgsTDG,
            _canServerRender: true,
            _defaultItemTemplate: ItemTemplate,
            _defaultItemContentTemplate: ItemContentTemplate,
            _defaultSearchRender: searchRender,
            _getSearchCfg: getSearchCfg,
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
             *    <li>item - элемент коллекции (узел или скрытый узел), по кнопке которого был произведён клик. Экземпляр класса {@link WS.Data/Entity/Model}.</li>
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
            editArrow: false,
            /**
             * @cfg {Boolean} отображает папки с одной колонкой на всю строку
             * Значение по умолчанию false
             * @deprecated
             */
            // Добавил опцию для версии 220
            // с 3.7.5 будет рулиться через пользовательский шаблон
            foldersColspan: false
         },
         _dragStartHandler: undefined,
         _editArrow: undefined
      },

      $constructor: function() {
      },
      init: function(){
         TreeDataGridView.superclass.init.call(this);
         if (this._container.hasClass('controls-TreeDataGridView__withPhoto')){
            this._options._paddingSize = 42;
         }
         if (this._options._serverRender) {
            this._createAllFolderFooters();
         }
      },

      redraw: function() {
         TreeDataGridView.superclass.redraw.apply(this, arguments);
         /*redraw может позваться, когда данных еще нет*/
         if (this._getItemsProjection()) {
            this._createAllFolderFooters();
         }
      },

      _drawItemsCallback: function() {
         this._updateEditArrow();
         TreeDataGridView.superclass._drawItemsCallback.apply(this, arguments);
      },

      //Переопределяем метод, потому что в дереве могут присутствовать футеры папок, и если записи добавляются в конец,
      //то они добавятся после футера папки, чего быть не должно. Проверим что записи добавляются в конец и добавим их после
      //последнего элемента, иначе будет выполнена штатная логика.
      _getInsertMarkupConfig: function(newItemsIndex, newItems) {
         var
             lastItem,
             cfg = TreeDataGridView.superclass._getInsertMarkupConfig.apply(this, arguments);

         if (cfg.inside && !cfg.prepend) {
            lastItem = this._options._itemsProjection.at(newItemsIndex - 1);
            cfg.inside = false;
            cfg.container = this._getDomElementByItem(lastItem);
         }
         return cfg;
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
         var level = this._getItemProjectionByItemId(key).getLevel();
         return {
            key: key,
            item: this.getItems().getRecordById(key),
            level: level,
            footerTpl: this._options.folderFooterTpl,
            multiselect: this._options.multiselect,
            colspan: this._options.columns.length,
            padding: this._options._paddingSize * level
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
         /*будем ресайзить футеры только в частичном скролле. В остальных случаях они и так норм*/
         if (this._options.startScrollColumn) {
            var footers = $('.controls-TreeView__folderFooterContainer', this._container.get(0));
            var width = this._container.width();
            //Если в браузере присутствует колонка с checkbox'ом, то нужно вычесть его ширину из общей ширины футера
            if (this._options.multiselect) {
               //Нельзя смотреть ширину первой колонки, позвав метод width у элемента col (дочерний элемент colgroup)
               //т.к. в 8 и 10 ie это приводит к тому, что начинает ехать ширина у остальных колонок
               width = width - this._container.find('.controls-DataGridView__td__checkBox').first().width();
            }
            footers.outerWidth(width);
         }
      },

      _keyboardHover: function(e) {
         var parentResult = TreeDataGridView.superclass._keyboardHover.apply(this, arguments),
             selectedKey = this.getSelectedKey(),
             rec = this.getItems().getRecordById(selectedKey),
             isBranch = rec && rec.get(this._options.hierField + '@');

         switch(e.which) {
            case constants.key.right:
               isBranch && this.expandNode(selectedKey);
               break;
            case constants.key.left:
               isBranch && this.collapseNode(selectedKey);
               break;
         }
         return parentResult;
      },

      collapseNode: function (key) {
         return TreeDataGridView.superclass.collapseNode.apply(this, arguments);
      },

      expandNode: function (key) {
         return TreeDataGridView.superclass.expandNode.apply(this, arguments);
      },

      /**
       * Возвращает стрелку редактирования папки
       * @returns {IconButton|undefined}
       */
      getEditArrow: function() {
         var self = this;
         if(!this._editArrow && (this._options.editArrow || this._options.arrowActivatedHandler)) {
            this._editArrow = new IconButton({
               element: this._container.find('> .controls-TreeView__editArrow-container'),
               icon: 'icon-16 icon-View icon-primary action-hover icon-size',
               parent: this,
               allowChangeEnable: false,
               handlers: {
                  onActivated: function () {
                     var hoveredItem = self.getHoveredItem(),
                         id = hoveredItem.key;

                     // TODO для обратной совместимости - удалить позже
                     if(self._options.arrowActivatedHandler) {
                        IoC.resolve('ILogger').error('SBIS3.CONTROLS.TreeDataGridView', 'Опция arrowActivatedHandler помечена как deprecated и будет удалена в 3.7.5');
                        self._options.arrowActivatedHandler.call(this,
                            hoveredItem.record,
                            id,
                            hoveredItem.container
                        );
                     } else {
                        self._activateItem(id);
                     }
                     self.setSelectedKey(id);
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
            /* Считаем, чтобы правая координата названия папки не выходила за ячейку,
               учитываем возможные отступы иерархии и ширину expander'a*/
            if ( td[0].getBoundingClientRect().right - parseInt(td.css('padding-right'), 10) < folderTitle[0].getBoundingClientRect().right + HIER_WRAPPER_WIDTH) {
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
         if(this._options.editArrow || this._options.arrowActivatedHandler) {
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
         if(this._options.editArrow || this._options.arrowActivatedHandler) {
            this._showEditArrow();
         }
         TreeDataGridView.superclass._onLeftSwipeHandler.apply(this, arguments);
      },

      _onRightSwipeHandler: function() {
         if(this._options.editArrow || this._options.arrowActivatedHandler) {
            this._hideEditArrow();
         }
         TreeDataGridView.superclass._onRightSwipeHandler.apply(this, arguments);
      },

      _isHoverControl: function(target) {
         var res = TreeDataGridView.superclass._isHoverControl.apply(this, arguments);

         if(!res && (this._options.editArrow || this._options.arrowActivatedHandler)) {
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
            parentKey = item.get(this._options.hierField),
         	parentContainer = $('.controls-ListView__item[data-id="' + parentKey + '"]', this._getItemsContainer().get(0)).get(0);
         container.attr('data-parent', parentKey);

         if (this._options.openedPath[key]) {
            var hierarchy = this._getHierarchyRelation(),
               children = hierarchy.getChildren(key, this._options._items);

            if (children.length) {
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
            $('.controls-TreeView__expand', container).parent().css('padding-left', parentMargin + this._options.paddingSize);
         }
      },

      _elemClickHandlerInternal: function(data, id, target, e) {
         var $target =  $(target),
             closestExpand = this._findExpandByElement($target);

         /* Не обрабатываем клики по чекбоку и по стрелке редактирования, они обрабатываются в elemClickHandler'e */
         if ($target.hasClass('js-controls-TreeView__editArrow') || $target.hasClass('js-controls-ListView__itemCheckBox')) {
            return;
         }

         /* При клике по треугольнику надо просто раскрыть ветку */
         if (closestExpand.hasClass('js-controls-TreeView__expand') && closestExpand.hasClass('has-child')) {
            this.toggleNode(id);
            return;
         }

         if (this._options.allowEnterToFolder){
            /* Не обрабатываем клики по чекбоку и по стрелке редактирования, они обрабатываются в elemClickHandler'e */
            if ($target.hasClass('js-controls-TreeView__editArrow') || $target.hasClass('js-controls-ListView__itemCheckBox')) {
               return false;
            } else if (data.get(this._options.hierField + '@')) {
               this.setCurrentRoot(id);
               this.reload();
            }
            else {
               this._activateItem(id);
            }
         }
         else {
            if (data.get(this._options.hierField + '@')) {
               this.toggleNode(id);
            }
            else {
               this._activateItem(id);
            }
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
      },

      _startEditOnItemClick: function(event, id, record, target, originalEvent) {
         //При клике на треугольник раскрытия папки начинать редактирование записи не нужно
         if (!$(target).hasClass('js-controls-TreeView__expand')) {
            TreeDataGridView.superclass._startEditOnItemClick.apply(this, arguments);
         }
      },

      _onDragHandler: function (dragObject, e) {
         DataGridView.superclass._onDragHandler.call(this, dragObject, e);
         this._onDragCallback(dragObject, e);
      }
   });

   return TreeDataGridView;

});