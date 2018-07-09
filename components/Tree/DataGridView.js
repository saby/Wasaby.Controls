define('SBIS3.CONTROLS/Tree/DataGridView', [
   "Core/core-merge",
   "Core/constants",
   'Core/CommandDispatcher',
   'SBIS3.CONTROLS/Utils/Contains',
   "SBIS3.CONTROLS/DataGridView",
   "tmpl!SBIS3.CONTROLS/Tree/DataGridView/TreeDataGridView",
   "SBIS3.CONTROLS/Mixins/TreeMixin",
   "SBIS3.CONTROLS/Mixins/TreeViewMixin",
   "SBIS3.CONTROLS/Button/IconButton",
   "tmpl!SBIS3.CONTROLS/Tree/DataGridView/resources/ItemTemplate",
   "tmpl!SBIS3.CONTROLS/Tree/DataGridView/resources/ItemContentTemplate",
   "tmpl!SBIS3.CONTROLS/Tree/DataGridView/resources/FooterWrapperTemplate",
   "tmpl!SBIS3.CONTROLS/Tree/DataGridView/resources/searchRender",
   "Core/helpers/Function/runDelayed",
   "Core/helpers/Function/forAliveOnly",
   "Core/ConsoleLogger",
   'SBIS3.CONTROLS/Link',
   'css!SBIS3.CONTROLS/Tree/DataGridView/TreeDataGridView',
   'css!SBIS3.CONTROLS/Tree/View/TreeView'
], function( cMerge, constants, CommandDispatcher, contains, DataGridView, dotTplFn, TreeMixin, TreeViewMixin, IconButton, ItemTemplate, ItemContentTemplate, FooterWrapperTemplate, searchRender, runDelayed, forAliveOnly) {


   var
      DEFAULT_SELECT_CHECKBOX_WIDTH = 24, // Стандартная ширина чекбокса отметки записи.
      DEFAULT_ROW_SELECT_WIDTH = 8,      // Стандартная ширина полоски выбранной строки.
      DEFAULT_FIELD_PADDING_SIZE = 5,     // Стандартный отступ в полях ввода 4px + border 1px. Используется для расчёта отступа при редактировании по месту.
      DEFAULT_EXPAND_ELEMENT_WIDTH = 24,  // Стандартная ширина стрелки разворота в дереве
      DEFAULT_CELL_PADDING_DIFFERENCE = 1,// Стандартная разница между оступом в ячейке табличного представления и отступом в текстовых полях (6px - 5px = 1px)
      buildTplArgsTDG = function(cfg) {
         var tplOptions, tvOptions;
         tplOptions = cfg._buildTplArgsDG.call(this, cfg);
         tvOptions = cfg._buildTplArgsTV.call(this, cfg);
         cMerge(tplOptions, tvOptions);
         tplOptions.arrowActivatedHandler = cfg.arrowActivatedHandler;
         tplOptions.editArrow = cfg.editArrow;
         tplOptions.hasScroll = tplOptions.startScrollColumn !== undefined;
         tplOptions.foldersColspan = cfg.foldersColspan;
         tplOptions.getItemContentTplData = getItemContentTplData;
         tplOptions.hasChildrenProperty = cfg.hasChildrenProperty;
         tplOptions.partialyReload = cfg.partialyReload;
         tplOptions.expanderDisplayMode = cfg.expanderDisplayMode;
         tplOptions.cellData.isSearch = tvOptions.isSearch;
         return tplOptions;
      },

      getSearchCfg = function(cfg) {
         return {
            idProperty: cfg.idProperty,
            displayProperty: cfg.displayProperty,
            highlightEnabled: cfg.highlightEnabled,
            highlightText: cfg.highlightText,
            colorMarkEnabled: cfg.colorMarkEnabled,
            colorField: cfg.colorField,
            allowEnterToFolder: cfg.allowEnterToFolder,
            task1173671799: cfg.task1173671799,
            colspan: cfg.columns.length,
            multiselect: cfg.multiselect
         }
      },
      getFolderFooterOptions = function(cfg) {
         var options = cfg._getFolderFooterOptionsTVM.apply(this, arguments);
         options.colspan = cfg.columns.length;
         return options;
      },
      hasFolderFooters = function() {
         //Отключаем отрисовку футеров на сервере, потому что пока что нет возможности построить treePaging,
         //т.к. в момент отрисовки нет информации, есть ли ещё записи в открытой папке.
         return false;
      },
      getItemTemplateData = function (cfg) {
         var config = {
            nodePropertyValue: cfg.item.get(cfg.nodeProperty),
            projection: cfg.projItem.getOwner()
         };
         config.children = cfg.hierarchy.getChildren(cfg.item, config.projection.getCollection());
         config.isLoaded = cfg.projItem.isLoaded();
         config.classIsLoaded = config.isLoaded ? ' controls-ListView__item-loaded' : '';
         if (cfg.partialyReload && cfg.expanderDisplayMode === 'withChild' && !config.isLoaded) {
            config.hasLoadedChild = cfg.item.get(cfg.hasChildrenProperty);
         } else {
            config.hasLoadedChild = config.children.length > 0;
         }
         config.classHasLoadedChild = config.hasLoadedChild ? ' controls-ListView__item-with-child' : ' controls-ListView__item-without-child';
         config.classNodeType = ' controls-ListView__item-type-' + (config.nodePropertyValue == null ? 'leaf' : config.nodePropertyValue == true ? 'node' : 'hidden');
         config.classNodeState = config.nodePropertyValue !== null ? (' controls-TreeView__item-' + (cfg.projItem.isExpanded() ? 'expanded' : 'collapsed')) : '';
         config.classIsSelected = (cfg.selectedKey == cfg.item.getId()) ? ' controls-ListView__item__selected' : '';
         config.isColumnScrolling = cfg.startScrollColumn !== undefined;
         config.columnsShift = cfg.columnsShift;
         config.addClasses = 'controls-DataGridView__tr controls-ListView__item js-controls-ListView__item ' + (cfg.className ? cfg.className : '') + config.classNodeType + config.classNodeState + config.classIsLoaded + config.classHasLoadedChild + config.classIsSelected;
         
         if(cfg.selectedKey === cfg.item.get(cfg.idProperty)) {
            config.addClasses += ' controls-ListView__item__selected';
         }
         
         return config;
      },
      getItemContentTplData = function(cfg){
         var data = {};
         data.hierField$ = cfg.projItem.getContents().get(cfg.parentProperty + '$');
         data.hasScroll = cfg.startScrollColumn !== undefined;
         data.itemLevel = cfg.projItem.getLevel() - 1;
         data.isNode = cfg.projItem.getContents().get(cfg.nodeProperty);
         data.hasChilds = cfg.hierarchy.getChildren(cfg.item, cfg.projItem.getOwner().getCollection()).length > 0;
         return data;
      };

   'use strict';

   /**
    * Класс контрола "Иерархическое табличное представление".
    * <a href="http://axure.tensor.ru/standarts/v7/%D0%B4%D0%B5%D1%80%D0%B5%D0%B2%D0%BE__%D0%B2%D0%B5%D1%80%D1%81%D0%B8%D1%8F_1_.html">Спецификация</a>
    * <a href="/doc/platform/developmentapl/interface-development/components/list/list-settings/">Документация</a>.
    *
    * @class SBIS3.CONTROLS/Tree/DataGridView
    * @extends SBIS3.CONTROLS/DataGridView
    * @mixes SBIS3.CONTROLS/Mixins/TreeMixin
    * @mixes SBIS3.CONTROLS/Mixins/TreeViewMixin
    *
    * @cssModifier controls-TreeDataGridView__hideExpandsOnHiddenNodes Скрывает треугольник рядом с записью типа "Скрытый узел" (см. <a href='/doc/platform/developmentapl/service-development/bd-development/vocabl/tabl/relations/#hierarchy'>Иерархия</a>). Для контрола SBIS3.CONTROLS/Tree/CompositeView модификатор актуален только для режима отображения "Таблица" (см. {@link SBIS3.CONTROLS/Mixins/CompositeViewMixin#viewMode viewMode}=table).
    * @cssModifier controls-TreeDataGridView__withPhoto-S Устанавливает отступы с учетом расположения в верстке изображения, размера S.
    * @cssModifier controls-TreeDataGridView__withPhoto-M Устанавливает отступы с учетом расположения в верстке изображения, размера M.
    * @cssModifier controls-TreeDataGridView__withPhoto-L Устанавливает отступы с учетом расположения в верстке изображения, размера L.
    * @cssModifier controls-TreeView__withoutLevelPadding Устанавливает режим отображения дерева без иерархических отступов.
    * @cssModifier controls-TreeView__hideExpands Устанавливает режим отображения дерева без иконок сворачивания/разворачивания узлов.
    *
    * @author Авраменко А.С.
    *
    * @control
    * @public
    * @category Lists
    * @initial
    * <component data-component='SBIS3.CONTROLS/Tree/DataGridView'>
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

   var TreeDataGridView = DataGridView.extend([TreeMixin, TreeViewMixin], /** @lends SBIS3.CONTROLS/Tree/DataGridView.prototype*/ {
      _dotTplFn : dotTplFn,
      $protected: {
         _options: {
            _buildTplArgs: buildTplArgsTDG,
            _buildTplArgsTDG: buildTplArgsTDG,
            _canServerRender: true,
            _defaultItemTemplate: ItemTemplate,
            _defaultItemContentTemplate: ItemContentTemplate,
            _defaultSearchRender: searchRender,
            _getItemTemplateData: getItemTemplateData,
            _footerWrapperTemplate: FooterWrapperTemplate,
            _getFolderFooterOptions: getFolderFooterOptions,
            _getSearchCfg: getSearchCfg,
            _hasFolderFooters: hasFolderFooters,
            /**
             * @cfg {Function}
             * @see editArrow
             * @deprecated Используйте {@link editArrow}.
             */
            arrowActivatedHandler: undefined,
            /**
             * @cfg {String} Устанавливает отображение кнопки (>>) справа от названия папки.
             * @remark
             * Варианты значений:
             * <ul>
             *    <li> true - стрелка показывается платформенным механизмом;</li>
             *    <li> false - стрелка не отображается;</li>
             *    <li> custom - стрелка показывается платформенным механизмом, но место расположения определяет прикладной программист, сделать это можно расположив "маркер" c классом js-controls-TreeView__editArrow;</li>
             * </ul>
             * Папкой в контексте иерархического списка может быть запись типа "Узел" и "Скрытый узел". Подробнее о различиях между типами записей вы можете прочитать в разделе <a href='/doc/platform/developmentapl/service-development/bd-development/vocabl/tabl/relations/#hierarchy'>Иерархия</a>.
             * <br/>
             * Кнопка отображается в виде иконки с классом icon-16 icon-View icon-primary (синяя двойная стрелочка). Изменение иконки не поддерживается.
             * <br/>
             * При клике по стрелке происходит событие {@link onItemActivate}, в обработчике которого, как правило, устанавливают отрытие <a href='/doc/platform/developmentapl/interface-development/forms-and-validation/windows/editing-dialog/'>диалога редактирования</a>.
             * @example
             * Устанавливаем опцию:
             * <pre>
             *     <option name="editArrow">true</option>
             * </pre>
             * Устанавливаем обработчик:
             * <pre>
             * myView.subscribe('onItemActivate', function(eventObject, meta){
             *    action.execute(meta);
             * });
             * </pre>
             * @see arrowActivatedHandler
             * @see SBIS3.CONTROLS/ListView#onItemActivate
             */
            editArrow: false,
            /**
             * @cfg {Boolean} отображает папки с одной колонкой на всю строку
             * Значение по умолчанию false
             * @deprecated Функционал должен быть реализован через пользовательский шаблон.
             */
            // Добавил опцию для версии 220
            // с 3.7.5 будет рулиться через пользовательский шаблон
            foldersColspan: false,
            /**
             * @cfg {Boolean} Включает режим разворачивания узлов дерева при клике на сам элемент-узел.
             * Отключив данный режим разворот будет возможен только при клике на иконку разворота узла.
             * @example
             * Устанавливаем опцию:
             * <pre>
             * expandByItemClick="{{true}}"
             * </pre>
             */
            expandByItemClick: true
         },
         _dragStartHandler: undefined,
         _editArrow: undefined
      },

      $constructor: function() {
         CommandDispatcher.declareCommand(this, 'loadNode', this._folderLoad);
      },
      init: function(){
         var
            self = this;
         TreeDataGridView.superclass.init.call(this);
         // Костыль для правильного отображения лесенки в режиме поиска:
         // Назначаем собственный конвертер и в режиме поиска не строим лесенку для узлов, отображаемых в хлебных крошках.
         // https://online.sbis.ru/opendoc.html?guid=c0cfbaf3-923b-46ea-a378-9f1ae36fa00a
         // todo Чтобы убрать это - нужно перейти на SearchDisplay, что в рамках текущей реализации практически анреал задача.
         this.once('onDrawItems', function() {
            this._options._ladderInstance._columnNames.forEach(function(columnName) {
               self._options._ladderInstance.setConverter(columnName, function (value, item) {
                  if (self._isSearchMode() && (!item.get || item.get(self._options.nodeProperty))) {
                     return;
                  } else {
                     return value;
                  }
               });
            });
         });
         if (this._options._serverRender) {
            this._createAllFolderFooters();
         }
      },

      redraw: function() {
         /* Перед перерисовкой скроем стрелки редактирования, иначе будет мограние,
            т.к. после отрисовки данные полностью могу измениться */
         this._hideEditArrow();
         TreeDataGridView.superclass.redraw.apply(this, arguments);
         /*redraw может позваться, когда данных еще нет*/
         if (this._getItemsProjection()) {
            this._createAllFolderFooters();
            // Правильно именно по onDrawItems пересчитывать размеры, т.к. в searchController'e по этому событию вешается
            // доп. класс "controls-GridView__searchMode", влияющий на отступы
            this.once('onDrawItems', function() {
               this._checkBreadCrumbsWidth();
            });
         }
      },
      
      _onResizeHandler: function() {
         TreeDataGridView.superclass._onResizeHandler.call(this);
         this._checkBreadCrumbsWidth();
      },
      
      _checkBreadCrumbsWidth: function() {
         /* Необходимо ограничивать ширину хлебных крошек в случае динамической ширины таблицы,
            т.к. тогда ширину хлебных крошек никто не ограничит.
            Динамическая ширина таблицы включается, когда:
            - Включен частичный скролл.
            - Висит модификатор controls-DataGridView__tableLayout-auto, который вешает table-layout: auto на таблицу,
              и таблица может вылезать за пределы контенера контрола. */
         if ((this._options.startScrollColumn || this.getContainer().hasClass('controls-DataGridView__tableLayout-auto')) && this._isSearchMode()){
            var breadCrumbs = this.getContainer().find('.controls-TreeView__searchBreadCrumbs'),
                firstCol, firstColWidth, secondCol, cellPadding, firstRow;
            
            if(breadCrumbs.length) {
               firstRow = $('.js-controls-ListView__item:not(".controls-editInPlace"):first', this._getItemsContainer());
               firstCol = $('td:first', firstRow);
               firstColWidth = this._options.multiselect ? firstCol.outerWidth() : 0;
               secondCol = firstCol.next('td');
   
               /* Второй колонки может и не быть, тогда считаем паддинг по первой */
               if(!secondCol.length) {
                  secondCol = firstCol;
               }
               
               cellPadding = secondCol.outerWidth() - secondCol.width();
               
               breadCrumbs.width(this.getContainer().width() - cellPadding - firstColWidth);
            }
         }
      },

      _drawItemsCallback: function() {
         var actions = this.getItemsActions();
         if (actions) {
            actions.ready(function() {
               this._updateEditArrow();
            }.bind(this));
         }
         TreeDataGridView.superclass._drawItemsCallback.apply(this, arguments);
      },
   
      _drawItemsCallbackSync: function() {
         /* Если включен table-layout: auto,
            то пересчёт размеров надо производить в синхронной фазе с отрисовкой,
            инчае таблица будет скакать */
         if (this._container.hasClass('controls-DataGridView__tableLayout-auto')) {
            this._checkBreadCrumbsWidth();
         }
         TreeDataGridView.superclass._drawItemsCallbackSync.apply(this, arguments);
      },

      //Переопределяем метод, потому что в дереве могут присутствовать футеры папок, и если записи добавляются в конец,
      //то они добавятся после футера папки, чего быть не должно. Проверим что записи добавляются в конец и добавим их после
      //последнего элемента, иначе будет выполнена штатная логика.
      _getInsertMarkupConfig: function(newItemsIndex, newItems) {
         var
            cfg = TreeDataGridView.superclass._getInsertMarkupConfig.apply(this, arguments),
            lastItem = this._options._itemsProjection.at(newItemsIndex - 1),
            lastItemParent, newItemsParent, existingContainer, firstTreeItem;

         if (cfg.inside && !cfg.prepend) {
            cfg.inside = false;
            // Учитываем так же, что lastItem может быть группой - в таком случае родитель группы нам не интересен
            // https://online.sbis.ru/opendoc.html?guid=2781df20-a30f-4d7b-82de-c37944da5729
            lastItemParent = lastItem && lastItem.isNode ? lastItem.getContents().get(this._options.parentProperty) : undefined;
            firstTreeItem = newItems[0].isNode ? newItems[0] : newItems[1];
            newItemsParent = firstTreeItem ? firstTreeItem.getContents().get(this._options.parentProperty) : undefined;
            /* В виду того, что мы не можем различить, откуда вызван _getInsertMarkupConfig, возникают две противоречивые ситуации:
               1. В случае перерисовки ПЕРВОЙ записи в хлебных крошках (изменён прямо record), предыдущий элемент будет
                  расположен в других хлебных крошках (https://online.sbis.ru/opendoc.html?guid=033fd05c-fb2e-4c3a-a648-37cf47b05a50).
                  Тогда контейнером, ЗА которым будут добавлены записи, должна стать правильная хлебная крошка, являющаяся реальным
                  родителем перерисовываемой записи.
               2. В случае поиска, результаты могут прилететь на второй странице и вызов _getInsertMarkupConfig будет из метода
                  _addItems (https://online.sbis.ru/opendoc.html?guid=b395391e-b4de-4dd8-affb-4ec79c40c158).
                  Новую хлебную крошку мы могли ранее не выводить и тогда контейнером, ЗА которым будут добавлены записи, должен стать
                  последний отрисованный элемент. */
            if (this._isSearchMode() && lastItemParent !== newItemsParent) {
               // Ситуация №1 - пытаемся найти уже существующую хлебную крошку и тогда записи будем добавлять непосредственно после неё.
               existingContainer = this._getItemsContainer().find('.controls-DataGridView__tr.controls-HierarchyDataGridView__path[data-id="' + newItemsParent + '"]');
               if (existingContainer.length) {
                  cfg.container = existingContainer;
               } else { // Ситуация №2 - если существующую хлебную крошку найти не удалось - то добавляем записи за последним элементом.
                  cfg.container = this._getDomElementByItem(lastItem);
               }
            } else {
               cfg.container = this._getDomElementByItem(lastItem);
            }
         }

         // Если в режиме поиска контейнер для вставки так и не был определен и lastItem - хлебная крошка (isNode), то ищем tr-ку в которой она лежит.
         // Подробное объяснение:
         // В режиме поиска последним отрисованным элементом запросто может быть хлебная крошка и вставлять нужно после tr-ки в которая она лежит.
         // Можно было вызывать перерисовку, если запущен режим поиска и последним элементом на текущей загруженной странице является папка.
         // Но этот вариант очень трудно реализуем, т.к. куча точек входа, где загрузка может быть прервана или перезапущена.
         // Как итог - завел задачу, по которой нужно переосмыслить текущий механизм и решить подобные проблемы раз и навсегда.
         // p.s. data-id используется потому что у крошек нет data-hash.
         if (this._isSearchMode() && !cfg.container.length && lastItem && lastItem.isNode && lastItem.isNode()) {
            cfg.container = this._getItemsContainer().find('.js-controls-BreadCrumbs__crumb[data-id="' + lastItem.getContents().getId() + '"]').parents('.controls-DataGridView__tr.controls-HierarchyDataGridView__path');
         }
         return cfg;
      },

      _getEditorOffset: function(model, target) {
         var
            container = this.getContainer(),
            parentProj = this._getItemProjectionByItemId(model.get(this._options.parentProperty)),
            // Без режима поиска и при наличии родителя - необходимо учесть отступ иерархии
            levelOffset = 0,
            hasCheckbox = container.hasClass('controls-ListView__multiselect'),
            checkboxOffset = 0,
            result;
         // В режиме поиска если запись лежит в узле, то у неё есть один (единственный) отступ, учитываем это
         if (this._isSearchMode()) {
            if (parentProj) {
               levelOffset = this._getLevelPaddingWidth();
            }
         } else {
            // Вне режима поиска считаем отступ, исходя из уровня вложенности
            if (parentProj) {
               levelOffset = parentProj.getLevel() * this._getLevelPaddingWidth();
            }
         }
         if (this._options.editingTemplate && hasCheckbox) {
            checkboxOffset = container.hasClass('controls-ListView__hideCheckBoxes') ? DEFAULT_ROW_SELECT_WIDTH : DEFAULT_SELECT_CHECKBOX_WIDTH;
         }
         // Считаем необходимый отступ слева-направо:
         // отступ чекбокса + отступ строки + отступ иерархии (в режиме поиска 0) + ширина стрелки разворота.
         // Так же в режиме поиска или наличии модификатора controls-TreeView__hideExpands не нужно учитывать DEFAULT_EXPAND_ELEMENT_WIDTH, т.к. expand { display: none; }
         result = checkboxOffset + this._getRowPadding(target) + levelOffset + (this._isSearchMode() || container.hasClass('controls-TreeView__hideExpands') ? 0 : DEFAULT_EXPAND_ELEMENT_WIDTH);
         // Если не задан шаблон редактирования строки и отображаются чекбоксы - компенсируем разницу оступов в полях ввода и ячеек таблицы (в полях ввода 5px, в таблице - 6px)
         if (!this._options.editingTemplate && hasCheckbox) {
            result += DEFAULT_CELL_PADDING_DIFFERENCE;
         } else { // иначе - компенсируем отступ до редактора, исходя из оступов в полях ввода
            result -= DEFAULT_FIELD_PADDING_SIZE;
         }
         return result;
      },

      _getRowPadding: function(target) {
         // На редактироавние могут быть открыты хлебные крошки и тогда левый отступ строки не нужно учитывать.
         var
            paddingElement = target.find('.controls-DataGridView__firstContentCell').get(0);
         return paddingElement ? parseInt(window.getComputedStyle(paddingElement, null).getPropertyValue('padding-left')) : 0;
      },

      _getLevelPaddingWidth: function() {
         var
            $levelPadding = $('<div class="controls-TreeDataGridView__levelPadding" style="position: absolute; visibility: hidden;">'),
            result;
         $levelPadding.appendTo(this._getItemsContainer());
         result = parseInt($levelPadding.width());
         $levelPadding.remove();
         return result;
      },

      _keyboardHover: function(e) {
         var
            parentResult = TreeDataGridView.superclass._keyboardHover.apply(this, arguments),
            selectedKey, rec;
         if (e.which === constants.key.right || e.which === constants.key.left) {
            selectedKey = this.getSelectedKey();
            rec = this.getItems().getRecordById(selectedKey);
            if (rec && rec.get(this._options.nodeProperty)) {
               this[e.which === constants.key.right ? 'expandNode' : 'collapseNode'](selectedKey);
            }
         }
         return parentResult;
      },

      collapseNode: function (key, hash) {
         this._hideItemsToolbar();
         return TreeDataGridView.superclass.collapseNode.apply(this, arguments);
      },

      expandNode: function (key, hash) {
         var self = this,
             expandResult;

         this._hideItemsToolbar();
         expandResult = TreeDataGridView.superclass.expandNode.apply(this, arguments);
         expandResult.addCallback(function(result) {
            self._updateHoveredColumnCells();
            return result;
         });
         return expandResult;
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
               icon: 'icon-View icon-size',
               parent: this,
               allowChangeEnable: false,
               handlers: {
                  onActivated: function () {
                     var id = self.getHoveredItem().key;
                     self._activateItem(id);
                     self._itemActionActivated(id);
                  }
               }
            });
            //Т.к. базовый контрол снимает класс ws-hidden, а нам надо, чтобы изначально стрелка была скрыта.
            //А если её создавать скрытой, а потом показывать, вызывается лишний resize
            this._hideEditArrow();
         }

         return this._editArrow;
      },

      _getEditArrowPosition: function(td, folderTitle, arrowContainer) {
         var  containerCords = this._container[0].getBoundingClientRect(),
              toolbarContainer = this._getItemsToolbar().getContainer(),
              tdPadding, arrowCords, leftOffset, toolbarLeft, needCorrect, editArrowWidth;
         
         tdPadding = parseInt(td.css('padding-right'), 10);
         /* Т.к. у нас в вёрстке две иконки, то позиционируем в зависимости от той, которая показывается,
            в .200 переделаем на маркер */
         if(arrowContainer.length === 2) {
            /* Считаем, чтобы правая координата названия папки не выходила за ячейку,
               учитываем возможные отступы иерархии и ширину expander'a*/
            if ( td[0].getBoundingClientRect().right - tdPadding < folderTitle[0].getBoundingClientRect().right) {
               arrowContainer = arrowContainer[1];
            } else {
               arrowContainer = arrowContainer[0];
            }
         } else {
            arrowContainer = arrowContainer[0];
         }

         arrowCords = arrowContainer.getBoundingClientRect();
         leftOffset = arrowCords.left - containerCords.left;
         editArrowWidth = this.getEditArrow().getContainer().outerWidth(true);
         
         if(this._isSupportedItemsToolbar() && this._getItemsToolbar().isVisible()) {
            toolbarLeft = toolbarContainer[0].offsetLeft;
            // когда тулбар находится в строке считать пересечение через offsetLeft не получится
            // т.к. offsetLeft будет считаться от края td в которой лежит тулбар
            if (this._options.itemsActionsInItemContainer){
               needCorrect = (this.getContainer().width() - (leftOffset + editArrowWidth) - toolbarContainer.width()) < 0;
            } else {
               needCorrect = toolbarLeft && (toolbarLeft < (leftOffset + editArrowWidth)); // Учитываем ширину иконки стрелки при корректировке
            }
            /* Если стрелка заползает на операции над записью -> увеличиваем отступ */
            if (needCorrect) {
               leftOffset -= leftOffset - toolbarLeft + editArrowWidth; //Левая граница тулбара + ширина стрелки c учётом margin
            }
            /* backgorund'a у стрелки быть не должно, т.к. она может отображаться на фоне разного цвета,
               но если мы корректрируем положение, то надо навесить background, чтобы она затемняла текст */
            this.getEditArrow().getContainer().toggleClass('controls-TreeView__editArrow-background', needCorrect);
         }
         
         return {
            top: arrowCords.top - containerCords.top + this._container[0].scrollTop,
            left: leftOffset
         }
      },
      
      _getEditArrowMarker: function(itemContainer) {
         var arrowContainer = itemContainer.find('.js-controls-TreeView__editArrow');
         
         if(!arrowContainer.length) {
            arrowContainer = itemContainer.find('.controls-TreeView__editArrow');
         }
         return arrowContainer;
      },

      _onChangeHoveredItem: function() {
         TreeDataGridView.superclass._onChangeHoveredItem.apply(this, arguments);
         /* Т.к. механизм отображения стрелки и операций над записью на ipad'e релизован с помощью свайпов,
            а на PC через mousemove, то и скрывать/показывать их надо по-разному */
         if(!this._touchSupport || !this._hasHoveredItem()) {
            this._updateEditArrow();
         }
      },

      _onAfterBeginEdit: function() {
         TreeDataGridView.superclass._onAfterBeginEdit.apply(this, arguments);
         this._updateEditArrow();
      },

      _onAfterEndEdit: function() {
         TreeDataGridView.superclass._onAfterEndEdit.apply(this, arguments);
         this._updateEditArrow();
      },

      _updateEditArrow: function() {
         if(this._options.editArrow || this._options.arrowActivatedHandler) {
            if(this._hasHoveredItem()) {
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
             editArrowContainer, folderTitle, titleTd, editArrowMarker, projItem, hoveredItemContainer;
         
         if(this._hasHoveredItem()) {
            projItem = this._getItemsProjection().getItemBySourceItem(hoveredItem.record);
         }

         /* Не показываем если:
            1) Иконку скрыли
            2) Не папка
            3) Режим поиска (по стандарту)
            4) projItem'a может не быть при добавлении по месту */
         if(projItem && this.getEditArrow().isVisible() && !this._isSearchMode()) {
            runDelayed(forAliveOnly(function() {
               //Из-за ассинхронной задержки runDelayed(), hoveredItemContainer может обратиться в null
               var
                   hoveredItem = this.getHoveredItem(),
                   hoveredItemContainer = hoveredItem.container;
               if(hoveredItemContainer === null)
                  return;
               if(!projItem.isNode() && this._options.editArrow !== 'custom') {
                  this._hideEditArrow();
                  return;
               }
               folderTitle = hoveredItemContainer.find('.controls-TreeView__folderTitle');
               titleTd = folderTitle.closest('.controls-DataGridView__td', hoveredItemContainer);
               editArrowMarker = this._getEditArrowMarker(hoveredItemContainer);
               if (editArrowMarker.length) {
                  editArrowContainer = this.getEditArrow().getContainer();
                  editArrowContainer.removeClass('ws-hidden');
                  editArrowContainer.css(this._getEditArrowPosition(titleTd, folderTitle, editArrowMarker));
               }
            }, this));
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
         TreeDataGridView.superclass._onLeftSwipeHandler.apply(this, arguments);
         if(this._options.editArrow || this._options.arrowActivatedHandler) {
            this._showEditArrow();
         }
      },

      _onRightSwipeHandler: function() {
         if(this._options.editArrow || this._options.arrowActivatedHandler) {
            this._hideEditArrow();
         }
         TreeDataGridView.superclass._onRightSwipeHandler.apply(this, arguments);
      },
   
      _mouseDownHandler: function(e) {
         /* По стандарту отключаю выделение по двойному клику мышкой в дереве */
         if(e.originalEvent.detail > 1 && this._needProcessMouseEvent(e)) {
            e.preventDefault();
         }
         TreeDataGridView.superclass._mouseDownHandler.apply(this, arguments);
      },

      _isHoverControl: function(target) {
         var res = TreeDataGridView.superclass._isHoverControl.apply(this, arguments);

         if(!res && (this._options.editArrow || this._options.arrowActivatedHandler) && this._editArrow) {
            return contains(this.getEditArrow().getContainer()[0], target[0]) || this.getEditArrow().getContainer()[0] === target[0];
         }
         return res;
      },
      _addItemAttributes : function(container, itemProjection) {
         TreeDataGridView.superclass._addItemAttributes.call(this, container, itemProjection);
         var
            item = itemProjection.getContents(),
            hierType = item.get(this._options.nodeProperty),
            itemType = hierType == null ? 'leaf' : hierType == true ? 'node' : 'hidden';
         container.addClass('controls-ListView__item-type-' + itemType);
         var
            key = item.getId(),
            parentKey = item.get(this._options.parentProperty),
         	parentContainer = $('.controls-ListView__item[data-id="' + parentKey + '"]', this._getItemsContainer().get(0)).get(0);
         container.attr('data-parent', parentKey);

         if (this._options.openedPath[key]) {
            var hierarchy = this._options._getHierarchyRelation(this._options),
               children = hierarchy.getChildren(key, this.getItems());

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
         if (closestExpand.hasClass('js-controls-TreeView__expand')) {
            if (this._options.loadItemsStrategy == 'append') {
               var tr = this._findItemByElement($(target));
               var hash = tr.attr('data-hash');
               this.toggleNode(id, hash);
            }
            else {
               this.toggleNode(id);
            }
            return;
         }

         if (this._options.allowEnterToFolder){
            /* Не обрабатываем клики по чекбоку и по стрелке редактирования, они обрабатываются в elemClickHandler'e */
            if ($target.hasClass('js-controls-TreeView__editArrow') || $target.hasClass('js-controls-ListView__itemCheckBox')) {
               return false;
            } else if (data.get(this._options.nodeProperty)) {
               if (this._isCursorNavigation() && this._options.saveReloadPosition) {
                  delete this._hierPages[id];
               }
               this.setCurrentRoot(id);
               this.reload();
            }
            else {
               this._activateItem(id);
            }
         }
         else {
            if (data.get(this._options.nodeProperty)) {
               // Нужно разворачивать при клике по элементу в следующих ситуациях:
               // 1. Не режим поиска (hierarchyViewMode)
               // 2. Включен разворот по клику на сам элемент
               if (!this._options.hierarchyViewMode && this._options.expandByItemClick) {
                  this.toggleNode(id);
               }
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
         if (record.get(this._options.parentProperty) != this.getCurrentRoot()){
            return false;
         }
         return TreeDataGridView.superclass._groupByDefaultMethod.apply(this, arguments);
      },
      _getEditInPlaceConfig: function() {
         var config = TreeDataGridView.superclass._getEditInPlaceConfig.apply(this, arguments);
         config.getEditorOffset = this._getEditorOffset.bind(this);
         config.parentProperty = this._options.parentProperty;
         config.currentRoot = this.getCurrentRoot();
         return config;
      },

      _canStartEditOnItemClick: function(target) {
         //При клике на треугольник раскрытия папки начинать редактирование записи не нужно
         return !$(target).hasClass('js-controls-TreeView__expand') && TreeDataGridView.superclass._canStartEditOnItemClick.apply(this, arguments);
      },

      _onDragHandler: function (dragObject, e) {
         DataGridView.superclass._onDragHandler.call(this, dragObject, e);
         this._onDragCallback(dragObject, e);
      }
   });

   return TreeDataGridView;

});