/**
 * Интерфейс для табличного представления.
 *
 * @interface Controls/_grid/interface/IGridControl
 * @public
 * @author Авраменко А.С.
 */

/*
 * Interface for Grid (table view).
 *
 * @interface Controls/_grid/interface/IGridControl
 * @public
 * @author Авраменко А.С.
 */

/**
 * @name Controls/_grid/interface/IGridControl#ladderProperties
 * @cfg {Array.<String>} Массив свойств, по которым происходит прилипание.
 * Работу лесенки можно проверить на <a href="/materials/demo-ws4-grid-sticky">демо-примере</a>.
 * @example
 * Пример 1. Шаблон лесенки задан в рамках шаблона родительского контрола.
 * <pre class="brush: html">
 *    <!-- MyControl.wml -->
 *    <div class="demoGrid">
 *       <Controls.grid:View ladderProperties="{{ ['date'] }}">
 *          <ws:columns>
 *             <ws:Array>
 *                <ws:Object width="1fr">
 *                   <ws:template>
 *                      <ws:partial template="Controls/grid:ColumnTemplate">
 *                         <ws:contentTemplate>
 *                            <ws:partial template="{{template.ladderWrapper}}" ladderProperty="date">
 *                               <div class="demoGrid__date">
 *                                  {{template.itemData.item['date']}}
 *                               </div>
 *                            </ws:partial>
 *                         </ws:contentTemplate>
 *                      </ws:partial>
 *                   </ws:template>
 *                </ws:Object>
 *             </ws:Array>
 *          </ws:columns>
 *       </Controls.grid:View>
 *    </div>
 * </pre>
 *
 * Пример 2. Шаблон лесенки вынесен в отдельный шаблон.
 * <pre class="brush: html">
 *    <!-- MyControl.wml -->
 *    <div class="demoGrid">
 *       <Controls.grid:View
 *          ...
 *          ladderProperties="{{ ['date'] }}">
 *          <ws:columns>
 *             <ws:Array>
 *                <ws:Object width="1fr" template="wml!MyModule/MyTemplate" />
 *             </ws:Array>
 *          </ws:columns>
 *       </Controls.grid:View>
 *    </div>
 * </pre>
 * <pre class="brush: html">
 *    <!-- MyTemplate.wml -->
 *    <ws:partial template="{{ladderWrapper}}" ladderProperty="date">
 *       <div class="demoGrid__date">
 *          {{itemData.item['date']}}
 *       </div>
 *    </ws:partial>
 * </pre>
 */

/*
 * @name Controls/_grid/interface/IGridControl#ladderProperties
 * @cfg {Array.<String>} Array of fields that should be sticky.
 * <a href="/materials/demo-ws4-grid-sticky">Example</a>
 * @example
 * Set ladderProperties and render item template through the ladderWrapper:
 * <pre>
 *    <div class="demoGrid">
 *       <Controls.grid:View
 *          ...
 *          ladderProperties="{{ ['date'] }}">
 *          <ws:columns>
 *             <ws:Array>
 *                <ws:Object width="1fr">
 *                   <ws:template>
 *                      <ws:partial template="Controls/grid:ColumnTemplate">
 *                         <ws:contentTemplate>
 *                            <ws:partial template="{{ladderWrapper}}" ladderProperty="date">
 *                               <div class="demoGrid__date">
 *                                  {{itemData.item['date']}}
 *                               </div>
 *                            </ws:partial>
 *                         </ws:contentTemplate>
 *                      </ws:partial>
 *                   </ws:template>
 *                </ws:Object>
 *             </ws:Array>
 *          </ws:columns>
 *       </Controls.grid:View>
 *    </div>
 * </pre>
 */

/**
 * @typedef {String} GridCellAlign
 * @variant left Выровнять содержимое ячейки по левому краю.
 * @variant center Выровнять содержимое ячейки по центру.
 * @variant right Выровнять содержимое ячейки по правому краю.
 */

/*
 * @typedef {String} GridCellAlign
 * @variant left Align content to left side.
 * @variant center Align content to center.
 * @variant right Align content to right side.
 */

/**
 * @typedef {String} GridCellVAlign
 * @variant top Выровнять содержимое ячейки по верхнему краю.
 * @variant center Выровнять содержимое ячейки по центру.
 * @variant bottom Выровнять содержимое ячейки по нижнему краю.
 */

/*
 * @typedef {String} GridCellVAlign
 * @variant top Align content to top side.
 * @variant center Align content to center.
 * @variant bottom Align content to bottom side.
 */

