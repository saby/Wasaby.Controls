define('SBIS3.CONTROLS/DataGridView',
   [
   "Core/CommandDispatcher",
   "Core/core-clone",
   "Core/core-merge",
   "Core/constants",
   "Core/Deferred",
   'Core/detection',
   "Core/EventBus",
   'Core/helpers/Function/memoize',
   "SBIS3.CONTROLS/ListView",
   "tmpl!SBIS3.CONTROLS/DataGridView/DataGridView",
   "tmpl!SBIS3.CONTROLS/DataGridView/resources/rowTpl",
   "tmpl!SBIS3.CONTROLS/DataGridView/resources/colgroupTpl",
   "tmpl!SBIS3.CONTROLS/DataGridView/resources/headTpl",
   "tmpl!SBIS3.CONTROLS/DataGridView/resources/footTpl",
   "tmpl!SBIS3.CONTROLS/DataGridView/resources/ResultsTpl",
   "SBIS3.CONTROLS/Mixins/DragAndDropMixin",
   "SBIS3.CONTROLS/Utils/ImitateEvents",
   "tmpl!SBIS3.CONTROLS/DataGridView/resources/DataGridViewGroupBy",
   'WS.Data/Display/Ladder',
   'SBIS3.CONTROLS/Utils/HtmlDecorators/LadderDecorator',
   "SBIS3.CONTROLS/Utils/TemplateUtil",
   "tmpl!SBIS3.CONTROLS/DataGridView/resources/ItemTemplate",
   "tmpl!SBIS3.CONTROLS/DataGridView/resources/ItemResultTemplate",
   "tmpl!SBIS3.CONTROLS/DataGridView/resources/ItemContentTemplate",
   "tmpl!SBIS3.CONTROLS/DataGridView/resources/cellTemplate",
   "tmpl!SBIS3.CONTROLS/DataGridView/resources/headColumnTpl",
   "tmpl!SBIS3.CONTROLS/DataGridView/resources/GroupTemplate",
   "tmpl!SBIS3.CONTROLS/DataGridView/resources/SortingTemplate",
   "Core/helpers/Object/isEmpty",
   'Core/helpers/String/escapeHtml',
   'SBIS3.CONTROLS/Utils/TitleUtil',
   'Core/Sanitize',
   'Lib/StickyHeader/StickyHeaderManager/StickyHeaderManager',
   'Core/helpers/Hcontrol/configStorage',
   'css!SBIS3.CONTROLS/DataGridView/DataGridView'
],
   function(
      CommandDispatcher,
      coreClone,
      cMerge,
      constants,
      Deferred,
      cDetection,
      EventBus,
      memoize,
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
      isEmpty,
      escapeHtml,
      TitleUtil,
      Sanitize,
      StickyHeaderManager,
      configStorage) {

   'use strict';

      var _prepareColumns = function(columns, cfg) {
            var columnsNew = coreClone(columns);
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
               return escapeHtml(item.get(colName));
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
         getCellValue = function(currentValue, field, item, ladder, ladderColumns){
            return ladderColumns.indexOf(field) > -1 && !ladder.isPrimary(item, field) ? '' : currentValue;
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
               getCellValue: getCellValue,
               decorators : tplOptions.decorators,
               highlightText: cfg.highlightText, // пробрасываем текст для highlightDecorator в tmpl
               displayField : tplOptions.displayProperty,
               displayProperty: tplOptions.displayProperty,
               escapeHtml: tplOptions.escapeHtml
            };
            tplOptions.startScrollColumn = cfg.startScrollColumn;
            tplOptions.columnsShift = cfg._columnsShift;
            tplOptions.hoveredColumn = cfg._hoveredColumn;
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
               columns = coreClone(cfg.columns),
               supportUnion,
               supportDouble,
               curCol,
               nextCol,
               curColSplitTitle,
               nextColSplitTitle;

            rowData.countRows = 1;
            rowData.content = [[], []];

            if (!cfg.transformHead){
               rowData.content[1] = columns;
               return rowData;
            }

            for (var i = 0, l = columns.length; i < l; i++){
               curCol = columns[i];
               nextCol = columns[i + 1];

               /**
                * Сюда может прилететь rkString
                * пока что это единственный способ ее идентифицировать
                */
               curColSplitTitle = (curCol.title || '');
               if (curColSplitTitle instanceof String) {
                  curColSplitTitle = '' + curColSplitTitle;
               }
               curColSplitTitle = curColSplitTitle.split('.');

               nextColSplitTitle = ((nextCol && nextCol.title) || '');
               if (nextColSplitTitle instanceof String) {
                  nextColSplitTitle = '' + nextColSplitTitle;
               }
               nextColSplitTitle = nextColSplitTitle.split('.');
               /**
                * end check rkString
                */

               if (!supportDouble){
                  supportDouble = coreClone(curCol);
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
                     rowData.content[0].push(supportDouble);
                     supportDouble = null;
                  }
                  rowData.countRows = 2;
               }
               else {
                  supportDouble.rowspan = curCol.rowspan = 2;
                  rowData.content[0].push(supportDouble);
                  supportDouble = null;
               }

               if (!supportUnion){
                  supportUnion = coreClone(curCol);
               }
               if (nextCol && (supportUnion.title == nextCol.title)) {
                  if (curCol.rowspan) {
                     rowData.content[0].pop(); //Убираем колонку из верхней строки, т.к. в этом месте рассчитывается colspan. Добавим ее обратно, когда рассчитаем все colspan'ы
                  }
                  supportUnion.colspan = ++supportUnion.colspan || 2;
               }
               else {
                  if (curCol.rowspan) {
                     var topRow = rowData.content[0].pop();
                     topRow.colspan = supportUnion.colspan;
                     topRow.value = topRow.title = supportUnion.title;
                     rowData.content[0].push(topRow);
                     supportUnion.ignore = true; //Игнорируем колонку в случае, если в шапке 2 строки (от верхней строки установится rowspan).
                  }
                  rowData.content[1].push(supportUnion);
                  supportUnion = null;
               }
            }
            return rowData;
         },
         // isFoot - решение не хорошее, но чтобы разделить сбор конфига для шапки и футера,
         // возможно надо будет править прикладной код, в котором могли заложиться на некоторые опции.
         // Оставляем до VDOM.
         prepareHeadData = function(cfg, isFoot) {
            var
               headData = {
                  columns: coreClone(cfg.columns),
                  multiselect : cfg.multiselect,
                  startScrollColumn: cfg.startScrollColumn,
                  resultsPosition: cfg.resultsPosition,
                  resultsTpl: TemplateUtil.prepareTemplate(cfg.resultsTpl),
                  showHead: cfg.showHead
               },
               column,
               columnTop,
               headColumns = prepareHeadColumns(cfg);

            cfg.headTpl = TemplateUtil.prepareTemplate(cfg.headTpl);
            /* Чтобы не было дёрганий интерфейса сразу создаём шапку с актуальным состоянием видимости */
            if (cfg.allowToggleHead && cfg.emptyHTML) {
               headData.isVisible =  cfg._itemsProjection && cfg._itemsProjection.getCount();
            } else {
               headData.isVisible = true;
            }
            cMerge(headData, headColumns);
            
            if (!isFoot) {
               for (var i = 0; i < headData.content[1].length; i++) {
                  columnTop = headData.content[0][i];
                  column = headData.content[1][i];
      
                  if (columnTop && headData.countRows > 1) {
                     if (columnTop.rowspan > 1) {
                        if (columnTop.sorting) {  //Если колонка на 2 строки, то отрисуем шаблон в ней
                           columnTop.value = getSortingColumnTpl.call(this, columnTop, cfg);
                        } else if (columnTop.headTemplate) {
                           columnTop.value = getHeadColumnTpl.call(this, columnTop);
                        } else {
                           columnTop.value = getDefaultHeadColumnTpl.call(this, columnTop.title);
                        }
                     } else {
                        columnTop.value = getDefaultHeadColumnTpl.call(this, columnTop.title);
                     }
                  }
      
                  //TODO здесь получается верстка, которая отдается в шаблонизатор.
                  //лучше прокинуть сам шаблон, чтобы он потом там позвался
                  //В футере никогда нет сортировки
                  if (column.sorting && !isFoot) {
                     column.value = getSortingColumnTpl.call(this, column, cfg);
                  } else if (column.headTemplate) {
                     column.value = getHeadColumnTpl.call(this, column);
                  } else {
                     column.value = getDefaultHeadColumnTpl.call(this, column.title);
                  }
               }
            }

            if (cfg._items && cfg._items.getMetaData().results){
               prepareResultsData.call(this, cfg, headData, cfg._items.getMetaData().results);
               headData.hasResults = true;
            }

            headData.sanitize = cfg.sanitize;

            return headData;
         },
         getSortingColumnTpl = function(column, cfg) {
            var
               sorting = cfg.sorting,
               sortingValue;

            if (sorting instanceof Array) {
               sorting.forEach(function (sortingElem) {
                  if (sortingElem[column.field]) {
                     sortingValue = sortingElem[column.field];
                  }
               });
            }

            return TemplateUtil.prepareTemplate(SortingTemplate)({
               column: column,
               sortingValue: sortingValue
            });
         },
         getHeadColumnTpl = function (column){
            return TemplateUtil.prepareTemplate(column.headTemplate).call(this, {
               column: column
            });
         },
         getDefaultHeadColumnTpl = function(title){
            return headColumnTpl.call(this, {title: title});
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
                  column: coreClone(column),
                  index: i,
                  resultsText: cfg.resultsText
               };
               //TODO в рамках совместимости, выпилить как все перейдут на отрисовку колонки через функцию в resultsTpl
               //{{=column.resultTemplate(column.resultTemplateData)}}
               //data.push(TemplateUtil.prepareTemplate(column.resultTemplate).call(this, column.resultTemplateData));
            }
            //headData.results = data;
            headData.item = resultsRecord;//тоже в рамках совместимости для 230 версии, что с этим делать написано чуть выше
         },
         prepareColGroupData = function (cfg) {
            return {
               columns: cfg.columns,
               multiselect: cfg.multiselect
            }
         };
   /**
    * Класс контрола "Список с колонками".
    * <a href="http://axure.tensor.ru/standarts/v7/%D1%82%D0%B0%D0%B1%D0%BB%D0%B8%D1%87%D0%BD%D0%BE%D0%B5_%D0%BF%D1%80%D0%B5%D0%B4%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5__%D0%B2%D0%B5%D1%80%D1%81%D0%B8%D1%8F_04_.html">Спецификация</a>.
    * <a href="/doc/platform/developmentapl/interface-development/components/list/list-settings/">Документация</a>.
    *
    * <b>Примечание</b>. Чтобы у SBIS3.CONTROLS/DataGridView запретить первый запрос данных к БЛ, нужно использовать предзапрос данных перед открытием словаря из selectorButton.
    *
    * @class SBIS3.CONTROLS/DataGridView
    * @extends SBIS3.CONTROLS/ListView
    * @author Герасимов А.М.
    * @mixes SBIS3.CONTROLS/Mixins/DragAndDropMixin
    *
    *
    * @cssModifier controls-ListView__withoutMarker Скрывает отображение маркера активной строки. Подробнее о маркере вы можете прочитать в <a href="/doc/platform/developmentapl/interface-development/components/list/list-settings/list-visual-display/marker/">этом разделе</a>.
    * @cssModifier controls-DataGridView__markerRight Устанавливает отображение маркера активной строки справа от записи. Подробнее о маркере вы можете прочитать в <a href="/doc/platform/developmentapl/interface-development/components/list/list-settings/list-visual-display/marker/">этом разделе</a>.
    * @cssModifier controls-DataGridView__hasSeparator Устанавливает отображение линий-разделителей между строками.
    * При использовании контролов {@link SBIS3.CONTROLS/CompositeView} или {@link SBIS3.CONTROLS/Tree/CompositeView} модификатор применяется только для режима отображения "Таблица".
    * @cssModifier controls-DataGridView__overflow-ellipsis Устанавливает обрезание троеточием текста во всех колонках таблицы.
    * @cssModifier controls-DataGridView__tableLayout-auto Расширение колонок по содержимому.
    * Когда установлен модификатор, списочный компонент работает по <a href="https://www.w3schools.com/cssref/pr_tab_table-layout.asp">спецификации</a>.
    * @cssModifier controls-ListView__padding-XS Устанавливает левый отступ первой колонки и правый отступ последней колонки, равный величине 0px. Значение отступа определено в <a href="http://axure.tensor.ru/standarts/v7/%D1%82%D0%B0%D0%B1%D0%BB%D0%B8%D1%87%D0%BD%D0%BE%D0%B5_%D0%BF%D1%80%D0%B5%D0%B4%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5__%D0%B2%D0%B5%D1%80%D1%81%D0%B8%D1%8F_04_.html">стандарте</a>.
    * @cssModifier controls-ListView__padding-S Устанавливает левый отступ первой колонки и правый отступ последней колонки, равный величине 12px. Значение отступа определено в <a href="http://axure.tensor.ru/standarts/v7/%D1%82%D0%B0%D0%B1%D0%BB%D0%B8%D1%87%D0%BD%D0%BE%D0%B5_%D0%BF%D1%80%D0%B5%D0%B4%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5__%D0%B2%D0%B5%D1%80%D1%81%D0%B8%D1%8F_04_.html">стандарте</a>.
    * @cssModifier controls-ListView__padding-M Устанавливает левый отступ первой колонки и правый отступ последней колонки, равный величине 16px. Значение отступа определено в <a href="http://axure.tensor.ru/standarts/v7/%D1%82%D0%B0%D0%B1%D0%BB%D0%B8%D1%87%D0%BD%D0%BE%D0%B5_%D0%BF%D1%80%D0%B5%D0%B4%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5__%D0%B2%D0%B5%D1%80%D1%81%D0%B8%D1%8F_04_.html">стандарте</a>.
    * @cssModifier controls-ListView__padding-L Устанавливает левый отступ первой колонки и правый отступ последней колонки, равный величине 20px. Значение отступа определено в <a href="http://axure.tensor.ru/standarts/v7/%D1%82%D0%B0%D0%B1%D0%BB%D0%B8%D1%87%D0%BD%D0%BE%D0%B5_%D0%BF%D1%80%D0%B5%D0%B4%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5__%D0%B2%D0%B5%D1%80%D1%81%D0%B8%D1%8F_04_.html">стандарте</a>.
    * @cssModifier controls-ListView__padding-XL Устанавливает левый отступ первой колонки и правый отступ последней колонки, равный величине 24px. Значение отступа определено в <a href="http://axure.tensor.ru/standarts/v7/%D1%82%D0%B0%D0%B1%D0%BB%D0%B8%D1%87%D0%BD%D0%BE%D0%B5_%D0%BF%D1%80%D0%B5%D0%B4%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5__%D0%B2%D0%B5%D1%80%D1%81%D0%B8%D1%8F_04_.html">стандарте</a>.
    * @cssModifier controls-DataGridView__withPhoto-S Устанавливает левый отступ первой колонки с учетом расположения в верстке изображения, размера S, равный величине 12px.
    * @cssModifier controls-DataGridView__withPhoto-M Устанавливает левый отступ первой колонки с учетом расположения в верстке изображения, размера M, равный величине 16px.
    * @cssModifier controls-DataGridView__withPhoto-L Устанавливает левый отступ первой колонки с учетом расположения в верстке изображения, размера L, равный величине 20px.
    * @control
    * @public
    * @category Lists
    * @designTime plugin /design/DesignPlugin
    * @initial
    * <component data-component='SBIS3.CONTROLS/DataGridView'>
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
   var DataGridView = ListView.extend([DragAndDropMixin],/** @lends SBIS3.CONTROLS/DataGridView.prototype*/ {
       /**
        * @event onDrawHead Возникает после отрисовки шапки
        * @param {Core/EventObject} eventObject Дескриптор события.
        */
      _dotTplFn : dotTplFn,
      $protected: {
         _headIsChanged: false,
         _rowTpl : rowTpl,
         _rowData : [],
         _isPartScrollVisible: false,                 //Видимость скроллбара
         _movableElements: undefined,                 //Скролируемые элементы
         _arrowLeft: undefined,                       //Контейнер для левой стрелки
         _arrowRight: undefined,                      //Контейнер для правой стрелки
         _thumb: undefined,                           //Контейнер для ползунка
         _stopMovingCords: {
            left: 0,
            right: 0
         },
         _partScrollRequestAnimationId: null,
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
            _columnsShift: 0,
            _hoveredColumn: {
               cells: null,
               columnIndex: null
            },
            /**
             * @typedef {Object} columnSorting
             * @variant single при сортировке по этой колонке, сортировка по остальным колонкам будет сброшена
             * @variant multi сортировка по этой колонке не вызывает сброс сортировки по другим колонкам
             */
            /**
             * @typedef {Object} Columns
             * @property {String} title Заголовок колонки.
             * @property {String} field Название поля (из формата записи), значения которого будут отображены в данной колонке.
             * @property {String} width Ширина колонки. Значение необходимо устанавливать для колонок с фиксированной шириной.
             * Значение можно установить как в px (суффикс устанавливать не требуется), так и в %.
             * @property {Boolean} [highlight=true] Признак подсвечивания фразы при поиске. Если установить значение в false, то при поиске данных по таблице не будет производиться подсветка совпадений.
             * @property {String} [resultTemplate] Шаблон отображения колонки в строке итогов. Подробнее о создании такого шаблона читайте в разделе <a href="/doc/platform/developmentapl/interface-development/components/list/list-settings/list-visual-display/results/">Строка итогов</a>.
             * @property {String} [className] Имя CSS-класса, который будет применён к заголовку и всем ячейкам колонки.
             * Список классов:
             * <ul>
             *    <li><b>controls-DataGridView-cell-overflow-ellipsis</b>. Класс устанавливает обрезание текста троеточием, когда он не помещается в ячейке. Актуально для однострочных ячеек.</li>
             *    <li><b>controls-DataGrid__column__type-money</b>. Класс применяют для колонок, предназначенных для денежных полей с дробной частью (копейками). Заголовок колонки, для которой применён такой класс, будет выровнен по правому краю по целой части значения (см. <a href="http://axure.tensor.ru/standarts/v7/%D1%82%D0%B0%D0%B1%D0%BB%D0%B8%D1%87%D0%BD%D0%BE%D0%B5_%D0%BF%D1%80%D0%B5%D0%B4%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5__%D0%B2%D0%B5%D1%80%D1%81%D0%B8%D1%8F_04_.html">Правила выравнивания</a>).
             *    <li><b>controls-DataGridView__td__textAlignRight</b>. Класс устанавливает выравнивание текста по правому краю.</li>
             *    <li><b>controls-DataGridView-cell-verticalAlignTop</b>. Класс устанавливает выравнивание текста по верхнему краю.</li>
             *    <li><b>controls-DataGridView-cell-verticalAlignMiddle</b>. Класс устанавливает выравнивание текста по центру.</li>
             *    <li><b>controls-DataGridView-cell-verticalAlignBottom</b>. Класс устанавливает выравнивание текста по нижнему краю.</li>
             * </ul>
             * Текст в заголовке и ячейках колонки по умолчанию выравнивается по левому краю.
             * @property {String} [headTemplate] Шаблон отображения шапки колонки. Подробнее о создании такого шаблона читайте в разделе <a href="/doc/platform/developmentapl/interface-development/components/list/list-settings/list-visual-display/columns/head-template/">Шаблон отображения заголовка</a>.
             * @property {String} [headTooltip] Всплывающая подсказка, отображаемая при наведении курсора на шапку колонки.
             * @property {String} [editor] Устанавливает редактор колонки для режима редактирования по месту.
             * Редактор отрисовывается поверх редактируемой строки с прозрачным фоном. Это поведение считается нормальным в целях решения прикладных задач.
             * Чтобы отображать только редактор строки без прозрачного фона, нужно установить для него свойство background-color.
             * Пример использования опции вы можете найти в разделе <a href="/doc/platform/developmentapl/interface-development/components/list/list-settings/records-editing/edit-in-place/simple-edit-in-place/">Редактирование записи по клику</a>.
             * @property {Boolean} [sorting] Активирует режим сортировки по полю. Подробное описание можно найти в разделе <a href="/doc/platform/developmentapl/interface-development/components/list/list-settings/records-editing/list-sorting/">Сортировка записей в списках</a>.
             * @property {Boolean} [allowChangeEnable] Доступность установки сотояния активности редактирования колонки в зависимости от состояния табличного представления
             * @property {String} [cellTemplate] Шаблон отображения ячейки. Подробнее о создании такого шаблона читайте в разделе <a href="/doc/platform/developmentapl/interface-development/components/list/list-settings/list-visual-display/templates/cell-template/">Шаблон отображения ячейки</a>.
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
             *    {{ someText|highlight: someString, cssClass }}
             * </pre>
             * Также можно использовать лесенку:
             * <pre>
             *    <ws:if data="{{ ladder.isPrimary(item, 'responsibleId') }}">
             *     <div class='edo-Browser-Responsible__photo'>
             *      <ws:partial template="tmpl!Person/Collage/Collage" scope="{{ item.responsible.collageData }}"/>
             *      </div>
             *     </ws:if>
             * </pre>
             * @remark
             * Если в настройке колонки имя поля соответствует шаблону ['Name1.Name2'], то при подготовке полей для рендеринга строки считаем, что в .get('Name1') находится рекорд, и значение получаем уже у этого рекорда через .get('Name2')
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
             *     define('Examples/MyArea/nDataGridView',
             *        [
             *           ...,
             *           'tmpl!Examples/MyArea/nDataGridView/resources/headTpl'
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
             * Подробнее об использовании опции вы можете прочитать в разделе <a href="/doc/platform/developmentapl/interface-development/components/list/list-settings/list-visual-display/columns/horizontal-scroll/">Горизонтальный скролл колонок</a>.
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
             * Подробнее о данном режиме списка вы можете прочитать в разделе <a href="/doc/platform/developmentapl/interface-development/components/list/list-settings/list-visual-display/ladder/">Отображение записей лесенкой</a>.
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
             * Подробнее о правилах построения шаблона вы можете прочитать в статье {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/components/list/list-settings/list-visual-display/results/ Строка итогов}.
             * <br/>
             * Чтобы шаблон можно было передать в опцию компонента, его нужно предварительно подключить в массив зависимостей.
             * @example
             * 1. Подключаем шаблон в массив зависимостей:
             * <pre>
             *     define('SBIS3/Demo/nDataGridView',
             *        [
             *           ...,
             *           'html!SBIS3/Demo/nDataGridView/resources/resultTemplate'
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
             * Пример использования опции вы можете найти в разделе <a href="/doc/platform/developmentapl/interface-development/components/list/list-settings/list-visual-display/columns/head-merge/">Объединение заголовков</a>.
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
             * Подробнее об этом механизме вы можете прочитать в разделе <a href="/doc/platform/developmentapl/interface-development/ready-solutions/fixed-header/">Фиксация шапки страниц и всплывающих панелей</a>.
             * @example
             * <pre>
             *     <option name="stickyHeader">true</option>
             * </pre>
             */
            stickyHeader: false,
            /**
             * @cfg {Boolean} Устанавливает фиксацию/прилипание группировки. Возможно будет удалена после доработок фиксации группировки.
             * @noShow
             */
            stickyGroup: true
         }
      },

      _modifyOptions: function(cfg, parsedCfg) {

         if (parsedCfg._ladderInstance) {
            cfg._ladderInstance = parsedCfg._ladderInstance;
         } else if (!cfg._ladderInstance) {
            cfg._ladderInstance = parsedCfg._ladderInstance = new Ladder();
         }

         var newCfg = DataGridView.superclass._modifyOptions.apply(this, arguments);

         //TODO Костыль. Чтоб в шаблоне позвать Sanitize с компонентами приходится прокидывать в виде функции свой sanitize
         newCfg.sanitize = function(obj) {
            return Sanitize (obj.value, {validNodes: {component: true}, validAttributes : {config : true} })
         };
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

         if (isEmpty(newCfg.groupBy) || !newCfg.stickyHeader) {
            newCfg.stickyGroup = false;
         }

         return newCfg;
      },

      $constructor: function() {
         var self = this;
         // Событие onChangeHeadVisibility используется в стики хедере.
         // Внешнюю документацию не обновлял, т.к. без метода получения состояния видимости хедера это событие
         // практически не представляет ценности.
         this._publish('onDrawHead', 'onChangeHeadVisibility');
         this._tfoot = $('.controls-DataGridView__tfoot', this._container[0]);
         this._tbody = $('.controls-DataGridView__tbody', this._container[0]);
         this.getContainer().on('mousedown', function(e) {
            if (self._isPartScrollVisible && e.which === 2) {
               e.preventDefault();
            }
         });
      },

      init: function() {
         DataGridView.superclass.init.call(this);
         this._updateHeadAfterInit();
         CommandDispatcher.declareCommand(this, 'ColumnSorting', this._setColumnSorting);
      },

      _onDataLoad: function(list) {
         /* Если установлен table-layout: auto,
            то после перезагрузки могут поменться данные и ширина колонок,
            поэтому надо сбросить частичный скролл. (делаю до отрисовки, самый быстрый способ). */
         if(this._isPartScrollVisible && this._currentScrollPosition && this.getContainer().hasClass('controls-DataGridView__tableLayout-auto')) {
            this._setPartScrollShift(0);
         }
         DataGridView.superclass._onDataLoad.call(this, list);
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
      
      _getCellContainerByElement: function(element) {
         element = element instanceof jQuery ? element : $(element);
         return element.closest('.controls-DataGridView__td, .controls-DataGridView__th', this.getContainer());
      },
      
      _getHoveredColumn: function() {
         return this._options._hoveredColumn;
      },

      _mouseMoveHandler: function(e) {
         DataGridView.superclass._mouseMoveHandler.apply(this, arguments);

         var td = this._getCellContainerByElement(e.target),
             columns = this.getColumns(),
             index, hoveredColumn, colIndex, colValue;

         if(td.length) {
            index = td.index();
            hoveredColumn = this._getHoveredColumn();
            colIndex = index - (this.getMultiselect() ? 1 : 0);

            if(columns[colIndex] && !columns[colIndex].cellTemplate && !td[0].getAttribute('title')) {
               colValue = td.find('.controls-DataGridView__columnValue')[0];
               TitleUtil.setTitle(colValue, this._getCellEllipsisContainer(td));
            }

            if (hoveredColumn.columnIndex !== index) {
               this._clearHoveredColumn();
               hoveredColumn.columnIndex = index;
               this._updateHoveredColumnCells();
            }
         }
      },
   
      _getCellEllipsisContainer: function(td) {
         return td.find('.controls-DataGridView__columnValue');
      },

      _mouseLeaveHandler: function() {
         DataGridView.superclass._mouseLeaveHandler.apply(this, arguments);
         this._clearHoveredColumn();
      },

      _clearHoveredColumn: function() {
         var hoveredColumn = this._getHoveredColumn();

         if(hoveredColumn.columnIndex !== null) {
            hoveredColumn.cells.removeClass('controls-DataGridView__hoveredColumn__cell');
            hoveredColumn.cells = null;
            hoveredColumn.columnIndex = null;
         }
      },
      
      _updateHoveredColumnCells: function() {
         var hoveredColumn = this._getHoveredColumn();
         
         if (hoveredColumn.columnIndex !== null) {
            var cells = [],
                trs, cell;
   
            trs = $(this._tbody[0].children);
   
            if(this._options.showHead) {
               trs.push(this.getTHead()[0].children[0]);
            }
   
            for(var i = 0, len = trs.length; i < len; i++) {
               cell = trs[i].children[hoveredColumn.columnIndex];
               if(cell) {
                  cells.push(cell);
               }
            }
   
            hoveredColumn.cells = $(cells).addClass('controls-DataGridView__hoveredColumn__cell');
         }
      },
   
      _notifyOnItemClick: function(id, data, target, e) {
         /* Для DataGridView дополняем событие клика информацией о колонке и ячейке */
         var cell = this._getCellContainerByElement(e.target),
             clickedCell = {
                cellContainer: cell,
                //При клике на touch устройствах не будет hoveredColumn, поэтому ищем по элементу, по котрому кликнули
                cellIndex: this._getHoveredColumn().columnIndex || cell.index()
             };
      
         return this._notify('onItemClick', id, data, target, e, clickedCell);
      },

      _getItemsContainer: function(){
         return $('.controls-DataGridView__tbody', this._container).first();
      },

      _buildTplArgs : function(cfg) {
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
            isSearch : args.isSearch,
            escapeHtml: args.escapeHtml
         };
         args.startScrollColumn = cfg.startScrollColumn;
         args.columnsShift = this._getColumnsScrollPosition();
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

      _toggleIndicator: function(show){
         DataGridView.superclass._toggleIndicator.apply(this, arguments);
         if (!show) {
            // После скрытия индикатора загрузки убираем все кастомные стили
            this._setMinHeight('');
            this._getAjaxLoaderContainer().css({top: '', height: ''});
         }
      },

      _showIndicator: function () {
         DataGridView.superclass._showIndicator.apply(this, arguments);
         this._updateAjaxLoaderPosition();
      },

      _updateAjaxLoaderPosition: function () {
         var tHeadHeight, styles;
         if (!this._thead) {
            return;
         }
         // Смещаем индикатор загрузки вниз на высоту заголовков.
         tHeadHeight = this._thead.outerHeight();
         styles = {top: tHeadHeight || ''};
         this._getAjaxLoaderContainer().css(styles);

         this._setMinHeight(tHeadHeight + this._getAjaxLoaderMinHeight() + 'px');
      },

      _getMinHeightContainer: memoize(function () {
         return this.getContainer().find('.js-controls-DataGridView__minHeight');
      }, '_getMinHeightContainer'),

      _setMinHeight: function (height) {
         // Индикатор загрузки позиционируется абсолютно, поэтому не участвует в рассчете высоты компонента.
         // Корректируем минимальную высоту компонента с учетом зафиксированных заголовков
         // что бы он не вылазил за пределы компонента.
         this._getMinHeightContainer().css('height', height);
      },

      _getAjaxLoaderMinHeight: memoize(function () {
         return parseInt(this._getAjaxLoaderContainer().css('min-height'), 10);
      }, '_getAjaxLoaderMinHeight'),


      _showLoadingIndicator: function () {
         var tHeadHeight = 0;

         DataGridView.superclass._showLoadingIndicator.apply(this, arguments);

         if (this._thead) {
            tHeadHeight = this._thead.outerHeight();
         }
         this._setMinHeight(tHeadHeight + this._getLoadingIndicatorHeight() + 'px');
      },
      _hideLoadingIndicator: function () {
         DataGridView.superclass._hideLoadingIndicator.apply(this, arguments);
         this._setMinHeight('');
      },
      _getLoadingIndicatorHeight: memoize(function () {
         return parseInt(this.getContainer().children('.controls-ListView-scrollIndicator').css('height'), 10);
      }, '_getLoadingIndicatorHeight'),

      _redrawHead : function() {
         var
            headData,
            headMarkup;

         if (!this._thead) {
            this._bindHead();
         }
   
         /* Почему приходится чистить самим:
          1) Мы шаблон шапки исполняем сами, т.е. вызываем функцию, а потом строку вставляем в DOM,
          поэтому компонентам не проставляется корректно parent.
          2) Перерисовка шапки может быть вызвана ещё до оживления контролов,
          поэтому разрушить контролы не получится (нет инстансов),
          и конфиги остаются висеть в ConfigStorage.
          */
         if (this._thead) {
            this._thead.find('[config]').each(function (index, elem) {
               if (!elem.wsControl) {
                  configStorage.deleteKey(elem.getAttribute('config'));
               }
            });
         }
         headData = prepareHeadData.call(this, this._options);
         headData.columnsShift = this._getColumnsScrollPosition();
         headData.thumbPosition = this._currentScrollPosition;
         headMarkup = this._options.headTpl.call(this, headData);
         var body = $('.controls-DataGridView__tbody', this._container);

         var newTHead = $(headMarkup);

         /* Если шапка зафиксирована, то она находится вне контейнера компонента.
            По этой причине обработчики событий надо вешать для неё отдельно. */
         if(this._options.stickyHeader) {
            this._toggleEventHandlers(newTHead, true);
         }

         if (this._thead && this._thead.length){
            this._destroyControls(this._thead);
            this._thead.replaceWith(newTHead);
            this._thead = newTHead;
         } else {
            this._thead = newTHead.insertBefore(body);
         }

         this._redrawColgroup();
         if (this.hasPartScroll()) {
            // Заголовки всегда рисуются со скрытым скролом. Решение о том будет ли показан скрол принимается позднее
            this.getContainer().removeClass('controls-DataGridView__PartScroll__shown');
         }
         this._bindHead();
         // Итоги как и заголовки отрисовываются в thead. Помечаем заголовки для фиксации при необходимости.
         if (this._options.stickyHeader && !this._options.showHead && this._options.resultsPosition === 'top') {
            this._updateStickyHeader(headData.hasResults);
         }
      },

      _redrawFoot: function(){
         var footData = prepareHeadData.call(this, this._options, true),
             newTFoot = $(this._options._footTpl.call(this, footData));

         if (this._tfoot && this._tfoot.length){
            this._destroyControls(this._tfoot);
            this._saveConfigFromOption(footData);
            this._tfoot.replaceWith(newTFoot);
            this._tfoot = newTFoot;
         }
         DataGridView.superclass._redrawFoot.call(this);
      },

      _redrawTheadAndTfoot: function(){
         this._redrawHead();
         this._redrawFoot();
         this._headIsChanged = true;
      },

      _bindHead: function() {
         var tableContainer = this._getTableContainer();
         if (!this._thead) {
            // при фиксации заголовка таблицы в шапке реальный thead перемещён в шапку, а в контроле лежит заглушка
            this._thead = tableContainer.find('>.controls-DataGridView__thead');
         }
         this._colgroup = tableContainer.find('>.controls-DataGridView__colgroup');
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
            this._getTableContainer().toggleClass('ws-sticky-header__table', isSticky);
         }
      },

      _updateStickyHeader: function(isSticky) {
         if (!this._options.stickyHeader) {
            return;
         }
         var table = this._getTableContainer(),
            isFixed = table.hasClass('ws-sticky-header__table');

         if (isFixed === isSticky) {
            return;
         }

         table.toggleClass('ws-sticky-header__table', Boolean(isSticky));
         if (isSticky) {
            EventBus.channel('stickyHeader').notify('onForcedStickHeader', this.getContainer());
         } else {
            StickyHeaderManager.unfixOne(table, true);
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
            this._updatePartScroll();
         }
         DataGridView.superclass._drawItemsCallback.call(this);

         /* TODO В IE, по непонятным причинам, при смене колонок, не всегда пересчитывается ширина этих колонок, в следствии чего
            колонки без ширины не расстягиваются и таблица смещается влево. Поэтому вставим в таблицу div и удалим его,
              таким образом заставив таблицу пересчитать ширину. */
         if (constants.browser.isIE){
            $('<div></div>').appendTo(this._getTableContainer()).remove();
         }
      },
   
      _drawItemsCallbackSync: function() {
         this._updateHoveredColumnCells();
         DataGridView.superclass._drawItemsCallbackSync.call(this);
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
         /* Выполняем до родительского resize, иначе фиксированная шапка будет считать ширину колонок
            до установки ширины частичным скролом, и может случиться рассинхрон ширин в шапке и таблице */
         this._containerOffsetWidth = this.getContainer().outerWidth();
         if(this.hasPartScroll()) {
            this._setColumnWidthForPartScroll();
            this._updatePartScroll();
         }
         DataGridView.superclass._onResizeHandler.apply(this, arguments);
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

      _drawPage: function() {
         DataGridView.superclass._drawPage.apply(this, arguments);
         this._redrawTheadAndTfoot();
         this.reviveComponents(this._thead);
         this._notify('onDrawHead');
         this._headIsChanged = false;
         this.reviveComponents(this._tfoot);
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
                     // С IOS 11 версии перестал работать подскролл к нужному месту. Отключаем наш код, который при клике
                     // проваливается в редактор по месту, иначе вызывается неправильно работающий scrollIntoView и всё
                     // ломает: https://online.sbis.ru/opendoc.html?guid=742195a5-c89c-4af8-8121-cdeefa26959e
                     if (!constants.browser.isMobileIOS || cDetection.IOSVersion < 11) {
                        ImitateEvents.imitateFocus(originalEvent.clientX, originalEvent.clientY);
                     }
                  }
                  return !result;
               })
               .addErrback(function () {
                  return true;
               }));
         }
      },
      showEip: function(model, options, withoutActivateFirstControl, targetColumnIndex) {
         return this._canShowEip(targetColumnIndex) ? this._getEditInPlace().addCallback(function(editInPlace) {
            return editInPlace.showEip(model, options, withoutActivateFirstControl);
         }) : Deferred.fail();
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
            columns = this.isEnabled() ? this._options.columns : [];
         if (!this.isEnabled()) {
            this._options.columns.forEach(function(item) {
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
                  var tds, scrolledColumns;

                  if(!self._options.editingTemplate && self.hasPartScroll()) {
                     tds = eip.getContainer().find('td');
                     scrolledColumns = self._options.startScrollColumn;
                     
                     if(self._options.multiselect) {
                        scrolledColumns += 1;
                     }

                     /* Развесим классы для частичного скрола при инициализации редактирования по месту */
                     for (var i = 0, len = tds.length; i < len; i++) {
                        tds.eq(i).addClass(scrolledColumns <= i ? 'controls-DataGridView__scrolledCell' : 'controls-DataGridView__notScrolledCell');
                     }
                     /* Подпишемся у рекдатирования по месту на смену фокуса дочерних элементов,
                        чтобы правильно позиционировать частичный скролл при изменении фокуса */
                     eip.subscribe('onChildControlFocusIn', function(e, control) {
                        self._scrollToEditControl(control);
                     });

                     /* При инициализации надо проскрлить редактируемые колонки */
                     self.updateScrollAndColumns(true);
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

      _updatePartScroll: function() {
         var needShowScroll = this._isTableWide();

         this._isPartScrollVisible ?
            needShowScroll ?
               this.updateScrollAndColumns() : this._hidePartScroll() :
            needShowScroll ?
               this._showPartScroll() : this._hidePartScroll();
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
            /* Необхдимо скролить сразу, иначе бразуер по фокусу в контрол сдвинет контейнер таблицы */
            this._moveThumbAndColumns({left: leftOffset}, true);
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
               /* col в colgroup может не быть, если поменяли колонки (setColumns),
                  но список ещё не перерисовался. Перерасчёт ширин может быть вызван любым resize'ом. */
               if (minWidth && cols[colIndex]) {
                  cols[colIndex].width = minWidth + 'px';
               }
            }
         }
      },

      _dragStart: function(e) {
         if (this._isPartScrollVisible) {
            constants.$body.addClass('ws-unSelectable');
         }
   
         /* Если скролл происходит перетаскиванием заголовков
          то выставим соответствующие флаги */
         this._isHeaderScrolling =
            e.currentTarget !== this._thumb[0] && //Проверка, что перетаскиваем не ползунок, т.к. он тоже лежит в шапке
            this._thead && this._thead.find(e.currentTarget).length;
   
         if (this._isHeaderScrolling) {
            this.getContainer().addClass('controls-DataGridView__scrollingNow');
         }
         /* На touch устройствах надо перевести фокус(нативный) на ползунок,
          т.к. сейчас взаимодействие происходит с ним. Иначе могут возникать проблемы,
          когда курсор остаётся в поле ввода, или ховер останется на иконке другой */
         if (this._touchSupport) {
            this._thumb.focus();
         }
         this._scrollingNow = true;
      },

      updateScrollAndColumns: function(force) {
         this._updatePartScrollWidth();
         this._findMovableCells();
         this._moveThumbAndColumns({left: this._currentScrollPosition}, force);
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

      _getDragAndDropContainer: function() {
         return this._thead.find('.controls-DataGridView__PartScroll__thumb, .controls-DataGridView__scrolledCell');
      },

      _getPartScrollContainer: function() {
         return this._thead.find('.controls-DataGridView__PartScroll__container');
      },

      _dragMove: function(event, cords) {
         if(this._isHeaderScrolling) {
            var pos;
            
            if(!this._isPartScrollVisible) {
               return;
            }

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
   
      /**
       * Передвигает ползунок частичного скрола на переданную координату
       * @param cords Значение, на которое нужно проскролить
       * @param force выполнить скролл сразу, а не запланировать в ближайший кадр перерисовки бразуера (менее оптимально)
       * @private
       */
      _moveThumbAndColumns: function(cords, force) {
         var self = this;
         
         /* Т.к. requestAnimationFrame работает асинхронно, надо выполнять лишь последний вызов,
            иначе скролл может дёргаться */
         this._cancelScrollRequest();
         
         if(!force) {
            this._partScrollRequestAnimationId = window.requestAnimationFrame(function() {
               self._scrollColumns(cords);
            })
         } else {
            this._scrollColumns(cords);
         }
      },
      
      _cancelScrollRequest: function() {
         if(this._partScrollRequestAnimationId) {
            window.cancelAnimationFrame(this._partScrollRequestAnimationId);
            this._partScrollRequestAnimationId = null;
         }
      },
   
      _scrollColumns: function(cords) {
         this._setPartScrollShift(cords);
      
         /* 1) Ячейки двигаем через translateX, т.к. IE не двиагает ячейки через left,
               если таблица лежит в контейнере с display: flex.
            2) Math.round нужен для решения бага хрома, если делать translateX с дробным значеним,
               то будет происходить замыливание текста. https://bugs.chromium.org/p/chromium/issues/detail?id=521364 */
         var movePosition = 'translateX(' + Math.round(this._getColumnsScrollPosition()) + 'px)';
      
         for(var i= 0, len = this._movableElems.length; i < len; i++) {
            this._movableElems[i].style.transform = movePosition;
         }
      },
   
      /**
       * Устанавливает сдвиг для частичного скрола
       * @param {Object|Number} position
       * @private
       */
      _setPartScrollShift: function(position) {
         this._currentScrollPosition = typeof position === 'object' ? this._checkThumbPosition(position) : this._checkThumbPosition({left: position});
         /* Записываем в опцию, чтобы была возможность использовать в шаблоне */
         this._options._columnsShift = -this._currentScrollPosition*(this._partScrollRatio || 0);
         if (this._isPartScrollVisible) {
            this._thumb[0].style.left = this._currentScrollPosition + 'px';
         }
      },

      _getColumnsScrollPosition: function() {
         return this._options._columnsShift;
      },

      _updatePartScrollWidth: function() {
         var containerWidth = this._container[0].offsetWidth,
             scrollContainer = this._getPartScrollContainer(),
             thumbWidth = this._thumb[0].offsetWidth,
             correctMargin = 0,
             lastRightStop = this._stopMovingCords.right,
             arrowsWidth = this._arrowRight[0].offsetWidth * 2,
             notScrolledCells, thumbPos;
   
         /* Найдём ширину нескроллируемых колонок */
         if(this._options.startScrollColumn > 0) {
            /* При включённой опции stickyHeader необходимо брать размеры не из thead,
               т.к. в thead хранится ссылка на шапку, которая лежит вне таблицы.
               И она может иметь в момент расчётов некорректные размеры.
               thead, который лежит в таблице, всегда имеет корректные размеры. */
            var tHead = this._options.stickyHeader ?
               this._getTableContainer().find('>.controls-DataGridView__thead') :
               this._thead;
            
            notScrolledCells = tHead.find('tr').eq(0).find('.controls-DataGridView__notScrolledCell');
            for(var i = 0, len = notScrolledCells.length; i < len; i++) {
               correctMargin += notScrolledCells[i].offsetWidth;
            }
            /* Сдвинем контейнер скролла на ширину нескроллируемых колонок */
            scrollContainer[0].style.marginLeft = correctMargin + 'px';
         }
         /* Проставим ширину контейнеру скролла */
         scrollContainer[0].style.width = containerWidth - correctMargin + 'px';

         /* Найдём соотношение, для того чтобы правильно двигать скроллируемый контент относительно ползунка */
         // !В edge ширина tbody === 0, если нет строк таблицы, надо брать ширину у table или thead
         this._partScrollRatio = (this._getTableContainer()[0].offsetWidth - containerWidth) / (containerWidth - correctMargin - thumbWidth - arrowsWidth);
         this._stopMovingCords = {
            right: scrollContainer[0].offsetWidth - thumbWidth - arrowsWidth,
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
              .toggleClass('icon-primary controls-DataGridView__PartScroll__arrowRight_hover', enable);
      },

      _isTableWide: function() {
         return this._container[0].offsetWidth < this._getTableContainer()[0].offsetWidth;
      },

      _hidePartScroll: function() {
         if(this._isPartScrollVisible) {
            this._partScrollRow.addClass('ws-hidden');
            this._isPartScrollVisible = false;
            this.getContainer().removeClass('controls-DataGridView__PartScroll__shown');
            if(this._currentScrollPosition !== 0) {
               this._moveThumbAndColumns({left: 0});
            }
            // Вызываем для обновления классов у фиксированного заголовка и обновления размера скрола в ScrollContainer
            this._resizeChilds();
         }
      },

      _showPartScroll: function() {
         if(!this._isPartScrollVisible) {
            this._partScrollRow.removeClass('ws-hidden');
            this.getContainer().addClass('controls-DataGridView__PartScroll__shown');
            this._updatePartScrollWidth();
            this._findMovableCells();
            this._isPartScrollVisible = true;
            // Вызываем для обновления классов у фиксированного заголовка и обновления размера скрола в ScrollContainer
            this._resizeChilds();
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
          
          if(this.hasPartScroll()) {
             /* При установке колонок, надо сбросить частичный скролл */
             this._setPartScrollShift(0);
          }
          checkColumns(this._options);
          // Обновим список колонок для редактирования по месту
          this._updateEditInPlaceColumns(this._options.columns);
       },

      _updateEditInPlaceColumns: function(columns) {
          var self = this;

         if (this._hasEditInPlace()) {
            // Если используется редактирование по месту, то необходимо:
            // 1. Поменять набор колонок в контроллере
            this._getEditInPlace().addCallback(function(editInPlaceController) {
               editInPlaceController.setColumns(columns);
               editInPlaceController.setIgnoreFirstColumn(!!self._options.multiselect);
            });
            // 2. Уничтожить запущенное редактирование по месту, чтобы оно пересоздалось с актуальными колонками
            this._destroyEditInPlace();
         }
      },

      _oldRedraw: function() {
         DataGridView.superclass._oldRedraw.apply(this, arguments);
         this._redrawTheadAndTfoot();
      },

      setMultiselect: function() {
         DataGridView.superclass.setMultiselect.apply(this, arguments);
         // При установке multiselect создается отдельная td'шка под checkbox, которая не учитывается при редактировании по месту.
         // Обновим список колонок для редактирования по месту
         this._updateEditInPlaceColumns(this._options.columns);

         if(this.getItems()) {
            this.redraw();
         } else if(this._options.showHead) {
            this._redrawTheadAndTfoot();
            this.reviveComponents(this._thead);
            this._notify('onDrawHead');
            this._headIsChanged = false;
            this.reviveComponents(this._tfoot);
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
      _prepareItemsData : function() {
         var data = DataGridView.superclass._prepareItemsData.apply(this, arguments);
         this._addStickyToGroups(data.records);
         return data;
      },
      _getItemsForRedrawOnAdd: function(items) {
         var data = DataGridView.superclass._getItemsForRedrawOnAdd.apply(this, arguments);
         this._addStickyToGroups(data);
         return data;
      },
      _addStickyToGroups: function (data) {
         if (this._options.stickyHeader && !isEmpty(this._options.groupBy)) {
            data.forEach(function (item) {
               if (item.hasOwnProperty('data') && item.hasOwnProperty('tpl')) {
                  item.data.stickyHeader = this._options.stickyHeader;
               }
            }, this);
         }
      },
      _redrawResults: function(revive) {
         //Если данные не изменились, то не нужно впустую перерисовывать итоги
         if (this._headIsChanged && this._options.resultsPosition !== 'none') {
            this._redrawTheadAndTfoot();

            if (revive) {
               var self = this;
               this.reviveComponents(this._thead).addCallback(function () {
                  self._notify('onDrawHead');
                  self._headIsChanged = false;
               });
               this.reviveComponents(this._tfoot);
            }
         }
      },
      destroy: function() {
         if (this.hasPartScroll()) {
            this._cancelScrollRequest();
            this._thumb.unbind('click');
            this._thumb = undefined;
            this._arrowLeft.unbind('click');
            this._arrowLeft = undefined;
            this._arrowRight.unbind('click');
            this._arrowRight = undefined;
            this._movableElems = [];
         }
   
   
         if(this._options.showHead && this._options.stickyHeader && this._thead) {
            this._toggleEventHandlers(this._thead, false);
         }
         
         if (this._options.stickyHeader && !this._options.showHead && this._options.resultsPosition === 'top') {
            this._updateStickyHeader(false);
         }
         
         this._thead = undefined;
         this._tbody = undefined;
         this._tfoot = undefined;
         
         DataGridView.superclass.destroy.call(this);
      },
      _setColumnSorting: function(colName, sortingtype) {
         var sorting, newSorting, wasNoneSorting = true;
         sorting = this.getSorting();

         //при режиме сортировки отличному от single либо когда сортируют по уже отсортированной колонке, но в другом направлении выполняем обычную логику
         if ((sortingtype != 'single') || ((sorting.length == 1 && sorting[0][colName]))) {
            newSorting = sorting.filter(function (sortElem) {
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
         }
         //в противном случае всю сортировку надо сбросить
         else {
            newSorting = [];
         }

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
                  value === undefined || value === null ? '' : escapeHtml(value), {
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
            curItem = coreClone(item),
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
      },

      _getTableContainer: function(){
         return this.getContainer().find('>.controls-DataGridView__table');
      },


      _reviveItems: function() {
         //контролы в шапке тоже нужно оживить
         if (this._container.find(this._thead).length == 0) {
            this.reviveComponents(this._thead);
         }
         DataGridView.superclass._reviveItems.apply(this, arguments);
      },

      _onReviveItems: function(lightVer, silent) {
         if (this._headIsChanged && !silent) {
            this._notify('onDrawHead');
            this._headIsChanged = false;
         }
         DataGridView.superclass._onReviveItems.apply(this, arguments);
      }
   });

   return DataGridView;

});
