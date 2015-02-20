/**
 * Created with JetBrains PhpStorm.
 * User: tm.baeva
 * Date: 22.04.13
 * Time: 1:05
 * To change this template use File | Settings | File Templates.
 */
define('js!SBIS3.CORE.TableView',
      [
      'js!SBIS3.CORE.DataViewAbstract',
      'html!SBIS3.CORE.TableView/TableViewRow',
      'html!SBIS3.CORE.TableView'
      ],
   function( DataViewAbstract, dotTplFnForRow, dotTplFn ) {

   'use strict';

   var MAX_DELEGATED_SELECTORS = 10;

   $ws._const.Browser = $ws._const.Browser || {};
   $ws._const.Browser.iconWidth = 16;
   $ws._const.Browser.tabWidth = 16;
   $ws._const.Browser.defaultCellPadding = 7;
   $ws._const.Browser.iconPadding = 3;
   $ws._const.Browser.minColumnWidth = 8;
   $ws._const.Browser.defColWidth = {
         'Логическое' : '20px',
         'Число целое' : '40px',
         'Деньги' : '85px',
         'Дата' : '80px',
         'Дата и время' : '80px',
         'another' : '50px'
      };
   $ws._const.Browser.type2ClassMap = {
         'Деньги': 'money',
         'Число целое': 'integer',
         'Число вещественное': 'integer'
      };
   $ws._const.Browser.selectionCheckboxWidth = 32;
   $ws._const.Browser.pathSelectorHeight = 21;

   $ws._const.TableView = {
      tableRowPadding: 5 //Отступ текста внутри ячейки таблицы
   };

   $ws.single.DependencyResolver.register('SBIS3.CORE.TableView', function(config){
      var deps = {};

      if(config) {
         var display = config.display || {};
         if(display.ladder && display.ladder.length) {
            deps['js!SBIS3.CORE.LadderPlugin'] = 1;
         }

         if(display.columns !== undefined){
            var allowEditAtThePlace = false,
                needResults = false,
                columns = display.columns,
                l = columns.length,
                column = {};
            for(var i = 0; i < l; i++){
               column = columns[i];
               if(column !== undefined){
                  if(column.allowEditAtThePlace) {
                     allowEditAtThePlace = true;
                  }
                  if(column.isResultField) {
                     needResults = true;
                  }
               }
               if(allowEditAtThePlace && needResults) {
                  break;
               }
            }
            if(display.editAtThePlaceTemplate) {
               allowEditAtThePlace = true;
            }
            if(allowEditAtThePlace) {
               deps['js!SBIS3.CORE.AtPlaceEditPlugin'] = 1;
            }
            if(needResults) {
               deps['js!SBIS3.CORE.ResultsPlugin'] = 1;
            }
         }

         if(config.colorMark) {
            deps['js!SBIS3.CORE.ColorMarkPlugin'] = 1;
         }
         if(/ws-right-accordion/.test(config.className) || display.isRightAccordion){
            deps['js!SBIS3.CORE.RightAccordionPlugin'] = 1;
         }
      }
      return Object.keys(deps);
   }, 'SBIS3.CORE.DataViewAbstract');

   /**
    * <wiTag page=11>
    * @class $ws.proto.TableView
    * @extends $ws.proto.DataViewAbstract
    * @control
    * @initial
    * <component data-component='SBIS3.CORE.TableView'>
    * <options name='display'>
    * <options name='columns' type='array'>
    * <options>
    *    <option name='title' value='поле1'></option>
    *    <option name='field' value='поле1'></option>
    *    <option name='width' value='114'></option>
    * </options>
    * <options>
    *    <option name='title' value='поле2'></option>
    *    <option name='field' value='поле2'></option>
    *    <option name='width' value='114'></option>
    * </options>
    * </options>
    * </options>
    * </component>
    * @category Table
    * @designTime plugin /design/DesignPlugin
    */
   $ws.proto.TableView = DataViewAbstract.extend(/** @lends $ws.proto.TableView.prototype */{
      /**
       * @event onBeforeRender Перед началом рендеринга
       * Происходит до отображения в таблице пришедших данных.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {Array} columns Текущий набор колонок.
       * @return {Boolean|Array|*} Если передать:
       * <ol>
       * <li>false – отмена отображения данных,</li>
       * <li>array – воспринимается как массив новых колонок для отображения, на экран будут выведены колонки,
       * соответствующие этому описанию,</li>
       * <li>любой иной тип данных – табличный браузер отобразит данные в соответствии с текущей конфигурацией.</li>
       * </ol>
       * @example
       * <pre>
       *    dataView.subscribe('onBeforeRender', function(event, columns){
       *       // если данных не достаточно, не будем их показывать
       *       if(this.getRecordsCount() <= 10)
       *          event.setResult(false);
       *       else {
       *          // усложненный пример как можно скрыть колонку "Примечание"
       *          var newColumns = [];
       *          for(var i = 0, l = columns.length; i < l; i++ ){
       *             if(columns[i].title !== 'Примечание')
       *                newColumns.push(columns[i]);
       *          }
       *          event.setResult(newColumns);
       *       }
       *    });
       * </pre>
       */
      /**
       * @cfg {Boolean} Автовысота
       * @name $ws.proto.TableView#autoHeight
       * @description
       * Будет ли контрол подстраиваться по высоте под своё содержимое.
       * <wiTag group="Отображение">
       * Возможные значения:
       * <ol>
       *    <li>true - контрол будет подстраиваться по высоте под своё содержимое.</li>
       *    <li>false - не будет подстраиваться по высоте.</li>
       * </ol>
       * @example
       * <pre>
       *     var dfr = attachInstance('SBIS3.CORE.TemplatedArea', {
       *        autoHeight: true,
       *        element: container,
       *        parent: this.getParent()
       *     });
       * </pre>
       * @see autoWidth
       */
      /**
       * @cfg {Boolean} Автоширина
       * @name $ws.proto.TableView#autoWidth
       * @description
       * Будет ли контрол подстраиваться по ширине под своё содержимое.
       * <wiTag group="Отображение">
       * Возможные значения:
       * <ol>
       *    <li>true - контрол будет подстраиваться по ширине под своё содержимое.</li>
       *    <li>false - не будет подстраиваться по ширине.</li>
       * </ol>
       * @example
       * <pre>
       *     var dfr = attachInstance('SBIS3.CORE.TemplatedArea', {
       *        autoWidth : true,
       *        element : container,
       *        parent : this.getParent()
       *     });
       * </pre>
       * @see autoHeight
       */
      /**
       * @event onResetColumnFilter При сбросе фильтрации по колонке
       * <wiTag page=2>
       * Происходит при изменении, сбросе параметра фильтрации, связанного с какой-либо колонкой, по которой ведётся
       * фильтрация в табличном браузере.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {Object} filter Устанавливаемые параметры фильтрации.
       * @param {String} name Имя сбрасываемого параметра фильтрации.
       * @param {String} title Имя колонки, по которой сбрасываем фильтр.
       * @return {Object|*} Принимаем переданный фильтр за тот, который должны установить. Любой иной тип – применяем
       * фильтр без параметра, связанного с колонкой сброса фильтра.
       * @Example
       * <pre>
       *    tableView.subscribe('onResetColumnFilter', function(event, filter, name, title){
       *       if(name == 'ТипДокумента')
       *          event.setResult(this.getQuery(true));
       *    });
       * </pre>
       */
      /**
       * @event onRecordUp При перемещении записи вверх
       * <wiTag page=11>
       * Событие, происходящее при перемещении записи на строку вверх. Работает при использовании порядковых номеров.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       */
      /**
       * @event onRecordDown При перемещении записи вниз
       * <wiTag page=11>
       * Событие, происходящее при перемещении записи на строку вниз. Работает при использовании порядковых номеров.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       */
      /**
       * @event onBeforeChangeOrder Перед изменением порядка записей
       * <wiTag page=11>
       * Событие, происходящее перед изменением порядка записей с помощью порядковых номеров.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param record {$ws.proto.Record} Запись, которую перемещаем.
       * @param recordAbove {$ws.proto.Record} Запись, над которой хотим вставить.
       * @param recordBelow {$ws.proto.Record} Запись, под которой хотим вставить.
       * @return {Boolean|*} Если передать false, то не изменяем порядок записи. Любой другой результат - изменяем порядок записи.
       * @example
       * При попытке переместить запись, значение поля "Категория" которой не совпадает со значениями этого поля записей,
       * между которыми хотим поместить перемещаемую запись, то запрещаем перемещение:
       * <pre>
       *    tableView.subscribe('onBeforeChangeOrder', function(event, record, recordAbove, recordBelow){
       *       if (recordAbove && recordBelow) {
       *          var category = recordBelow.get('Категория');
       *          if(category === recordAbove.get('Категория') && record.get('Категория') !== category) {
       *             event.setResult(false);
       *          }
       *       }
       *    });
       * </pre>
       */
      $protected: {
         _options: {
            display: {
               /**
                * @cfg {SBIS3.CORE.DataViewAbstract/Columns.typedef[]} Конфигурация колонок
                * [wiComment
                * <wiTag group="Отображение">
                * Описание отображаемых в табличном браузере колонок выборки.
                * А так же описанием того, как их нужно выводить.
                * Например:
                * <pre>
                * columns: [
                *    {
                *       // имя колонки, как его нужно вывести на экран
                *       title: 'Период',
                *
                *       // имя колонки, как оно пришло в наборе данных
                *       field: 'dtb',
                *
                *       // тип данных в столбце, как правило не указывается и проставляется по данным пришедшей выборки
                *       type: 'Дата и время',
                *
                *       // ширина столбца в px
                *       width: 100 px,
                *
                *       // выравнивание текста в ячейке: слева, справа, по центру или auto
                *       textAlign: 'center',
                *
                *       // выравнивание текста в заголовке столбца: слева, справа, по центру или auto
                *       // используте titleAlign, captionAlign в скором времени будет удалён
                *       captionAlign: 'center',
                *
                *       // выравнивание текста в заголовке столбца: слева, справа, по центру или auto
                *       titleAlign: 'center',
                *
                *       // имя класса, который будет указан у каждой ячейки столбца
                *       className: 'format-date-class',
                *
                *       // шаблон вывода данных в столбце
                *       // см. описание формата в $ws.helpers#format
                *       formatValue: '$dtb$ $%Y , &d$',
                *
                *       // Меняется ли ширина колонки при изменении размеров окна
                *       fixedSize: false
                *
                *       //Шаблон ячеек колонки
                *       cellTemplate: 'html!SBIS3.EDO.edoTemplate'
                *    },
                *    {
                *       title: 'Период',
                *       field: 'dte',
                *       width: 100 px'
                *    },
                *    {
                *       title: 'Сообщение',
                *       field: 'reccomment',
                *       width: 300 px
                *    }
                * ]
                * </pre>
                * В случае необходимости объединения нескольких колонок (ячеек шапки) указываем одинаковое выводимое имя
                * колонки у всех объединяемых столбцов.
                * Если каждая такая колонка требует своего собственного имени помимо общего, то пишем каждой колонке
                * выводимое имя как выводимоеОбщееИмя.выводимоеИмяДаннойКолонки.
                * wiComment]
                *
                * — <b>Фильтрация и сортировка</b>:
                * [wiComment <wiTag page=2 noInherit>
                * <wiTag class=CustomView group="Отображение" noInherit>
                * В описании каждого столбца могут быть добавлены следующие параметры:
                * <ol>
                * <li>isSortable - разрешена ли сортировка по данной колонке.</li>
                * <li>filterDialog - диалог фильтрации по данному столбцу.</li>
                * <li>filterName - имя параметра фильтрации, связанного с этим столбцом.</li>
                * <li>visualFilterFunction - функция отображения установленного фильтра, в качестве аргументов принимает
                * устанавливаемый фильтр.</li>
                * </ol>
                * wiComment]
                *
                * — <b>Пользовательские функции отображения</b>:
                * [wiComment <wiTag page=4 noInherit>
                * Для каждого столбца возможно задание следующих пользовательских функций:
                *
                * 1. render - имя обработчика отрисовки столбца, в качестве аргументов получает:
                *  - запись, отображение для которой строим;
                *  - имя поля;
                *  - объект colDef - дескриптор колонки.
                *  Если вернуть результат, то отобразится то, что вернули. Если отдать значение, то оно отобразится как строка в ячейке. Если вернуть undefined или null, то ячейка отобразится стандартным способом.
                *  Вернуть из функции можно только строку. Если вернуть объект-jQuery, то он автоматически преобразуется в строку.
                *  Таким образом, если хочется отрисовать какой-то контрол в ячейке, то необходимо в функции вернуть строку html, в которой будет описан контейнер для контрола, а непосредственно сам контрол строить в обработчике на готовность (onReady).
                * Пример:
                * <pre>
                *     render: function(record, fieldName, colDef){
                *        return ("span class='bold-text'>" + record.get(fieldName) + "</span>"); // (должен быть заранее описан соответствующий css класс)
                *     }
                * </pre>
                * 2. Отрисовка в колонке составных полей, имя колонки задано через разделитель "точка"
                * <pre>
                *    render: function(record, fieldName, colDef) {
                *       var
                *          fieldNames = fieldName.split('.'),
                *          result = null,
                *          node = record.get(fieldNames[0]);
                *       if (node && node.get('@Статус').valueOf() !== 4)
                *          result = node.get(fieldNames[1]);
                *       return result; // потенциально result может быть null
                *    }
                * </pre>
                * 2. captionRender - функция рендеринга заголовка столбца, в качестве аргументов получает имя колонки, отображение которой строим.
                * Пример:
                * <pre>
                *    captionRender : function(columnName) { // делаем текст заголовка жирным
                *       return $("<span class='bold-txt'>" + columnName + "</span>"); // (должен быть заранее описан соответствующий css класс)
                *    }
                * </pre>
                *  wiComment]
                *
                * — <b>Редактирование и добавление по месту</b>:
                * [wiComment <wiTag page=6 noInherit>
                * Для каждой колонки помимо ранее рассмотренных параметров могут быть заданы следующие опции:
                * <ol>
                * <li>allowEditAtThePlace - в этом столбце разрешено редактирование по месту.</li>
                * <li>validators - набор функций валидации введенного значения.</li>
                * <li>decimals - количество знаков после запятой (только для вещественного числа).</li>
                * </ol>
                * wiComment]
                * — <b>Итоги</b>:
                * [wiComment <wiTag page=8 noInherit> <wiTag class=HierarchyView page=1 noInherit>
                * Для каждой колонки помимо ранее рассмотренных параметров может быть задан признак:
                * isResultField - необходим ли подсчет итогов по этой колонке.
                * wiComment]
                *
                * Скрыть/показать колонку можно с помощью метода {@link toggleColumn}, полностью сменить набор колонок
                * методом {@link setColumns},а получить текущий набор методом {@link getColumns}.
                * @see toggleColumn
                * @see setColumns
                * @see getColumns
                */
               columns : [],
               /**
                * @cfg {Boolean} Использовать сортировку
                * <wiTag page=2 group="Управление">
                * <wiTag class="HierarchyView" group="Управление">
                * Разрешена ли сортировка хотя бы по одной из колонок или же запретить по всем.
                */
               useSorting: false,
               /**
                * @cfg {Boolean} Отображать черезполосицу
                * <wiTag group="Отображение">
                * При установленном флаге строки таблицы будут разделены серой линией.
                * <pre>
                *    tableView.zebraBody(true);
                * </pre>
                * @see zebraBody
                */
               hasZebra: true,
               /**
                * @cfg {Boolean} Обрезать длинные строки
                * <wiTag group="Отображение">
                * Если флаг установлен, то все данные ячейки будут выведены в одну строку без переноса слов.
                * В случае нехватки места в ячейке для отображения данных текст обрывается многоточием.
                * Возможные значения:
                * <ol>
                *    <li>true - обрезать длинные строки;</li>
                *    <li>false - не обрезать сроки (будет происходить увеличение высоты ячейки).</li>
                * </ol>
                */
               cutLongRows: false,
               /**
                * @cfg {Function} Функция рендеринга строки
                * <wiTag group="Управление" page=4>
                * Влияет на отображение строки таблицы.
                * В качестве аргументов принимает текущую запись, отображение которой строим, и соответствующий ей jQuery-элемент.
                * <pre>
                *    rowRender: function(record, row){
                *       if(record.get('Активен') !== true)
                *          row.addClass('employee-inactive');
                *    }
                * </pre>
                * Изменяется методом {@link setRowRender}
                * <pre>
                *    tableView.setRowRender(function(record, row){
                *       if(record.get('Активен') !== true)
                *          row.addClass('employee-inactive');
                *    );
                * </pre>
                * @see setRowRender
                */
               rowRender : '',
               /**
                * @cfg {Function} Функция рендеринга ячейки шапки
                * <wiTag group="Управление" page=4>
                * Изменяет отображение заголовка столбца.
                * На входе получит имя отображаемой колонки (будет выведено в качестве заголовка колонки).
                * Выполнится только если для этого столбца не задана функция рендеринга заголовка.
                * @return {string} Возвращает визуальное отображение заголовка колонки.
                * @example
                * <pre>
                *    headColumnRender: function(columnName){
                *       if(columnName == "Абонент")
                *          return '<div style="text-decoration: underline;">' + columnName + '</div>';
                *       else
                *          return columnName;
                *    }
                * </pre>
                * @see headRender
                * @group Head
                */
               headColumnRender : '',
               /**
                * @cfg {Boolean} Отображать заголовок
                * <wiTag group="Отображение">
                * Задает необходимость отображения заголовков столбцов таблицы.
                * @see headRender
                * @group Head
                */
               showHead: true,
               /**
                * @cfg {Function} Функция рендеринга шапки
                * <wiTag group="Управление" page=4>
                * Влияет на отображение заголовка таблицы в целом.
                * В качестве аргументов принимает jQuery-элемент, соответствующий заголовку таблицы.
                * @see showHead
                * @see headColumnRender
                * @group Head
                */
               headRender : '',
               /**
                * @cfg {Boolean} Отображать ли активную строку не в фокусе
                * <wiTag group="Управление" noShow>
                * @group Display
                */
               showActiveRowInFocus: true,
               /**
                * @cfg {Boolean} Отображать флаг выделения записи
                * <wiTag group="Управление">
                * При установленном флаге при отображении слева от каждой записи будет отображен флаг выбора (чекбокс)
                * для отметки записи.
                * @group Display
                */
               showSelectionCheckbox : false,
               /**
                * @cfg {Boolean} Отображать разделители
                * <wiTag group="Отображение">
                * Задает необходимость отображать разделители между колонками в шапке таблицы.
                * @group Display
                */
               useSeparating: false,
               /**
                * @cfg {Boolean} Отображать линии таблицы
                * <wiTag group="Отображение">
                * Задает необходимость отображать все границы таблицы и ее ячеек.
                * @group Display
                */
               useDrawingLines: false,
               /**
                * @cfg {String} Шаблон строки
                * <wiTag group="Отображение">
                * Позволяет задать собственный шаблон для строки таблицы
                * <pre>
                *    rowTemplate: 'html!SBIS3.EDO.EdoTemplate'
                * </pre>
                * @group Display
                */
               rowTemplate: ''
            }
         },
         //Параметры, задаваемые в конструкторе
         _columnMap : [],
         _bodyColumns: '',
         _headColumns: '',
         _highlight: '',                         //Что подсвечивать в браузере (пустая строка - ничего)
         _emptyDataScroller: undefined,          //Блок для отображения скролла при отсутствии данных
         _columnFilterMap: [],                   //Колонки на которых установлен фильтр
         _rowSelection: undefined,               //Элемент для выделения строк в новой теме
         _rowsMap: {},                           //Мап "первичный ключ" => хтмл-объект строки этой записи
         _colgroupCache: undefined,
         _markContainer: undefined,
         _selectAllCheckbox: undefined,          //Чекбокс выбора всех записей
         _selectAllCheckboxRow: undefined,       //Строка с чекбоксом выбора всех записей
         _showExtendedTooltipBinded: null,
         _hideExtendedTooltipBinded: null,
         _userColumnWidth: [],                   //Ширина колонок, заданная через метод _setColumns
         _columnMinWidthArray: [],               //Минимальная ширина каждой колонки
         _delegatedEventsCount: {},
         _cellTemplate: {},
         _rowOptionsSelector: '.ws-browser-table-row', //селектор для опций строки
         _rowOptionsContainer: 'ws-browser-row-options-container' //Класс для контейнера с опциями
      },
      _dotTplFn: dotTplFn,
      $constructor: function(){
         this._publish('onResetColumnFilter', 'onRecordUp', 'onRecordDown', 'onBeforeChangeOrder');
         this.subscribe('onFilterChange', $.proxy(this._onFilterChangeHandler, this));
         this.subscribe('onNewAction', $.proxy(this._onNewAction, this));
         this.subscribe('onAfterLoad', function(){
            if (this._needShowSelectionCheckbox() && this._selectAllCheckbox instanceof Object && 'jquery' in this._selectAllCheckbox) {
               this._selectAllCheckbox.toggleClass('ws-disabled', this._currentRecordSet.getRecordCount() === 0);
            }
         }.bind(this));
         var parentWindow = this.getParentWindow();
         if(parentWindow !== undefined) {
            this._container.addClass('ws-browser-in-dialog');
         }
      },
      _keyboardHover: function(e){
         var res = $ws.proto.TableView.superclass._keyboardHover.apply(this, arguments);
         if(this.isActive()) {
            if (!e.shiftKey) {
               if (e.ctrlKey && e.which === $ws._const.key.up) {
                  this._onRecordUpHandler();
               } else if (e.ctrlKey && e.which === $ws._const.key.down) {
                  this._onRecordDownHandler();
               }
            }
            if(this.isRowOptionsVisible() && this._options.useSelection && this._options.useHoverRowAsActive) {
               if(e.which === $ws._const.key.down || e.which === $ws._const.key.up) {
                  this._hideRowOptions();
               }
            }
         }
         return res;
      },
      _onNewAction: function(event, optionConfig){
         if(this._options.display.rowOptions){
            this.addRowOption(optionConfig);
         }
      },
      /**
       * Обработчик изменения фильтра браузера
       */
      _onFilterChangeHandler: function(event, filter){
         var id, colDef, filterName;
         if(!Object.isEmpty(this._options.display.columns)){
            for(var key in this._options.display.columns){
               if(this._options.display.columns.hasOwnProperty(key)){
                  if(this._options.display.columns[key].filterDialog){
                     colDef = this._options.display.columns[key];
                     filterName = colDef.filterName ? colDef.filterName : colDef.title;
                     if(filter[filterName]) {
                        this._columnFilterMap[filterName] = key;
                     } else{
                        delete this._columnFilterMap[filterName];
                        this._clearMarkColumnFilter(key, colDef.title);
                     }
                  }
               }
            }
         }
         if(this._columnMap.length > 0){
            for(var value in this._columnFilterMap){
               if(this._columnFilterMap.hasOwnProperty(value)){
                  if(filter[value]){
                     id = this._columnFilterMap[value];
                     this._markFilteredColumn(filter, id);
                  }
               }
            }
         }
      },
      setActive: function(active) {
         $ws.proto.TableView.superclass.setActive.apply(this, arguments);
         if(active && this._tooltipSettings.handleFocus && this._showExtendedTooltipBinded) {
            this._showExtendedTooltipBinded();
         }
      },
      /**
       * <wiTag group="Отображение">
       * Метод маркирует контрол, строку или ячейку в случае ошибки.
       * Если задан только message, то вызовется аналогичный метод предка.
       * Если заданы message и rowkey, то выделится указанная строка.
       * Если определены все параметры, то выделится указанная ячейка.
       * Не проводит валидацию.
       * @param {Array|String} message Сообщение об ошибке
       * @param {String} rowkey Первичный ключ записи
       * @param {String} columnName Название колонки
       */
      markControl: function(message, rowkey, columnName){
         if(rowkey && columnName) {
            this._markContainer = this._findCell(rowkey, columnName);
         } else if(rowkey) {
            this._markContainer = $(this.findRow(rowkey));
         } else {
            $ws.proto.TableView.superclass.markControl.apply(this, arguments);
            this._markContainer = this._container;
            return;
         }
         $ws.proto.TableView.superclass._createErrorMessage.apply(this, [message]);
         this._calcValidationErrorCount(message);
         this._markContainer.addClass('ws-TableView__redBorder-true');
         this._bindTooltips(this._markContainer, message);
      },
      _bindTooltips: function(container, message) {
         this._unbindTooltips();
         this._showExtendedTooltipBinded = this._showExtendedTooltip.bind(this, container, message);
         this._hideExtendedTooltipBinded = this._hideExtendedTooltip.bind(this, container);
         this._markContainer.bind('mouseenter', this._showExtendedTooltipBinded);
         this._markContainer.bind('mouseleave', this._hideExtendedTooltipBinded);
      },
      _unbindTooltips: function() {
         if(this._markContainer && this._markContainer !== this._container) {
            this._markContainer.unbind('mouseenter', this._showExtendedTooltipBinded);
            this._markContainer.unbind('mouseleave', this._hideExtendedTooltipBinded);
            this._showExtendedTooltipBinded = null;
            this._hideExtendedTooltipBinded = null;
         }
      },
      _showExtendedTooltip: function(container, message) {
         $ws.single.Infobox.show(container, message);
      },
      _hideExtendedTooltip: function(container) {
         if($ws.single.Infobox.isCurrentTarget(container)) {
            $ws.single.Infobox.hide();
         }
      },
      _getExtendedTooltipTarget: function() {
           return this._markContainer;
      },

      /**
       * <wiTag group="Отображение">
       * Снять отметку об ошибке.
       * Снимает с контрола маркировку ошибочного ввода.
       */
      clearMark : function(rowkey, columnName){
         this._unbindTooltips();
         var markContainer;
         if(rowkey && columnName) {
            markContainer = this._findCell(rowkey, columnName);
         } else if(rowkey) {
            markContainer = $(this.findRow(rowkey));
         } else {
            $ws.proto.TableView.superclass.clearMark.apply(this, arguments);
            this._body.find('.ws-TableView__redBorder-true').removeClass('ws-TableView__redBorder-true');
            this._markContainer = undefined;
            return;
         }
         if(markContainer) {
            markContainer.removeClass('ws-TableView__redBorder-true');
         }
      },
      /**
       * <wiTag group="Управление" page=2>
       * Очищает фильтр, связанный с указанным столбцом данных.
       * @param {String} columnName Название столбца
       * @example
       * <pre>
       *    tableView.resetFilterByColumnName("Фамилия");
       * </pre>
       */
      resetFilterByColumnName:function(columnName){
         var colDef = {}, id;
         if(columnName){
            for(var i = 0, len = this._columnMap.length; i < len; ++i){
               if(this._columnMap[i].title === columnName){
                  colDef = this._columnMap[i];
                  id = i;
                  break;
               }
            }
            if(!Object.isEmpty(colDef) && colDef.filterDialog){
               var filter = this.getQuery();
               if(filter[colDef.filterName || colDef.title]) {
                  delete filter[colDef.filterName || colDef.title];
               }
               var clearFilter = this._notify('onResetColumnFilter', filter, colDef.filterName || colDef.title, colDef.title);
               this.setQuery(clearFilter && Object.prototype.toString.call(clearFilter) == "[object Object]" ? clearFilter : filter);
               this._clearMarkColumnFilter(id, colDef.title);
            }
         }
      },
      _clearMarkColumnFilter: function(id, title){
         var filterLink = this._head.find('#'+id+'.ws-browser-head-link');
         $(filterLink).next('.ws-browser-filter').css('display', 'none');
         if(filterLink.html() !== title)
            filterLink.text(title);
      },
      /**
       * Меняет название колонки и добавляет иконку сброса
       * @param {Object} filter фильтр
       * @param {String} id номер колонки
       */
      _markFilteredColumn: function(filter, id){
         var renderResult,
             colDef = {},
             filterName,
             container;
         if(filter && id){
            renderResult = false;
            colDef = this._columnMap[id];
            filterName = colDef.filterName || colDef.title;
            container = this._head.find('#'+id+'.ws-browser-head-link');
            if(container.length > 0){
               // TODO проверить случай, когда функция что-то вернула а в фильтре - ничего
               if(colDef.visualFilterFunction)
                  renderResult = colDef.visualFilterFunction.apply(this, [filter]);
               if(!renderResult && colDef.title)
                  container.empty().append(colDef.title);
               if(filter[filterName]){
                  if(renderResult instanceof Object && 'jquery' in renderResult)
                     container.empty().append(renderResult);
                  else if(typeof(renderResult) === 'string')
                     container.html($ws.helpers.escapeHtml(renderResult));
                  else
                     container.text(filter[filterName]);
                  container.next('.ws-browser-filter').show();
               }
            }
         }
      },
      _bindHeaderEvents: function(){
         var self = this;

         if(self._head.length){
            $('.ws-browser-filter-trigger', this._head.get(0)).live('click', function(event){
               var colDef,
                   id,
                   $target = $(this);
               id = this.id ? this.id : $target.prev('.ws-browser-head-link').attr('id');
               colDef = self._columnMap[id];
               if($target.attr('hasFilter') === 'true')
                  self.createFiltersDialog.apply(self, [colDef.filterDialog, id]);
               else
                  self.resetFilterByColumnName.apply(self, [colDef.title]);
               event.preventDefault();
               event.stopPropagation();
               return false;
            });

            $('.ws-browser-head-hover', this._head.get(0)).live('click', { self: this }, this._headCellClick);
            // навешивать клик по чекбоксу в шапке имеет смысл только при наличии шапки
            self._selectAllCheckbox = $('.ws-browser-checkbox-holder', self._head.get(0));
            self._selectAllCheckboxRow = self._selectAllCheckbox.closest('.ws-browser-head-row');
            self._selectAllCheckbox.live('click', function(event){
               if (!self._selectAllCheckbox.hasClass('ws-disabled')) {
                  var isSelected = self._selectAllCheckboxRow.hasClass('ws-browser-selected');
                  if(!isSelected){
                     self.selectCurrentPage();
                  }else{
                     self.removeSelection();
                  }
                  self.setCheckboxState(!isSelected);
                  event.preventDefault();
                  event.stopPropagation();
               }
               return false;
            });
         }
      },
      _unbindHeaderEvents: function(){
         if (this._head.length){
            $('.ws-browser-filter-trigger', this._head.get(0)).die('click');
            $('.ws-browser-head-hover', this._head.get(0)).die('click');
            this._selectAllCheckbox.die('click');
         }
      },
      _useShowingFooter: function ( ) {
         return this._options.display.showRecordsCount || this._options.display.showPaging || this._needShowSelectionCheckbox();
      },
      _getHeadHtml: function ( ) {
         var headHtml, res;
         if (this._options.display.showHead) {
            res = this._renderHead();
            headHtml = [
               '<div class="ws-browser-head-container">',
                  '<div class="ws-browser-head-scroller">' ,
                     res.html,
                  '</div>',
               '</div>'].join('');

         } else {
            headHtml = '';
         }
         return headHtml;
      },
      /**
       * Создает основную структуру html браузера
       */
      _createContainer: function(){
         var containerStyles = this._getBrowserDataContainerStyles(),
             colgroup = this._renderColgroups();
         // tabindex равный -1 поставлен в данном блоке для фикса бага - FF3.6 Показывает лишний аутлайн + лишняя позиция табуляции при переходе с первого датавью-
         this._container.prepend(this._getResizerCode());
         this._container.find('.ws-browser-footer').get(0).innerHTML += this._createFooterArea();
         $ws.proto.TableView.superclass._createContainer.apply(this, arguments);

         this._browserContainer.find('colgroup').append(colgroup);
         if(containerStyles) {
            this._rootElement.css(containerStyles);
         }
         if (this._options.display.showHead) {
            this._head.get(0).innerHTML += this._prepareHeadTemplate(this._prepareHeadStruct());
            this._headContainer.find('colgroup').append(colgroup);
         }
         if(typeof(this._options.display.headRender) === 'function') {
            this._options.display.headRender.apply(this, [this._head]);
         }
         this._initHeadVariables();
         this._bindHeaderEvents();
      },
      _getBrowserDataContainerStyles: function() {
         //В браузере с относительным позиционированием (в новых сетках)
         //при растягивании блок данных должен быть абсолютным,
         //чтоб не распирать родительские блоки и сжиматься при уменьшении размеров контейнера
         if (this._options.isRelative && this._horizontalAlignment === 'Stretch') {
            return {
               position: 'absolute',
               top: 0,
               left: 0,
               right: 0
            };
         }
      },

      _getResizerCode: function() {
         //В браузере с относительным позиционированием (в новых сетках)
         //при гориз. растягивании и автовысоте нужен ресайзер,
         //поскольку блок данных с абсолютной вёрсткой (см. _getBrowserDataContainerStyles) не влияет на высоту контейнера.
         var result = '';
         if (this._options.isRelative && this._horizontalAlignment === 'Stretch' &&
            this._isHeightGrowable())
         {
            result = '<div class="ws-browser-resizer" style="position: relative"></div>';
         }
         return result;
      },

      _updateDataBlockSize: function(isExternalChange){
         if (!(isExternalChange && this._horizontalAlignment !== 'Stretch')) {
            this._setWidth(this._userColumnWidth);
         }
         this._updateSizeVariables();
      },
      /**
       * Обработчик ресайза окна
       */
      _onResizeHandler: function(){
         $ws.proto.TableView.superclass._onResizeHandler.apply(this, arguments);
         if(this.getActiveRow() !== false) {
            this._setSelection(this.getActiveRow(), true);
         }
      },
      _updateSelection: function(){
         $ws.proto.TableView.superclass._updateSelection.apply(this, arguments);
          if (this._options.useHoverRowAsActive && this.getActiveRow() !== false) {
             this._useKeyboard = false;
          }
      },
      /**
       * Дейтсвия перед отрисовкой браузера. Если вернём false, то отрисовка остановится
       * @returns {Boolean}
       */
      _onBeforeRenderActions: function(){
         var notifyResult;
         try {
            this._inBeforeRenderActionCnt++;
            notifyResult = this._notify('onBeforeRender', this.getColumns());
         } finally {
            this._inBeforeRenderActionCnt--;
         }

         if(notifyResult === false){
            this._hideLoadingIndicator();
            return false;
         }
         else if(notifyResult instanceof Object){
            this._options.display.columns = notifyResult;
            this._columnMap = [];
         }
         if(!this._currentRecordSet.getRecordCount() && this._hasRowOptions){
            //аккуратно скроем опции записи и больше ничего не будем трогать
            this._hideRowOptions();
         }
         return true;
      },
      _initActionsFlags: function(){
         $ws.proto.TableView.superclass._initActionsFlags.apply(this, arguments);
         this._actions['clearSorting'] = this._options.display.useSorting && $.proxy(this.clearSorting, this);
      },
      /**
       * <wiTag group="Данные">
       * Находит строчку с указанным ключом
       * @param {String} rowkey Первичный ключ записи
       */
      findRow: function(rowkey){
         var row =  this._rowsMap[rowkey] ? this._rowsMap[rowkey] : this._body.find('.ws-browser-table-row[rowkey="' + rowkey + '"]');
         if(!row || !row.length)
            $ws.single.ioc.resolve('ILogger').error("Browser", "Cannot find row with rowkey " + rowkey);
         return row;
      },
      /**
       * <wiTag group="Данные">
       * Есть ли указанная строка в браузере
       * @param {String} rowkey Идентификатор записи
       * @return {Boolean}
       */
      haveRow: function(rowkey){
         return !!this._rowsMap[rowkey];
      },
      /**
       * Возвращает индекс колонки, которая имеет определённое название
       * @param {String} name Название колонки
       * @param {String} searchProp Поле, по которому ищем название колонки (field или title)
       * @return {Number}
       * @protected
       */
      _columnIndex: function(name, searchProp){
         searchProp = searchProp || 'title';
         for(var i in this._columnMap){
            if(this._columnMap.hasOwnProperty(i) && this._columnMap[i][searchProp] === name)
               return i;
         }
         return -1;
      },
      /**
       * <wiTag group="Данные">
       * Находит ячейку с указанным ключом записи и названием колонки
       * @param {String} rowkey Первичный ключ записи
       * @param {String} columnName Название колонки
       * @return {jQuery}
       */
      findCell: function(rowkey, columnName){
         return this._findCell(rowkey, columnName, 'field');
      },
      /**
       * Находит ячейку с указанным ключом записи и названием колонки
       * @param {String} rowkey Первичный ключ записи
       * @param {String} columnName Название колонки
       * @param {String} searchProp Поле, по которому ищем название колоник (field или title)
       * @return {jQuery}
       */
      _findCell: function(rowkey, columnName, searchProp){
         var cellIndex = this._columnIndex(columnName, searchProp);
         if(cellIndex >= 0){
            return this.findRow(rowkey).children('.ws-browser-cell:eq(' + cellIndex + ')');
         }
         $ws.single.ioc.resolve('ILogger').error("Browser", "Cannot find column with name " + columnName);
         return $();
      },
      /**
       * Обработчик нажатия на заголовок браузера
       * @param {jQuery} event
       */
      _headCellClick: function(event){
         var $target = $(this),
             columnId = $target.attr('columnId'),
             self = event.data.self,
             field = self._columnMap[columnId].field,
             sortType = 0, //0 - по возрастанию, 1 - по убыванию, 2 - нету
             found = false,   //Найдена ли колонка в массиве
             sortable = $target.find('.ws-browser-sortable'),
             classNames = ['asc', 'desc', 'none'];

         for(var i = self._sortingStack.length - 1; i >= 0; --i){
            if(!self._sortingStack[i]){
               continue;
            }
            if(self._sortingStack[i]['field'] == field){
               found = true;
               sortType = ++self._sortingStack[i]['type'];
               if(sortType == 2)
                  delete self._sortingStack[i];
               break;
            }
         }
         if(!found)
            self._sortingStack.push({'field': field, 'type': 0});

         sortable.removeClass(classNames[(sortType + 2) % 3]);
         sortable.addClass(classNames[sortType]);

         if(self._currentRecordSet && self._currentRecordSet instanceof $ws.proto.RecordSet){
            var sorting = [];
            for(var c = 0, len = self._sortingStack.length; c < len; ++c){
               if(!self._sortingStack[c])
                  continue;
               sorting.push([self._sortingStack[c]['field'], self._sortingStack[c]['type'] > 0]);
            }
            self._currentRecordSet.setPage(0, true);
            self._currentRecordSet.setSorting(sorting, self.getQuery(), self.isHierarchyMode());
         }
      },
      /**
       * Устанавливает нужную ширину таблиц,
       * необходимо переопределить в плагинах
       * @param {String} tablesWidth ширина таблиц
       * @private
       */
      _setTablesWidth: function (tablesWidth) {
      },
      /**
       * Изменение ширин столбцов
       *
       * @param {Array} [newWidths] массив новых ширин столбцов
       * если newW[i] = 'byValue', то столбец выравнивается по содержимому
       */
      _setWidth: function(newWidths){
         var self = this,
            maxIndx = -1,
            maxVal = 0,
            sum = 0,
            rootWidth = 0,
            nullCols = [],
            cols = [],
            nonPercentCols = [],
            nonFixedCols = [],
            tablesWidth,
            haveSelectionCheckbox = this._needShowSelectionCheckbox(),
            selectionCheckboxWidthAdd = haveSelectionCheckbox ? $ws._const.Browser.selectionCheckboxWidth : 0,
            userColW = (this._userColumnWidth && this._userColumnWidth.length > 0) ? this._userColumnWidth : undefined,
            newW = (newWidths && newWidths.length > 0) ?  newWidths : undefined;

         if (newW !== undefined) {
            this._userColumnWidth = newW.slice();
         }
         else if (userColW) {
            newW = userColW;
         }

         if(newW){
            $ws.helpers.forEach(newW, function(width, i) {
               if (newW[i] == "byValue") {
                  newW[i] = this._columnMinWidthArray[i];
               }
            }, this);
         }

         if (this._columnMap.length === 0)
            return;

         function getMinWidth(colIdx) {
            var type = self._columnMap[colIdx].type,
                minWidth = self._columnMap[colIdx].minWidth,
                defColWidth = $ws._const.Browser.defColWidth,
                defMinWidth = type in defColWidth ? defColWidth[type] : defColWidth['another'];

            return parseInt(minWidth !== null ? minWidth : defMinWidth, 10);
         }

         if(!this._haveAutoWidth()){
            //Вычитаем 1 для лечения глюка IE, который иногда думает, что ему не хватает места в
            // родительском блоке _rootElement, и добавляет прокрутку
            // а также для Chrome 37, который плохо считает ширины...
            rootWidth = Math.max(0, self._rootElement.width() - (this._getVerticalScrollShowed() ? this._scrollWidth : 0) - ($.browser.msie || $ws._const.browser.chrome ? 1 : 0) - selectionCheckboxWidthAdd);

            tablesWidth = Math.max(rootWidth + selectionCheckboxWidthAdd, this._options.minWidth) + 'px';

            if (this._head) {
               this._head.closest('table').width(tablesWidth);
            }

            this._data.width(tablesWidth);

            this._setTablesWidth(tablesWidth);

            if(newW){
               $ws.helpers.forEach(newW, function(width, idx) {
                  this._headColumns.eq(idx).attr('width', width);
                  this._bodyColumns.eq(idx).attr('width', width);
               }, this);
            }
            else{
               newW = [];
               if(this._bodyColumns){ // TODO: проверка на существование колонок шапки, если их нет, то событие onResize сработало раньше, чем построился браузер
               // Считаем ширины колонок шапки, переводим % в px
                  this._bodyColumns.each(function(i){
                     var existsInMap = self._columnMap && self._columnMap[i],
                         w = (existsInMap && self._columnMap[i].width) || 0,
                         isFixed = existsInMap ? self._columnMap[i].fixedSize : true;

                     cols.push($(this));
                     // IE8 и WebKit не отдают нам вычисленную ширину колонки. Считаем сами.
                     if(typeof(w) != 'number'){
                        if(w.indexOf('%') > 0)
                           w = Math.floor((rootWidth * parseInt(w, 10)) / 100);
                        else if(!existsInMap || !isFixed){
                           nonPercentCols.push(i);
                        }
                     }
                     else if(existsInMap && !isFixed){
                        nonPercentCols.push(i);
                     }
                     if(existsInMap && !isFixed){
                        nonFixedCols.push(i);
                     }

                     w = parseInt(w, 10);
                     if (!w){
                        if(existsInMap && isFixed){
                           throw new Error('Column with fixed size option must have width');
                        }
                        nullCols.push(i);
                     }

                     //Ширина не должна быть меньше минимальной
                     w = Math.max(w, isFixed ? $ws._const.Browser.minColumnWidth : getMinWidth(i));
                     newW[i] = w;
                     sum += w;

                     // Ищем самую жирную колонку. За ее счет потом будем исправлять ошибку вычилений/округлений
                     if(w > maxVal) {
                        maxVal = w;
                        maxIndx = i;
                     }
                  });
               }

               if(sum > rootWidth && nonFixedCols.length){
                  var diff = sum - rootWidth,
                     freeSpace = 0;

                  var enumerateNonFixed = function(callback) {
                     $ws.helpers.forEach(nonFixedCols, function(nonFixedCol) {
                        if (nonFixedCol in newW) {
                           var minWidth = getMinWidth(nonFixedCol);
                           callback(nonFixedCol, minWidth, minWidth - newW[nonFixedCol]);
                        }
                     });
                  };

                  enumerateNonFixed(function(nonFixedCol, minWidth, minWidthDiff) {
                     if(minWidthDiff >= 0)
                        diff += minWidthDiff;
                     else
                        freeSpace += (-minWidthDiff);
                  });

                  enumerateNonFixed(function(nonFixedCol, minWidth, minWidthDiff) {
                     var oldWidth = newW[nonFixedCol],
                         newWidth = (minWidthDiff >= 0) ? minWidth :
                                     Math.max(oldWidth + diff * (minWidthDiff / freeSpace), minWidth); //Нельзя уменьшать ниже minWidth

                     sum += (newWidth - oldWidth);//корректируем общую сумму
                     newW[nonFixedCol] = newWidth;
                  });
               }

               //раздача лишнего места
               var giveBonus = function(cols) {
                  var bonusW = cols.length > 0 ? Math.floor((rootWidth - sum) / cols.length) : 0;
                  if (bonusW > 0) {
                     $ws.helpers.forEach(cols, function(col) { newW[col] += bonusW; });
                     sum += bonusW * cols.length;
                  }
               };
               giveBonus(nullCols.length ? nullCols : nonPercentCols);

               // Подправим ошибку вычислений за счет самой жирной колонки
               if(rootWidth > sum) {
                  newW[maxIndx] += rootWidth - sum;
               }

               // Сделаем ресайз всех колонок. И в шапке и в теле таблицы
               if(this._bodyColumns){
                  $ws.helpers.forEach(cols, function(col, idx) {
                     col.attr('width', newW[idx]);
                     this._headColumns.eq(idx).attr('width', newW[idx]);
                  }, this);
               }

               if(this._options.display.allowHorizontalScroll && this._emptyDataScroller) {
                  this._emptyDataScroller.width(sum);
               }
            }
         } else {
            // autoSize
            this._data.removeClass('ws-table-fixed').width('auto').css({'table-layout': 'auto'});
            this._head.parent().width('1px').css({'table-layout': 'auto'});
            this._browserContainer.width('auto');
            if(!newW){
               newW = $ws.helpers.map(this._columnMap, function(col) { return col.width; });
            }
            var td_data = this._data.find('.ws-browser-table-row:eq(0) .ws-browser-cell'),
                td_header = this._head.find('.ws-browser-table-row:eq(0) .ws-browser-cell'),
                dfContainer = this._container.find('.ws-browser-footer');

            $ws.helpers.forEach(newW, function(_, i) {
               self._bodyColumns.eq(i).attr('width', '');
               self._headColumns.eq(i).attr('width', '');
            }, this);

            var totalWidth = 0, isEmptyTable = this._currentRecordSet && this._currentRecordSet.isEmptyTable();
            // фиксированным колонки оставляем установленный им размер, остальным ставим авто-размер.
            $ws.helpers.forEach(newW, function(_, i) {
               var value, isFixed = this._columnMap[i] && this._columnMap[i].fixedSize;
               if (isFixed || isEmptyTable) {
                  value = isFixed ? newW[i] : (newW[i] || getMinWidth(i));
               }
               else{
                  value = Math.max(td_data.eq(i).outerWidth(), td_header.eq(i).outerWidth());
                  if(this._columnMap[i])
                     this._columnMap[i].width = value = parseInt(value, 10);
               }
               totalWidth += value;
            }, this);

            // установка "авто-ширин"
            $ws.helpers.forEach(this._columnMap, function(col, i) {
               this._headColumns.eq(i).attr('width', col.width);
               this._bodyColumns.eq(i).attr('width', col.width);
            }, this);

            var realMinWidth = this._options.minWidth,
               flagMinSize = false;
            if(this._getVerticalScrollShowed()){
               realMinWidth -= this._scrollWidth;
            }
            if(totalWidth < realMinWidth){
               flagMinSize = true;
               totalWidth = realMinWidth;
            }
            var headWidth = totalWidth;
            if(this._getVerticalScrollShowed()){
               headWidth += this._scrollWidth;
            }
            this._data.width(totalWidth);
            this._browserContainer.width(headWidth);
            this._head.parent().width(headWidth);
            dfContainer.width(headWidth);
            this._container.width('auto');
            this._rootElement.width(headWidth);
            if(flagMinSize){
               // переустановка ширин столбцов
               $ws.helpers.forEach(this._columnMap, function(col, i) {
                  if(!col.fixedSize){
                     this._bodyColumns.eq(i).attr('width', '');
                  }
               }, this);

               $ws.helpers.forEach(this._columnMap, function(col, i) {
                  var width = td_data.eq(i).outerWidth();
                  if(!col.fixedSize){
                     col.width = width;
                  }
                  this._bodyColumns.eq(i).attr('width', width);
                  this._headColumns.eq(i).attr('width', width);
               }, this);

               this._head.parent().width(headWidth);
            }
            this._data.addClass('ws-table-fixed').css({'table-layout': 'fixed'});
            this._head.parent().addClass('ws-table-fixed').css({'table-layout': 'fixed'});
        }
      },
      _getBodyContainer: function() {
         return $('<tbody class="ws-browser-body"/>');
      },
      _drawBodyCycle: function(){
         this._count = 0;
         var self = this;
         self._createRecordsTemplate(self._currentRecordSet.getRecords()).addCallback(function(tableBody) {

            /*
             http://stackoverflow.com/questions/5805956/internet-explorer-9-not-rendering-table-cells-properly
             баг ие9 и jQuery, если вставлять много чистого html текста
             */
            if ($ws._const.browser.isIE9) {
               //Этот регэксп убирает пробелы между всеми табличными элементами(table, caption, colgroup, col, tbody, thead, tfoot, tr, td, th)
               tableBody = tableBody.replace(/>\s+(?=<\/?(t|c)[hardfob])/gm,'>');
            }
            // var nowCount = this._body.children().size();
            self._body.remove();
            self._body = self._getBodyContainer();
            self._body.html(tableBody);

            self._applyRowRender(self._currentRecordSet, self._body);
            if (self._options.display.allowHorizontalScroll)
               self._emptyDataScroller.toggleClass('ws-hidden', !self._count);

            self._data.append(self._body);
            return tableBody;
         });
      },
      _createRecordsTemplate: function(records){
         var record,
            odd,
            key,
            colDef = {},
            classFromType,
            data = '',
            title = '',
            visibleId = 0,
            dataObject = {
               columns : [],
               data: [],
               keys: [],
               classes: [],
               title: [],
               checkbox: this._needShowSelectionCheckbox()
            },
            dReady = new $ws.proto.Deferred(),
            userTemplate = this._options.display.rowTemplate || [],
            isRowTemplate = true,
            useWidthByValue = false, //В одной из колонок используется ширина по содержимому
            i, l = this._columnMap.length;
         for(i = 0; i < l; i++){
            colDef = this._columnMap[i];
            classFromType = "";
            if(colDef.textAlign === 'auto' && $ws._const.Browser.type2ClassMap[colDef.type]) {
               classFromType = " ws-browser-type-" + $ws._const.Browser.type2ClassMap[colDef.type];
            }
            //Если задан шаблон для ячейки и строки, то будет выполняться шаблон для строки
            if(colDef.cellTemplate && Array.isArray(userTemplate)) {
               if(isRowTemplate) {
                  isRowTemplate = false;
               }
               userTemplate.push(colDef.cellTemplate);
               this._cellTemplate[colDef.field] = true;
            }
            dataObject.columns.push({
               textAlign: colDef.textAlign,
               fieldName: colDef.field,
               textVerticalAlign: colDef.textVerticalAlign,
               type: colDef.type,
               className: colDef.className + classFromType,
               render: colDef.render ? true : false,
               highlight: colDef.highlight ? true : false,
               cellTemplate: colDef.cellTemplate && !isRowTemplate ? true : false
            });
         }

         var minColumnWidth = {};
         this._columnMinWidthArray = null;

         for (var iRec = 0, len = records.length; iRec < len; iRec++) {
            record = records[iRec];
            odd = this._options.display.hasZebra ? (visibleId % 2) : true;
            key = record.getKey();
            if(typeof key == 'string') {
               key = key.replace(/'/g, "&#039;");
            }
            dataObject.keys.push(key);
            dataObject.classes[visibleId] = '' + (odd ? '' : ' rE');
            if(this._selected[key] !== undefined){
               dataObject.classes[visibleId] += " ws-browser-selected";
            }
            dataObject.data[visibleId] = [];
            for(i = 0; i < l; i++){
               colDef = this._columnMap[i];
               data = this._renderTD(colDef, record);

               if (colDef.width === 'byValue') {
                  useWidthByValue = true;
                  var dataWidth = $ws.helpers.getTextWidth(data);
                  if (minColumnWidth[colDef.title] !== undefined){
                     if (minColumnWidth[colDef.title] < dataWidth) {
                        minColumnWidth[colDef.title] = dataWidth;
                     }
                  }
                  else {
                     minColumnWidth[colDef.title] = dataWidth;
                  }
               }

               if(this._options.display.cutLongRows){
                  dataObject.title[visibleId] = dataObject.title[visibleId] || [];
                  title = data;
                  if(typeof title == 'string') {
                     title = data.replace(new RegExp("<(?=\/*(?:))[^>]+>", "g"), " ")
                           .replace( /\s\s+/g, ' ' )
                           .replace(/'/g, "&#039;").trim();
                  }
                  dataObject.title[visibleId].push(title);
               }
               dataObject.data[visibleId] = dataObject.data[visibleId] || [];
               dataObject.data[visibleId].push(data);
            }
            visibleId++;
         }
         this._count += visibleId;
         if (useWidthByValue) {
            this._columnMinWidthArray = $.map(minColumnWidth, function(value,key) {
               var keyWidth = $ws.helpers.getTextWidth(key);
               value += $ws._const.TableView.tableRowPadding * 2;
               if (value < keyWidth){
                  value = keyWidth;
               }
               return [value];
            });
         }
         if((typeof userTemplate === 'string' && userTemplate) || (!isRowTemplate && userTemplate.length)) {
            $ws.require(userTemplate).addCallbacks(function (arr) {
                  if(!isRowTemplate) {
                     //корректно для каждой колонки пропишем соответствующий шаблон
                     var count = 0;
                     for(var i in this._cellTemplate) {
                        if(this._cellTemplate.hasOwnProperty(i) && arr[count]) {
                           this._cellTemplate[i] = arr[count];
                           count++;
                        }
                     }
                  }
                  dReady.callback(isRowTemplate ? this._applyTemplate(arr[0], dataObject) : this._applyTemplate(dotTplFnForRow, dataObject));
               }.bind(this),
               function (e) {
                  $ws.single.ioc.resolve('ILogger').log('Ошибка при загрузке модуля ' + userTemplate + ': ' + e.message);
            });
            return dReady;
         }
         return dReady.callback(this._applyTemplate(dotTplFnForRow, dataObject));
      },
      /**
       * Поддерживаем возможность использовать пользовательские шаблона
       * @param tpl Шаблон
       * @param options Опции для шаблона
       * @private
       */
      _applyTemplate: function(tpl, options) {
         var fieldName = options && options.fieldName;

         //Если шаблон не передан, и есть шаблоны для колонок, то будем работать с ними
         if(!tpl && fieldName && this._cellTemplate[fieldName] && typeof this._cellTemplate[fieldName] === 'function') {
               return this._cellTemplate[fieldName](options);
         } else if(tpl && options) {
            return tpl(options, this);
         } else {
            $ws.single.ioc.resolve('ILogger').log('Указан ошибочный шаблон');
         }
      },
      _applyRowRender: function(recordSet, container){
         //поддерживаем пользовательские функции рендеринга
         var rowRender = typeof(this._options.display.rowRender) == 'function' ? this._options.display.rowRender : false,
             record;
         if(rowRender){
            var collection = container.find('.ws-browser-table-row'),
                  tr;
            for(var j = 0, cnt = collection.length; j < cnt; j++){
               tr = $(collection[j]);
               record = recordSet.getRecordByPrimaryKey(tr.attr('rowkey'));
               if(rowRender)
                  rowRender.apply(this, [record, tr]);
            }
         }
      },
       /**
        * <wiTag group="Управление">
        * В основе метода лежит стандартный механизм делегирования событий JavaScript.
        * Метод позволяет прикрепить функцию обработчик к одному или нескольким событиям для всех элементов,
        * соответствующих определённому селектору, указанному в первом параметре метода.
        * Метод реализуется как для существующих, так и для будущих элементов.
        * @param selector Селектор для поиска элементов, на которые будет установлен заданный обработчик событий.
        * @param event Обрабатываемое событие.
        * @param handler Функция обработчик.
        * @param [data] Данные, передаваемые обработчику событий.
        * @example
        * <pre>
        *     //в одной из колонок браузера навешан css класс ('.show-full-log-on-click')
        *     var browser = this.getChildControlByName("СписокЛогов");
        *     //селектором является css класс, обрабатываем клик
        *     browser.delegateUserEvent('.show-full-log-on-click', 'click', function() {
        *        //функция обработчик
        *        var self = $(this);
        *        $ws.helpers.showFloatArea({
        *           target: self.getContainer(),
        *           animation: 'fade',
        *           template: 'Шаблон просмотр полного сообщения лога',
        *           handlers: {
        *              onAfterShow: function() {
        *                 //у элемента с этим селектором есть атрибут ('full-val') с логом
        *                 this.getChildControlByName("ПолныйТекст").setContent(self.attr('full-val'));
        *              }
        *           }
        *        });
        *     });
        * </pre>
        */
      delegateUserEvent: function(selector, event, handler, data) {
         this._useDelegateUserEvent(true,selector, event, handler, data);
      },
      /**
       * <wiTag group="Управление">
       * Удаление обработчика событий
       * @param selector
       * @param event
       * @param handler
       */
      undelegateUserEvent: function(selector, event, handler) {
         this._useDelegateUserEvent(false,selector, event, handler);
      },
      /**
       * Установка\удаление обработчика событий
       * @param {Boolean} setEvent - определяет устанавливаем обработчик события или удаляем его
       * @param selector
       * @param event
       * @param handler
       * @param data
       */
      _useDelegateUserEvent: function (setEvent,selector, event, handler, data){
         if(typeof selector !== 'string' || selector === '')
            throw new TypeError("delegateUserEvent: Selector must be a non-empty string");
         if(typeof handler != 'function')
            throw new TypeError("delegateUserEvent: Handler must be a function");
         if(typeof event != 'string' || event === '')
            throw new TypeError("delegateUserEvent: Event name must be a non-empty string");

         var self = this,
            collection = this._container.find('.ws-browser-container .ws-browser');
         if (setEvent) {

            this._delegatedEventsCount[selector] = 1;

            if (Object.keys(this._delegatedEventsCount).length > MAX_DELEGATED_SELECTORS) {
               $ws.single.ioc.resolve('ILogger').error(
                  'TableView ' + this.getName(),
                  'Потенциальная проблема производительности! ' +
                  'На данном табличном браузере делегирована обработка слишком большого числа различных селекторов!');
            }

            if (event === 'click') {
               handler._rowSelect = function (e) {
                  // перед пользовательским кликом нужно вызвать обработчик выбора зиписи в таблице
                  self._rowSelect.apply(this, arguments);
                  // чтобы обработчик не вызывался 2-й раз в собственном delegate
                  e._rowSelect = true;
                  return handler.apply(this, arguments);
               };
            }
            collection.delegate(selector, event, data, handler._rowSelect ? handler._rowSelect : handler);
         }
         else {
            collection.undelegate(selector, event, handler._rowSelect ? handler._rowSelect : handler);
         }
      },
      /**
       * Применяет все рендеры к данным выводимым в столбце
       * @param {Object} colDef определение типа колонки
       * @param {$ws.proto.Record} record запись по которой отрисовывается строка
       * @return {String|jQuery} отрендеренные данные
       */
      _renderTD: function(colDef, record){
         var data = record.hasColumn(colDef.field) ? record.get(colDef.field) : "";
         return this._prepareColumnData(colDef, data, record);
      },
      _prepareColumnData: function(colDef, fieldValue, record){
         var data = null;
         if(typeof(colDef.render) === 'function'){
            data = colDef.render.apply(this, [ record, colDef.field, colDef ]);
            if(data instanceof Object && "jquery" in data){
               data = $ws.helpers.jQueryToString(data);
            }
            //Да, сначала из jQuery в String, а потом все равно вырежем script
            if (typeof(data) === 'string')
               data = $ws.helpers.escapeTagsFromStr(data, ['script']);
            if(data === null){ // пустое значение должно выводиться пустым, а не "null"
               data = '';
            }
         }
         //Рисуем значение в столбце по-умолчанию если не задана функция отрисовки, либо задана, но из нее вернули undefined
         if(!colDef.render || data === undefined) {
            if((data = fieldValue)!== null){
               if(typeof(data) === 'string' && !colDef.render) {
                  data = $ws.helpers.escapeHtml(data);
               }
               if (colDef.formatValue) {
                  data = $ws.helpers.format(record, colDef.formatValue);  //Альтернативный формат времени
               }
               else{
                  switch (colDef.type){
                     case 'Перечисляемое':
                        data = $ws.render.defaultColumn.enumType(data);
                        break;
                     case "Деньги":
                        data = $ws.render.defaultColumn.money(data);
                        break;
                     case "timestamp":
                     case "timestamptz":
                     case "interval":
                     case "date":
                     case "Дата":
                     case "Дата и время":
                     case "Время":
                        data = $ws.render.defaultColumn.timestamp(data, colDef.type); // формат времени
                        break;
                     case "oid":
                     case "int2":
                     case "int4":
                     case "int8":
                     case "Число целое":
                        data = $ws.render.defaultColumn.integer(data); // формат числа
                        break;
                     case "boolean":
                     case "bool":
                     case "Логическое":
                        data = $ws.render.defaultColumn.logic(data, true);  //формат чекбокса возвратит span для true
                        break;
                     case "Флаги":
                        data = $ws.render.defaultColumn.flags(data);
                        break;
                     case "":
                        break;
                     default:
                        break;
                  }
               }
               data = this._highlightData(data);
            } else {
               data = "";//Чтобы в title не проставился undefined
            }
         }
         return data;
      },
      /**
       * Производит замену в указанном тексте
       * @param {String} data Текст, в котором могут встречаться слова для подсветки
       */
      _highlightData: function(data){
         if(this._highlight && data && typeof(data) === 'string')
            data = data.replace(new RegExp(this._highlight, 'gi'), '<span class="ws-browser-highlight">$&</span>');
         return data;
      },
      _prepareHeadStruct: function() {
         var max = 0, // количество столбцов
               head = [],
               i, j = -1,
               cs, rs,
               columnsCount = 0,
               csIndex = 0;
         for (i in this._columnMap){
            if(this._columnMap.hasOwnProperty(i)){
               head[++j] = [];
               columnsCount++;
               var curr = this._columnMap[i].title,
                     count = 0;
               do{//Заполняем массив заголовков. Записываем, учитывая иерархию все имена столбцов
                  /^([^\.]*)(\.?(.*)$|$)/.exec(curr);
                  if(RegExp.$3){
                     if(RegExp.$3.substr(0,1) === " " && (RegExp.$1.charAt(RegExp.$1.length - 1) !== '\\')){
                        var columnName = RegExp.$1 + ". ";
                        /^([^\.]*)(\.?(.*)$|$)/.exec(RegExp.$3);
                        columnName += RegExp.$1;
                        head[j].push({ title: columnName });
                        curr = RegExp.$3;
                     } else {
                        head[j].push({ title: RegExp.$1 });
                        curr = RegExp.$3;
                     }
                  }
                  else{
                     head[j].push({ title: RegExp.$1 + RegExp.$2 });
                     curr=null;
                  }
               } while (curr);
               /*Возвращаем экранированные точки по принципу замены последнего '\\' в кусочке head[j]*/
               count = 0;
               while (count <= head[j].length - 1){
                  var currTitle = head[j][count].title;
                  if (currTitle !== ''){
                     head[j][count].title = head[j][count].title.replace(/\\\\\\./g,'\\.');//Ставим \.
                     if (head[j][count].title === '\\\\.'){
                        head[j][count].title = '\.';//ставим сразу .
                     }
                     else{
                        if (currTitle.charAt(currTitle.length - 1) === '\\' && //Соединяем так как это не разделитель . а просто .
                              currTitle.charAt(currTitle.length - 2) === '\\'){
                           head[j][count].title = head[j][count].title.replace(/\\\\$/,'.');
                           head[j][count].title += head[j][count + 1].title;
                           head[j].splice(count + 1, 1);
                           count--;
                        }
                        else if (count === head[j].length -1 )
                              head[j][count].title = head[j][count].title.replace('\\\\.','\.');
                     }
                  }
                  count++;
               }
               //Внимание! нет проверки на последний \\ в массиве head[j]
               max = head[j].length > max ? head[j].length : max; //Считаем макс. кол-во колспанов/ровспанов или типа того
            }
         }

         for (var n = 0; n < max; n++){
            j = -1;
            for (i in this._columnMap){
               if(this._columnMap.hasOwnProperty(i)){
                  var colDef = this._columnMap[i];
                  ++j;
                  var currentHead = head[j][n],
                        prevTitle = j !== 0 && head[j - 1] && head[j - 1][n] ? head[j - 1][n].title : undefined;
                  if (currentHead !== undefined && (j === 0 || (currentHead.title != prevTitle) )){
                     var nextTitle = head[j][n].title;
                     for (cs = j; cs < columnsCount && (head[cs] !== undefined) && nextTitle == currentHead.title; cs++) {
                        nextTitle = head[cs+1] && head[cs+1][n] ? head[cs+1][n].title : undefined;
                     }
                     cs--;
                     for (rs = n + 1; rs < max && head[j][rs] === undefined; rs++) {/*empty*/}
                     rs--;

                     if (cs > j)
                        csIndex += cs - j + 1;
                     else
                        csIndex++;

                     var colName = "";
                     for(var k = 0; k <= n; k++){
                        colName += (k === 0 ? "" : "." ) + head[j][k].title;
                     }

                     currentHead.csIndex = csIndex;
                     currentHead.columnId = i;
                     currentHead.rs = rs;
                     currentHead.cs = cs;
                     currentHead.colspan = cs - j + 1;
                     currentHead.rowspan = rs - n + 1;
                     currentHead.colName = colName;
                     if(typeof(this._columnMap[i].captionRender) == 'function'){
                        currentHead.content = this._columnMap[i].captionRender.apply( this, [ colName ] );
                     } else if(typeof(this._options.display.headColumnRender) == 'function'){
                        currentHead.content = this._options.display.headColumnRender.apply( this, [ colName ] );
                     }
                     currentHead.content = currentHead.content || currentHead.title;
                     currentHead.filterVis = colDef.title;
                     currentHead.hasFilter = false;
                     if(this._initialFilter) {
                        var filterName = colDef.filterName || colDef.title;
                        if(this._initialFilter[filterName]) {
                           currentHead.hasFilter = true;
                           if(colDef.visualFilterFunction)
                              currentHead.filterVis = colDef.visualFilterFunction.call(this, this._initialFilter);
                           else
                              currentHead.filterVis = this._initialFilter[filterName];
                        }
                     }
                  }
               }
            }
         }
         return [ head, max ];
      },
      _prepareHeadTemplate: function(headData) {

         if(!headData || headData.length != 2){
            return '';
         }

         var max = headData[1];
         var head = headData[0];
         var j;
         var result = [];
         var hasColSpan = false,
             showSelectionCheckbox = this._needShowSelectionCheckbox(),
             useDrawingLines = this._options.display.useDrawingLines;

         for (var n = 0; n < max; n++){
            result.push("<tr class='ws-browser-head-row ws-browser-head-", (n === 0 ? 'top' : 'bottom'), "'>");
            j = -1;
            if (showSelectionCheckbox) {
               var useCheckbox = (n + 1 === max);
               result.push(['<td class="',
                                (useCheckbox ? 'ws-browser-checkbox-holder' : ''),
                                (useDrawingLines ? ' ws-browser-checkbox-border' : ''),
                            '"', (useCheckbox ? 'title="Отметить всю страницу"' : '') ,'>',
                                   (useCheckbox ? '<span class="ws-browser-checkbox"></span>' : ''),
                            '</td>'].join(''));
            }
            for (var i in this._columnMap){
               if(this._columnMap.hasOwnProperty(i)){
                  ++j;
                  var currentHead = head[j][n];
                  if (currentHead !== undefined && (j === 0 || currentHead.title != (head[j - 1][n] && head[j - 1][n].title))){
                     var
                        rs = currentHead.rs,
                        cs = currentHead.cs,
                        csIndex = currentHead.csIndex,
                        columnId = currentHead.columnId,
                        contentText = $ws.helpers.escapeHtml(currentHead.content);
                     if(currentHead.colspan > 1){
                        hasColSpan = true;
                     }
                     result.push([
                        "<td columnId='", columnId, "' csIndex='", csIndex, "' class='" , [
                           'ws-browser-header-cell',
                           ( useDrawingLines ? 'ws-header-cell-bottom-border' : ''),
                           ( j === 0 && useDrawingLines && !showSelectionCheckbox ? 'ws-header-cell-left-border' : ''),
                           ( this._columnMap[j] ? 'ws-browser-valign-' + this._columnMap[j].titleVerticalAlign  : '' ) ,
                           ( this._options.display.useSorting && rs + 1 == max && this._columnMap[i].isSortable ? 'ws-browser-head-hover' : '') ,
                           ( (cs > j && (currentHead.title !== this._columnMap[i].title)) ?
                              contentText.length !== 0 ?
                                 'ws-browser-auto ws-browser-head-border-' + (n ? 'top' : 'bottom') : ""
                              : 'ws-browser-' + this._columnMap[i].titleAlign),
                           ( cs == j && this._columnMap[i].type == "text" ? 'ws-browser-text' : ''),
                           ( this._options.display.useSeparating === true && j < (head.length - 1) ? 'ws-browser-separatable' : '' ),
                           ( n > 0 ? 'ws-browser-header-bottom-cell' : '' )
                        ].join(' ') , "' ",
                        ( cs > j ? " colspan='" + currentHead.colspan + "' " : ''),
                        ( rs > n ? " rowspan='" + currentHead.rowspan + "' " : ''), ">" ,
                           "<div>" ,
                              (this._options.display.useSorting && this._columnMap[i].isSortable === true ? "<span class='ws-browser-sortable none'></span>" : ''),
                              (currentHead.content.jquery ?
                                 $ws.helpers.jQueryToString(currentHead.content) :
                                 (!this._columnMap[j].filterDialog ?
                                    // Не указан диалог фильтра
                                    contentText.replace(/\n/mg, '<br/>') :
                                    // Указан диалог фильтра
                                    [
                                       "<a href='javascript:void(0)' class='ws-browser-head-link ws-browser-filter-trigger' hasFilter='true' id='", i, "'>",
                                          (currentHead.filterVis.jquery ?
                                             $ws.helpers.jQueryToString(currentHead.filterVis) :
                                             currentHead.filterVis
                                          ),
                                          currentHead.content,
                                       "</a>",
                                       "<span class='ws-browser-filter ws-browser-filter-trigger' style='",
                                          (currentHead.hasFilter ? 'display: block;' : ''),
                                          "' hasFilter='false'></span>"
                                    ].join('')
                                 )
                              ),
                           "</div>" ,
                        "</td>"
                     ].join(''));
                  }
               }
            }
            result.push("<td class='ws-browser-header-cell-scroll-placeholder' width='", this._scrollWidth, "' style = 'display: none'>&nbsp;</td>");
            result.push("</tr>");
         }
         if($ws._const.browser.isIE && hasColSpan){
            var temp = [];
            temp.push('<tr class="ws-browser-ie-head-row-colspan-fix">');

            //Столбцов должно быть ровно столько же, сколько в реальной шапке
            if (showSelectionCheckbox)
               temp.push('<td></td>');

            $ws.helpers.forEach(this._columnMap, function() {
               temp.push("<td></td>");
            });

            temp.push('<td class="ws-browser-header-cell-scroll-placeholder" style = "display: none"></td>');

            temp.push('</tr>');
            result = temp.concat(result);
         }
         this._headerContentFlags['headerRows'] = !!result.length;
         return result.join('');
      },

      _renderColgroups: function(noCache){
         if(this._colgroupCache && !noCache)
            return this._colgroupCache;

         this._colgroupCache = $ws.helpers.reduce(this._columnMap, function(resMemo, colMap) {
            var width;
            if ((colMap.fixedSize || this._haveAutoWidth()) && (width = colMap.width))
               resMemo.push('<col class="ws-browser-col" width="', width, '"/>');
            else
               resMemo.push('<col class="ws-browser-col"/>');
            return resMemo;
         }, [this._needShowSelectionCheckbox() ? '<col width="24"/>' : ""], this).join('');

         return this._colgroupCache;
      },
      _renderHead: function() {
         var borderClass = this._options.display.useDrawingLines ? 'ws-browser-border' : '',
             rows = this._prepareHeadTemplate(this._prepareHeadStruct()),
             res = [
               '<table cellspacing="0" class="ws-table-fixed ws-browser-head '+borderClass+'">' ,
                  '<colgroup>' ,
                     this._renderColgroups(),
                  '</colgroup>' ,
                  '<thead>',
                     rows,
                  '</thead>' ,
               '</table>'
            ];

         return res.join('');
      },
      /**
       * <wiTag group="Управление">
       * Перерисовка браузера без запроса к БД
       * @param [forceRefreshHead]  - перерисовать шапку обязательно
       */
      refresh: function(forceRefreshHead){
         this._runInBatchUpdate('TableView.refresh', function() {
            if(this._dReady.isReady() && this._currentRecordSet){
               this._rowSelectionSetted = false;
               if(this._onBeforeRenderActions()){
                  //если из onBeforeRender вернули свои колонки или обязательная перерисовка
                  if(forceRefreshHead || !this._columnMap || this._columnMap.length === 0){
                     this._refreshHead();
                  }
                  // Пересчитать col ширины и записать в bodyColumns
                  // мы ищем так, чтобы точно найти колонки только для тела таблицы. иначе можно найти много чего... например, colgroup от сетки в шаблоне
                  //А еще мы должны находить только первое соответствие ибо в шаблон редактирования по месту положили браузер и все сломалось.
                  var colgroup = this._data.find('colgroup:first');
                  colgroup.empty().append(this._renderColgroups());
                  this._bodyColumns = colgroup.children(".ws-browser-col");
                  this._drawBody();

                  if(!this._refreshResults())
                     this._setHeight();
               }
            }
         });
      },
      _refreshResults: function(){
         return false;
      },
      /**
       * Формирует шапку таблицы и выводит ее
       */
      _refreshHead: function(){
         if(this._columnMap.length === 0){
            //если у нас изменились колонки, то нужно их пересчитать и обновить colgroup
            //чтобы colgroup посчитался заново, потрём то, то закэшированно
            this._colgroupCache = undefined;
            this._mapColumns();
            //TODO придумать механизм пересчета колгрупп в одном месте для всех сразу.
            this._data.find('colgroup').empty().append(this._renderColgroups());
         }
         //если у нас нет шапки, то не будем перерисовывать заголовок
         if(!this._options.display.showHead)
            return;

         var head = this._renderHead();

         this._headContainer.find('.ws-browser-head-scroller').empty().append(head);
         this._initHeadVariables();
         this._bindHeaderEvents();
      },
      /**
       * Задает маппинг колонок браузера, сливая в один массив все реально отображаемые колонки, с полным набором их параметров.
       */
      _mapColumns: function(){
         var configColumns = this._options.display.columns,
             recivedColumns = this._currentRecordSet && this._currentRecordSet.getColumns(),
             columns = configColumns ? configColumns : recivedColumns,
             num = 0;
         if(columns){
            for(var i in columns){
               if(columns.hasOwnProperty(i)){
                  var cur = columns[i],
                      title = cur.title ? cur.title : '',
                      field = cur.field ? cur.field : title,
                      fieldType = (recivedColumns && recivedColumns[field]) ? recivedColumns[field].type : (cur.type ? cur.type : null);
                  this._columnMap[num] = {
                     title: title,
                     extendedTooltip: cur.extendedTooltip ? cur.extendedTooltip : false,
                     isSortable: cur.field !== undefined && (cur.isSortable !== undefined ? cur.isSortable : false),
                     field: field,
                     render: cur.render ? cur.render : null,
                     highlight: cur.highlight ? cur.highlight : false,
                     type: fieldType,
                     fixedSize: cur.fixedSize ? cur.fixedSize : false,
                     textAlign: cur.textAlign ? cur.textAlign : 'auto',
                     textVerticalAlign: cur.textVerticalAlign ? cur.textVerticalAlign : 'top',
                     //TODO отказаться от verticalAlign
                     titleVerticalAlign: cur.titleVerticalAlign ? cur.titleVerticalAlign : cur.verticalAlign ?
                        cur.verticalAlign : null,
                     className: cur.className ? cur.className : '',
                     //TODO отказаться от captionAlign
                     titleAlign: cur.captionAlign ? cur.captionAlign : cur.titleAlign ? cur.titleAlign : 'auto',
                     captionRender: cur.captionRender ? cur.captionRender : null,
                     formatValue: cur.formatValue ? cur.formatValue : null,
                     filterDialog: cur.filterDialog ? cur.filterDialog : null,
                     filterName: cur.filterName ? cur.filterName : title,
                     visualFilterFunction: cur.visualFilterFunction ? cur.visualFilterFunction : null,
                     minWidth: cur.minWidth || null,
                     index: num,
                     cellTemplate: cur.cellTemplate ? cur.cellTemplate : false
                  };
                  this._columnMap[num].width = cur.width ? parseInt(cur.width, 10) : (this._getDefWidth(this._columnMap[num].type));
                  num++;
               }
            }
         }
      },
      /**
       * <wiTag group="Данные" noShow>
       */
      getColumnMap: function(){
         return this._columnMap;
      },
      /**
       * <wiTag group="Данные" noShow>
       */
      getColumnsTitle: function(){
         var titles = [],
               columns = this._options.display.columns;
         for(var i = 0; i < columns.length; i++){
            titles.push(columns[i].title);
         }
         return titles;
      },
      /**
       * По типу столбца возвращает дефолтное значение ширины для него, или null в случае отсутствия такого типа
       * @param {String} columnType  тип колонки
       * @return {Number} ширина колонки или null в случае отсутствия ее или дефолтного значения
       */
      _getDefWidth : function(columnType){
         if(columnType && $ws._const.Browser.defColWidth[columnType])
            return $ws._const.Browser.defColWidth[columnType];
         return null;
      },
      _initHeadVariables : function(){
         this._head = this._rootElement.find('thead');//head может огказаться старым
         this._headColumns = this._head.parent().find('col.ws-browser-col');
         this._bodyColumns = this._body.parent().find('col.ws-browser-col');
         this._resultsColumns = this._rootElement.find('.ws-browser-foot.results').find('col.ws-browser-col');
         this._scrollGapPlaceholder = this._head.find('td.ws-browser-header-cell-scroll-placeholder');
         this._initColumnsWidth();
         if(this._options.display.resizable)
            this._initResizeEvents();
      },
      /**
       * инициализация resize для шапки
       */
      _initColumnsWidth: function(){
         var k = 0,
            self = this;
         self._resizingColumn = self._head.find('th:first');
         self._idCols = [];

         for(var i in self._columnMap){
            if(self._columnMap.hasOwnProperty(i)){
               self._idCols[k] = i;
               k++;
            }
         }

         k = 0;
         self._body.find('.ws-browser-cell').eq(0).children('.ws-browser-cell').each(function(){
            $(this).attr("id", self._idCols[k]);
            k++;
         });
      },
      _activeHoverHideSelection: function(event){
         if(!this._useKeyboard && this._activeElement && 'jquery' in this._activeElement){
            var toElement = event ? $(event.relatedTarget || event.toElement) : false;
            if(toElement && 'jquery' in toElement)
               toElement = toElement.closest(".ws-browser-row-options-block");
            if(toElement === false || toElement.length === 0){
               this._activeElement.removeClass("ws-browser-item-over");
               this._activeElement = undefined;
               this._hovered = false;
            }
         }
      },
      /**
       * Выделяет строку с переданным элементом флагом отметки записи и синей полоской, как активную
       * @param {Event} event событие клика по элементу
       */
      _selectAndSetActiveElement: function(event){
         var row = $(event.target).closest('.ws-browser-table-row');
         this._selectActiveElement(row);
         if(event.button === ($ws._const.browser.isIE8 ? 1 : 0)) {
            this.setActiveElement(row, false, false, true);
         }
      },
      /**
       * Добавляет событие движения мыши для отрисовки опций строки
       */
      _initEvents: function(){
         var self = this,
             rowkey,
             parent = this._body.parent()[0];

         $('.ws-browser-checkbox-holder', parent).live('click', function(event){
            //Внутри обработчика может быть всякий сложный код, изменяющий размеры браузера, и оповещающий об этом.
            //Завернём этот обработчик в пакет, чтобы все пересчёты авторазмеров склеились в один, и запустились после обработчика.
            self._runInBatchUpdate('ws-browser-checkbox-holder click', function() {
               if(self.isEnabled()){
                  self._selectAndSetActiveElement(event);
               }
            });

            event.stopImmediatePropagation();
            return false;
         });
         $ws.proto.TableView.superclass._initEvents.apply(this, arguments);

         if(this._options.useSelection){
            if(this._options.useHoverRowAsActive){
               this._data.addClass("ws-browser-active-hover");
               $('[rowkey]', parent).live('mouseenter', function(){
                  if(!self._useKeyboard){
                     self.setActiveElement.apply(self, [$(this), false, true, false]);
                  }
               }.debounce(15));
               $(this._data).bind('mouseleave', $.proxy(self._activeHoverHideSelection.debounce(15), self));
            } else
               this._data.addClass("ws-browser-hover");
         }

         var browserContainer = this._rootElement.find('.ws-browser-container'),
            headScroller = this._headContainer.find('.ws-browser-head-scroller');
         browserContainer.bind('scroll', function(){
            var scrollLeft = browserContainer.scrollLeft();
            headScroller.scrollLeft(scrollLeft);
            self._onScrollActions(scrollLeft);
         });
      },
      /**
       * Обработчик скролла в теле браузера
       * @param {Number} scrollLeft прокрутка содержимого по-горизонтали
       */
      _onScrollActions: function(scrollLeft){
      },
      _unselectRow: function(key) {
         $ws.proto.TableView.superclass._unselectRow.apply(this, arguments);
         var selectAllRow = this._head.find('.ws-browser-selected');
         if (selectAllRow.length !== 0) {
            selectAllRow.removeClass('ws-browser-selected');
            selectAllRow.find('.ws-browser-checkbox-holder').attr('title', 'Отметить всю страницу');
         }
      },
      _selectRow: function(key) {
         var selectAllRow = this._head.find('.ws-browser-checkbox').closest('.ws-browser-table-row'),
             isSelected = $ws.proto.TableView.superclass._selectRow.apply(this, arguments);
         if (isSelected && !selectAllRow.hasClass('ws-browser-selected')) {
            selectAllRow.addClass('ws-browser-selected');
            selectAllRow.find('.ws-browser-checkbox-holder').attr('title', 'Снять отметку');
         }
         return isSelected;
      },
      /**
       * Проверять ли на наличие пейджинга при отображении опций записи на смену порядкового номера
       * @returns {boolean}
       * @private
       */
      _checkOnPaging: function () {
         return this.getPagingMode() !== '';
      },
      /**
       * <wiTag group="Отображение">
       * Выделяет или снимает выделение цветом чётных строк в зависимости от указанного значения {@link hasZebra}.
       * @param {Boolean} hasZebra
       * @example
       * <pre>
       *    tableView.zebraBody(true);
       * </pre>
       * @see hasZebra
       */
      zebraBody: function(hasZebra) {
         var rows = this._body.find('.ws-browser-table-row');
         hasZebra = !!hasZebra;
         rows.removeClass('rE');
         this._data.toggleClass('ws-browser-hasZebra', hasZebra);
         this._options.display.hasZebra = hasZebra;
         if(hasZebra){
            rows.filter(':even').addClass("rE");
         }
         //Включаем зебровые стили для блока данных, зависимые от данных и шапки
         this._updateHeaderContentStyles();
         this._updateSelection();
      },
      /**
       * <wiTag group="Отображение">
       * Подсвечивает переданный текст (text) среди отображаемых данных.
       * Может применить подсветку сразу или только при следующем отображении в зависимости от значения параметра instant.
       * @param {String} text Строка, которая нуждается в подсветке. А на самом деле это регэксп! Только тсс!! Никому не говорите!
       * @param {Boolean} [instant=false] Нужно ли применять изменения сразу же или только после перерисовки
       * @example
       * <pre>
       *    tableView.setTextHighlight('Иван')
       * </pre>
       */
      setTextHighlight: function(text, instant){
         this._highlight = text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
         if(text && instant){
            var highlighted = this._body.find('.ws-browser-text-highlight');
            for(var i = 0, len = highlighted.length; i < len; ++i){
               this._highlightNode($(highlighted[i]));
            }
         }
      },
      /**
       * <wiTag group="Отображение">
       * Выбор колонок, в которых будет подсвечиваться текст (text).
       * @param {Array} сolumns Имена колонок, которым включаем\отключаем подсветку.
       * @param {Boolean} instant Включение\отключение подсветки
       * @example
       * <pre>
       *    tableView.setColumnHighlight(['Цена','Производитель'],true)
       *    tableView.setColumnHighlight(['Цена'])
       * </pre>
       */
      setColumnHighlight: function(columns, instant){
         for (var j=0;j<columns.length;j++)
         {
            var col = columns[j].replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");

            var index = -1;
            if (instant !== true){
               instant = false;
            }

            for (var i=0;i<this._columnMap.length;i++){
               if (this._columnMap[i].title == col){
                  index = this._columnMap[i].index;
                  break;
               }
            }

            if (index != -1){
               $('[coldefindex = ' + index + ']').find('.ws-browser-div-cut').toggleClass("ws-browser-text-highlight",instant);
            }
         }
      },
      /**
       * <wiTag group="Отображение">
       * Убирает подсветку с таблицы.
       * Может убрать подсветку сразу или только при следующем отображении в зависимости от значения параметра instant.
       * @param {Boolean} [instant=false] Нужно ли применять изменения сразу же или только после перерисовки
       * @example
       * <pre>
       *    tableView.clearTextHighlight()
       * </pre>
       */
      clearTextHighlight: function(instant){
         this._highlight = '';
         if(instant){
            this.refresh();
         }
      },
      /**
       * Подсвечивает текст в указанном узле дом-дерева. Внимание! В этом узле должны быть только текстовые узлы!
       * @param {jQuery} node Узел, в котором нужна подсветка
       */
      _highlightNode: function(node){
         if(node.attr('highlight') === this._highlight){
            return;
         }
         node.attr('highlight', this._highlight);
         node.html(this._highlightData(node.html()))

      },
      /**
       * <wiTag group="Отображение">
       * Устанавливает новый набор и конфигурацию отображаемых колонок.
       * Если необходимо, чтобы данные были отображены так, как придут в наборе данных, то в качестве значения параметра передаётся пустой массив.
       * В этом случае отображение изменится при следующей отрисовке данных.
       * @param {Array} columns Массив с параметрами колонок, аналогичен параметру из конфига
       * @example
       * <pre>
       *    var columns = tableView.getColumns(),
       *        newColumns = [];
       *    for(var i = 0, l = columns.length; i < l; i++){
       *       if(columns[i].title !== "Примечание")
       *          newColumns.push(columns[i]);
       *    }
       *    newColumns.push({
       *       title: 'ФИО',
       *       field: 'РП.ФИО'
       *    });
       *    tableView.setColumns(newColumns);
       * </pre>
       * @see columns
       * @see getColumns
       * @see toggleColumn
       */
      setColumns: function(columns){
         var self = this;
         //Экранируем // отваленные при присвоении строк
         for(var i = 0, l = columns.length; i < l; i++){
            columns[i].title = columns[i].title.replace(/\\\.|\\/g, function(result){
               if(result.length == 2) return '.'; else return result + result;
            }); // Замена \ на \\
         }
         this._dReady.addCallback(function(){
            self._options.display.columns = columns;
            self._columnMap = [];
            self._colgroupCache = undefined;
            self._mapColumns();
            self.refresh(true);
         });
      },
      /**
       * <wiTag group="Отображение">
       * Получить текущее описание колонок табличного браузера.
       * @returns {Array} Текущее описание колонок табличного представления.
       * @example
       * <pre>
       *    var columns = tableView.getColumns(),
       *        newColumns = [];
       *    for(var i = 0, l = columns.length; i < l; i++){
       *       if(columns[i].title !== "Примечание")
       *          newColumns.push(columns[i]);
       *    }
       *    newColumns.push({
       *       title: 'ФИО',
       *       field: 'РП.ФИО'
       *    });
       *    tableView.setColumns(newColumns);
       * </pre>
       * @see toggleColumn
       * @see setColumns
       * @see columns
       */
      getColumns: function(){
         return this._options.display.columns || (this._currentRecordSet && this._currentRecordSet.getColumns());
      },
       /**
        * <wiTag group="Данные">
        * Получить колонку по имени.
        * @param name
        * @returns {*}
        */
      getColumnByName: function(name){
         return this._getColumnByAttr("title",name);
      },
      /**
       * Получить колонку по атрибуту
       * @param attrName имя атрибута
       * @param attrValue значение атрибута
       * @returns {Object}
       */
      _getColumnByAttr: function (attrName,attrValue){
         var columns, column;
         if(attrValue){
            columns = this.getColumns();
            if(typeof columns !== "undefined"){
               if(columns instanceof Array){
                  for(var i = 0, l = columns.length; i < l; i++){
                     if(columns[i][attrName] === attrValue){
                        column = columns[i];
                        break;
                     }
                  }
               }else
                  column = columns[attrValue];
            }
         }
         return column;
      },
      /**
       * <wiTag group="Отображение">
       * Признак видимости колонки.
       * @param {String} name Имя колонки
       * @returns {Boolean} Возвращает признак видима ли колонка
       */
      isVisibleColumn : function(name){
        var column = this._getColumnByAttr("field",name);
        return !!column;

      },
      /**
       * <wiTag group="Данные">
       * Возвращает массив полей, имееющихся на бизнес-логике для данного представления.
       * @param {Boolean} withTitles возвращать поля вместе с указанным названием.
       * @returns {Array} массив полей.
       */
      getFields: function (withTitles) {
         var fields = [],
               columns = this.getColumns();
         for (var i = 0; i < columns.length; i++) {
            if (columns[i].field) {
               fields.push(withTitles ? { 'title': columns[i].title, 'field': columns[i].field } : columns[i].field);
            }
         }
         return fields;
      },
      /**
       * Изменяет статус включенности элемента
       * Т.е. возможность взаимодейтсвия с ним пользователя
       * <wiTag group="Управление">
       * <pre>
       *    if(control.isEnabled())
       *       control.setEnabled(false);
       * </pre>
       * @param {Boolean} enable статус "включенности" элемента управления
       */
      _setEnabled: function(enable){
         $ws.proto.TableView.superclass._setEnabled.apply(this, arguments);
      },
      /**
       * <wiTag group="Отображение">
       * Устанавливает обработчик отрисовки строки
       * @param {Function} render Функция-обработчик. В качестве аргументов получит запись {$ws.proto.Record} и строку {jQuery}, которая ещё не прикреплена к дом-дереву (!)
       * @example
       * <pre>
       *    tableView.setRowRender(function(record, row){
       *       row.addClass("my-table-row");
       *    });
       * </pre>
       */
      setRowRender: function(render){
         this._options.display.rowRender = render;
      },
      /**
       * <wiTag group="Управление">
       * Установить функцию отрисовки для колонки.
       * Заменяет рендер, установленный ранее.
       * @param {String} columnName Название колонки.
       * @param {Function} render Функция рендера.
       * <pre>
       *    browser.setColumnRender('columnName', function(record, field){
       *       return record.get(field);
       *    });
       * </pre>
       */
      setColumnRender: function(columnName, render){
         for(var i = 0, len = this._options.display.columns.length; i < len; ++i){
            var column = this._options.display.columns[i];
            if(column.title === columnName){
               column.render = render;
               break;
            }
         }
      },
      /**
       * Разрушает экземпляр класса
       * <wiTag group="Управление">
       * <pre>
       *    control.destroy();
       * </pre>
       */
      destroy: function(){
         this._unbindHeaderEvents();
         $ws.proto.TableView.superclass.destroy.apply(this, arguments);
      },
      /**
       * <wiTag group="Управление">
       * Меняет состояние режима браузера "только для чтения".
       * @param {Boolean} status
       * @example
       * <pre>
       *    dataView.setReadOnly(true);
       * </pre>
       */
      setReadOnly: function(status){
         $ws.proto.TableView.superclass.setReadOnly.apply(this, arguments);
      },
      /**
       * Обработчик удаления записи
       * @param {Array} records Удалённые записи
       * @protected
       */
      _updateAfterRecordsDelete: function(records){
         $ws.proto.TableView.superclass._updateAfterRecordsDelete.apply(this, arguments);
         if( !this._options.reloadAfterChange ){
            for(var i = 0; i < records.length; ++i){
               var key = records[i].getKey();
               if( this.haveRow(key) ){
                  this.findRow(key).remove();
                  this._rowsMap[key] = undefined;
               }
            }
            this.setActiveRow(this._activeElement);
         }
      },
      /**
       * <wiTag group="Отображение">
       * Скрывает/показывает указанную колонку.
       * Принимает признак что нужно сделать - скрыть или показать колонку
       * Note! Может и должен работать только с колонками, которые были заданы (!)изначально (в джине). Нельзя
       * сделать setColumns а потом их добавлять или удалять из отображения этим методом.
       * @param {String} columnField имя поля, к которому привязана колонка, которую нужно скрыть
       * @param {String|Object} columnField имя поля или набор полей, к которому(ым) привязана колонка, которую нужно скрыть или показать
       * @param {Boolean} toggle скрыть или показать колонку
       * @example
       * <pre>
       *    dataView.toggleColumn("Документ.Приоритет", false);
       *
       *    dataView.toggleColumn({
       *       "Документ.Приоритет": false,
       *       "Документ.Порядок": true
       *    });
       * </pre>
       * @see columns
       * @see setColumns
       * @see getColumns
       */
      toggleColumn : function (columnField, toggle){
         var result = [],
            columns = this._initialColumns,
            num = 0,
            isObject = toggle === undefined && columnField && typeof columnField === 'object';

         for (var i in  columns){
            if (columns.hasOwnProperty(i)){
               var cur = columns[i];
                  if ((isObject && cur.field in columnField) || (cur.field === columnField)) {
                     cur.show = isObject ? columnField[cur.field] : toggle;
                  }
               if (cur.show !== false){
                  result[num] = cur;
                  num++;
               }
            }
         }

         this.setColumns(result);
      }
   });

   return $ws.proto.TableView;

});