/*
 * @typedef {Object} cellPadding
 * @property {enum('s'|'null')} left левый отступ ячейки.
 * @property {enum('s'|'null')} right правый отступ ячейки.
 */

/**
 * @typedef {Object} HeaderCell
 * @property {String} caption Текст заголовка ячейки.
 * @property {GridCellAlign} align Выравнивание содержимого ячейки по горизонтали.
 * @property {GridCellVAlign} valign Выравнивание содержимого ячейки по вертикали.
 * @property {String} template Шаблон заголовка ячейки. По умолчанию используется базовый шаблон Controls/grid:HeaderContent.
 * Для базового шаблона можно задать класс controls-Grid__header-cell_spacing_money, который добавляет отступ в заголовке столбца при рендере денежных данных.
 * Подробнее о работе с шаблоном читайте в <a href="https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/grid/templates/header/">документации</a>.
 * @property {String} sortingProperty Свойство, по которому выполняется сортировка. 
 * В качестве значения принимает имя поля. 
 * Если в конфигурации ячейки задать это свойство, то в шапке таблицы в конкретной ячейки будет отображаться кнопка для изменения сортировки. 
 * Клик по кнопке будет менять порядок сортировки элементов на противоположный. 
 * При этом элементы будут отсортированы по полю, имя которого указано в свойстве sortingProperty.
 * <pre class="brush: js">
 * _sorting: null,
 * _header: null,
 * _beforeMount: function(){
 *    this._sorting = [
 *       {
 *          price: 'desc'
 *       },
 *       {
 *          balance: 'asc'
 *       }
 *    ],
 *    this._header = [
 *       {
 *          title: 'Цена',
 *          sortingProperty: 'price'
 *       },
 *       {
 *          title: 'Остаток',
 *          sortingProperty: 'balance'
 *       }
 *    ];
 * }
 * </pre>
 * @property {Number} startRow Порядковый номер строки на которой начинается ячейка.
 * @property {Number} endRow Порядковый номер строки на которой заканчивается ячейка.
 * @property {Number} startColumn Порядковый номер колонки на которой начинается ячейка.
 * @property {Number} endColumn Порядковый номер колонки на которой заканчивается ячейка.
 * @property {Object} templateOptions Опции, передаваемые в шаблон ячейки заголовка.
 * @property {cellPadding} cellPadding Опции для задания ячейкам левого и правого отступа, исключая левый отступ первой ячейки и правый последней.
 */

/*
 * @typedef {Object} HeaderCell Describer grid's header cell.
 * @property {String} [caption] Header cell caption text.
 * @property {GridCellAlign} [align] Horizontal cell content align.
 * @property {GridCellVAlign} [valign] Vertical cell content align.
 * @property {String} [template] Template for the header cell. CSS class controls-Grid__header-cell_spacing_money sets the right indent for the content of the header cell to align by integers in money fields.
 * @property {String} sortingProperty Property by which doing sorting.
 * @property {Number} startRow The sequence number of the line on which the cell begins.
 * @property {Number} endRow The sequence number of the line on which the cell ends.
 * @property {Number} startColumn The serial number of the column on which the cell begins.
 * @property {Number} endColumn The serial number of the column on which the cell ends.
 */

/**
 * @name Controls/_grid/interface/IGridControl#header
 * @cfg {Array.<HeaderCell>} Описывает шапку таблицы. В качестве значения опция принимает массив объектов, в которых задают конфигурацию для ячеек шапки. Для одноуровневых шапок первый объект массива задаёт конфигурацию для первой ячейки. Условно ячейки шапки нумеруются слева направо. Для многоуровневой шапки порядок объектов массива не соответствует конфигуруемой ячейке. 
 * <a href="/doc/platform/developmentapl/interface-development/controls/list/grid/templates/header/">См. руководство разработчика</a>
 * <a href="/materials/demo-ws4-grid-base">См. демо-пример</a>
 * @example
 * Пример 1. Для первой ячейки задаём пользовательский шаблон.
 * <pre>
 *    <Controls.grid:View>
 *       <ws:header> 
 *          <ws:Array>
 *              <ws:template>
 *                  <ws:partial template="Controls/grid:HeaderContent" attr:class="controls-Grid__header-cell_spacing_money" colData="{{colData}}" />
 *              </ws:template>
 *          </ws: Array>
 *       </ws:header>
 *    </Controls.grid:View>
 * </pre>
 * @example
 * Пример 2. Настройка опции задаётся в хуке и передаётся в шаблон.
 * <pre>
 * _header: null,
 * _beforeMount: function(options) {
 *      this._header = [
 *      {
 *          caption: 'Name',
 *          startRow: 1,
 *          endRow: 3,
 *          startColumn: 1,
 *          endColumn: 2
 *      },
 *      {
 *          caption: 'Price',
 *          startRow: 1,
 *          endRow: 2,
 *          startColumn: 2,
 *          endColumn: 4
 *      },
 *      {
 *          caption: 'Cell',
 *          startRow: 2,
 *          endRow: 3,
 *          startColumn: 2,
 *          endColumn: 3
 *      },
 *      {
 *          caption: 'Residue',
 *          startRow: 2,
 *          endRow: 3,
 *          startColumn: 3,
 *          endColumn: 4
 *      }
 *      ]
 * }
 * </pre>
 */

