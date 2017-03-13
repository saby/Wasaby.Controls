define('js!SBIS3.CONTROLS.DataGridView',
   [
   "Core/CommandDispatcher",
   "Core/core-functions",
   "Core/core-merge",
   "Core/constants",
   "Core/Deferred",
   "js!SBIS3.CONTROLS.ListView",
   "html!SBIS3.CONTROLS.DataGridView",
   "html!SBIS3.CONTROLS.DataGridView/resources/rowTpl",
   "html!SBIS3.CONTROLS.DataGridView/resources/colgroupTpl",
   "html!SBIS3.CONTROLS.DataGridView/resources/headTpl",
   "html!SBIS3.CONTROLS.DataGridView/resources/footTpl",
   "html!SBIS3.CONTROLS.DataGridView/resources/ResultsTpl",
   "js!SBIS3.CONTROLS.DragAndDropMixin",
   "js!SBIS3.CONTROLS.ImitateEvents",
   "html!SBIS3.CONTROLS.DataGridView/resources/DataGridViewGroupBy",
   'js!WS.Data/Display/Ladder',
   'js!SBIS3.CONTROLS.Utils.HtmlDecorators.LadderDecorator',
   "js!SBIS3.CONTROLS.Utils.TemplateUtil",
   "html!SBIS3.CONTROLS.DataGridView/resources/ItemTemplate",
   "html!SBIS3.CONTROLS.DataGridView/resources/ItemResultTemplate",
   "html!SBIS3.CONTROLS.DataGridView/resources/ItemContentTemplate",
   "html!SBIS3.CONTROLS.DataGridView/resources/cellTemplate",
   "tmpl!SBIS3.CONTROLS.DataGridView/resources/headColumnTpl",
   "html!SBIS3.CONTROLS.DataGridView/resources/GroupTemplate",
   "tmpl!SBIS3.CONTROLS.DataGridView/resources/SortingTemplate",
   "Core/helpers/collection-helpers",
   "Core/helpers/string-helpers",
   "Core/helpers/dom&controls-helpers",
   'css!SBIS3.CONTROLS.DataGridView'
],
   function(
      CommandDispatcher,
      cFunctions,
      cMerge,
      constants,
      Deferred,
      ListView,
      dotTplFn,
      rowTpl,
      colgroupTpl,
      headTpl,
      footTpl,
      resultsTpl,
      DragAndDropMixin,
      ImitateEvents,
      groupByTpl,
      Ladder,
      LadderDecorator,
      TemplateUtil,
      ItemTemplate,
      ItemResultTemplate,
      ItemContentTemplate,
      cellTemplate,
      headColumnTpl,
      GroupTemplate,
      SortingTemplate,
      colHelpers,
      strHelpers,
      dcHelpers
   ) {

   'use strict';

      var _prepareColumns = function(columns, cfg) {
            var columnsNew = cFunctions.clone(columns);
            for (var i = 0; i < columnsNew.length; i++) {
               if (columnsNew[i].cellTemplate) {
                  columnsNew[i].contentTpl = TemplateUtil.prepareTemplate(columnsNew[i].cellTemplate);
               }
               else {
                  columnsNew[i].contentTpl = TemplateUtil.prepareTemplate(cfg._defaultCellTemplate);
               }

               if (columnsNew[i].includedTemplates) {
                  var tpls = columnsNew[i].includedTemplates;
                  columnsNew[i].included = {};
                  for (var j in tpls) {
                     if (tpls.hasOwnProperty(j)) {
                        columnsNew[i].included[j] = TemplateUtil.prepareTemplate(tpls[j]);
                     }
                  }
               }


            }
            return columnsNew;
         },
         getColumnVal = function (item, colName) {
            if (!colName || !(colName.indexOf("['") == 0 && colName.indexOf("']") == (colName.length - 2))){
               return item.get(colName);
            }
            var colNameParts = colName.slice(2, -2).split('.'),
               curItem = item,
               value;
            for (var i = 0; i < colNameParts.length; i++){
               if (i !== colNameParts.length - 1){
                  curItem = curItem.get(colNameParts[i]);
               }
               else{
                  value = curItem.get(colNameParts[i]);
               }
            }
            return value;
         },
         buildTplArgsLadder = function(args, cfg) {
            args.ladder = cfg._ladderInstance;
            args.ladderColumns = cfg.ladder || [];
         },
         buildTplArgsDG = function(cfg) {
            var tplOptions = cfg._buildTplArgsLV.call(this, cfg);
            tplOptions.columns = _prepareColumns.call(this, cfg.columns, cfg);
            tplOptions.cellData = {
               /*TODO hierField вроде тут не должно быть*/
               hierField: cfg.hierField,
               parentProperty: cfg.parentProperty,
               nodeProperty: cfg.nodeProperty,
               getColumnVal: getColumnVal,
               decorators : tplOptions.decorators,
               displayField : tplOptions.displayProperty,
               displayProperty: tplOptions.displayProperty
            };
            tplOptions.startScrollColumn = cfg.startScrollColumn;
            buildTplArgsLadder(tplOptions.cellData, cfg);

            return tplOptions;
         },
         checkColumns = function(cfg) {
            for (var i = 0; i < cfg.columns.length; i++) {
               var column = cfg.columns[i];
               if (column.highlight === undefined) {
                  column.highlight =  true;
               }
            }
         },
         prepareHeadColumns = function(cfg){
            var
               rowData = {},
               columns = cFunctions.clone(cfg.columns),
               supportUnion,
               supportDouble,
               curCol,
               nextCol,
               curColSplitTitle,
               nextColSplitTitle;

            rowData.countRows = 1;
            rowData.content = [[], []];

            if (!cfg.transformHead){
               rowData.content[0] = columns;
               return rowData;
            }

            for (var i = 0, l = columns.length; i < l; i++){
               curCol = columns[i];
               nextCol = columns[i + 1];
               curColSplitTitle = (curCol.title || '').split('.');
               nextColSplitTitle = nextCol && nextCol.title.split('.');

               if (!supportDouble){
                  supportDouble = cFunctions.clone(curCol);
               }
               else {
                  curColSplitTitle = [supportDouble.value, curColSplitTitle];
               }
               if (curColSplitTitle.length == 2){
                  supportDouble.value = supportDouble.title = curColSplitTitle[0];
                  supportDouble.colspan = supportDouble.colspan || 1;
                  curCol.title = curColSplitTitle[1];
                  if (nextCol && (curColSplitTitle.length == nextColSplitTitle.length) && (curColSplitTitle[0] == nextColSplitTitle[0])){
                     nextCol.title = nextColSplitTitle[1];
                     supportDouble.colspan++;
                  }
                  else{
                     if (supportDouble.title){
                        if (!supportDouble.className) {
                           supportDouble.className = '';
                        }
                        supportDouble.className += ' controls-DataGridView__th__topRow-has_text';
                     }
                     rowData.content[1].push(supportDouble);
                     supportDouble = null;
                  }
                  rowData.countRows = 2;
               }
               else {
                  supportDouble.rowspan = curCol.rowspan = 2;
                  rowData.content[1].push(supportDouble);
                  supportDouble = null;
               }

               if (!supportUnion){
                  supportUnion = cFunctions.clone(curCol);
               }
               if (nextCol && (supportUnion.title == nextCol.title)) {
                  if (curCol.rowspan) {
                     rowData.content[1].pop(); //Убираем колонку из верхней строки, т.к. в этом месте рассчитывается colspan. Добавим ее обратно, когда рассчитаем все colspan'ы
                  }
                  supportUnion.colspan = ++supportUnion.colspan || 2;
               }
               else {
                  if (curCol.rowspan) {
                     var topRow = rowData.content[1].pop();
                     topRow.colspan = supportUnion.colspan;
                     topRow.value = topRow.title = supportUnion.title;
                     rowData.content[1].push(topRow);
                     supportUnion.ignore = true; //Игнорируем колонку в случае, если в шапке 2 строки (от верхней строки установится rowspan).
                  }
                  rowData.content[0].push(supportUnion);
                  supportUnion = null;
               }
            }
            return rowData;
         },
         prepareHeadData = function(cfg) {
            var
               headData = {
                  columns: cFunctions.clone(cfg.columns),
                  multiselect : cfg.multiselect,
                  startScrollColumn: cfg.startScrollColumn,
                  resultsPosition: cfg.resultsPosition,
                  resultsTpl: TemplateUtil.prepareTemplate(cfg.resultsTpl),
                  showHead: cfg.showHead
               },
               column,
               columnTop,
               headColumns = prepareHeadColumns(cfg);
            cMerge(headData, headColumns);
            for (var i = 0; i < headData.content[0].length; i++) {
               columnTop = headData.content[1][i];
               column = headData.content[0][i];

               if (columnTop) {
                  if (columnTop.rowspan > 1 && columnTop.headTemplate){ //Если колонка на 2 строки, то отрисуем headTemplate в ней
                     columnTop.value = getHeadColumnTpl(columnTop);
                  }
                  else {
                     columnTop.value = getDefaultHeadColumnTpl(columnTop.title);
                  }
               }

               //TODO здесь получается верстка, которая отдается в шаблонизатор.
               //лучше прокинуть сам шаблон, чтобы он потом там позвался
               if (column.sorting) {
                  column.value = getSortingColumnTpl(column, cfg);
               }
               else if (column.headTemplate) {
                  column.value = getHeadColumnTpl(column);
               } else {
                  column.value = getDefaultHeadColumnTpl(column.title);
               }
            }

            if (cfg._items && cfg._items.getMetaData().results){
               prepareResultsData(cfg, headData, cfg._items.getMetaData().results);
               headData.hasResults = true;
            }

            return headData;
         },
         getSortingColumnTpl = function(column, cfg) {
            var
               sorting = cfg.sorting,
               sortingValue;

            sorting.forEach(function(sortingElem){
               if (sortingElem[column.field]) {
                  sortingValue = sortingElem[column.field];
               }
            });

            return TemplateUtil.prepareTemplate(SortingTemplate)({
               column: column,
               sortingValue: sortingValue
            });
         },
         getHeadColumnTpl = function (column){
            return TemplateUtil.prepareTemplate(column.headTemplate)({
               column: column
            });
         },
         getDefaultHeadColumnTpl = function(title){
            return headColumnTpl({title: title});
         },
         prepareResultsData = function (cfg, headData, resultsRecord) {
            var data = [], value, column;
            for (var i = 0, l = headData.columns.length; i < l; i++){
               column = headData.columns[i];
               value = resultsRecord.get(column.field);
               if (value == undefined) {
                  value = i == 0 ? cfg.resultsText : '';
               }
               if (!column.resultTemplate) {
                  column.resultTemplate = ItemResultTemplate;
               }
               else{
                  column.resultTemplate = TemplateUtil.prepareTemplate(column.resultTemplate);
               }
               column.resultTemplateData = {
                  result: value,
                  item: resultsRecord,
                  column: column,
                  index: i,
                  resultsText: cfg.resultsText
               };
               //TODO в рамках совместимости, выпилить как все перейдут на отрисовку колонки через функцию в resultsTpl
               //{{=column.resultTemplate(column.resultTemplateData)}}
               data.push(TemplateUtil.prepareTemplate(column.resultTemplate)(column.resultTemplateData));
            }
            headData.results = data;
            headData.item = resultsRecord;//тоже в рамках совместимости для 230 версии, что с этим делать написано чуть выше
         },
         prepareColGroupData = function (cfg) {
            return {
               columns: cfg.columns,
               multiselect: cfg.multiselect
            }
         };
   /**
    * Контрол, отображающий набор данных в виде таблицы с несколькими колонками. Подробнее о настройке контрола и его окружения вы можете прочитать в разделе <a href="https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/components/list/list-settings/">Настройка списков</a>.
    *
    * @class SBIS3.CONTROLS.DataGridView
    * @extends SBIS3.CONTROLS.ListView
    * @author Крайнов Дмитрий Олегович
    * @mixes SBIS3.CONTROLS.DragAndDropMixin
    *
    * @demo SBIS3.CONTROLS.Demo.MyDataGridView
    * @demo SBIS3.CONTROLS.Demo.LadderDataGridView Лесенка
    * @demo SBIS3.DOCS.GroupByWrap Группировка записей.
    *
    *
    * @cssModifier controls-ListView__withoutMarker Скрывает отображение маркера активной строки. Подробнее о маркере вы можете прочитать в <a href="https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/components/list/list-settings/list-visual-display/marker/">этом разделе</a>.
    * @cssModifier controls-DataGridView__markerRight Устанавливает отображение маркера активной строки справа от записи. Подробнее о маркере вы можете прочитать в <a href="https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/components/list/list-settings/list-visual-display/marker/">этом разделе</a>.
    * @cssModifier controls-DataGridView__hasSeparator Устанавливает отображение линий-разделителей между строками.
    * При использовании контролов {@link SBIS3.CONTROLS.CompositeView} или {@link SBIS3.CONTROLS.TreeCompositeView} модификатор применяется только для режима отображения "Таблица".
    * @cssModifier controls-DataGridView__overflow-ellipsis Устанавливает обрезание троеточием текста во всех колонках таблицы.
    * @cssModifier controls-DataGridView__sidePadding-12 Устанавливает левый отступ первой колонки и правый отступ последней колонки равный 12px.
    * @cssModifier controls-DataGridView__sidePadding-16 Устанавливает левый отступ первой колонки и правый отступ последней колонки равный 16px.
    * @cssModifier controls-DataGridView__sidePadding-20 Устанавливает левый отступ первой колонки и правый отступ последней колонки равный 20px.
    * @cssModifier controls-DataGridView__sidePadding-24 Устанавливает левый отступ первой колонки и правый отступ последней колонки равный 24px.
    *
    * @control
    * @public
    * @category Lists
    * @designTime plugin /design/DesignPlugin
    * @initial
    * <component data-component='SBIS3.CONTROLS.DataGridView'>
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
   var DataGridView = ListView.extend([DragAndDropMixin],/** @lends SBIS3.CONTROLS.DataGridView.prototype*/ {
      _dotTplFn : dotTplFn,
      /**
       * @event onDrawHead Возникает после отрисовки шапки
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       */
      $protected: {
         _rowTpl : rowTpl,
         _rowData : [],
         _isPartScrollVisible: false,                 //Видимость скроллбара
         _movableElements: undefined,                 //Скролируемые элементы
         _arrowLeft: undefined,                       //Контейнер для левой стрелки
         _arrowRight: undefined,                      //Контейнер для правой стрелки
         _thumb: undefined,                           //Контейнер для ползунка
         _hoveredColumn: {
            cells: null,
            columnIndex: null
         },
         _stopMovingCords: {
            left: 0,
            right: 0
         },
         _currentScrollPosition: 0,                   //Текущее положение частичного скрола заголовков
         _scrollingNow: false,                        //Флаг обозначающий, происходит ли в данный момент скролирование элементов
         _partScrollRow: undefined,                   //Строка-контейнер, в которой лежит частичный скролл
         _isHeaderScrolling: false,                   //Флаг обозначающий, происходит ли скролл за заголовок
         _lastLeftPos: null,                          //Положение по горизонтали, нужно когда происходит скролл за заголовок
         _options: {
            _footTpl: footTpl,
            _colGroupTpl: colgroupTpl,
            _defaultCellTemplate: cellTemplate,
            _defaultItemTemplate: ItemTemplate,
            _defaultItemContentTemplate: ItemContentTemplate,
            _canServerRender: true,
            _buildTplArgs: buildTplArgsDG,
            _buildTplArgsDG: buildTplArgsDG,
            _groupTemplate: GroupTemplate,
            /**
             * @typedef {Object} Columns
             * @property {String} title Заголовок колонки. Отображение заголовков можно изменять с помощью опции {@link showHead}. Также с помощью опции {@link allowToggleHead} можно скрывать заголовки при отсутствии в списке данных.
             * Если данных в списке много и применяется скролл, то для "прилипания" заголовков применяется опция {@link stickyHeader}. Преобразование заголовков списка производится с помощью опции {@link transformHead}.
             * @property {String} field Название поля (из формата записи), значения которого будут отображены в данной колонке.
             * @property {String} width Ширина колонки. Значение необходимо устанавливать для колонок с фиксированной шириной.
             * Значение можно установить как в px (суффикс устанавливать не требуется), так и в %.
             * @property {Boolean} [highlight=true] Признак подсвечивания фразы при поиске. Если установить значение в false, то при поиске данных по таблице не будет производиться подсветка совпадений.
             * @property {String} [resultTemplate] Шаблон отображения колонки в строке итогов. Подробнее о создании такого шиблона читайте в разделе <a href="https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/components/list/list-settings/list-visual-display/results/">Строка итогов</a>.
             * @property {String} [className] Имя класса, который будет применён к каждой ячейке колонки.
             * Стилевые классы:
             * <ul>
             *    <li><b>controls-DataGridView-cell-overflow-ellipsis</b> - текст внутри ячейки будет обрезаться троеточием (актуально для однострочных ячеек);</li>
             *    <li><b>controls-DataGridView__td__textAlignRight</b> - текст внутри ячейки будет выровнен по правой стороне;</li>
             *    <li><b>controls-DataGridView-cell-verticalAlignTop</b> - содержимое ячейки будет выравниваться по верхнему краю;</li>
             *    <li><b>controls-DataGridView-cell-verticalAlignMiddle</b> - содержимое ячейки будет выравниваться по середине;</li>
             *    <li><b>controls-DataGridView-cell-verticalAlignBottom</b> - содержимое ячейки будет выравниваться по нижнему краю.</li>
             * </ul>
             * @property {String} [headTemplate] Шаблон отображения шапки колонки. Подробнее о создании такого шаблона читайте в разделе <a href="https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/components/list/list-settings/list-visual-display/columns/head-template/">Шаблон отображения заголовка</a>.
             * @property {String} [headTooltip] Всплывающая подсказка, отображаемая при наведении курсора на шапку колонки.
             * @property {String} [editor] Устанавливает редактор колонки для режима редактирования по месту.
             * Редактор отрисовывается поверх редактируемой строки с прозрачным фоном. Это поведение считается нормальным в целях решения прикладных задач.
             * Чтобы отображать только редактор строки без прозрачного фона, нужно установить для него свойство background-color.
             * Пример использования опции вы можете найти в разделе <a href="https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/components/list/list-settings/records-editing/edit-in-place/simple-edit-in-place/">Редактирование записи по клику</a>.
             * @property {Boolean} [allowChangeEnable] Доступность установки сотояния активности редактирования колонки в зависимости от состояния табличного представления
             * @property {String} [cellTemplate] Шаблон отображения ячейки. Подробнее о создании такого шаблона читайте в разделе <a href="https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/components/list/list-settings/list-visual-display/templates/cell-template/">Шаблон отображения ячейки</a>.
             * Данные, которые передаются в cellTemplate:
             * <ol>
             *    <li>item - отрисовываемая запись {@link WS.Data/Entity/Record}</li>
             *    <li>parentProperty - поле иерархии</li>
             *    <li>isNode - является ли узлом</li>
             *    <li>decorators - объект декораторов</li>
             *    <li>field - имя поля</li>
             *    <li>highlight - есть ли подсветка</li>
             * </ol>
             * Следует указать настройки декораторов разметки, если требуется. Используем декоратор подсветки текста:
             * <pre>
             *    {{=it.decorators.applyOnly(it.value, {
             *       highlight: it.highlight
             *    })}}
             * </pre>
             * Также можно использовать лесенку:
             * <pre>
             *    {{=it.ladder.get(it.item, it.field)}}
             * </pre>
             * @remark
             * Если в настройке колонки имя поля соответствует шаблону ['Name1.Name2'] то при подготовке полей для рендеринга
             * строки считаем, что в .get('Name1') находится рекорд и значение получаем уже у этого рекорда через .get('Name2')
             * @property {Object.<String,String>} [templateBinding] Соответствие опций шаблона полям в рекорде.
             * @property {Object.<String,String>} [includedTemplates] Подключаемые внешние шаблоны, ключу соответствует поле it.included.<...>, которое будет функцией в шаблоне ячейки.
             *
             * @editor headTemplate CloudFileChooser
             * @editor cellTemplate CloudFileChooser
             * @editor resultTemplate CloudFileChooser
             * @editorConfig headTemplate extFilter xhtml
             * @editorConfig resultTemplate extFilter xhtml
             * @editorConfig cellTemplate extFilter xhtml
             *
             * @translatable title
             */
            /**
             * @cfg {Columns[]} Устанавливает набор колонок списка.
             * @see showHead
             * @see allowToggleHead
             * @see stickyHeader
             * @see transformHead
             * @see setColumns
             * @see getColumns
             */
            columns: [],
            /**
             * @cfg {String} Устанавливает шаблон для шапки таблицы
             * @remark
             * Чтобы шаблон можно было передать в опцию компонента, его нужно предварительно подключить в массив зависимостей.
             * @example
             * 1. Подключаем шаблон в массив зависимостей:
             * <pre>
             *     define('js!SBIS3.Demo.nDataGridView',
             *        [
             *           ...,
             *           'html!SBIS3.Demo.nDataGridView/resources/headTpl'
             *        ],
             *        ...
             *     );
             * </pre>
             * 2. Передаем шаблон в опцию:
             * <pre class="brush: xml">
             *     <option name="headTpl" value="html!SBIS3.Demo.nDataGridView/resources/headTpl"></option>
             * </pre>
             * 3. Содержимое шаблона должно начинаться с тега thead, для которого установлен атрибут class со значением "controls-DataGridView__thead".
             * <pre>
             *    <tr class="controls-DataGridView__thead">
             *       ...
             *    </tr>
             * </pre>
             * @see showHead
             */
            headTpl: headTpl,
            /**
             * @cfg {Boolean} Устанавливает отображение заголовков колонок списка.
             * @example
             * <pre>
             *     <option name="showHead">false</option>
             * </pre>
             */
            showHead : true,
            /**
             * @cfg {Number} Устанавливает количество столбцов слева, которые будут не скроллируемы.
             * @remark
             * Для отображения частичного скролла, нужно установить такую ширину колонок, чтобы суммарная ширина всех столбцов была больше чем ширина контейнера таблицы.
             * Подробнее об использовании опции вы можете прочитать в разделе <a href="https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/components/list/list-settings/list-visual-display/columns/horizontal-scroll/">Горизонтальный скролл колонок</a>.
             * @example
             * <pre>
             *     <option name="startScrollColumn">3</option>
             * </pre>
             * @group Scroll
             */
            startScrollColumn: undefined,
            /**
             * @cfg {Array.<String>} Устанавливает набор столбцов для режима отображения "Лесенка".
             * @remark
             * Подробнее о данном режиме списка вы можете прочитать в разделе <a href="https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/components/list/list-settings/list-visual-display/ladder/">Отображение записей лесенкой</a>.
             * @example
             * <pre>
             *    <option name="ladder" type="array">
             *       <option>Документ.Дата</option>
             *    </option>
             * </pre>
             */
            ladder: undefined,
            /**
             * @cfg {String} Устанавливает шаблон отображения строки итогов.
             * @remark
             * Подробнее о правилах построения шаблона вы можете прочитать в статье {@link https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/components/list/list-settings/list-visual-display/results/ Строка итогов}.
             * <br/>
             * Чтобы шаблон можно было передать в опцию компонента, его нужно предварительно подключить в массив зависимостей.
             * @example
             * 1. Подключаем шаблон в массив зависимостей:
             * <pre>
             *     define('js!SBIS3.Demo.nDataGridView',
             *        [
             *           ...,
             *           'html!SBIS3.Demo.nDataGridView/resources/resultTemplate'
             *        ],
             *        ...
             *     );
             * </pre>
             * 2. Передаем шаблон в опцию:
             * <pre class="brush: xml">
             *     <option name="resultsTpl" value="html!SBIS3.Demo.nDataGridView/resources/resultTemplate"></option>
             * </pre>
             * 3. Содержимое шаблона должно начинаться с тега tr, для которого установлен атрибут class со значением "controls-DataGridView__results".
             * <pre>
             *    <tr class="controls-DataGridView__results">
             *       ...
             *    </tr>
             * </pre>
             * @editor CloudFileChooser
             * @editorConfig extFilter xhtml
             * @see resultsPosition
             * @see resultsText
             */
            resultsTpl: resultsTpl,
            /**
             * @cfg {Boolean} Устанавливает преобразование колонок в "шапке" списка.
             * @remark
             * Если опция включена, то колонки в "шапке" списка будут преобразованы следующим образом:
             *  <ul>
             *    <li>Колонки с одинаковым title будут объединены;</li>
             *    <li>Для колонок, title которых задан через разделитель "точка", т.е. вида выводимоеОбщееИмя.выводимоеИмяДаннойКолонки, будет отрисован двустрочный заголовок.</li>
             * </ul>
             * Пример использования опции вы можете найти в разделе <a href="https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/components/list/list-settings/list-visual-display/columns/head-merge/">Объединение заголовков</a>.
             * @example
             * <pre>
             *     <option name="transformHead">true</option>
             * </pre>
             */
            transformHead: false,
            /**
             * @cfg {Boolean} Устанавливает поведение, при котором "шапка" списка будет скрыта, если данные отсутствуют.
             * @example
             * <pre>
             *     <option name="allowToggleHead">false</option>
             * </pre>
             */
            allowToggleHead: true,
            /**
             * @cfg {Boolean} Устанавливает фиксацию/прилипание заголовков списка к "шапке" страницы/всплывающей панели.
             * @remark
             * Подробнее об этом механизме вы можете прочитать в разделе <a href="https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/fixed-header/">Фиксация шапки страниц и всплывающих панелей</a>.
             * @example
             * <pre>
             *     <option name="stickyHeader">true</option>
             * </pre>
             */
            stickyHeader: false
         }
      },

      _modifyOptions: function(cfg, parsedCfg) {
         if (parsedCfg._ladderInstance) {
            cfg._ladderInstance = parsedCfg._ladderInstance;
         } else if (!cfg._ladderInstance) {
            cfg._ladderInstance = parsedCfg._ladderInstance = new Ladder();
         }

         var newCfg = DataGridView.superclass._modifyOptions.apply(this, arguments);
         checkColumns(newCfg);
         newCfg._colgroupData = prepareColGroupData(newCfg);
         newCfg._headData = prepareHeadData(newCfg);
         newCfg._footData = newCfg._headData;

         if (!newCfg.ladder) {
            newCfg.ladder = [];
         }
         if (cfg._itemsProjection) {
            cfg._ladderInstance.setCollection(cfg._itemsProjection);
         }

         //TODO: выпилить вместе декоратором лесенки
         newCfg._decorators.ladder = new LadderDecorator({
            ladderInstance: cfg._ladderInstance
         });
         newCfg._decorators.add(newCfg._decorators.ladder);

         return newCfg;
      },

      $constructor: function() {
         // Событие onChangeHeadVisibility используется в стики хедере.
         // Внешнюю документацию не обновлял, т.к. без метода получения состояния видимости хедера это событие
         // практически не представляет ценности.
         this._publish('onDrawHead', 'onChangeHeadVisibility');
         this._tfoot = $('.controls-DataGridView__tfoot', this._container[0]);
         this._tbody = $('.controls-DataGridView__tbody', this._container[0]);
      },

      init: function() {
         DataGridView.superclass.init.call(this);
         this._updateHeadAfterInit();
         CommandDispatcher.declareCommand(this, 'ColumnSorting', this._setColumnSorting);
      },

      _prepareConfig: function() {
         DataGridView.superclass._prepareConfig.apply(this, arguments);
         if (this._options._ladderInstance) {
            var projection = this._getItemsProjection();
            if (projection) {
               this._options._ladderInstance.setCollection(projection);
            }
         }
      },

      _updateHeadAfterInit: function() {
         this._bindHead();
      },

      _mouseMoveHandler: function(e) {
         DataGridView.superclass._mouseMoveHandler.apply(this, arguments);

         var td = $(e.target).closest('.controls-DataGridView__td, .controls-DataGridView__th', this._container[0]),
             columns = this.getColumns(),
             trs = [],
             cells = [],
             index, hoveredColumn, cell, colIndex, colValue, colValueText;

         if(td.length) {
            index = td.index();
            hoveredColumn = this._hoveredColumn;
            colIndex = index + (this.getMultiselect() ? 1 : 0);

            if(columns[colIndex] && !columns[colIndex].cellTemplate && !td[0].getAttribute('title')) {
               colValue = td.find('.controls-DataGridView__columnValue')[0];

               if(colValue && !colValue.getAttribute('title')) {
                  colValueText = strHelpers.escapeHtml(colValue.innerText);

                  if (dcHelpers.getTextWidth(colValueText) > colValue.offsetWidth) {
                     colValue.setAttribute('title', colValueText);
                  }
               }
            }

            if (hoveredColumn.columnIndex !== index) {
               this._clearHoveredColumn();
               hoveredColumn.columnIndex = index;
               trs = $(this._tbody[0].children);

               if(this._options.showHead) {
                  trs.push(this.getTHead()[0].children[0]);
               }

               for(var i = 0, len = trs.length; i < len; i++) {
                  cell = trs[i].children[index];
                  if(cell) {
                     cells.push(cell);
                  }
               }

               hoveredColumn.cells = $(cells).addClass('controls-DataGridView__hoveredColumn__cell');
            }
         }
      },

      _mouseLeaveHandler: function() {
         DataGridView.superclass._mouseLeaveHandler.apply(this, arguments);
         this._clearHoveredColumn();
      },

      _clearHoveredColumn: function() {
         var hoveredColumn = this._hoveredColumn;

         if(hoveredColumn.columnIndex !== null) {
            hoveredColumn.cells.removeClass('controls-DataGridView__hoveredColumn__cell');
            hoveredColumn.cells = null;
            hoveredColumn.columnIndex = null;
         }
      },

      _getItemsContainer: function(){
         return $('.controls-DataGridView__tbody', this._container);
      },

      _buildTplArgs : function(cfg) {
         function getColumnVal(item, colName) {
            if (!colName || !(colName.indexOf("['") == 0 && colName.indexOf("']") == (colName.length - 2))){
               return item.get(colName);
            }
            var colNameParts = colName.slice(2, -2).split('.'),
               curItem = item,
               value;
            for (var i = 0; i < colNameParts.length; i++){
               if (i !== colNameParts.length - 1){
                  curItem = curItem.get(colNameParts[i]);
               }
               else{
                  value = curItem.get(colNameParts[i]);
               }
            }
            return value;
         }
         var args = DataGridView.superclass._buildTplArgs.apply(this, arguments);
         args.columns = _prepareColumns.call(this, cfg.columns, this._options);
         args.cellData = {
            /*TODO hierField вроде тут не должно быть*/
            hierField: cfg.hierField,
            parentProperty: cfg.parentProperty,
            nodeProperty: cfg.nodeProperty,
            getColumnVal: getColumnVal,
            decorators : args.decorators,
            displayField : args.displayProperty,
            displayProperty : args.displayProperty,
            isSearch : args.isSearch
         };
         args.startScrollColumn = cfg.startScrollColumn;
         args.currentScrollPosition = this._getColumnsScrollPosition();
         buildTplArgsLadder(args.cellData, cfg);

         return args;
      },

      _itemsReadyCallback: function() {
         var proj = this._getItemsProjection();
         if (proj) {
            this._options._ladderInstance.setCollection(proj);
         }

         return DataGridView.superclass._itemsReadyCallback.apply(this, arguments);
      },

      _redrawHead : function() {
         var
            headData,
            headMarkup;

         if (!this._thead) {
            this._bindHead();
         }
         headData = prepareHeadData(this._options);
         headData.columnsScrollPosition = this._getColumnsScrollPosition();
         headData.thumbPosition = this._currentScrollPosition;
         headMarkup = this._options.headTpl(headData);
         var body = $('.controls-DataGridView__tbody', this._container);

         var newTHead = $(headMarkup);

         /* Если шапка зафиксирована, то она находится вне контейнера компонента.
            По этой причине обработчики событий надо вешать для неё отдельно. */
         if(this._options.stickyHeader) {
            this._bindEventHandlers(newTHead);
         }

         if (this._thead && this._thead.length){
            this._destroyControls(this._thead);
            this._thead.replaceWith(newTHead);
            this._thead = newTHead;
         } else {
            this._thead = newTHead.insertBefore(body);
         }
         this.reviveComponents(this._thead);

         this._redrawColgroup();
         this._bindHead();
         this._notify('onDrawHead');
      },

      _redrawFoot: function(){
         var footData = prepareHeadData(this._options),
             newTFoot = $(this._options._footTpl(footData));

         if (this._tfoot && this._tfoot.length){
            this._destroyControls(this._tfoot);
            this._tfoot.replaceWith(newTFoot);
            this._tfoot = newTFoot;
         }
         this.reviveComponents(this._tfoot);
      },

      _redrawTheadAndTfoot: function(){
         this._redrawHead();
         this._redrawFoot();
      },

      _bindHead: function() {
         if (!this._thead) {
            // при фиксации заголовка таблицы в шапке реальный thead перемещён в шапку, а в контроле лежит заглушка
            this._thead = $('>.controls-DataGridView__table>.controls-DataGridView__thead', this._container.get(0));
         }
         this._colgroup = $('>.controls-DataGridView__table>.controls-DataGridView__colgroup', this._container.get(0));
         if(this._options.showHead) {
            this._isPartScrollVisible = false;
         }

         if(this.hasPartScroll()) {
            this._initPartScroll();
            this.updateDragAndDrop();

            /* Т.к. у таблицы стиль table-layout:fixed, то в случае,
             когда суммарная ширина фиксированных колонок шире родительского контейнера,
             колонка с резиновой шириной скукоживается до 0,
             потому что table-layout:fixed игнорирует минимальную ширину колонки.
             Поэтому мы вынуждены посчитать... и установить минимальную ширину на всю таблицу целиком.
             В этом случае плавающая ширина скукоживаться не будет.
             Пример можно посмотреть в реестре номенклатур. */
            this._setColumnWidthForPartScroll();
         }
      },

      /**
       * Метод возвращает текущий thead табличного представления (он может быть в таблице, или вынесен в фиксированную шапку)
       * @returns {jQuery} - текущий thead табличного представления
       * @noShow
       */
      getTHead: function(){
         return this._thead;
      },

      /**
       * Изменяет значение опции, фиксирующей заголовки табличного представления в шапке.
       * Возимеет эффект только если фиксация ещё не прошла (на этапе инициилизации).
       * @param isSticky
       * @noShow
       */
      setStickyHeader: function(isSticky){
         if (this._options.stickyHeader !== isSticky){
            this._options.stickyHeader = isSticky;
            // Если заголовок не отображается(он есть в верстке, но скрыт), то не фиксируем его.
            if (isSticky && !this._options.showHead) {
               return;
            }
            this.getContainer().find('.controls-DataGridView__table').toggleClass('ws-sticky-header__table', isSticky);
         }
      },

      _redrawColgroup : function() {
         var markup, data, body;
         data = prepareColGroupData(this._options);
         markup = colgroupTpl(data);
         body = $('.controls-DataGridView__tbody', this._container);
         var newColGroup = $(markup);
         if(this._colgroup && this._colgroup.length) {
            this._colgroup.replaceWith(newColGroup);
            this._colgroup = newColGroup;
         }
         else {
            this._colgroup = newColGroup.insertBefore(this._thead || body);
         }
      },

      _drawItemsCallback: function () {
         if (this.hasPartScroll()) {
            if (!this._thead) {
               this._bindHead();
            }
            var needShowScroll = this._isTableWide();

            this._isPartScrollVisible ?
               needShowScroll ?
                  this.updateScrollAndColumns() : this._hidePartScroll() :
               needShowScroll ?
                  this._showPartScroll() : this._hidePartScroll();

            this._findMovableCells();
         }
         DataGridView.superclass._drawItemsCallback.call(this);
      },

      _editFieldFocusHandler: function(focusedCtrl) {
         if(this._itemsToolbar) {
            this._hideItemsToolbar()
         }

         if(this._isPartScrollVisible) {
            this._scrollToEditControl(focusedCtrl)
         }
      },
      _onResizeHandler: function() {
         DataGridView.superclass._onResizeHandler.apply(this, arguments);
         this._containerOffsetWidth = this.getContainer().outerWidth();
         if(this._isPartScrollVisible) {
            this._updatePartScrollWidth();
         }
      },
      //********************************//
      //   БЛОК РЕДАКТИРОВАНИЯ ПО МЕСТУ //
      //*******************************//
      redrawItem: function() {
         DataGridView.superclass.redrawItem.apply(this, arguments);

         /* При перерисовке элемента, надо обновить стили для частичного скрола */
         if(this.hasPartScroll()) {
            this.updateScrollAndColumns();
         }
      },

      _redrawItems: function() {
         //FIXME в 3.7.4 поправить, не всегда надо перерисовывать, а только когда изменились колонки
         this._redrawTheadAndTfoot();
         DataGridView.superclass._redrawItems.apply(this, arguments);
      },
      _startEditOnItemClick: function(event, id, record, target, originalEvent) {
         var
            targetColumn,
            targetColumnIndex;
         if (this._canStartEditOnItemClick(target)) {
            if (!this._options.editingTemplate) {
               targetColumn = $(target).closest('.controls-DataGridView__td');
               if (targetColumn.length) {
                  targetColumnIndex = targetColumn.index();
               }
            }
            event.setResult(this.showEip(record, {isEdit: true}, false, targetColumnIndex)
               .addCallback(function (result) {
                  if (originalEvent.type === 'click') {
                     ImitateEvents.imitateFocus(originalEvent.clientX, originalEvent.clientY);
                  }
                  return !result;
               })
               .addErrback(function () {
                  return true;
               }));
         }
      },
      showEip: function(model, options, withoutActivateFirstControl, targetColumnIndex) {
         return this._canShowEip(targetColumnIndex) ? this._getEditInPlace().showEip(model, options, withoutActivateFirstControl) : Deferred.fail();
      },
      _canShowEip: function(targetColumnIndex) {
         var
            self = this,
            column = 0,
            canShow = this.isEnabled(),
            canShowEditInColumn = function(columnIndex) {
               return !!self._options.columns[columnIndex].editor && (canShow || self._options.columns[columnIndex].allowChangeEnable === false)
            };
         if (this._options.editingTemplate || targetColumnIndex === undefined) {
            // Отображаем редактирование по месту и для задизабленного DataGrid, но только если хоть у одиной колонки
            // доступен редактор при текущем состоянии задизабленности DataGrid.
            while (!canShow && column < this._options.columns.length) {
               if (this._options.columns[column].allowChangeEnable === false) {
                  canShow = true;
               } else {
                  column++;
               }
            }
         } else {
               canShow = this._options.multiselect ? targetColumnIndex > 0 && canShowEditInColumn(targetColumnIndex - 1): canShowEditInColumn(targetColumnIndex);
         }
         return canShow;
      },
      _getEditInPlaceConfig: function() {
         var
            self = this,
            columns = this._options.enabled ? this._options.columns : [];
         if (!this._options.enabled) {
            colHelpers.forEach(this._options.columns, function(item) {
               columns.push(item.allowChangeEnable === false ? item : {});
            });
         }

         return cMerge(DataGridView.superclass._getEditInPlaceConfig.apply(this, arguments), {
            columns: columns,
            getCellTemplate: function(item, column) {
               return this._getCellTemplate(item, column);
            }.bind(this),
            handlers: {
               onInitEditInPlace: function(e, eip) {
                  var tds;

                  if(!self._options.editingTemplate && self.hasPartScroll()) {
                     tds = eip.getContainer().find('td');

                     /* Развесим классы для частичного скрола при инициализации редактирования по месту */
                     for (var i = 0, len = tds.length; i < len; i++) {
                        tds.eq(i).addClass(self._options.startScrollColumn <= i ? 'controls-DataGridView__scrolledCell' : 'controls-DataGridView__notScrolledCell');
                     }
                     /* Подпишемся у рекдатирования по месту на смену фокуса дочерних элементов,
                        чтобы правильно позиционировать частичный скролл при изменении фокуса */
                     eip.subscribe('onChildControlFocusIn', function(e, control) {
                        self._scrollToEditControl(control);
                     });

                     /* При инициализации надо проскрлить редактируемые колонки */
                     self.updateScrollAndColumns();
                  }
               }
            }
         }, {preferSource: true});
      },
      //********************************//
      // <editor-fold desc="PartScrollBlock">

      //TODO Нужно вынести в отдельный класс(контроллер?), чтобы не смешивать все drag-and-drop'ы в кучу

      /************************/
      /*   Частичный скролл   */
      /***********************/
      hasPartScroll: function() {
         return this._options.startScrollColumn !== undefined;
      },

      _initPartScroll: function() {
         (this._arrowLeft = this._thead.find('.controls-DataGridView__PartScroll__arrowLeft')).click(this._arrowClickHandler.bind(this, true));
         (this._arrowRight = this._thead.find('.controls-DataGridView__PartScroll__arrowRight')).click(this._arrowClickHandler.bind(this, false));
         (this._thumb = this._thead.find('.controls-DataGridView__PartScroll__thumb')).mousedown(this._thumbClickHandler.bind(this));
         this._partScrollRow = this._thead.find('.controls-DataGridView__PartScroll__row');
         this.initializeDragAndDrop();
      },
      /**
       * Обрабатывает переход фокуса в редатировании по месту, проставляет позицию элементам в таблице
       */
      _scrollToEditControl: function(ctrl) {
         var ctrlOffset = ctrl.getContainer()[0].getBoundingClientRect(),
             tableOffset = this._container[0].getBoundingClientRect(),
             leftScrollPos = tableOffset.left + this._stopMovingCords.left,
             leftOffset;


         /* Если контрол находится за пределами таблицы(скрыт) справа или слева, то проскролим ячейки так, чтобы его было видно */
         if(ctrlOffset.right > tableOffset.right) {
            leftOffset = this._currentScrollPosition + (ctrlOffset.right - tableOffset.right)/this._partScrollRatio;
         } else if(ctrlOffset.left < leftScrollPos){
            leftOffset = this._currentScrollPosition - (leftScrollPos - ctrlOffset.left)/this._partScrollRatio;
         }

         if(leftOffset) {
            this._moveThumbAndColumns({left: leftOffset});
         }
      },

      _setColumnWidthForPartScroll: function() {
         var cols = this._colgroup.find('col'),
            columns = this.getColumns(),
            columnsWidth = 0,
            containerWidth,
            colIndex,
            minWidth;


         /* Если включена прокрутка заголовков и сумма ширин всех столбцов больше чем ширина контейнера таблицы,
            то свободные столцы (без жёстко заданной ширины), могут сильно ужиматься,
            для этого надо проставить этим столбцам ширину равную минимальной (если она передана) */

         /* Посчитаем ширину всех колонок */
         for (var i = 0; i < columns.length; i++) {
            columnsWidth += (columns[i].width && parseInt(columns[i].width)) || (columns[i].minWidth && parseInt(columns[i].minWidth)) || 0;
         }

         //TODO Баг. ie неправильно рендерит таблицу, если мы обращаемся к дом элементу в этом месте
         //В чем причина не разобрались, в 220 для ie вынес получение ширины контейнера в onResizeHandler
         if (constants.browser.isIE && this._containerOffsetWidth){
            containerWidth = this._containerOffsetWidth;
         }
         else{
            containerWidth = this._container[0].offsetWidth;
         }

         /* Проставим ширину колонкам, если нужно */
         if(columnsWidth > containerWidth) {
            for (var j = 0; j < columns.length; j++) {
               colIndex = this._options.multiselect ? j + 1 : j;
               minWidth = columns[j].minWidth && parseInt(columns[j].minWidth, 10);
               if (minWidth) {
                  cols[colIndex].width = minWidth + 'px';
               }
            }
         }
      },

      _dragStart: function(e) {
         constants.$body.addClass('ws-unSelectable');

         /* Если скролл происходит перетаскиванием заголовков
            то выставим соответствующие флаги */
         this._isHeaderScrolling = $(e.currentTarget).hasClass('controls-DataGridView__th');
         if(this._isHeaderScrolling) {
            this.getContainer().addClass('controls-DataGridView__scrollingNow');
         }
         /* На touch устройствах надо перевести фокус(нативный) на ползунок,
            т.к. сейчас взаимодействие происходит с ним. Иначе могут возникать проблемы,
            когда курсор остаётся в поле ввода, или ховер останется на иконке другой */
         if(this._touchSupport) {
            this._thumb.focus();
         }
         this._scrollingNow = true;
      },

      updateScrollAndColumns: function() {
         this._updatePartScrollWidth();
         this._findMovableCells();
         this._moveThumbAndColumns({left: this._currentScrollPosition});
      },

      _arrowClickHandler: function(isRightArrow) {
         var shift = (this._getPartScrollContainer()[0].offsetWidth/100)*5;
         this._moveThumbAndColumns({left: (parseInt(this._thumb[0].style.left) || 0) + (isRightArrow ?  -shift : shift)});
      },

      _thumbClickHandler: function() {
        this._thumb.addClass('controls-DataGridView__PartScroll__thumb-clicked');
      },

      _dragEnd: function() {
         /* Навешиваем класс на body,
            это самый оптимальный способ избавиться от выделения */
         constants.$body.removeClass('ws-unSelectable');
         if(this._isHeaderScrolling) {
            this.getContainer().removeClass('controls-DataGridView__scrollingNow');
         }
         this._thumb.removeClass('controls-DataGridView__PartScroll__thumb-clicked');
         this._scrollingNow = false;
         this._lastLeftPos = null;
      },

      _getDragContainer: function() {
         return this._thead.find('.controls-DataGridView__PartScroll__thumb, .controls-DataGridView__scrolledCell');
      },

      _getPartScrollContainer: function() {
         return this._thead.find('.controls-DataGridView__PartScroll__container');
      },

      _dragMove: function(event, cords) {
         if(this._isHeaderScrolling) {
            var pos;

            /* Выставим начальную координату, чтобы потом правильно передвигать колонки */
            if(this._lastLeftPos === null) {
               this._lastLeftPos = cords.left;
            }

            /* Посчитаем сначала разницу со старым значением */
            pos = this._currentScrollPosition - (cords.left - this._lastLeftPos);

            /* После расчётов, можно выставлять координату */
            this._lastLeftPos = cords.left;
            cords.left = pos;
         }
         this._moveThumbAndColumns(cords);
      },

      _moveThumbAndColumns: function(cords) {
         this._currentScrollPosition = this._checkThumbPosition(cords);
         var movePosition = this._getColumnsScrollPosition();

         this._setThumbPosition(this._currentScrollPosition);
         for(var i= 0, len = this._movableElems.length; i < len; i++) {
            this._movableElems[i].style.left = movePosition + 'px';
         }
      },

      _getColumnsScrollPosition: function() {
         return -this._currentScrollPosition*this._partScrollRatio;
      },

      _setThumbPosition: function(cords) {
         this._thumb[0].style.left = cords + 'px';
      },

      _updatePartScrollWidth: function() {
         var containerWidth = this._container[0].offsetWidth,
             scrollContainer = this._getPartScrollContainer(),
             thumbWidth = this._thumb[0].offsetWidth,
             correctMargin = 0,
             lastRightStop = this._stopMovingCords.right,
             notScrolledCells, thumbPos;

         /* Найдём ширину нескроллируемых колонок */
         if(this._options.startScrollColumn > 0) {
            notScrolledCells = this._thead.find('tr').eq(0).find('.controls-DataGridView__notScrolledCell');
            for(var i = 0, len = notScrolledCells.length; i < len; i++) {
               correctMargin += notScrolledCells[i].offsetWidth
            }
            /* Сдвинем контейнер скролла на ширину нескроллируемых колонок */
            scrollContainer[0].style.marginLeft = correctMargin + 'px';
         }
         /* Проставим ширину контейнеру скролла */
         scrollContainer[0].style.width = containerWidth - correctMargin + 'px';

         /* Найдём соотношение, для того чтобы правильно двигать скроллируемый контент относительно ползунка */
         this._partScrollRatio = (this._getItemsContainer()[0].offsetWidth - containerWidth) / (containerWidth - correctMargin - thumbWidth - 40);
         this._stopMovingCords = {
            right: scrollContainer[0].offsetWidth - thumbWidth - 40,
            left: correctMargin
         };

         /* Скролл мог выехать за правую/левую границу,
            если например меняли размеры окна, надо это проверить */
         thumbPos = this._checkThumbPosition({left: this._currentScrollPosition});

         if(this._currentScrollPosition !== thumbPos || lastRightStop < this._stopMovingCords.right) {
            this._currentScrollPosition = thumbPos;
            this.updateScrollAndColumns();
         }
      },

      _findMovableCells: function() {
         this._movableElems = this._container.find('tbody .controls-DataGridView__scrolledCell').add(
            this._thead.find('.controls-DataGridView__scrolledCell')
         );
      },

      _checkThumbPosition: function(cords) {
         if (cords.left <= 0){
            this._toggleActiveArrow(this._arrowLeft, false);
            return 0;
         } else if (!this._arrowLeft.hasClass('icon-primary')) {
            this._toggleActiveArrow(this._arrowLeft, true);
         }

         if (cords.left >= this._stopMovingCords.right) {
            this._toggleActiveArrow(this._arrowRight, false);
            return this._stopMovingCords.right;
         } else if (!this._arrowRight.hasClass('icon-primary')) {
            this._toggleActiveArrow(this._arrowRight, true);
         }
         return cords.left;
      },

      _toggleActiveArrow: function(arrow, enable) {
         arrow.toggleClass('icon-disabled', !enable)
              .toggleClass('icon-primary action-hover', enable);
      },

      _isTableWide: function() {
         return this._container[0].offsetWidth < this._getItemsContainer()[0].offsetWidth;
      },

      _hidePartScroll: function() {
         if(this._isPartScrollVisible) {
            this._partScrollRow.addClass('ws-hidden');
            this._isPartScrollVisible = false;
         }
      },

      _showPartScroll: function() {
         if(!this._isPartScrollVisible) {
            this._partScrollRow.removeClass('ws-hidden');
            this._updatePartScrollWidth();
            this._isPartScrollVisible = true;
         }
      },

      isNowScrollingPartScroll: function() {
         return this._scrollingNow;
      },

      /*******************************/
      /*  Конец частичного скролла   */
      /*******************************/
      // </editor-fold>
       /**
        * Метод получения текущего описания колонок представления данных.
        * @returns {*|columns} Описание набора колонок.
        * @example
        * <pre>
        *    var columns = DataGridView.getColumns(),
        *        newColumns = [];
        *    for(var i = 0, l = columns.length; i < l; i++){
        *       if(columns[i].title !== "Примечание")
        *          newColumns.push(columns[i]);
        *    }
        *    newColumns.push({
        *       title: 'ФИО',
        *       field: 'РП.ФИО'
        *    });
        *    DataGridView.setColumns(newColumns);
        * </pre>
        */
      getColumns : function() {
         return this._options.columns;
      },
       /**
        * Метод установки либо замены колонок, заданных опцией {@link columns}.
        * @param columns Новый набор колонок.
        * @example
        * <pre>
        *    var columns = DataGridView.getColumns(),
        *        newColumns = [];
        *    for(var i = 0, l = columns.length; i < l; i++){
        *       if(columns[i].title !== "Примечание")
        *          newColumns.push(columns[i]);
        *    }
        *    newColumns.push({
        *       title: 'ФИО',
        *       field: 'РП.ФИО'
        *    });
        *    DataGridView.setColumns(newColumns);
        * </pre>
        */
       setColumns : function(columns) {
          this._options.columns = columns;
          /* При установке колонок, надо сбросить частичный скролл */
          this._currentScrollPosition = 0;
          checkColumns(this._options);
          this._destroyEditInPlaceController();
       },

      _oldRedraw: function() {
         DataGridView.superclass._oldRedraw.apply(this, arguments);
         this._redrawTheadAndTfoot();
      },

      setMultiselect: function() {
         DataGridView.superclass.setMultiselect.apply(this, arguments);

         if(this.getItems()) {
            this.redraw();
         } else if(this._options.showHead) {
            this._redrawTheadAndTfoot();
         }
      },

      _toggleEmptyData: function(show) {
         DataGridView.superclass._toggleEmptyData.apply(this, arguments);
         this.getContainer().toggleClass('controls-DataGridView__emptyTable', !!show);
         if (this._options.emptyHTML && this._options.allowToggleHead) {
            if (this._thead) {
               this._thead.toggleClass('ws-hidden', !!show);
            }
            this._notify('onChangeHeadVisibility');
         }
      },
      _showItemsToolbar: function(item) {
         if(!this.isNowScrollingPartScroll()) {
            DataGridView.superclass._showItemsToolbar.call(this, item);
         }
      },

      _getLeftOfItemContainer : function(container) {
         return $(".controls-DataGridView__td", container.get(0)).first();
      },
      //------------------------GroupBy---------------------
      _getGroupTpl : function(){
         return this._options.groupBy.template || groupByTpl;
      },
      _redrawResults: function() {
        if (this._options.resultsPosition !== 'none'){
           this._redrawTheadAndTfoot();
        }
      },
      destroy: function() {
         if (this.hasPartScroll()) {
            this._thumb.unbind('click');
            this._thumb = undefined;
            this._arrowLeft.unbind('click');
            this._arrowLeft = undefined;
            this._arrowRight.unbind('click');
            this._arrowRight = undefined;
            this._movableElems = [];
         }
         DataGridView.superclass.destroy.call(this);
      },
      _setColumnSorting: function(colName) {
         var sorting, newSorting, wasNoneSorting = true;
         sorting = this.getSorting();

         newSorting = sorting.filter(function(sortElem){
            if (sortElem[colName] == 'ASC') {
               wasNoneSorting = false;
               return false;
            }
            else if (sortElem[colName] == 'DESC') {
               sortElem[colName] = 'ASC';
               wasNoneSorting = false;
               return true;
            }
            else {
               return true;
            }

         });

         if (wasNoneSorting) {
            var addSortObj = {};
            addSortObj[colName] = 'DESC';
            newSorting.push(addSortObj);
         }
         this.setSorting(newSorting);
      },
      /* ----------------------------------------------------------------------------
       ------------------- НИЖЕ ПЕРЕХОД НА ItemsControlMixin ----------------------
       ---------------------------------------------------------------------------- */

      _getCellTemplate: function(item, column) {
         /*TODO не выпиливать. Тут хранится список параметров которые отдаются в шаблон ячейки. Важно не потерять*/
         var value = this._getColumnValue(item, column.field);
         if (column.cellTemplate) {
            var cellTpl = TemplateUtil.prepareTemplate(column.cellTemplate);
            var tplOptions = {
               item: item,
               hierField: this._options.hierField,
               parentProperty: this._options.parentProperty,
               nodeProperty: this._options.nodeProperty,
               isNode: item.get(this._options.nodeProperty),
               decorators: this._options._decorators,
               field: column.field,
               value: value,
               highlight: column.highlight,
               ladderColumns: this._options.ladder
            };
            if (column.templateBinding) {
               tplOptions.templateBinding = column.templateBinding;
            }
            if (column.includedTemplates) {
               var tpls = column.includedTemplates;
               tplOptions.included = {};
               for (var j in tpls) {
                  if (tpls.hasOwnProperty(j)) {
                     tplOptions.included[j] = TemplateUtil.prepareTemplate(tpls[j]);
                  }
               }
            }
            value = (cellTpl)(tplOptions);
         } else {
            if (
               Array.indexOf(this._options.ladder, column.field) > -1 &&
               !this._options._ladderInstance.isPrimary(item, column.field)
            ) {
               value = null;
            }
            value = this._options._decorators.applyOnly(
                  value === undefined || value === null ? '' : strHelpers.escapeHtml(value), {
                  highlight: column.highlight
               }
            );
         }
         return value;
      },

      _getColumnValue: function(item, colName){
         if (!colName || !this._isCompositeRecordValue(colName)){
            return item.get(colName);
         }
         var colNameParts = colName.slice(2, -2).split('.'),
            curItem = cFunctions.clone(item),
            value;
         for (var i = 0; i < colNameParts.length; i++){
            if (i !== colNameParts.length - 1){
               curItem = curItem.get(colNameParts[i]);
            }
            else{
               value = curItem.get(colNameParts[i]);
            }
         }
         return value;
      },

      _isCompositeRecordValue: function(colName){
         return colName.indexOf("['") == 0 && colName.indexOf("']") == (colName.length - 2);
      }
   });

   return DataGridView;

});
