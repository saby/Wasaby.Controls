/**
 * Created with JetBrains PhpStorm.
 * User: tm.baeva
 * Date: 22.04.13
 * Time: 1:18
 * To change this template use File | Settings | File Templates.
 */
define("js!SBIS3.CORE.DataView", ["js!SBIS3.CORE.Control", "js!SBIS3.CORE.TDataSource", "css!SBIS3.CORE.DataViewAbstract", 'is!browser?Core/jquery-dblclick', 'css!SBIS3.CORE.DataView'], function( Control, TDataSource ) {

   "use strict";

   $ws.single.DependencyResolver.register('SBIS3.CORE.DataView', function(config){
      var deps = {};

      if(config) {
         if(config.display.showToolbar) {
            deps['js!SBIS3.CORE.ToolBar'] = 1;
            deps['js!SBIS3.CORE.Button'] = 1;
            deps['js!SBIS3.CORE.Menu'] = 1;
         }

         if(config.display.showPaging)
            deps['js!SBIS3.CORE.Paging'] = 1;

         if(config.display.showRecordsCount)
            deps['js!SBIS3.CORE.FieldDropdown'] = 1;

         if(config.rowOptions)
            deps['js!SBIS3.CORE.Menu'] = 1;

         if(config.display.viewType === 'hierarchy' && config.display.showPathSelector)
            deps['js!SBIS3.CORE.PathSelector'] = 1;
      }

      return Object.keys(deps);
   });

   $ws._const.Browser = {
      minHeight: 24, //минимальная высота грида
      iconWidth: 16,
      tabWidth: 16,
      defaultCellPadding: 7,
      newIconWidth: 32,
      iconPadding: 3,
      minColumnWidth: 8,
      defColWidth : {
         "Логическое" : "20px",
         "Число целое" : "40px",
         "Деньги" : "85px",
         "Дата" : "80px",
         "Дата и время" : "80px",
         "another" : "50px"
      },
      type2ClassMap : {
         "Деньги": "money",
         "Число целое": "integer",
         "Число вещественное": "integer"
      },
      hierarchyIcons: 'img/browser/tree_icons.gif',
      printFrameWidth: '100%',
      recordsMoveOffset: {'top': 5, 'left': 5},
      rowOptionsMenuOffset: {'left': 8, 'top': 27},
      rowOptionsElementsOffset: {'right': 0, 'top': $ws._const.theme == 'wi_scheme' ? 0 : -2}, //Бонусный отступ сверху у блока с кнопками - опциями строки.
      loadingIndicatorDelay: 1000,                                                               //Задержка появления индикатора загрузки
      loadingIndicatorForReadDelay: 3000,
      rowOptionsOverflow: 3,                                                                    //Количество опций, при превышении которого будет отображено меню в опциях строки
      rowOptionsButtonWidth: 34,                                                                //Ширина одной кнопки в опциях строки
      selectionCheckboxWidth: 32,
      rowOptionsActions: {
         'addItem': true,
         'addFolder': true,
         'edit': true,
         'delete': true,
         'printRecord': true,
         'copy': true,
         'history': true
      },
      editAtPlaceWait: 350,
      pageSizes: [
         10,
         20,
         25,
         50,
         100,
         200,
         500,
         1000
      ],
      treeLevelAttribute: 'treelevel',
      pathSelectorHeight: 21,
      rowOptionBeforeAll: -1
   };

   /**
    * @cfgOld {Object} display параметры отображения данных на экране
    * @cfgOld {String} display.viewType тип отображения данных: иерархия(hierarchy) или таблица, если параметр не указан
    * @cfgOld {String} display.titleColumn колонка, отвечающая за название в случае иерархии, по умолчанию name
    * @cfgOld {String} display.hierColumn колонка, отвечающая иерархию
    * @cfgOld {Boolean} display.showTiming true - рисовать строку состояния, false - не рисовать строку состояния
    * @cfgOld {Boolean} display.resizable true - включена возможность изменения ширин столбцов мышкой,
    *                                    false - такая возможность выключена
    * @cfgOld {Boolean} display.showRecordsCount true - показывать кол-во вивдимых строк,
    *                                           false - не показывать кол-во видимых строк
    * @cfgOld {Boolean} display.showPaging параметр, отвечающий за отображение навигации
    * @cfgOld {Boolean} display.partiallyLoad использовать загрузку полную/по частям(false/true). Только в случае дерева или иерархии.
    * @cfgOld {Boolean} display.reload Необходимость перезапрашивать данные при добавлении/редактировании записи перед перезагрузкой браузера.
    * @cfgOld {Function} display.displayValue функция, на входе {$ws.proto.Record} соответствующий текущей выбранной строке.
    *                   Используется, если нужно получить строковое предстваление строки данных

    * @cfgOld {Object} display.usePaging              используем пейджинг или нет
    *    - ''        нету его (по-умолчанию)
    *    - 'parts'   по результатам загрузки узнаёт, есть ли следующая страница, в hasNextPage boolean
    *    - 'full'    грузит информацию об общем количестве страниц, в hasNextPage number (общее число записей, вне одной конкретной страницы)
    *    - 'auto'    теоретический параметр
    * @cfgOld {Object} display.recordsPerPage параметр (если есть пейджинг) указывает сколько отображать строк на странице в браузере
    * @cfgOld {Number} display.rootNode               идентификатор корня, будут показываться только его child'ы
    * @cfgOld {Boolean} display.createInvisibleRows   будут ли создаваться невидимые строки
    * @cfgOld {Boolean} display.showToolbar           будет ли показан тулбар
    * @cfgOld {Boolean} display.readOnly              будет ли невозможно менять содержимое (удалять, добавлять, редактировать)
    * @cfgOld {Boolean} display.askConfirmSaving              будет ли запрошено подтверждение сохранения при изменении записи с помошщью редактирования по месту в случае ухода с редактируемой записи
    * @cfgOld {Boolean} display.showHistory           будет ли невозможно просмотреть историю изменений для записи
    * @cfgOld {Boolean} display.fixedExpand           Не даёт переключать режим отображения Ctrl+B / Ctrl+V
    * @cfgOld {String}  display.expand                Использовать ли разворот в начале
    * @cfgOld {String}  display.emptyHtml             Хтмл-код, который будет показываться при отсутствии данных
    *    - ''        нету
    *    - 'items'   аналог Ctrl+V, только листья
    *    - 'folders' аналог Ctrl+B, папки и листья
    * @cfgOld {Boolean} display.showPathSelector      показывать ли pathSelector (для иерархического браузера)
    * @cfgOld {Object} dataSource : параметры получения данных, передаются непосредственно в $ws.proto.RecordSet
    *    пример использования смотри в описании $ws.proto.RecordSet
    * @cfgOld {String} editDialogTemplate             имя шаблона диалога редактирования элемента или листа
    * @cfgOld {String} editBranchDialogTemplate       имя шаблона диалога редактирования узла (только для иерархии)
    * @cfgOld {String} filterDialogTemplate           имя шаблона диалога фильтрации браузера
    * @cfgOld {Object} reports                        список отчетов, который доступны данному браузеру для печати
    * @cfgOld {Object} filterParams                   параметры выборки, задают либо значение, либо маппинг на поле контекста
    * Например:
    * <pre>
    *    [
    *       {
    *          {"Параметр1": "Значение1"},
    *          {"Параметр2":
    *             {
    *                fieldName: "ИмяПоля"
    *             }
    *          }
    *       }
    *    ]
    * </pre>
    * @cfgOld {String} selectionType                  какие элементы можно будет выбрать в браузере (для иерархической выборки):
    * -'node'    только узлы,
    * -'leaf'    только листья,
    * -'all'     любые, по-умолчанию
    * @cfgOld {Boolean} showSelectionCheckbox         возможность выделения строк в браузере с помощью мыши (отобржение чекбокса)
    * @cfgOld {Boolean} allowHorizontalScroll         будет ли использована горизонтальная прокрутка при недостатке места
    * @cfgOld {Boolean} useSelection                  будет ли использоваться выделение элементов
    * @cfgOld {Boolean} multiSelect                   Возможен ли выбор нескольких значений
    * @cfgOld {Boolean} allowAdd                      флаг того, разрешено ли добавление записей
    * @cfgOld {Boolean} allowEdit                     флаг того, разрешено ли редактирование записей
    * @cfgOld {Boolean} allowDelete                   флаг того, разрешено ли удаление записей
    * @cfgOld {Boolean} allowMove                     флаг того, разрешено ли перемещение записей
    * @category Table
    */

   $ws.proto.DataView = Control.DataBoundControl.extend(/** @lends $ws.proto.DataView.prototype */{
      /**
       * @event onRowActivated Событие, происходящее при клике на строку или нажатии на ней Enter
       * @param {Object} eventObject описание в классе $ws.proto.Abstract
       * @param {jQuery} row Текущий выделенный элемент
       * @param {$ws.proto.Record} dataRow Текущая выделенная запись (Запись, соответствующая текущему выделенному элементу)
       */
      /**
       * @event onChange Событие onChange, происходящее при клике на строку или нажатии на ней Enter
       * @param {Object} eventObject описание в классе $ws.proto.Abstract
       *///TODO отпилить или сделать осмысленным. Отвалится поле связи!
      /**
       * @event onBeforeLoad Событие, происходящее перед тем, как начнется загрузка данных
       * @param {Object} eventObject описание в классе $ws.proto.Abstract
       */
      /**
       * @event onAfterLoad Возникает после окончания загрузки данных (можно искать строчки в браузере, позиционироваться на них, разворачивать, и т.п.)
       * @param {Object} eventObject описание в классе $ws.proto.Abstract
       */
      /**
       * @event onAfterRender Событие, происходящее после отрисовки браузера
       * @param {Object} eventObject описание в классе $ws.proto.Abstract
       */
      /**
       * @event onBeforeRead Событие, происходящее перед чтением записи с БЛ. Обрабатываются возвращаемые значения типов $ws.proto.Record и $ws.proto.Deferred
       * @param {Object} eventObject описание в классе $ws.proto.Abstract
       * @param {Number|String} key Ключ читаемой записи
       */
      /**
       * @event onBeforeInsert Событие, происходящее перед добавлением записи
       * @param {Object} eventObject описание в классе $ws.proto.Abstract
       * @param {$ws.proto.Record} record полученная запись от метода Создать
       */
      /**
       * @event onBeforeCreate Событие, происходящее перед созданием записи
       * @param {Object} eventObject описание в классе $ws.proto.Abstract
       * @param {String} parentId идентификатор папки в которой создаем
       * @param {Boolean} isBranch что создаем - папку или лист
       * @param {Object} filter фильтр, который будет отдан в Создать
       */
      /**
       * @event onBeforeUpdate Событие, происходящее перед редактированием записи. Обрабатывается возврат: false - отмена редактирования, строка - имя диалога, которым открыть запись, все прочее - действие по-умолчанию
       * @param {Object} eventObject описание в классе $ws.proto.Abstract
       * @param {$ws.proto.Record} record полученная запись от метода Прочитать
       * @param {String} fieldName имя редактируемого столбца, если запись редактировалась по месту
       */
      /**
       * @event onDeleteStart Событие, происходящее перед стартом всей процедуры удаления в целом. Обрабатывает возвращаемые значения:
       * - {String} задает собственное сообщение в диалоге подтверждения удаления
       * - {$ws.proto.Deferred} дожижается успешного завершения, продолжает дальше обычным путем
       * - {Boolean=false} отмена удаления
       * @param {Object} eventObject описание в классе $ws.proto.Abstract
       * @param {$ws.proto.Record[]} data массив записей, предполагаемых к удалению
       */
      /**
       * @event onBeforeDelete Событие, происходящее перед удалением записи. Из обработка можно вернуть false чтобы отменить удаление конкретной записи.
       * @param {Object} eventObject описание в классе $ws.proto.Abstract
       * @param {$ws.proto.Record} record удаляемая строка
       */
       /**
       * @event onRowDoubleClick Событие, происходящее при двойном клике на строке
       * @param {Object} eventObject описание в классе $ws.proto.Abstract
       * @param {jQuery} row Текущий выделенный элемент
       * @param {$ws.proto.Record} dataRow Текущая выделенная запись (Запись, соответствующая текущему выделенному элементу)
       * @param {String} tableHeadName Заголовок колонки, на которую кликнули
       * @param {String} rowColumnName Столбец записи, данные из которого отображает колонка, на которую кликнули
       */
       /**
       * @event onRowClick Событие, происходящее при одинарном клике на строке
       * @param {Object} eventObject описание в классе $ws.proto.Abstract
       * @param {jQuery} row Текущий выделенный элемент
       * @param {$ws.proto.Record} dataRow Текущая выделенная запись (Запись, соответствующая текущему выделенному элементу)
       * @param {String} tableHeadName Заголовок колонки, на которую кликнули
       * @param {String} rowColumnName Столбец записи, данные из которого отображает колонка, на которую кликнули
       */
       /**
       * @event onSetCursor Событие, происходящее при установке курсора на строку
       * Если строк нет, то событие тоже произойдет, но в качестве второго и третьего аргументов получит undefined
       * @param {Object} eventObject описание в классе $ws.proto.Abstract
       * @param {jQuery} row Текущий выделенный элемент
       * @param {$ws.proto.Record} dataRow Текущая выделенная запись (Запись, соответствующая текущему выделенному элементу)
       */
       /**
       * @event onFilterChange Событие, происходящее при смене фильтров браузера
       * @param {Object} eventObject описание в классе $ws.proto.Abstract
       * @param {Object} filter Новое значение фильтров
       */
       /**
       * @event onChangeSelection Событие, происходящее при смене выбранных строк
       * @param {Object} eventObject описание в классе $ws.proto.Abstract
       * @param {$ws.proto.Record | Array} record запись или массив записей, которую/ые выделили/сняли отметку
       * @param {Boolean} isMarked сняли выделение или поставили
       */
      /**
       * @event onSelectionConfirm Событие, происходящее при подтвержденнии выбора
       * @param {Object} eventObject описание в классе $ws.proto.Abstract
       * @param {Array} selectedRecords Массив выбранных записей
       */
      /**
       * @event onBeforeShowPrintReports Событие, происходящее перед выводом списка отчетов, возможных для печати
       * @param {Object} eventObject описание в классе $ws.proto.Abstract
       * @param {Array} reports отчеты, которые могут быть напечатаны
       * @param {$ws.proto.Record | $ws.proto.RecordSet} printData набор данных, отправляемых на печать
       */
      /**
       * @event onPrepareReportData Событие, происходящее при выборе отчета для печати
       * @param {Object} eventObject описание в классе $ws.proto.Abstract
       * @param {String} reportName название отчета, который выбран на печать
       * @param {$ws.proto.Record | $ws.proto.RecordSet} printData набор данных, отправляемых на печать
       */
      /**
       * @event onSelectReportTransform Событие, происходящее перед сериализацией набора данных
       * @param {Object} eventObject описание в классе $ws.proto.Abstract
       * @param {String} reportName название отчета, который выбран на печать
       * @param {$ws.proto.Record | $ws.proto.RecordSet} printData набор данных, отправляемых на печать
       * @param {String} xsltFile путь к xslt-файлу преобразования данных
       */
      /**
       * @event onRecordsChanged Событие, происходящее при изменении данных в рекордсете перед перерисовкой браузера
       * @param {Object} eventObject описание в классе $ws.proto.Abstract
       */
      /**
       * @event onReady Момент готовности рекордсета
       */
      /**
       * @event onBeforeOpenEditWindow Событие, происходящее при редактировании в новой же вкладке до изменения url
       * @param {String} pageURL сгенерированный адрес страницы
       */
      /**
       * @event onLoadError Происходит при ошибке, которая была получена при выполнении списочного метода.
       * Если вернуть true, будет считаться, что ошибка обработана, и браузер ничего делать не будет. Однако, если код ошибки - 403, вернуть true и не поставить флаг processed у ошибки, то ошибку обработает транспорт и покажет alert. Если не возвращать true, то дальше будет проверка на тип ошибки. Если её код - 403, то будет показан блок с текстом "Недостаточно прав для просмотра информации". Иначе - alert с описанием ошибки.
       * @param {Object} eventObject Стандартное событие
       * @oaram {HTTPError} error Произошедшая ошибка
       */
      $protected: {
         _options: {
            preprocessQuery : false,
            multiSelect: true,
            useCopyRecords: false,
            useSelection: true,
            useMergeRecords: false,
            allowAdd: true,
            allowEdit: true,
            allowDelete: true,
            allowMove: true,
            dataSource: TDataSource,
            printMode: '',
            editMode: 'newDialog',
            editBranchMode: 'newDialog',
            editDialogTemplate: '',
            editBranchDialogTemplate: '',
            filterDialogTemplate: '',
            filterParams: {},
            reports: {},
            reportsForList: {},
            selectionType: 'all',
            setCursorOnLoad: true,
            useCurrentFilterOnMove: false,
            useHoverRowAsActive: false,
            markedRowOptions: {},
            display: {
               viewType : '',
               viewMode : '',
               readOnly: false,                 //Невозможность редактирования, удаления записей
               showHistory: false,
               hierColumn: 'Раздел',
               titleColumn: 'Название',
               showToolbar: false,              //Будет ли показан тулбар
               showTiming: false,               //Показывать или нет строчку таймингов
               showRecordsCount: true,          // Показывать или нет счетчик записей
               showPaging: true,                // Показывать или нет навигацию между страницами
               usePaging: '',
               askConfirmSaving: false,         //запрашивать подтверждение сохранения при редактировании по месту
               recordsPerPage: 25,
               displayValue: '',                //TODO  ПЕРЕИМЕНОВАТЬ
               /**
                * @translatable
                */
               emptyHtml: '',                   //Хтмл-код, который будет показываться в браузере при отсутствии данных в запросе
               /**
                * @translatable
                */
               emptyTableHtml: '',              //Хтмл-код, который будет показываться в браузере при отсутствии данных в таблице
               ///Это никак не Display дальше
               partiallyLoad: false,
               reload: true,                    //нужно ли перезапрашивать данные когда обновишь удалишь и т.д.
               rootNode: null,                  //Идентификатор корня
               createInvisibleRows: false,      //Создавать ли непоказываемые строки
               hierarchyIcons: $ws._const.Browser.hierarchyIcons, //Иконки с плюсами, минусами, папками, и т д
               fixedExpand: false,              //Запрещает применять Ctrl+B/Ctrl+V
               expand: '',                      //Начальное состояние разворота
               showPathSelector: true,          //Показывать ли pathSelector (для иерархического браузера)
               showSelectionCheckbox : false,   //Выделение строк с помощью мыши
               allowHorizontalScroll: true,     //Показывать ли горизонтальную прокрутку при нехватке места
               editAtThePlaceOnly: false,       //Записи редактируются только по месту, диалог/страница редактирования не поднимается по F3
               showRecordCountForEmptyData: true,//Возможность отключать показ нулевого итога у браузера
               usePageSizeSelect: true          //Давать ли пользователю возможность выбора количества записей на странице
            }
         },
         // поля иерархии: ссылка на родителя и признак узла
          _hierColumnParentId: 'Раздел',
          _hierColumnIsLeaf: 'Раздел@',
          _hierColumnHasChild: 'Раздел$',
         //Селекторы контейнеров
         _rootElement : '',
         _headContainer: undefined,       //Контейнер, в котором находится table шапки браузера
         _head : '',
         _body : '',
         _foot : '',
         _data : '',
         _resizer: undefined,
         _browserContainer: undefined,    //Контейнер, в котором находится таблица с данными
         _expanded: {},                   //Флаги с открытыми ветками дерева
         _activeElement: false,
         //Параметры, задаваемые в конструкторе
         _bodyHeight : 0,
         _bodyRealHeight: 0,
         _wsBrowserContainer: false,
         _currentRecordSet : null,
         //Изменяемые параметры, обычно в ходе перезагрузки
         _initialSource: {},              //Исходный конфиг рекордсета
         _initialFilter: {},              //Исходный фильтр
         _currentFilter: {},              //Текущий фильтр
         _count: 0,                       //TODO тоже вроде не нужно
         _turn : "",                      //тип разворота
         _resizingColumn: null,           //переменная для хранения ресайзуемой в данный момент колонки
         _hovered: 0,                     //переменная для сохранения строки на которою наведен курсор при перезагрузке
         _loaded: {},                     //Флаги загруженности веток дерева
         _currentRootId: null,            //Текущий отображаемый узел
         _sortingStack: [],               //Массив с информацией о сортировке - по убыванию важности сортировки
         _sortingMarkers: {},             //Мап вида поле => jQuery объект, у которого меняются классы при смене сортировки
         _paging: undefined,              //Контрол paging\
         _toolbar : undefined,            //Контрол тулбара
         _toolbarReady:undefined,         //Деферред готовности тулбара
         _pagingReady: undefined,         //Деферред готовности пейджинга
         _pagingFilter: {},               //Последний фильтр, по которому строилась постраничная навигация
         _wayRS: undefined,               //RecordSet, который получает путь до узла для showBranch
         _wayRSDeferred: undefined,       //Deferred, ответственный за первую загрузку _wayRS
         _rootNode: null,                 //Текущий корневой узел
         _pathSelector: undefined,        //Контрол PathSelector, используется для иерархии
         _selected: {},                   //Хранилище отмеченных строк
         _selectedRecords: [],            //Массив отмеченных записей
         _selectMode : false,             //Режим выбора. В режиме выбора Enter работает по другому. Есть ctrl + Enter
         _dReady: undefined,              //Deferred с колбеком после готовности рекордсета
         _verticalScrollShowed: false,    //Показывается ли вертикальный скролл в данный момент
         _printMenu: null,                //Список отчетов для печати
         _printMenuIsShow: false,         //Выведено ли меню печати
         _pathReady: undefined,           //Деферред готовности path selector'а
         _useEditAtThePlace: false,       //используется ли редактирование по месту
         _titleColumnIndex: -1,           //Индекс параметров конфигурации колонки заголовка папки
         _isInsertOnFolderInTree: false,  //Признак того, что нажали Insert/Ctrl+Insert на папке
         _reportPrinter: null,            //класс печати
         _isUpdatingRecords: false,       //Обновляются ли в данный момент записи массово: при этом не нужно обрабатывать кажду запись в отдельности
         _needResize: true,               //Требуется ресайз при первой возможности
         _actions: {},                    //Набор флагов, можно ли делать какие-либо действия: редактировать, добавлять и т. д.
         _emptyDataBlock: undefined,      //Блок, содержащий в себе глубокомысленный набор слов, отобращающийся при отсутствии данных
         _emptyDataTextSet: true,         //Установлен ли корректный текст
         _emptyDataText: null,            //Текущий текст в блоке пустых данных
         _needPrint: true,
         _isFakeDelete: false,            //Признак действительно ли удалили запись, т.к. возможен слуйчай чистки х
         _loadingIndicator: undefined,    //Таймер задержки показа индикатора загрузки
         _footerDrawed: false,            //Создали ли мы все элементы в футере
         _applyingState: false,           //Устанавливаем ли мы сейчас какое-то состояние
         _savedPageNum: 0,                //Сохраненный номер страницы при сохранении состояния
         _firstLoadDeferred: undefined,   //Деферред первой загрузки браузера, необходимо для восстановления состояния
         _systemParams: {
            "ВидДерева": "",
            "HierarchyField": "",
            "Разворот": "",
            "ПутьКУзлу": "",
            "ЗаголовокИерархии": "",
            "_ЕстьДочерние": false
         },
         //КЛАВИШИ обрабатываемые данным классом
         _keysWeHandle: [
            $ws._const.key.enter,
            $ws._const.key.backspace,
            $ws._const.key.down,
            $ws._const.key.up,
            $ws._const.key.left,
            $ws._const.key.right,
            $ws._const.key.del,
            $ws._const.key.insert,
            $ws._const.key.f3,
            $ws._const.key.f4,
            $ws._const.key.f5,
            $ws._const.key.pageUp,
            $ws._const.key.pageDown,
            $ws._const.key.b,
            $ws._const.key.h,
            $ws._const.key.v,
            $ws._const.key.esc,
            $ws._const.key.space,
            $ws._const.key.minus,
            $ws._const.key.q,
            $ws._const.key.p,
            $ws._const.key.n,
            $ws._const.key.m,
            $ws._const.key.o
         ],
         _dataBindHandler: null,
         _setDataHandler: null,           //Обработчик готовности контрола, который установит рекордсет
         _clickEventsQueue: [],
         _rowSelectionSetted: false,      //Флаг того, что текущая строка уже установлена
         _methodName: "static",           //имя метода, по которому строится представление данных (необходимо для сбора статистики)
         _minimized: false,               //признак того, что невыделенные записи свернуты
         _initialRecordSet: false,        //начальный рекордсет (необходим для реализации Ctrl+Space)
         _isRenderedFootRowOptions: false,//признак того, что опции над выделенными записями отрисованы в футере
         _pageOptions: [],                //опции для выбора размера страницы в постраничной навигации
         _pageOptionsContainer: undefined,//блок, содержащий в себе селект и информационный текст
         _pageOptionsDropdown: false,     //деферред готовности выпадающего списка с вариантами количества записей на странице
         _useKeyboard: false,
         _scrollWidth: undefined,
         _containerHeightForRecalk: null,
         _inBeforeRenderActionCnt: 0
      },
      $constructor : function(){
         var self = this;

         this._scrollWidth = $ws.helpers.getScrollWidth();
         this._toolbarReady = new $ws.proto.Deferred();
         this._pagingReady = new $ws.proto.Deferred();
         this._dReady = new $ws.proto.Deferred();
         this._pathReady = new $ws.proto.Deferred();
         this._firstLoadDeferred = new $ws.proto.Deferred();
         this._configChecking();
         this._publish('onBeforeCreate', 'onBeforeInsert', 'onBeforeUpdate', 'onDeleteStart', 'onBeforeDelete', 'onBeforeLoad', 'onAfterLoad', 'onAfterRender', 'onRowActivated', 'onFilterChange', 'onRowClick', 'onRowDoubleClick', 'onSetCursor', 'onChangeSelection', 'onSelectionConfirm', 'onLoadError', 'onPrepareReportData', 'onSelectReportTransform', 'onBeforeShowPrintReports', 'onBeforeCopy', 'onBeforeRead', 'onRecordsChanged', 'onBeforeOpenEditWindow');

         $ws.single.CommandDispatcher.declareCommand(this, 'newItem', this._insertRecordItem);
         $ws.single.CommandDispatcher.declareCommand(this, 'newFolder', this._insertRecordFolder);
         $ws.single.CommandDispatcher.declareCommand(this, 'newChildItem', this._insertChildRecordItem);
         $ws.single.CommandDispatcher.declareCommand(this, 'newChildFolder', this._insertChildRecordFolder);
         $ws.single.CommandDispatcher.declareCommand(this, 'edit', this._editRecord);
         $ws.single.CommandDispatcher.declareCommand(this, 'copy', this.copy);
         $ws.single.CommandDispatcher.declareCommand(this, 'delete', this._deleteRecords);
         $ws.single.CommandDispatcher.declareCommand(this, 'confirmSelection', this.confirmSelection);
         $ws.single.CommandDispatcher.declareCommand(this, 'selectAll', this.selectAll);
         $ws.single.CommandDispatcher.declareCommand(this, 'removeSelection', this.removeSelection);
         $ws.single.CommandDispatcher.declareCommand(this, 'reload', this.reload);
         $ws.single.CommandDispatcher.declareCommand(this, 'showSelection', this.showSelection);

         this._createContainer();
         this._setHeight();
         this._initActionsFlags();
         this._context = new $ws.proto.Context().setPrevious(this._context);

         if (this._options.saveState)
            $ws.single.ControlStorage.waitChildByName(this.getName())
               .addCallback(function(){
                  //обеспечиваем поднятие события строго после подписки на него NavigationController'ом
                  self._notify("onStateChanged");
               })
               .addCallback(function(){
                  //готовим data source с подмененными фильтрами
                  self._initDataSource();
               });
         else
            self._initDataSource();

         this._drawToolBar();
         this._initEvents();
         this._dataBindHandler = $.proxy(this._dataBind, this);

         if(this._parent)
            this._parent.subscribe('onReady', this._dataBindHandler);
         else
            this._dataBind();

         if(this._options.markedRowOptions)
            this.subscribe('onChangeSelection', this._onChangeSelectionHandler);
      },

      markControl : function(s){
         var result = $ws.proto.DataView.superclass.markControl.apply(this, arguments);
         this._onResizeHandler();
         return result;
      },

      clearMark : function(){
         var result = $ws.proto.DataView.superclass.clearMark.apply(this, arguments);
         this._onResizeHandler();
         return result;
      },

      _haveAutoWidth: function() {
         return this._options.autoWidth && this._horizontalAlignment !== 'Stretch';
      },

      _isHeightGrowable: function() {
         return this._options.autoHeight && this._verticalAlignment !== 'Stretch';
      },

      _isInBeforeRenderAction: function() {
         return this._inBeforeRenderActionCnt > 0;
      },

      _onChangeSelectionHandler: function(){
         var hasSelection = this.getSelection(true).length;
         if(this._isRenderedFootRowOptions){
            if(!hasSelection)
               this._drawRowOptionsButtons();
         } else if(hasSelection)
            this._drawRowOptionsButtons(true);
      },
      /**
       * @return {Boolean}
       */
      isReadOnly : function(){
         return this._options.display.readOnly;
      },
      /**
       * Возвращаем тот элемент, на который можно поскроллиться
       * @return {jQuery|Boolean}
       */
      _getElementToFocus: function() {
         var activeElement = this.getActiveElement();
         if(activeElement){
            return activeElement;
         }
         var firstRow = this._browserContainer.find('tr').eq(0);
         if(firstRow.length){
            return firstRow;
         }
         return this.getContainer();
      },
      /**
       * Переопределенный метод Show
       */
      show: function(){
         this._runInBatchUpdate('Browser.show', function() {
            this._setVisibility(true);
            this._heightChangedIfVisible();
         });
      },

      /**
       * Этот метод вызывает пересчёт браузера (и его родителей, если он авторазмерный) при ручном изменении содержимого какой-нибудь его ячейки или строки
       */
      recalcBrowserOnDOMChange: function() {
         this._notifyOnSizeChangedWithVisible(false);
      },

      _isVisibleWithParents: function() {
         return this._container && this._container.closest('.ws-hidden').length === 0;
      },

      _onSizeChangedBatch: function() {
         this._contentHeightChanged();
         return true;
      },

      _notifyOnSizeChangedWithVisible: function(isVisible) {
         if (isVisible === undefined)
            isVisible = this._isVisibleWithParents();

         this._notifyOnSizeChanged(this, this, !isVisible);
      },

      //Перед расчётом авторазмеров надо запоминать высоту браузера (может понадобиться в setHeight для запуска повторного пересчёта авторазмеров)
      _notifyOnSizeChanged: function() {
         this._setContainerHeightForRecalk();
         return $ws.proto.DataView.superclass._notifyOnSizeChanged.apply(this, arguments);
      },

      //Запоминаем высоту браузера (может понадобиться в setHeight для запуска повторного пересчёта авторазмеров)
      _setContainerHeightForRecalk: function() {
         if (this._isHeightGrowable() && this._horizontalAlignment === 'Stretch') {
            //Здесь можно брать высоту самым быстрым способом, потому что нужна будет не сама высота, а разница с предыдущей
            this._containerHeightForRecalk = this._container.get(0).offsetHeight;
         }
      },

      //Если в результате внешнего изменения размеров контейнера (например, при ресайзе окна)
      //меняется ширина браузера (это верно только для браузера с растягом по горизонтали),
      //то может поменяться и высота (из-за переносов в строчках).
      //Этот момент надо отследить, и запустить пересчёт авторазмеров, чтоб браузер не обрезался.
      _checkContainerHeightForRecalk: function() {
         if (this._isHeightGrowable() && this._horizontalAlignment === 'Stretch') {
            var oldHeight = this._containerHeightForRecalk;
            this._setContainerHeightForRecalk();

            if(this._containerHeightForRecalk !== oldHeight) {
               this._notifyOnSizeChanged(this, this);
            }
         }
      },

      /**
       * включает/выключает возможность выбора нескольких записей
       * @param {Boolean} multiSelect
       */
      setMultiSelect: function(multiSelect){
         this._options.multiSelect = !!multiSelect;
         this._options.display.showSelectionCheckbox = !!multiSelect;
         if (!multiSelect) {
            this.removeSelection();
         }
         // скинем информацию о колонках, чтобы полностью перерисовать таблицу
         this._columnMap = [];
         this.refresh();
      },
      /**
       * Создает основную структуру html браузера
       */
      _createContainer:function(){
         if(this._options.display.width > 0){
            this._container.find('.ws-browser-container').width(this._options.display.width + 'px');
            this._rootElement.width(this._options.display.width + 'px');
         }
         // Pevent click from bubbling up to parent window container
         this._container.click(function(event){
            event.stopImmediatePropagation();
         });
         this._resizer = this._container.find('.ws-browser-resizer');
         if (this._resizer.size() === 0)
            this._resizer = null;

         this._head = this._rootElement.find('thead');
         this._foot = this._rootElement.find('tfoot');
         this._headContainer = this._rootElement.find('.ws-browser-head-container');
         this._data = this._rootElement.find('.ws-browser');
         this._browserContainer = this._rootElement.find('.ws-browser-container');
         this._browserContainerWrapper = this._rootElement.find('.ws-browser-container-wrapper');

         this._emptyDataBlock = $('<div class="ws-browser-empty ws-hidden">' + this._options.display.emptyHtml + '</div>').
                                insertBefore(this._browserContainer);

         if(!this._options.display.allowHorizontalScroll){
            this._data.parent().css('overflow-x', 'hidden');
         }
         if (this._options.autoHeight) {
            this._container.height('auto');
            this._data.parent().height('auto');
         }
      },
      /**
       * Создает меню для выбора из списка отчетов, возможных для печати
       * @return {$ws.proto.Deferred}
       */
      _createPrintMenu:function(reportsList, isReportsForList){
         var self = this,
             reports = [],
             declaredReportsList;
         if(!reportsList || !(reportsList instanceof Array)){
            reportsList = [];
            declaredReportsList = isReportsForList ? this._options.reportsForList : this._options.reports;
            for(var i in declaredReportsList){
               if(declaredReportsList.hasOwnProperty(i)){
                  reportsList.push(i);
               }
            }
         }
         for(var k = 0, l = reportsList.length; k < l; k++){
            reports[k] = {
               caption: reportsList[k],
               id: reportsList[k],
               handlers: {
                  onActivated: function(id, elem){
                     self.printReport(elem.caption, isReportsForList);
                  }
               }
            };
         }
         if(self._printMenu !== null){
            self._printMenu.destroy();
            self._printMenu = null;
         }
         if(reports.length > 1){
            return $ws.core.attachInstance('Control/Menu', {
               data: reports
            }).addCallback(function(instance){
               self._printMenu = instance;
               return instance;
            });
         } else {
            return new $ws.proto.Deferred().callback();
         }
      },
      /**
       * Возвращает массив названий отчетов, доступных для печати
       * @return {Array} Массив названий отчетов
       */
      getReports: function(isReportsForList){
         var reports = [], declaredReportsList;
         declaredReportsList = isReportsForList ? this._options.reportsForList : this._options.reports;
         for(var i in declaredReportsList){
            if(declaredReportsList.hasOwnProperty(i)){
               reports.push(i);
            }
         }
         return reports;
      },
      /**
       * Собирает параметры получения данных для передачи в $ws.proto.RecordSet
       * @return {Object} Объект с данными
       */
      _getDataSource: function(){
         var dataSource = this._options.dataSource;
         dataSource.filterParams = this.getQuery();
         dataSource.filterParams.pageNum = "";
         dataSource.filterParams.usePages = "";
         dataSource.usePages = "";
         dataSource.firstRequest = true;
         if(!Object.isEmpty(this._expanded)){
            var parents = [];
            for(var i in this._expanded){
               if(this._expanded.hasOwnProperty(i))
                  parents.push(i);
            }
            if(!this._expanded[this._rootNode])
               parents.push(this._rootNode);
            dataSource.filterParams[this._hierColumnParentId] = parents;
         }
         return dataSource;
      },
      /**
       * Отображает окно с выбором страницы для печати реестра
       * @return {$ws.proto.Deferred} Асинхронный результат получения данных
       */
      _selectPrintPages: function(){
         var defResult = new $ws.proto.Deferred(),
             self = this,
             dataSource;
         dataSource = this._getDataSource();
         $ws.core.attachInstance('SBIS3.CORE.Dialog', {
            template: 'selectPrintPages',
            handlers: {
               onBeforeClose: function(event, apply){
                  if(apply === true){
                     if(this.getChildControlByName('printPages').getStringValue() === "cur"){
                        dataSource.filterParams.pageNum = self.getRecordSet().getPageNumber();
                        dataSource.pageNum = dataSource.filterParams.pageNum;
                        dataSource.filterParams.usePages = "full";
                        dataSource.usePages = "full";
                     }
                     defResult.callback(dataSource);
                  } else
                     defResult.errback(new Error("cancelled"));
               }
            }
         }).addBoth(function(result){
               $ws.core.setCursor(true);
               return result;
            });
         return defResult;
      },
      _getData: function(dataSource, def){
         return $ws.core.attachInstance('Source:RecordSet', $ws.core.merge({ firstRequest : true }, dataSource)).addCallback(function(rs){
            rs.subscribe('onAfterLoad', function(){
               def.callback(rs);
            });
         }).addErrback(function(error){
               $ws.core.setCursor(true);
               $ws.core.alert(error.message, "error");
            });
      },
      _collectDataSource: function(){
         var dtSource = this._options.dataSource;
         dtSource.filterParams = this.getQuery();
         dtSource.filterParams.pageNum = "";
         dtSource.filterParams.usePages = "";
         dtSource.usePages = "";
         dtSource.firstRequest = true;
         return dtSource;
      },
      /**
       * Запрашивает данные, необходимые для построения печати реестра записей
       * @return {$ws.proto.Deferred} Асинхронный результат получения данных для отчета реестра записей
       */
      _prepareReportDataForList: function(){
         var dResult = new $ws.proto.Deferred(),
             self = this;
   //         dataSource.filterParams.pageCount = "";
   //         dataSource.rowsPerPage = "";
         if(this._paging && this._turn === ""){
            self._selectPrintPages().addCallback(function(dataSource){
               self._getData(dataSource, dResult);
               $ws.core.setCursor(false);
               return dataSource;
            }).addErrback(function(error){
               $ws.core.setCursor(true);
            });
         }else {
            self._getData(self._collectDataSource(), dResult);
         }
         return dResult;
      },
      /**
       * Отправляет на печать выбранные записи
       * @param {String} idReport название печатаемого отчета
       * @param {Boolean} isReportsForList признак того, что печатаем отчет для реестра
       */
      printReport:function(idReport, isReportsForList, data){
         var object = data ? data : this.getSelection(),
             transform = "",
             self = this,
             eventResult;
         $ws.core.setCursor(false);
         if(idReport === undefined){
            transform = "default-list-transform.xsl";
         } else {
            transform = isReportsForList ? this._options.reportsForList[idReport] : this._options.reports[idReport];
         }
         if(self._options.printMode === "newWindow"){
            self._openPrintWindow(idReport, isReportsForList, transform, self.isHierarchyMode() ? self._currentRootId : undefined);
         }else {
            eventResult = isReportsForList ? this._prepareReportDataForList() : this._notify('onPrepareReportData', idReport, object);
            if(eventResult !== false){
               if(eventResult instanceof $ws.proto.Deferred){
                  eventResult.addCallback(function(result){
                     if(result instanceof $ws.proto.Record || result instanceof $ws.proto.RecordSet || result instanceof Array)
                        self._showReport(idReport, result, transform, isReportsForList);
                  }).addErrback(function(error){
                        $ws.core.setCursor(true);
                        $ws.core.alert(error.message, "error");
                     });
               } else {
                  if(eventResult instanceof $ws.proto.Record || eventResult instanceof $ws.proto.RecordSet || eventResult instanceof Array)
                     object = eventResult;
                  this._showReport(idReport, object, transform, isReportsForList);
               }
            } else {
               $ws.core.setCursor(true);
            }
         }
         if(self._printMenu !== null && self._printMenuIsShow){
            self._printMenu.show();
            self._printMenuIsShow = false;
         }
      },
      /**
       * Сериализует данные, применяет xslt-транформацию и выводит полученный результат
       * @param {String} idReport название печатаемого отчета
       * @param {$ws.proto.Record | $ws.proto.RecordSet} object данные для печати
       * @param {String} transform файл xslt-трансформации
       */
      _showReport:function(idReport, object, transform, isReportsForList){
         var eventResult = "",
             self = this;
         if(idReport === undefined){
            transform = $ws._const.wsRoot + "res/xsl/" + transform;
         } else {
            eventResult = this._notify('onSelectReportTransform', idReport, object, transform, isReportsForList);
            if(typeof(eventResult) === 'string')
               transform = eventResult;
            transform = $ws._const.resourceRoot + transform;
         }
         this._useKeyboard = true;
         self._reportPrinter.prepareReport(object, transform, self.isHierarchyMode() ? self._currentRootId : undefined).addCallback(function(reportText){
            $ws.core.attachInstance('SBIS3.CORE.Dialog', {
               template: 'printDialog',
               resizable: true,
               handlers: {
                  'onAfterLoad': function(){
                     var htmlView = this.getChildControlByName('ws-dataview-print-report');
                     htmlView.subscribe('onContentSet', function(){
                        $ws.core.setCursor(true);
                        self.removeSelection();
                     });
                     htmlView.setHTML(reportText);
                  },
                  onAfterClose: $.proxy(self._mouseMonitor, self)
               }
            });
         }).addErrback(function(error){
            $ws.core.setCursor(true);
            $ws.core.alert(error.message, "error");
         });
      },
      /**
       * Обновляет служебные поля, необходимые для получения иерархических значений.
       * @param {String} hierColumn Новое значение поля иерархии
       * @private
       */
      _updateHierColumnParams: function(hierColumn){
         this._hierColumnParentId = hierColumn;
         this._hierColumnIsLeaf = hierColumn + "@";
         this._hierColumnHasChild = hierColumn + "$";
      },
      /**
       * Метод проверяет конфиг и проставляет нужные переменные
       */
      _configChecking: function(){
         if(!this.isHierarchyMode()){ //В режиме работы простого списка загрузка по частям неактуальна, покрайней мере сейчас
            this._options.display.partiallyLoad = false;
            for(var i in this._systemParams){// также не должны уходить системные параметры кроме итогов
               if(i !== "_Итоги")
                  delete this._systemParams[i];
            }
         }

         if(this._options.display.useDrawingLines){ //При включенной отрисовки рамок выключаем отрисовку сепараторов
            this._options.display.useSeparating = false;
            this._options.display.hasZebra = false;
         }

         //При включенном пейджинге всегда включаем загрузку по частям
         //При отключенном отображение навиигации отключаем
         if(this._options.display.usePaging){
            this._options.display.partiallyLoad = true;
            if (!this._container.hasClass('ws-browser-ignore-local-page-size')) {
               this._options.display.recordsPerPage = $ws.helpers.getLocalStorageValue('ws-page-size') || this._options.display.recordsPerPage;
            }
         } else {
            this._options.display.showPaging = false;
         }

         if(this._options.multiSelect === false) // не показываем чекбоксы выбора при выключенном режиме многострочного выбора
            this._options.display.showSelectionCheckbox = false;

         if(this._options.display.rootNode !== null && typeof(this._options.display.rootNode) === 'object' ){
            var context = this.getLinkedContext(),
                rootNodeField = this._options.display.rootNode.fieldName;
            if(context.getValue !== undefined && context.getValue(rootNodeField) !== undefined)
                  this._rootNode = context.getValue(rootNodeField);
         } else
            this._rootNode = this._options.display.rootNode;

         if(this.isHierarchyMode()){// Если мы работаем с иерархическими структурами
            this._updateHierColumnParams(this._options.display.hierColumn);

            this._systemParams["ВидДерева"] = "С узлами и листьями";

            if(this._options.selectionType === "node" || this._options.display.viewMode == 'foldersTree'){
               this._options.filterParams["ВидДерева"] = "Только узлы";
               this._systemParams["ВидДерева"] = "Только узлы";
            }
            if(this._options.filterParams["HierarchyField"])
               this._systemParams["HierarchyField"] = this._options.filterParams["HierarchyField"];
            else
               this._systemParams["HierarchyField"] = this._hierColumnParentId;
            this._systemParams[this._hierColumnParentId] = this._rootNode;
            this._systemParams["Разворот"] = this._options.display.partiallyLoad ? "Без разворота" : "С разворотом";
            this._systemParams["ЗаголовокИерархии"] = this._options.display.titleColumn;
            if(this._options.display.viewType === "hierarchy"){
               this._systemParams["ПутьКУзлу"] = true;
            }
         }
         else{
            this._options.display.expand = '';
         }
         this._initialFilter = this._options.filterParams ? this._prepareFilter(this._options.filterParams) : {};
         this._currentFilter = $ws.core.merge({}, this._initialFilter);
         //имя метода, по которому строится браузер (необходимо для сбора статистики)
         var r = this._options.dataSource ? this._options.dataSource.readerParams || {} : {};
         if(!r.adapterType)
            r.adapterType = 'TransportAdapterRPCJSON';
         if (!$.isEmptyObject(r))
            this._methodName = [
               r.linkedObject,
               r.queryName
            ].join(".");
      },
      _initActionsFlags: function(){
         var vtHier = this.isHierarchyMode() || this._turn !== '',
            isEditBranch = this._options.editBranchDialogTemplate,
            isEdit = this._options.editDialogTemplate,
            isHistory = this._options.display.showHistory,
            isCopy = this._options.useCopyRecords,
            self = this,
            getParentForRow = function(row){
                var parentId;
                if(row instanceof Object && 'jquery' in row){
                   if(self.isHierarchyMode())
                     parentId = row.attr('parentid');
                }
                else if(self._options.display.viewType == "tree"){
                   parentId = self.getActiveElement() && self.getActiveElement().attr("parentid");
                }
                if(!parentId){
                   parentId = self._currentRootId;
                }
                return parentId;
            };
         this._actions = {'addItem': this._options.allowAdd !== false && !this._options.display.readOnly && isEdit && function(row, addChild) {
                                  var newRecordParent = addChild === true && row && row.hasClass("ws-browser-folder") ? row.attr("rowkey") : getParentForRow(row);
                                  self._showRecordDialog(undefined, false, newRecordParent, false);
                               },
                               'addFolder': this._options.allowAdd !== false && !this._options.display.readOnly && vtHier && isEditBranch && function(row, addChild) {
                                  var newRecordParent = addChild === true && row && row.hasClass("ws-browser-folder") ? row.attr("rowkey") : getParentForRow(row);
                                  self._showRecordDialog(undefined, true, newRecordParent, false);
                               },
                               'edit': this._options.allowEdit !== false && (isEdit || (vtHier && isEditBranch)) && function(row) {
                                  var activeElement = row instanceof Object && 'jquery' in row ? row : self.getActiveElement();
                                  if(activeElement && activeElement.attr('rowkey') !== 'null')
                                     self._elementActivated(activeElement, true);
                               },
                               'copy': !this._options.display.readOnly && (isEdit || (vtHier && isEditBranch)) &&
                                     isCopy && function(row){
                                  var parent = getParentForRow(row);
                                  if(parent !== undefined && self._currentRecordSet.contains(parent)){
                                     self.copy(self._currentRecordSet.getRecordByPrimaryKey(parent));
                                  }
                                  else{
                                     self.copy();
                                  }
                               },
                               'delete': !this._options.display.readOnly && this._options.allowDelete !== false && function(row){
                                  var correctRow = row instanceof Object && 'jquery' in row;
                                  if(correctRow && ( !self._activeElement || self._activeElement.attr("rowkey") !== row.attr("rowkey") ))
                                    self.setActiveRow(row);
                                  self._deleteRecords.apply(self, [correctRow, correctRow ? row.attr("rowkey") : undefined]);
                               },
                               'expand': this.isHierarchyMode() && !this._options.display.fixedExpand &&
                                     this._options.selectionType !== "node" && function(){
                                  self.applyTurn(false);
                               },
                               'expandWithFolders': this.isHierarchyMode() && !this._options.display.fixedExpand &&
                                     this._options.selectionType !== "node" && function(){
                                  self.applyTurn(true);
                               },
                               'filterParams': this._options.filterDialogTemplate && function(){
                                  self.createFiltersDialog.apply(self, []);
                               },
                               'clearFilter': this._options.filterDialogTemplate && function(){
                                  self.resetFilter();
                               },
                               'history': isHistory && $.proxy(self.showHistoryForActiveRecord, self),
                               'refresh': $.proxy(self.reload, self)};
      },
      /**
       * Простановка событий рекордсету
       * @param {$ws.proto.RecordSet} recordSet
       */
      _changeRecordSetHandlers: function(recordSet){
         if (recordSet instanceof $ws.proto.RecordSet) {
            this._currentRecordSet = recordSet;
            recordSet.subscribe('onRecordUpdated', $.proxy(this._onRecordUpdated, this));
            recordSet.subscribe('onRecordDeleted', $.proxy(this._onRecordDeleted, this));
            if(this._paging && this._paging !== true){
               this._paging.setRecordSet(recordSet);
            }
         }
      },
      /**
       * Замена рекордсета
       * @param {$ws.proto.RecordSet} data
       */
      setData: function(data){
         if (!data)
            return;

         if (!(data instanceof $ws.proto.RecordSet))
            throw new Error('Аргументом функции setData должен быть RecordSet');

         var self = this,
            setting = function(){
               if(self._setDataHandler){
                  self._parent.unsubscribe('onReady', self._setDataHandler);
               }
               if(self._options.display.viewType === 'hierarchy' || self._options.display.viewType === 'tree'){
                  data.setHierarchyField(self._hierColumnParentId);
               }
               data.subscribe('onBeforeLoad', $.proxy(self._onDataLoadStarted, self));
               data.subscribe('onAfterLoad', $.proxy(self._onDataLoaded, self));
               self._changeRecordSetHandlers(data);
               if (self._container.hasClass('ws-browser-ignore-local-page-size')) {
                  self.setPageSize(data.getPageSize(), true);
               } else {
                  self.setPageSize($ws.helpers.getLocalStorageValue('ws-page-size') || data.getPageSize(), true);
               }
               if(!self._dReady.isReady()){
                  self._dReady.callback();
               }
               self._pathReady.addCallback(function(){
                  self._pathSelector.setPath([]);
               });
               if(self._options.display.viewType === 'hierarchy'){
                  self._currentRootId = self._rootNode;
               }
               self.removeSelection();
               if(self._options.display.usePaging && self._currentRecordSet.getPageNumber() !== 0){
                  self.setPage(0, true);
               }
               else{
                  self._onDataLoaded({}, data, true);
               }
            };
         if(data.getContext().isGlobal())
            data.setContext(new $ws.proto.Context().setPrevious(self.getLinkedContext()));
         if(this._parent){
            this._parent.unsubscribe('onReady', this._dataBindHandler);
         }
         if(this._setDataHandler){
            this._parent.unsubscribe('onReady', this._setDataHandler);
         }
         if(this._parent && !this._parent.isReady()){
            this._parent.subscribe('onReady', this._setDataHandler = setting);
         }
         else{
            setting();
         }
      },
      /**
       * Возвращает деферред готовности рекордсета
       * @return {$ws.proto.Deferred}
       */
      recordSetReady: function(){
         return this._dReady;
      },
      /**
       * Подстановка нового источника данных. Инициирует замену рекордсета
       * @param {Object} dataSource
       */
      setSource : function(dataSource){
         if(dataSource instanceof Object) {
            if(this._parent){
               this._parent.unsubscribe('onReady', this._dataBindHandler);
            }
            if(this._setDataHandler){
               this._parent.unsubscribe('onReady', this._setDataHandler);
            }
            this._options.dataSource = dataSource;
            this._dReady = new $ws.proto.Deferred();
            this._initDataSource();
            this._dataBind();
         }
      },
      /**
       * Устанавливает текущую страницу
       * @param {Number} pageNumber Номер страницы
       * @param {Boolean} load Загружать ли
       */
      setPage: function(pageNumber, load){
         pageNumber = parseInt(pageNumber, 10);
         if(this._options.display.usePaging){
            var self = this;
            this._dReady.addCallback(function(){
               self._currentRecordSet.setPage(pageNumber, !load);
            });
         }
      },
      /**
       * Возвращает номер текущей страницы.
       * Если не используется постраничная навигация или рекордсет не готов (а при готовности он будет с нулевой страницеей),
       * то возвращает 0. Нумерация с нуля.
       * @return {Number}
       */
      getPageNumber: function(){
         if(this._options.display.usePaging && this._currentRecordSet){
            return this._currentRecordSet.getPageNumber();
         }
         return 0;
      },
      /**
       * Устанавливает размер страницы
       * @param {Number} pageCount Количество записей
       * @param {Boolean} [noLoad] Не загружать данные
       * @param {Boolean} [noSave] Не запоминать размер страницы
       */
      _setPageSize: function(pageCount, noLoad, noSave){
         if(this._options.display.recordsPerPage !== pageCount){
            this._options.display.recordsPerPage = pageCount;
            var self = this;
            if (!this._container.hasClass('ws-browser-ignore-local-page-size')) {
               $ws.helpers.setLocalStorageValue('ws-page-size', pageCount);
            }
            this._dReady.addCallback(function(){
               self._currentRecordSet.setPageSize(pageCount, noLoad);
            });
            this.getPaging().addCallback(function(paging){
               paging.setPageSize(pageCount);
               paging.update(1);
               return paging;
            });
         }
      },
      /**
       * Добавляет новое количество страниц в select, или просто находит его в существующем select'е
       * @param {Number} pageCount Количество записей
       */
      _insertPageCount: function(pageCount){
         var current = -1;
         for(var i = 0; i < this._pageOptions.length; ++i){
            if(this._pageOptions[i] >= pageCount){
               if(this._pageOptions[i] > pageCount){
                  this._pageOptions.splice(i, 0, pageCount);
               }
               current = i;
               break;
            }
         }
         if(current == -1){
            this._pageOptions.push(pageCount);
         }
         if(this._pageOptionsDropdown){
            var self = this;
            this._pageOptionsDropdown.addCallback(function(dropdown){
               var map = {};
               for(var i in self._pageOptions){
                  if(self._pageOptions.hasOwnProperty(i)){
                     map[self._pageOptions[i]] = self._pageOptions[i];
                  }
               }
               dropdown.setData(map);
               dropdown.setValue(pageCount);
               return dropdown;
            });
         }
      },
      /**
       * Устанавливает количество записей на каждой странице
       * @param {Number} pageCount Количество записей
       * @param {Boolean} [noLoad] Не загружать данные
       */
      setPageSize: function(pageCount, noLoad){
         if(this._options.display.usePaging && pageCount !== this._options.display.recordsPerPage){
            this._drawFooter(); // нарисуем его если вдруг не было
            this._setPageSize(pageCount, noLoad, true);
            if(this._options.display.usePageSizeSelect){
               this._insertPageCount(pageCount);
            }
         }
      },
      /**
       * вызывает метод setQuery у RecordSet'a
       * @param {Object} filter Параметры фильтрации
       * @param {Boolean} [doClear] очищать текущие данные перед загрузкой?
       * @param {Boolean|Number} [page] Если указать undefined, то обнулит текущую страницу (по-умолчанию). Если указать true, то сохранит старую. Если указать число - установит указанную страницу
       * @param {Array} [sorting] Массив, где каждый элемент имеет вид: {field: '...', order: 'asc' / 'desc'}. Чем раньше встретится элемент с полем field, тем важнее field будет для сортировки
       * @returns {$ws.proto.Deferred}
       */
      setQuery : function(filter, doClear, page, sorting){
         var self = this,
            result = new $ws.proto.Deferred();
         this._dReady.addCallback(function(){
            var queryFilter = self._prepareFilter($ws.core.merge({}, filter));
            for(var i in queryFilter){
               if(queryFilter.hasOwnProperty(i)){
                  if(queryFilter[i] === undefined)
                     delete queryFilter[i];
                  else if(i == self._hierColumnParentId){
                     self._systemParams[i] = queryFilter[i];
                     self._currentRootId = queryFilter[i];
                  } else if(i == "Разворот" && filter.hasOwnProperty(i) && self._options.display.expand === ""){
                     self._systemParams[i] = queryFilter[i];
                     if(self._options.display.viewType === "hierarchy"){ // применяем разворот только для иерархии
                        if(queryFilter[i] == "С разворотом" && self._turn === ""){
                           self._expandAll(queryFilter["ВидДерева"] == "С узлами и листьями", true);
                        } else if(queryFilter[i] == "Без разворота"){
                           self._clearExpandAll(true);
                        }
                     }
                  }
               }
            }
            self._loaded = {};
            if(queryFilter['Разворот'] !== 'С разворотом'){
               var rootExpand = self._expanded[self._rootNode];
               self._expanded = {};
               if(rootExpand){
                  self._expanded[self._rootNode] = rootExpand;
               }
            }
            if(self._options.display.viewType === 'tree' && self._options.display.expand && self._turn === ''){
               queryFilter['Разворот'] = 'С разворотом';
               self._expanded[self._rootNode] = 2;
            }
            if(!page){
               self._currentRecordSet.setPage(0, true);
            }
            else if(typeof(page) === 'number'){
               self._currentRecordSet.setPage(page, true);
            }
            if(sorting !== undefined){
               self.setSorting(sorting, true);
            }
            result.dependOn(self._runQuery(queryFilter, doClear));
         });
         return result;
      },
      /**
       * Внутренний метод для вызова загрузки с параметрами
       * @param {Object} filter Новый фильтр
       * @param {Boolean} [doClear] Нужно ли очищать данные
       * @returns {$ws.proto.Deferred}
       */
      _runQuery: function(filter, doClear){
         var self = this,
            result = new $ws.proto.Deferred();
         this._dReady.addCallback(function(){
            self._currentFilter = filter;
            doClear = doClear === undefined ? true : doClear;
            //self._currentRecordSet.setPage(0, true);
            result.dependOn(self._currentRecordSet.setQuery(filter, doClear));
            self._pathReady.addCallback(function(){
               var pathSelectorFilter = self._currentRecordSet.getQuery();
               delete pathSelectorFilter["_Итоги"];
               self._pathSelector.setQuery(pathSelectorFilter);
            });
         });
         return result;
      },
      /**
       * сбрасывает фильтр браузера к исходному
       * @param {Boolean} noLoad Не инициировать загрузку данных
       */
      resetFilter: function(noLoad){
         this._currentFilter = $ws.core.merge({}, this._initialFilter);
         var self = this;
         this._currentRecordSet.resetFilter(this._currentFilter, noLoad);
         this._pathReady.addCallback(function(){
            var pathSelectorFilter = self._currentRecordSet.getQuery();
            delete pathSelectorFilter["_Итоги"];
            self._pathSelector.setQuery(pathSelectorFilter);
   //         self._pathSelector.setQuery(self._currentRecordSet.getQuery());
         });
      },
      /**
       * возвращает текущий фильтр, по которому строится браузер
       * @param {Boolean} [updateFromContext] Нужно ли перезагружать поля из контекста
       * @return {Object} текущий фильтр браузера
       */
      getQuery: function(updateFromContext){
         var recordSetFilter = {},
            browserFilter = $ws.core.merge({}, this._currentFilter);
         if(updateFromContext)
            $ws.core.merge(browserFilter, this._prepareFilter(this._options.filterParams));
         else
            this._prepareSystemParams(browserFilter);
         // сбросим пользовательские фильтры, сброшенные через контекст, чтобы рекордсет их не проставил сам
         for(var i in browserFilter){
            if(browserFilter.hasOwnProperty(i) && browserFilter[i] === undefined)
               delete browserFilter[i];
         }
         if(updateFromContext){
            if(this._currentRecordSet)
               recordSetFilter = this._currentRecordSet.getUpdatedQuery(this._initialSource.filterParams);
            return $ws.core.merge(browserFilter, recordSetFilter , {rec : true});
         } else {
            if(this._currentRecordSet)
               recordSetFilter = this._currentRecordSet.getQuery();
            return $ws.core.merge(browserFilter, recordSetFilter, {preferSource: true});
         }
      },
      /**
       * Дописывает в фильтр системные параметры
       * @param {Object} filter Фильтр
       * @return {Object}
       * @private
       */
      _prepareSystemParams: function(filter){
         var retval = $ws.core.merge({}, filter) || {};
         for(var i in this._systemParams){
            if(this._systemParams.hasOwnProperty(i) && !( i in retval)){
               retval[i] = this._systemParams[i];
            }
         }
         return retval;
      },
      /**
       * Подготавливает фильтр.
       * @param {Object} filter
       * @returns {Object} новый фильтр
       */
      _prepareFilter: function(filter){
         var retval = this._prepareSystemParams(filter);
         for(var i in retval){
            if(retval.hasOwnProperty(i)){
               if(retval[i] instanceof Object && retval[i]['fieldName'] !== undefined){
                  retval[i] = this._context.getValue(retval[i].fieldName);
               }
               else if(typeof retval[i] === 'function'){
                  retval[i] = retval[i].apply(this, [this._context, i]);
               }
            }
         }
         return retval;
      },
      _initDataSource: function(){
         var self = this,
            dataSource = self._options.dataSource;

         if (!(dataSource instanceof Object))
            return false;

         var toMerge = {
            filterParams: {},
            rowsPerPage: this._options.display.recordsPerPage,
            usePages: this._options.display.expand ? '' : this._options.display.usePaging,
            hierarchyField: self.isHierarchyMode() ? this._options.display.hierColumn : "",
            handlers: {
               onBeforeLoad: self._onDataLoadStarted.bind(self),
               onAfterLoad: self._onDataLoaded.bind(self)
            }
         };

         if(this._options.display.expand){
            this._expandAll(this._options.display.expand === 'folders', true);
         }

         self._options.dataSource.filterParams = $ws.core.merge(self._options.dataSource.filterParams || {}, self._options.filterParams, {preferSource : true});
         self._options.dataSource.filterParams = self._prepareSystemParams(self._options.dataSource.filterParams); // Допишем системные параметры
         if(self._options.dataSource.filterParams[self._hierColumnParentId] === "") // запрашиваемый узел всегда должен уйти правильно
            self._options.dataSource.filterParams[self._hierColumnParentId] = self._rootNode;
         dataSource = $ws.core.merge(dataSource, toMerge);
         this._initialSource = $ws.core.merge({}, dataSource, {clone:true});
         this._initialSource.context = this._context;
         self._currentRootId = self._rootNode;
         if(dataSource.firstRequest){
            this._loaded[self._rootNode] = true;
         }
         this._drawPathSelector();
      },
      /**
       * Инстанцирует RecordSet, подписывается на его события , записывает его в переменную
       * @return {Boolean} результат выполнения операции
       */
      _dataBind: function(){
         var self = this,
             dataSource = self._options.dataSource;

         if (!(dataSource instanceof Object))
            return false;

         if(this._parent)
            this._parent.unsubscribe('onReady', this._dataBindHandler);

         var dataSourceCopy = $ws.core.merge({}, dataSource);
         dataSourceCopy.context = this._context;
         if(this._savedPageNum)
            dataSourceCopy.pageNum = this._savedPageNum;

         $ws.core.attachInstance('Source:RecordSet', dataSourceCopy).addCallback(function(instance){
            self._changeRecordSetHandlers(instance);
            self._dReady.callback();
            self._notify('onReady');

            if(self._options.display.columns && self._options.display.columns.length){
               self._drawHead();

               // нарисовали заголовок, данные ещё не пришли, надо сказать, что у нас изменился размер.
               self._heightChangedIfVisible();
            }
         });
         return true;
      },
      /**
       * Проверяет, изменилось ли в фильтре что-нибудь, кроме страницы
       * @param {Object} filter Новый фильтр
       * @return {Boolean}
       * @private
       */
      _hasFilterChanges: function(filter){
         for(var i in filter){
            if(filter.hasOwnProperty(i)){
               if(i !== 'pageNum' && this._pagingFilter[i] !== filter[i]){
                  return true;
               }
            }
         }
         return false;
      },
      /**
       * Событие, поджигаемое при начале загрзузки данных.
       * Рисует иконку загрузки в теле вместо данных.
       * Поджигается $ws.proto.RecordSet
       * @param {Event} event Событие
       * @param {Object}  filter Параметры фильтрации
       */
      _onDataLoadStarted: function(event, filter){
         var ajaxLoader = this._container.find('.ws-browser-ajax-loader');
         this._notify('onFilterChange', filter);
         if(this._paging && this._paging instanceof Object && this._hasFilterChanges(filter)){
            this._paging.clearMaxPage();
         }
         this._pagingFilter = filter;
         this._notify('onBeforeLoad');
         ajaxLoader.removeClass('ws-hidden');
         this._changeState();
      },

      /**
       * Событие, поджигаемое при загрзузке данных.
       * Поджигается $ws.proto.RecordSet
       *
       * @param {Event} eventState
       * @param {$ws.proto.RecordSet} recordSet
       * @param {Boolean} isSuccess Успешность запроса. Если не успешен - значит произошел Abort Ajax запроса
       * @param {Object} error Объект с ошибкой
       */
      _onDataLoaded: function(eventState, recordSet, isSuccess, error){
         var self = this;

         function doUpdate() {
            var result = undefined;

            if(isSuccess){
               this._currentRecordSet = recordSet;

               if(this._onBeforeRenderActions()) {
                  this._processPaging();
                  //Если колонки есть, то нам просто нужно их перечитать
                  if(this._columnMap && this._columnMap.length > 0){
                     this._mapColumns();
                  }
                  //Иначе ещё и шапку рисуем
                  else{
                     this._drawHead();
                  }
                  //Если папка сменилась, то в зависимости от режима загрузки по частям по разному открываем пути.
                  if(this._turn === '' && this._options.display.viewType === 'hierarchy' && this._pathSelector)
                     this._findWay(this._currentRootId);
                  if(this.getActiveElement()){ // если в браузере были записи, запоминаем активную
                     this._hovered = this.getActiveElement().attr('rowkey');
                  }
                  if(!this._reportPrinter){
                     this._reportPrinter = new $ws.proto.ReportPrinter({ columns: this._columnMap, titleColumn: this._options.display.titleColumn});
                  }
                  this._drawFooter();
                  this._updateResults();
                  this._drawBody();
                  this._updateTiming();

                  var onDrawingFinished = function(result) {
                     try {
                        self._notifyOnSizeChangedWithVisible();
                     }
                     finally {
                        self._notifyBatchDelayed('onAfterLoad');
                     }
                     return result;
                  };
                  var pager = this._updatePager();
                  if (pager) {
                     pager.addCallback(onDrawingFinished);
                     result = pager;
                  } else {
                     onDrawingFinished();
                  }
                  if(!this._firstLoadDeferred.isReady()){
                     this._firstLoadDeferred.callback();
                  }
               }
            }
            else{
               if(error instanceof HTTPError && error.httpError !== 0 && this._notify('onLoadError', error) !== true){
                  if(error.httpError == 403){
                     this._body.empty();
                     this._rootElement.find('.ws-browser-pager-text').empty();
                     this._emptyDataBlock.html('<span class="ws-browser-deny">Недостаточно прав для просмотра информации</span>').removeClass('ws-hidden');
                     this._emptyDataTextSet = false;

                     this._heightChangedIfVisible();
                  }
                  else{
                     $ws.core.alert(error.message.replace(/\n/mg, "<br />"), 'error');
                  }
                  error.processed = true;
               }
            }

            return result;
         }

         return this._runInBatchUpdate('_onDataLoaded', function() {
            try {
               doUpdate.call(self);
            } finally {
               self._hideLoadingIndicator();
            }
         });
      },
      /**
       * Фильтрует то, что должно попасть в состояние
       * @param {Object} filter Фильтр браузера
       * @protected
       */
      _filterState: function(filter){
         for (var i in filter){
            if (filter.hasOwnProperty(i) && filter[i] instanceof Date)
               filter[i] = filter[i].toSQL(null);
         }
      },
      /**
       * Сохраняем состояние
       * @private
       */
      _changeState : function(replace){
         if(!this._applyingState){
            var state;
            if (this._options.mode == "navigationMode"){
               var record = this.getActiveRecord();
               state = record ? record.getKey() : null;
               if(state)
                  this._notify("onStateChanged", state, !replace);
            }
            else{
               var filter = this.getQuery();
               this._filterState(filter);
               state = JSON.stringify(filter);
               if(state)
                  this._notify("onStateChanged", state, true);
            }

         }
      },
      /**
       * Применяем состояние
       * @param {String|int} state - состояние
       */
      applyState : function(state){
         var self = this;
         if (this._options.mode == "navigationMode"){
            var
               curRec = this.getActiveRecord(),
               curState =  curRec ? curRec.getKey() : null;

            if(state !== 'null' && state != curState){
               this._applyingState = true;
               this._firstLoadDeferred.addCallback(function(){
                  $ws.helpers.callbackWrapper(self.showBranch(state), function(){
                     self._applyingState = false;
                  });
               });
            }
            else{
               this.setActiveElement(this._body.find('tr[rowkey="' + (this._rootNode === null ? 'null' : this._rootNode.toString()) + '"]'));
            }
         }
         else{
            var q;

            try {
               q = $.parseJSON(state);
            }
            catch(e){
               q = {};
            }

            q = typeof q == "object" ? q : {};

            this._dReady.addCallback(function(){
               self.setQuery(q);
            });

            var findControl = function(parent, name){
               if (!parent)
                  return false;

               if (parent.hasChildControlByName(name))
                  return parent.getChildControlByName(name);
               else
                  return findControl(parent.getParent(), name)
            };
            for (var i in q){
               if (q.hasOwnProperty(i) && !(i in {"pageCount":0,"usePages":0})){
                  if(i !== 'pageNum'){
                     var
                           field = this._initialFilter[i],
                           name = field ? field["fieldName"] : undefined,
                           filterControl = name !== undefined ? findControl(this.getParent(), name) : undefined;
                     if ($ws.proto.DataBoundControl && filterControl instanceof $ws.proto.DataBoundControl)
                        filterControl.setValue(q[i]);
                     else if (name !== undefined)
                        this.getLinkedContext().setValue(name, q[i]);
                  }
                  else if(q[i])
                     this._savedPageNum = q[i];
               }
            }
         }
      },
      /**
       * Дейтсвия перед отрисовкой. Если вернём false, то отрисовка остановится
       * @returns {Boolean}
       */
      _onBeforeRenderActions: function(){
         return true;
      },
      /**
       * Скрывает индикатор загрузки и останавливает таймер
       */
      _hideLoadingIndicator: function(){
         if(this._loadingIndicatorTimer){
            clearTimeout(this._loadingIndicatorTimer);
         }
         this._container.find('.ws-browser-ajax-loader').addClass('ws-hidden');
      },
      /**
       * Метод обработки интеграции с пейджингом
       */
      _processPaging : function(){
         var nextPage = this._currentRecordSet.hasNextPage();
         if(this._pageChangeDeferred){ // только когда меняли страницу
            this._pageChangeDeferred.callback([this._currentRecordSet.getPageNumber() + 1, nextPage, nextPage]);
            this._pageChangeDeferred = undefined;
         }
         else if(this._paging && this._paging instanceof Object)
            this._paging.update(undefined, nextPage, nextPage);
      },
      /**
       * Находит путь к узлу по его id
       * @param {Number} idpr идентификатор строки
       */
      _findWay: function(idpr){
         var wayToBranch = this._currentRecordSet.getWay(),
             way = [],record;

         while(idpr && idpr != this._rootNode && wayToBranch !== null){
            try{
               record = wayToBranch.getRecordByPrimaryKey(idpr);
            }catch(e){
               record = this._currentRecordSet.getRecordByPrimaryKey(idpr);
            }
            way.unshift({'title': record.get(this._options.display.titleColumn), 'id': record.getKey()});
            idpr = record.get(this._hierColumnParentId);
         }
         if(this._pathSelector)
            this._pathSelector.setPath(way);
      },
      _pathRecordSetLoaded: function(eventState, recordSet, isSuccess){
         if(isSuccess){
            //Мы загрузили путь до узла
            var path = this._wayRS.getWay(),
                  record,                                            //Текущая запись из рекордсета
                  tempKey,                                           //Идентификатор, по которому будут загружаться записи
                  tempWay = [];                                      //Временный массив для складирования данных PathSelector'а

            if(this._rootNode && path !== null && !path.contains(this._rootNode))
               return;

            path.rewind();
            var wasRoot = !this._rootNode; //Был ли найден корневой узер
            while((record = path.next()) !== false){//В дереве делаем массив ключей, которые нужно будет подгрузить
               var key = record.getKey();
               if(record.get(this._hierColumnIsLeaf) === false && wasRoot){
                  break;
               }
               if(this._rootNode == key){
                  wasRoot = true;
               }

               //Используем только ключи, которые между рутом и первой скрытой папкой после рута
               if(wasRoot){
                  tempWay.push({'title': record.get(this._options.display.titleColumn), 'id': key});
               }
            }
            this._currentRootId = tempKey = (!tempWay.length ? this._rootNode : tempWay[tempWay.length - 1].id);
            this._hovered = this._wayRS.getLoadingId();
            this._activeElement = undefined;
            this._systemParams[this._hierColumnParentId] = tempKey;
            var deferred = this._currentRecordSet.loadNode(tempKey);
            if(!this._wayRSDeferred.isReady()){
               this._wayRSDeferred.dependOn(deferred);
            }
         }
      },
      /**
       * Создаёт специальный рекордсет, нужный, чтобы загружать путь до узла
       * @param {Number} rowkey идентификатор строки
       */
      _createPathRecordSet: function(rowkey){
         var dataSource = $ws.core.merge({}, this._initialSource),
               self = this;
         this._wayRSDeferred = new $ws.proto.Deferred();
         dataSource.firstRequest = true;
         dataSource.filterParams[this._hierColumnParentId] = rowkey;
         dataSource.filterParams["ПутьКУзлу"] = true;
         dataSource.filterParams["ЗаголовокИерархии"] = this._options.display.titleColumn;
         dataSource.handlers = {
            'onAfterLoad': $.proxy(self._pathRecordSetLoaded, self)
         };
         $ws.core.attachInstance('Source:RecordSet', dataSource).addCallback(function(instance){
            self._wayRS = instance;
         });
         return this._wayRSDeferred;
      },
      /**
       * Разворачивает указанную ветку по id парента
       * @param {Number} rowkey идентификатор парента
       * @param {Boolean} [noSelection] флаг того, что указанную запись не нужно выделять
       * @returns {$ws.proto.Deferred|undefined}
       */
      showBranch: function(rowkey, noSelection){
         return this._runInBatchUpdate('Browser.showBranch', function() {
            if(this._turn !== ''){
               this._clearExpandAll(true);
            }
            if(this._options.display.partiallyLoad && rowkey != this._rootNode &&
                  !this._currentRecordSet.contains(rowkey)){//Если мы не знаем, где расположена запись - нужно узнать
               this._showBranchAfterPathLoad(rowkey, noSelection);
               if(!this._wayRS)
                  return this._createPathRecordSet(rowkey);
               else{
                  return this._wayRS.loadNode(rowkey, true);
               }
            }
            else{
               return this._showActiveFolderOrElement(rowkey, noSelection);
            }
         });
      },
      /**
       * Действия, которые нужно сделать при загрузке пути
       */
      _showBranchAfterPathLoad: function(){
      },
      /**
       * Возвращает признак развернута ли папка по id парента
       * @param {Number} rowkey идентификатор парента
       * @returns {Boolean}
       */
      isShow: function(rowkey){
         if(this._options.display.viewType == 'hierarchy')
            return rowkey === this._currentRootId;
         else
            return false;
      },
      /**
       * Разворачивает указанную ветку по id парента или делает активным, если указана не папка
       * @param {Number} rowkey идентификатор парента
       * @param {Boolean} noSelection Флаг того, что не нужно выделять запись
       * @returns {$ws.proto.Deferred|undefined}
       */
      _showActiveFolderOrElement: function(rowkey, noSelection){
         return this._runInBatchUpdate('Browser._showActiveFolderOrElement', function() {
            if(this._options.display.viewType === 'hierarchy'){
               return this._showBranchHierarchy(rowkey, noSelection);
            }
            else if(!noSelection){
               this.setActiveElement(this._body.find('[rowkey="' + rowkey + '"]'));
            }
            return undefined;
         });
      },
      /**
       * Разворачивает указанную ветку иерархии по id парента
       * @param {Number} rowkey
       * @param {Boolean} noSelection Флаг того, что не нужно выделять запись
       * @returns {$ws.proto.Deferred|undefined}
       */
      _showBranchHierarchy: function(rowkey, noSelection){
         return this._runInBatchUpdate('Browser._showBranchHierarchy', function() {
            var way = [],
                idpr = rowkey,
                record,
                fldBranchName = this._hierColumnIsLeaf,
                fldParentIdname = this._hierColumnParentId;

            this._systemParams[this._hierColumnParentId] = rowkey;

            if(this._options.display.partiallyLoad){
               var parentRowkey = rowkey;
               if(this._rootNode != parentRowkey && this._currentRecordSet.contains(parentRowkey)){
                  record = this._currentRecordSet.getRecordByPrimaryKey(parentRowkey);
                  if(!record.get(this._hierColumnIsLeaf)){
                     parentRowkey = record.get(this._hierColumnParentId) || null;
                  }
               }
               if(!this._isIdEqual(this._currentRootId, parentRowkey)){
                  this._hovered = rowkey;
                  this._currentRootId = rowkey;
                  this._activeElement = undefined;
                  return this._currentRecordSet.loadNode(parentRowkey, !(this._currentRecordSet.contains(parentRowkey) || this._isIdEqual(this._rootNode, parentRowkey)));
               }
               else if(!noSelection){
                  this.setActiveElement(this._body.find('[rowkey="' + rowkey + '"]'));
               }
            }
            else{
               //Запись может быть в другом рекордсете
               var
                  wayToBranch = this._currentRecordSet.getWay(),
                  self = this,
                  getRecord = function(rowKey){
                     if(self._currentRecordSet.contains(rowKey)){
                        return self._currentRecordSet.getRecordByPrimaryKey(rowKey);
                     }
                     else if(wayToBranch.contains(rowKey)){
                        return wayToBranch.getRecordByPrimaryKey(rowKey);
                     }
                     return undefined;
                  };
               if(idpr && idpr != this._rootNode){
                  if(!getRecord(idpr))
                     return undefined;//Запись не содержится в рекордсетах = выходим

                  record = this._currentRecordSet.getRecordByPrimaryKey(idpr);
                  if(!record.get(fldBranchName))//Если это не папка, то возвращаемся на уровень вверх
                     idpr = record.get(fldParentIdname) || null;
               }
               this._currentRootId = idpr;
               //this._hovered = rowkey;
               var hasHiddenFolder = undefined;
               while(idpr && idpr != this._rootNode){//Идём до верха, запоминаем путь
                  record = getRecord(idpr);
                  way.unshift({'title': record.get(this._options.display.titleColumn), 'id': idpr});
                  if(record.get(this._hierColumnIsLeaf) === false){
                     hasHiddenFolder = idpr;
                  }
                  idpr = record.get(fldParentIdname) || null;
               }
               if(hasHiddenFolder !== undefined){
                  for(var i = 0; i < way.length; ++i){
                     if(way[i].id === hasHiddenFolder){
                        this._currentRootId = (i > 0 ? way[i - 1].id : this._rootNode);
                        if(!noSelection){
                           this._hovered = way[i];
                        }
                        while(way.length !== i + 1){
                           way.pop();
                        }
                        break;
                     }
                  }
               }
               if(this._pathSelector)
                  this._pathSelector.setPath(way);

               this._hovered = rowkey;
               this._drawBody();
               this._updatePager();
            }
            return undefined;
         });
      },
      /**
       * Обработчик на удаление записи в рекордсете
       * @param {Array} parents Предки тех записей, которые были удалены. Их и надо перезагружать
       * @param {String} [id] Идентификатор удалённой записи, если есть
       */
      _onRecordDeleted: function(event, parents, id){
         if(id !== undefined){
            delete this._selectedRecords[this._selected[id]];
            delete this._selected[id];
         }
         if(this._isFakeDelete !== true && this._options.display.reload){
            this._notify('onRecordsChanged');
            if(this._pathSelector){
               this._pathSelector.updateLast();
            }
            this._currentRecordSet.updatePages();
            if(this._options.display.viewMode == 'foldersTree'){
               var l = parents.length,
                   record, parentId;
               for(var i = 0; i < l; i ++){
                  if(this._currentRecordSet.contains(parents[i])){
                     record = this._currentRecordSet.getRecordByPrimaryKey(parents[i]);
                     parentId = record.get(this._hierColumnParentId);
                     if(isNaN(parseInt(parentId, 10)) ?  parentId != this._rootNode : parentId !== parseInt(this._rootNode, 10))
                        parents.push(parentId);
                  }
               }
            }
            this._currentRecordSet.loadNode(this._options.display.partiallyLoad ?
                  (parents instanceof Array ? parents : this._currentRootId) : this._rootNode, undefined, this._currentRecordSet.getPageNumber(), !this._options.display.partiallyLoad);
         }
         if(this._isFakeDelete === true)
            this._isFakeDelete = false;
      },
      /**
       * Сравнивает два id, возвращает true, если они значат одно и тоже
       * @param {String|Object|Number} id0 Первый идентификатор
       * @param {String|Object|Number} id1 Второй идентификатор
       * @returns {Boolean}
       */
      _isIdEqual: function(id0, id1){
         if(id0 == 'null'){
            id0 = null;
         }
         if(id1 == 'null'){
            id1 = null;
         }
         return id0 == id1;
      },
      /**
       * Обработчик на добавление записи в рекордсете
       * @param {Boolean} full перезагружать ли всё дерево
       * @param {Array} parents узел, начиная с которого необходимо перезагрузить дерево
       */
      _onRecordUpdated: function(full, parents){
         this._minimized = false;
         this._initialRecordSet = false;
         if(this._isUpdatingRecords){
            return;
         }
         this._notify('onRecordsChanged');
         if(this._pathSelector){
           this._pathSelector.updateLast();
         }
         if(this._options.display.viewMode == 'foldersTree' && parents instanceof $ws.proto.Record){
            var parentId = parents.get(this._hierColumnParentId);
            if(!this._isIdEqual(parentId, this._rootNode) && this._currentRecordSet.contains(parentId))
               this._currentRecordSet.getRecordByPrimaryKey(parentId).set(this._hierColumnHasChild, true);
            this._expanded[parentId] = true; // если вдруг добавляем в закрытую папку, то откроем ее
         }
         if(this._turn !== '' && !this._options.display.fixedExpand){
            this._clearExpandAll();
         } else if(this._options.display.reload){ // Если нужно перегружаться - попросим рекордсет
   //         var node = this.getActiveRecord().get(this._hierColumnParentId);
            var node;
            if(this._options.display.partiallyLoad && !this._fullTreeExpand){
               if(full === true){
                  node = [];
                  var map = {},
                     added = {};
                  for(var j = 0, len = parents.length; j < len; ++j){
                     if(!added[parents[j]]){
                        added[parents[j]] = true;
                        map[parents[j]] = true;
                        node.push(parents[j]);
                     }
                  }
                  for(var i in this._expanded){
                     if(this._expanded.hasOwnProperty(i)){
                        var tempKey = i,
                           record;
                        while(true){
                           if(tempKey in map && (this._expanded[tempKey] || (tempKey == this._rootNode &&
                              !this._options.display.showRoot)) && added[i] === undefined){
                              added[i] = true;
                              node.push(i);
                              break;
                           }
                           if(!tempKey || tempKey == this._rootNode){
                              break;
                           }
                           record = this._currentRecordSet.contains(tempKey) &&
                              this._currentRecordSet.getRecordByPrimaryKey(tempKey);
                           if(!record){
                              break;
                           }
                           tempKey = record.get(this._hierColumnParentId);
                        }
                     }
                  }
                  if(node.length === 0){
                     return;
                  }
               }
               else{
                  if(this.isHierarchyMode()){
                     node = this._getNodeForRecordUpdate(parents);
                     this._systemParams[this._hierColumnParentId] = node;
                  }
                  else{
                     node = null;
                  }
               }
            }
            else{
               node = this._rootNode || null;
            }
            this._currentRecordSet.loadNode(node, !this._options.display.partiallyLoad ||
               this._options.display.viewType === 'hierarchy', this._currentRecordSet.getPageNumber(),
               !this._options.display.partiallyLoad || this._fullTreeExpand);
   //         this._currentRecordSet.loadNode(node, true);
         } else // иначе просто вызовем отрисовку на текущем наборе данных
            this._drawBody();
      },
      /**
       * возвращает узел, в котором добавили/отредактировали запись
       */
      _getNodeForRecordUpdate: function(){
         var record = this.getActiveRecord();
         if(record){
            return record.get(this._hierColumnParentId);
         }
         return null;
         //return this._options.display.partiallyLoad || this._turn !== '' ? this._currentRootId : this._rootNode;
      },
      /**
       * Инициализирует события, которые нужно инициализировать один раз
       */
      _initEvents: function(){
         var browserContainer = this._rootElement.find('.ws-browser-container'),
             headScroller = this._headContainer.find('.ws-browser-head-scroller'),
             resultsScroller = (this._resultBrowser ? this._resultBrowser.parent() : undefined),
             self = this;
         browserContainer.bind('scroll', function(){
            self._onScrollActions();
            headScroller.scrollLeft(browserContainer.scrollLeft());
            if(resultsScroller){
               resultsScroller.scrollLeft(browserContainer.scrollLeft());
            }
            if(!Object.isEmpty(self._ladder)){
               var scrollPosition = $(this).offset().top/* + this.scrollTop*/, // это если работает Костин скролл
                   elem = $(this).find('tr:visible:first'),
                   position = elem.offset(),
                   l, i, collection;
               //while(!(position.top <= scrollPosition && (position.top + elem[0].offsetHeight) >= scrollPosition)){
               while(position.top < scrollPosition){
                  elem = elem.next('tr:visible');
                  position = elem.offset();
               }
               if(elem !== self._previousTRWithLadder){
                  self._toggleClassForLadder(elem);
                  if(self._previousTRWithLadder !== undefined)
                     self._toggleClassForLadder(self._previousTRWithLadder);
                  self._previousTRWithLadder = elem;
               }
            }
         });

         var rowkey;
         function clickHandler(event) {
            var cell = $(this),
                row = cell.closest('[rowkey]'),
                rowkey = row.attr("rowkey"),
                editMode = row.hasClass("ws-browser-folder") ? self._options.editBranchMode : self._options.editMode,
                record = rowkey && self._currentRecordSet.contains(rowkey) ?
                         self._currentRecordSet.getRecordByPrimaryKey(rowkey) : undefined;
            if(self._printMenuIsShow){ // если у нас осталось меню печати, то удаляем его
               self._createPrintMenu([]);
               self._printMenuIsShow = false;
            }
            if(!self._options.useSelection || !self._options.useHoverRowAsActive){// Передали фокус в обработке клика для выделения курсором
               self._onClickHandler(event);
            }
            if(self._checkEditAtPlace(event) || rowkey === ''){
               return false;
            }
   //         if(rowkey !== self._hovered && (self._options.display.viewType !== 'tree' || !self._options.display.partiallyLoad))
   //            self.setActiveElement(row, false);
            if(self.isEnabled()){
               //rowkey = (rowkey === "null" || !rowkey) ? null : rowkey = parseInt(rowkey);
               // первичный ключ у нас не всегда может быть числом. нужно об этом задуматься...
               rowkey = (rowkey === "null" || !rowkey) ? null : rowkey;
               var cellIndex = cell[0].cellIndex,
                   tableHeadName = undefined,
                   rowColumnName = undefined;
               if(cellIndex !== undefined && self._columnMap){
                  tableHeadName = self._columnMap[cellIndex].title;
                  rowColumnName = self._columnMap[cellIndex].field;
               }
               if(event.type === 'dblclick'){
                  self._dblClickHandler.apply(self, [event.type, false, row, rowkey, record, tableHeadName, rowColumnName]);
               }
               else{
                  self._notify('onRowClick', row, record, tableHeadName, rowColumnName);
                  if(self._options.mode !== 'navigationMode' || self._options.display.viewType !== 'tree'){
                     self._notifySetCursor(row, record);
                  }
               }
            }
            return editMode == 'thisWindow';
         }

         /**
          * Что мы фиксим здесь...
          * Кейс:
          *  Барузер, данных больше чем вмещается (есть верт. скроллинг)
          *  - Активируем браузер
          *  - Ставим курсор куда-то в первые ряды
          *  - Деактивируем браузер
          *  - Сроллим контейнер так чтобы строки было не видно
          *  - Кликаем на строку --> браузер прыгает.
          *
          * Происходило из-за того, что сперва клик доходил до контейнера и браузер делался активным
          * и фокус вставал на текущую активную строку.
          * А уже потом активной делалась строка, на которую кликали
          */
         var rows = $($ws.helpers.instanceOfModule(this, 'SBIS3.CORE.Browser') ? '[rowkey] > td' : '[rowkey]', self._body.parent()[0]).live('mousedown', function(event){
            if(!self._checkEditAtPlace(event) && self.isEnabled()){
               self.setActiveElement($ws.helpers.instanceOfModule(self, 'SBIS3.CORE.Browser') ? $(this).closest('tr') : $(this), false, true, true);
            }
         });
         if(this._options.mode === 'navigationMode' && this._options.display.viewType === 'tree'){
            rows.live('click', function(){
               var cell = $(this),
                  row = cell.closest('[rowkey]'),
                  rowkey = row.attr("rowkey"),
                  record = rowkey && self._currentRecordSet.contains(rowkey) ?
                     self._currentRecordSet.getRecordByPrimaryKey(rowkey) : undefined;
               self._processElementClick(row, rowkey, record);
            });
         }
         if(!this._options.useHoverRowAsActive)
            rows.wsFixedLiveClick(clickHandler, clickHandler);

         var parent = this._body.parent()[0];
         function itemActivated(event){
            self._onClickHandler(event);
            if(self._checkEditAtPlace(event)){
               return false;
            }
            var tr = $(this).closest('[rowkey]'),
                  rowkey = tr.attr('rowkey');
            if(rowkey !== self._hovered && (!tr.hasClass("ws-browser-folder") || self._options.display.viewType !== 'tree' || !self._options.display.partiallyLoad))
               self.setActiveElement(tr, false);
            if(self.isEnabled()){
               var record = undefined,
                     td = $(this).closest('td'),
                     cellIndex = td.length === 0 ? undefined : td[0].cellIndex,
                     tableHeadName = undefined,
                     rowColumnName = undefined;
               if(self._currentRecordSet.contains(rowkey))
                  record = self._currentRecordSet.getRecordByPrimaryKey(rowkey);
               if(cellIndex !== undefined && self._columnMap){
                  tableHeadName = self._columnMap[cellIndex].title;
                  rowColumnName = self._columnMap[cellIndex].field;
               }
               self._dblClickHandler.apply(self, [event.type, true, tr, rowkey, record, tableHeadName, rowColumnName]);
            }
            event.stopPropagation();
            event.preventDefault();
            return false;
         }
         if(!this._options.useHoverRowAsActive)
            $('.ws-browser-edit-link, .ws-browser-folder-link', parent).live('click dblclick', itemActivated);

         if(this._options.useSelection){
            if(this._options.useHoverRowAsActive){
               this._data.addClass("ws-browser-active-hover");
               $('[rowkey]', parent).live('mouseenter', function(){
                  if(!self._useKeyboard){
                     if(self._activeElement && 'jquery' in self._activeElement)
                        self._activeElement.removeClass("ws-browser-item-over");
                     self._activeElement = $(this);
                     self._hovered = self._activeElement.attr('rowkey') === 'null' ? null : self._activeElement.attr('rowkey');
                     self._activeElement.addClass("ws-browser-item-over");
                  }
               });
               $(this._container).live('mouseleave', function(){
                  if(!self._useKeyboard && self._activeElement && 'jquery' in self._activeElement)
                     self._activeElement.removeClass("ws-browser-item-over");
               });
               $('tr[rowkey] td', parent).live('click', itemActivated);
            } else
               this._data.addClass("ws-browser-hover");
         }
      },
      /**
       * Обработчик скролла в теле браузера
       */
      _onScrollActions: function(){
      },
      /**
       * Скрывает/отображает данные, скрытые лесенкой в нужной строке
       * @param {jQuery} trWithLadder строка с лесенкой
       */
      _toggleClassForLadder: function(trWithLadder){
         var collection = trWithLadder.find('.ws-browser-column-with-ladder');
         for(var i = 0, l = collection.length; i < l; i++){
            var element = collection[i].getElementsByClassName('ws-browser-ladder-element')[0];
            if(element !== undefined)
               $(element).toggleClass(element.tagName === 'DIV' ? 'ws-hidden' : 'ws-invisible');
         }
      },
      _drawHead: function(){
      },
      /**
       * Метод отрисовки пути
       */
      _drawPathSelector: function(){
         if((this._options.display.viewType === 'hierarchy' || this._turn !== '') && this._options.display.showPathSelector){
            var self = this,
                container = $('<div class="ws-BrowserPathSelector"><div></div></div>'),
                dataSource = $ws.core.merge({}, this._initialSource);
            this._headContainer.prepend(container);
            this._pathSelector = false;                                             //Path Selector загружается
            dataSource.context = this.getLinkedContext();
            delete dataSource.filterParams["_Итоги"];
            $ws.core.attachInstance('Control/PathSelector', {
               element: container.find('div'),
               rootNodeCaption: this._options.display.rootName,
               rootNodeId: this._rootNode === null ? -1 : this._rootNode,           //$ws.core.extend bug
               dataSource: dataSource,
               titleColumn: this._options.display.titleColumn,
               folderIcon: this._options.display.hierarchyIcons,
               handlers: {
                  'onPathChange': function(eventState, id){
                     self._systemParams[self._hierColumnParentId] = id;
                     var load = self._options.display.partiallyLoad;
                     if(load)
                        self.showBranch(id);
                     else{
                        self._currentRootId = id;
                        self._currentRecordSet.loadNode(load ? self._currentRootId : self._rootNode, !load, 0, !load);
                     }
                     self.setActive(true);
                  }
               }
            }).addCallback(function(instance){
               self._pathSelector = instance;
               instance.setEnabled(self.isEnabled());
               self._pathReady.callback();
            });
         }
      },
      /**
       * Метод получения списка кнопок для тулбара
       * @returns {Array}
       */
      _getToolbarButtons: function(){
         if(this._options.allowAdd === false)
            return [];
         //Массив кнопочек. [Тултип, иконка, условие показа, обработчик на нажатие]
         if(this._options.display.viewMode === 'foldersTree')
            return [ ['Добавить (Ctrl+Insert)', 'sprite:icon-16 icon-CreateFolder icon-primary', 'addFolder'] ];
         else
            return [
               ['Добавить запись (Insert)', 'sprite:icon-16 icon-Add icon-primary', 'addItem'],
               ['Добавить папку (Ctrl+Insert)', 'sprite:icon-16 icon-CreateFolder icon-primary', 'addFolder']];
      },
      /**
       * Метод получения списка иконок, валидных на данный момент
       * @return {Array} Массив кнопок с опциями.
       * Структура задана жестко. [Тултип, иконка, условие показа, обработчик на нажатие(функция)]
       */
      _getMenuButtons: function(){
         var buttons = [];
         //Массив кнопочек. [Тултип, иконка, условие показа, обработчик на нажатие]
         //Пустой тултип = разделителю
         if(!this._options.display.rowOptions && !this._options.display.editAtThePlaceOnly){
            buttons.push(
               [this._options.display.readOnly ? 'Просмотреть (F3)' : 'Редактировать (F3)', 'sprite:icon-16 icon-Edit icon-primary',
               'edit'],
               ['Копировать запись (Shift+F5)', 'sprite:icon-16 icon-Copy icon-primary', 'copy']
            );
         }
         buttons.push(['Удалить (Delete)', 'sprite:icon-16 icon-Erase icon-error', 'delete']);

         buttons.push(['Перечитать данные (Ctrl+N)', 'sprite:icon-16 icon-Refresh icon-primary', 'refresh']);

         if(this._options.display.viewType !== 'tree' || this._turn !== '')
            buttons.push(
               ['Развернуть без папок (Ctrl+V)', 'sprite:icon-16 icon-ListView icon-primary', 'expand']
            );
         buttons.push(
            [this._options.display.viewType === 'tree' ? 'Раскрыть/закрыть дерево с вложенными папками (Ctrl+B)' :
               'Развернуть с папками (Ctrl+B)', 'sprite:icon-16 icon-TreeView icon-primary', 'expandWithFolders'],
            /*['', '', 'filterParams'],*/
            ['Параметры фильтрации (Ctrl+Q)', 'sprite:icon-16 icon-Document icon-primary', 'filterParams'],
            ['Очистить фильтрацию', 'sprite:icon-16 icon-Close icon-primary', 'clearFilter'],
            /*['', '', 'history'],*/
            ['Показать историю изменений (Ctrl+Н)', 'sprite:icon-16 icon-History icon-primary', 'history']
         );
         return buttons;
      },
      showHistoryForActiveRecord: function(){
         this.showHistory(this.getActiveRecord().getKey());
      },
      /**
       * Метод прорисовки встроенного тулбара
       */
      _drawToolBar: function() {
         if(this._options.display.showToolbar){
            var toolbarContainer = $('<div class="ws-browser-toolbar"><div class="ws-toolbar" id="' + this.getId() + '-toolbar"></div></div>');
            this._headContainer.prepend(toolbarContainer);
            var buttons = this._getToolbarButtons(),
                subButtons = this._getMenuButtons(),
                self = this;
            $ws.core.attachInstance("SBIS3.CORE.ToolBar", {
               element: toolbarContainer.find('.ws-toolbar'),
               parent: this.getParent(),
               buttons: this._prepareButtonsList(buttons),
               subBtnCfg: this._prepareButtonsList(subButtons),
               buttonsSide: 'right',
               handlers: {
                  'onReady': function(){
                     self._toolbar = this;
                     if(self.getReports(true).length !== 0 || (!self._options.display.rowOptions && self.getReports(false).length !== 0)){
                        var onSubMenuActivated = function(){
                           this.getButton('menu').subscribe('onActivated', function(){
                              self._addSubMenuForToolbarElement('print', this.getId() + '_print', true);
                              if(!self._options.display.rowOptions)
                                 self._addSubMenuForToolbarElement('printRecord', this.getId() + '_printRecord', false);
                           });
                        };
                        try{
                           onSubMenuActivated.apply(toolbar, []);
                        }catch(e){
                           this.subscribe('onAfterLoad', onSubMenuActivated);
                        }
                     }
                     this.setEnabled(self.isEnabled());
                     self._toolbarReady.callback(this);
                  }
               }
            });
         }
      },
      _addSubMenuForToolbarElement: function(elementName, elementId, forList, menu, record){
         var toolbarMenu = menu ? menu : this._toolbar.getMenu();
         if(toolbarMenu.hasSubMenu(elementId))
            toolbarMenu.destroySubMenu(elementId);
         if(toolbarMenu.isVisible()){
            var result = this._prepareReports(forList, forList ? false : ( record ? record : this.getActiveRecord() ), elementName);
            if(result && ( result.constructor === Array || typeof(result) == 'string')){
               toolbarMenu.showItem(elementName);
               if(result.constructor === Array){
                  toolbarMenu.addSubMenu(elementName, result);
                  this._needPrint = false;
               } else {
                  this._needPrint = result;
               }
            } else {
               this._needPrint = false;
               if(!forList)
                  toolbarMenu.hideItem(elementName);
            }
         }
      },
      _prepareReports: function(forList, record, elementName){
         var subMenu = null,
             data = Object.isEmpty(this._selected) ? ( record ? record : this.getActiveRecord()) : this.getSelection(),
             reports = this._notify('onBeforeShowPrintReports', this.getReports(forList), data, forList),
             self = this;
         if(reports === false){
            subMenu = false;
         } else {
            var reportsList;
            if(reports instanceof Array){
               reportsList = reports;
            } else{
               reportsList = this.getReports(forList);
            }
            if(reportsList.length == 1){
               subMenu = reportsList[0];
            } else {
               subMenu = [];
               for(var j = 0, l = reportsList.length; j < l; j++ ){
                  subMenu.push({
                     caption: reportsList[j],
                     id: self.getId() + '_' + elementName + reportsList[j],
                     handlers: {
                        onActivated: function(event, element){
                           self.printReport(element.caption, forList, self.getActiveRecord());
                        }
                     }
                  });
               }
            }
         }
         return subMenu;
      },
      /**
       * Создаёт объект конфигурации меню
       * @param {Object} button Параметры кнопки
       * @returns {Object}
       */
      _prepareMenuItem: function(button){
         return {
            imgSrc: $ws._const.wsRoot + button[1],
            id: button[2],
            caption: button[0],
            handlers: {
               'onActivated': this._actions[button[2]]
            }
         };
      },
      /**
       * Создаёт объект конфигурации кнопки тулбара
       * @param {Object} button Параметры кнопки
       * @returns {Object}
       */
      _prepareButton: function(button){
         return {
            tooltip: button[0],
            img: $ws._const.wsRoot + button[1],
            name: button[2],
            handlers: {
               'onActivated': this._actions[button[2]]
            }
         };
      },
      /**
       * Подготовливает список кнопок
       * @param {Array} buttons Массив с конфигурацией кнопок
       */
      _prepareButtonsList: function(buttons){
         var list = [],
            prevSeparator = true,
            insertSeparator = function() {
               if(!Object.isEmpty(list[list.length - 1]))
                  list.push({});
            };
         for(var i = 0, l = buttons.length; i < l; i++ ){//Разбор массива готовых кнопок, с задефайненой структурой
            if(this._actions[buttons[i][2]]){//Проверка поля условия проходит - значит можно рисовать
               if(buttons[i][0] === ''){//Сепаратор с пустым тултипом
                  if(!prevSeparator){
                     insertSeparator();
                     prevSeparator = true;
                  }
               }
               else{ //добавляем кнопку в отрисовку
                  list.push(this._prepareButton(buttons[i]));
                  prevSeparator = false;
               }
            }
         }
         return list;
      },
      /**
       * Метод добавления дополнительной кнопки/
       * @param {String} tooltip подпись при наведении на кнопку
       * @param {String} img путь к картинке (указывается относительно ресурсов)
       * @param {Object} handlers стандартный объект с описание обработчиков
       * @param {String} name имя кнопки
       * @param {String} [wsClassName] Имя создаваемого класса
       */
      addToolbarButton : function(tooltip, img, handlers, name, wsClassName){
         if (img.indexOf($ws._const.resourceRoot) < 0 && img.indexOf($ws._const.wsRoot) < 0)
            img = $ws._const.resourceRoot + img;

         this._toolbarReady.addCallback(function(toolbar){
            toolbar.addButton({
               tooltip: tooltip,
               img: img,
               handlers: handlers,
               name: name,
               wsClassName: wsClassName
            });
            return toolbar;
         });
      },
      /**
       * Метод, возвращающий имя основного диалога фильтрации dataView
       * {@returns} String
       */
      getFiltersDialogName: function(){
         return this._options.filterDialogTemplate;
      },
      /**
       * Метод создания области фильтров
       */
      createFiltersDialog:function(filterDialog, id){
         var self = this,
             hdl = {
                onAfterClose : $.proxy(self._mouseMonitor, self)
             },
             colDef = {};
         if(id)
            colDef = self._columnMap[id];
         if(!filterDialog)
            filterDialog = this._options.filterDialogTemplate;
         else
            hdl['onBeforeApplyFilter'] = function(event, filter){
               var newFilter = {};
               if(!Object.isEmpty(colDef)){
                  for(var key in filter){
                     if(key === colDef.title){
                        newFilter[key] = filter[key];
                        break;
                     }
                  }
               }
               newFilter = $ws.core.merge(self.getQuery(), newFilter);
               event.setResult(newFilter);
            };
         this._useKeyboard = true;
         $ws.core.attachInstance('SBIS3.CORE.FiltersWindow', {
            template: filterDialog,
            context: new $ws.proto.Context().setPrevious(self.getLinkedContext()),
            linkedBrowsers: [ this.makeOwnerName() ],
            handlers: hdl
         });
      },
      /**
       * Применить разворот.
       * @param {Boolean} isWithFolders разворачивать с папками или без
       */
      applyTurn: function(isWithFolders){
         return this._runInBatchUpdate('Browser.applyTurn', function() {
            if(this._options.display.fixedExpand || (isWithFolders === false && this._options.display.viewMode == 'foldersTree')){
               return;
            }
            if (this._turn === '')
               this._expandAll(!!isWithFolders);
            else
               this._clearExpandAll();
         });
      },
      /**
       * Рисует тело таблицы и заполняет его данными
       */
      _drawBody: function(){
         var block = BOOMR.plugins.WS.startBlock(["DataView._drawBody", this._methodName].join("?")),
            columns = this._currentRecordSet.getColumns();
         if(this._options.display.viewType == 'hierarchy' && !Object.isEmpty(columns) && !(this._options.display.titleColumn in columns))
               throw new Error("Trying to render hierarchy with unexistent titleColumn");

         this._drawBodyCycle();
         if(this._options.useSelection === false)
            this._data.addClass('ws-browser-selection-none');
         if(this._options.mode === 'oneClickMode')
            this._data.addClass('ws-one-click-browser');
         if(this._options.display.viewType === 'tree' && this._turn === '')
            this._data.addClass('ws-tree-browser');
         this._data.toggleClass('ws-browser-hasZebra', !!this._options.display.hasZebra);
         this._data.toggleClass('ws-browser-hasToolbar', !!this._options.display.showToolbar && !this._options.display.showHead);
         if(this._count === 0 && this.isActive()){
            this._data.focus();
         }
         this._openNodeForNavigationMode();

         if(this._currentRecordSet.isInit()){
            this._head.removeClass("ws-hidden");
            if(!this._emptyDataTextSet){
               this._emptyDataTextSet = true;
               if( this._currentRecordSet.isEmptyTable() ){
                  this._emptyDataText = this._options.display.emptyTableHtml;
                  this._head.toggleClass("ws-hidden", this._count === 0);
               }
               else
                  this._emptyDataText = this._options.display.emptyHtml;

               this._emptyDataBlock.html(this._emptyDataText);
            } else if( this._currentRecordSet.isEmptyTable() ){
               this._emptyDataText = this._options.display.emptyHtml;

               this._emptyDataBlock.html(this._emptyDataText);
               this._head.toggleClass("ws-hidden", this._count === 0);
            }

            this._emptyDataBlock.toggleClass("ws-hidden", this._count !== 0);

            // Если у нас нет записей, и не пустой текст отсутствия записей, то скрываем футер
            this._foot.toggleClass('ws-hidden', this._count === 0 && this._emptyDataText);
         }
         this._rootElement.height('auto').find('.ws-browser-container').show();
         this._body.find('tr:last').addClass('ws-browser-table-row-last');

         this._heightChangedIfVisible();
         this._updateSelection();

         block.close();
         this._runBatchDelayedFunc('drawBody.onAfterRender', function() {
            if(this._notify('onAfterRender') === true){
               this._heightChangedIfVisible();
            }
            this._afterDrawActions();
         });
      },

      /**
       * Действия, которые необходмо выполнить перед отрисовкой
       * @private
       */
      _afterDrawActions: function(){
      },
      /**
       * Открывает ветку в режиме навигации
       * @private
       */
      _openNodeForNavigationMode: function(){
         if(this._options.mode === 'navigationMode' && this._options.display.viewType === 'tree' && !this._applyingState){
            var dataRow;
            if (this._currentRecordSet.contains(this._hovered))
               dataRow = this._currentRecordSet.getRecordByPrimaryKey(this._hovered);
            else
               dataRow = this._currentRecordSet.at(0);
            if(dataRow){
               var id = dataRow.getKey();
               if(dataRow.get(this._hierColumnIsLeaf) && this._expanded[id] === undefined &&
                  this._body.find('tr[rowkey="' + id + '"]').length){
                  this._processTreeClick(id, false);
               }
            }
         }
      },
      /**
       * Пересчитывает высоту, если контрол видим, и не находится в обработчике onBeforeRender
       * (из него могут какие-то методы вызваться, которые вызовут _heightChangedIfVisible. пересчитывать в этом состоянии нельзя,
       * потому что drawBody и т.п. ещё не прошёл, структура старая).
       * @protected
       */
      _heightChangedIfVisible: function(){
         var recalcNow = this._isVisibleWithParents() && !this._isInBeforeRenderAction();
         if (recalcNow)
            this._contentHeightChanged();

         this._notifyOnSizeChanged(this, this, !recalcNow);
      },
      _contentHeightChanged: function(){
         this._setHeight();
      },
      /**
       * Проходит по строкам рекордсета, рисует нужные
       */
      _drawBodyCycle: function(){
         throw new Error("DataView::_drawBodyCycle must be implemented in child classes");
      },
      /**
       * Выполняет действия, необходимые для сохранения открытых элементов отрисовки
       */
      _reloadBody: function(){
         if(this._turn === "" && this._pathSelector){
            this._pathSelector.setPath([]);
         }
         this._drawBody();
      },
      /**
       * Обновляет отображение текущего элемента после перерисовки
       */
      _updateSelection: function(){
         if(this._hovered || !this._hovered && !this._options.useHoverRowAsActive && this._options.setCursorOnLoad){
            // Попробуем найти текущий выделенный элемент
            var selectedRow = this._body.find(this._hovered ? '[rowkey="' + this._hovered + '"]' : ':first');
            // Если не получилось
            if(selectedRow.length != 1 || selectedRow.hasClass('was-hidden'))
               selectedRow = this._body.find(':first'); // Выберем первый элемент
            if(selectedRow.length === 0){// не обрабатываем в случае, если в браузере по какой-то причине нет элементов
               this._activeElement = undefined;
               this._hovered = undefined;
               this._notifySetCursor(undefined, undefined);
            }
            else
               this.setActiveElement(selectedRow);
         }
      },
      /**
       * Ивещает о смене текущей строки. При этом сохраняет последнюю строку, чтобы одно событие не срабатывало дважды подряд (как в случае при открытии дерева)
       * @param {jQuery} row Строка, которую выделили. Этот параметр не используется, но оставлен ради минимазации изменений в коде старых браузеров. В коде новых браузеров его нет.
       * @param {$ws.proto.Record} record Запись, которая относится к данной строке
       */
      _notifySetCursor: function(row, record){
         if(!this._rowSelectionSetted){
            this._runBatchDelayedFunc('onSetCursor', function() {
               var row = record ? this._body.find('[rowkey="' + record.getKey() + '"]') : $();
               this._notify('onSetCursor', row, record);
            });
         }
         else{
            this._rowSelectionSetted = false;
         }
      },
      /**
       * Рисует футер таблицы
       */
      _drawFooter: function(){
         var footerContainer;
         // растягиваем строку состояния на всю ширину таблицы
         if(!this._footerDrawed){
            this._footerDrawed = true;
            footerContainer = this._foot.find(".ws-browser-pager-cont");
            if(this._options.display.showPaging)
               footerContainer.prepend('<div class="ws-browser-paging"></div>');
            if(this._options.display.showRecordsCount){
               footerContainer.prepend('<div class="ws-browser-pager"><span class="ws-browser-pager-text">&nbsp;</span></div>');
               if(this._options.display.usePaging && this._options.display.usePageSizeSelect){
                  this._pageOptions = this._pageOptions.concat($ws._const.Browser.pageSizes);
                  var self = this,
                     select = $('<div class = "ws-browser-pager-select"></div>'),
                     pager = this._foot.find('.ws-browser-pager');
                  pager.append(this._pageOptionsContainer = $([$('<span class="ws-browser-pager-select-text">&nbsp;(по&nbsp;</span>').get(0),
                     select.get(0),
                     $('<span class="ws-browser-pager-select-text">&nbsp;на странице)</span>').get(0)]));
                  this._insertPageCount(this._options.display.recordsPerPage);
                  if (!this._container.hasClass('ws-browser-ignore-local-page-size')) {
                     $ws.helpers.setLocalStorageValue('ws-page-size', self._options.display.recordsPerPage);
                  }
                  (this._pageOptionsDropdown = new $ws.proto.Deferred()).dependOn($ws.core.attachInstance('Control/Field:FieldDropdown', {
                     element: select,
                     width: '100%',
                     parent: this.getParent(),
                     data: {
                        keys: this._pageOptions,
                        values: this._pageOptions
                     },
                     wordWrap: false,
                     allowChangeEnable:false,
                     context: new $ws.proto.Context().setPrevious(self.getLinkedContext()).setValue("page-select-dropdown" + self._id, self._options.display.recordsPerPage),
                     name: 'page-select-dropdown' + self._id,
                     value: self._options.display.recordsPerPage,
                     handlers: {
                        onChange: function(){
                           self._setPageSize(this.getValue());
                        }
                     }
                  }));
               }
            }
            if (this._options.display.showTiming === true){
               this._foot.append('<tr><td class="ws-browser-timing">&nbsp;</td></tr>');
            }
         }
      },
      _drawRowOptionsButtons: function(flag){
         if(!Object.isEmpty(this._options.markedRowOptions)){
            var blockId = 'ws-browser-block-options-'+ this.getId();
            flag = flag || false;
            if(flag){
               if(!this._foot.find('#'+ blockId).length){
                  var pager = this._foot.find('.ws-browser-pager'),
                      divRowOptions = $('<div class="ws-browser-foot-row-options" id="'+ blockId +'"></div>'),
                      rowOption,
                      self = this;
                  if(pager){
                     for(var option in this._options.markedRowOptions){
                        var markedOption = this._options.markedRowOptions[option];
                        rowOption = $('<div class="ws-browser-foot-row-option" id="'+ option +'"></div>');
                        if(typeof(markedOption.action) === 'function'){
                            rowOption.bind('click', function(e){
                                self._options.markedRowOptions[e.currentTarget.id].action.apply(self, self.getSelection(true));
                            });
                        }
                        divRowOptions.append(rowOption.append('<span class="ws-browser-foot-row-option-icon" ' +
                              'style="background: '+ ["url(", $ws.helpers.processImagePath(markedOption.image),") no-repeat scroll"].join("") +'"></span>' +
                              '<span class="ws-browser-foot-row-option-button">'+ option +'</span>'));
                     }
                     pager.parent().append(divRowOptions);
                  }
               }else{
                  if(!this._isRenderedFootRowOptions)
                     this._foot.find('#' + blockId).removeClass('ws-hidden');
               }
               this._isRenderedFootRowOptions = true;
            }else if(this._isRenderedFootRowOptions){
               this._foot.find('#' + blockId).addClass('ws-hidden');
               this._isRenderedFootRowOptions = false;
            }

            //Если высота браузера (его подвала) изменилась - надо пересчитать
            this._heightChangedIfVisible();
         }
      },
      /**
       * Изменяет тайминги в таблице
       */
      _updateTiming: function(){
         if (this._options.display.showTiming === true){
            var tmDraw = (new Date()).valueOf() - this._currentRecordSet.getBeginTime() - this._currentRecordSet.getElapsedTime(); // время отрисовки таблицы
            var timingText =
               /*"выборка : "
                  + $ws.render.defaultColumn.money(this._currentRecordSet.getDataLength() / 1024)
                  + "KB | */
                  "представление : "
                  + $ws.render.defaultColumn.money(this._body.parent().html().length / 1024)
                  + "KB | получение данных от сервера : "
                  + $ws.render.defaultColumn.timer(this._currentRecordSet.getElapsedTime())
                  + "сек. | генерация отчета на клиенте : "
                  + $ws.render.defaultColumn.timer(tmDraw) + "сек.";
            this._foot.find('.ws-browser-timing').html("<div>" + timingText + "</div>");
         }
      },
      _updateResults: function(){
      },
      /**
       * Возвращает признак, отображается ли браузер в "иерархическом" режиме
       * @returns {Boolean}
       */
      isHierarchyMode: function(){
         return this._options.display.viewType === 'hierarchy';
      },
      /**
       * Вызывает события onRowActivated и onChange для активной строки
       * @param {jQuery} activeRow активная строка
       */
      _elementActivated: function(activeRow, ignoreSelection) {
         var isBranch = false,
             currentRecord = this.getActiveRecord(activeRow);

         if (currentRecord instanceof $ws.proto.Record){
            ignoreSelection = ignoreSelection ? ignoreSelection : false;
            if(this._selectMode && !ignoreSelection){
               this.confirmSelection([currentRecord]);
               return;
            }
            if(this.isHierarchyMode())
               isBranch = currentRecord.get(this._hierColumnIsLeaf);

            var eventResult = this._notify('onRowActivated', activeRow, currentRecord);
            if(eventResult !== false)
               this._showRecordDialog(currentRecord.getKey(), isBranch);
         }
      },
      _clickOnFolder: function(row, rowkey, record){
         this._systemParams[this._hierColumnParentId] = rowkey;
         if(this._pathSelector && record){
            this._pathSelector.append({'id': rowkey,
               title: record.get(this._options.display.titleColumn)});
         }
         if(this._options.display.partiallyLoad){
            this._currentRootId = rowkey;
            this._systemParams[this._hierColumnParentId] = rowkey;
            this._notify('onRowActivated', row, record);
            this._currentRecordSet.loadNode(rowkey);
         }
         else{
            this._folderOpen(row);
         }
      },
      _dblClickHandler: function(eventType, isLink, row, rowkey, record, tableHeadName, rowColumnName){
         $ws.helpers.clearSelection();
         var flag = true;
         if(eventType === 'click')
            flag = this._notify('onRowClick', row, record, tableHeadName, rowColumnName);
         else
            flag = this._notify('onRowDoubleClick', row, record, tableHeadName, rowColumnName);
         if(flag !== false){
            // В режиме иерархии при даблклике на папку - только вход в нее
            //if(row.hasClass("ws-browser-folder") && this._options.mode !== 'oneClickMode'){
            if(row.hasClass("ws-browser-folder") &&
                  ( isLink && ( this._options.display.viewType !== 'tree' || this._options.folderLinkAction !== "activate") ||
                  eventType === 'dblclick' && this._options.mode !== 'oneClickMode' && this._options.mode !== 'navigationMode') ){
               if(this._options.display.viewType == 'hierarchy')
                  this._clickOnFolder(row, rowkey, record);
               else
                  this._processElementClick(row, rowkey, record);
            }
            // в остальных случаях - всегда подъем событий
            else{
               this._notifySetCursor(row, record);
               if(row.hasClass('ws-browser-root')){
                  this._notify('onRowActivated', row, null);
                  this._notify('onChange');
               }
               else{
                  this._elementActivated(row);
               }
            }
         }
         else{
            this._notifySetCursor(row, record);
         }
      },
      /**
       * Проверяет, если есть редактирование по месту, тго возвращает фокус в него
       * @param {jQuery} event Объект события
       * @return {Boolean}
       */
      _checkEditAtPlace: function(event){
         if(this._editAtPlaceField){
            if(!this._editAtPlaceField.validate()){
               this._editAtPlaceField.setActive(true);
               event.stopImmediatePropagation();
               return true;
            }
         }
         if(this._editAtPlaceValidationErrors){
            return true;
         }
         return false;
      },
      /**
       * Обработка клика на элементе
       * @param {jQuery} row Объект строки
       * @param {String} rowkey Идентификатор записи
       * @param {$ws.proto.Record} record Запись
       */
      _processElementClick: function(row, rowkey, record){
         this._notifySetCursor(row, record);
      },
      /**
       * Обработчик создания записи
       */
      _insertRecordItem: function(){
         var parent = this._currentRootId;
         if(this._options.display.viewType === 'tree' && this.getActiveRecord() !== false)
           parent = this.getActiveRecord().get(this._hierColumnParentId);
         this._showRecordDialog(undefined, false, parent);
      },
      /**
       * Обработчик создания папки
       */
      _insertRecordFolder: function(){
         var parent = this._currentRootId;
         if(this._options.display.viewType === 'tree' && this.getActiveRecord() !== false)
           parent = this.getActiveRecord().get(this._hierColumnParentId);
         this._showRecordDialog(undefined, true, parent);
      },
      /**
       * Обработчик для дерева создания дочерней записи
       */
      _insertChildRecordItem: function(){
         if(this._options.display.viewType === 'tree' && this.getActiveRecord() !== false && this.getActiveRecord().get(this._hierColumnIsLeaf) === true){
            this._showRecordDialog(undefined, false, this.getActiveRecord().getKey());
         }
      },
      /**
       * Обработчик для дерева создания дочерней папки
       */
      _insertChildRecordFolder: function(){
         if(this._options.display.viewType === 'tree' && this.getActiveRecord() !== false && this.getActiveRecord().get(this._hierColumnIsLeaf) === true){
            this._showRecordDialog(undefined, true, this.getActiveRecord().getKey());
         }
      },
      /**
       * Обработчик редактирования записи
       */
      _editRecord: function(){
         this._elementActivated(this.getActiveElement(), true);
      },
      _getHandlersForDeleteRecordDialog: function(deleteOneRecord, records, parent) {
         var
               hdl = {},
               self = this;
         hdl["onConfirm"] = function(event, result){
            if(result){
               var
                   l = records.length,
                   reload = self._options.display.reload,
                   dMultiResult = new $ws.proto.ParallelDeferred(),
                   errors = {},
                   undeletedRecords = [],
                   parents = [], parentsMap = {},
                   hasDeletedRecords = false,
                   deletedRecords = [];
               self._options.display.reload = false;
               for(var i=0; i<l; i++){
                  if(self._notify('onBeforeDelete', records[i]) !== false){
                     hasDeletedRecords = true;
                     if(self.isHierarchyMode())
                        parentsMap[records[i].get(self._hierColumnParentId)] = true;
                     (function (deletedRecordKey) {
                        dMultiResult.push(records[i].destroy().addCallback(function(res){
                           deletedRecords.push(deletedRecordKey);
                           return res;
                        }).addErrback(function (error) {
                           if(errors[error.message] === undefined)
                              errors[error.message] = 1;
                           else
                              errors[error.message]++;
                           undeletedRecords.push(deletedRecordKey);
                           error.processed = true;
                           return error;
                        }));
                     })(records[i].getKey());
                  }
                  else
                     undeletedRecords.push(records[i].getKey());
               }
               dMultiResult.done();
               dMultiResult.getResult().addBoth(function(){
                  self._options.display.reload = reload;
                  if(!Object.isEmpty(errors)){
                     var errorMessage = "В процессе удаления возникли ошибки: \n ";
                     for(var message in errors){
                        errorMessage += message + ( records.length === 1 ? "" : " (" + errors[message] + ")\n" );
                     }
                     $ws.core.alert(errorMessage,"error");
                  }
                  if(undeletedRecords.length !== 0)
                     self._activeElement = self._body.find('[rowkey="' + undeletedRecords[0] + '"]');
                  else {
                     var lastSelectedRow = records[l - 1] ? self._body.find('[rowkey="' + records[l - 1].getKey() + '"]') : null;
                     if(records[l - 1] && lastSelectedRow.next().length !== 0)
                        self._activeElement = lastSelectedRow.next();
                     else{
                        var firstSelectedRow = self._body.find('[rowkey="' + records[0].getKey() + '"]');
                        self._activeElement = firstSelectedRow.prev();
                     }
                  }
                  if(hasDeletedRecords){
                     for(var i in parentsMap){
                        if(parentsMap.hasOwnProperty(i)){
                           parents.push(i);
                        }
                     }
                     self._onRecordDeleted({}, parents);
                     self._showEmptyDataBlock();
                  }
                  self.clearSelection(deletedRecords, true);
               });
            }
         };
         hdl['onAfterClose'] = function(){
            self._mouseMonitor.apply(self);
            var row = self.getActiveElement();
            if(row)
               row.focus();
         };
         return hdl;
      },
      /**
       * Обработчик удаления записи
       */
      _deleteRecords: function(deleteOneRecord, recordId){
         if(this._options.display.readOnly || this._options.allowDelete === false)
            return;
         if(/*this._turn === '' && */( !Object.isEmpty(this._selected) || this.getActiveRecord() !== false) || recordId !== undefined){
            var
                self = this,
                countRecords = !Object.isEmpty(this._selected) ? self.getSelection(true).length : 1,
                message = !deleteOneRecord && !Object.isEmpty(this._selected) ? ("Удалить " +
                    (countRecords == 1 ? " отмеченную запись" : " отмеченные записи") +
                    "?") : "Удалить текущую запись?",
                detail = !deleteOneRecord && !Object.isEmpty(this._selected) ? ((countRecords > 1 ? "отмечено " : "отмечена ")  + countRecords + " запис" + $ws.helpers.wordCaseByNumber(countRecords, 'ей', 'ь', 'и')) : "",
                parent = this._rootNode,
                record = false,
                records, oDSres, continuator;
            if(Object.isEmpty(this._selected) || deleteOneRecord === true){
               record = recordId === undefined ? this.getActiveRecord() : this._currentRecordSet.getRecordByPrimaryKey(recordId);
               if(this.isHierarchyMode())
                  parent = record.get(this._hierColumnParentId);
            }
            continuator = function() {
               $ws.core.setCursor(false);
               self._useKeyboard = true;
               $ws.core.attachInstance('SBIS3.CORE.DialogConfirm', {
                  resizable: false,
                  detail: detail,
                  message: message,
                  context: new $ws.proto.Context().setPrevious(self.getLinkedContext()),
                  opener: self,
                  handlers: self._getHandlersForDeleteRecordDialog(deleteOneRecord, records, parent)
               }).addBoth(function(val){
                  $ws.core.setCursor(true);
                  return val;
               });
            };
            records =  deleteOneRecord === true ? [record ? record : this.getActiveRecord()] : this.getSelection();

            /**
             * обработка кодов возврата:
             * -
             */
            oDSres = this._notify('onDeleteStart', records);
            if(typeof oDSres == 'string') { // строка - свое сообщение в диалоге, вся логика штатная
               message = oDSres;
               continuator();
            }
            else if(oDSres instanceof $ws.proto.Deferred) // Deferred - дождались success, пошли дальше
               oDSres.addCallback(continuator);
            else if(oDSres !== false) // false - отмена штатной логики, все свое
               continuator();         // все остальное - штатная логика без изменений.
         }
      },
      /**
       * Метод построения разворота
       * @param {Boolean} withFolders с папками или без
       * @param {Boolean} [noLoad] не загружать после установки параметров
       */
      _expandAll: function(withFolders, noLoad){
         if(this._options.display.viewType === 'hierarchy'){
            var filter = this.getQuery();
            this._expanded[this._currentRootId] = 2;
            filter[this._hierColumnParentId] = this._currentRootId;
            this._systemParams[this._hierColumnParentId] = this._currentRootId;
            filter["Разворот"] = "С разворотом";
            filter["usePages"] = '';
            this._systemParams["Разворот"] = "С разворотом";
            if(withFolders){
               this._turn = "BranchesAndLeaves";
               this._options.display.viewType = "tree";
               filter['ВидДерева'] = 'С узлами и листьями';
               this._systemParams['ВидДерева'] = 'С узлами и листьями';
            } else if(this._options.display.expand === 'onlyFolders'){
               this._turn = "OnlyFolders";
               filter['ВидДерева'] = 'Только узлы';
               this._systemParams['ВидДерева'] = 'Только узлы';
            } else{
               this._turn = "OnlyLeaves";
               filter['ВидДерева'] = 'Только листья';
               this._systemParams['ВидДерева'] = 'Только листья';
            }
            if(this._currentRecordSet){
               this._currentRecordSet.setUsePages('');
            }
            if(this._paging){
               this._paging.setEnabled(false);
            }
            if(!noLoad){
               this._runQuery(filter, true);
            }
         }
      },
      /**
       * Возвращает нормальное отображение браузера, без режима ctrl+b / ctrl+v
       * @param {Boolean} [noLoad] не загружать после установки параметров
       */
      _clearExpandAll: function(noLoad){
         var idprColumn = this._hierColumnParentId,
             filter = this.getQuery();
         this._turn = "";
         filter["Разворот"] = this._options.display.partiallyLoad ? "Без разворота" : "С разворотом";
         this._systemParams["Разворот"] = filter["Разворот"];
         filter['ВидДерева'] = 'С узлами и листьями';
         this._systemParams['ВидДерева'] = 'С узлами и листьями';
         var ar = this.getActiveRecord();
         if(ar)
            this._currentRootId = ar.get(idprColumn);

         this._options.display.viewType = 'hierarchy';
         filter[this._hierColumnParentId] = this._options.display.partiallyLoad ? this._currentRootId : this._rootNode;
         this._systemParams[this._hierColumnParentId] = filter[this._hierColumnParentId];
         this._currentRecordSet.setUsePages(this._options.display.usePaging);
         if(this._paging){
            this._paging.setEnabled(true);
         }
         if(this._pathSelector){
            this._pathSelector.setEnabled(true);
         }
         if(!noLoad){
            this._runQuery(filter, true);
         }
      },
      /**
       * Возвращает предков элемента
       * @param {String} rowkey Идентификатор записи
       * @return {Array} Массив предков
       */
      getItemParents: function(rowkey){
         return this._getItemParents(rowkey);
      },
      /**
       * Возвращает предков элемента
       * @param {String} rowkey Идентификатор записи
       * @return {Array} Массив предков
       * @protected
       */
      _getItemParents: function(rowkey){
         var result = [rowkey],
            record;
         while(rowkey && rowkey != this._rootNode && this._currentRecordSet.contains(rowkey)){
            record = this._currentRecordSet.getRecordByPrimaryKey(rowkey);
            rowkey = record.get(this._hierColumnParentId);
            result.push(rowkey);
         }
         return result;
      },
      /**
       * Очищает всю установленную сортировку и перезагружает данные
       */
      clearSorting: function(){
         if(!this._sortingStack.length){
            return;
         }
         this._head.find('.ws-browser-sortable').removeClass('asc').removeClass('desc').addClass('none');
         this._sortingStack = [];
         this._currentRecordSet.setPage(0, true);
         this._currentRecordSet.setSorting([], this.getQuery(), this._options.display.viewType === 'hierarchy');
      },
      /**
       * Устанавливает текущую сортировку
       * @param {Array} sorting Массив, где каждый элемент имеет вид: {field: '...', order: 'asc' / 'desc'}. Чем раньше встретится элемент с полем field, тем важнее field будет для сортировки
       * @param {Boolean} [noLoad] Если указано, то браузер изменится только внешне, сортировка будет использована  при следующей загрузке
       */
      setSorting: function(sorting, noLoad){
         this._head.find('.ws-browser-sortable').removeClass('asc desc').addClass('none');
         this._sortingStack = [];
         var values = [];
         for(var i = 0; i < sorting.length; ++i){
            var field = sorting[i].field,
               order = sorting[i].order;
            this._sortingStack.push({'field': field, 'type': order === 'asc' ? 0 : 1});
            values.push([field, order === 'desc']);
            if(this._sortingMarkers[field]){
               this._sortingMarkers[field].removeClass('none').addClass(order);
            }
         }
         if(this._currentRecordSet){
            this._currentRecordSet.setSorting(values, this.getQuery(), this._options.display.viewType === 'hierarchy', noLoad);
         }
      },
      /**
       * перемещает выбранные записи в указанный раздел
       * @param {Number} parent идентификтор элемента, в который необходимо переместить записи
       * @param {Array} parents массив узлов, которые нужно открыть после перемещения
       * @param {Array} [moveToParents] массив записей - родителей записи, куда нужно перенести выбранные записи
       */
      move: function(parent, parents, moveToParents){
         if(!this._options.allowMove){
            return;
         }
         if(parent === 'null'){
            parent = null;
         }
         var records = this.getSelection(),
             self = this,
             parentRecord,
             toParents = moveToParents || this._getItemParents(parent),
             toMap = {};
         parents = parents || [];

         parents.push(parent);
         for(var i = 0, len = toParents.length; i < len; ++i){
            toMap[toParents[i]] = true;
         }
         for(i = 0, len = records.length; i < len; ++i){
            var key = records[i].getKey();
            if(key == parent || (key in toMap)){
               $ws.core.alert("Вы не можете переместить запись саму в себя!");
               return;
            }
            if(self._options.display.viewType === 'tree' && self._turn === '')
               parents.push(records[i].get(self._hierColumnParentId));
         }

         if(self._options.display.viewType === 'tree' && self._turn === ''){
            if(!this._expanded[parent]){
               this._expanded[parent] = true;
               parents.push(parent);
            }
         }

         var moveRecords = function(){
            var dMultiResult = new $ws.proto.ParallelDeferred(),
                errors = [],
                afterRender = function(){
                   self.unsubscribe('onAfterRender', afterRender);
                   self._hovered = records[0].getKey();
                   self.showBranch(parent);
                };
            $ws.core.setCursor(false);
            for(var i = 0, l = records.length; i < l; i++){
               records[i].set(self._hierColumnParentId, parent);
               dMultiResult.push(records[i].update().addErrback(function(error){
                  errors.push(error.message);
               }));
            }
            dMultiResult.done();
            dMultiResult.getResult().addBoth(function(){
               if(errors.length !== 0)
                  $ws.core.alert("В процессе перемещения возникли ошибки: \n " + errors.join(" ;\n "));
               self._isUpdatingRecords = false;
               if(!self._expanded[parent] && (parent != self._rootNode || self._options.display.showRoot)){
                  self._activeElement = undefined;
                  self._hovered = parent;
               }
               self.removeSelection();
               if(self._options.mode === 'navigationMode'){
                  self._closeOtherBranches(parent);
               }
               if(self._options.display.viewType === 'tree'){
                  if(self._turn !== '')
                     self._currentRootId = parent;
               } else
                  self.subscribe('onAfterRender', afterRender);
               self._onRecordUpdated(self._options.display.viewType === 'tree' && self._turn === '', parents);
               $ws.core.setCursor(true);
            });
         },
         checkParentForMove = function(){
            if(parentRecord.get(self._hierColumnIsLeaf) !== true){
               $ws.core.alert("Вы не можете перемещать в лист! Выберите другую запись для перемещения!");
   /*
               $ws.core.setCursor(false);
               $ws.core.attachInstance('SBIS3.CORE.DialogConfirm', {
                  resizable: false,
                  message: "Данная операция приведет к тому, что выбранный лист будет превращен в узел. Продолжить перемещение?",
                  handlers: {
                     onConfirm: function(event, result){
                        if(result === true){
                           parentRecord.set(self._hierColumnIsLeaf, true);
                           parentRecord.update().addCallback(function(){
                              moveRecords();
                           });
                        }
                     }
                  }
               }).addBoth(function(val){
                  $ws.core.setCursor(true);
                  return val;
               });
   */
            } else {
               moveRecords();
            }
         };

         self._isUpdatingRecords = true;
         if(parent === self._rootNode){
            moveRecords();
         } else {
            try{
               parentRecord = this._currentRecordSet.getRecordByPrimaryKey(parent);
               checkParentForMove();
            } catch(e){

               this._currentRecordSet.readRecord(parent).addCallback(function(record){
                  parentRecord = record;
                  checkParentForMove();
               });
            }
         }
      },
      /**
       * выводит если нужно список отчетов или отправляет отчет на печать
       * @param {Event} e событие
       * @param {Boolean} isReportsForList печатать отчеты для реестра или для записи
       * @param {$ws.proto.Record}  [record] Запись
       * @param {Object}            [row]    Строка из дом-дерева
       */
      _showReportsList: function(e, isReportsForList, record, row){
         var data = null, self = this, reports;
         if(!isReportsForList)
            data = record ? record : (Object.isEmpty(this._selected) ? this.getActiveRecord() : this.getSelection());
         reports = this._notify('onBeforeShowPrintReports', this.getReports(isReportsForList), data, isReportsForList);
         if(reports !== false){
            var reportsList;
            if(reports instanceof Array){
               reportsList = reports;
               if(reports.length == 1)
                  reports = reports[0];
            } else{
               reportsList = typeof(reports) === 'string' ? [] : "";
            }
            this._createPrintMenu(reportsList, isReportsForList).addCallback(function(instance){
               if(self._printMenu === null){
                  if(!reports || reports === true){ // если не можем рассматривать то, что вернули из события как список отчетов, ищем среди описанных
                     var list = self._options[isReportsForList ? "reportsForList" : "reports"];
                     for(var report in list){ // если здесь найдется элемент, то он один
                        if(list.hasOwnProperty(report)){
                           reports = report;
                        }
                     }
                  }
                  reports = reports === true ? undefined : reports;
                  self.printReport(reports, isReportsForList);
               } else {
                  if(!e.clientX || !e.clientY){
                     var tr = row ? row : (self._activeElement ? self._activeElement : self._body.find('tr').eq(0)),
                         point = tr.offset();
                     e.clientX = point.left + 9;
                     e.clientY = point.top + tr.height() + 9;
                  } else {
                     e.clientY += 16;
                  }
                  try{
                     self._printMenu.show(e);
                     self._printMenuIsShow = true;
                  } catch(error){
                     self._printMenu.subscribe('onReady', function(){
                        self._printMenu.show(e);
                        self._printMenuIsShow = true;
                     });
                  }
               }
               return instance;
            });
         }
      },
      /**
       * выводит историю изменений записи с указанным  идентификатором
       * @param {Number} key ключ записи, для которой будет показана история
       * @param {Object} [params] чвэш-мэп дополнительных параметров для получения истории
       */
      showHistory: function(key, params){
         if(this._options.display.showHistory === true){
            $ws.core.setCursor(false);
            this._useKeyboard = true;
            var browserSource = $ws.core.merge({}, this._initialSource),
                dataSource = {
                   readerType: browserSource.readerType,
                   filterParams: params ? params : {},
                   hierarchyField: "",
                   readerParams: browserSource.readerParams,
                   firstRequest: true,
                   usePages: 'full',
                   rowsPerPage: 100
                },
                self = this;
            dataSource.filterParams["ИдО"] = key;
            dataSource.readerParams["queryName"] = "История";
            $ws.core.attachInstance('Source:RecordSet', dataSource).addCallback(function(instance){
               $ws.core.attachInstance('SBIS3.CORE.Dialog', {
                  template: 'historyDialog',
                  handlers: {
                     onReady: function(){
                        this.getChildControlByName('ws-browser-history').subscribe('onReady', function(){
                           var self = this;
                           if(instance.getRecordCount() === 0 )
                              instance.subscribe('onAfterLoad', function(){
                                 self.setData(instance);
                              });
                           else
                              this.setData(instance);
                        });
                     },
                     onAfterShow: function(){
                        $ws.core.setCursor(true);
                     },
                     onAfterClose:$.proxy(self._mouseMonitor, self)
                  }
               });
            }).addErrback(function(){
               $ws.core.setCursor(true);
            });
         }
      },
      /**
       * копирует активную запись
       * @param {$ws.proto.Record} rec Запись, которую нужно копировать
       */
      copy: function(rec){
         if(this._options.useCopyRecords && !this._options.display.readOnly){
            var record = rec ? rec : this.getActiveRecord(),
                flBranch = null,
                parentId = null;
            if(record){
               if(this.isHierarchyMode()){
                   flBranch = record.get(this._hierColumnIsLeaf);
                   parentId = record.get(this._hierColumnParentId);
               }
               this._showRecordDialog(record.getKey(), flBranch, parentId, true);
            }
         }
      },
      /**
       * удерживается ли зажатым Ctrl
       * @param {Object} e переданное событие
       * @return {Boolean}
       */
      _isCtrl: function(e){
         return e.ctrlKey && !e.altKey && !e.shiftKey;
      },
      /**
       * к событию не применяются модификаторы Ctrl, Alt, Shift
       * @param {Object} e переданное событие
       * @return {Boolean}
       */
      _isNotModified: function(e){
         return !e.ctrlKey && !e.altKey && !e.shiftKey;
      },
      /**
       * Объединяет выделенные записи с текущей активной записью
       */
      mergeSelectedRecords: function(){
         if(this._options.useMergeRecords && !this._options.display.readOnly && !Object.isEmpty(this._selected)){
            var key = this.getActiveRecord().getKey(),
                mergingRecordNotInRecords = true,
                columnsDefinition = this._columnMap && this._columnMap.length !== 0 ? this._columnMap : this._currentRecordSet.getColumns(),
                selectedRows = this.getSelection(),
                self = this;
            for(var i = 0, l = selectedRows.length; i < l; i++){
               if(selectedRows[i].getKey() === key)
                  mergingRecordNotInRecords = false;
            }
            if(mergingRecordNotInRecords){
               this._useKeyboard = true;
               $ws.core.setCursor(false);
               $ws.core.attachInstance('Source:RecordSetStatic', {
                  defaultColumns : columnsDefinition,
                  usePages : 'full',
                  rowsPerPage : 100,
                  records : selectedRows
               }).addCallback(function(instance){
                  $ws.core.attachInstance('SBIS3.CORE.Dialog', {
                     template: 'mergeRecordsDialog',
                     context: new $ws.proto.Context().setPrevious(self.getLinkedContext()),
                     handlers: {
                        onReady: function(){
                           var mergeBrowser = this.getChildControlByName('ws-browser-merge');
                           mergeBrowser.recordSetReady().addCallback(function(){
                              mergeBrowser.setData(instance);
                              mergeBrowser.setColumns(self.getColumns());
                           });
                           var mainRowBrowser = this.getChildControlByName('ws-browser-merge-mainRow');
                           $ws.core.attachInstance('Source:RecordSetStatic', {
                              defaultColumns : columnsDefinition,
                              records : [self.getActiveRecord()]
                           }).addCallback(function(instanceMerge){
                              mainRowBrowser.recordSetReady().addCallback(function(){
                                 mainRowBrowser.setData(instanceMerge);
                                 mainRowBrowser.setColumns(self.getColumns());
                              });
                           });
                        },
                        onAfterClose: function(){
                           self.removeSelection();
                           self._mouseMonitor.apply(self);
                           self.reload();
                        },
                        onAfterShow: function(){
                           $ws.core.setCursor(true);
                        }
                     }
                  });
               });
            } else {
               $ws.core.alert('Запись, с которой будет проведено объединение не должна входить в выбранные записи.');
            }
         }
      },
      /**
       * Перемещает выбранные записи в указанную
       * @param {$ws.proto.Record} toRecord Запись, в которую нужно перенести
       * @private
       */
      _moveRecords: function(toRecord){
         var selectedRecords = this.getSelection(),
            replacedRecordsInCurrentBranch = true,
            self = this;
         if(selectedRecords.length > 0 && this._notify('onDragStart', selectedRecords) !== false){
            if(self._options.display.viewType === 'hierarchy'){ // в дереве всегда спрашиваем куда переместить
               var parentOfFirstRecord = selectedRecords[0].get(this._hierColumnParentId);
               for(var j = 1, k = selectedRecords.length; j < k; j++){ // проверяем все ли записи лежат в одном разделе
                  if(selectedRecords[j].get(this._hierColumnParentId) !== parentOfFirstRecord)
                     replacedRecordsInCurrentBranch = false;
               }
               if(replacedRecordsInCurrentBranch && !(toRecord && (parentOfFirstRecord === toRecord.get(this._hierColumnParentId) || parentOfFirstRecord === toRecord.getKey() ||
                     parentOfFirstRecord === self._currentRootId)))
                  replacedRecordsInCurrentBranch = false;
            }
            if(replacedRecordsInCurrentBranch){
               $ws.core.setCursor(false);
               this._useKeyboard = true;
               var dataSource = $ws.core.merge({}, this._initialSource);
               dataSource.firstRequest = false;
               dataSource.usePages = dataSource.filterParams.usePages = '';
               dataSource.handlers = {};
               if(this._options.useCurrentFilterOnMove)
                  dataSource.filterParams = this.getQuery();
               else
                  dataSource.filterParams = $ws.core.merge({}, this._initialFilter);
               dataSource.filterParams["ВидДерева"] = "Только узлы";
               dataSource.filterParams[this._hierColumnParentId] = self._rootNode;
               $ws.core.attachInstance('Source:RecordSet', dataSource).addCallback(function(instance){
                  $ws.core.attachInstance('SBIS3.CORE.Dialog', {
                     template: 'replaceRecordsDialog',
                     handlers: {
                        onReady: function(){
                           var replacingBrowser = this.getChildControlByName('ws-browser-replace'),
                              replacingWindow = this,
                              moveTo = function(to, parents){
                                 var moveToParents = replacingBrowser.getItemParents(to);
                                 self.move(to, parents, moveToParents);
                              };
                           replacingBrowser.subscribe('onReady', function(){
                              replacingBrowser.setData(instance);
                              replacingBrowser.setHierarchyField(self._hierColumnParentId);
                              replacingBrowser.setRootNode(self._rootNode);
                           });
                           replacingBrowser.subscribe('onRowDoubleClick', function(event, row, record){
                              var parent = record ? record.get(self._hierColumnParentId) : self._rootNode,
                                 parents = [];
                              while( (parent + "") !== (self._rootNode + "") && self._options.display.viewType !== 'hierarchy'){
                                 if(!self._expanded[parent]){
                                    self._expanded[parent] = true;
                                    parents.push(parent);
                                 }
                                 parent = this.getRecordSet().getRecordByPrimaryKey(parent).get(self._hierColumnParentId);
                              }
                              if(self._notify('onDragStop', selectedRecords, record ? record : self._rootNode, true) !== false)
                                 moveTo(record ? record.getKey() : self._rootNode, parents);
                              replacingWindow.close();
                           });
                           replacingBrowser.subscribe('onSelectionConfirm', function(event, records){
                              var parent = records.length === 0 ? self._rootNode : records[0].get(self._hierColumnParentId),
                                 parents = [];
                              while( (parent + "") !== (self._rootNode + "") && self._options.display.viewType !== 'hierarchy'){
                                 if(!self._expanded[parent]){
                                    self._expanded[parent] = true;
                                    parents.push(parent);
                                 }
                                 parent = this.getRecordSet().getRecordByPrimaryKey(parent).get(self._hierColumnParentId);
                              }
                              if(self._notify('onDragStop', selectedRecords, records.length === 0 ? self._rootNode : records[0], true) !== false)
                                 self.move(records.length === 0 ? self._rootNode : records[0].getKey(), parents);
                              //self.move(this.getActiveRecord() ? this.getActiveRecord().getKey() : self._rootNode);
                              replacingWindow.close();
                           });
                           this.getChildControlByName('replace').subscribe('onActivated', function(){
                              var parent = replacingBrowser.getActiveRecord() ? replacingBrowser.getActiveRecord().get(self._hierColumnParentId) : self._rootNode,
                                 parents = [],
                                 newParentRecord;
                              while( (parent + "") !== (self._rootNode + "") && self._options.display.viewType !== 'hierarchy'){
                                 if(!self._expanded[parent]){
                                    self._expanded[parent] = true;
                                    parents.push(parent);
                                 }
                                 parent = replacingBrowser.getRecordSet().getRecordByPrimaryKey(parent).get(self._hierColumnParentId);
                              }
                              newParentRecord = replacingBrowser.getActiveRecord();
                              if(self._notify('onDragStop', selectedRecords, newParentRecord ? newParentRecord : self._rootNode, true) !== false)
                                 moveTo(newParentRecord ? newParentRecord.getKey() : self._rootNode, parents);
                              replacingWindow.close();
                           });
                        },
                        onAfterShow: function(){
                           $ws.core.setCursor(true);
                        },
                        onAfterClose:$.proxy(self._mouseMonitor, self)
                     }
                  });
               });
            } else {
               this._confirmMoveRecords(toRecord);
            }
         }
      },
      /**
       * Показывает диалог с подтверждением
       * @param toRecord
       * @private
       */
      _confirmMoveRecords: function(toRecord){
         var self = this,
            selectedRecords = this.getSelection();
         if(this._notify('onDragStart', selectedRecords) !== false){
            $ws.core.setCursor(false);
            this._useKeyboard = true;
            $ws.core.attachInstance('SBIS3.CORE.DialogConfirm', {
               resizable: false,
               message: "Переместить выбранные записи ( " + selectedRecords.length + " ) в текущий раздел?",
               handlers: {
                  onConfirm: function(event, result){
                     if(result === true){
                        var parentRecord = self._currentRootId;
                        if(toRecord){
                           if(toRecord.get(self._hierColumnIsLeaf))
                              parentRecord = toRecord;
                           else{
                              parentRecord = toRecord.get(self._hierColumnParentId);
                              parentRecord = parentRecord === self._rootNode ? parentRecord : self._currentRecordSet.getRecordByPrimaryKey(parentRecord);
                           }
                        }
                        if(self._notify('onDragStop', selectedRecords, parentRecord, true) !== false){
                           var id = parentRecord instanceof $ws.proto.Record ? parentRecord.getKey() : parentRecord;
                           self.move(parentRecord === self._rootNode ? self._rootNode : id);
                        }
                        self._mouseMonitor.apply(self);
                        self.removeSelection();
                     }
                  }
               }
            }).addBoth(function(val){
               $ws.core.setCursor(true);
               return val;
            });
         }
      },
      _mouseMonitor: function(){
         var self = this,
             waitMouseMove = function(){
                self._useKeyboard = false;
                $('[rowkey]', self._body.parent()[0]).die('mousemove', waitMouseMove);
             };
         $('[rowkey]', self._body.parent()[0]).live('mousemove', waitMouseMove);
      },
      /**
       * Обрабатывает нажатия клавиш
       * @param {Object} e переданное событие
       * @return {Boolean}
       */
      _keyboardHover: function(e){
         var idprColumn = this._hierColumnParentId,
             res = false,
             self = this,
             needShowPrintMenu = true;
         if(!this._currentRecordSet || !this._currentRecordSet.isLoaded()){
            return res;
         }
         if(this._printMenuIsShow){
            this._printMenu.show(e);
            this._createPrintMenu([]);
            this._printMenuIsShow = false;
            needShowPrintMenu = e.which !== $ws._const.key.f4 && !(e.ctrlKey && e.which === $ws._const.key.p);
         }
         if(this.isActive()){
            var activeRow = this.getActiveElement(),
                nextAll = activeRow ? activeRow.next(".ws-visible:first") : [],
                prevAll = activeRow ? activeRow.prev(".ws-visible:first") : [],
                next = nextAll.length > 0 ? nextAll : null,
                prev = prevAll.length > 0 ? prevAll : null;
            if(e.ctrlKey && e.altKey && e.shiftKey && e.which === $ws._const.key.o){
               this.mergeSelectedRecords();
            }
            else if(e.ctrlKey && e.which === $ws._const.key.space){
               if(!this._minimized)
                  this.showSelection(true);
               else
                  this.showSelection(false);
            }
            else if(!e.ctrlKey && !e.altKey && e.shiftKey && e.which === $ws._const.key.f5){
               this.copy();
            } else if(this._isNotModified(e) && ( e.which === $ws._const.key.f5 || e.which === $ws._const.key.pageUp || e.which === $ws._const.key.pageDown)){
               res = true;
            }
            else if(this._isCtrl(e) && e.which === $ws._const.key.n){
               this.reload();
            }
            else if(this._isCtrl(e) && e.which === $ws._const.key.h){
               this.showHistory(this.getActiveRecord().getKey());
            }
            else if(this._isCtrl(e) && e.which === $ws._const.key.m && self.isHierarchyMode() && !this._options.display.readOnly && this._options.allowMove){
               this._moveRecords(this.getActiveRecord());
            }
            else if(!e.altKey && !e.shiftKey && ( !e.ctrlKey && e.which === $ws._const.key.f4 || (e.ctrlKey && e.which === $ws._const.key.p) )){
               if(needShowPrintMenu && (!Object.isEmpty(this._options.reports) && e.which === $ws._const.key.f4 || e.which !== $ws._const.key.f4)){
                  this._showReportsList(e, e.which !== $ws._const.key.f4);
               }
            }
            else if((this._isCtrl(e) && (e.which === $ws._const.key.b || e.which === $ws._const.key.v)) && this._turn !== ""){
               this.applyTurn(false);
            }
            else if(this._isNotModified(e) && e.which === $ws._const.key.minus){
               this.removeSelection();
            }
            else if(this._isCtrl(e) && (e.which === $ws._const.key.b || e.which === $ws._const.key.v)){
               this.applyTurn(e.which === $ws._const.key.b);
            }
            else if(this._isCtrl(e) && e.which === $ws._const.key.q){
               if(this._options.filterDialogTemplate)
                  this.createFiltersDialog();
            }
            else if(e.which === $ws._const.key.enter && (this._selectMode || e.ctrlKey) && !e.altKey && !e.shiftKey){
               this.confirmSelection();
            }
            else if(this._isCtrl(e) && (e.which === $ws._const.key.pageDown || e.which === $ws._const.key.pageUp)){
               this.setActiveElement(this._body.find(".ws-visible:" + ((e.which === $ws._const.key.pageDown) ? 'last' : 'first')));
               e.stopPropagation();
            }
            else if(this._isNotModified(e) && (e.which === $ws._const.key.down || e.which === $ws._const.key.up)){
               if(this._options.useHoverRowAsActive && !this._useKeyboard){
                  this._useKeyboard = true;
                  this._mouseMonitor();
               }
               var active = (e.which === $ws._const.key.down) ? next : prev;
               if(active){
                  this.setActiveElement(active);
                  if(this._options.useHoverRowAsActive && this._options.display.rowOptions)
                     self._showRowOptions.apply(self, [active[0]]);
               }
            }
            else if(this._isNotModified(e) && e.which === $ws._const.key.space){
               if(this._options.useSelection !== false && !this._activeElement.hasClass('ws-browser-add-at-place-link-row')){
                  if(!(this._options.multiSelect === false && !Object.isEmpty(this._selected) ) || this._activeElement.hasClass('ws-browser-selected'))
                     this._selectActiveElement();
                  this.setActiveElement(next);
               }
            }
            else if( this._isNotModified(e) &&
                  ((e.which === $ws._const.key.enter) ||
                  (e.which === $ws._const.key.backspace && this._options.display.viewType === 'hierarchy') ||
                  e.which === $ws._const.key.f3)){
               if(this._options.display.viewType === 'hierarchy' && e.which === $ws._const.key.backspace){
                  if(this._turn !== '' || this._currentRootId === this._rootNode)
                     return true;
                  if(activeRow &&(activeRow.attr('rowkey') === 'null' || !activeRow.attr('rowkey'))){
                     return false;
                  }
                  var tempId = this._currentRootId,
                      way = this._currentRecordSet.getWay();
                  if(this._currentRecordSet.contains(tempId))
                     tempId = this._currentRecordSet.getRecordByPrimaryKey(tempId).get(idprColumn);
                  else if(way && way.contains(tempId))
                     tempId = way.getRecordByPrimaryKey(tempId).get(idprColumn);
                  else
                     throw new Error('Browser:_keyboardHover backspace error');

                  if(this._pathSelector && !this._pathSelector.isEmpty()){
                     this._pathSelector.pop();
                  }
                  this._hovered = this._currentRootId;
                  this.showBranch(tempId);
                  this._updatePager();
               }
               else{
                  if(!activeRow){
                     return false;
                  }
                  if(activeRow.hasClass("ws-browser-folder") && this._options.display.viewType === 'hierarchy'
                        && e.which !== $ws._const.key.f3 && this._turn === ''){
                     this._currentRootId =  activeRow.attr("rowkey");
                     this._currentRootId = this._currentRootId === "null" ? null : this._currentRootId;
                     var rowkey = activeRow.attr("rowkey") === "null" ? null : activeRow.attr("rowkey");
                     if(this._pathSelector){
                        this._pathSelector.append({id: rowkey, title: this.getActiveRecord().get(this._options.display.titleColumn)});
                     }
                     this._systemParams[this._hierColumnParentId] = rowkey;
                     if(this._options.display.partiallyLoad){
                        this._systemParams[this._hierColumnParentId] = rowkey;
                        this._currentRecordSet.loadNode(rowkey);
                     }
                     else
                        this._folderOpen(activeRow);
                  }
                  else if(activeRow.length > 0)
                     this._elementActivated(activeRow, true);
               }
            } else if(this._isNotModified(e) && e.which === $ws._const.key.esc){
               res = true;
            } else{
               if(!this._options.display.readOnly && !e.shiftKey && !e.altKey){
                  if(e.which === $ws._const.key.del && !e.ctrlKey)
                     this._deleteRecords(false);
                  else if(e.which === $ws._const.key.insert){
                     if(e.ctrlKey || this._options.display.viewMode !== 'foldersTree'){
                        var editFunction = this._actions[e.ctrlKey ? "addFolder" : "addItem"];
                        if(editFunction)
                           editFunction(this.getActiveElement(), false);
                     }
                     //this._showRecordDialog(undefined, e.ctrlKey, this._currentRootId, false, false);
                  }
               }
            }
         } else {
            res = true;
         }
         return res;
      },
      /**
       * Вычитывает или создаёт запись с указанными параметрами
       * @param {String|undefined} recordId Идентфикатор записи. Если undefined - создаём запись
       * @param {String} parentId Идентификатор родителя
       * @param {Boolean} isBranch Для создания - папки ли
       * @param {Boolean} [isCopy] Создаём ли копию записи
       * @return {$ws.proto.Deferred} Деферред готовности записи, он передаёт первым параметром запись
       */
      _readRecord: function(recordId, parentId, isBranch, isCopy){
         var self = this;
         if(recordId === undefined){
            var filter = $ws.core.merge({}, self.getQuery());
            if(self.isHierarchyMode()){
               filter[self._hierColumnParentId] = {
                  'hierarchy': [
                     parentId,   // Превращение иерархии в массив идет на уровне сериализации
                     (isBranch ? true : null)
                  ]
               };
            }
            var newRecord = self._notify('onBeforeCreate', parentId, isBranch ? true : null, filter);
            if(newRecord instanceof $ws.proto.Deferred){
               var waitRecord = new $ws.proto.Deferred();
               newRecord.addCallbacks(function(result){
                  if(result instanceof $ws.proto.Record)
                     waitRecord.callback(result);
                  else {
                     if(result && Object.prototype.toString.call(result) == "[object Object]")
                        filter = $ws.core.merge(filter, result);
                     filter["ВызовИзБраузера"] = true;
                     self._currentRecordSet.createRecord(filter).addCallbacks(function(record){
                        waitRecord.callback(record);
                        return record;
                     }, function(error){
                        waitRecord.errback(error);
                        return error;
                     });
                  }
               }, function(error){
                  waitRecord.errback(error);
                  return error;
               });
               return waitRecord;
            } else if(newRecord instanceof $ws.proto.Record){
               return new $ws.proto.Deferred().callback(newRecord);
            } else if(newRecord === false)
               return new $ws.proto.Deferred().callback(newRecord);
              else {
               if(newRecord && Object.prototype.toString.call(newRecord) == "[object Object]")
                  filter = $ws.core.merge(filter, newRecord);
               filter["ВызовИзБраузера"] = true;
               return self._currentRecordSet.createRecord(filter);
            }
         }
         else if(isCopy === true) {
            return self._currentRecordSet.copyRecord(recordId);
         }
         else{
            var editableRecord = self._notify('onBeforeRead', recordId);
            if(editableRecord instanceof $ws.proto.Deferred)
               return editableRecord;
            else if(editableRecord instanceof $ws.proto.Record)
               return new $ws.proto.Deferred().callback(editableRecord);
            else if(editableRecord === false)
               return new $ws.proto.Deferred().callback(editableRecord);
            else
               return self._currentRecordSet.readRecord(recordId);
         }
      },
      /**
       * Отображает диалог редактирования записи. Сам
       * @param {Number} recordId Идентификатор запись
       * @param {Boolean} isBranch узел или лист
       * @param {Number} parentId идентификатор родителя отображаемой записи
       * @param {Boolean} [isCopy] копирование
       */
      _showRecordDialog: function(recordId, isBranch, parentId, isCopy) {
         if( ( this._options.display.readOnly && ( !recordId || isCopy ) ) ||
               ( recordId !== undefined && this._options.display.editAtThePlaceOnly ) ||
               (recordId === undefined && this._options.allowAdd === false))
            return;
         /*if(this._turn !== '' && !recordId)
            return;*/
         var flag,
             dialogTemplate,
             self = this,
             recordSaved = false,
             newRecordKey = null,
             editMode = isBranch ? this._options.editBranchMode : this._options.editMode,
             editTemplate = isBranch ? this._options.editBranchDialogTemplate : this._options.editDialogTemplate;
         isCopy = isCopy !== undefined ? isCopy : false;
         isBranch = isBranch !== undefined ? isBranch : false;
         parentId = parentId !== undefined ? parentId : null;
         dialogTemplate = isBranch ? self._options.editBranchDialogTemplate : self._options.editDialogTemplate;
         if(isCopy){
            var copyingRecord = self._currentRecordSet.getRecordByPrimaryKey(recordId),
                allowCopy = self._notify('onBeforeCopy', copyingRecord);
         }
         if(dialogTemplate !== '' && (!isCopy || isCopy && allowCopy !== false)){
            if(editMode == 'newWindow' || editMode == 'thisWindow'){
               if($ws.helpers.instanceOfModule(self, 'SBIS3.CORE.ListView') || editMode == 'newWindow' || recordId === undefined || isCopy
                     || self._options.useHoverRowAsActive === true)
                  self._openEditWindow(recordId, isBranch, parentId, isCopy);
               else
                  window.location.href = self._body.find('tr[rowkey="' + recordId + '"] .ws-browser-link:first').attr('href');
               return;
            }else if(editMode == 'thisPage'){
               var topParent = this.getTopParent();
               $ws.single.GlobalContext.setValue('editParams', this.generateEditPageURL(recordId, isBranch, parentId, isCopy));
               if($ws.helpers.instanceOfModule(topParent, 'SBIS3.CORE.AreaAbstract'))
                  $ws.core.bootup(editTemplate, undefined, undefined, topParent.getTemplateName());
               return;
            }
            this._useKeyboard = true;
            $ws.core.setCursor(false);
            // Поставим индикатор, чтобы два раза клик не обработался
            $ws.helpers.toggleIndicator(true);
            this._readRecord(recordId, parentId, isBranch, isCopy).addBoth(function(record){
               $ws.core.setCursor(true);
               return record;
            }).addCallback(function(record){
               if(record instanceof $ws.proto.Record){
                   // Убран фиксинг записи под родителя т.к. он теперь выполняется на бизнес-логике в методе Создать
                   flag = self._notify('onBefore' + (recordId === undefined ? 'Insert' : 'Update'), record);
                   if(typeof(flag) !== 'boolean'){
                      if(typeof(flag) == 'string')
                         dialogTemplate = flag;
                      var hdl = {
                         onAfterClose: function(){
                            self._mouseMonitor.apply(self);
                            var row = self.getActiveElement();
                            if(row)
                               row.focus();
                            if(!recordSaved && ( recordId === undefined || isCopy === true ) && record.getKey() !== null){
                               self._isFakeDelete = true;
                               record.destroy();
                            } else{
                               if(newRecordKey !== null){
                                  var newRecordParent = self.isHierarchyMode() ? record.get(self._hierColumnParentId) : self._currentRootId;
                                  var afterRenderSetActiveRow = function(){
                                     self.unsubscribe('onAfterRender', afterRenderSetActiveRow);
                                     var newActiveRow = self._body.find('[rowkey="' + newRecordKey + '"]');
                                     if(newActiveRow.length !== 0)
                                        self.setActiveElement(newActiveRow);
                                     if(self._options.display.viewType === 'tree' && !self._expanded[newRecordParent] && newRecordParent !== self._rootNode)
                                        self.showBranch(newRecordKey);
                                        //self.showBranch(record.get(self._hierColumnParentId));
                                  };
                                  if(self._body.find('[rowkey="' + newRecordKey + '"]').length !== 0)
                                     afterRenderSetActiveRow();
                                  else
                                     self.subscribe('onAfterRender', afterRenderSetActiveRow);
                               }
                            }
                         },
                         onRecordUpdate: function(event, Id) {
                            recordSaved = true;
                            if(recordId === undefined || isCopy === true)
                               newRecordKey = Id;
                         },
                         onReady: function(){
                            $ws.helpers.toggleIndicator(false);
                         }
                      };
                      hdl.onBeforeShowPrintReports = self.getEventHandlers('onBeforeShowPrintReports');
                      hdl.onPrepareReportData = self.getEventHandlers('onPrepareReportData');
                      hdl.onSelectReportTransform = self.getEventHandlers('onSelectReportTransform');
                      $ws.core.attachInstance('SBIS3.CORE.DialogRecord', {
                         opener: self,
                         template: dialogTemplate,
                         record: record,
                         context: new $ws.proto.Context().setPrevious(self.getLinkedContext()),
                         readOnly: self._options.display.readOnly,
                         isNewRecord: recordId === undefined,
                         reports: self._options.reports,
                         handlers: hdl
                      });
                   } else {
                      $ws.helpers.toggleIndicator(false);
                      if (recordId === undefined && flag === false && record.getKey() !== null){
                         /**
                          * удаляем запись только если
                          * - она была добавлена
                          * - и пользователь в onBeforeInsert вернул false (т.е. совсем отказался от вставки)
                          * - и запись была добавлена в базу
                          *
                          * Здесь можно было вернуть true, что значит "Диалог мне не надо, но запись пожалуйста оставьте"
                          */
                         self._isFakeDelete = true;
                         record.destroy();
                     }
                   }

               }
               else {
                  $ws.helpers.toggleIndicator(false);
               }
            }).addErrback(function(error){
               $ws.helpers.toggleIndicator(false);
               if(error && error.message){
                  $ws.core.alert(error.message, "error");
               }
               error.processed = true;
               return error;
            });
         }
      },
      /**
       * Открывает новую вкладку браузера, в которой будет редактироваться запись
       * @param {Number} recordId Идентификатор запись
       * @param {Boolean} isBranch узел или лист
       * @param {Number} parentId идентификатор родителя отображаемой записи
       * @param {Boolean} [isCopy] копирование
       * @param {Boolean} [url] адрес по которому будет редактироваться запись
       */
      openWindowRecord : function(recordId, isBranch, parentId, isCopy, url){
         this._openEditWindow(recordId, isBranch, parentId, isCopy, url);
      },
      _transmitParamsForPrintWindow :function(params, url){
         var printTemplate = "printWindow",
               pageURL = url ? url : $ws._const.appRoot + printTemplate + ".html",
               printWindow;
         pageURL += "?printParams=" + encodeURIComponent($ws.helpers.serializeURLData(params));
         printWindow = window.open(pageURL, "_blank");
         if(printWindow)
            printWindow.focus();
      },
      /**
       * Открывает новую вкладку браузера, в которой будет отображаться предварительный просмотр печати реестра/записи
       * @param {String} idReport название печатаемого отчета
       * @param {Boolean} isReportsForList признак того, что печатаем отчет для реестра
       * @param {String} transform файл xslt-трансформации
       * @param {String} currentRootId текущий корневой узел
       * @param {Boolean} [url] адрес по которому будет отображаться предварительный просмотр печати реестра/записи
       */
      _openPrintWindow: function(idReport, isReportsForList, transform, currentRootId, url){
         var self = this,
               params = {
                  id : this.getId(),
                  _events : {}
               },
               columnMap = [];
         if(idReport !== undefined)
            params["idR"] = idReport;
         if(isReportsForList !== undefined)
            params["list"] = isReportsForList;
         if(transform !== undefined)
            params["xsl"] = transform;
         if(currentRootId !== undefined)
            params["root"] = currentRootId;
         if(!(Object.isEmpty(this._options.reports))){
            params["reports"] = this._options.reports;
            params._events["onBeforeShowPrintReports"] = this._handlersPath("onBeforeShowPrintReports");
            params._events["onPrepareReportData"] = this._handlersPath("onPrepareReportData");
            params._events["onSelectReportTransform"] = this._handlersPath("onSelectReportTransform");
         }
         if(self._columnMap !== undefined){
            for(var i = 0, l = self._columnMap.length; i < l; i++){
               columnMap.push({
                  title : self._columnMap[i].title,
                  field : self._columnMap[i].field
               });
            }
            params["cols"] = columnMap;
         }
         if(self._options.titleColumn !== undefined)
            params["tCol"] = self._options.titleColumn;
         $ws.core.setCursor(true);
         if(!idReport){
            if(self._paging && self._turn === ""){
               self._selectPrintPages().addCallback(function(dataSource){
                  if(dataSource !== undefined)
                     params["dS"] = this._prepareRecordSetForPrint(dataSource);
                  self._transmitParamsForPrintWindow(params, url);
                  return dataSource;
               });
            }else{
               params["dS"] = this._prepareRecordSetForPrint(self._collectDataSource());
               self._transmitParamsForPrintWindow(params, url);
            }
         }else{
            var dataSource = self._getDataSource(),
                activeRecords;
            if(dataSource)
               params["dS"] = this._prepareRecordSetForPrint(dataSource);
            activeRecords = self.getSelection();
            params["keys"] = [];
            for(var j = 0, len = activeRecords.length; j < len; j++)
               params["keys"].push(activeRecords[j].getKey());
            self._transmitParamsForPrintWindow(params, url);
         }
      },
      _prepareRecordSetForPrint: function(recordSetConfig){
         var data = $ws.core.merge({}, recordSetConfig);
         delete data["handlers"];
         delete data["context"];
         if(data["readerType"] == "ReaderUnifiedSBIS")
            delete data["readerType"];
         if(data["firstRequest"] === true)
            delete data["firstRequest"];
         if(!this.isHierarchyMode())
            delete data["hierarchyField"];
         if(this._options.display.usePaging === ''){
            delete data["rowsPerPage"];
            delete data["usePages"];
         }
         if(data["readerParams"]["dbScheme"] === '')
            delete data["readerParams"]["dbScheme"];
         if(data["readerParams"]["queryName"] === 'Список')
            delete data["readerParams"]["queryName"];
         if(data["readerParams"]["readMethodName"] === 'Прочитать')
            delete data["readerParams"]["readMethodName"];
         if(data["readerParams"]["createMethodName"] === 'Создать')
            delete data["readerParams"]["createMethodName"];
         if(data["readerParams"]["updateMethodName"] === 'Записать')
            delete data["readerParams"]["updateMethodName"];
         if(data["readerParams"]["destroyMethodName"] === 'Удалить')
            delete data["readerParams"]["destroyMethodName"];
         return data;
      },
      generateEditPageURL: function(recordId, isBranch, parentId, isCopy, url){
         if(!this.isHierarchyMode() && this._options.editDialogTemplate ||
               (isBranch && this._options.editBranchDialogTemplate || !isBranch && this._options.editDialogTemplate)){
            var params = {
               id : this.getId(),
               hierMode : this.isHierarchyMode(),
               pk : recordId,
               copy : isCopy || false,
               readOnly : this._options.display.readOnly || false,
               obj : this._options.dataSource.readerParams.linkedObject,
               _events : {}
            },
            editTemplate,
            value,
            pageURL = url ? url : undefined,
            editDialogName = isBranch ? this._options.editBranchDialogTemplate : this._options.editDialogTemplate,
            editMode = isBranch ? this._options.editBranchMode : this._options.editMode;
            if (pageURL === undefined) {
               if ($ws._const.htmlNames[editDialogName]) {
                  var arr = $ws._const.htmlNames[editDialogName].split('/');
                  pageURL = arr[arr.length - 1];
               }
               else {
                  editTemplate = $ws._const.xmlContents[editDialogName].split('/');
                  pageURL = $ws._const.appRoot + editTemplate[editTemplate.length - 1] + ".html";
               }
            }
            if(editMode === 'thisWindow')
               params["history"] = true;
            value = this._options.dataSource.readerParams.format;
            if(value !== undefined)
               params["format"] = value;
            value = this._options.dataSource.readerType;
            if(value && value !== 'ReaderUnifiedSBIS')
               params["type"] = value;
            value = this._options.dataSource.readerParams.otherURL;
            if(value && value !== $ws._const.defaultServiceUrl)
               params["url"] = value;
            value = this._options.dataSource.readerParams.dbScheme;
            if(value)
               params["db"] = value;
            value = this._options.dataSource.readerParams.queryName;
            if(value && value !== 'Список')
               params["method"] = value;
            value = this._options.dataSource.readerParams.readMethodName;
            if(value && value !== 'Прочитать')
               params["readMethod"] = value;
            value = this._options.dataSource.readerParams.createMethodName;
            if(value && value !== 'Создать')
               params["createMethod"] = value;
            value = this._options.dataSource.readerParams.updateMethodName;
            if(value && value !== 'Записать')
               params["updateMethod"] = value;
            value = this._options.dataSource.readerParams.destroyMethodName;
            if(value && value !== 'Удалить')
               params["destroyMethod"] = value;

            if(this.isHierarchyMode()){
               params["pIdCol"] = this._hierColumnParentId;
               params["branch"] = isBranch;
               params["pId"] = parentId;
            }
            if(recordId === undefined){
               params["filter"] = this.getQuery();
               params._events["onBeforeCreate"] = this._handlersPath("onBeforeCreate");
               params._events["onBeforeInsert"] = this._handlersPath("onBeforeInsert");
            }
            params._events["onBeforeRead"] = this._handlersPath("onBeforeRead");
            params._events["onBeforeUpdate"] = this._handlersPath("onBeforeUpdate");
            if(!(Object.isEmpty(this._options.reports))){
               params["reports"] = this._options.reports;
               params._events["onBeforeShowPrintReports"] = this._handlersPath("onBeforeShowPrintReports");
               params._events["onPrepareReportData"] = this._handlersPath("onPrepareReportData");
               params._events["onSelectReportTransform"] = this._handlersPath("onSelectReportTransform");
            }
            params = $ws.helpers.serializeURLData(params);
            pageURL += "?editParams=" + encodeURIComponent(params);
            return editMode !== "thisPage" ? pageURL : params;
         } else
            return false;
      },
      /**
       * Открывает новую вкладку браузера, в которой будет редактироваться запись
       * @param {Number} recordId Идентификатор запись
       * @param {Boolean} isBranch узел или лист
       * @param {Number} parentId идентификатор родителя отображаемой записи
       * @param {Boolean} [isCopy] копирование
       * @param {Boolean} [url] адрес по которому будет редактироваться запись
       */
      _openEditWindow: function(recordId, isBranch, parentId, isCopy, url){
         var pageURL = this.generateEditPageURL(recordId, isBranch, parentId, isCopy, url),
             eventResult = this._notify('onBeforeOpenEditWindow', pageURL),
             editWindow,
             editMode = isBranch ? this._options.editBranchMode : this._options.editMode;
         if(typeof(eventResult) === 'string')
            pageURL = eventResult;
         if(eventResult !== false){
            if(editMode == 'thisWindow')
               window.location.href = pageURL;
            else{
               editWindow = window.open(pageURL, "_blank");
               if(editWindow)
                  editWindow.focus();
            }
         }
      },
      _handlersPath: function(eventName){
         var handlers = this.getEventHandlers(eventName),
             handlersPath = [];
         for(var i = 0, l = handlers.length; i < l; i++) {
            if(handlers[i].wsHandlerPath)
               handlersPath.push(handlers[i].wsHandlerPath);
         }
         return handlersPath;
      },
      /**
       * Открывает/закрывает папку с вложениями
       * @param {jQuery} activeRow текущая выделенная строка
       */
      _folderOpen: function(activeRow){ //TODO: onSizeChanged???
         return this._runInBatchUpdate('Browser._folderOpen', function() {
            var rowkey = activeRow.attr("rowkey"),
               record = null;

            if(rowkey !== this._rootNode && rowkey !== "null"){
               try{
                  record = this._currentRecordSet.getRecordByPrimaryKey(rowkey);
               }catch(e){
                  var wayToBranch = this._currentRecordSet.getWay();
                  record = wayToBranch.getRecordByPrimaryKey(rowkey);
               }
            }

            this._notifyBatchDelayed('onRowActivated', activeRow, record);
            this._currentRootId = (rowkey === "" || rowkey === "null") ? null : rowkey;

            this._drawBody();
            this._updatePager();
         });
      },
      /**
       * Скроллирует dataview к текущей записи если это нужно
       * @param {jQuery} activeRow текущая выделенная строка
       */
      scrollToActive: function(activeRow){//TODO А может быть листвью надо еще и по горизонтали скроллить?
         if(this._bodyHeight < this._bodyRealHeight && activeRow && "jquery" in activeRow){
            if(!this._wsBrowserContainer){
               this._wsBrowserContainer = this._data.parent();
            }
            var   top = this._wsBrowserContainer.position().top,
                  pHeight = this._wsBrowserContainer[0].clientHeight,
                  arHeight = activeRow.height(),
                  cur = this._wsBrowserContainer.scrollTop(),
                  to = cur + activeRow.position().top - top;

            if(to + arHeight > cur + pHeight)
               this._wsBrowserContainer.scrollTop(to + arHeight - pHeight);
            else if(to < cur)
               this._wsBrowserContainer.scrollTop(to);
         }
      },
      /**
       * вызывает перегрузку браузера без перегрузки рекордсета
       */
      refresh: function(){
         this._runInBatchUpdate('Browser.refresh', function() {
            if(this._dReady.isReady() && this._currentRecordSet){
               this._rowSelectionSetted = false;
               if(this._onBeforeRenderActions()){
                  //если из onBeforeRender вернули свои колонки
                  if(!this._columnMap || this._columnMap.length === 0)
                     this._drawHead();
                  this._drawBody();
               }
            }
         });
      },
      /**
       * Вызывает перегрузку браузера c перезапросом данных. Возвращает деферред - готовность новых данные (и отрисовка браузера тоже)
       * @returns {$ws.proto.Deferred}
       */
      reload: function(){
         this._useKeyboard = false;
         this._expanded = {};
         if(this._options.display.showRoot){
            this._expanded[this._rootNode] = true;
         }
         this._loaded = {};
         var filter = this.getQuery(true);
         if(this.isHierarchyMode()){
            this._loaded[this._currentRootId] = true;
            filter[this._hierColumnParentId] = this._currentRootId;
         }
         else{
            this._loaded[this._rootNode] = true;
         }
         return this._runQuery(filter, true);
      },
      /**
       * вызывает очистку содержимого табличного браузера
       */
      clear: function(){
         var curRecordSet = this.getRecordSet();
         if(curRecordSet.getRecordCount() !== 0){
            curRecordSet.clear();
            if(this.isHierarchyMode()){
               this.resetFilter(true);
               if(this._pathSelector && $ws.helpers.instanceOfModule(this._pathSelector, 'SBIS3.CORE.PathSelector'))
                  this._pathSelector.setPath([]);
               if(this._turn){
                  if(this._turn == "BranchesAndLeaves")
                     this._options.display.viewType = "hierarchy";
                  this._clearExpandAll(true); //независимо от сброса фильтра нужно сбрасывать разворот...
               }
               if(this._options.display.viewType === "tree"){
                  if(this._expanded){
                     for(var key in this._expanded)
                        delete this._expanded[key];
                  }
               }
               if(this._rootNode)
                  this._currentRootId = this._rootNode;
            }
            this.refresh();
            this.getPaging().addCallback(function(paging){
               paging.update(undefined, 0);
               return paging;
            });
            this._updatePager();
            this.removeSelection();
         }
      },
      /**
       * выполняет пользовательскую функцию для выделенных строк, после чего вызывает перезагрузку браузера
       * @description
       * <pre>
       *    var myKeysArray = [];
       *    this.performFunction(function(record){
       *       myKeysArray.push(record.getKey());
       *       return new $ws.proto.Deferred().callback();
       *    });
       * </pre>
       * @param {Function} func анонимная функция, которая возвращает $ws.proto.Deferred
       */
      performFunction: function(func){
         var selectedRows = this.getSelection(),
             dResult = new $ws.proto.ParallelDeferred(),
             self = this;
         self._isUpdatingRecords = true;
         for(var i = 0, l = selectedRows.length; i < l; i++){
            dResult.push( func(selectedRows[i]) );
         }
         dResult.done();
         dResult.getResult().addCallback(function(){
            self._isUpdatingRecords = false;
            self.reload();
         });
      },
      /**
       * Получение текущей выделенной строки
       * @return {jQuery|Boolean} текущая выделенная строка или false если ничего не выделено
       */
      getActiveElement: function(){
         if(this._options.useHoverRowAsActive === true){
            var hoverRow = this._body.find('[rowkey].ws-browser-item-over');
            return hoverRow.length > 0 ? hoverRow : false;
         } else if(this._activeElement)
            return this._activeElement;
         else
            return false;
      },
      /**
       * Смена текущего выделенного элемента
       * @param {jQuery} newActiveRow Элемент, который хотим выделить
       * @param {Boolean} [needScroll] Нужно ли доскроллить браузер до указанной строки
       * @param {Boolean} [noNotify] Если будет установлено true, то извещения о событии onSetCursor не произойдёт
       */
      setActiveElement: function(newActiveRow, needScroll, noNotify, changeState){
         if( (newActiveRow === null || newActiveRow === undefined) && this._activeElement && !this._options.setCursorOnLoad){
            this._activeElement.removeClass('ws-browser-item-over');
            this._activeElement = undefined;
            this._hovered = undefined;
         }
         if(this._options.useSelection !== false && newActiveRow && "jquery" in newActiveRow && newActiveRow.length > 0 &&
            (this._activeElement && this._activeElement[0] !== newActiveRow || !this._activeElement) &&
            newActiveRow.closest('.ws-browser')[0] == this._data[0]){
            if(this._activeElement){
               this._activeElement.removeClass('ws-browser-item-over');
            }
            newActiveRow.addClass('ws-browser-item-over');
            this._setSelection(newActiveRow);
            newActiveRow.attr('tabindex', '-1');
            if(needScroll !== false){
               if(this.isActive()){
                  newActiveRow.focus();
               }
               this.scrollToActive(newActiveRow);
            }
            this._activeElement = newActiveRow;

            this._hovered = newActiveRow.attr('rowKey') !== 'null' ? newActiveRow.attr('rowKey') : null;
            var activeRecord = this._hovered ? this.getActiveRecord() : null;

            if(!noNotify){
               this._notifySetCursor(this._activeElement, activeRecord);
            }
            this._changeState(changeState);
         }
         else if(this._rowSelection instanceof Object && "jquery" in this._rowSelection){
            this._rowSelection.css('display', 'none');
         }
      },
      /**
       * Обновляет позицию выделения в строке
       * @param {jQuery} activeRow Новая выделенная строка
       * @private
       */
      _setSelection: function(activeRow){
         this._container.find('.ws-browser-row-selected').removeClass('ws-browser-row-selected');
         activeRow.addClass('ws-browser-row-selected');
      },
      destroy: function() {
         if(this._pathSelector && this._pathSelector.destroy)
            this._pathSelector.destroy();
         if(this._paging && this._paging.destroy)
            this._paging.destroy();
         if(this._toolbar && this._toolbar.destroy)
            this._toolbar.destroy();

         if(this._parent)
            this._parent.unsubscribe('onReady', this._dataBindHandler);

         if(this._setDataHandler)
            this._parent.unsubscribe('onReady', this._setDataHandler);

         if (this._currentRecordSet !== null)
            this._currentRecordSet.abort();

         this._reportPrinter = null;

         $ws.proto.DataView.superclass.destroy.apply(this, arguments);
      },
      /**
       * Устанавливает ограничение на выбор определённоего типа записей в браузере
       * @param {String} type Тип записей, доступных для выбора. ("node", "leaf", "all")
       */
      setSelectionType: function(type){
         this._options.selectionType = type || "all";
         if(this._options.selectionType === "node" || this._options.display.viewMode == 'foldersTree'){
            this._options.filterParams["ВидДерева"] = "Только узлы";
            this._currentFilter["ВидДерева"] = "Только узлы";
            this._systemParams["ВидДерева"] = "Только узлы";
         }
      },
      /**
       * Тестирует запись на возмозность отображения в браузере, в зависимости от selectionType
       * @param record запись для проверки
       */
      _testSelectedRecord: function(record){
         if(record !== undefined){
            if(this.isHierarchyMode()){
               switch (this._options.selectionType){
                  case "leaf":
                     if(!record.get(this._hierColumnIsLeaf))
                        return true;
                     break;
                  case "node":
                     if(!!record.get(this._hierColumnIsLeaf))
                        return true;
                     break;
                  case "all":
                  default:
                     return true;
               }
            }else{
               return true;
            }
         }
         return false;
      },
      /**
       * Выделяет строку
       * @param {String} key Ключ записи
       */
      _selectRow: function(key){
         if(this._isIdEqual(key, this._rootNode) && !this._options.display.showRoot){
            this._head.find('.ws-browser-checkbox').closest('tr').addClass('ws-browser-selected');
         }
         else{
            var row = this._body.find('tr[rowkey="' + key + '"]');
            row.addClass('ws-browser-selected');
            if(!this._isIdEqual(key, this._rootNode) && this._selected[key] === undefined){
               var record = this._currentRecordSet.contains(key) ? this._currentRecordSet.getRecordByPrimaryKey(key) : undefined;
               this._selected[key] = this._selectedRecords.length;
               this._selectedRecords.push(record);
               this._notifyBatchDelayed('onChangeSelection', record, true);
            }
         }
         var rows = this._body.find('.ws-browser-table-row'),
               selectAllRow = this._head.find('.ws-browser-checkbox').closest('tr'),
               isSelected = true;
         for(var i = 0, l = rows.length-1; i <= l; i++){
            if(!$(rows[i]).hasClass('ws-browser-selected')){
               isSelected = false;
               break;
            }
         }
         if(isSelected && !selectAllRow.hasClass('ws-browser-selected'))
            selectAllRow.addClass('ws-browser-selected');
      },
      /**
       * Убирает выделение со строки
       * @param {String} key Ключ записи
       */
      _unselectRow: function(key){
         if(this._isIdEqual(key, this._rootNode) && !this._options.display.showRoot){
            this._head.find('.ws-browser-checkbox').closest('tr').removeClass('ws-browser-selected');
         }
         else{
            var row = this._body.find('tr[rowkey="' + key + '"]');
            row.removeClass('ws-browser-selected');
            if(!this._isIdEqual(key, this._rootNode) && this._selected[key] !== undefined){
               var record = this._currentRecordSet.contains(key) ? this._currentRecordSet.getRecordByPrimaryKey(key) : undefined;
               delete this._selectedRecords[this._selected[key]];
               delete this._selected[key];
               this._notifyBatchDelayed('onChangeSelection', record, false);
            }
         }
         var selectAllRow = this._head.find('.ws-browser-selected');
         if(selectAllRow.length !== 0)
            selectAllRow.removeClass('ws-browser-selected');
      },
      /**
       * Меняет выделение на строке. Если было - убирает, если не было - добавляет
       * @param {String} key Ключ записи
       */
      _toggleRowSelection: function(key){
         if(this._selected[key] !== undefined){
            this._unselectRow(key);
         }
         else{
            this._selectRow(key);
         }
      },
      /**
       * Обрабатывает выбор текущий или переданной в параметрах строки
       * @param {jQuery} [element] Элемент, который хотим выделить/снять выделение
       */
      _selectActiveElement: function(element){
         var   self = this,
               row = element || this.getActiveElement(),
               key = row.attr('rowkey');
         key = key === "null" ? null : key;

         if(this._isIdEqual(key, this._rootNode)){
            if(element.hasClass('ws-browser-selected')){
               this.removeSelection();
            }
            else{
               this.selectAll();
            }
         }
         else{
            var record = this._currentRecordSet.getRecordByPrimaryKey(key);
            if(this.isHierarchyMode()){
               switch (this._options.selectionType){
                  case "leaf":
                        if(!record.get(this._hierColumnIsLeaf))
                           this._toggleRowSelection(key);
                        break;
                  case "node":
                        if(!!record.get(this._hierColumnIsLeaf))
                           this._toggleRowSelection(key);
                        break;
                  case "all":
                  default:
                        this._toggleRowSelection(key);
                        break;
               }
            }else
               this._toggleRowSelection(key);
         }
         this._updatePager();
      },
      /**
       * Возвращает записи, выделенные в браузере.
       * Если передали параметр onlyMarked = true, то вернет только отмеченные
       * @param {Boolean} [onlyMarked] Вернуть ли только отмеченные записи.
       * @return {Array} Массив записей
       */
      getSelection : function(onlyMarked){
         var res = [];
         onlyMarked = onlyMarked === undefined ? false : onlyMarked;
         if(Object.isEmpty(this._selected) && onlyMarked !== true){
            var record = this.getActiveRecord();
            if(record)
               res.push(record);
         }
         else{
            for(var i in this._selected){
               if(this._selected.hasOwnProperty(i)){
                  try{
                     if(this._selectedRecords[this._selected[i]] !== undefined)
                        res.push(this._selectedRecords[this._selected[i]]);
                     else
                        res.push(this._currentRecordSet.getRecordByPrimaryKey(i));
                  }catch(e){}
               }
            }
         }
         return res;
      },
      /**
       * Отмечает переданные записи.
       * Если передана только одна, то просто ставит на нее курсор.
       * Если записей много то они помечаются, а курсор ставится на первую.
       * @param {Array} args Массив ключей записей которые необходимо пометить.
       */
      setSelection : function(args){
         var keys = [];
         if(args instanceof Array)
            keys = args;
         else if(typeof(args) === 'string' || typeof(args) == 'number')
            keys.push(args);
         if(keys.length > 1){
            var records = [];
            for(var i = 0, l = keys.length; i < l; i++){
               this._selected[keys[i]] = this._selectedRecords.length;
               try{
                  var record = this._currentRecordSet.getRecordByPrimaryKey(keys[i]);
                  this._selectedRecords.push(record);
                  records.push(record);
               }catch(e){
                  this._selectedRecords.push(undefined);
               }
               this._body.find('tr[rowkey="' + keys[i] + '"]').addClass('ws-browser-selected');
            }
            this._notifyBatchDelayed('onChangeSelection', records, true);
         }
         if(keys[0] !== undefined)
            this.setActiveElement(this._body.find('tr[rowkey="' + keys[0] + '"]'), false);
         else if(this._activeElement && !this._options.setCursorOnLoad){
            this._activeElement.removeClass('ws-browser-item-over');
            this._hovered = undefined;
         }
         this._updatePager();
      },
      /**
       * Снимает выделение с записей с указанными ключами
       * @param {Array} args Массив ключей записей с которых необходимо снять выделение
       * @param {Boolean} [notNotify] не поднимать событие, используется для служебной очистки выделения
       */
      clearSelection : function(args, notNotify){
         var currentKey,
               position,
               keys = [];
         if(args instanceof Array)
            keys = args;
         else if(typeof(args) === 'string' || typeof(args) == 'number')
            keys.push(args);
         if(keys.length >= 1){
            var records = [];
            for(var i = 0, l = keys.length; i < l; i++){
               delete this._selected[keys[i]];
               for(var j = 0, len = this._selectedRecords.length; j < len; j++){
                  if(this._selectedRecords[j] !== undefined){
                     currentKey = this._selectedRecords[j].getKey();
                     if(currentKey == keys[i]){
                        records.push(this._selectedRecords[j]);
                        position = j;
                        break;
                     }
                  }
               }
               if(position !== undefined)
                  this._selectedRecords.splice(position,1);
               this._body.find('tr[rowkey="' + keys[i] + '"]').removeClass('ws-browser-selected');
            }
            if(!notNotify)
               this._notifyBatchDelayed('onChangeSelection', records, false);
         }
         this._updatePager();
      },
      /**
       * Снимает всё выделение в браузере
       */
      removeSelection : function(){
         this._selected = {};
         this._selectedRecords = [];
         this._container.find('.ws-browser-selected').removeClass('ws-browser-selected');
         this._notifyBatchDelayed('onChangeSelection', null, false);
         if(this._options.markedRowOptions && this._isRenderedFootRowOptions)
            this._drawRowOptionsButtons();
         this._updatePager();
      },
      /**
       * Свертывает невыделенные записи в браузере по Ctrl+Space
       * @param {Boolean} [rollUp] признак свертывания: свернуть или развернуть
       */
      showSelection : function(rollUp){
         var selectedRows = this.getSelection(),
             self = this;
         if(rollUp === undefined)
            rollUp = true;
         if(rollUp !== false){
            if(!this._minimized){
               this._initialRecordSet = this._initialRecordSet || this._currentRecordSet;
               $ws.core.setCursor(false);
               $ws.core.attachInstance('Source:RecordSet', $ws.core.merge(this._options.dataSource, {firstRequest : false})).addCallback(function(instanse){
                  instanse.setColumns(self._currentRecordSet.getColumns());
                  for(var i = 0, l = selectedRows.length; i < l; i++){
                     instanse.appendRecord(selectedRows[i].toObject());
                  }
                  $ws.core.setCursor(true);
                  self.setData(instanse);
                  self.removeSelection();
               }).addErrback(function(error){
                     $ws.core.setCursor(true);
                     $ws.core.alert(error.message, "error");
                  });
               this._minimized = true;
            }
         }else{
            if(this._minimized){
               if(this._initialRecordSet instanceof $ws.proto.RecordSet){
                  var keys = [],
                      keyActiveRecord = this.getActiveRecord().getKey(),
                      records = this._currentRecordSet.getRecords();
                  for(var i = 0; i < records.length; i++)
                     keys.push(records[i].getKey());
                  this.removeSelection();
                  this.setData(this._initialRecordSet);
                  this.setSelection(keys);
                  this.setActiveRow(this._body.find('tr[rowkey="' + keyActiveRecord + '"]'));
                  this._initialRecordSet = false;
               }
               this._minimized = false;
            }
         }
      },
      /**
       * Возвращает состояние записей в браузере: свернуты или нет
       * @return {Boolean} true-свернуто false-несвернуто
       */
      isMinimized : function(){
         return this._minimized;
      },
      /**
       * Подтверждение выбора записей из браузера.
       */
      confirmSelection : function(records){
         records = records || this.getSelection();
         var filteredRecords = [];
         for(var i in records){
           if(records.hasOwnProperty(i) && this._testSelectedRecord(records[i])){
               filteredRecords.push(records[i]);
            }
         }
         if(filteredRecords && filteredRecords.length > 0){
            this._notifyBatchDelayed('onSelectionConfirm', filteredRecords);
         } else {
            this._notifyBatchDelayed('onSelectionConfirm', [null]);
         }
      },
      /**
       * Отмечает все записи как выбранные
       */
      selectAll: function(){
         this._selected = [];
         this._selectedRecords = [];
         var self = this,
            view = function(tbody){
               var rows = tbody.find('tr');
               for(var i = 0; i < rows.length; ++i){
                  var key = rows.eq(i).attr('rowkey');
                  if(!self._isIdEqual(key, self._rootNode)){
                     self._selected[key] = self._selectedRecords.length;
                     if(self._currentRecordSet.contains(key)){
                        self._selectedRecords.push(self._currentRecordSet.getRecordByPrimaryKey(key));
                     }
                     else{
                        self._selectedRecords.push(undefined);
                     }
                     rows.eq(i).addClass('ws-browser-selected');
                  }
               }
            };
         view(this._body);
         this._notifyBatchDelayed('onChangeSelection', this._selectedRecords, true);
         if(this._options.markedRowOptions && !this._isRenderedFootRowOptions)
            this._drawRowOptionsButtons(true);
         this._updatePager();
      },
      /**
       * Возвращает идентификатор корня
       * @returns {Number|String} идентификатор корня
       */
      getRootNode: function(){
         return this._rootNode;
      },
      /**
       * Возвращает идентификатор текущего корня, в случае иерархии это открытая папка
       * @returns {Number|String} идентификатор
       */
      getCurrentRootNode: function(){
         return this._currentRootId;
      },
      /**
       * Возвращает текущую активную запись данных для такущей активной строки, или для той которая переданна
       * @param {jQuery} [row] строка рекорд которой хочется иметь
       * @returns {$ws.proto.Record|Boolean} Запись, если есть активня строка или false, если строки нет
       */
      getActiveRecord: function(row){
         row = row || this.getActiveElement();
         if(!row){
            return false;
         }
         var record = false,
               rowkey = row.attr('rowkey');
         if(rowkey !== undefined && this._currentRecordSet.contains(rowkey))
            record = this._currentRecordSet.getRecordByPrimaryKey(rowkey);
         if(this._addAtPlace && rowkey == this._addAtPlaceRecordId){
            record = this._addAtPlaceRecord;
         }
         return record;
      },
      /**
       * Возвращает первичный ключ текущей записи-папки. Если текущая запись - не папка, то возвращает её предка
       * @param {Boolean} addChild добавляем дочерний элемент к текущей записи или соседа
       * @returns {Number}
       */
      getFolderKeyForActiveRecord: function(addChild){
         var activeRecord = this.getActiveRecord();
         if(activeRecord){
            var key;
            if(activeRecord.get(this._hierColumnIsLeaf) !== true || ( activeRecord.get(this._hierColumnIsLeaf) === true && !addChild )){
               key = activeRecord.get(this._hierColumnParentId);
            }
            else{
               this._isInsertOnFolderInTree = true;
               key = activeRecord.getKey();
            }
            return key;
         }
         else{
            var row = this.getActiveElement();
            if(row){
               var rowkey = row.attr('rowkey');
               if(rowkey === 'null'){
                  rowkey = null;
               }
               return rowkey;
            }
         }
         return this._currentRootId;
      },
      /**
       * Обновляет сведения о количестве записей в таблице
       */
      _updatePager: function(){
         if(this._currentRecordSet){
            var recordsCount = this._options.display.viewType === 'hierarchy' ? this._count :
               (this._count !== 0 ? this._count : this._currentRecordSet.getRecordCount());
            if(this._options.display.showRoot)
               recordsCount--;
            var pagerStr = '';
            if(this._options.display.showRecordCountForEmptyData || (!this._options.display.showRecordCountForEmptyData && this._currentRecordSet.getRecordCount() > 0)){
               if(this._options.display.showRecordsCount){
                  if(this._options.display.usePaging && this._turn === ''){
                     var strEnd = this._options.display.usePaging === 'full' ? (" из " + this._currentRecordSet.hasNextPage()) : '',
                         page = this._currentRecordSet.getPageNumber(),
                         startRecord = page * this._options.display.recordsPerPage + 1;
                     if(recordsCount === 0){
                        pagerStr = '0 записей';
                     }
                     else if(recordsCount === 1 && page === 0){
                        pagerStr = '1 запись';
                     }
                     else{
                        pagerStr = "Записи с " + startRecord + " по " + (startRecord + recordsCount - 1) + strEnd;
                     }
                  } else {
                     pagerStr += pagerStr !== "" ? ". Всего : " : "Всего : ";
                     pagerStr += recordsCount;
                  }
               }
            }
            var selectedCount = 0;
            for(var i = 0, len = this._selectedRecords.length; i < len; ++i){
               if(this._selectedRecords[i]){
                  ++selectedCount;
               }
            }
            if(selectedCount > 0){
               pagerStr = 'Выбра' + $ws.helpers.wordCaseByNumber(selectedCount, 'но', 'на', 'ны') +
                  ' ' + selectedCount + ' запис' + $ws.helpers.wordCaseByNumber(selectedCount, 'ей', 'ь', 'и') + '. ' + pagerStr;
            }

            if(this._pageOptionsContainer){
               this._pageOptionsContainer.toggle(recordsCount > 1 || this._currentRecordSet.getPageNumber() !== 0);
            }

            this._rootElement.find('.ws-browser-pager-text').text(pagerStr);

            if(!this._paging && this._options.display.usePaging && this._options.display.showPaging){
               var element = this._rootElement.find('.ws-browser-paging');
               if(element.length){
                  this._rootElement.find('.ws-browser-pager-cont').addClass('ws-browser-has-paging');
                  var hasNextPage = this._currentRecordSet.hasNextPage() ||
                        (this._options.display.usePaging === 'full' && recordsCount),
                     self = this,
                     footer = element.closest('.ws-browser-foot'),
                     footerWidth = footer.width(),
                     footerHeight = footer.height();
                  self._paging = true;
                  if(hasNextPage === undefined){
                     hasNextPage = 0;
                  }
                  return this._pagingReady.dependOn($ws.core.attachInstance('Control/Paging', {
                     recordsPerPage: self._options.display.recordsPerPage,
                     currentPage: this._currentRecordSet.getPageNumber() + 1,
                     recordsCount: hasNextPage,
                     onlyLeftSide: (self._options.display.usePaging === 'parts') || (self._options.display.usePaging === 'auto' &&
                        typeof(hasNextPage) == 'boolean'),
                     rightArrow: hasNextPage,
                     element: element,
                     handlers:{
                        'onPageChange': function(event, pageNum, def) {
                           self._pageChangeDeferred = def;
                           self._currentRecordSet.setPage(pageNum - 1, false, self._options.display.partiallyLoad);
                        }
                     }
                  })).addCallback(function(instance){
                     self._paging = instance;
                     if(self._turn !== '' || !self.isEnabled()){
                        instance.setEnabled(false);
                     }
                     self._processPaging();
                     instance.setRecordSet(self._currentRecordSet);
                     instance.update(self._currentRecordSet.getPageNumber() + 1);
                     if(footer.width() !== footerWidth || footer.height() !== footerHeight){
                        self._onResizeHandler();
                     }
                     return instance;
                  });
               }
            }
         }
      },

      /**
       * Эти переменные должны считаться только здесь!
       * _verticalScrollShowed/_horizontalScrollShowed/_bodyHeight/_bodyRealHeight
       * @private
       */
      _updateSizeVariables: function() {
         this._bodyHeight = this._data.parent().height();// <table class="ws-browser">
         this._bodyRealHeight = this._body.height();

         var el = this._data.parent();
         this._verticalScrollShowed = $ws.helpers.hasVerticalScrollbar(el);
         this._horizontalScrollShowed = $ws.helpers.hasHorizontalScrollbar(el);

         //Показываем/прячем в заголовке td, выравнивающий заголовок при появлении вертикальной прокрутки у данных
         var scrollTd = this._container.find('td.ws-browser-header-cell-scroll-placeholder');
         scrollTd[this._verticalScrollShowed ? 'show' : 'hide']();
      },

      /**
       * Изменение высоты
       */
      _setHeight: function(isExternalChange){
         var table = this._data.parent(),// '.ws-browser-container'
             additionalHeightNoBorder = this._getAdditionalHeight(),
             additionalHeight = additionalHeightNoBorder + 2, // + внешний border
             newHeight;

         if(this._isHeightGrowable()){
            // new algoritm
            table.height('auto');
            this._container.height('auto');

            if(this._options.maxHeight != Infinity){
               this._browserContainerWrapper.css('max-height', additionalHeight > this._options.maxHeight? 0: (this._options.maxHeight - additionalHeight));
            } else {
               this._browserContainerWrapper.css('max-height', '');
            }
            if(this._options.minHeight !== 0 && additionalHeight <= this._options.minHeight){
               this._browserContainerWrapper.css('min-height', this._options.minHeight - additionalHeight);
            } else {
               this._browserContainerWrapper.css('min-height', '');
            }
         } else {
            newHeight = this._container.height() - additionalHeight;

            if (this._emptyDataBlock.hasClass('ws-hidden')) {
               table.height(Math.max(newHeight, 0));
            }
            else {
               table.height('auto');
               newHeight -= table.height();
               this._emptyDataBlock.height(Math.max(newHeight, 0));
            }
         }

         this._updateSizeVariables();
         this._updateDataBlockSize();

         if (this._isHeightGrowable()) {
            //Корректировка высоты для ie7. Там блок table с авто-высотой оказывается меньше - горизонтальная прокрутка добавляется внутрь.
            //Значит, может появится вертикальная крутилка в таблице с автовысотой, что есть баг, ибо на то и автовысота, чтоб верт. прокрутки не было.
            //Обнаружив это, добавим таблице высоты, чтоб вертикальная прокрутка убралась.
            if (this._verticalScrollShowed && this._horizontalScrollShowed) {
               table.height(table.height() + this._scrollWidth);
               this._updateDataBlockSize();//при изменении высоты таблицы надо подогнать под неё зависимые блоки
            }

            //===================
            //Хак для IE9: была ошибка, при которой браузер, принадлежащий автодополнению, увеличивался по вертикали при наведении мышки (ховере),
            // если у него была верт. прокрутка (или у окна автодополнения)
            //TODO: проверить, нужен ли этот хак
            //Надо ещё прибавить единичку, а то может не хватить высоты и появится прокрутка (FF, Chrome)
            //sbisdoc://1+ОшРазраб+03.12.12+37928+2DBDF88C-35F7-4D89-A64B-3FFA3E7584F+
            table.height(table.outerHeight() + 1);
            //===================

            //Если у браузера есть ресайзер - надо поставить ему высоту.
            //Ресайзер нужен для браузера с гориз. растягом и автовысотой (см. _getBrowserDataContainerStyles)
            if (this._resizer) {
               this._resizer.height(this._rootElement.height());
            }

            //см. комментарий к _checkContainerHeightForRecalk
            if(isExternalChange)
               this._checkContainerHeightForRecalk();
         }
      },
      /**
       * Возвращает высоту всего, кроме тела браузера
       */
      _getAdditionalHeight: function(){
         var footHeight = this._foot.height(),
             headHeight = this._headContainer.height();
         return footHeight + headHeight;
      },
      /**
       * Обработчик ресайза окна
       */
      _onResizeHandler: function(event, initiator){
         if (this !== initiator) {
            this._setHeight(true);
            if(this._pathSelector)
               this._pathSelector['_onResizeHandler']();
         }
         $ws.proto.DataView.superclass._onResizeHandler.apply(this, arguments);
      },
      /**
       * Возвращает текущий рекордсет браузера
       *
       * @returns {$ws.proto.RecordSet}
       */
      getRecordSet: function(){
         return this._currentRecordSet;
      },
      /**
       * Метод для установки корневого узла
       * @param {Number} node Идентификатор узла
       * @param {Boolean} [noLoad] Если указать как true, то загрузки данных не будет
       * @returns {$ws.proto.Deferred}
       */
      setRootNode: function(node, noLoad){
         var self = this,
            result = new $ws.proto.Deferred();
         this._dReady.addCallback(function(){
            self._rootNode = self._currentRootId = node;
            self._systemParams[self._hierColumnParentId] = self._rootNode;
            self._currentRecordSet.updateInitialParameter(self._hierColumnParentId, node === null ? null : node + '');
            if(self._pathSelector !== undefined){
               self._pathReady.addCallback(function(){
                  self._pathSelector.setRootNode(node, noLoad);
               });
            }
            if( noLoad ){
               result.callback();
            }
            else{
               if(self._options.display.viewType === 'tree' && self._turn === ''){
                  result.dependOn(self.reload());
               }
               else{
                  self._expanded = {};
                  self._expanded[node] = true;
                  self._systemParams[self._hierColumnParentId] = node;
                  result.dependOn(self._currentRecordSet.loadNode(node, true, 0, !self._options.display.partiallyLoad ||
                      self._systemParams['Разворот'] === 'С разворотом'));
               }
            }
         });
         return result;
      },
      /**
       * Устанавливает имя корня. Работает для корня, отображаемого в дереве и для первого элемента "пути" иерархического браузера
       * @param {String} name Та самая строка, которая будет отображаться
       */
      setRootName: function(name){
         this._options.display.rootName = name;
         if(this._pathSelector && this._pathSelector instanceof Object){
            this._pathSelector.setRootName(name);
         }
         if(this._rootName){
            this._rootName.text(name);
         }
      },
      /**
       * Перевод браузера в режим выбора
       * @param {Boolean} isEnabled включен или отключен мультистрочный выбор
       */
      setSelectionMode : function(isEnabled){
         this._selectMode = !!isEnabled;
         this._options.display.showSelectionCheckbox = !!isEnabled;
      },
      /**
       * Получение статуса режима выбора
       * @return {Boolean} selectMode Включен или нет режим выбора
       */
      getSelectionMode : function(){
         return this._selectMode;
      },
      /**
       * Создаёт/удаляет ненужные кнопки с тулбара и меню, пересчитывает возможные действия для пользователя
       */
      _rebuildActions: function(){
         this._initActionsFlags();
         var self = this;
         this._toolbarReady.addCallback(function(toolbar){
            toolbar.getMenuReady().addCallback(function(menu){
               if(!self._actions['addItem']){
                  toolbar.deleteButton('addItem');
               }
               if(!self._actions['addFolder']){
                  toolbar.deleteButton('addFolder');
               }
               var buttons = self._prepareButtonsList(self._getToolbarButtons());
               for(var i = 0, len = buttons.length; i < len; ++i){
                  if(!toolbar.hasButton(buttons[i].name)){
                     toolbar.insertButton(buttons[i], 'menu');
                  }
               }
               var menuActions = self._getMenuButtons();
               for(i = 0, len = menuActions.length; i < len; ++i){
                  menuAction = menuActions[i];
                  if(!self._actions[menuAction[2]] && menu.hasItem(menuAction[2])){
                     menu.removeItem(menuAction[2]);
                  }
               }
               var prevButton = 'menu';
               for(i = menuActions.length - 1; i >= 0; --i){
                  var menuAction = menuActions[i];
                  if(menu.hasItem(menuAction[2])){
                     prevButton = menuAction[2];
                  }
                  else if(self._actions[menuAction[2]] && !menu.hasItem(menuActions[2])){
                     menu.insertItem(self._prepareMenuItem(menuAction), prevButton);
                  }
               }
               return menu;
            });
            return toolbar;
         });
      },
      /**
       * Меняет статус доступности только на чтение.
       * @param {Boolean} status значение в которое будет установлена внутренняя опция
       */
      setReadOnly : function(status){
         if(this._options.display.readOnly != !!status){
            this._options.display.readOnly = !!status;
            this._rebuildActions();
            if(this._options.display.rowOptions)
               this._initRowOptionsDefaults();
            if(this._addAtPlaceLinkRow){
               this._addAtPlaceLinkRow.toggle(!status);
            }
         }
      },
      /**
       * Устанавливает возможность добавления записей
       * @param {Boolean} allow Можно или нельзя
       */
      setAllowAdd: function(allow){
         if(this._options.allowAdd != allow){
            this._options.allowAdd = allow;
            this._rebuildActions();
         }
      },
      /**
       * Устанавливает возможность редактирования записей
       * @param {Boolean} allow Можно или нельзя
       */
      setAllowEdit: function(allow){
         if(this._options.allowEdit != allow){
            this._options.allowEdit = allow;
            this._rebuildActions();
         }
      },
      /**
       * Устанавливает возможность удаления записей
       * @param {Boolean} allow Можно или нельзя
       */
      setAllowDelete: function(allow){
         if(this._options.allowDelete != allow){
            this._options.allowDelete = allow;
            this._rebuildActions();
         }
      },
      /**
       * Печатает текущее содержимое браузера
       * @param {string|undefined} style добавочный стиль для печати
       */
      print: function(style){
         var head = this._head.html();
         $ws.core.attachInstance('SBIS3.CORE.HTMLView', {
            string: '<table class="ws-browser" cellspacing="0"><colgroup>' + this._data.find('colgroup').html() + '</colgroup><thead>' +
                  head.substring(0, head.length - 20) + '</tr></thead><tbody>' + this._body.html() + '</tbody></table>',
            element: $('<div></div>').appendTo($(document.body))
         }).addCallback(function(instance){
            instance.getReadyDeferred().addCallback(function(){
               instance.hideIframeContainer();
               var doc = $(instance.getIframeDocument()),
                     table = doc.find('table'),
                     iframe = $(instance.getIframe());
               if($.browser.opera){
                  iframe.css('min-height', doc[0].body.scrollHeight + 'px');
               }
               iframe.width($.browser.opera ? '100%' : $ws._const.Browser.printFrameWidth);
               table.width($.browser.opera ? '100%' : $ws._const.Browser.printFrameWidth);
               var cols = doc.find('col'),
                     maxWidth = table.width(),
                     sumWidth = 0;

               cols.each(function(){
                  sumWidth += parseInt($(this).attr('width'), 10);
               });
               cols.each(function(){
                  var $this = $(this);
                  $this.attr('width', parseInt($this.attr('width'), 10) + Math.floor((maxWidth - sumWidth) / cols.length));
               });
               instance.addStyle($ws._const.wsRoot + 'css/print/browser.css').addCallback(function(){
                  if(typeof(style) === 'string'){
                     instance.addStyle(style).addCallback(function(){
                        instance.print();
                     })
                  }
                  else{
                     instance.print();
                  }
               });
            });
         });
      },
      /**
       * Возвращает deferred, стреляющий тулбаром
       * Список имён стандартных кнопок тулбара:
       *  - addItem           Добавить запись
       *  - addFolder         Добавить папку
       *  - edit              Редактировать запись
       *  - copy              Копировать записи
       *  - delete            Удалить запись
       *  - refresh           Перезагрузить данные
       *  - expand            Развернуть без папок
       *  - expandWithFolders Развернуть с папками
       *  - filterParams      Параметры фильтрации
       *  - clearFilter       Очистка фильтрации
       *  - history           История записи
       *  - clearSorting      Очистка сортировки
       *  - print             Печать реестра
       *  - printRecord       Печать записи
       * @returns {$ws.proto.Deferred}
       */
      getToolbar: function(){
         return this._toolbarReady;
      },
      /**
       * Возвращает deferred готовности paging'а
       * @returns {$ws.proto.Deferred}
       */
      getPaging: function(){
         return this._pagingReady;
      },
      /**
       * Устанавливает поле иерархии и поле с названием иерархии
       * @param {String} hierColumn
       * @param {String} titleColumn
       */
      setHierarchyField: function(hierColumn,titleColumn){
         if(titleColumn !== undefined)
            this._options.display.titleColumn = titleColumn;
         if(this._options.display.hierColumn !== hierColumn){
            var self = this;
            this._dReady.addCallback(function(){
               var rs = self.getRecordSet();
               if( rs === null || rs.checkHierColumn(hierColumn) === false )
                  return;
               rs.setHierarchyField(hierColumn);
               self._options.display.hierColumn = hierColumn;
               self._updateHierColumnParams(hierColumn);
            });
         }
      },
      _setEnabled: function(enable){
         enable = !!enable;
         $ws.proto.DataView.superclass._setEnabled.apply(this, arguments);
         if(this._toolbar){
            this._toolbar.setEnabled(enable);
         }
         if(this._paging && this._paging instanceof Object && !(enable && this._turn !== '')){
            this._paging.setEnabled(enable);
         }
         if(this._pathSelector){
            this._pathSelector.setEnabled(enable);
         }
      },
      /**
       * Частично обновляет размеры блока с данными
       */
      _updateDataBlockSize: function(){
      },
      validate: function(){
         return true;
      }
   });

   return $ws.proto.DataView;
});