/*
 * @name Controls/_grid/interface/IGridControl#header
 * @cfg {Array.<Array.<HeaderCell>>} Describes grid's header.
 * <a href="/materials/demo-ws4-grid-base">Example</a>
 * @remark
 * Base header content template for Controls/grid:View: "Controls/grid:HeaderContent".
 * @example
 * Add header text spacing for columns with money fields:
 * <pre>
 *    <ws:partial template="Controls/grid:HeaderContent" attr:class="controls-Grid__header-cell_spacing_money" colData="{{colData}}" />
 * </pre>
 */

/**
 * @typedef {String} TextOverflow Определяет параметры видимости текста в блоке, если текст целиком не помещается в заданную область.
 * @variant ellipsis Текст обрезается, и в конец строки добавляется многоточие.
 * @variant none Стандартное поведение при незаданном свойстве.
 * @default none
 */

/*
 * @typedef {String} TextOverflow Defines the visibility parameters of the text in the block, if the entire text does not fit in the specified area.
 * @variant ellipsis The text is clipped and an ellipsis is added to the end of the line.
 * @variant none Standard behavior, as if the property is not set.
 * @default none
 */

/**
 * @typedef {Object} Column
 * @property {String} width Ширина столбца.
 * В качестве значения опции можно указать пиксели (px), проценты (%), доли (1fr), "auto" или "minmax".
 * В значении "auto" ширина столбца устанавливается исходя из типа и содержимого элемента.
 * В значении "minmax(,)" устанавливаются минимальная и максимальная ширина столбца, например "minmax(600px, 1fr)".
 * @property {String} displayProperty Имя поля, данные которого по умолчанию отображаются в столбце.
 * @property {String} [template=Controls/grid:ColumnTemplate] Шаблон отображения ячейки.
 * По умолчанию используется базовый шаблон {@link Controls/grid:ColumnTemplate}. На его основе можно задать пользовательский шаблон (см. <a href="/doc/platform/developmentapl/interface-development/controls/list/grid/templates/column/">руководство разработчика</a>).
 *
 * На корневой элемент пользовательского шаблона следует задать CSS-класс "controls-Grid__row-cell__content_baseline_L". Это обеспечит выравнивание контента ячейки по базовой линии.
 * <pre>
 * <Controls.grid:View>
 *     <ws:columns>
 *         <ws:Array>
 *             <ws:Object displayProperty="Name" width="200px">
 *                 <ws:template>
 *                     <ws:partial template="Controls/grid:ColumnTemplate" attr:class="controls-Grid__row-cell__content_baseline_L">
 *                         <ws:contentTemplate>
 *                           <!-- контент шаблона -->
 *                         </ws:contentTemplate>
 *                     </ws:partial>
 *                 </ws:template>
 *             </ws:Object>
 *         </ws:Array>
 *     </ws:columns>
 * </Controls.grid:View>
 * </pre>
 *
 * Базовый шаблон поддерживает контентную опцию <code>contentTemplate</code>. Поместите в неё вёрстку, которая описывает отображение ячейки.
 *
 * В области видимости базового шаблона доступна переменная <code>itemData</code> (тип <code>Object</code>) со следующими свойствами:
 * - <code>columnIndex</code> (тип Number) — порядковый номер колонки. Отсчет от 0.
 * - <code>index</code> (тип Number) — порядковый номер строки. Отсчет от 0.
 * - <code>isEditing</code> (тип Boolean) — признак редактирования по месту.
 * - <code>item</code> (тип Object) — строка, данные которой отображаются в колонке.
 * - <code>column</code> (тип Object) — конфигурация колонки.
 * @property {String} resultTemplate Шаблон отображения ячейки в строке итогов.
 * Подробнее о работе со строкой итогов читайте в <a href="/doc/platform/developmentapl/interface-development/controls/list/grid/templates/result/">руководство разработчика</a>.
 * @property {GridCellAlign} [align=left] Выравнивание содержимого ячейки по горизонтали.
 * @property {GridCellVAlign} [valign=baseline] Выравнивание содержимого ячейки по вертикали.
 * По умолчанию содержимое выравнивается по базовой линии (см. {@link align-items https://developer.mozilla.org/ru/docs/Web/CSS/align-items}).
 * @property {String} stickyProperty Имя поля, которое используется для настройки прилипания данных столбца к верхней границе таблицы.
 * @property {TextOverflow} [textOverflow=none] Определяет параметры видимости текста в блоке, если текст целиком не помещается в заданную область.
 */

