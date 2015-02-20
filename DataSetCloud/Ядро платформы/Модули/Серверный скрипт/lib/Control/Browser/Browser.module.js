/**
 * Created with JetBrains PhpStorm.
 * User: tm.baeva
 * Date: 22.04.13
 * Time: 1:18
 * To change this template use File | Settings | File Templates.
 */
define("js!SBIS3.CORE.Browser", ["js!SBIS3.CORE.DataView", 'Core/BackgroundMapper'], function( DataView, BackgroundMapper ) {

   "use strict";

   $ws._const.Browser.rowMenuOffset = {
      top: -5,
      left: -5
   }; //Костыль для позиционирования row-options меню в старом браузере
   $ws._const.Browser.accordion = {
      levelIndent: 16,
      padding: 16
   };
   /**
    * @class $ws.proto.Browser
    * @extends $ws.proto.DataView
    *
    * @cfgOld {String} display.viewType тип отображения данных: дерево(tree), иерархия(hierarchy) или таблица, если параметр не указан
    * @control
    */

   $ws.proto.Browser = DataView.extend(/** @lends $ws.proto.Browser.prototype */{
      /**
       * @event onDragStart В начале перемещения записей
       * Событие, происходящее при начале перемещения записей.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {Array} records Перемещаемые записи.
       * @return {}
       */
      /**
       * @event onDragMove При перемещении записей в элемент.
       * Событие, происходящее при попытке перемещения записей в какой-то элемент.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {Array} records Перемещаемые записи.
       * @[aram {$ws.proto.Record} record Запись, в которую пытаются переместить.
       * @param {String} recordId Идентификатор записи, в которую пытаемся кинуть записи. Может быть полезно, если
       * пытаемся кинуть в корень (записи в этом случае нет).
       * @param {$ws.proto.Browser} [from] Из какого браузера начали перетаскивать записи. Будет присутствовать, если
       * записи были получены из другого браузера.
       */
      /**
       * @event onDragStop По окончанию перемещения
       * Событие, происходящее при окончании перемещения. Происходит как при бросании записей из этого браузера,
       * так и в этот.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {Array} records Перемещаемые записи.
       * @param {$ws.proto.Record} record Запись, в которую пытаются переместить.
       * @param {Boolean} isCorrect Окончился ли перенос позитивно.
       * @param {String} recordId Идентификатор записи, в которую пытаемся кинуть записи. Может быть полезно, если
       * пытаемся кинуть в корень (записи в этом случае нет).
       * @param {$ws.proto.Browser} [from] Из какого браузера начали перетаскивать записи.
       * @param {$ws.proto.Browser} [to] В какой браузер перетащили записи.
       */
      /**
       * @event onDragIn При перетаскивании записей мышью в браузера
       * Событие при перемещении записей мышью в браузер.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {$ws.proto.Browser} from Из какого браузера начали перетаскивать записи.
       * @param {Array} records Перемещаемые записи.
       * @return {Boolean} Если в этот браузер можно перетаскивать записи, то нужно вернуть true в обработчике события.
       */
      /**
       * @event onDragOut При перетаскивании мышью вне браузера
       * Событие при перемещении записей мышью вне браузера.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {$ws.proto.Browser} from Из какого браузера начали перетаскивать записи.
       * @param {Array} records Перемещаемые записи.
       * @return {Boolean} Если из этого браузера можно вытаскивать записи, то нужно вернуть true в обработчике события.
       */
      /**
       * @event onBeforeRender Перед отрисовкой
       * Событие, происходящее перед отрисовкой браузера.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {Array} columns Текущий набор колонок.
       */
      /**
       * @event onRowOptions Перед показом опций строки
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {$ws.proto.Record} record Запись, для которой показываем опции.
       * @param {jQuery} row Строка, для которой показываем.
       * @param {Object} options Объект с опциями строк (имя опции -> описание опции, схожее с addRowOption), которые
       * будут отображены на данный момент. При изменении объекта это отразится на опциях строки - можно добавлять,
       * удалять, редактировать.
       * @return {Boolean|Array} Если в ответ придёт false, то показаны не будут. Если в ответ придёт массив, то будут
       * скрыты опции, имена которых перечислены в массиве.
       */
      /**
       * @event onBeforeEditColumn Перед отрисовкой поля ввода для редактирования по месту
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {$ws.proto.Record} record Запись, которую редактируем по месту.
       * @param {String} type Тип поля ввода.
       * @param {Object} config Конфигурация поля ввода.
       * @return {Array} Если в ответ придёт массив из двух значений, то первый элемент будет считаться новым типом
       * поля, а второй - новой конфигурацией поля.
       */
      /**
       * @event onFieldChange При изменение поля при редактировании по месту
       * Срабатывает когда действительно поменяли поле записи.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {$ws.proto.Record} record Запись, которую изменяли (та, что пришла от метода чтения).
       * @param {String} columnField Имя столбца записи, который поменяли.
       * @param {String} columnName Имя колонки браузера, которую поменяли.
       * @param {String} columnValue Новое значение столбца.
       * @param {String} oldColumnValue Старое значение столбца.
       */
      /**
       * @event onFolderOpen При открытии папки - для дерева
       * Происходит после создания соответствующих строк в dom-дереве, т.е. если есть загрузка по частям, то сработает
       * после неё. Если при открытии также открываются другие папки, то для них события не будет, так как они будут
       * включены в текущее.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {String} rowkey Первичный ключ открываемой папки.
       * @param {Array} keys Набор ключей записей. Могут иметь родителя, отличного от rowkey, так как при открытии одной
       * папки могут открываться другие.
       * @param {jQuery} rows jQuery-набор с tr'ами, которые были добавлены.
       */
      /**
       * @event onFolderClose При закрытии папки - для дерева
       * Происходит после удаления строк из dom-дерева.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {String} rowkey Первичный ключ закрываемой папки.
       */
      $protected: {
         _options: {
            /**
             * @cfg {Object} Параметры отображения данных на экране
             */
            display: {
               /**
                *@cfg {Array} display.columns массив с описанием полей, которые нужно выводить на экран и как их нужно выводить
                * Например:
                * <pre>
                *    columns: [
                *       {
                *          title: 'Период',            // имя колонки как его нужно вывести на экран
                *          field: 'dtb',               // имя колонки как оно пришло
                *          width: '7%',                // ширина столбца
                *          fixedSize: false,           // Меняется ли ширина колонки при ресайзе
                *          render: function(data) {    // функция форматирования данных в столбце
                *          }
                *       },
                            *       {
                *          title: 'Период',
                *          field: 'dte',
                *          width: '7%',
                *          render: function(data) {
                *          }
                *       },
                            *       {
                *          title: 'Сообщение',
                *          field: 'reccomment',
                *          width: '77%'
                *       }
                *    ]
                * </pre>
                * в случае colspan указываем одинаковое выводимое имя колонки у всех заколспаненых столбцов.
                * если каждая такая колонка требует своего собственного имени помимо общего,
                * то пишем каждой колонке выводимое имя как выводимоеОбщееИмя.выводимоеИмяДаннойКолонки
                */
               columns : '',
               /**
                * @cfg {String} Иконка для отображения узлов
                */
               folderIcon: $ws._const.Browser.folderIcon,
               /**
                * @cfg {String} Иконка для отображения листов
                */
               itemIcon: $ws._const.Browser.itemIcon,
               /**
                * @cfg {Boolean} Массив ступенек "лесенки"
                */
               ladder: [],
               /**
                * @cfg {Boolean} Использовать "лесенку" по словам
                */
               useWordsLadder: false,
               /**
                * @cfg {Number} Количество слов в "лесенке" по словам
                */
               wordsLadderCount: 1,
               /**
                * @cfg {Boolean} Показывать корень дерева
                */
               showRoot: false,
               /**
                * @cfg {String} Название корня
                */
               rootName: 'Все',
               /**
                * @cfg {Boolean} Показывать заголовок (названия столбцов)
                */
               showHead: true,
               /**
                * @cfg {Boolean} Сортировать данные
                * Может ли пользователь задавать сортировку по клику в хёдере
                */
               useSorting: true,
               /**
                * @cfg {Boolean} Чередовать цвет строк
                * Будут ли строки покрашены в чередующиеся цвета
                */
               hasZebra: true,
               /**
                * @cfg {Boolean} Обрезать строки
                * Будут ли длинные строки обрезаны (иначе будет перенос)
                */
               cutLongRows: true,
               /**
                * @cfg {Boolean} Отображать кнопки управления записью
                * Показывать ли опции строки в отдельной колонке - удаление, меню
                */
               rowOptions: false,
               /**
                * @cfg {Function} Функция, выполняемая при отрисовке таблицы
                * В аргументы получает текущую запись и jQuery-объект текущей отрисовываемой строки
                */
               rowRender : '',
               /**
                * @cfg {Function} Функция, выполняемая при отрисовке итогов таблицы
                * В аргументы получает текущую запись итогов и jQuery-объект текущей отрисовываемой строки
                */
               resultsRender : '',
               /**
                * @cfg {Function} Функция, выполняемая при отрисовке ячейки шапки таблицы
                * В аргументы получает текст текущей отрисовываемой ячейки
                */
               headColumnRender : '',
               /**
                * @cfg {Function} Функция, выполняемая при отрисовке шапки таблицы
                * В аргументы получает jQuery-объект шапки
                */
               headRender : '',
               /**
                * @cfg {String} Текст результата
                */
               resultText : '&Sigma;',
               /**
                * @cfg {Boolean} Отображать активную строку не в фокусе
                */
               showActiveRowInFocus: true,
               /**
                * @cfg {Boolean} useDrawingLines
                */
               useDrawingLines: false,
               /**
                * @cfg {Boolean} Использовать добавление по месту
                */
               allowAddAtThePlace: false
            },
            /**
             * @cfg {String} Режим управления браузером
             * Режим управления браузером -- одним кликом или двойным. Есть ещё navigationMode
             */
            mode: 'oneClickMode',
            /**
             * @cfg {String} Режим управления папкой
             * Что делать при клике на ссылку в строке папки : открыть папку или активировать запись (редактировать/выбрать)
             * @variant open Открыть папку
             * @variant edit Редактировать папку
             */
            folderLinkAction: 'open',           //
            /**
             * @cfg {String} Опция работы выделения записей в дереве
             * При установке этой опции будут выделяться дочерние элементы в дереве
             *    - '': станадртное поведение, выделяем одну запись
             *    - 'childs': при выделении записей снимаем / ставим выделение на дочерние, родительские записи показывают, что имеют внутри выбранные
             *    - 'full': так же, как и предыдущий вариант, только родители становятся выделенными при выделении всех детей
             */
            selectChilds: ''
         },
         //Параметры, задаваемые в конструкторе
         _columnMap : [],
         _ladder : {},
         _bodyColumns: '',
         _headColumns: '',
         _resultsColumns: '',
         _editAtPlaceField: undefined,          //Поле для смены значения в редактировании по месту
         _editAtPlaceRecord: undefined,         //Запись, которая последней редактировалась по месту
         _editAtPlaceTimer: undefined,          //Таймер сохранения записи
         _editAtPlaceChanges: false,            //Имеются ли изменения в редактировании по месту - если да, то мы должны перечитать браузер по окончании процесса
         _editAtPlaceCell: undefined,           //Ячейка, внутри которой происходит редактирование по месту
         _editAtPlaceFocusCallback: undefined,  //Обработчик потери фокуса
         _editAtPlaceCellIndex: undefined,      //Индекс текущей редактируемой колонки
         _editAtPlaceValidationErrors: 0,       //Количество ошибок валидации в текущей строке. Не сохраняем запись, пока не обнулим
         _editAtPlaceValidationMap: {},         //Ассоциативный массив с номерами колонок, не прошедшими валидацию
         _editAtPlaceWithValidationError: false,//Редактируем ли мы сейчас ячейку с ошибкой валидации
         _hasLadder: false,                     //Флаг была ли в пред столбце лесенка
         _resultFields: [],                     //Список полей, по которым считаем итоги
         _resultTypes: {
            'leaves': 'По листьям',
            'folders': 'По узлам',
            'foldersAndLeaves': 'По узлам и листьям'
         },
         _fieldTypesForEdit: {
            "Число целое": "Field:FieldInteger",
            "Число вещественное": "Field:FieldNumeric",
            "Деньги": "Field:FieldMoney",
            "Дата": "Field:FieldDate",
            "Дата и время": "Field:FieldDate",
            "Время": "Field:FieldDate",
            "Логическое": "Field:FieldCheckbox",
            "Строка": "Field:FieldString",
            "Текст": "Field:FieldText",
            "Перечисляемое": "Field:FieldDropdown",
            "Флаги": "Area:GroupCheckBox"
         },
         _rowOptionsInitialized: false,          //Инициализированы опции строки
         _rowOptionsElement: false,              //Элементы с опциями строки - удаление, редактирование, меню
         _hasRowOptions: false,                  //Имеет ли эти самые опции - при некоторых настройках может оказаться, что вообще нечего отображать
         _rowOptionsMenu: undefined,             //Набор меню для опций строки, [для не папки, для папки]
         _rowOptionsHoverRow: undefined,         //Строка, для которой сейчас показываются опции
         _rowOptionsHoverRecord: undefined,      //Запись, для который показываем опции строки
         _rowOptionsTargetRow: undefined,        //Строка, меню для которой необходимо будет показать после закрытия меню
         _rowOptionsMenuVisible: false,          //Показывается ли сейчас меню с опциями строки. Если показывается, то не показываем опции для других строк
         _rowOptionsCurrentMenu: undefined,      //Меню, которое отображалось последним. Возможно, его захочется закрыть
         _rowOptionsButtons: {},                 //Действия, которые могут выполнять опции строки
         _rowOptionsMenuButtons: [],             //Кнопки для показа меню опций строки
         _rowOptionsDisableStandart: false,      //Опция выключения стандартных кнопок
         _rowOptionsDefault: [],                 //Опции, которые будут созданы при первом наведении мыши
         _rowOptions: {},                        //Текущий набор опций строки
         _highlight: '',                         //Что подсвечивать в браузере (пустая строка - ничего)
         _resultBrowser: undefined,              //Таблица для отображения "итогов"
         _emptyDataScroller: undefined,          //Блок для отображения скролла при отсутствии данных
         _rowTemplates: [undefined, undefined],  //Шаблоны для создания строк, нулевой - для листа, первый - для папки
         _selectAfterPathLoad: true,             //Выделять ли запись после загрузки пути в дереве
         _columnFilterMap: [],                   //Колонки на которых установлен фильтр
         _addAtPlace: false,                     //Флаг того, что сейчас идёт добавление по месту
         _addAtPlaceRow: undefined,              //Строка, для которой сейчас применяется добавление по месту
         _addAtPlaceRecordId: undefined,         //Идентификатор записи, которая была создана добавлением по месту
         _addAtPlaceRecord: undefined,           //Запись, которая сейчас используется в добавлении по месту
         _addAtPlaceLinkRow: undefined,          //Строка с ссылкой добавления по месту
         _rootName: undefined,                   //Элемент, в котором написано название корня. Используется при смене корня
         _rowSelection: undefined,               //Элемент для выделения строк в новой теме
         _selectedPart: {},                      //Частично выбранные папки (часть дочерних элементов выбрана, часть - нет)
         _disabledEditCells: {},                 //Ключи записей, у которых выключено редактирование по месту. Если внутри есть объект, то там будуту названия колонок, для которых выключено редактирование по месту
         _fullTreeExpand: false,                 //Флаг того, что дерево полностью развернуто
         _rowsMap: {},                           //Мап "первичный ключ" => хтмл-объект строки этой записи
         _useLoadChildsFlag: false,              //Используется ли флаг загрузки доступности детей
         _dragRow: undefined,                    //Строчка, которую начали тянуть
         _dragStarted: false,                    //Флаг начала переноса записей
         _dragObject: undefined,                 //Объект, перемещаемый при drag&drop'е
         _dragStartPoint: {},                    //Точка, в которой начался drag&drop
         _dragTargetRow: undefined,              //Строка, на которую мы сейчас думаем кинуть записи
         _dragIsCorrect: false,                  //Является ли текущая запись корректной для переноса записей
         _dragRecords: [],                       //Массив с перетаскиваемыми записями
         _isLoading: false,                      //проверка на загрузку
         _insideOfAccordion: false               //находится ли браузер внутри аккордеона
      },
      $constructor: function(){
         this._publish('onDragStart', 'onDragMove', 'onDragStop',
                       'onBeforeRender', 'onRowOptions', 'onResetColumnFilter', 'onBeforeEditColumn',
                       'onFolderOpen', 'onFolderClose',
                       'onFieldChange');
         this.subscribe('onFilterChange', this._onFilterChangeHandler);
         var parentWindow = this.getParentWindow();
         if(parentWindow !== undefined)
            this._container.addClass('ws-browser-in-dialog');
         if(this._options.display.rowOptions){
            this._initRowOptionsDefaults();
         }
         this._insideOfAccordion = this._container.parents().hasClass('ws-accordion');
      },
      delegateUserEvent: function(selector, event, handler, data) {
         if(typeof selector !== 'string' || selector === '')
            throw new TypeError("delegateEvent: Selector must be a non-empty string");
         if(typeof handler != 'function')
            throw new TypeError("delegateEvent: Handler must be a function");
         if(typeof event != 'string' || event === '')
            throw new TypeError("delegateUserEvent: Event name must be a non-empty string");
         this._container.find('.ws-browser-container table').delegate(selector, event, data, handler);
      },
      _contentHeightChanged: function(){
         $ws.proto.Browser.superclass._contentHeightChanged.apply(this, arguments);
         this._hideRowOptions();
      },
      /**
       * Обработчик изменения фильтра браузера
       */
      _onFilterChangeHandler: function(event, filter){
         var id, colDef, filterName;
         if(!Object.isEmpty(this._options.display.columns)){
            for(var key in this._options.display.columns){
               if(this._options.display.columns[key].filterDialog){
                  colDef = this._options.display.columns[key];
                  filterName = colDef.filterName ? colDef.filterName : colDef.title;
                  if(filter[filterName])
                     this._columnFilterMap[filterName] = key;
                  else{
                     delete this._columnFilterMap[filterName];
                     this._clearMarkColumnFilter(key, colDef.title);
                  }
               }
            }
         }
         if(this._columnMap.length > 0){
            for(var value in this._columnFilterMap){
               if(filter[value]){
                  id = this._columnFilterMap[value];
                  this._markFilteredColumn(filter, id);
               }
            }
         }
      },
      /**
       * метод сброса фильтра по названию столбца
       * @param {String} columnName название столбца
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
               if(filter[colDef.filterName || colDef.title])
                  delete filter[colDef.filterName || colDef.title];
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
            filterName = colDef.filterName ? colDef.filterName : colDef.title;
            container = this._head.find('#'+id+'.ws-browser-head-link');
            if(container.length > 0){
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
      /**
       * Создает основную структуру html браузера
       */
      _createContainer:function(){
         // tabindex равный -1 поставлен в данном блоке для фикса бага - FF3.6 Показывает лишний аутлайн + лишняя позиция табуляции при переходе с первого датавью-
         var head = '',
             borderClass,
             foot = this._options.display.showRecordsCount || this._options.display.showPaging ||
                    this._options.display.showSelectionCheckbox ?
                     '<div class="ws-browser-footer"><table class="ws-browser-foot" cellspacing="0"><tfoot><tr><td class="ws-browser-pager-cont"></td></tr></tfoot></table></div>' :
                     "";

         borderClass = this._options.display.useDrawingLines ? ' ws-browser-border' : '';
         if(this._options.display.viewType == 'hierarchy' || this._options.display.showToolbar || this._options.display.showHead)
            head = '<div class="ws-browser-head-container"><div class="ws-browser-head-scroller">' +
                   '<table cellspacing="0" class="ws-table-fixed ws-browser-head ' +
                   borderClass +
                   '\"><colgroup></colgroup><thead></thead></table></div></div>';

         if(this._options.display.showActiveRowInFocus === false)
            this._container.addClass('ws-browser-hide-active-row');
         if(!this._options.display.showHead)
            borderClass += ' ws-browser-border-top';

         var loadTitle = ( $ws._const.theme === 'wi_scheme' ? '' : 'Загрузка'),
             code = '<div class="ws-browser-ajax-loader ws-hidden"><div class="ws-loading-indicator-outer">' +
                    '<div class="ws-loading-indicator-block"><div class="ws-loading-indicator ws-browser-loading-indicator">' +
                    loadTitle + '</div></div></div></div>' + this._getResizerCode(),
             rootCode = '<div class="ws-browser-data-container ws-browser-old" ' + this._getBrowserDataContainerStyles() + '>' +
                        '<div style="width: 100%;">' + head +
                        '<div class="ws-browser-container-wrapper"><div class="ws-browser-container" tabindex="-1">' +
                        '<table cellspacing="0" class="ws-table-fixed ws-browser' +
                        borderClass + '\"><colgroup></colgroup><tbody></tbody></table></div></div>' +
                        '<div class="ws-browser-results-block"><table class="ws-table-fixed ws-browser-foot results" cellspacing="0">' +
                        '<colgroup></colgroup><tbody></tbody></table></div>' + foot + '</div></div>';

         this._container
               .append(code)
               .append(this._rootElement = $(rootCode))
               .toggleClass('ws-treeview', this._options.display.viewType == 'tree');
         this._body = this._rootElement.find('.ws-browser tbody');
         this._resultBrowser = this._rootElement.find('.ws-browser-foot.results');
         $ws.proto.Browser.superclass._createContainer.apply(this, arguments);
         if(this._options.display.allowHorizontalScroll){
            this._emptyDataScroller = $('<div style="font-size: 0;" class="ws-hidden"></div>').height(1).appendTo(this._browserContainer);
            if($ws._const.browser.isIE){
               this._emptyDataScroller.append('&nbsp;');
            }
         }
         if($ws._const.theme === 'wi_scheme' && this._options.useHoverRowAsActive !== true){
            this._rowSelection = $('<div class="ws-browser-row-selection"></div>');
         }
      },
      _getBrowserDataContainerStyles: function() {
         //В браузере с относительным позиционированием (в новых сетках)
         //при растягивании блок данных должен быть абсолютным,
         //чтоб не распирать родительские блоки и сжиматься при уменьшении размеров контейнера
         var result = '';
         if (this._options.isRelative && this._horizontalAlignment === 'Stretch') {
            result = ' style="position: absolute; top: 0; left: 0; right: 0;"';
         }
         return result;
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

      _updateDataBlockSize: function(){
         this._setWidth();
         this._updateSizeVariables();
      },
      /**
       * Обработчик ресайза окна
       */
      _onResizeHandler: function(){
         $ws.proto.Browser.superclass._onResizeHandler.apply(this, arguments);
         if(this.getActiveRow() !== false)
            this._setSelection(this.getActiveRow(), true);
      },
      /**
       * Метод проверяет конфиг и проставляет нужные переменные
       */
      _configChecking: function(){
         this._options.display.resizable = false; ///ВРЕМЕННАЯ мера пока не написан ресайз колонок

         //showRoot работает только в дереве
         if(this._options.display.viewType !== 'tree'){
            this._options.display.showRoot = false;
            this._initResultFieldsList();
         }

         if(this._options.mode === 'navigationMode'){
            this._options.display.fixedExpand = true;
         }

         if(this._options.display.viewType === 'tree'){ //В режиме работы Дерево не может быть ни пейджинга ни сортировки
            this._options.display.usePaging = '';
            this._options.display.useSorting = false;
            if(this._options.display.viewMode == 'foldersTree') //наличие дочерних элементов запрашиваем только для дерева папок
               this.setLoadChildFlag(true);
         }
         if(this._options.display.viewType !== 'tree' || this._options.display.partiallyLoad){
            this._options.selectChilds = '';
         }
         if(this._options.display.showRoot){
            this._expanded[this._rootNode] = true;
         }
         for(var i = 0, l = this._options.display.ladder.length; i < l; i++)
            this._ladder[this._options.display.ladder[i]] = i;

         if(this._options.mode === 'navigationMode' && this._options.display.viewType === 'tree')
            this._options.useHoverRowAsActive = false;

         $ws.proto.Browser.superclass._configChecking.apply(this, arguments);
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
         return true;
      },
      /**
       * Изменяет итоги в таблице
       */
      _updateResults: function(){
         if(this._options.display.viewType !== 'tree' || this._turn !== ''){
            var oldResultsLength = this._resultBrowser.find('.ws-browser-results').length;
            if (this._resultFields.length !== 0){
               if(oldResultsLength === 0) // если итогов не было, то вставим для них строчку
                  this._resultBrowser.prepend('<tr class="ws-browser-results"></tr>');
               else
                  this._resultBrowser.find('.ws-browser-results td').remove(); // иначе просто вычистим все столбцы
               var colsCount = this._columnMap.length;
               var results = this._currentRecordSet.getResults(),
                   resultTR, resultTD, textContainer, colDef, data;
               resultTR = $('<tr class="ws-browser-results"/>');
               for(var i = 0; i < colsCount; i++){
                  colDef = this._columnMap[i];
                  data = '';
                  resultTD = $(this._createTdTemplate(i, undefined, true));
                  if(colDef.isResultField && results !== null && results.hasColumn(colDef.field)){
                     resultTD.attr('title', colDef.title);
                     data = results.get(colDef.field);
                     data = data === null ? 0 : data;
                     switch (colDef.type){
                        case "Деньги":
                           data = $ws.render.defaultColumn.money(data);
                           break;
                        case "oid":
                        case "int2":
                        case "int4":
                        case "int8":
                        case "Число целое":
                           data = $ws.render.defaultColumn.integer(data); // формат числа
                           break;
                     }
                  }
                  textContainer = resultTD.find('.ws-browser-cell-container');
                  if(i === 0)
                     textContainer.append($('<span class="ws-browser-sigma">' + this._options.display.resultText + '</span><div>' + data + '</div>'));
                  else
                     textContainer.text(data);
                  resultTR.append($(resultTD));
               }
               resultTR.append($('<td class="ws-browser-header-cell-scroll-placeholder" width="' + this._scrollWidth + '"/>'));
               if(typeof(this._options.display.resultsRender) === 'function')
                  this._options.display.resultsRender.apply(this, [resultTR, results]);
               this._resultBrowser.find('.ws-browser-results').replaceWith(resultTR);
               this._setHeight();
            } else {
               if(oldResultsLength !== 0){// если до этого были итоги, то удалим их
                  this._resultBrowser.find('.ws-browser-results').remove();
                  this._setHeight();
               }
            }
         }
      },
      /*
       * Запоминает по каким полям нужно считать итоги
       */
      _initResultFieldsList: function(){
         this._resultFields = [];
         for(var j = 0, k = this._options.display.columns.length; j < k; j++){
            if(this._options.display.columns[j].isResultField === true)
               this._resultFields.push(this._options.display.columns[j].field);
         }
         if(this._resultFields && this._resultFields.length !== 0){
            if(!this._options.display.resultType)
               this._options.display.resultType = 'leaves';
            this._options.filterParams["_Итоги"] = {
               'ПоляРасчета': this._resultFields,
               'ВидРасчета': this._resultTypes[this._options.display.resultType]
            };
            this._systemParams["_Итоги"] = this._currentFilter["Итоги"] = this._options.filterParams["_Итоги"];
         } else {
            delete this._systemParams["_Итоги"];
         }
      },
      /**
       * Проверяет, можно ли создать опции записи и устанавливает соответствующий флаг
       */
      _checkRowOptions: function(){
         if(this._options.display.rowOptions){
            if(!this._rowOptionsInitialized){
               this._rowOptionsInitialized = true;
               this._initRowOptions();
            }
         }
      },
      _initActionsFlags: function(){
         $ws.proto.Browser.superclass._initActionsFlags.apply(this, arguments);
         var vtTree = this._options.display.viewType === 'tree' && this._turn === '',
             self = this;
         this._actions['clearSorting'] = !vtTree && this._options.display.useSorting && $.proxy(self.clearSorting, self);
         this._actions['print'] = $.proxy(self._showReportsListForList, self);
         this._actions['printRecord'] = !Object.isEmpty(this._options.reports) && function(row, isRowOptions, event){
            var record;
            if(row instanceof Object && 'jquery' in row){
               if(self._printMenuIsShow){
                  self._printMenu.show(event);
                  self._createPrintMenu([]);
                  self._printMenuIsShow = false;
               } else {
                  record = self._currentRecordSet.getRecordByPrimaryKey(row.attr('rowkey'));
                  self._showReportsListForRecord(record, row, event);
               }
            }
            else{
               self._showReportsListForRecord();
            }
         };
      },
      /**
       * Фильтрует то, что должно попасть в состояние
       * @param {Object} filter Фильтр браузера
       * @protected
       */
      _filterState: function(filter){
         $ws.proto.Browser.superclass._filterState.apply(this, arguments);
         if(this.isTree() && filter[this._hierColumnParentId] !== undefined ){
            delete filter[this._hierColumnParentId];
         }
      },
      /**
       * Обработка нажатия на колонку с редактированием по месту
       * @param {Object} event Объект события
       * @param {jQuery} td ячейка, по которой кликнули
       */
      _onEditColumnClick: function(event, td){
         /*if(this._checkEditAtPlace(event)){
            return;
         }*/
         this._onClickHandler(event);
         this._startEditTd(td, event);
         event.stopImmediatePropagation();
         event.preventDefault();
      },
      /**
       * Включает редактирование по месту для указанного элемента (ов)
       * @param {jQuery} element Ячейки, для которых нужно включить редактирование по месту
       */
      _enableEditCells: function(element){
         element.each(function(number, cell){
            $(cell).addClass('ws-browser-edit-column').attr('colindex', cell.cellIndex);
         });
      },
      /**
       * Выключает редактирование по месту для указанного элемента (ов)
       * @param {jQuery} element Ячейки, для которых нужно выключить редактирование по месту
       */
      _disableEditCells: function(element){
         element.removeClass('ws-browser-edit-column').removeAttr('colindex');
      },
      /**
       * Включает/выключает возможность редактирования по месту
       * @param {String} rowkey Первичный ключ записи
       * @param {Boolean} enabled Включаем или выключаем
       * @param {String} [columnName] Имя колонки, в которой меняем возможность редактирования по месту. Если не указано, то влияет на всю строку
       */
      setCellsEditEnabled: function(rowkey, enabled, columnName){
         var object = this._disabledEditCells[rowkey];
         if(columnName){
            var td = this._findCell(rowkey, columnName);
            if(enabled){
               if(object !== undefined){
                  if(Object.isEmpty(object)){
                     for(var i in this._columnMap){
                        if(this._columnMap.hasOwnProperty(i) && this._columnMap[i].title !== columnName){
                           object[this._columnMap[i].title] = true;
                        }
                     }
                  }
                  else{
                     delete object[columnName];
                     if(Object.isEmpty(object)){
                        delete this._disabledEditCells[rowkey];
                     }
                  }
                  this._enableEditCells(td);
               }
            }
            else{
               if(object === undefined || !Object.isEmpty(object)){
                  if(object === undefined){
                     this._disabledEditCells[rowkey] = object = {};
                  }
                  object[columnName] = true;
                  this._disableEditCells(td);
               }
            }
         }
         else{
            var cells = this._findRow(rowkey).children();
            if(enabled){
               delete this._disabledEditCells[rowkey];
               this._enableEditCells(cells);
            }
            else{
               this._disabledEditCells[rowkey] = {};
               this._disableEditCells(cells);
            }
         }
      },
      /**
       * Находит строчку с указанным ключом
       * @param {String} rowkey Первичный ключ записи
       * @private
       */
      _findRow: function(rowkey){
         var row =  this._rowsMap[rowkey] ? this._rowsMap[rowkey] : this._body.find('tr[rowkey="' + rowkey + '"]');
         if(!row || !row.length){
            $ws.single.ioc.resolve('ILogger').error("Browser", "Cannot find row with rowkey " + rowkey);
         }
         return row;
      },
      /**
       * Есть ли указанная строка в браузере
       * @param {String} rowkey Идентификатор записи
       * @return {Boolean}
       * @protected
       */
      _haveRow: function(rowkey){
         return !!this._rowsMap[rowkey];
      },
      /**
       * Находит ячейку с указанным ключом записи и названием колонки
       * @param {String} rowkey Первичный ключ записи
       * @param {String} columnName Название колонки
       * @return {jQuery}
       */
      _findCell: function(rowkey, columnName){
         var cellIndex = this._columnIndex(columnName);
         if(cellIndex >= 0){
            return this._findRow(rowkey).children('td:eq(' + cellIndex + ')');
         }
         $ws.single.ioc.resolve('ILogger').error("Browser", "Cannot find column with name " + columnName);
         return $();
      },
      /**
       * Начинает редактирование по месту указанной ячейки
       * @param {String} rowkey Ключ необходимой записи
       * @param {String} columnName Название колонки, в которой будет происходить редактирование по месту
       */
      editCell: function(rowkey, columnName){
         var td = this._findCell(rowkey, columnName);
         if(td.length){
            this._startEditTd(td);
         }
         else
         {
            $ws.single.ioc.resolve('ILogger').error("Browser", "Cannot find cell with rowkey " + rowkey + " and column name " + columnName);
         }
      },
      /**
       * Начинает редактировать ячейку, перед этим необходимо вычитать запись
       * @param {jQuery} td Ячейка, которая будет редактироваться
       * @param {Object} [event] Объект события
       */
      _startEditTd: function(td, event){
         if(this._options.display.readOnly === true)
            return;
         var self = this,
            row = td.parent(),
            rowkey = row.attr('rowkey'),
            cellIndex = td.length ? td[0].cellIndex : 0,
            edit = function(){
               self.setActiveElement(row);
               $ws.core.setCursor(false);
               return $ws.helpers.callbackWrapper(function(){
                  if(self._editAtPlaceRecord && self._isIdEqual(rowkey, self._editAtPlaceRecord.getKey())){
                     return self._editAtPlaceRecord;
                  }
                  var editableRecord = self._notify('onBeforeRead', rowkey);
                  if(editableRecord instanceof $ws.proto.Deferred || editableRecord instanceof $ws.proto.Record){
                     return editableRecord;
                  }
                  else if(rowkey == self._addAtPlaceRecordId && self._addAtPlace){
                     return self._addAtPlaceRecord;
                  }
                  else{
                     return self._currentRecordSet.readRecord(rowkey);
                  }
               }(), function(record){
                  $ws.core.setCursor(true);
                  self._editTdAtPlace(record, td, cellIndex, event);
               });
            };

         this._runInBatchUpdate("", function() {
            var result = undefined;
            if(this._editAtPlaceRecord){
               this._editTdClearTimer();
               if(!this._isIdEqual(this._editAtPlaceRecord.getKey(), rowkey)){
                  if(!this._editAtPlaceValidationErrors){
                     result = this._editTdUpdateRecord().addCallback(edit).addErrback(function(){
                        if(self._editAtPlaceField){
                           self._editAtPlaceField.setActive(true);
                        }
                     });
                  }
               }
               else{
                  this._editTdDestroyField();
                  result = edit();
               }
            } else if(!this._editAtPlaceValidationErrors){
               result = edit();
            }
            return result;
         });
      },
      /**
       * Скрывает данные внутри ячейки, которую собираются редактировать
       * @param {jQuery} cellContainer Контейнер, внутри которого находятся данные
       */
      _editTdHideContents: function(cellContainer){
         for(var s = 0, nodes = cellContainer[0].childNodes, cnt = nodes.length; s < cnt; s++){
            if(nodes[s].nodeType == $ws._const.nodeType['TEXT_NODE']){
               nodes[s].data = "";
            }
            else{
               var $chNodes = $(nodes[s]);
               if($chNodes.hasClass('ws-browser-expander-container') || $chNodes.hasClass('ws-browser-text-no-render') ||
                  $chNodes.hasClass('ws-browser-text-container')){
                  $chNodes.css({
                     "display": "none"
                  });
               }
               else{
                  $chNodes.remove();
                  --s;
                  --cnt;
               }
            }
         }
      },
      /**
       * Обраюатывает нажатие enter'а во время редактирования по месту
       */
      _editTdKeyEnter: function(){
         if(this._editTdRecordCanSetData()){
            var td = this._editAtPlaceCell,
               thisTR = td.closest('tr'),
               nextTR = thisTR,
               cell = undefined,
               colIndex = td[0].cellIndex;
            while(!cell || !cell.length){
               nextTR = nextTR.next();
               if(!nextTR.length){
                  break;
               }
               cell = nextTR.find('td[colIndex=' + td[0].cellIndex + ']');
            }
            if(!this._editAtPlaceValidationErrors){
               if(cell && cell.length){
                  this._startEditTd(cell);
               }
               else{
                  var self = this;
                  this._editTdSaveRecord().addBoth(function(){
                     self._editTdDestroyField();
                     if(self._editAtPlaceChanges){
                        if(self._options.display.reload)
                           self.reload();
                        else if(!cell)
                           self.refresh();
                     }
                  });
               }
            }
         }
      },
      /**
       * Обрабатывает нажатие клавиши escape во време редактирования по месту
       */
      _editTdCancel: function(){
         if(this._editAtPlaceField){
            this._runInBatchUpdate("", function() {
               this._editAtPlaceRecord.rollback();
               var value = this._editAtPlaceRecord.get(this._columnMap[this._editAtPlaceCell.get(0).cellIndex].field);
               this._editAtPlaceField.setValue(value);
               this._editTdDestroyField();
               this._editAtPlaceValidationErrors = 0;
               if(this._isIdEqual(this._editAtPlaceRecord.getKey(), this._addAtPlaceRecordId) && this._addAtPlace){
                  this._addAtPlaceCancel();
               }
               else if(this._options.display.reload && this._editAtPlaceChanges){
                  this._editAtPlaceChanges = false;
                  this.reload();
               }
               this._getElementToFocus().focus();
            });
         }
      },
      /**
       * Возвращает всё назад при редактировании по месту
       * //TODO порефакторить это место, объеденить с предыдущей функцией, выяснить, зачем нужно устанавливать значение в поле при нажатии esc. Сделано в данный момент так, чтобы ничего не сломалось в 3.3.1
       * @private
       */
      _editTdCancelEdit: function(){
         this._editAtPlaceRecord.rollback();
         this._editAtPlaceValidationErrors = 0;
         var parentTR = this._editAtPlaceCell.closest('tr'),
            fieldContainer,
            colDef = this._columnMap[this._editAtPlaceCellIndex],
            data = this._renderTD(colDef, this._editAtPlaceRecord);
         if(this.isHierarchyMode() && this._editAtPlaceCellIndex === 0){
            fieldContainer = this._editAtPlaceCell.find('.ws-browser-text-container');
         }
         else{
            fieldContainer = this._editAtPlaceCell.find('.ws-browser-cell-container');
         }
         this._appendDataToCellContainer(fieldContainer, data, this._editAtPlaceRecord.get(this._hierColumnIsLeaf) === true,
            !!colDef.render, colDef.allowEditAtThePlace, parentTR.attr("rowkey"), parentTR.attr("parentid"));
         if(this._isIdEqual(this._editAtPlaceRecord.getKey(), this._addAtPlaceRecordId) && this._addAtPlace){
            this._addAtPlaceCancel();
         }
         else if(this._options.display.reload && this._editAtPlaceChanges){
            this._editAtPlaceChanges = false;
            this.reload();
         }
         this._getElementToFocus().focus();
      },
      /**
       * Обрабатывает нажатие tab'а при редактировании по месту
       * @param {Object} e Объект события
       */
      _editTdKeyTab: function(e){
         var normalDirection = !e.shiftKey,
            nextTD,
            td = this._editAtPlaceCell;
         nextTD = td;
         var anotherRow = false;
         while(true) {
            if(nextTD.length){
               nextTD = nextTD[normalDirection ? 'next' : 'prev']('td');
            }
            else{
               anotherRow = true;
               nextTD = td.closest('tr')[normalDirection ? 'nextAll' : 'prevAll']('.ws-visible:first')
                  .find(normalDirection ? 'td:first' : 'td:last');
               if(!nextTD.length){
                  break;
               }
            }
            if (nextTD.length) {
               td = nextTD;
            }
            if (nextTD.hasClass('ws-browser-edit-column')){
               break;
            }
         }
         if(this._editTdRecordCanSetData() || !anotherRow){
            if(nextTD && nextTD.length){
               this._editTdFieldValueChange();
               this._startEditTd(nextTD, e);
            }
            else{
               this._editTdUpdateRecordAndReload();
            }
         }
      },
      /**
       * Создаём конфигурацию для поля, используемого в редактировании по месту
       * @param {Object} colDef Опции колонки данного поля
       * @param {Number} width Ширина контейнера
       * @param {Number} height Высота контейнера
       */
      _editTdFieldConfig: function(colDef, width, height){
         var config = {
            name: colDef.field,
            width: width,
            linkedContext: new $ws.proto.Context().setPrevious(this.getLinkedContext()),
            parent: this.getParent(),
            validators: colDef.validators,
            tabindex: -1
         };
         if(colDef.type === "Текст"){
            config["height"] = height;
         } else if(colDef.type === "Число целое" || colDef.type === "Число вещественное" || colDef.type === "Деньги"){
            config["maxlength"] = 255;
            config["delimiters"] = colDef.type === "Деньги";
            if(colDef.type === "Число вещественное")
               config["decimals"] = colDef.decimals || 9;
            else if(colDef.type === "Деньги")
               config["decimals"] = 2;
         } else if(colDef.type === "Дата и время"){
            config["mask"] = colDef.maskField ? colDef.maskField : "DD.MM.YY HH:II";
         } else if(colDef.type === "Дата"){
            config["mask"] = colDef.maskField ? colDef.maskField : "DD.MM.YY";
         } else if(colDef.type === "Время"){
            config["mask"] = colDef.maskField ? colDef.maskField : "HH:II";
         } else if(colDef.type === "Логическое"){
            config["caption"] = "";
         } else if(colDef.type === "Флаги"){
            var flagsList = this.getActiveRecord().get(colDef.field).getColumns(),
               flags = {};
            for(var j = 0, k = flagsList.length; j < k; j++){
               flags[flagsList[j]] = {
                  caption: flagsList[j],
                  isThirdPosition: true
               };
            }
            config["elements"] = flags;
         } else {
            config["maxlength"] = 255;
            config["inputFilter"] = colDef.inputFilter;
         }
         return config;
      },
      /**
       * Инициализирует поле редактирования по месту
       * @param {$ws.proto.Control} instance Контрол, который получился
       * @param {Object} [event] Объект события
       */
      _editTdInitField: function(instance, event){
         var container = instance.getContainer(),
            cell = container.closest('td'),
            parentTR = cell.parent(),
            colDef = this._columnMap[this._editAtPlaceCellIndex];
         container.height('').addClass('clearfix');
         var h = container.outerHeight();
         cell.find('div.ws-browser-cell-container').height(h);
         parentTR.height(h);
         instance.getContainer().height(h);
         instance.setActive(true);
         instance.getLinkedContext().setContextData(this._editAtPlaceRecord);
         var inputElement = instance.getContainer().find('.ws-field :first-child')[0];
         if ($ws._const.browser.isIE && inputElement.createTextRange){ // устанавливаем курсор в IE
            inputElement.createTextRange().select();
         } else {// и в нормальных браузерах
            if($.browser.opera){
               var range = document.createRange();
               range.selectNode(inputElement);
               window.getSelection().addRange(range);
            } else {
               if(typeof(inputElement.select) == 'function')
                  inputElement.select();
            }
         }

         this._editAtPlaceField = instance;
         this._notifyOnSizeChanged(this, this, true);
      },
      /**
       * Включает редактирование ячейки по месту
       * @param {$ws.proto.Record} record Запись
       * @param {jQuery} td Ячейка
       * @param {Number} colIndex Номер столбца
       * @param {Object} [event] Объект события
       */
      _editTdAtPlace: function(record, td, colIndex, event){
         this._runInBatchUpdate("", function() {
            var self = this,
               editContainer = $("<div class='ws-browser-edit-field' />"),
               colDef = this._columnMap[colIndex],
               fieldContainer = td.find('div.ws-browser-cell-container'),
               parentTR = td.closest('tr'),
               width = td.find('.ws-browser-cell-container').width(),
               height = fieldContainer.height(),
               rowkey = parentTR.attr("rowkey");

            if(fieldContainer.hasClass('ws-browser-validation-error')){
               self._editAtPlaceWithValidationError = true;
               fieldContainer.removeClass('ws-browser-validation-error');
            }
            else{
               self._editAtPlaceWithValidationError = false;
            }

            fieldContainer.removeClass('ws-browser-div-cut')
               .addClass('ws-browser-has-edit-field');

            this._editAtPlaceCellIndex = colIndex;
            this._editAtPlaceRecord = record;
            this._editAtPlaceCell = td;

            parentTR.addClass('ws-browser-editable-row');

            editContainer.css({
               width: width,
               height: height,
               position : "relative"
            });
            this._editTdHideContents(fieldContainer);
            editContainer.data("fieldIndex", colIndex);
            editContainer.data("oldFieldContainerHeight", fieldContainer.height());
            editContainer.data("oldTrHeight", parentTR.height());
            fieldContainer.prepend(editContainer);

            if(!this._editAtPlaceFocusCallback){
               this._editAtPlaceFocusCallback = $.proxy(this._editTdFocusLost, this);
               $('body').bind('click.edit_' + this.getId(), this._editAtPlaceFocusCallback);
            }

            var fieldConfig = this._editTdFieldConfig(colDef, width, height),
                fieldType = self._fieldTypesForEdit[colDef.type] ? self._fieldTypesForEdit[colDef.type] : self._fieldTypesForEdit["Строка"];
            fieldConfig['element'] = editContainer;
            fieldConfig['handlers'] = {
               onKeyPressed: function(event, e){
                  if(e.which === $ws._const.key.insert){
                     e.stopPropagation();
                     e.preventDefault();
                  }
                  if(e.which === $ws._const.key.enter || e.which === $ws._const.key.esc || e.which === $ws._const.key.tab){
                     e.stopPropagation();
                     e.preventDefault();
                     if(e.which === $ws._const.key.enter){
                        self._editTdKeyEnter();
                     }
                     else if(e.which === $ws._const.key.esc){
                        self._editTdCancel();
                     } else { //key.tab
                        self._editTdKeyTab(e);
                     }
                  }
                  return false;
               },
               onFocusOut: this._editAtPlaceFocusCallback
            };

            var newField = self._notify("onBeforeEditColumn", record, fieldType, fieldConfig);
            if(newField && newField instanceof Array && newField.length == 2){
               fieldType = newField[0];
               fieldConfig = newField[1];
            }

            return $ws.core.attachInstance('Control/' + fieldType, fieldConfig).addCallback(function(instance){
               self._editTdInitField(instance, event);
            });
         });
      },
      _showEmptyDataBlock: function(){
         if(this._options.display.allowAddAtThePlace){
            var wsBrowser = this._container.find('.ws-browser');
            if(wsBrowser.find('tr').size() === 1) {
               this._emptyDataBlock.removeClass('ws-hidden');
               this._heightChangedIfVisible();
            }
         }
      },
      /**
       * Обработчик потери фокуса во время редактирования по месту
       */
      _editTdFocusLost: function(){
         if(this._editAtPlaceField){
            var self = this;
            this._editTdFieldValueChange();
            this._editTdDestroyField();
            if(!this._editAtPlaceValidationErrors){
               this._editAtPlaceTimer = setTimeout(function(){
                  self._editTdUpdateRecordAndReload();
               }, $ws._const.Browser.editAtPlaceWait);
            }
         }
         this._showEmptyDataBlock();
      },
      /**
       * Отменяет таймер ухода фокуса с поля ввода редактирования по месту
       * @private
       */
      _editTdClearTimer: function(){
         if(this._editAtPlaceTimer){
            clearTimeout(this._editAtPlaceTimer);
            this._editAtPlaceTimer = undefined;
         }
      },
      _editTdFieldValueChange: function(){
         var key = this._editAtPlaceRecord.getKey(),
             recordInList = this._currentRecordSet.contains(key) && this._currentRecordSet.getRecordByPrimaryKey(key),
             colDef = this._columnMap[this._editAtPlaceCellIndex];
         this._notify('onFieldChange', this._editAtPlaceRecord, colDef.field, colDef.title, this._editAtPlaceRecord.get(colDef.field), recordInList ? recordInList.get(colDef.field) : null);
      },
      /**
       * Обновляет данные в записи в редактировании по месту
       * @returns {Boolean} Можно ли установить значение и переходить к следующему полю
       */
      _editTdRecordCanSetData: function(){
         if(!this._editAtPlaceField){
            return true;
         }
         if(this._editAtPlaceField.validate()){
            return true;
         }else{
            this._editAtPlaceField.setActive(true);
            return false;
         }
      },
      /**
       * Сохраняет запись, которая редактировалась по месту
       * @returns {$ws.proto.Deferred}
       */
      _editTdSaveRecord: function(){
         var self = this,
             record = this._editAtPlaceRecord;
         if(this._editAtPlaceValidationErrors === 0){
            var flag = this._notify('onBeforeUpdate', record);
            if(typeof(flag) !== 'boolean'){
               if(this._addAtPlace && this._isIdEqual(this._addAtPlaceRecordId, record.getKey())){
                  return this._addAtPlaceOk();
               }
               else{
                  $ws.core.setCursor(false);
                  this._isUpdatingRecords = true;
                  this._editAtPlaceChanges = true;
                  var res = new $ws.proto.Deferred(),
                     loader = this._container.find('.ws-browser-ajax-loader').removeClass('ws-hidden'),
                     updateDeferred;
                  $ws.helpers.clearSelection();
                  updateDeferred = record.update();
                  updateDeferred.addBoth(function(result){
                     loader.addClass('ws-hidden');
                     $ws.core.setCursor(true);
                     self._isUpdatingRecords = false;
                     if(updateDeferred.isSuccessful()){
                        self._editTdFieldValueChange();
                        var key = self._editAtPlaceRecord.getKey(),
                           recordInList = self._currentRecordSet.contains(key) && self._currentRecordSet.getRecordByPrimaryKey(key);
                        if(recordInList){
                           var columns = recordInList.getColumns();
                           for(var i = 0; i < columns.length; ++i){
                              if(record.hasColumn(columns[i])){
                                 recordInList.set(columns[i], record.get(columns[i]));
                              }
                           }
                        }
                        self._editAtPlaceRecord = undefined;
                        self._notify('onRecordsChanged');
                        res.callback();
                     }
                     else{
                        record.rollback();
                        $ws.core.alert("Данные не были обновлены!");
                        self._editAtPlaceRecord = undefined;
                        res.errback(result);
                     }
                     return result;
                  });
                  return res;
               }
            }
            if(flag === true){
               this._addAtPlaceRecordId = undefined;
               return new $ws.proto.Deferred().callback();
            }
         }
         if(flag === true){
            this._endAddAtPlace();
            return new $ws.proto.Deferred().callback();
         } else
            return new $ws.proto.Deferred().errback();
      },
      /**
       * Обновляет запись, редактируемую по месту, и обновляет браузер, если нужно
       * @return {$ws.proto.Deferred}
       * @private
       */
      _editTdUpdateRecordAndReload: function(){
         var self = this;
         return this._editTdUpdateRecord().addCallbacks(function(){
            if(self._options.display.reload && self._editAtPlaceChanges === true){
               self._editAtPlaceChanges = false;
               self.reload();
            }
         }, function(){
            if(self._editAtPlaceField){
               self._editAtPlaceField.setActive(true);
            }
         });
      },
      /**
       * Обновляет запись, которая редактируется по месту
       * @returns {$ws.proto.Deferred}
       */
      _editTdUpdateRecord: function(){
         if(this._editTdRecordCanSetData()){
            this._editTdDestroyField();
            if(this._addAtPlace || this._editAtPlaceRecord.isChanged()){
               if(this._options.display.askConfirmSaving){
                  var self = this,
                     res = new $ws.proto.Deferred();
                  $ws.core.attachInstance('SBIS3.CORE.DialogConfirm', {
                     resizable: false,
                     message: "Сохранить изменения?",
                     handlers: {
                        onConfirm: function(event, result){
                           if(result){
                              self._editTdSaveRecord().addCallback(function(){
                                 res.callback();
                              });
                           }
                           else{
                              self._editTdCancelEdit();
                           }
                        }
                     }
                  });
                  return res;
               }
               else{
                  return this._editTdSaveRecord();
               }
            }
            else{
               return new $ws.proto.Deferred().callback();
            }
         }
         return new $ws.proto.Deferred().errback();
      },
      /**
       * Уничтожает поле редактирования по месту
       */
      _editTdDestroyField: function(){
         this._editTdClearTimer();
         if(!this._editAtPlaceField){
            return;
         }
         this._runInBatchUpdate("", function() {
            var editContainer = this._editAtPlaceField.getContainer(),
                parentTR = editContainer.closest('tr'),
                fieldContainer = editContainer.parent(),
                fieldIndex = parseInt(editContainer.data("fieldIndex"), 10),
                colDef = isNaN(fieldIndex) ? false : this._columnMap[fieldIndex];
            // Если colDef === false, то значит мы разрушаем поле при разрушении браузера, делаем только то, что можем
            parentTR.removeClass('ws-browser-editable-row');
            editContainer.parent().height(editContainer.data("oldFieldContainerHeight"));
            parentTR.height(editContainer.data("oldTrHeight"));
            editContainer.height(editContainer.data("oldFieldContainerHeight"));

            if(!this._options.display.cutLongRows){
               fieldContainer.removeClass('ws-browser-div-cut');
            }

            var validated = this._editAtPlaceField.validate(),
                wasError = this._editAtPlaceWithValidationError;
            if(!wasError && !validated){
               if(++this._editAtPlaceValidationErrors === 1 && this._addAtPlaceLinkRow){
                  this._addAtPlaceLinkRow.addClass('ws-browser-add-disabled');
               }
               this._editAtPlaceValidationMap[fieldIndex] = true;
            }
            else if(wasError && validated){
               if(--this._editAtPlaceValidationErrors === 0 && this._addAtPlaceLinkRow){
                  this._addAtPlaceLinkRow.removeClass('ws-browser-add-disabled');
               }
               delete this._editAtPlaceValidationMap[fieldIndex];
            }

            this._editAtPlaceField.unsubscribe('onFocusOut', this._editAtPlaceFocusCallback);
            this._editAtPlaceField.destroy();
            this._editAtPlaceField = null;

            if(this._options.display.ladder.length !== 0){
               this.refresh();
            } else if(this._editAtPlaceRecord && colDef){
               var data = this._renderTD(colDef, this._editAtPlaceRecord);
               fieldContainer.attr('title', (data instanceof Object && 'jquery' in data) ? data.text() :
               ((data === null || data === undefined) ? '' : data));
               fieldContainer.removeClass('ws-browser-has-edit-field');
               for(var i = 0, childNodes = fieldContainer.children(), l = childNodes.length; i < l; i++){
                  var child = $(childNodes[i]);
                  if(child.hasClass('ws-browser-expander-container') || child.hasClass('ws-browser-text-no-render') ||
                     child.hasClass('ws-browser-text-container'))
                     child.css({
                        "display" : "block"
                     });
               }

               if(this._editAtPlaceValidationMap[fieldIndex]){
                  fieldContainer.addClass('ws-browser-validation-error');
               }
               if(this.isHierarchyMode() && fieldIndex <= 0){
                  fieldContainer = parentTR.find(".ws-browser-text-container");
               }
               var editModeIsDialog = this._options.editMode == "newDialog" && (this.isHierarchyMode() ? this._options.editBranchMode : true),
                   editRecordIsBranch = editModeIsDialog ? false : this.isHierarchyMode() && this._editAtPlaceRecord.get(this._hierColumnIsLeaf) === true;
               this._appendDataToCellContainer(fieldContainer, data, editRecordIsBranch,
                     !!colDef.render, colDef.allowEditAtThePlace, parentTR.attr("rowkey"), parentTR.attr("parentid"));
            }

            this._notifyOnSizeChanged(this, this, true);
         });
      },
      /**
       * Раскрывает все ветки дерева при отображении браузера в режиме дерева
       */
      openAll: function(){
         return this._runInBatchUpdate('Browser.openAll', function() {
            var self = this;
            if(this._options.display.viewType === "tree"){
               $(this._body).find('tr.ws-browser-folder').each(function(){
                  var rowkey = $(this).attr('rowkey');
                  rowkey = rowkey === "null" ? null : rowkey;
                  self._expanded[rowkey] = true;
               });
               this._reloadBody();
            }
         });
      },
      /**
       * Отображает диалог редактирования записи. Сам
       * @param {Number} recordId Идентификатор запись
       * @param {Boolean} isBranch узел или лист
       * @param {Number} parentId идентификатор родителя отображаемой записи
       */
      _showRecordDialog: function(recordId, isBranch, parentId, isCopy, addChildElement) {
         this._isInsertOnFolderInTree = false;
         /*if(this._options.display.viewType === 'tree' && recordId === undefined){
            var key = this.getFolderKeyForActiveRecord(addChildElement);
            if(key !== false && key !== undefined){
               arguments[2] = key;
            }
         }*/
         if(this._editAtPlaceValidationErrors || this._editAtPlaceField){
            return;
         }
         if(recordId === undefined && this._options.display.allowAddAtThePlace){
            this._createRowAtThePlace(parentId, isBranch, isCopy);
         }
         else{
            $ws.proto.Browser.superclass._showRecordDialog.apply(this, arguments);
         }
      },
      /**
       * Создаёт запись по месту
       * @param {String} parentId Идентификатор родителя
       * @param {Boolean} isBranch Является ли запись папкой
       * @param {Boolean} [isCopy] Является ли копией
       * @private
       */
      _createRowAtThePlace: function(parentId, isBranch, isCopy){
         if(this._editAtPlaceValidationErrors){
            return;
         }
         var self = this;
         var flag = this._notify('onBeforeInsert', parentId);
         if(flag !== false){
            $ws.helpers.callbackWrapper(this._beforeCreateRowAtThePlace(parentId), function(){
               var createRecord = function(){
                  $ws.core.setCursor(false);
                  self._readRecord(undefined, parentId, isBranch, isCopy).addCallback(function(record){
                     if(record instanceof $ws.proto.Record){
                        $ws.core.setCursor(true);
                        var parentIdChanged = false;
                        if(self.isHierarchyMode()){
                           var newParentId = record.get(self._hierColumnParentId);
                           if(newParentId != parentId){
                              parentId = newParentId;
                              parentIdChanged = true;
                           }
                        }
                        $ws.helpers.callbackWrapper(parentIdChanged && self.showBranch(parentId), function(){
                           self._addAtPlace = true;
                           self._addAtPlaceRecord = record;
                           self._addAtPlaceRecordId = record.getKey();
                           if(self._addAtPlaceRecordId === null){
                              self._addAtPlaceRecordId = 'null';
                           }
                           var after,
                              treelevel = 0;
                           if(self._options.display.viewType === 'tree'){
                              after = self._body.find('tr[rowkey="' + parentId + '"]:first');
                              treelevel = after.length ? (parseInt(after.attr($ws._const.Browser.treeLevelAttribute), 10) + 1) : 0;
                           }
                           if(!after || !after.length){
                              after = self._body.find('.ws-browser-add-at-place-link-row').prev('tr[rowkey]');
                           }
                           var row = $(self._createTR(record, treelevel, after));
                           row.addClass('ws-add-at-place');
                           if(isBranch){
                              row.find('.ws-browser-expander').removeClass('ws-browser-expander minus').addClass('folder');
                           }
                           if(after && after.length){
                              row.insertAfter(after);
                           }
                           else{
                              self._body.prepend(row);
                           }
                           if(self._count === 0){
                              self._emptyDataBlock.addClass('ws-hidden');
                           }
                           self._heightChangedIfVisible();
                           self.zebraBody(self._options.display.hasZebra);
                           self._addAtPlaceRow = row;
                           self.setActiveRow(row);
                           for(var i in self._columnMap){
                              if(self._columnMap.hasOwnProperty(i)){
                                 if(self._columnMap[i].allowEditAtThePlace){
                                    var td = row.find('td[colindex=' + i + ']');
                                    if(td.length){
                                       self._editTdAtPlace(record, td, i);
                                       break;
                                    }
                                 }
                              }
                           }
                        });
                     }
                  });
               };
               var deferred = (self._editAtPlaceRecord &&
                  self._editTdRecordCanSetData() &&
                  self._editTdUpdateRecordAndReload()) || !self._editAtPlaceField;
               if(deferred){
                  $ws.helpers.callbackWrapper(deferred, createRecord);
               }
               else if(self._editAtPlaceField){
                  self._editAtPlaceField.setActive(true);
               }
            });
         }
      },
      /**
       * Обработчик нажатия на кнопку "сохранить" в добавлении по месту
       * @returns {$ws.proto.Deferred} Deferred готовности новой записи
       * @private
       */
      _addAtPlaceOk: function(){
         var result = this._addAtPlaceRecord.update(),
            self = this;
         /**
          * Колбек на обновление записи - при сохранении мы получим её идентификатор в resultId
          */
         this._isUpdatingRecords = true;
         this._editAtPlaceChanges = true;
         result.addCallback(function(resultId){
            //Нужно перечитать запись - могли измениться расчётные поля
            self._currentRecordSet.readRecord(resultId,
                  self._options.dataSource.readerParams.linkedObject + '.Список').addCallback(function(record){
               self._isUpdatingRecords = false;
               var old = self._body.find('.ws-add-at-place'),
                  treelevel = old.attr($ws._const.Browser.treeLevelAttribute),
                  row = $(self._createTR(record, treelevel));
               row.insertAfter(old);
               var selection = old.find('.ws-browser-row-selection');
               if(selection.length){
                  self.setActiveElement(row);
               }
               old.remove();
               return record;
            });
            return resultId;
         });
         this._endAddAtPlace();
         return result;
      },
      /**
       * Обработчик нажатия на кнопку "отмена" в добавлении по месту
       * @private
       */
      _addAtPlaceCancel: function(){
         this._addAtPlaceRecord.destroy();
         this._addAtPlaceRow.empty().remove();
         this._endAddAtPlace();
      },
      /**
       * Заканчивает работу добавления по месту - удаляет кнопки, ставит флаги и т. д.
       * @private
       */
      _endAddAtPlace: function(){
         if(this._count === 0){
            this._emptyDataBlock.removeClass('ws-hidden');
         }
         this._addAtPlace = false;
         this._addAtPlaceRecord = undefined;
         this._addAtPlaceRow = undefined;
         if(!this._options.display.reload){
            this._createAddAtPlaceLinkRow(this._body);
         }
         this._heightChangedIfVisible();
      },
      /**
       * Выполняет действия перед вставкой по месту
       * @param {String} parentId Идентификатор родителя
       * @return {$ws.proto.Deferred|null}
       * @private
       */
      _beforeCreateRowAtThePlace: function(parentId){
         var isRoot = this._isIdEqual(this._rootNode, parentId);
         if(this._options.display.viewType === 'tree' && !this._expanded[parentId]
            && (isRoot && this._options.display.showRoot || !isRoot)){
            return this._processTreeClick(parentId, false);
         }
         return null;
      },
      /**
       * Отмечает переданные записи.
       * Если передана только одна, то просто ставит на нее курсор.
       * Если записей много то они помечаются, а курсор ставится на первую.
       * @param {Array} args Массив ключей записей которые необходимо пометить.
       */
      setSelection : function(args){
         $ws.proto.Browser.superclass.setSelection.apply(this, arguments);
         this._rebuildPartialSelection();
      },
      /**
       * Снимает выделение с записей с указанными ключами
       * @param {Array} args Массив ключей записей с которых необходимо снять выделение
       */
      clearSelection : function(args){
         $ws.proto.Browser.superclass.clearSelection.apply(this, arguments);
         this._rebuildPartialSelection();
      },
      /**
       * Снимает всё выделение в браузере
       */
      removeSelection : function(){
         $ws.proto.Browser.superclass.removeSelection.apply(this, arguments);
         this._rebuildPartialSelection();
      },
      /**
       * Отмечает все записи как выбранные
       */
      selectAll: function(){
         if(this._options.selectChilds){
            this._selected = [];
            this._selectedRecords = [];
            var self = this,
               selectRecord = function(key){
                  self._selectRow(key);
                  var childs = self._currentRecordSet.recordChilds(key);
                  for(var i = 0; i < childs.length; ++i){
                     selectRecord(childs[i]);
                  }
               };
            selectRecord(this._rootNode);
            this._updatePager();
         }
         else{
            $ws.proto.Browser.superclass.selectAll.apply(this, arguments);
         }
      },
      setSelectionMode: function() {
         $ws.proto.Browser.superclass.setSelectionMode.apply(this, arguments);
      },
      isShow: function(rowkey){
         if(this._options.display.viewType == 'tree'){
            if(rowkey === this._rootNode)
               return true;
            else
               return this._turn === '' ? this._expanded[rowkey] !== undefined : this._body.find('tr[rowkey="' + rowkey + '"]').length !== 0;
         }
         else
            return $ws.proto.Browser.superclass.isShow.apply(this, arguments);
      },
      /**
       * Действия, которые нужно сделать при загрузке пути
       * @param {String} rowkey Ключ записи
       * @param {Boolean} noSelection Флаг того, что запись не нужно выделять
       */
      _showBranchAfterPathLoad: function(rowkey, noSelection){
         if(this._options.display.viewType === 'tree' && noSelection){
            this._selectAfterPathLoad = rowkey;
         }
      },
      /**
       * Разворачивает указанную ветку дерева по id парента
       * @param {String} rowkey идентификатор парента
       * @param {Boolean} noSelection Флаг того, что не нужно выделять запись
       * @returns {$ws.proto.Deferred|undefined}
       */
      _showBranchTree: function(rowkey, noSelection){
         if(this._isIdEqual(rowkey, this._rootNode)){
            if(!this._expanded[this._rootNode]){
               if(this._haveRow(rowkey)){
                  this._processTreeClick(rowkey, false);
               }
               if(!noSelection){
                  this.setActiveElement(this._body.find('tr[rowkey="' + rowkey + '"]'));
               }
            }
            return undefined;
         }
         var way = [],
             idpr = rowkey,
             record,
             fldBranchName = this._hierColumnIsLeaf,
             fldParentIdname = this._hierColumnParentId;
         if(idpr && idpr != this._rootNode && !this._currentRecordSet.contains(idpr)){//Запись не содержится в рекордсете - выходим
            return undefined;
         }
         record = this._currentRecordSet.getRecordByPrimaryKey(idpr);
         if(!record.get(fldBranchName))//Если это не папка, то возвращаемся на уровень вверх
            idpr = record.get(fldParentIdname) || null;
         //Теперь идём вверх до конца, запоминаем путь
         while(idpr && idpr != this._rootNode){
            way.push(idpr);
            if(this._currentRecordSet.contains(idpr))
               record = this._currentRecordSet.getRecordByPrimaryKey(idpr);
            else
               throw new Error('Something wrong with the showBranch!');

            idpr = record.get(fldParentIdname) || null;
         }
         if(this._options.mode === 'navigationMode'){
            this._closeOtherBranches(rowkey);
         }
         //Идём в обратном порядке, чтобы раскрывать ветки правильно
         for(var i = way.length - 1; i >= 0; --i){
            record = this._currentRecordSet.getRecordByPrimaryKey(way[i]);
            if(record.get(this._hierColumnIsLeaf) === false){
               rowkey = way[i];
               break;
            }
            if(!this._expanded[way[i]]){
               this._expanded[way[i]] = true;
            }
         }
         if(this._options.display.partiallyLoad && this._currentRecordSet.getRecordByPrimaryKey(rowkey).get(fldBranchName) && !this._loaded[rowkey]){
            var result = this._currentRecordSet.loadNode(rowkey, false),
               self = this;
            if(!noSelection){
               result.addCallback(function(){
                  self.setActiveElement(self._body.find('tr[rowkey="' + rowkey + '"]'));
               });
            }
            return result;
         }
         else{
            this._drawBody();
            this._updatePager();
         }
         if(!noSelection){
            this.setActiveElement(this._body.find('tr[rowkey="' + rowkey + '"]'));
         }
         return undefined;
      },
      /**
       * Разворачивает указанную ветку по id парента или делает активным, если указана не папка
       * @param {Number} rowkey идентификатор парента
       * @param {Boolean} noSelection Флаг того ,что не нужно выделять запись
       * @returns {$ws.proto.Deferred|undefined}
       */
      _showActiveFolderOrElement: function(rowkey, noSelection){
         if(this._options.display.viewType === 'tree'){
            return this._showBranchTree(rowkey, noSelection);
         }
         else{
            return $ws.proto.Browser.superclass._showActiveFolderOrElement.apply(this, arguments);
         }
      },
      /**
       * Закрывает ветку дерева
       * @param {String} rowkey Идентификатор строки
       */
      hideBranch: function(rowkey){
         if(this._options.display.viewType === 'tree' && this._turn === ''){
            this._processTreeClick(rowkey, true);
         }
      },
      /**
       * Задает маппинг колонок браузера, сливая в один массив все реально отображаемые колонки, с полным набором их параметров.
       */
      _mapColumns: function(){
         var
             configColumns = this._options.display.columns,
             recivedColumns = this._currentRecordSet.getColumns(),
             columns = configColumns ? configColumns : recivedColumns,
             pkColumnIndex = this._currentRecordSet.getPkColumnIndex(),
             num = 0;
         if(columns){
            for(var i in columns){
               if(columns.hasOwnProperty(i)){
                  var cur = columns[i],
                      field = cur.field ? cur.field : cur.title,
                      title = cur.title,
                      allowEditAtThePlace = configColumns && configColumns[i] ? configColumns[i].allowEditAtThePlace : false,
                      fieldType = recivedColumns[field] ? recivedColumns[field].type : (cur.type ? cur.type : null);
                  if(this._options.display.readOnly === true)
                     allowEditAtThePlace = false;
                  if(allowEditAtThePlace && recivedColumns[field] && recivedColumns[field].index === pkColumnIndex)
                     allowEditAtThePlace = false;
                  if(allowEditAtThePlace && fieldType === "Связь" || fieldType === "Файл" || fieldType === "Двоичное" || fieldType === "Символ")
                     allowEditAtThePlace = false;
                  this._columnMap[num] = {
                     title: title,
                     //isSortable: (!cur.render || (cur.field && cur.render)) && (cur.isSortable !== undefined ? cur.isSortable : true),
                     isSortable: cur.field !== undefined && (cur.isSortable !== undefined ? cur.isSortable : true),
                     field: field,
                     render: cur.render ? cur.render : null,
                     type: fieldType,
                     allowEditAtThePlace: allowEditAtThePlace === undefined ? false : allowEditAtThePlace,
                     fixedSize: cur.fixedSize ? cur.fixedSize : false,
                     isResultField: cur.isResultField === undefined ? false : cur.isResultField,
                     textAlign: cur.textAlign ? cur.textAlign : 'auto',
                     className: cur.className ? cur.className : '',
                     captionAlign: cur.captionAlign ? cur.captionAlign : 'auto',
                     captionRender: cur.captionRender ? cur.captionRender : null,
                     formatValue: cur.formatValue ? cur.formatValue : null,
                     validators: cur.validators ? cur.validators : [],
                     filterDialog: cur.filterDialog ? cur.filterDialog : null,
                     filterName: cur.filterName ? cur.filterName : title,
                     visualFilterFunction: cur.visualFilterFunction ? cur.visualFilterFunction : null,
                     verticalAlign: cur.verticalAlign ? cur.verticalAlign : null,
                     decimals: cur.decimals ? cur.decimals : 9,
                     inputFilter: cur.inputFilter ? cur.inputFilter : '',
                     minWidth: cur.minWidth || null,
                     useForFolder: cur.useForFolder ? cur.useForFolder : null
                  };
                  if(allowEditAtThePlace && (fieldType in {"Дата": 0, "Дата и время": 0, "Время": 0}))
                     this._columnMap[num].maskField = cur.maskField ? cur.maskField : null;
                  if(allowEditAtThePlace === true && !this._useEditAtThePlace)
                     this._useEditAtThePlace = true;
                  if(field === this._options.display.titleColumn)
                     this._titleColumnIndex = num;
                  this._columnMap[num].width = cur.width ? parseInt(cur.width, 10) : (this._getDefWidth(this._columnMap[num].type));
                  num++;
               }
            }
            this._createRowTemplates();
         }
      },
      /**
       * Возвращает индекс колонки, которая имеет определённое название
       * @param {String} name Название колонки
       * @return {Number}
       * @private
       */
      _columnIndex: function(name){
         for(var i in this._columnMap){
            if(this._columnMap.hasOwnProperty(i) && this._columnMap[i].title === name){
               return i;
            }
         }
         return -1;
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
      /**
       * возвращает узел, в котором добавили/отредактировали запись
       */
      _getNodeForRecordUpdate: function(record){
         if(this._options.display.viewType === 'tree' && this._turn === ''){
            if(!this._options.display.partiallyLoad){
               return this._rootNode;
            }
            var activeRecord = this.getActiveRecord();
            if(activeRecord){
               if(record){
                  var newParent = record.get(this._hierColumnParentId),
                        oldParent = activeRecord.get(this._hierColumnParentId);
                  if(newParent !== oldParent && this._currentRecordSet.contains(newParent)){
                     return [newParent, oldParent];
                  }
                  else{
                     return oldParent;
                  }
               }
               return this._isInsertOnFolderInTree ? activeRecord.getKey() : activeRecord.get(this._hierColumnParentId);
            }
            return record.get(this._hierColumnParentId);//this.getFolderKeyForActiveRecord();
         }
         else
            return !this._options.display.partiallyLoad ? this._rootNode :
      //      return this._options.display.viewType === 'tree' ? this.getActiveRecord().get(this._hierColumnParentId) :
               this._options.display.viewType === 'hierarchy' ? this._currentRootId :
                     $ws.proto.Browser.superclass._getNodeForRecordUpdate.apply(this, arguments);
      },
      /**
       * возвращает обработчики, которые необходимо применить к диалогу удаления записи
       */
      _getHandlersForDeleteRecordDialog: function(parent){
         var
               self = this,
               r;
         r = $ws.proto.Browser.superclass._getHandlersForDeleteRecordDialog.apply(this, arguments);
         r['onSuccess'] = function(){
            if(self._options.display.viewType === 'tree'){
               self._hovered = parent;
               self._activeElement = undefined;
            }
         };
         return r;
      },
      /**
       * Обработчик нажатия на заголовок браузера
       * @param {jQuery} event
       */
      _headCellClick: function(event){
         var columnId = event.data.columnId,
             self = event.data.self,
             field = self._columnMap[columnId].field,
             sortType = 0, //0 - по возрастанию, 1 - по убыванию, 2 - нету
             found = false;   //Найдена ли колонка в массиве

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

         var sortable = $(this).find('.ws-browser-sortable'),
             classNames = ['asc', 'desc', 'none'];
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
            self._currentRecordSet.setSorting(sorting, self.getQuery(), self._options.display.viewType === 'hierarchy');
         }
      },
      /**
       * Формирует шапку таблицы и выводит ее
       */
      _drawHead: function(){
         if(this._columnMap.length){
            return;
         }

         this._mapColumns();
         this._sortingMarkers = {};
         var max = 0, // количество столбцов
            head = [],
            i, j = -1,
            columnsCount = 0,
            csIndex = 0,
            headElement = null,
            cellElement,
            filterDiv;
         for (i in this._columnMap){
            if(this._columnMap.hasOwnProperty(i)){
               head[++j] = [];
               columnsCount++;
               var curr = this._columnMap[i].title,
                  count = 0,
                  columnName;
               do{//Заполняем массив заголовков. Записываем, учитывая иерархию все имена столбцов
                  /^([^\.]*)(\.?(.*)$|$)/.exec(curr);
                  if(RegExp.$3){
                     if(RegExp.$3.substr(0,1) === " " && (RegExp.$1.charAt(RegExp.$1.length - 1) !== '\\')){
                        columnName = RegExp.$1;
                        if(columnName.substr(-2) == "\\\\")
                           columnName = columnName.substr(0, columnName.length - 2);
                        columnName += ".";
                        /^([^\.]*)(\.?(.*)$|$)/.exec(RegExp.$3);
                        columnName += RegExp.$1;
                        if(RegExp.$3 === ""){
                           if(columnName.substr(-2) == "\\\\")
                              columnName = columnName.substr(0, columnName.length - 2);
                           columnName += ".";
                        }
                        head[j].push(columnName);
                        curr = RegExp.$3;
                     } else {
                        head[j].push(RegExp.$1);
                        curr = RegExp.$3;
                     }
                  }
                  else{
                     columnName = RegExp.$1 + RegExp.$2;
                     head[j].push(columnName);
                     curr=null;
                  }
                  /*head[j].push(RegExp.$1);
                  curr = RegExp.$2 ? RegExp.$3 : null;*/
               } while (curr);
               /*Возвращаем экранированные точки по принципу замены последнего '\\' в кусочке head[j]*/
               count = 0;
               while (count < head[j].length - 1){
                  if (head[j][count]!==''){
                     var str = head[j][count];
                     head[j][count] = head[j][count].replace(/\\\\\\./g,'\\.');//Ставим \.
                     if (str.charAt(str.length - 1) === '\\' && //Соединяем так как это не разделитель . а просто .
                         str.charAt(str.length - 2) === '\\') {
                        head[j][count] = head[j][count].replace(/\\\\$/,'.');
                        head[j][count] += head[j][count + 1];
                        head[j].splice(count + 1, 1);
                        count--;
                     }
                  }
                  count++;
               }
               //Внимание! нет проверки на последний \\ в массиве head[j]
               max = head[j].length > max ? head[j].length : max; //Считаем макс. кол-во колспанов/ровспанов или типа того
            }
         }
         this._rootElement.find('col').remove();
         if (columnsCount > 0){//Заполняем colgroup в шапке таблицы
            var cols = $ws.helpers.reduce(this._columnMap, function(resMemo, colMap) {
               var width;
               if ((colMap.fixedSize || this._haveAutoWidth()) && (width = colMap.width))
                  resMemo.push('<col width="', width, '"/>');
               else
                  resMemo.push('<col/>');
               return resMemo;
            }, [], this).join('');

            this._rootElement.find('colgroup').append(cols);
         }

         if(this._options.display.showHead){//формируем из строк шапку таблицы
            this._head.find('tr').empty().remove();
            var self = this;
            for (var n = 0; n < max; n++){
               var row = this._head.get(0).insertRow(-1);
               row.className = 'ws-browser-head-' + (n === 0 ? 'top' : 'bottom');
               j = -1;
               for (i in this._columnMap){
                  if(this._columnMap.hasOwnProperty(i)){
                     ++j;
                     if (head[j][n] !== undefined && (j === 0 || head[j][n] != head[j - 1][n])){
                        headElement = null;
                        var cs = j;
                        for (cs = j; cs < columnsCount && head[cs][n] == head[j][n]; cs++){
                        }
                        cs--;
                        var rs;
                        for (rs = n + 1; rs < max && head[j][rs] === undefined; rs++){
                        }
                        rs--;
                        var cell = $(row.insertCell(-1)).addClass('ws-browser-header-cell')
                                                        .attr('csIndex', csIndex);
                        if(this._columnMap[j] && this._columnMap[j].verticalAlign !== 'center'){
                           switch(this._columnMap[j].verticalAlign){
                              case 'bottom':
                                 cell.addClass('ws-browser-valign-bottom');
                                 break;
                              case 'top':
                                 cell.addClass('ws-browser-valign-top');
                                 break;
                           }
                        }
                        if(this._options.display.useSorting && rs + 1 == max && this._columnMap[i].isSortable){
                           cell.addClass('ws-browser-head-hover');
                           cell.bind('click', {'columnId': i, 'self': this}, this._headCellClick);
                        }
                        if(this._columnMap[i].captionAlign && this._columnMap[i].captionAlign !== 'auto')
                           cell.addClass('ws-browser-' + this._columnMap[i].captionAlign);
                        if ((cs == j && this._columnMap[i].type == "text")){
                           cell.addClass('ws-browser-text');
                        }
                        if (cs > j){
                           cell.attr('colspan', (cs - j + 1).toString());
                           csIndex += cs - j + 1;
                        }
                        else
                           csIndex++;
                        if (rs > n){
                           cell.attr('rowspan', (rs - n + 1).toString());
                        }
                        if (this._options.display.resizable){
                           if( j !== 0 && head[j + (cs - j)][n] !== ""){
                              cell.addClass('ws-browser-resizable')
                                  .append($('<span class="ws-browser-resize">&nbsp;</span>'));
                           }
                        }
                        var colName = "";
                        for(var k = 0; k <= n; k++){
                           colName += (k === 0 ? "" : "." ) + head[j][k]
                        }
                        if(typeof(this._columnMap[i].captionRender) == 'function'){
                           headElement = this._columnMap[i].captionRender.apply( this, [ colName ] );
                        } else if(typeof(this._options.display.headColumnRender) == 'function'){
                           headElement = this._options.display.headColumnRender.apply( this, [ colName ] );
                        }
                        headElement = headElement || head[j][n];
                        cell.append(cellElement = $('<div></div>'));

                        if(this._options.display.useSeparating === true && j < (head.length - 1))
                           cellElement.closest('td').addClass('ws-browser-separatable');
                        if(this._options.display.showSelectionCheckbox === true &&
                           !this._options.display.showRoot &&
                           j === 0 && n === (head[0].length - 1)){
                           var checkbox = $('<span class="ws-browser-checkbox"></span>');
                           checkbox.click(function(event){
                              var theadTr = $(this).closest('tr');
                              if(!theadTr.hasClass('ws-browser-selected')){
                                 self.selectAll();
                                 theadTr.addClass('ws-browser-selected');
                              }else{
                                 self.removeSelection();
                                 theadTr.removeClass('ws-browser-selected');
                              }
                              event.preventDefault();
                              event.stopPropagation();
                              return false;
                           });
                           cell.prepend(checkbox);
                        }

                        if(this._options.display.useSorting === true)
                           cellElement.append(this._sortingMarkers[this._columnMap[i].field] = $('<div class="ws-browser-sortable none"></div>'));
                        if(headElement instanceof Object && 'jquery' in headElement)
                           cellElement.append(headElement);
                        else{
                           if(!self._columnMap[j].filterDialog)
                              cellElement.append('<div>'+$ws.helpers.escapeHtml(headElement).replace(/\n/mg, '<br>')+'</div>');
                           else{
                              cellElement.append(filterDiv = $('<div></div>'));
                              filterDiv.append($('<a href="javascript:void(0)" class="ws-browser-head-link" hasFilter="true" id="'+i+'">'+headElement+'</a>' +
                                                 '<span class="ws-browser-filter" hasFilter="false"></span>'));
                              if(this._initialFilter)
                                 this._markFilteredColumn(this._initialFilter, i);
                              $('[hasFilter]', filterDiv[0]).live('click', function(event){
                                 var colDef,
                                     id;
                                 id = this.id ? this.id : $(this).prev('.ws-browser-head-link').attr('id');
                                 colDef = self._columnMap[id];
                                 if($(this).attr('hasFilter') === 'true')
                                    self.createFiltersDialog.apply(self, [colDef.filterDialog, id]);
                                 else
                                    self.resetFilterByColumnName.apply(self, [colDef.title]);
                                 event.preventDefault();
                                 event.stopPropagation();
                                 return false;
                              });
                           }
                        }
                     }
                  }
               }
               var td = row.insertCell(-1);
               td.innerHTML = '&nbsp';
               td.width = this._scrollWidth;
               td.style.display = "none";
               $(td).addClass('ws-browser-header-cell-scroll-placeholder');
            }
            if(typeof(this._options.display.headRender) == 'function')
               this._options.display.headRender.apply(this, [this._head]);
         }
         this._initHeadVariables();
      },
      /**
       *
       */
      _initHeadVariables : function(){
         $ws.proto.Browser.superclass._drawHead.apply(this, arguments);
         this._headColumns = this._head.parent().find('col');
         this._bodyColumns = this._body.parent().find('col');
         this._resultsColumns = this._rootElement.find('.ws-browser-foot.results').find('col');
         this._initColumnsWidth();
         if(this._options.display.resizable)
            this._initResizeEvents();
      },
      /**
       * Добавляет событие движения мыши для отрисовки опций строки
       */
      _initEvents: function(){
      $ws.proto.Browser.superclass._initEvents.apply(this, arguments);
         this._checkRowOptions();
         if(this._useEditAtThePlace === true)
            this.subscribe('onKeyPressed', this._onKeyPressedOnBrowser);

         var self = this,
             rowkey,
             parent = this._body.parent()[0];
         $('td.ws-browser-edit-column > div', parent).live('click', function(event){
            if(self.isEnabled())
               self._onEditColumnClick(event, $(this).closest('td'));
         });

         if((this._options.display.viewType === 'tree' && this._turn === '') || this._options.display.viewType === 'foldersTree'){
            var expandTree = function(event){
               event.stopPropagation();
               var row = $(this).parents('tr'),
                   rowkey = row.attr('rowkey'),
                   record = self._currentRecordSet.contains(rowkey) ?
                       self._currentRecordSet.getRecordByPrimaryKey(rowkey) :
                       undefined;
               if(self.isEnabled()){
                  var flag = self._notify('onRowClick', row, record, self._columnMap[0].title, self._columnMap[0].field);
                  if(flag !== false){
                     self._processElementClick(row, rowkey, record);
                  }
                  else{
                     self._notifySetCursor(row, record);
                  }
               }
            };
            $('.ws-browser-expander', parent).live('click', expandTree);
         }

         if(this._options.allowMove && !this._options.display.readOnly && this.isHierarchyMode() && this._turn === ''){
            $('[rowkey]', parent).live('mousedown', function(event){
               var row = $(event.target),
                  textFound = false;
               for(var i = 0; i < event.target.childNodes.length; ++i){
                  if(event.target.childNodes[i].nodeType == $ws._const.nodeType.TEXT_NODE){
                     textFound = true;
                     break;
                  }
               }
               if(row.closest('a').length === 1){
                  textFound = true;
               }
               if(!textFound){
                  return true;
               }
               if(row.prop('nodeName').toLowerCase() !== 'tr'){
                  row = row.parents('.ws-browser tr');
               }
               var rowkey = row.attr('rowkey');
               if(event.which !== 1 || !self.isEnabled() || !self._currentRecordSet.contains(rowkey)){
                  return true;
               }
               self.setActiveElement(row, false, true);
            self._dragRecords = self.getSelection();
            if(self._notify('onDragStart', self._dragRecords) === false){
               return true;
            }
            self._dragStartPoint['x'] = event.clientX;
            self._dragStartPoint['y'] = event.clientY;
            self._dragRow = row;
            self._dragBrowser = self._browserContainer;
               self._useKeyboard = true;
               $(document)
                  .bind('mousemove', $.proxy(self._recordsMouseMove, self))
                  .bind('mouseup', $.proxy(self._recordsMouseUp, self));
               return false;
            });

         }

         $('.ws-browser-checkbox', parent).live('click', function(event){
            var element = $(this);
            self._runInBatchUpdate('ws-browser-checkbox click', function() {
               if(self.isEnabled())
                  self._selectActiveElement(element.parents('.ws-browser tr'));
            });
            event.stopImmediatePropagation();
            return false;
         });
      },
      /**
       * Инициализирует события опций строки
       */
      _initRowOptions: function(){
         if(this.isEnabled()){
            var self = this;
            self._browserContainer.bind('mousemove', function(event){
               var element = $(event.target),
                   targetRow = element;
               if(event.target.nodeName.toLowerCase() != 'tr'){
                  targetRow = targetRow.parents('.ws-browser tr');
               }
               self._hideRowOptionsForRow.apply(self, [element, targetRow]);
            });
            $('tr', self._body.parent()[0]).live('mouseenter', function(event){
               self._showRowOptions.apply(self, [event.target]);
            });
            this._rootElement.find('.ws-browser-container-wrapper').bind('mouseleave', function(event){
               if(!self._rowOptionsMenuVisible){
                  if( (self._actions['printRecord'] && !self._printMenuIsShow) || !self._actions['printRecord'])
                     self._hideRowOptions();
               }
               else{
                  self._rowOptionsTargetRow = undefined;
               }
            });
         }
      },
      _hideRowOptionsForRow: function(element, targetRow){
         if(!targetRow || targetRow.length === 0 || targetRow.parents('table').get(0) != this._data.get(0)){
            if(element.parents('.ws-browser-row-options-block').length === 0 &&
                !element.hasClass('ws-browser-row-options-block')){
               if(!this._rowOptionsMenuVisible){
                  this._hideRowOptions();
               }
               else{
                  this._rowOptionsTargetRow = undefined;
               }
            }
            return true;
         }
      },
      _showRowOptions: function(target){
         var element = $(target),
             targetRow = element;
         if(target.nodeName.toLowerCase() != 'tr'){
            targetRow = targetRow.parents('.ws-browser tr');
         }
         this._hideRowOptionsForRow.apply(this, [element, targetRow]);
         var rowkey = targetRow.attr('rowkey'),
             record = this._currentRecordSet.contains(rowkey) && this._currentRecordSet.getRecordByPrimaryKey(rowkey);
         if(!record && !this._isIdEqual(this._rootNode, rowkey)){
            this._hideRowOptionsForRow.apply(this, [element]);
            return true;
         }
         if(this._rowOptionsMenuVisible || (this._actions['printRecord'] && this._printMenuIsShow)){
            this._rowOptionsTargetRow = targetRow;
            return true;
         }
         this._showRowOptionsForRow(targetRow);
      },
      /**
       * Отписывается от событий опций строки
       */
      _uninitRowOptions: function(){
         this._browserContainer.unbind('mousemove');
         $('tr', this._body.parent()[0]).die('hover');
         this._rootElement.find('.ws-browser-container-wrapper').unbind('mouseleave');
      },
      /**
       * прекращает всплытие события при нажатии Enter для сохранения при редактировании по месту
       */
      _onKeyPressedOnBrowser: function(event, e){
         if(e.which === $ws._const.key.enter && this._editAtPlaceField !== null){
            e.preventDefault();
            e.stopPropagation();
            return false;
         }
      },
      /**
       * Обработчик скролла в теле браузера
       */
      _onScrollActions: function(){
         if(this._hasRowOptions){
            this._hideRowOptions();
         }
      },
      /**
       * Скрывает опции для строки (display.rowOptions)
       */
      _hideRowOptions: function(){
         if(this._rowOptionsMenuVisible){
            this._rowOptionsMenuVisible = false;
            this._rowOptionsCurrentMenu.show({});
         }
         if(this._rowOptionsElement){
            this._rowOptionsElement.hide();
         }
         this._rowOptionsTargetRow = this._rowOptionsHoverRow = undefined;
         this._rowOptionsHoverRecord = undefined;
      },
      /**
       * Показывает опции строки для указанной строки
       * @param {jQuery} row Строка, для которой нужно показать опции.
       */
      _showRowOptionsForRow: function(row){
         var rowkey = row.attr('rowkey'),
            record = this._currentRecordSet.contains(rowkey) && this._currentRecordSet.getRecordByPrimaryKey(rowkey);
         if(!row.hasClass('ws-add-at-place') && (record || this._isIdEqual(this._rootNode, rowkey))){

            var filter = [],
               isBranch = (!record || (this.isHierarchyMode() && record.get(this._hierColumnIsLeaf) === true)) ? 1 : 0;
            if(!record){
               filter = ['edit', 'delete', 'printRecord', 'copy', 'history', 'move'];
            }
            else{
               if(this._rowOptionsDisableStandart === true){
                  filter = ['edit', 'delete', 'printRecord', 'copy', 'history', 'move', 'addItem', 'addFolder'];
               }
               else if(this._rowOptionsDisableStandart !== false){
                  filter = this._rowOptionsDisableStandart;
               }
            }
            if(!isBranch){
               filter.push('addItem', 'addFolder', 'move');
            }
            filter = this._rowOptionsFilterConcat(filter);
            this._refilterRowOptions(filter);

            var prevOptions = $ws.core.merge({}, this._rowOptions, {clone:true}),
               res = this._notify('onRowOptions', record, row, this._rowOptions);
            if(res !== false){
               this._rowOptionsHoverRow = this._rowOptionsTargetRow = row;
               this._rowOptionsHoverRecord = record;
               var rowHeight = row.height();
               if(!(res instanceof Array)){
                  res = [];
               }
               this._createRowOptions();
               res = res.concat(this._updateRowOptions(prevOptions));
               this._refilterRowOptions(filter.concat(res));
               this._applyRowOptions();
               if(this._hasRowOptions && this._rowOptionsElement &&
                  row.parent().parent().length){
                  this._rowOptionsElement.css({'top': row.position().top +
                     $ws._const.Browser.rowOptionsElementsOffset.top,
                     'right': (this._verticalScrollShowed ? this._scrollWidth : 0) +
                        $ws._const.Browser.rowOptionsElementsOffset.right,
                     'height': rowHeight}).show();
                  if($ws._const.theme != 'wi_scheme')
                     this._rowOptionsElement.find('.ws-browser-row-option-border').css('top', (rowHeight / 2 - 10) + 'px');
                  return;
               }
            }
         }
         this._hideRowOptions();
      },
      /**
       * Находит добавленные, удалённые и обновлённые опции строки
       */
      _updateRowOptions: function(prevOptions){
         var res = [];
         for(var i = 0; i < this._rowOptionsDefault.length; ++i){
            var name = this._rowOptionsDefault[i][3] || this._rowOptionsDefault[i][2];
            if(prevOptions.hasOwnProperty(name) && this._rowOptions.hasOwnProperty(name)){
               if(prevOptions[name]['title'] != this._rowOptions[name]['title']){
                  if(this._rowOptionsButtons[name]){
                     this._rowOptionsButtons[name].attr('title', this._rowOptions[name]['title']);
                  }
                  if(this._rowOptionsMenu instanceof Object){
                     this._rowOptionsMenu.setItemText(this.getId() + '_' + name, this._rowOptions[name]['title']);
                  }
                  this._rowOptionsDefault[i][0] = this._rowOptions[name]['title'];
               }
               if(prevOptions[name]['icon'] != this._rowOptions[name]['icon']){
                  if(this._rowOptionsButtons[name]){
                     BackgroundMapper.makeBackground(this._rowOptionsButtons[name].find('.ws-browser-row-option'), this._rowOptions[name]['icon']);
                  }
                  if(this._rowOptionsMenu instanceof Object){
                     this._rowOptionsMenu.setItemIcon(this.getId() + '_' + name, this._rowOptions[name]['icon']);
                  }
                  this._rowOptionsDefault[i][1] = this._rowOptions[name]['icon'];
               }
               if(prevOptions[name]['callback'] != this._rowOptions[name]['callback']){
                  var callback = this._rowOptionsCallbackWrapper(this._rowOptions[name]['callback']);
                  if(this._rowOptionsButtons[name]){
                     this._rowOptionsButtons[name].unbind('click');
                     this._rowOptionsButtons[name].bind('click', callback);
                  }
                  if(this._rowOptionsMenu instanceof Object){
                     this._rowOptionsMenu.setItemClickHandler(this.getId() + '_' + name, callback);
                  }
                  this._rowOptionsDefault[i][2] = this._rowOptions[name]['callback'];
               }
            }
            else if(prevOptions.hasOwnProperty(name)){ //remove button
               res.push(name);
            }
         }
         for(i in this._rowOptions){
            if(this._rowOptions.hasOwnProperty(i) && !prevOptions.hasOwnProperty(i)){
               this.addRowOption(this._rowOptions[i]);
            }
         }
         return res;
      },
      /**
       * Дополняет фильтр опций строки, исходя из своих параметров
       * @param {Array} filter Фильтр, который необходимо дополнить
       * @return {Array} Новый фильтр
       * @private
       */
      _rowOptionsFilterConcat: function(filter){
         var disabled = [];
         if(this._options.display.readOnly || !this._options.allowAdd){
            disabled = disabled.concat(['addMenu', 'addFolder', 'addItem']);
         }
         if((this._options.display.readOnly || !this._options.allowEdit || this._options.display.editAtThePlaceOnly ||
            (this._options.mode === 'oneClickMode' && this._options.folderLinkAction === 'activate') || this._options.useHoverRowAsActive) && !this._selectMode){
            disabled.push('edit');
         }
         if(this._options.display.readOnly || !this._options.allowDelete){
            disabled.push('delete');
         }
         if(this._options.display.readOnly || !this._options.allowMove || !this.isHierarchyMode()){
            disabled.push('move');
         }
         for(var i = 0, len = disabled.length; i < len; ++i){
            var found = false;
            for(var j = 0; j < filter.length; ++j){
               if(filter[j] == disabled[i]){
                  found = true;
                  break;
               }
            }
            if(!found){
               filter.push(disabled[i]);
            }
         }
         return filter;
      },
      /**
       * Находит нужные опции строки, исходя из представленного фильтра
       * @param {Array} filter Имена опций, которые нужно скрыть
       * @private
       */
      _refilterRowOptions: function(filter){
         var filterMap = {};
         for(var i = 0; i < filter.length; ++i){
            filterMap[filter[i]] = true;
         }
         this._rowOptions = {};
         for(i = 0; i < this._rowOptionsDefault.length; ++i){
            var option = this._rowOptionsDefault[i],
               name = option[3] || option[2];
            if(!filterMap[name] && !(typeof(option[2]) === 'string' && !this._actions[option[2]])){
               this._rowOptions[name] = {
                  'title': option[0],
                  'icon': option[1],
                  'name': name,
                  'callback': typeof(option[2]) === 'string' ? this._actions[option[2]] : option[2]
               };
            }
         }
      },
      /**
       * Изменяет опции строки до нужного состояния - скрывает / показывает кнопки, пункты меню
       */
      _applyRowOptions: function(){
         var count = 0,
            options = this._rowOptions;
         for(var i in options){
            if(options.hasOwnProperty(i)){
               ++count;
            }
         }
         var showMenu = (count >= $ws._const.Browser.rowOptionsOverflow),
            defaultOptions = this._rowOptionsDefault;
         this._rowOptionsMenuButton.css('display', showMenu ? 'inline-block' : 'none');
         for(i = 0; i < defaultOptions.length; ++i){
            var defaultOption = defaultOptions[i],
               name = defaultOption[3] || defaultOption[2],
               show = options[name] && !showMenu;
            this._rowOptionsButtons[name].css('display', show ? 'inline-block' : 'none');
            if(this._rowOptionsMenu instanceof Object){
               this._rowOptionsMenu[options[name] ? 'showItem' : 'hideItem'](this.getId() + '_' + name);
            }
         }
         this._hasRowOptions = count > 0;
      },
      /**
       * Показывает опции записи для строки, сохранённой в _rowOptionsTargetRow
       */
      _showRowOptionsForTargetRow: function(){
         if(this._rowOptionsTargetRow === undefined){
            this._hideRowOptions();
         }
         else if(this._rowOptionsTargetRow !== this._rowOptionsHoverRow){
            this._showRowOptionsForRow(this._rowOptionsTargetRow);
         }
         else{
            this._rowOptionsTargetRow = undefined;
         }
      },
      /**
       * Выключает стандартные опции строки
       * @param {Array} [options] Массив имён опций, которые нужно выключить
       */
      disableStandartRowOptions: function(options){
         this._rowOptionsDisableStandart = options === undefined ? true : options;
      },
      /**
       * Метод получения списка иконок, валидных на данный момент
       * @return {Array} Массив кнопок с опциями.
       * Структура задана жестко. [Тултип, иконка, условие показа, обработчик на нажатие(функция)]
       */
      _getMenuButtons: function(){
         var buttons = $ws.proto.Browser.superclass._getMenuButtons.apply(this, arguments);
         buttons.push(/*['', '', 'clearSorting'],*/
         ['Очистить сортировку', 'sprite:icon-16 icon-Close icon-primary', 'clearSorting']);
         buttons.push(/*['', '', 'print'],*/
         ['Печать реестра (Ctrl+P)', 'sprite:icon-16 icon-Print icon-primary', 'print']);
         if(!this._options.display.rowOptions)
            buttons.push( ['Печать записи (F4)', 'sprite:icon-16 icon-Print icon-primary',
               'printRecord']);
         return buttons;
      },
      _createFakeEvent: function() {
         var event;
         if( document.createEvent ) {
            event = document.createEvent("HTMLEvents");
         } else if( document.createEventObject ) {
            event = document.createEventObject();
         }
         return event;
      },
      /**
       * Вызывает построение списка отчетов для реестра
       */
      _showReportsListForList: function(){
         if(this._needPrint === true)
            this._showReportsList(this._createFakeEvent(), true);
         else if(typeof(this._needPrint) == 'string')
            this.printReport(this._needPrint, true, null);
      },
      /**
       * Вызывает построение списка отчетов для записи
       * @param {$ws.proto.Record}  [record]   Запись
       * @param {Object}            [row]      Строка в дом-дереве
       */
      _showReportsListForRecord: function(record, row, event){
         if(this._needPrint === true)
            this._showReportsList(typeof(event) == 'object' ? event : this._createFakeEvent(), false, record, row);
         else if(typeof(this._needPrint) == 'string')
            this.printReport(this._needPrint, false, record);
      },
      /**
       * Проходит по строкам рекордсета, рисует нужные
       */
      _drawBodyCycle: function(){
         var dataRow,
             previousRow = false,
             tableBody = $('<tbody/>'); //Новое tbody для таблицы

         this._rowsMap = {}; //Забываем ссылки на старые строки

         if(this._options.display.showRoot){
            this._createRoot(tableBody.get(0));
         }

         var oldBody = this._body;
         this._body = tableBody;
         if(this.isHierarchyMode()){
            if(this._turn){
               this._expanded[this._currentRootId] = 2;
            }
            this._drawBranch(this._options.display.viewType === 'tree' ? this._rootNode : this._currentRootId);

            if(this._expanded[this._currentRootId] === 2 && this._options.display.viewType === 'tree' && this._turn === ''){
               delete this._expanded[this._currentRootId];
            }
            if(this._options.display.viewType === 'tree' && this._options.display.expand && !this._options.display.fixedExpand){
               this._options.display.expand = '';
            }
         }
         else{
            this._currentRecordSet.rewind();
            while ((dataRow = this._currentRecordSet.next()) !== false){
               if (this._options.selectionType !== 'node' || (this._options.selectionType === 'node' && this._testSelectedRecord(dataRow))) {
                  var tr = this._createTR(dataRow, 0, previousRow);
                  tableBody.append(tr);
                  previousRow = dataRow;
               }
            }
            this._count = this._body.get(0).childNodes.length;
         }
         if(this._options.display.allowAddAtThePlace){
            this._createAddAtPlaceLinkRow(tableBody.get(0));
         }
         if(this._options.display.allowHorizontalScroll){
            this._emptyDataScroller.toggleClass('ws-hidden', this._count > 0);
         }
         oldBody.remove();
         this._data.append(this._body);
      },

      /**
       * Обработчик клика по строке или ссылке в добавлении по месту
       * @param {jQuery} [event] объект события
       * @param {Boolean} [isFolder] является ли новая запись папкой
       * @private
       */
      _addAtPlaceLinkRowClick: function(event, isFolder){
         if(event){
            this._onClickHandler(event);
            event.stopPropagation();
         }
         var root = (this._options.display.viewType !== 'tree' ? this._currentRootId : this._rootNode) + '';
         this._createRowAtThePlace(root, isFolder, false);
      },
      /**
       * Создаёт строчку с кнопкой добавления записи по месту
       * @param {HTMLElement} tableBody новое body для таблицы
       * @private
       */
      _createAddAtPlaceLinkRow: function(tableBody){
         var td = $('<td class="ws-browser-add-at-place-cell"></td>'),
            self = this,
            folderLink,
            itemLink;
         this._addAtPlaceLinkRow = $('<tr class="ws-browser-table-row ws-visible ws-browser-add-at-place-link-row" rowkey=""></tr>');
         if(this._options.display.viewMode !== 'foldersTree'){
            itemLink = $('<div class="icon-16 icon-Add icon-primary"/><span class="ws-browser-add-at-place-link">Новая запись</span>');
            itemLink.appendTo(td).click(function(event){
               self._addAtPlaceLinkRowClick(event, false);
            });
         }
         if(this.isHierarchyMode()){
            folderLink = $('<div class="icon-16 icon-CreateFolder icon-primary"/><span class="ws-browser-add-at-place-link">Новая папка</span>');
            folderLink.appendTo(td).click(function(event){
               self._addAtPlaceLinkRowClick(event, true);
            });
            if(this._options.display.viewMode !== 'foldersTree'){
               folderLink.addClass('ws-browser-add-at-place-link-folder-withItem');
            }
         }
         td.get(0).colSpan = this._getColumnsCount();
         td.appendTo(this._addAtPlaceLinkRow);
         if(this._options.display.hasZebra)
            this._addAtPlaceLinkRow.addClass('rE');
         if(this._options.display.readOnly){
            this._addAtPlaceLinkRow.hide();
         }
         this._addAtPlaceLinkRow.appendTo(tableBody);
      },
      /**
       * Создаёт строку "Корень"
       * @param {HTMLTableSectionElement} tableBody Новое tbody для таблицы
       */
      _createRoot: function(tableBody){
         var classes = ['ws-visible'],
            row = document.createElement('tr'),
            exp = document.createElement('span'),
            isExpanded = !!this._expanded[this._rootNode],
            key = (this._rootNode === null ? 'null' : this._rootNode.toString());
         row.setAttribute('rowkey', key);
         row.setAttribute($ws._const.Browser.treeLevelAttribute, '0');
         exp.className = 'ws-browser-expander-container ws-browser-icon ws-browser-expander';
         classes.push('ws-browser-root');
         if(this._selected[this._rootNode])
            classes.push('ws-browser-selected');
         if(this._selectedPart[this._rootNode])
            classes.push('ws-browser-selected-part');

         if(this._options.display.hasZebra){
            classes.push('rE');
         }

         if(this._turn === ''){//проставление экспандеров в дереве
            exp.className += isExpanded ? ' minus' : ' plus';
         }

         row.setAttribute('parentId', 'null');
         classes.push("ws-browser-tree-branch", "ws-browser-folder", "ws-browser-table-row");

         row.className = classes.join(' ');
         var td = document.createElement('td'),
               contentElement,
               contentLink;
         if(this._options.mode == 'oneClickMode'){
            this._rootName =
               contentLink =
                  $('<a class="ws-browser-folder-link" href="javascript:void(0)">' + this._options.display.rootName + '</a>');
         }
         else{
            contentLink = this._options.display.rootName;
         }
         contentElement = $('<div class="ws-browser-cell-container ws-browser-div-cut"></div>').append(contentLink)
            .css('padding-left', '2px');
         contentElement.prepend(exp);
         if(this._options.mode !== 'oneClickMode'){
            this._rootName = contentElement;
         }
         if(this._getColumnsCount() !== 0)
            td.colSpan = this._getColumnsCount();
         $(td).append(contentElement);
         row.appendChild(td);
         tableBody.appendChild(row);
         this._rowsMap[key] = $(row);

         if (this._options.display.showSelectionCheckbox && this._options.useSelection !== false &&
            this._options.selectionType !== 'leaf'){
            this._addCheckBox(row);
         }
      },
      /**
       * Просчитывает видимость указанной строки
       * @param {Array}             params         //Счётчик "глубины" невидимой части дерева
       * @param {$ws.proto.Record}  dataRow        //Запись с данными
       * @param {Array}             treeStack      //Стек дерева
       * @param {Boolean}           isFolder       //Является ли запись папкой
       * @param {Boolean}           isHiddenFolder //Является ли скрытой папкой
       * @returns {Boolean} нужно ли показывать строку
       */
      _prepareTreeLevel: function(params, dataRow, treeStack, isFolder, isHiddenFolder){
         var curId = dataRow.getKey(),
               top = this._rootNode,                                                      //Верхушка стека
               parentId = dataRow.get(this._hierColumnParentId);
         if(this._expanded[curId] === 2 && !isHiddenFolder){
            this._expanded[curId] = 1;
            params[1] = true;
            params[2] = curId;
         }
         if(treeStack.length){
            top = treeStack[treeStack.length - 1];
            //Если отец текущего элемента - не папка с идентификатором с верхушки стека, значит, мы уже вышли из папки
            while(parentId != top){
               if(top === params[2]){
                  params[2] = -1;
                  params[1] = false;
               }
               //Если папка закрыта - уменьшаем значение видимости
               if(!this._expanded[treeStack.pop()])
                  ++params[0];
               if(treeStack.length)
                  top = treeStack[treeStack.length - 1];
               else{
                  top = this._rootNode;
                  break;
               }
            }
         }
         if(params[0] && params[1] && !isHiddenFolder && isFolder && this._expanded[curId] !== 0 &&
             this._expanded[curId] !== false){
            this._expanded[curId] = true;
            this._loaded[curId] = true;
         }
         //Если у нас папка, то добавляем её в стек
         if(isFolder/* && parentId == top*/){
            treeStack.push(curId);
            if(!this._expanded[curId])
               --params[0];
         }
         return params[0] + (isFolder ? !this._expanded[curId] : 0) > 0;
      },
      /**
       * Функция устанавливает / убирает чересполосицу
       * @param hasZebra
       */
      zebraBody: function(hasZebra) {
         var rows = this._body
            .find('tr')
            .end();
         this._data.toggleClass('ws-browser-hasZebra', !!hasZebra);
         if(!this._options.display.hasZebra && hasZebra){
            rows.addClass("rE");
         }
         else if(this._options.display.hasZebra && !hasZebra){
            rows.removeClass('rE');
         }
         this._options.display.hasZebra = hasZebra;

         this._updateSelection();
      },
      /**
       * Возвращает признак, отображается ли браузер в "иерархическом" режиме
       * т.е. дерево или иерархия
       * @returns {Boolean} признак иерархичности
       */
      isHierarchyMode: function(){
         return this._options.display.viewType === 'tree' || this._options.display.viewType === 'hierarchy';
      },
      /**
       * Является ли браузер иерархией
       * @returns {Boolean}
       */
      isHierarchy: function(){
         return this._options.display.viewType === 'hierarchy';
      },
      /**
       * Является ли браузер деревом
       * @returns {Boolean}
       */
      isTree: function(){
         return this._options.display.viewType === 'tree';
      },
      /**
       * Событие, поджигаемое при загрзузке данных.
       * Поджигается $ws.proto.RecordSet
       *
       * @param {Event}                eventState  Состояние события
       * @param {$ws.proto.RecordSet}  recordSet   Рекордсет, который был загружен
       * @param {Boolean}              isSuccess   Успешность запроса
       */
      _pathRecordSetLoaded: function(eventState, recordSet, isSuccess){
         this._wayRS = recordSet;
         if(isSuccess){
            if(this._options.display.viewType === 'hierarchy'){
               $ws.proto.Browser.superclass._pathRecordSetLoaded.apply(this, arguments);
            }
            else if(this._options.display.viewType === 'tree'){
               //Мы загрузили путь до узла
               var path = this._wayRS.getWay(),
                     record,                                            //Текущая запись из рекордсета
                     way = [];                                          //Массив с путём до нужной записи
               if(this._rootNode && path !== null && !path.contains(this._rootNode))
                  return;

               path.rewind();
               while((record = path.next()) !== false){//В дереве делаем массив ключей, которые нужно будет подгрузить
                  if(record.get(this._hierColumnIsLeaf) === false){
                     break;
                  }
                  var key = record.getKey();

                  // if(!this._expanded[key]){ //Вставляем в очередь загрузки только нераскрытые узлы
                     way.push(key);
                     this._expanded[key] = 1;
                     this._loaded[key] = true;
                  // }
               }
               if(way.length){
                  var loading = this._wayRS.getLoadingId();
                  if(loading instanceof Array){
                     loading = loading[0];
                  }
                  if(this._selectAfterPathLoad === true){
                     this._hovered = loading;
                     this._activeElement = undefined;
                  }
                  else{
                     this._selectAfterPathLoad = true;
                  }
                  this._systemParams[this._hierColumnParentId] = way;
                  var deferred = this._currentRecordSet.loadNode(way, false);
                  if(!this._wayRSDeferred.isReady()){
                     this._wayRSDeferred.dependOn(deferred);
                  }
                  if(this._options.mode === 'navigationMode'){
                     var self = this;
                     deferred.addCallback(function(){
                        self._closeOtherBranches(way[way.length - 1]);
                        self.refresh();
                     });
                  }
               }
            }
         }
      },
      /**
       * Обрабатывает нажатия клавиш
       * @param {Object} e переданное событие
       * @return {Boolean}
       */
      _keyboardHover: function(e){
         var myKeys = $ws.core.hash([$ws._const.key.left, $ws._const.key.right, $ws._const.key.enter, $ws._const.key.insert]),
             res = false;
         if(!this._currentRecordSet || !this._currentRecordSet.isLoaded()){
            return res;
         }
         if((e.which in myKeys) && this.isActive()){
            var activeRow = this.getActiveElement();
            if(!e.ctrlKey && !e.altKey && e.shiftKey && (e.which === $ws._const.key.left || e.which === $ws._const.key.right)
                  && this._options.display.viewType === 'tree'){
               var rangeIsContinuous = true,
                   selectedRows = this.getSelection(),
                   firstCheckedTR = selectedRows.length == 1 ? this.getActiveRow() : this._body.find('tr.ws-browser-selected:first'),
                   lastCheckedTR = selectedRows.length == 1 ? firstCheckedTR : this._body.find('tr.ws-browser-selected:last'),
                   TR = firstCheckedTR,
                   firstParent = selectedRows[0].get(this._hierColumnParentId),
                   moveKey = null;
               if(firstCheckedTR.prev().length > 0 && this._notify('onDragStart', selectedRows) !== false){
                  for(var i = 1, l = selectedRows.length; i < l; i++){ // проверяем, что все выбранные записи лежат в одном разделе
                     if(selectedRows[i].get(this._hierColumnParentId) !== firstParent)
                        rangeIsContinuous = false;
                  }
                  while(TR.attr("rowkey") !== lastCheckedTR.attr("rowkey") && rangeIsContinuous){ // проверяем, что выбранный диапазон является непрерывным
                     if(!TR.hasClass("ws-browser-selected"))
                        rangeIsContinuous = false;
                     TR = TR.next();
                  }
                  if(rangeIsContinuous){
                     if(e.which === $ws._const.key.right){
                        var prevTR = firstCheckedTR.prev(),
                            prevRecordKey = prevTR.attr("rowkey"),
                            prevRecordParentId = prevTR.attr("parentid") === "" ? null : prevTR.attr("parentid"),
                            prevRecord = this._currentRecordSet.getRecordByPrimaryKey(prevRecordKey);
                        if(prevRecordKey !== firstCheckedTR.attr("parentid")){
                           moveKey = prevRecord.get(this._hierColumnIsLeaf) ? prevRecordKey : prevRecordParentId;
                           if(this._notify('onDragStop', selectedRows, moveKey === this._rootNode ? this._rootNode : this._currentRecordSet.getRecordByPrimaryKey(moveKey), true) !== false)
                              this.move(moveKey);
                        }
   //                        this.move(prevRecord.get(this._hierColumnParentId) === firstParent ? prevRecordKey : prevRecordParentId);
                     }
                     else if(firstParent !== null){
                        moveKey = this._currentRecordSet.getRecordByPrimaryKey(firstCheckedTR.attr("parentid")).get(this._hierColumnParentId);
                        if(this._notify('onDragStop', selectedRows, moveKey === this._rootNode ? this._rootNode : this._currentRecordSet.getRecordByPrimaryKey(moveKey), true) !== false)
                           this.move(moveKey);
                     }
                  } else {
                     $ws.core.alert("Данная операция доступна только для непрерывного диапазона данных.");
                  }
               }
            } else if(this._isNotModified(e) && (e.which === $ws._const.key.left || e.which === $ws._const.key.right)
                  && this._options.display.viewType === 'tree' && activeRow){
               rowkey = activeRow.attr('rowkey');
               var record = this.getActiveRecord();
               if(record && e.which === $ws._const.key.left && !this._expanded[rowkey]){
                  var parentRowkey = record.get(this._hierColumnParentId),
                     parentRow = this._body.find('[rowkey="' + parentRowkey + '"]');
                  if(parentRow.length){
                     this.setActiveElement(parentRow);
                  }
               }
               else if(e.which === $ws._const.key.right && this._expanded[rowkey]){
                  var parentTreeLevel = parseInt(activeRow.attr($ws._const.Browser.treeLevelAttribute), 10),
                     next = activeRow.next(':visible'),
                     childTreeLevel = parseInt(next.attr($ws._const.Browser.treeLevelAttribute), 10);
                  if(parentTreeLevel + 1 === childTreeLevel){
                     this.setActiveElement(next);
                  }
               }
               else if(activeRow.hasClass("ws-browser-folder")){
                  this._processTreeClick(activeRow.attr('rowkey'), e.which === $ws._const.key.left);
               }
            }
            else if(e.which === $ws._const.key.enter && !this._selectMode && !e.ctrlKey && !e.shiftKey && !e.altKey){
               if(!activeRow){
                  return false;
               }
               var expander = activeRow.find(".ws-browser-expander");
               if(expander.length > 0 && this._turn === ''){
                  var ar = expander.not(":hidden"),
                      doClose = ar.hasClass('minus'),
                      rowkey = ar.parents('tr').attr('rowkey');
                  this._processTreeClick(rowkey, doClose);
                  return false;
               }
               else if(activeRow.hasClass('ws-browser-add-at-place-link-row')){
                  this._addAtPlaceLinkRowClick();
               }
            } else if(this._options.display.viewType === 'tree' && e.which === $ws._const.key.insert && e.altKey && !e.shiftKey){
               var editFunction = this._actions[e.ctrlKey ? "addFolder" : "addItem"];
               if(editFunction)
                  editFunction(this.getActiveElement(), true);
            }
         }
         res = $ws.proto.Browser.superclass._keyboardHover.apply(this, arguments);
         return res;
      },
      /**
       * Обработка клика на элементе
       * @param {jQuery} row Объект строки
       * @param {String} rowkey Идентификатор записи
       * @param {$ws.proto.Record} record Запись
       * @returns {$ws.proto.Deferred|null}
       */
      _processElementClick: function(row, rowkey, record){
         return this._runInBatchUpdate('Browser: _processElementClick', function() {
            var result = null;
            if(this._options.display.viewType === "tree" && this._turn === ''){
               result = this._processTreeClick(rowkey, !!this._expanded[rowkey]);
            }
            if(!result){
               this._notifySetCursor(this._body.find('[rowkey="' + rowkey + '"]'), record);
            }
            return result;
         });
      },
      /**
       * Обновляет текущую строчку после перерисовки
       * @private
       */
      _updateActiveRow: function(){
         if(this._activeElement && this._activeElement.closest('html').size() === 0 || !this._activeElement && this._hovered){
            var newRow = (this._hovered && this._haveRow(this._hovered)) ? this._findRow(this._hovered) : undefined;
            this.setActiveElement(newRow, false, true);
         }
      },
      /**
       * Очищает дочерние строчки у указанной записи
       * @param {String} rowkey Идентификатор записи
       * @private
       */
      _clearBranch: function(rowkey){
         var row,
            prevRow,
            treeLevel,
            rowLevel;
         if(this._haveRow(rowkey)){
            row = this._findRow(rowkey);
            treeLevel = parseInt(row.attr($ws._const.Browser.treeLevelAttribute), 10) || 0;
            row = row.next();
         }
         else if(this._isIdEqual(rowkey, this._rootNode)){
            treeLevel = -1;
            row = this._body.find('tr').eq(0);
         }
         else{
            return;
         }
         while(row.length){
            rowLevel = parseInt(row.attr($ws._const.Browser.treeLevelAttribute), 10) || 0;
            if(rowLevel <= treeLevel){
               break;
            }
            this._rowsMap[row.attr('rowkey')] = undefined; //Чистим ссылку
            prevRow = row;
            row = row.next();
            prevRow.remove();
         }
      },
      /**
       * Закрывает ветку дерева (удаляет строчки) и меняет плюсы-минусы
       * @param {String} rowkey Первичный ключ записи, ветку которой необходимо закрыть
       * @private
       */
      _closeBranch: function(rowkey){
         this._toggleExpander(rowkey, false);
         this._clearBranch(rowkey);
         this._notify('onFolderClose', rowkey);
      },
      /**
       * Создаёт записи для указанной папки
       * @param {String|null} rowkey Идентификатор записи
       * @param {Number} treeLevel Уровень вложенности в дереве
       * @param {DocumentFragment} fragment Документ, в который нужно вставлять строки
       * @param {Boolean} expanded Открыта ли эта папка полностью (ctrl+b)
       * @param {Object} result Объект, который заполняется для нотификации об открытии папки
       * @private
       */
      _drawFolder: function(rowkey, treeLevel, fragment, expanded, result){
         var childs = this._currentRecordSet.recordChilds(rowkey);
         for(var i = 0, len = childs.length; i < len; ++i){
            var record = this._currentRecordSet.getRecordByPrimaryKey(childs[i]),
               key = record.getKey();
            if((this._options.mode !== 'navigationMode')
               && ((this._expanded[rowkey] === 2 || expanded)
                  && (!this._useLoadChildsFlag
                     || this._currentRecordSet.recordChilds(key).length > 0
                     || !record.get(this._hierColumnHasChild)))){
               this._expanded[key] = 1;
            }
            var   previousRecord = (result.keys.length > 0) ? this._currentRecordSet.getRecordByPrimaryKey(result.keys[result.keys.length-1]) : undefined,
                  row = this._createTR(record, treeLevel, previousRecord);
            result.keys.push(key);
            result.rows.push(row);
            fragment.appendChild(row);
            if(record.get(this._hierColumnIsLeaf) === true && this._expanded[key] || expanded){
               this._drawFolder(key, treeLevel + 1, fragment, this._expanded[rowkey] === 2 || expanded, result);
            }
         }
         if(this._expanded[rowkey] === 2){
            this._expanded[rowkey] = 1;
         }
      },
      /**
       * Рекурсивно создаёт строчки дерева
       * @param {String|null} rowkey Идентификатор записи
       * @returns {Object} Возвращает объект с ключами keys и rows, к примеру: {keys: [1, 2, 3], rows: [<tr>, <tr>, <tr>]}
       * @private
       */
      _drawBranch: function(rowkey){
         var parentRow = this._haveRow(rowkey) && this._findRow(rowkey),
            parentTreeLevel = parentRow && parseInt(parentRow.attr($ws._const.Browser.treeLevelAttribute), 10) + 1 || 0,
            fragment = document.createDocumentFragment(),
            result = {keys: [], rows: $()};
         this._drawFolder(rowkey, parentTreeLevel, fragment, false, result);
         if(parentRow && parentRow.length){
            this._body[0].insertBefore(fragment, parentRow[0].nextSibling);
         }
         else{
            this._body.append(fragment);
         }
         this._count = this._body.get(0).childNodes.length;
         this._updatePager();
         this._updateActiveRow();
         return result;
      },
      /**
       * Меняет плюс-минус у указанной строки
       * @param {String} rowkey Идентификатор строки
       * @param {Boolean} open Открывать ли
       * @private
       */
      _toggleExpander: function(rowkey, open){
         var row = this._haveRow(rowkey) && this._findRow(rowkey);
         if(row){
            row.find('.ws-browser-expander').toggleClass('minus', open).toggleClass('plus', !open);
         }
      },
      /**
       * Открывает ветку дерева, создаёт известные записи
       * @param {String} rowkey Идентификатор записи
       * @private
       */
      _openBranch: function(rowkey){
         if(this._haveRow(rowkey)){
            this._toggleExpander(rowkey, true);
         }
         var drawResult = this._drawBranch(rowkey);
         this._notify('onFolderOpen', rowkey, drawResult.keys, drawResult.rows);
      },
      /**
       * Обработка клика в дереве
       * @param {String}  rowkey    Идентификатор строки, по которой кликнули
       * @param {Boolean} doClose   Закрывается ли ветка
       * @returns {$ws.proto.Deferred|null|Boolean}
       */
      _processTreeClick: function(rowkey, doClose){
         return this._runInBatchUpdate('Browser: _processTreeClick', function() {
            if(this._options.display.fixedExpand === true && this._options.mode !== 'navigationMode')
               return null;
            var result,
               closed = false,
               contains = this._currentRecordSet.contains(rowkey),
               isBranch = contains && this._currentRecordSet.getRecordByPrimaryKey(rowkey).get(this._hierColumnIsLeaf) || !contains;
            if(!rowkey){
               rowkey = null;
            }
            if(this._options.mode === 'navigationMode' && !!this._expanded[rowkey]){ //В режиме навигации не закрываем папки
               return null;
            }
            if(doClose){
               this._expanded[rowkey] = 0;
            }
            else{
               if(isBranch){
                  this._expanded[rowkey] = 1;
               }
            }
            if(this._options.mode === 'navigationMode'){
               closed = this._closeOtherBranches(rowkey);
               if(closed){
                  for(var i in this._expanded){
                     if(this._expanded.hasOwnProperty(i) && this._expanded[i] === 0){
                        this._closeBranch(i);
                     }
                  }
               }
            }
            if(contains && !isBranch){
               this._heightChangedIfVisible();
               return null;
            }
            if(doClose){
               this._closeBranch(rowkey);
               this._heightChangedIfVisible();
               result = null;
            }
            else{
               if(this._options.display.partiallyLoad && !this._loaded[rowkey]){
                  this._loaded[rowkey] = true;
                  this._toggleExpander(rowkey, true);
                  var self = this;
                  result = this._currentRecordSet.loadNode(rowkey, false, undefined, undefined, undefined,
                     {browserFolder: true}).addCallback(function(size){
                        self._hideLoadingIndicator();
                        if(self._expanded[rowkey] && size){
                           var drawResult = self._drawBranch(rowkey);
                           self._notify('onFolderOpen', rowkey, drawResult.keys, drawResult.rows);
                           self._heightChangedIfVisible();
                        }
                     });
               }
               else{
                  this._openBranch(rowkey);
                  this._heightChangedIfVisible();
                  result = null;
               }
            }
            this._updatePager();
            return result ? result : null;
         });
      },
      /**
       * Закрывает другие ветки дерева, кроме указанной
       * @param {String} rowkey Ключ ветки, которую оставить открытой
       * @returns {Boolean}
       * @private
       */
      _closeOtherBranches: function(rowkey){
         var opened = this._getItemParents(rowkey),
            opening = {},
            changes = false;
         for(var i = 0; i < opened.length; ++i){
            opening[opened[i]] = true;
         }
         for(i in this._expanded){
            if(this._expanded.hasOwnProperty(i)){
               if(this._expanded[i] && !opening[i]){
                  this._expanded[i] = 0;
                  changes = true;
               }
            }
         }
         for(i = 1; i < opened.length; ++i){
            if(opened.hasOwnProperty(i)){
               if(!this._expanded[opened[i]]){
                  var contains = this._currentRecordSet.contains(opened[i]);
                  if(contains && this._currentRecordSet.getRecordByPrimaryKey(opened[i]).get(this._hierColumnIsLeaf) || !contains){
                     this._expanded[opened[i]] = 1;
                     changes = true;
                  }
               }
            }
         }
         return changes;
      },
      /**
       * Возвращает, является ли указанная запись папкой
       * @param {String} rowkey Идентификатор записи
       * @returns {Boolean}
       */
      isRecordFolder: function(rowkey){
         if(this.isHierarchyMode()){
            var record = this._currentRecordSet.contains(rowkey) && this._currentRecordSet.getRecordByPrimaryKey(rowkey);
            if(record){
               return record.get(this._hierColumnIsLeaf) === true;
            }
         }
         return false;
      },
      /**
       * Возвращает, открыта папка или нет
       * @param {String} rowkey Идентификатор записи
       * @returns {Boolean}
       */
      isTreeFolderExpanded: function(rowkey){
         return !!this._expanded[rowkey];
      },
      /**
       * Раскрывает/закрывает всё дерево, а не только текущую ветку
       * @param {Boolean} expand Раскрывать ли
       * @param {Boolean} [noLoad] Загружать ли
       */
      applyTurnTree: function(expand, noLoad){
         if(this._options.display.fixedExpand || this._options.display.viewType !== 'tree'){
            return;
         }
         if(expand){
            this._fullTreeExpand = true;
            this._expandTreeAll(noLoad, this._rootNode);
         }
         else{
            this._fullTreeExpand = false;
            this._closeAll(noLoad);
         }
      },
      /**
       * Полностью разворачивает указанную ветку дерева
       * @param {Boolean} noLoad Если указано, то изменения не отобразятся внешне и загрузки не произойдёт
       * @param {String} rowkey Идентификатор папки, которую нужно развернуть
       */
      _expandTreeAll: function(noLoad, rowkey){
         this._expanded = {};
         this._expanded[rowkey] = 2;
         this._systemParams['Разворот'] = 'С разворотом';
         if(!noLoad){
            if(this._options.display.partiallyLoad){
               var self = this;
               this._clearBranch(rowkey); //Очищаем текущие строчки
               this._updateActiveRow();
               this._toggleExpander(rowkey, true);
               this._loaded[rowkey] = true;
               this._currentRecordSet.loadNode(rowkey, false, 0, true, undefined, {browserFolder: true}).addCallback(function(){
                  self._hideLoadingIndicator();
                  self._clearBranch(rowkey); //Очищаем текущие строчки, за время загрузки мы могли успеть загрузить папку без вложенных папок и показать её, тем самым строчки будут двоиться
                  var drawResult = self._drawBranch(rowkey);
                  self._notify('onFolderOpen', rowkey, drawResult.keys, drawResult.rows);
                  self._heightChangedIfVisible();
               });
            }
            else{
               this._clearBranch(rowkey);
               this._openBranch(rowkey);
               this._heightChangedIfVisible();
            }
         }
      },
      /**
       * Закрывает всё в дереве
       * @param {Boolean} [noDraw] Если указано, то изменения не отобразятся
       */
      _closeAll: function(noDraw){
         return this._runInBatchUpdate('Browser._closeAll', function() {
            this._expanded = {};
            if(this._options.display.partiallyLoad){
               this._systemParams['Разворот'] = 'Без разворота';
            }
            if(!noDraw){
               this._drawBody();
            }
         });
      },
      /**
       * Метод построения разворота
       * @param {Boolean} withFolders с папками или без
       * @param {Boolean} [noLoad]    Загружать ли данные
       */
      _expandAll: function(withFolders, noLoad){
         if(this._options.display.viewType === 'tree'){
            if(withFolders !== false){
               var activeRecord = this.getActiveRecord();
      //         if(!activeRecord)
      //            return;
               var rowkey = (activeRecord && activeRecord.getKey()) || this._rootNode;
               if(this._expanded[rowkey])
                  this._processTreeClick(rowkey, true);
               else if((activeRecord && activeRecord.get(this._hierColumnIsLeaf)) || !activeRecord){
                  this._expandTreeAll(noLoad, rowkey);
               }
            }
         }
         else
            $ws.proto.Browser.superclass._expandAll.apply(this, arguments);
      },
      /**
       * Убирает выделение со строки
       * @param {String} key Ключ записи
       */
      _unselectRow: function(key){
         $ws.proto.Browser.superclass._unselectRow.apply(this, arguments);
         if(this._isIdEqual(key, this._rootNode) && !this._options.display.showRoot){
            this._head.find('.ws-browser-checkbox').closest('tr').removeClass('ws-browser-selected-part');
         }
         else{
            var row = this._body.find('tr[rowkey="' + key + '"]');
            row.removeClass('ws-browser-selected-part');
            delete this._selectedPart[key];
         }
      },
      /**
       * Выбирает строку
       * @param {String} key Ключ записи
       */
      _selectRow: function(key){
         $ws.proto.Browser.superclass._selectRow.apply(this, arguments);
         if(this._isIdEqual(key, this._rootNode) && !this._options.display.showRoot){
            this._head.find('.ws-browser-checkbox').closest('tr').removeClass('ws-browser-selected-part');
         }
         else{
            var row = this._body.find('tr[rowkey="' + key + '"]');
            row.removeClass('ws-browser-selected-part');
            delete this._selectedPart[key];
         }
      },
      /**
       * Обозначает, что строка выделена частично
       * @param {String} key Ключ записи
       */
      _selectPartRow: function(key){
         if(this._isIdEqual(key, this._rootNode) && !this._options.display.showRoot){
            this._head.find('.ws-browser-checkbox').closest('tr').addClass('ws-browser-selected-part').removeClass('ws-browser-selected');
         }
         else{
            this._unselectRow(key);
            var row = this._body.find('tr[rowkey="' + key + '"]');
            row.addClass('ws-browser-selected-part');
            this._selectedPart[key] = true;
         }
      },
      /**
       * Меняет выделение на строке. Если было - убирает, если не было - добавляет
       * @param {String} key Ключ записи
       */
      _toggleRowSelection: function(key){
         if(this._options.selectChilds){
            var isSelect = this._selected[key] === undefined,
               self = this,
               toggleChilds = function(key){
                  if(isSelect){
                     self._selectRow(key);
                  }
                  else{
                     self._unselectRow(key);
                  }

                  var childs = self._currentRecordSet.recordChilds(key);
                  for(var i = 0; i < childs.length; ++i){
                     toggleChilds(childs[i]);
                  }
               };
            toggleChilds(key);
            if(key){
               var toggleParent = function(key){
                  var childs = self._currentRecordSet.recordChilds(key),
                     selectedCount = 0,
                     hasPartial = false;
                  for(var i = 0; i < childs.length; ++i){
                     if(self._selected[childs[i]] !== undefined){
                        ++selectedCount;
                     }
                     else if(self._selectedPart[childs[i]] !== undefined){
                        hasPartial = true;
                     }
                  }
                  if(selectedCount === 0 && !hasPartial){
                     self._unselectRow(key);
                  }
                  else if(selectedCount === childs.length && (self._options.selectChilds === 'full' || self._isIdEqual(key, self._rootNode))){
                     self._selectRow(key);
                  }
                  else{
                     self._selectPartRow(key);
                  }
                  if(!self._isIdEqual(self._rootNode, key)){
                     toggleParent(self._currentRecordSet.getRecordByPrimaryKey(key).get(self._hierColumnParentId));
                  }
               };
               toggleParent(self._currentRecordSet.getRecordByPrimaryKey(key).get(self._hierColumnParentId));
            }
         }
         else{
            $ws.proto.Browser.superclass._toggleRowSelection.apply(this, arguments);
         }
      },
      /**
       * Пересчитывает выделение на всех записях, меняет чекбоксы на строках
       */
      _rebuildPartialSelection: function(){
         if(this._options.selectChilds){
            this._selectedPart = {};
            var self = this,
               check = function(key, selectAll){
               var childs = self._currentRecordSet.recordChilds(key),
                  allSelected = true,
                  hasSelected = false;
               if(selectAll){
                  self._selectRow(key);
               }
               for(var i = 0; i < childs.length; ++i){
                  var res = check(childs[i], self._selected[key] !== undefined);
                  if(res !== 2){ //Не все выбраны
                     allSelected = false;
                  }
                  if(res > 0){
                     hasSelected = true;
                  }
               }
               if(selectAll ||
                     (hasSelected && allSelected && self._options.selectChilds === 'full') ||
                     self._selected[key] !== undefined){
                  self._selectRow(key);
                  return 2;
               }
               else if(hasSelected){
                  self._selectPartRow(key);
                  return 1;
               }
               self._unselectRow(key);
               return 0;
            };
            check(this._rootNode, this._selected[this._rootNode] !== undefined);
         }
      },
      /**
       * Заставляет браузер подсвечивать указанный текст
       * @param {String} text Строка, которая нуждается в подсветке. А на самом деле это регэксп! Только тсс!! Никому не говорите!
       * @param {Boolean} [instant] Нужно ли применять изменения сразу же или только после перерисовки
       */
      setTextHighlight: function(text, instant){
         this._highlight = text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
         if(text && instant){
            var highlighted = this._body.find('.ws-browser-text-no-render');
            for(var i = 0, len = highlighted.length; i < len; ++i){
               this._highlightNode($(highlighted[i]));
            }
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
         node.html(this._highlightData(node.text()))

      },
      /**
       * Производит замену в указанном тексте
       * @param {String} data Текст, в котором могут встречаться слова для подсветки
       */
      _highlightData: function(data){
         if(this._highlight && data && typeof(data) === 'string'){
            data = data.replace(new RegExp(this._highlight, 'gi'), '<span class="ws-browser-highlight">$&</span>');
         }
         return data;
      },
      /**
       * Применяет все рендеры к данным выводимым в столбце
       * @param {Object} colDef определение типа колонки
       * @param {$ws.proto.Record} record запись по которой отрисовывается строка
       * @return {String|jQuery} отрендеренные данные
       */
      _renderTD: function(colDef, record, previousRow){
         var data = record.hasColumn(colDef.field) ? record.get(colDef.field) : "",
             previousData = "",
             usingLadder = false,
             ladderIdx = this._ladder[colDef.field],
             dataFromRender = undefined;
         if(previousRow && ( ladderIdx > 0 && this._hasLadder || ladderIdx === 0) && previousRow.hasColumn(colDef.field)){
            this._hasLadder = true;
            usingLadder = true;
            previousData = previousRow.get(colDef.field);
         }
         if (typeof(colDef.render) === 'function')
            dataFromRender = colDef.render.apply(this, [record, colDef.field]);
         if(dataFromRender !== undefined){
            if(typeof(dataFromRender) === 'string')
               dataFromRender = $ws.helpers.escapeTagsFromStr(dataFromRender, ['script']);
            data = dataFromRender;
         } else if (data !== null){
            if(typeof(data) === 'string'){
               data = $ws.helpers.escapeHtml(data);
            }
            if (colDef.formatValue){
               data = $ws.helpers.format(record, colDef.formatValue);  //Альтернативный формат времени
               previousData = usingLadder ? $ws.helpers.format(previousRow, colDef.formatValue) : "";
            } else{
               switch (colDef.type){
                  case 'Перечисляемое':
                     data = $ws.render.defaultColumn.enumType(data);
                     previousData = usingLadder ? $ws.render.defaultColumn.enumType(previousData) : "";
                     break;
                  case "Деньги":
                     data = $ws.render.defaultColumn.money(data);
                     previousData = usingLadder ? $ws.render.defaultColumn.money(previousData) : "";
                     break;
                  case "timestamp":
                  case "timestamptz":
                  case "interval":
                  case "date":
                  case "Дата":
                  case "Дата и время":
                  case "Время":
                     data = $ws.render.defaultColumn.timestamp(data, colDef.type); // формат времени
                     previousData = usingLadder ? $ws.render.defaultColumn.timestamp(previousData, colDef.type) : "";
                     break;
                  case "oid":
                  case "int2":
                  case "int4":
                  case "int8":
                  case "Число целое":
                     data = $ws.render.defaultColumn.integer(data); // формат числа
                     previousData = usingLadder ? $ws.render.defaultColumn.integer(previousData) : "";
                     break;
                  case "boolean":
                  case "bool":
                  case "Логическое":
                     data = $ws.render.defaultColumn.logic(data);  //формат чекбокса возвратит span для true
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
            if(!(data instanceof Object && "jquery" in data))
               data = $ws.helpers.escapeTagsFromStr(data + "", ['script']);
            if(usingLadder){
               if( this._options.display.useWordsLadder && colDef.type in {"Строка" : 0, "Текст" : 0, "varchar" : 0, "text" : 0}){
                  var arrData = data ? data.replace(/(^\s+)|(\s+$)/g, "").split( ' ' ) : [],
                      arrPrev = previousData ? previousData.replace(/(^\s+)|(\s+$)/g, "").split( ' ', this._options.display.wordsLadderCount ) : [],
                      minSize = this._options.display.wordsLadderCount < arrPrev.length ? this._options.display.wordsLadderCount : arrPrev.length,
                      sameWordsLadderCount = 0,
                      newData = "",
                      pos = 0;
                  while( sameWordsLadderCount < minSize && arrData[sameWordsLadderCount] == arrPrev[sameWordsLadderCount] )
                     sameWordsLadderCount++;
                  if( sameWordsLadderCount ){
                     data = [ arrData.splice( 0, sameWordsLadderCount ).join( ' ' ) , arrData.join( ' ' ) ];
                  }
               } else if( data === previousData )
                  data = $("<div class='ws-browser-ladder-element ws-hidden'>" + data + "</div>");
               else
                  this._hasLadder = false;
            } else
               this._hasLadder = false;
            data = this._highlightData(data);
         } else
            data = "";//Чтобы в title не проставился undefined
         return data;
      },
      /**
       * Правит данные столбца для режима работы в один клик
       * @param {Object}  data      данные ячейки
       * @param {Boolean} isBranch отображаем ли мы ячейку для папки
       * @param {Boolean} isRender есть ли функция рендеринга у ячейки
       * @return {jQuery|String} содержимое ячейки таблицы
       */
      _fixDataForOneClickMode: function(data, isBranch, isRender, allowEditAtThePlace, recordKey, parentId){
         var editMode = isBranch ? this._options.editBranchMode : this._options.editMode;
         if(!allowEditAtThePlace && !isRender && (data !== null && data !== undefined)){
            if(!this._options.useHoverRowAsActive && this._options.mode == 'oneClickMode'){
               var pageURL = (editMode == 'thisWindow') ? this.generateEditPageURL(recordKey, isBranch, parentId) : false,
                  linkContent = (editMode == 'thisWindow') && pageURL !== false ? ' class="ws-browser-link" href="' + pageURL + '"' :
                     'class="ws-browser-' + ( isBranch ? 'folder' : 'edit' ) + '-link" href="javascript:void(0)"';
               if( data instanceof Object && 'jquery' in data ) {
                  data = $('<a ' + linkContent + ' />').append(data);
               } else if( data instanceof Array ) {
                  data = $('<a ' + linkContent + '>' +
                     '<span class="ws-invisible ws-browser-ladder-element">' + data[0] + ' </span>' + data[1] + '</a>');
               } else {
                  data = $('<a ' + linkContent + '>' + data + '</a>');
               }
            }
            else if(this._options.mode != 'oneClickMode'){
               if(data instanceof Object && 'jquery' in data)
                  data = $('<span/>').append(data);
               else
                  data = $('<span>' + data + '</span>');
            }
         }
         return data;
      },
      /**
       * Формирование столбца строки таблицы
       *
       * @param {HTMLTableCellElement} cell              элемент ячейки
       * @param {Number}               colIndex          номер столбца, -1 для рендеринга столбца как папки иерархии
       * @param {$ws.proto.Record}     record            запись по которой отрисовывается строка
       * @param {Number}               [padding]         отступ строки, зависит от вложенности
       * @return {HTMLTableCellElement} ячейка таблицы, целиком готовая к выводу
       */
      _createTD: function(cell, colIndex, record, padding, previousRow){
         var colDef = colIndex >= 0 ? this._columnMap[colIndex] : {
            type: 'Строка',
            render: null,
            field: this._options.display.titleColumn,
            title: this._options.display.titleColumn,
            allowEditAtThePlace: this._titleColumnIndex == -1 ? false : this._columnMap[this._titleColumnIndex].allowEditAtThePlace,
            textAlign: 'left',
            fixedSize: false
         },
             data = this._renderTD(colDef, record, previousRow),
             container = $(cell).find(".ws-browser-cell-container")[0],
             isBranch = this.isHierarchyMode() && record.get(this._hierColumnIsLeaf) === true;
         if(colIndex <= 0){
            if(padding || this._options.display.viewType === 'tree')
               container.style.paddingLeft = padding + 'px';
         }

         if(this.isHierarchyMode() && colIndex <= 0){
            container = $(container).children(".ws-browser-text-container")[0];
         }

         data = this._appendDataToCellContainer($(container), data, isBranch, colDef.render, colDef.allowEditAtThePlace,
               record.getKey(), this.isHierarchyMode() ? record.get(this._hierColumnParentId) : undefined);

         if(!colDef.render){
            if(!(data instanceof Object && 'jquery' in data)){
               container.className += ' ws-browser-text-no-render';
            }
         }

         var disabledColumns = this._disabledEditCells[record.getKey()];
         if(disabledColumns !== undefined && (Object.isEmpty(disabledColumns) || disabledColumns[colDef.title] !== undefined)){
            this._disableEditCells($(cell));
         }

         return cell;
      },
      /**
       * Добавляет в ячейку данные
       * @param {jQuery} cellContainer Контейнер, куда необходимо добавить данные
       * @param {*} data Данные, которые необходимо добавить
       * @param {Boolean} isBranch Добавляем ли мы в папку
       * @param {Boolean} isRender Используем ли мы функцию для отрисовки строки
       * @returns {*} Новый вид данных (возможно, их обновили)
       * @private
       */
      _appendDataToCellContainer: function(cellContainer, data, isBranch, isRender, allowEditAtThePlace, recordKey, parentId){

         data = this._fixDataForOneClickMode(data, isBranch, isRender, allowEditAtThePlace, recordKey, parentId);
         if( data instanceof Array ) {
            data = $('<span style="visibility:hidden">' + data[0] + '</span><span>' + data[1] + '</span>');
         }

            cellContainer[0].innerHTML = '';

         if(data instanceof Object && "jquery" in data)
            cellContainer.append(data);
         else if(this._highlight)
            cellContainer.html(data);
         else
            cellContainer[0].innerHTML = (data === null || data === undefined) ?  '' : data;

         if(!isRender){
            if(data instanceof Object && 'jquery' in data){
               data.addClass('ws-browser-text-no-render');
            }
         }

         if(this._options.display.cutLongRows){
            var container = cellContainer[0];
            if(!isRender || !(data instanceof Object && 'jquery' in data))
               container.title = (data instanceof Object && 'jquery' in data) ? data.text() :
                  (container.textContent !== undefined ? container.textContent : container.innerText);
         }
         return data;
      },
      /**
       * Создаёт ячейку для шаблона строки
       * @param {Number} colIndex Номер колонки
       * @param {Object} [exp]     Элемент для раскрытия дерева
       * @param {Boolean} [forResult]  Создаем ли ячейку для итогов
       */
      _createTdTemplate: function(colIndex, exp, forResult){
         var
             td = document.createElement('td'),
             colDef = colIndex >= 0 ? this._columnMap[colIndex] : {
                type: 'Строка',
                render: null,
                field: this._options.display.titleColumn,
                title: this._options.display.titleColumn,
                className: '',
                allowEditAtThePlace: this._titleColumnIndex == -1 ? false : this._columnMap[this._titleColumnIndex].allowEditAtThePlace,
                textAlign: 'left',
                fixedSize: false
             },
             className = $ws._const.Browser.type2ClassMap[colDef.type] || colDef.type,
             classes = [ 'ws-browser-cell' ];

         if(this._options.display.cutLongRows)
            classes.push('ws-browser-cell-cut');

         if(colDef.textAlign !== 'auto')
            classes.push('ws-browser-' + colDef.textAlign);
         else {
            if(className)
               classes.push('ws-browser-type-' + className);
         }
         if(colDef.className)
            classes.push(colDef.className);
         if(forResult !== true){
            if(colDef.allowEditAtThePlace)
               classes.push('ws-browser-edit-column');
            if(this._hasLadder)
               classes.push('ws-browser-column-with-ladder');
         }

         if(classes.length > 0)
            td.className = classes.join(' ');


         var container = document.createElement('div');
         container.className = 'ws-browser-cell-container' + (this._options.display.cutLongRows ? ' ws-browser-div-cut' : '');
         if (this.isHierarchyMode()) {
            container.className += ' ws-browser-hierarchy-cell-container';
         }

         if(exp)
            container.appendChild(exp);
         if(this.isHierarchyMode() && colIndex <= 0){
            var elem = document.createElement('div');
            elem.className = "ws-browser-text-container";
            if (this.isTree()) {
               elem.className += ' ws-browser-tree-text-container';
            }
            container.appendChild(elem);
         }


         td.appendChild(container);
         if(colDef.allowEditAtThePlace && forResult !== true)
            $(td).attr("colIndex", colIndex < 0 ? this._titleColumnIndex : colIndex );
         return td;
      },
      /**
       * Создаёт шаблон строки
       * @param {Boolean} isFolder Будет ли строка отображать папку
       * @returns {HTMLTableRowElement} Элемент-строку
       */
      _createRowTemplate: function(isFolder){
         var row = document.createElement('tr'),
             exp,
             td,
             flag,
            hierarchyMode = this.isHierarchyMode();
         if (hierarchyMode && isFolder){
            exp = document.createElement('span');
            exp.className = 'ws-browser-expander-container';
            if(this._options.display.viewType === 'tree' && this._turn === ''){//проставление экспандеров в дереве
               if(this._options.display.hierarchyIcons && this._options.display.hierarchyIcons !== $ws._const.Browser.hierarchyIcons){
                  exp.style.backgroundImage = ['url(', $ws._const.wsRoot, this._options.display.hierarchyIcons, ')'].join('');
               }
               exp.className += ' ws-browser-icon ws-browser-expander';
            }
         }
         this._hasLadder = false;
         flag = isFolder && ((this._options.display.viewType === 'tree' && this._turn !== '') ||
                     this._options.display.viewType === 'hierarchy');
         var num = 0, colDef;
         for (var i = 0, len = this._columnMap.length; i < len; ++i, exp = undefined){
            td = false;
            num = (i === 0 && flag) ? -1 : i;
            colDef = this._columnMap[i];
            if(flag){
               if(num === -1 || colDef.useForFolder){
                  td = this._createTdTemplate(num, exp);
                  td.className += isFolder ? ' ws-browser-bold' : '';
               }
            } else
               td = this._createTdTemplate(num, exp);
            if(td)
               row.appendChild(td);
         }
         /**
          * Добавлять чекбоксы в зависимости от selectionType:
          * "leaf" - только у листьев
          * "node" - только у узлов
          */
         if (this._options.display.showSelectionCheckbox && this._options.useSelection !== false){
            if(!hierarchyMode ||
                (hierarchyMode &&
                    !(this._options.selectionType === 'leaf' && isFolder) &&
                    !(this._options.selectionType === 'node' && !isFolder)
                    )
                ){
               this._addCheckBox(row);
            }
            else if(hierarchyMode){
               $(row).find('td:first .ws-browser-cell-container').before('<span class="ws-browser-checkbox-holder"></span>');
            }
         }
         return row;
      },
      /**
       * Создаёт шаблоны строк для создания из них всех остальных строк
       */
      _createRowTemplates: function(){
         this._rowTemplates[0] = this._createRowTemplate(false);
         this._rowTemplates[1] = this._createRowTemplate(true);
      },
      /**
       * Формирование  строки таблицы
       *
       * @param   {$ws.proto.Record}   record         строка RecordSet
       * @param   {Number}             level          уровень вложенности строки, используется для просчёта отступов
       * @param   {$ws.proto.Record}   [previousRow]  предыдущая запись
       * @return  {HTMLTableRowElement}         стандартный html-объект, строку
       */
      _createTR: function(record, level, previousRow){
         var isFolder = (this.isHierarchyMode() ? record.get(this._hierColumnIsLeaf) : null),
             hasChild = this._options.display.viewMode === 'foldersTree' ? record.get(this._hierColumnHasChild) : null,
             row = this._rowTemplates[isFolder ? 1 : 0].cloneNode(true),
             key = record.getKey(),
             isExpanded = !!this._expanded[key],
             self = this,
             classes = ['ws-browser-table-row'],
             padding = 0,
             visClass = 'ws-visible',
             exp = $(row).find('.ws-browser-expander-container')[0];
         if(key === null){
            key = 'null';
         }
         row.setAttribute('rowkey', key);
         if(this.isHierarchyMode()){
            row.setAttribute($ws._const.Browser.treeLevelAttribute, level);
         }
         if(this._options.display.hasZebra){
            classes.push('rE');
         }
         if(this._selected[key] !== undefined)
            classes.push('ws-browser-selected');
         if(this._selectedPart[key] !== undefined)
            classes.push('ws-browser-selected-part');

         if (this.isHierarchyMode()){
            if(this._options.display.viewType === 'tree' && this._turn === '' && isFolder){//проставление экспандеров в дереве
               if(this._options.display.viewMode !== 'foldersTree' || hasChild === true ){
                  $(exp).addClass(isExpanded ? 'minus' : 'plus');
               } else if($ws._const.theme !== 'wi_scheme'){
                  var imgPath = $ws._const.theme ? 'img/themes/' + $ws._const.theme + '/browser/' : 'img/browser/';
                  $(exp).css('background', ['url(', $ws._const.wsRoot, imgPath + 'bullet.png', ') no-repeat scroll center center transparent'].join(''));
               }
            }

            var imw = $ws._const.Browser.iconWidth; //проставление отступов узлов в дереве
            padding += imw * level;
            padding += $ws._const.Browser.defaultCellPadding;
            padding += !isFolder && this._options.display.viewType === 'tree' && this._turn !== ''
                ? imw : 0;

            if(this._options.display.viewType === 'tree'){
               padding = this._insideOfAccordion ?
                         $ws._const.Browser.accordion.padding + level * $ws._const.Browser.accordion.levelIndent :
                         ($ws._const.Browser.newIconWidth * level + (this._container.hasClass('ws-treeview-employees') && level > 1 ? (level - 1) * 4 : 0));
            }
            row.setAttribute('parentId', record.get(this._hierColumnParentId));
            if(isFolder && (this._options.display.viewMode !== 'foldersTree' || hasChild))
               classes.push("ws-browser-tree-branch", "ws-browser-folder");

            if(isFolder){
               if(this._options.display.viewType !== 'tree' || !isFolder || this._turn !== '' ||
                   ( this._options.display.viewMode === 'foldersTree' && !hasChild && $ws._const.theme === 'wi_scheme')){
                  if(this._options.display.hierarchyIcons && this._options.display.hierarchyIcons !== $ws._const.Browser.hierarchyIcons){
                     exp.style.backgroundImage = ['url(', $ws._const.wsRoot, this._options.display.hierarchyIcons, ')'].join('');
                  }
                  exp.className += ' ' + (( hasChild || this._options.display.viewType !== 'tree' || this._turn !== '') ? ((isExpanded &&
                      this._options.display.viewType === 'tree') || this._turn !== '' ? 'icon-16 icon-OpenedFolder icon-primary' : 'icon-16 icon-Folder icon-primary') : 'ws-browser-icon item item');
               }
               if(this._options.display.folderIcon){
                  $(exp).css('background',['url(', $ws.helpers.processImagePath(this._options.display.folderIcon), ') no-repeat scroll center center transparent'].join(''));
               }
            }
         }
         classes.push(visClass);
         if(classes.length > 0)
            row.className = classes.join(' ');

         var cells = row.childNodes;
         if((this._options.display.viewType === 'hierarchy' ||
               (this._options.display.viewType === 'tree' && this._turn !=='')) && isFolder){
            var flag = false,
                colspanEnd = 0,
                k = 1,
                lastTd,
                td = this._createTD(cells[0], -1, record, padding, false);
            for(var i = 1, len = this._columnMap.length; i < len; ++i){
               if (this._columnMap[i].useForFolder){
                  lastTd = this._createTD(cells[k++],i,record,padding,false);
                  if (!flag){
                     colspanEnd = i;
                     flag = true;
                  }
               }
            }
            if (flag){
               td.colSpan = colspanEnd;
               lastTd.colSpan = this._getColumnsCount() - colspanEnd;
            } else
               td.colSpan = this._getColumnsCount();
         }
         else{
            this._hasLadder = false;
            for( i = 0, len = this._columnMap.length; i < len; ++i){
               this._createTD(cells[i], i, record, padding,
                   self._options.display.ladder.length !== 0 ? previousRow : false);
            }
         }
         this._rowsMap[key] = $(row);
         if (typeof(this._options.display.rowRender) == 'function')
            this._options.display.rowRender.apply(this, [record, $(row)]);

         return row;
      },
      /**
       * Создаёт функцию-обёртку для обработки нажатия на опцию строки
       * @param {Function} callback Функция, которую необходимо обернуть
       * @return {Function}
       * @private
       */
      _rowOptionsCallbackWrapper: function(callback){
         var self = this;
         return function(){
            self.setActiveRow(self._rowOptionsHoverRow);
            callback(self._rowOptionsHoverRecord, self._rowOptionsHoverRow);
         }
      },
      /**
       * Возвращает обработчик нажатия на опцию строки
       * @param {Array} option Массив с параметрами опции строки
       * @return {*}
       * @private
       */
      _rowOptionsButtonCallback: function(option){
         var callback,
            self = this;
         if(typeof(option[2]) === 'function'){
            callback = this._rowOptionsCallbackWrapper(option[2]);
         }
         else{
            callback = function(event){
               event.stopImmediatePropagation();
               self.setActiveRow(self._rowOptionsHoverRow);
               self._actions[option[2]](self._rowOptionsHoverRow, true, event);
            };
         }
         return callback;
      },
      /**
       * Добавляет опцию строки
       * @param {Array} option Массив с параметрами опции
       * @private
       */
      _addRowOption: function(option){
         var callback = this._rowOptionsButtonCallback(option),
            name = '',
            imgPath = $ws._const.wsRoot +
               ($ws._const.theme ? 'img/themes/' + $ws._const.theme + '/browser/' : 'img/browser/');
         if(typeof(option[2]) === 'string'){
            name = option[2];
         }
         else if(option[3]){
            name = option[3];
         }

         for(var i = 0; i < this._rowOptionsDefault.length; ++i){
            if(name === (this._rowOptionsDefault[i][3] || this._rowOptionsDefault[i][2])){
               return;
            }
         }

         var imgSrc = option[1].indexOf('/') > -1 ? option[1] : imgPath + option[1];
         if(this._rowOptionsElement){
            var optionBlock = $('<span class="ws-browser-row-option"></span>'),
               button = $('<span class="ws-browser-row-option-border" title="' + option[0] + '"></span>')
                  .append(optionBlock)
                  .mousedown(function(e){
                     e.stopPropagation();
                     e.preventDefault();
                  });
            if(option[4]){
               button.insertBefore(this._rowOptionsButtons[option[4]]);
            }
            else{
               button.appendTo(this._rowOptionsElement.find('.ws-browser-row-options-container'))
            }
            BackgroundMapper.makeBackground(optionBlock, imgSrc);
            if(callback){
               button.bind('click', callback);
            }
            if(name){
               this._rowOptionsButtons[name] = button;
            }
            if(this._rowOptionsMenu instanceof Object){
               var menuItem = {
                  imgSrc: imgSrc,
                  id: this.getId() + '_' + name,
                  caption: option[0],
                  handlers: {
                     'onActivated': callback
                  }
               };
               if(option[4] !== undefined){
                  this._rowOptionsMenu.insertItem(menuItem, this.getId() + '_' + option[4]);
               }
               else{
                  this._rowOptionsMenu.addItem(menuItem);
               }
            }
         }
         if(option[4]){
            for(i = 0; i < this._rowOptionsDefault.length; ++i){
               var current = this._rowOptionsDefault[i];
               if((current[3] || current[2]) == option[4]){
                  this._rowOptionsDefault.splice(i, 0, option);
                  break;
               }
            }
         }
         else{
            this._rowOptionsDefault.push(option);
         }
      },
      /**
       * Добавляет опцию строки
       * @param {Object} settings Объект формата {title: ..., icon: ..., name: ..., callback: ..., before: }
       */
      addRowOption: function(settings){
         this._addRowOption([settings['title'], settings['icon'], settings['callback'], settings['name'], settings['before']]);
      },
      /**
       * Добавляет опции строки и перерисовывает их
       * Из-за перерисовки рекомендуется засовывать сразу все опции в один массив и за один вызов добавлять их
       * @param {Array} options Массив массивов. Каждый внутренний массив вида: ['Заголовок', 'Иконка', 'Название команды или функция', 'Название кнопки']. При этом название кнопки не должно совпадать со стандартным. По этому имени кнопку можно скрывать в событии onRowOptions
       */
      addRowOptions: function(options){
         for(var i = 0, len = options.length; i < len; ++i){
            this._addRowOption(options[i]);
         }
      },
      /**
       * Возвращает набор действий, которые должны быть доступны в опциях строки
       * @returns {Array} Массив, каждый элемент которого - тоже массив, вида [название, иконка, название действия (для _actions)]
       */
      _getRowOptions: function(){
         var actions = [];
         if(this._turn === '' &&
            (this._options.display.viewType === 'tree' || this._options.display.viewType === 'foldersTree')){
            actions.push(['Добавить лист (Insert)', 'sprite: icon-16 icon-Add icon-primary', 'addItem', 'addItem'],
               ['Добавить папку (Ctrl + Insert)', 'sprite:icon-16 icon-CreateFolder icon-primary', 'addFolder', 'addFolder']);
         }
         if((this._options.mode == 'oneClickMode') || this._options.mode !== 'oneClickMode' || this._selectMode === true)
            actions.push([this._options.display.readOnly ? 'Просмотреть (F3)' : 'Редактировать (F3)', 'sprite:icon-16 icon-Edit icon-primary', 'edit', 'edit']);
         actions.push(
            ['Удалить', 'sprite:icon-16 icon-Erase icon-error', 'delete', 'delete'],
            ['Печать записи (F4)', 'sprite:icon-16 icon-Print icon-primary', 'printRecord', 'printRecord'],
            ['Копировать запись (Shift+F5)', 'sprite:icon-16 icon-Copy icon-primary', 'copy', 'copy'],
            ['История записи (Ctrl+H)', 'sprite:icon-16 icon-History icon-primary', 'history', 'history']);
         actions.push(['Переместить выбранные записи', 'sprite:icon-16 icon-Move icon-primary', $.proxy(this._moveSelectedRecordsToCurrent, this), 'move', 'move']);
         return actions;
      },
      /**
       * Инициализирует начальные опции строки
       */
      _initRowOptionsDefaults: function(){
         this._rowOptionsDefault = this._getRowOptions();
      },
      /**
       * Функция-обработчик кнопки опций строки "переместить"
       * @param {$ws.proto.Record} record Запись, для которой показываются опции строки
       * @private
       */
      _moveSelectedRecordsToCurrent: function(record){
         this._confirmMoveRecords(record);
      },
      /**
       * Создаёт шаблон ячейки с опциями строки и инициализирует события
       */
      _createRowOptions: function(){
         if(this._rowOptionsElement !== false){
            return;
         }
         var self = this,
               browserContainer = this._rootElement.find('.ws-browser-container-wrapper'),
               imgPath = $ws._const.wsRoot +
                     ($ws._const.theme ? 'img/themes/' + $ws._const.theme + '/browser/' : 'img/browser/'),
               options = this._rowOptionsDefault;
         if(options.length){
            var bg0 = ($ws._const.theme == 'wi_scheme' ?
                  '' :
                  '<img src="' + imgPath + 'panel_bg0.png" width="10" height="100%" style="float:right;">'),
               bg1 = ($ws._const.theme == 'wi_scheme' ?
                  '' :
                  '<img class="ws-browser-row-options-bg" src="' + imgPath + 'panel_bg1.png" height="100%" style="position:absolute;">'),
               div = $('<div class="ws-browser-row-options-block">' + bg0 + '</div>')
                  .bind('mouseover mouseout', function(e){
                  self._rowOptionsHoverRow && self._rowOptionsHoverRow[e.type === 'mouseover' ? 'addClass' : 'removeClass']('ws-browser-row-hover');
               }),
               container = $('<div class="ws-browser-row-options-container">' + bg1 + '</div>').prependTo(div),
               createEvent = function(from){
                  var offset = from.offset(),
                     event = {};
                  event.clientX = offset.left + $ws._const.Browser.rowOptionsMenuOffset.left;
                  event.clientY = offset.top + $ws._const.Browser.rowOptionsMenuOffset.top;
                  return event;
               };
            this._rowOptionsMenuButton =
                  $('<span class="ws-browser-row-option-border ws-browser-row-option-menu-button"><span class="ws-browser-row-option menu"></span></span>')
               .appendTo(container)
               .bind('click', function (e){
                  self._hiddenByMenuClose = false;
                  self.setActiveElement(self._rowOptionsHoverRow);
                  e.stopImmediatePropagation();
                  self._rowOptionsMenuVisible = true;
                  var event = createEvent($(this));
                  if(self._rowOptionsMenu instanceof Object){
                     self._applyRowOptions();
                     self._rowOptionsMenu.show(self._rowOptionsMenuButton, $ws._const.Browser.rowMenuOffset, undefined, undefined, true);
                     self._rowOptionsElement.hide();
                     if(self._rowOptionsMenuVisible && self.isHierarchyMode()){
                        if(!!self._options.editBranchDialogTemplate !== !!self._options.editDialogTemplate){
                           var record = self._rowOptionsHoverRecord;
                           if(record.get(self._hierColumnIsLeaf) === true && !self._options.editBranchDialogTemplate ||
                              record.get(self._hierColumnIsLeaf) === null && !self._options.editDialogTemplate){
                              self._rowOptionsMenu.hideItem(self.getId() + '_edit');
                           } else {
                              self._rowOptionsMenu.showItem(self.getId() + '_edit');
                           }
                        }
                     }
                  }
                  else if(self._rowOptionsMenu === undefined){
                     self._createRowOptionsMenu(event);
                  }
               }).mousedown(function(e){
                  e.stopPropagation();
                  e.preventDefault();
               });
            for(var i = 0, len = options.length; i < len; ++i){
               var callback = this._rowOptionsButtonCallback(options[i]),
                  name = '';
               if(typeof(options[i][2]) === 'string'){
                  name = options[i][2];
               }
               else if(options[i][3]){
                  name = options[i][3];
               }
               var option = $('<span class="ws-browser-row-option"></span>'),
                  button = $('<span class="ws-browser-row-option-border" title="' + options[i][0] + '"></span>')
                  .appendTo(container)
                  .append(option)
                  .mousedown(function(e){
                     e.stopPropagation();
                     e.preventDefault();
                  });
               var imgSrc = options[i][1];
               if(imgSrc.indexOf('sprite:') != -1){
                  $(option).removeClass('ws-browser-row-option');
                  $(option).addClass(imgSrc.split("sprite:")[1]);
               }
               else {
                  imgSrc = options[i][1].indexOf('/') > -1 ? options[i][1] : imgPath + options[i][1];
                  BackgroundMapper.makeBackground(option, imgSrc);
               }
               if(callback){
                  button.bind('click', callback);
               }
               if(name){
                  this._rowOptionsButtons[name] = button;
               }
            }
            this._rowOptionsElement = div.appendTo(browserContainer)
               .bind('mousemove', function(){
                  self._rowOptionsTargetRow = self._rowOptionsHoverRow;
               });
         }
         else{
            this._rowOptionsElement = undefined;
         }
      },
      _createRowOptionsSubMenu: function(actionName, menuElement){
         if(actionName == 'printRecord'){
            var rowkey = this._rowOptionsHoverRow.attr("rowkey");
            if(!this._isIdEqual(rowkey, this._rootNode)){
               var record = this.getRecordSet().getRecordByPrimaryKey(rowkey),
                  subMenu = this._prepareReports(false, record);
               if(subMenu === false){
                  this._needPrint = false;
               } else if(typeof(subMenu) == 'string'){
                  this._needPrint = subMenu;
                  subMenu = false;
               }
               if(subMenu){
                  menuElement.subMenu = subMenu;
               }
            }
         }
      },
      /**
       * Создаёт меню для опций строки. Номер меню влияет на набор строк (первое - с добавлением узлов)
       * @param {Object} event      Событие, которое будет использовано для показа меню
       */
      _createRowOptionsMenu: function(event){
         var actions = this._rowOptionsDefault,
            rows = [],
            imgPath = $ws._const.wsRoot +
                  ($ws._const.theme ? 'img/themes/' + $ws._const.theme + '/browser/' : 'img/browser/'),
            self = this,
            separator = false;
         this._rowOptionsMenu = true;
         for(var i = 0, len = actions.length; i < len; ++i){
            if(actions[i][0]){
               var callback;
               if(typeof(actions[i][2]) === 'function'){
                  callback = this._rowOptionsCallbackWrapper(actions[i][2]);
               }
               else{
                  callback = this._actions[actions[i][2]];
               }
               var onActivatedFunction = function(callback, id, element){
                  if(!element.subMenu)
                     callback(self._rowOptionsHoverRow, true);
               }.bind(this, callback),
                  menuElement = {
                  caption: actions[i][0],
                  id: self.getId() + '_' + (actions[i][3] || actions[i][2]),
                  imgSrc: actions[i][1].indexOf('/') > -1 ? actions[i][1] : imgPath + actions[i][1],
                  handlers: {
                     onActivated: onActivatedFunction
                  }
               };
               this._createRowOptionsSubMenu(actions[i][2], menuElement);
               rows.push(menuElement);
               separator = false;
            }
            else if(rows.length){
               rows.push({caption: ''});
               separator = true;
            }
         }
         if(separator){
            rows.pop();
         }
         $ws.core.attachInstance('Control/Menu', {
            data: rows,
            handlers: {
               onReady: function(){
                  self._rowOptionsMenu = this;
                  self._rowOptionsCurrentMenu = this;
                  this.getContainer().addClass('ws-browser-row-options-menu');
                  self._applyRowOptions();
                  this.show(self._rowOptionsMenuButton, $ws._const.Browser.rowMenuOffset, undefined, undefined, true);
                  self._rowOptionsElement.hide();
               },
               onClose: function(){
                  self._rowOptionsMenuVisible = false;
                  self._showRowOptionsForTargetRow();
               }
            }
         }).addCallback(function(instance){
            self._rowOptionsMenu = instance;
            self._rowOptionsMenu.getMenuUL()
               .append('<div class="ws-browser-row-options-hide"></div>')
               .bind('click', function() {
                  self._rowOptionsMenuVisible = false;
                  self._rowOptionsMenu.hide();
               });
            if(self._needPrint === false && self._actions['printRecord'])
               instance.hideItem(self.getId() + '_printRecord');
         });
      },
      /**
       * Добавляет чекбокс для для множественного выбора строк мышью
       * @param {HTMLTableRowElement} row элемент-строка, к которой необходимо добавить чекбокс
       */
      _addCheckBox : function(row){
         var checkbox = $('<span class="ws-browser-checkbox"></span>');
         $(row).find('td:first .ws-browser-cell-container').before(checkbox);

         //$(row).find('td:first div.ws-browser-cell-container').prepend(checkbox);
      },
      /**
       * Обработка нажатия мыши на границе столбца
       *
       * @param {jQuery} th изменяемая колонка
       * @param {Number} x позиция мыши
       */
      _dragStart: function(th, x){
         this._head.find('tr').eq(0).css("cursor", "col-resize");
         this._resizing = true;
         this._resizingColumn = th;
         this._start = x;
      },
      /**
       * Обработка перемещения мыши с нажатой кнопкой на границе столбца
       *
       * @param {Number} x позиция мыши
       */
      _dragMove: function(x){
         if(this._resizing && this._isResizeAvailable(this._resizingColumn, x)){
            var _wPrev = this._newWidth(this._resizingColumn.prev(), x, 1),
               _wthis = this._newWidth(this._resizingColumn, x, -1);
            if(_wPrev && _wthis){
               this._setWidth(_wPrev);
               this._setWidth(_wthis);
               this._start = x;
            }
            else if(_wPrev){
               this._setWidth(_wPrev);
               var dvContainer = this._container.find('.ws-browser-container'),
                  dfContainer = this._container.find('.ws-browser-footer'),
                  dhContainer = this._container.find('.ws-browser-head');

               this._container.find('.ws-browser-head').css('overflow-x', 'hidden');
               dvContainer.width(dvContainer.width() + x - this._start + 'px');
               dfContainer.width(dfContainer.width() + x - this._start + 'px');
               dhContainer.width(dhContainer.width() + x - this._start + 'px');
               this._start = x;
            }
         }
      },
      /**
       * Обработка окончания перемещения мыши
       */
      _dragEnd:  function(){
         if(this._resizing){
            this._head.find('tr').eq(0).css("cursor", "default");
            this._resizing = false;
         }
      },
      /**
       * Вычисление новых ширин столбцов
       *
       * @param {jQuery} _this изменяемая колонка
       * @param {Number} end позиция мыши
       * @param {Number} flag = +/-1 сжимаем или растягиваем столбец
       * @return {Array} newWidth массив новых ширин столбцов в случае если новая общая ширина столбца больше 50px, иначе false
       */
      _newWidth: function(_this, end, flag ){
         var diff = 0,
            newWidth = [],
            sumWidth = 0,
            colspan = _this.attr('colspan');

         colspan = colspan ? colspan : 1;
         diff = (end - this._start) / colspan;

         for (var i = _this.attr('csIndex'); colspan > 0; i++,colspan--)
            sumWidth += newWidth[i] = parseInt(this._headColumns.eq(i).css("width"), 10) + flag*diff;

         return sumWidth > $ws._const.Browser.minColumnWidth ? newWidth : false;
      },
      /**
       * Изменение ширин столбцов
       *
       * @param {Array} [newW] массив новых ширин столбцов
       */
      _setWidth: function(newW){
         var self = this,
            maxIndx = -1,
            maxVal = 0,
            sum = 0,
            rootWidth,
            nullCols = [],
            cols = [],
            nonPercentCols = [],
            nonFixedCols = [],
            tablesWidth;

         //Вычитаем 1 для лечения глюка IE, который иногда думает, что ему не хватает места в
         // родительском блоке _rootElement, и добавляет прокрутку
         rootWidth = self._rootElement.width() - (this._verticalScrollShowed ? this._scrollWidth : 0) - 1;

         function getMinWidth(colIdx) {
            var type = self._columnMap[colIdx].type,
                minWidth = self._columnMap[colIdx].minWidth,
                defColWidth = $ws._const.Browser.defColWidth,
                defMinWidth = type in defColWidth ? defColWidth[type] : defColWidth['another'];

            return parseInt(minWidth !== null ? minWidth : defMinWidth, 10);
         }

         if(rootWidth === 0){
            this._needResize = true;
         }

         tablesWidth = (rootWidth > this._options.minWidth? rootWidth: this._options.minWidth) + 'px';
         this._data.width(tablesWidth);
         if (this._head)
            this._head.closest('table').width(tablesWidth);

         if(!this._haveAutoWidth()){
            if(newW){
               $ws.helpers.forEach(newW, function(width, idx) {
                  this._headColumns.eq(idx).attr('width', width);
                  this._resultsColumns.eq(idx).attr('width', width);
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
               if(rootWidth > sum)
                  newW[maxIndx] += rootWidth - sum;

               // Сделаем ресайз всех колонок. И в шапке и в теле таблицы
               if(this._bodyColumns){
                  $ws.helpers.forEach(cols, function(col, idx) {
                     col.attr('width', newW[idx]);
                     this._headColumns.eq(idx).attr('width', newW[idx]);
                     this._resultsColumns.eq(idx).attr('width', newW[idx]);
                  }, this);
               }

               if(this._options.display.allowHorizontalScroll && this._emptyDataScroller)
               {
                  this._emptyDataScroller.width(sum);
               }
            }
         } else {
            // autoSize
            this._rootElement.width("auto");

            this._data.removeClass('ws-table-fixed').width('auto').css({'table-layout': 'auto'});
            this._head.parent().width('1px').css({'table-layout': 'auto'});
            this._resultBrowser.removeClass('ws-table-fixed').width('1px').css({'table-layout': 'auto'});
            this._browserContainer.width('auto');
            if(!newW){
               newW = $ws.helpers.map(this._columnMap, function(col) { return col.width; });
            }
            var td_header = $(this._head).find('> tr:eq(0) > td'),
               td_result = this._resultBrowser.find('tr:eq(0) > td'),
               dfContainer = this._container.find('.ws-browser-footer');
            // ищем первый (второй) ряд в таблице без colspan
            // для рассчета автоширины данных в таблице
            var from = this._options.display.allowAddAtThePlace ? 1 : 0,
               td_data=$(),
               old_td_data = this._data.find('tr:eq('+from+') > td'),
               tr = this._data.find('tr'),
               i;
            for (i = from; i < tr.length; i++) {
               // IE<9 аттрибут colspan присутствует по умолчанию в объекте
               if ($(tr[i]).find('td[colspan="1"], td:not([colspan])').length > 0) {
                  td_data = $(tr[i]).find('td');
                  break;
               }
            }

            $ws.helpers.forEach(newW, function(_, i) {
               self._bodyColumns.eq(i).attr('width', '');
               self._headColumns.eq(i).attr('width', '');
               self._resultsColumns.eq(i).attr('width', '');
            }, this);

            var totalWidth = 0, isEmptyTable = this._currentRecordSet && this._currentRecordSet.isEmptyTable();
            // фиксированным колонки оставляем установленный им размер, остальным ставим авто-размер.
            $ws.helpers.forEach(newW, function(_, i) {
               var value, isFixed = self._columnMap[i] && this._columnMap[i].fixedSize;
               if (isFixed || isEmptyTable) {
                  value = isFixed ? newW[i] : (newW[i] || getMinWidth(i));
               }
               else{
                  value = Math.max(td_data.eq(i).outerWidth(), td_header.eq(i).outerWidth(), td_result.eq(i).outerWidth());
                  // в IE9 значение ширины может быть дробное и тогда возникает перенос на след. строку
                  if(this._columnMap[i])
                     this._columnMap[i].width = value = parseInt(value, 10) + 1;
               }
               totalWidth += value;
            }, this);
            // берём максимум из ширины первой строки данных и суммы ширин столбцов
            if(td_data.length === 0){
               totalWidth = Math.max(old_td_data.eq(0).outerWidth(), totalWidth);
            }

            // установка "авто-ширин"
            $ws.helpers.forEach(this._columnMap, function(col, i) {
               this._headColumns.eq(i).attr('width', col.width);
               this._bodyColumns.eq(i).attr('width', col.width);
               this._resultsColumns.eq(i).attr('width', col.width);
            }, this);

            this._data.width('auto');
            this._updateSizeVariables();
            var realMinWidth = this._options.minWidth,
               flagMinSize = false;
            if(this._verticalScrollShowed){
               realMinWidth -= this._scrollWidth;
            }
            if(totalWidth < realMinWidth){
               flagMinSize = true;
               totalWidth = realMinWidth;
            }
            var headWidth = totalWidth;
            if(this._verticalScrollShowed){
               headWidth += this._scrollWidth;
            }
            this._data.width(totalWidth);
            this._browserContainer.width(headWidth);
            this._head.parent().width(headWidth);
            this._resultBrowser.width(headWidth);
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
                  this._resultsColumns.eq(i).attr('width', width);

               }, this);

               this._head.parent().width(headWidth);
            }
            this._data.addClass('ws-table-fixed').css({'table-layout': 'fixed'});
            this._head.parent().addClass('ws-table-fixed').css({'table-layout': 'fixed'});
            this._resultBrowser.addClass('ws-table-fixed').css({'table-layout': 'fixed'});
        }
        this._updateSizeVariables();
      },
      /**
       * Функция для получения ширины таблицы (количество столбцов)
       *
       * @return Number
       */
      _getColumnsCount: function(){
         return this._columnMap.length;
      },
      /**
       * Проверка возможности изменения каждого столца на целое число
       *
       * @param {jQuery} _this изменяемый столбец
       * @param {Number} end позиция мыши
       * @return {Boolean} true изменение на целое число возможно, false -- не возможно
       */
      _isResizeAvailable: function(_this, end){
         var
            csPrev = _this.prev().attr('colspan'),
            csSelf = _this.attr('colspan'),
            diffPrev = (end - this._start) / (csPrev ? csPrev : 1),
            diffSelf = (end - this._start) / (csSelf ? csSelf : 1);

         return diffPrev === Math.round(diffPrev) && diffSelf === Math.round(diffSelf);
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
         self._body.find('tr').eq(0).children('td').each(function(){
            if(self._options.display.viewType === 'hierarchy' && k !== 0)
               $(this).attr("id", self._idCols[k-1]);
            else if(self._options.display.viewType !== 'hierarchy')
               $(this).attr("id", self._idCols[k]);
            k++;
         });

         self._setWidth();
      },
      /**
       * инициализация событий необходимых для ресайза
       * @return {Boolean}
       */
      _initResizeEvents: function(){
         var self = this;

         $('span.ws-browser-resize', self._head[0]).live('mousedown', function(e){
            self._dragStart($(this).parent(), e.clientX);
            return false;
         });

         $('.ws-browser-data-container', self._container[0]).live('mousemove', function (e){
            if(self._resizing === true)
               self._dragMove(e.clientX);
            return false;
         });

         $(document).mouseup(function (){
            self._dragEnd();
            return false;
         });
      },
      /**
       * Смена текущей выделенной строки
       * @param {jQuery} row Выделенная строка
       */
      setActiveRow:function(row){
         this.setActiveElement(row);
      },
      /**
       * Получение текущей выделенной строки
       * @return {jQuery|Boolean} текущая выделенная строка или false если ничего не выделено
       */
      getActiveRow: function(){
         return this.getActiveElement();
      },
   _recordsMouseMove: function(event){
      if(!this._dragStarted){
         var changeX = Math.abs(event.clientX - this._dragStartPoint.x),
            changeY = Math.abs(event.clientY - this._dragStartPoint.y);
            if(changeX + changeY > $ws._const.startDragDistance){
            this._dragObject = $('<div class="ws-browser-dragged"><div class="ws-browser-dragged-count">'
               + this._dragRecords.length + '</div></div>')
                  .appendTo($('body'))
                  .css({'left': event.clientX + $ws._const.Browser.recordsMoveOffset.left,
                     'top': event.clientY + $ws._const.Browser.recordsMoveOffset.top});
            this._dragRow.addClass("ws-browser-draggable-row");
            this._container.addClass('drag-over ws-no-select');
            this._dragStarted = true;
            }
            else{
               return true;
            }
         }
      this._dragObject.css({'left': event.pageX + $ws._const.Browser.recordsMoveOffset.left,
                               'top': event.pageY + $ws._const.Browser.recordsMoveOffset.top});
         var targetRow = $(event.target);
      if(event.target.nodeName.toLowerCase() != 'tr'){
         targetRow = targetRow.closest('tr');
      }
      if(this._dragTargetRow){
         if(!(targetRow.length !== 0 &&
            targetRow.attr('rowkey') == this._dragTargetRow.attr('rowkey'))){
            this._dragTargetRow.removeClass('ws-browser-want-drag');
            this._dragTargetRow = undefined;
         }
         else{
            return false;
         }
      }
      this._dragTargetRow = targetRow;
      this._dragIsCorrect = false;
      if(targetRow.length === 0 || targetRow.parents('table').get(0) != this._data.get(0)){
            return false;
         }
      var rowkey = targetRow.attr('rowkey'),
            record = this._currentRecordSet.contains(rowkey) && this._currentRecordSet.getRecordByPrimaryKey(rowkey);
         if(rowkey === 'null'){
            rowkey = null;
         }
         if(!record && rowkey != this._rootNode){
         return false;
         }
         var i, len;
      for(i = 0, len = this._dragRecords.length; i < len; ++i){
         if(this._dragRecords[i].getKey() == rowkey){
            return false;
         }
      }
      if(this._notify('onDragMove', this._dragRecords, record) === false){
         return false;
      }
      if(this._options.display.viewType === 'tree'){
         var tempKey = rowkey;
         while(tempKey && tempKey != this._rootNode){
            for(i = 0, len = this._dragRecords.length; i < len; ++i){
               if(this._dragRecords[i].getKey() == tempKey){
                  return false;
               }
            }
            tempKey = record.get(this._hierColumnParentId);
            if(this._currentRecordSet.contains(tempKey)){
               record = this._currentRecordSet.getRecordByPrimaryKey(tempKey);
            }
            else if(tempKey != this._rootNode){
               if(tempKey != this._currentRootId){
                  return false;
               }
               break;
            }
         }
      }
      this._dragIsCorrect = true;
      this._dragTargetRow.addClass('ws-browser-want-drag');
      return false;
      },
      /**
       * Срабатывает при отпускании кнопки мыши во время перетаскивания записей
       * @private
       */
      _recordsMouseUp: function(){
         $(document).unbind('mousemove mouseup');
         this._useKeyboard = false;
      if(!this._dragStarted){
            return;
         }
         $ws.helpers.clearSelection();
      $(this._body.find('tr.ws-browser-draggable-row')).removeClass("ws-browser-draggable-row");
      var self = this;
      this._dragObject.fadeOut('fast', function(){
         self._dragObject.remove();
         });
      var newParent = this._dragTargetRow ? this._dragTargetRow.attr('rowkey') : undefined,
         record = newParent ? this._currentRecordSet.contains(newParent) &&
            this._currentRecordSet.getRecordByPrimaryKey(newParent) : undefined;
      if(this._notify('onDragStop', this._dragRecords, record, this._dragIsCorrect) !== false){
         if(record){
            if(this.isHierarchyMode() && record.get(this._hierColumnIsLeaf) !== true){
               newParent = record.get(this._hierColumnParentId);
               record = this._currentRecordSet.contains(newParent) ? this._currentRecordSet.getRecordByPrimaryKey(newParent) : undefined;
            }
            if(this._dragTargetRow && this._dragIsCorrect){
               this.move(newParent);
            }
         }
      }
      if(this._dragTargetRow){
         this._dragTargetRow.removeClass('ws-browser-want-drag');
         this._dragTargetRow = undefined;
      }
      this._dragStarted = false;
      this._container.removeClass('drag-over ws-no-select');
      },
      /**
       * Действия, которые необходимо выполнить перед отрисовкой
       */
      _afterDrawActions: function(){
         this._editTdClearTimer();
         this._editTdCancel();
         this._editAtPlaceValidationErrors = 0;
         this._editAtPlaceValidationMap = {};
         this._editAtPlaceRecord = null;
         if(this._options.display.reload && this._editAtPlaceChanges){
            this._editAtPlaceChanges = false;
            this.reload();
         }
      },
      /**
       * Вызывает перегрузку браузера c перезапросом данных. Возвращает деферред - готовность новых данные (и отрисовка браузера тоже)
       * @returns {$ws.proto.Deferred}
       */
      reload: function(){
         if(this._options.display.viewType === 'tree'){
            var filter = this.getQuery(true),
               expand = !this._options.display.partiallyLoad || this._options.display.expand || this._fullTreeExpand;
            filter['Разворот'] = expand ? 'С разворотом' : 'Без разворота';
            if(expand){
               filter[this._hierColumnParentId] = this._rootNode;
            }
            else{
               filter[this._hierColumnParentId] = [];
               this._loaded = {};
               for(var i in this._expanded){
                  if(this._expanded.hasOwnProperty(i)){
                     var isVisible = this._expanded[i] ? 1 : 2,
                        rowkey = i,
                        record = undefined;
                     while(!this._isIdEqual(rowkey, this._rootNode)){
                        if(!this._currentRecordSet.contains(rowkey)){
                           isVisible = 0;
                           break;
                        }
                        record = this._currentRecordSet.getRecordByPrimaryKey(rowkey);
                        rowkey = record.get(this._hierColumnParentId);
                        if(rowkey != this._rootNode && !this._expanded[rowkey]){
                           isVisible = 0;
                           break;
                        }
                     }
                     if(isVisible === 1){
                        filter[this._hierColumnParentId].push(i === 'null' ? null : i);
                        this._loaded[i] = true;
                     }
                     else if(isVisible === 0){
                        delete this._expanded[i];
                     }
                  }
               }
               if(!this._options.display.showRoot && !this._loaded[this._rootNode]){
                  this._loaded[this._rootNode] = true;
                  if(filter[this._hierColumnParentId].length === 0)
                     filter[this._hierColumnParentId] = this._rootNode;
                  else
                     filter[this._hierColumnParentId].push(this._rootNode);
               }
               else if(filter[this._hierColumnParentId].constructor === Array && filter[this._hierColumnParentId].length === 0){
                  this._expanded[this._rootNode] = true;
                  filter[this._hierColumnParentId] = this._rootNode;
               }
               if(this._options.display.viewType === 'tree' && this._options.display.expand){
                  this._expanded[this._rootNode] = 2;
                  filter['Разворот'] = 'С разворотом';
               }
               if(filter[this._hierColumnParentId] && filter[this._hierColumnParentId].length === 1) {
                  filter[this._hierColumnParentId] = filter[this._hierColumnParentId][0];
               }
            }
            if(this._options.display.viewType === 'tree' && this._options.display.expand){
               this._expanded[this._rootNode] = 2;
               filter['Разворот'] = 'С разворотом';
            }
            return this._runQuery(filter, true);
         }
         else {
            return $ws.proto.Browser.superclass.reload.apply(this, arguments);
         }
      },
      /**
       * Устанавливает колонки для браузера + перерисовывает его
       * @param {Array} columns Массив с параметрами колонок, аналогичен параметру из конфига
       *
       * <pre>
       *    [
       *       {
       *          'title': 'a',
       *          'field': 'b',
       *          'width': '100%',
       *          'fixedSize': false
       *       },
       *       ...
       *    ]
       * </pre>
       *
       * Если хотите, чтобы браузер нарисовал шапку из запроса, то необходимо обнулить их: .setColumns([]).
       * Шапка будет перисована при следующем получении данных.
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
            var oldResultFields = {},
                needReload = false,
                i, l, k;
            self._options.display.columns = columns;
            l = self._resultFields.length;
            for(i = 0; i < l; i++){
               oldResultFields[self._resultFields[i]] = true;
            }
            self._initResultFieldsList();
            k = self._resultFields.length;
            if(l !== 0 && k !== 0){
               if(l == k){
                  for(i = 0; i < k; i++){
                     if(!oldResultFields[self._resultFields[i]]){
                        needReload = true;
                        return;
                     }
                  }
               } else {
                  needReload = true;
               }
            }
            self._columnMap = [];
            self._drawHead();
            self._setHeight();//Высота шапки могла поменяться
            if(needReload){
               var newFilter = self.getQuery();
               newFilter["_Итоги"] = self._options.filterParams["_Итоги"];
               self.setQuery(newFilter);
            } else {
               self.refresh();
            }
         });
      },
      /**
       * Возвращает текущие колонки
       * @returns {Array}
       */
      getColumns: function(){
         return this._options.display.columns || (this._currentRecordSet && this._currentRecordSet.getColumns());
      },
      _setEnabled: function(enable){
         enable = !!enable;
         $ws.proto.Browser.superclass._setEnabled.apply(this, arguments);
         if(this._options.display.rowOptions){
            if(!enable){
               this._hideRowOptions();
               this._uninitRowOptions();
            }
            else{
               this._initRowOptions();
            }
         }
         this._editTdDestroyField();
      },
      /**
       * Возвращает высоту всего, кроме тела браузера
       */
      _getAdditionalHeight: function(){
         var footHeight = this._foot.height(),
               headHeight = this._headContainer.height(),
            resultsHeight = (this._resultBrowser ? this._resultBrowser.height() : 0);
      return footHeight + headHeight + resultsHeight;
      },
      /**
       * Устанавливает обработчик отрисовки строки
       * @param {Function} render Функция-обработчик. В качестве аргументов получит запись {$ws.proto.Record} и строку {jQuery}, которая ещё не прикреплена к дом-дереву (!)
       */
      setRowRender: function(render){
         this._options.display.rowRender = render;
      },
      /**
       * Нужно ли загружать информацию о том, есть ли у папки дочерние записи
       * @param {Boolean} load true - загружаем
       */
      setLoadChildFlag: function(load){
         this._useLoadChildsFlag = load;
         this._systemParams["_ЕстьДочерние"] = load;
      },
      /**
       * Событие, поджигаемое при загрзузке данных.
       * @param {Event} eventState
       * @param {$ws.proto.RecordSet} recordSet
       * @param {Boolean} isSuccess Успешность запроса. Если не успешен - значит произошел Abort Ajax запроса
       * @param {Error} [error] Ошибка в случае неуспешного запроса
       * @param {Object} [options] Опции запроса
       */
      _onDataLoaded: function(eventState, recordSet, isSuccess, error, options){
         this._isLoading = true;
         if(!options || !options.browserFolder){
            $ws.proto.Browser.superclass._onDataLoaded.apply(this, arguments);
         }
      },
      /**
       * Началась ли загрузка. Будет true в оnDataLoaded
       * @returns {boolean}
       */
      isLoading: function(){
         return this._isLoading;
      },
      /**
       * Уничтожаем меню, которые могли создать в процессе работы
       */
      destroy: function(){
         if(this._rowOptionsMenu instanceof Object){
            this._rowOptionsMenu.destroy();
         }
         if(!Object.isEmpty(this._ladder))
            this.unsubscribe('onKeyPressed', this._onKeyPressedOnBrowser);
         if(this._editAtPlaceFocusCallback){
            $('body').unbind('click.edit_' + this.getId(), this._editAtPlaceFocusCallback);
         }
         $ws.proto.Browser.superclass.destroy.apply(this, arguments);
      }
   });

   return $ws.proto.Browser;

});