/*
 * @typedef {Object} Column
 * @property {String} [width] Column width. Supported the value specified in pixels (for example, 4px) or percent (for example, 50%) or fraction (for example 1fr) and the value “auto”.
 * @property {String} [displayProperty] Name of the field that will shown in the column by default.
 * @property {String} [template] Template for cell rendering.
 * @property {String} [resultTemplate] Template for cell rendering in results row. CSS class controls-Grid__header-cell_spacing_money sets the right indent for the content of the header cell to align by integers in money fields.
 * @property {GridCellAlign} [align] Horizontal cell content align.
 * @property {GridCellVAlign} [valign] Vertical cell content align.
 * @property {String} [stickyProperty] The name of the field used to sticking the column data.
 * @property {TextOverflow} [textOverflow] Defines the visibility parameters of the text in the block, if the entire text does not fit in the specified area.
 */

/**
 * @name Controls/_grid/interface/IGridControl#columns
 * @cfg {Array.<Column>} Описывает столбцы таблицы.
 * <a href="/materials/demo-ws4-grid-base">Example</a>
 * @remark Перед отрисовкой убедитесь, что {@link Types/display:Collection Collection} содержит необходимые данные при изменении параметра {@link Controls/_grid/interface/IGridControl#columns columns}. При необходимости вызовите асинхронный метод "reload" перед изменением параметра {@link Controls/_grid/interface/IGridControl#columns columns}.
 * @example
 * <pre>
 * _columns = [
 * {
 *     displayProperty: 'name',
 *     width: '1fr',
 *     align: 'left',
 *     template: _customNameTemplate
 * },
 * {
 *     displayProperty: 'balance',
 *     align: 'right',
 *     width: 'auto',
 *     resutTemplate: '_customResultTemplate',
 *     result: 12340
 * }
 * ];
 * </pre>
 * <pre>
 *  <Controls.grid:View
 *      ...
 *      columns="{{_columns}}">
 *  </Controls.grid:View>
 * </pre>
 */

/*
 * @name Controls/_grid/interface/IGridControl#columns
 * @cfg {Array.<Column>} Describes grid's columns.
 * <a href="/materials/demo-ws4-grid-base">Example</a>
 * @remark Before rendering, make sure that {@link Types/display:Collection Collection} contains required data, when the {@link Controls/_grid/interface/IGridControl#columns columns} option changes. Call asynchronous 'reload' method before changing {@link Controls/_grid/interface/IGridControl#columns columns} option, if necessary.
 * @example
 * <pre>
 * _columns = [
 * {
 *     displayProperty: 'name',
 *     width: '1fr',
 *     align: 'left',
 *     template: _customNameTemplate
 * },
 * {
 *     displayProperty: 'balance',
 *     align: 'right',
 *     width: 'auto',
 *     resutTemplate: '_customResultTemplate',
 *     result: 12340
 * }
 * ];
 * </pre>
 * <pre>
 *  <Controls.grid:View
 *      ...
 *      columns="{{_columns}}">
 *  </Controls.grid:View>
 * </pre>
 */

/**
 * @name Controls/_grid/interface/IGridControl#stickyHeader
 * @cfg {Boolean} Закрепляет заголовок таблицы.
 * <a href="/materials/demo-ws4-grid-sticky">Example</a>
 * @default true
 */

/*
 * @name Controls/_grid/interface/IGridControl#stickyHeader
 * @cfg {Boolean} Fix the table header.
 * <a href="/materials/demo-ws4-grid-sticky">Example</a>
 * @default true
 */

/**
 * @name Controls/_grid/interface/IGridControl#columnScroll
 * @cfg {Boolean} Включает скроллирование столбцов.
 * @default false
 * @see Controls/_grid/interface/IGridControl#columnScrollStartPosition
 * @see Controls/_grid/interface/IGridControl#stickyColumnsCount
 */

/*
 * @name Controls/_grid/interface/IGridControl#columnScroll
 * @cfg {Boolean} Enable column scroll.
 * @default false
 * @see Controls/_grid/interface/IGridControl#columnScrollStartPosition
 * @see Controls/_grid/interface/IGridControl#stickyColumnsCount
 */

/**
 * @name Controls/_grid/interface/IGridControl#columnScrollStartPosition
 * @cfg {String} Определяет начальное положение горизонтальной прокрутки столбцов, если она включена.
 * @variant start Устанавливает горизонтальную прокрутку в начальное (крайнее левое) положение.
 * @variant end Устанавливает горизонтальную прокрутку в конечное (крайнее правое) положение.
 * @default start
 * @see Controls/_grid/interface/IGridControl#columnScroll
 */

/*
 * @name Controls/_grid/interface/IGridControl#columnScrollStartPosition
 * @cfg {String} Determines the starting columns scroll position if it is enabled.
 * @variant start Puts horizontal scroll into the leftmost position.
 * @variant end Puts horizontal scroll into the rightmost position.
 * @default start
 * @see Controls/_grid/interface/IGridControl#columnScroll
 */

/**
 * @name Controls/_grid/interface/IGridControl#stickyColumnsCount
 * @cfg {Number} Определяет число зафиксированных столбцов, которые не двигаются при горизонтальном скролле.
 * @default 1
 * @see Controls/_grid/interface/IGridControl#columnScroll
 * @remark
 * Столбец флагов множественного выбора всегда зафиксирован, и не входит в число stickyColumnsCount.
 */

/*
 * @name Controls/_grid/interface/IGridControl#stickyColumnsCount
 * @cfg {Number} Determines the number of fixed columns that do not move during horizontal scroll.
 * @default 1
 * @see Controls/_grid/interface/IGridControl#columnScroll
 * @remark
 * Multiple selection column is always fixed and does not count towards this number.
 */

/**
 * @name Controls/_grid/interface/IGridControl#rowSeparatorVisibility
 * @cfg {Boolean} Позволяет отображать/скрывать разделитель строк.
 * <a href="/materials/demo-ws4-grid-base">Example</a>
 * @default false
 */

/*
 * @name Controls/_grid/interface/IGridControl#rowSeparatorVisibility
 * @cfg {Boolean} Allows to visible or hide row separator.
 * <a href="/materials/demo-ws4-grid-base">Example</a>
 * @default false
 */

 /**
 * @name Controls/_grid/interface/IGridControl#resultsTemplate
 * @cfg {Function} Шаблон строки итогов.
 */

/*
 * @name Controls/_grid/interface/IGridControl#resultsTemplate
 * @cfg {Function} Results row template.
 */

/**
 * @name Controls/_grid/interface/IGridControl#resultsPosition
 * @cfg {String} Положение строки итогов.
 * @variant top Вывести итоги над списком.
 * @variant bottom Вывести итоги под списком.
 */

/*
 * @name Controls/_grid/interface/IGridControl#resultsPosition
 * @cfg {String} Results row position.
 * @variant top Show results above the list.
 * @variant bottom Show results below the list.
 */

/**
 * @name Controls/_grid/interface/IGridControl#resultsVisibility
 * @cfg {String} Режим отображения строки итогов.
 * @variant hasdata Строка итогов отображается при наличии более 1 записи в списке.
 * @variant visible Строка итогов отображается всегда, вне зависимости от количества данных в списке.
 * @default hasData
 */

/**
 * @name Controls/_grid/interface/IGridControl#showEditArrow
 * @cfg {Boolean} Позволяет отображать по ховеру кнопку в первой колонке
 * <a href="/materials/demo-ws4-edit-arrow">Example</a>
 * @remark Чтобы расположить кнопку в произвольном месте прикладного шаблона колонки, следует встроить шаблон editArrowTemplate
 * @example
 * <ws:partial template="{{editArrowTemplate}}" itemData="{{itemData}}"/>
 */

/*
 * @name Controls/_grid/interface/IGridControl#showEditArrow
 * @cfg {Boolean} Allows showing button in first column on hover.
 * <a href="/materials/demo-ws4-edit-arrow">Example</a>
 * @remark To place the button in any place of the column template, you should use the editArrowTemplate
 * @example
 * <ws:partial template="{{editArrowTemplate}}" itemData="{{itemData}}"/>
 */

/**
 * @event Controls/_grid/interface/IGridControl#editArrowClick Происходит при клике на "шеврон" элемента.
 * @param {Vdom/Vdom:SyntheticEvent} event Объект события.
 * @param {Types/entity:Model} item Элемент, по которому произвели клик.
 */
