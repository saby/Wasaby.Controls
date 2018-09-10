define('SBIS3.CONTROLS/Browser', [
   'Core/CommandDispatcher',
   'Core/Deferred',
   'Lib/Control/CompoundControl/CompoundControl',
   'tmpl!SBIS3.CONTROLS/Browser/Browser',
   'SBIS3.CONTROLS/ComponentBinder',
   'SBIS3.CONTROLS/Controllers/ColumnsController',
   'SBIS3.CONTROLS/Utils/TemplateUtil',
   'Core/core-instance',
   'Core/helpers/Object/find'
], function(CommandDispatcher, Deferred, CompoundControl, dotTplFn, ComponentBinder, ColumnsController, tplUtil, cInstance, cFind){
   'use strict';

   /**
    * Базовый класс для реестра
    *
    * @class SBIS3.CONTROLS/Browser
    * @extends Lib/Control/CompoundControl/CompoundControl
    * @author Крайнов Д.О.
    * @demo Examples/Browser/MyBrowser/MyBrowser
    *
    * @ignoreEvents onAfterLoad onChange onStateChange
    * @ignoreEvents onDragStop onDragIn onDragOut onDragStart
    *
    * @control
    * @public
    * @category Lists
    * @designTime plugin /design/DesignPlugin
    */

   var
      checkViewType = function(view) {
         if (view && cInstance.instanceOfModule(view, 'SBIS3.CONTROLS/ListView')) {
            return cInstance.instanceOfMixin(view, 'SBIS3.CONTROLS/Mixins/TreeMixin');
         }
         else {
            throw new Error('Browser: Can\'t define linkedView');
         }
      };

   var
      ChangeColumnsResult = { // Возможные результаты события "onChangeColumns"
         REDRAW: 'Redraw',    // После смены колонок выполнить перерисовку табличного представления
         RELOAD: 'Reload'     // После смены колонок выполнить перезагрузку табличного представления
      },

      Browser = CompoundControl.extend( /** @lends SBIS3.CONTROLS/Browser.prototype */{
      /**
       * @event onEdit Происходит при редактировании или создании новой записи реестра.
       * @remark
       * Для <a href='/doc/platform/developmentapl/interface-development/components/list/list-settings/list-types/#_4'>иерархических списков</a> событие происходит только для записей типа "Лист" (см. <a href='/doc/platform/developmentapl/service-development/bd-development/vocabl/tabl/relations/#hierarchy'>Иерархия</a>).
       * @param {Core/EventObject} eventObject Дескриптор события.
       * @param {Object} meta Мета параметры события.
       * @param {String|Number} meta.id Идентификатор записи. В случае создания новой записи значение параметра - null.
       * @param {WS.Data/Entity/Record} meta.item Экземпляр класса записи. В случае создания новой записи значение параметра - null.
       */
      /**
       * @event onEditCurrentFolder Происходит при редактировании или создании новой папки (записей типа "Узел" и "Скрытый узел").
       * @remark
       * Подробнее о типах записей читайте в разделе <a href='/doc/platform/developmentapl/service-development/bd-development/vocabl/tabl/relations/#hierarchy'>Иерархия</a>.
       * Событие актуально только для <a href='/doc/platform/developmentapl/interface-development/components/list/list-settings/list-types/#_4'>иерархических списков</a>.
       * @param {Core/EventObject} eventObject Дескриптор события.
       * @param {String} id Идентификатор редактируемой папки. В случае добавления новой папки значение параметра - null.
       */
      /**
       * @event onFiltersReady Происходит после построения экземпляра классов окружения списка: "Быстрый фильтр" (см. {@link SBIS3.CONTROLS/Filter/FastData}) и "Кнопки с фильтром" (см. {@link SBIS3.CONTROLS/Filter/Button}).
       * @param {Core/EventObject} eventObject Дескриптор события.
       */
      /**
       * @typedef {String} onColumnsChangeResult
       * @variant Redraw После смены колонок выполнить перерисовку табличного представления. Это поведение используется по умолчанию.
       * @variant Reload После смены колонок выполнить перезагрузку табличного представления.
       */
      /**
       * @event onColumnsChange Происходит при изменении колонок в табличном представлении.
       * @param {Core/EventObject} eventObject Дескриптор события.
       * @param {Array} columns Массив идентификаторов измененных колонок.
       * @returns {onColumnsChangeResult} Позволяет управлять тем, что выполнять после установки колонок - перерисовку или перезагрузку.
       */
      /**
       * @typedef {Object} ColumnsConfigObject
       * @property {WS.Data/Collection/RecordSet} columns Набор записей, каждая из которых описывает элемент панели редактирования колонок. <br/>
       * Поля записи:
       * <ol>
       *    <li><b>id (String)</b> - идентификатор элемента.</li>
       *    <li><b>title (String)</b> - отображаемый текст элемента.</li>
       *    <li><b>fixed (Boolean)</b> - признак "Фиксированный". На панели редактирования колонок элементы с таким признаком выбраны и недоступны для взаимодействия, а колонки элемента, описанные в опции **columnConfig**, всегда отображены в списке.</li>
       *    <li><b>group (string|number)</b> - идентификатор группы колонок, в которую входит данная колонка (если определён)</li>
       *    <li><b>columnConfig (object)</b> - объект с конфигурацией данныой колонки (см. {@link SBIS3.CONTROLS/DataGridVie#columns columns}).</li>
       * </ol>
       * @property {Array.<String|Number>} selectedColumns Список идентификаторов колонок, которые будут отмечены на панели редактирования колонок. Параметр актуален для элементов с опцией *fixed=false*.
       * @property {object} [groupTitles] Ассоциированый массив имён групп по их идентификаторам (используется редактором колонок) (опционально)
       * @property {boolean} [usePresets] Разрешает использовать пресеты (используется редактором колонок) (опционально)
       * @property {Array<SBIS3.CONTROLS/Browser/ColumnsEditor/Preset/Unit>} [staticPresets] Список объектов статически задаваемых пресетов (используется редактором колонок) (опционально)
       * @property {string} [presetNamespace] Пространство имён для сохранения пользовательских пресетов (используется редактором колонок) (опционально)
       * @property {string|number} [selectedPresetId] Идентификатор первоначально выбранного пресета в дропдауне (используется редактором колонок) (опционально)
       * @property {string} [newPresetTitle] Начальное название нового пользовательского пресета (используется редактором колонок) (опционально)
       * @property {boolean} [useOriginPresetTitle] При клонировании новых пользовательских пресетов строить название из исходного с добавлением следующего порядкового номера (используется редактором колонок) (опционально)
       * @see columnsConfig
       * @see setColumnsConfig
       * @see getColumnsConfig
       * @see showColumnsEditor
       * @see _showColumnsEditor
       * @see SBIS3.CONTROLS/Browser/ColumnsEditor/Editor#open
       */
      _dotTplFn : dotTplFn,
      $protected: {
         _view: null,
         _backButton: null,
         _breadCrumbs: null,
         _searchForm: null,
         _operationsPanel: null,
         _filterButton: null,
         _fastDataFilter: null,
         _columnsController: null,
         _columnsEditor: null,
         _hierMode : false,
         _componentBinder : null,
         _options: {
            /**
             * @cfg {Content} Содержимое реестра
             */
            content: '',
            /**
             * @cfg {String} Имя параметр фильтрации для поиска
             */
            searchParam : 'СтрокаПоиска',
            /**
             * @cfg {String|Object} Шаблон для хлебных крошек в режиме поиска
             */
            searchCrumbsTpl: undefined,
            /**
             * @cfg {String} В каком узле осуществляем поиск
             * @variant current в текущем узле
             * @variant root в корне
             * @example
             * <pre>
             *     <option name="searchMode">root</option>
             * </pre>
             */
            searchMode: 'current',
            /**
             * @cfg {Boolean} При неудачной попытке поиска (нет результатов), изменяет раскладку
             * и пробует поискать в другой раскладке
             * @example
             * <pre>
             *     <option name="keyboardLayoutRevert">false</option>
             * </pre>
             */
            keyboardLayoutRevert: true,
            /**
             * @cfg {Boolean} Включает изменение раскладки по новому стандарту. Актуально при включённой опции {@link keyboardLayoutRevert}
             * @example
             * <pre>
             *     <option name="keyboardLayoutRevertNew">true</option>
             * </pre>
             */
            keyboardLayoutRevertNew: false,
            /**
             * @cfg {String} Устанавливает Id для работы с историей фильтров.
             * @remark
             * Опция задает идентификатор, под которым будет сохраняться история фильтрации.
             * Если значение для опции установлено, история фильтрации будет включена.
             * @example
             * <pre>
             *     <option name="historyId">bankPayDocBrowser</option>
             * </pre>
             */
            historyId : '',
            /**
             * Обновлять историю или брать из текущей сессии (SessionStorage/LocalStorage).
             * @remark Данные в SessionStorage могут потерять актуальность при работе одновременно в нескольких вкладках. Опция актуальна при построении реестра на сервере.
             */
            updateFilterHistory: false,
            /**
             * @cfg {Boolean} Применять последний активный фильтр при загрузке реестра.
             */
            applyHistoryFilterOnLoad: true,
            /**
             * @cfg {String} Id для запоминания пэйджинга
             */
            pagingId: '',
            /**
             * @cfg {Array} ignoreFiltersList Массив ключей фильтров, которые не надо запоминать в историю.
             */
            ignoreFiltersList: [],
            /**
             * @cfg [Array} Сохранять проваливание по иерархии в историю браузера будут работать пореходы по кнопке вперед/назад.
             * @remark работает только в месте с сохранением фильтров сессию.
             * @see updateFilterHistory
             */
            saveRootInHistory: false,
            /**
             * @cfg {Boolean} showCheckBoxes необходимо ли показывать чекбоксы, когда панель массовых операций закрыта.
             */
            showCheckBoxes: false,
	        contentTpl: null,
            /**
             * @cfg {ColumnsConfigObject} Устанавливает параметры для Панели редактирования колонок.
             * @remark
             * Вызов панели производят кликом по иконке с шестерёнкой, которая расположена справа от строки поиска.
             * Иконка отображается, когда в опции установлено значение.
             * @example
             * 1. В файле MyColumnsConfig.js описан RecordSet для конфигурации Панели редактирования колонок:
             * <pre>
             * define('Examples/MyArea/MyColumnsConfig', ['WS.Data/Collection/RecordSet'], function(RecordSet) {
             *    var data = [
             *        {
             *           id: 1,
             *           title: 'Базовая группа колонок',
             *           // Признак "Фиксированный"
             *           fixed: true,
             *           // Идентификатор группы колонок (если есть)
             *           group: 'Base1'
             *           columnConfig: [
             *              {
             *                 title: 'Идентификатор',
             *                 field: '@Товар'
             *              },
             *              {
             *                 title: 'Наименование',
             *                 field: 'Наименование',
             *                 className: 'controls-DataGridView-cell-overflow-ellipsis'
             *              }
             *           ]
             *        },
             *        {
             *           id: 2,
             *           title: 'Колонка "Дата выпуска"',
             *           fixed: false,
             *           group: 'Base1'
             *           columnConfig: [{
             *              title: 'Дата выпуска',
             *              field: 'Дата_выпуска'
             *           }]
             *        },
             *        ...
             *    ];
             *    return new RecordSet({
             *       rawData: data,
             *       idProperty: 'id'
             *    });
             * });
             * </pre>
             * 2. Для JS-модуль реестра импортирован RecordSet:
             * <pre>
             * define('Examples/MyArea/MyReportBrowser',[ ... , 'Examples/MyArea/MyColumnsConfig'], function(... , MyColumnsConfig) {
             *    ...
             *    $protected: {
             *       _options : {
             *
             *          // Создана опция для конфигурации опции columnsConfig
             *          columnsConfig: {
             *             columns: myConfig,
             *             selectedColumns: [2, 3],
             *             groupTitles: {'Base1':'Основные параметры'}
             *          }
             *       }
             *    }
             *    ...
             * });
             * </pre>
             * 3. В разметке реестра передана конфигурация в опцию columnsConfig:
             * <pre>
             *     <SBIS3.ENGINE:Controls:Browser:Report columnsConfig="{{ columnsConfig }}">
             *         ...
             *     </SBIS3.ENGINE:Controls:Browser:Report>
             * </pre>
             * Для редактирования набора колонок (в том числе отличных от набора колонок данного браузера) используется команда showColumnsEditor (из любых подкомпонентов браузера)
             * <pre>
             *    this.sendCommand('showColumnsEditor', {
             *       editorOptions: {
             *          moveColumns:true
             *       }
             *    })
             *    .addCallbacks(
             *       function (columnsConfig) {
             *          // Если есть результат редактирования (то есть пользователь отредактировал колонки и нажал кнопку применить, а не закрыл редактор крестом)
             *          if (columnsConfig) {
             *             // Получена новая конфигурация колонок - сделать с нею то, что требуется
             *             var columns = columnsConfig.columns;
             *             var selected = columnsConfig.selectedColumns;
             *             ...
             *          }
             *       },
             *       function (err) {
             *          // Обработать ошибку
             *       }
             *    );
             * </pre>
             * @see setColumnsConfig
             * @see getColumnsConfig
             * @see showColumnsEditor
             * @see _showColumnsEditor
             * @see ColumnsConfigObject
             * @see SBIS3.CONTROLS/Browser/ColumnsEditor/Editor#open
             */
            columnsConfig: null,
            /**
             * @cfg {Boolean} hierarchyViewMode Включать группировку при поиске.
             */
            hierarchyViewMode: true,
            /**
             * @cfg {String} Имя списка. По умолчанию "browserView"
             */
            viewName: 'browserView',
            backButtonTemplate: null
         }
      },

      $constructor: function () {
      },

      init: function() {
         this._publish('onEdit', 'onEditCurrentFolder', 'onFiltersReady', 'onColumnsChange');
         Browser.superclass.init.apply(this, arguments);

         this._onItemActivateHandler = this._onItemActivate.bind(this);
         this._folderEditHandler = this._folderEdit.bind(this);
         this._onApplyFilterHandler = this._onApplyFilter.bind(this);
         this._onInitBindingsHandler = this._onInitBindings.bind(this);
         this._bindView();

         /**
          * Показать редактор колонок.
          *
          * По этой команде открывется редактор колонок, где пользователь может отредактировать указанный в аргументах команды набор колонок. Команда
          * используется в любых компонентах, являющихся потомками браузера (или его наследников) по по дереву компонентов. Команда всплывает по
          * дереву компонентов от родителья к родителю до ближайшего браузера (или его наследника).
          *
          * В аргументах комады может быить указан произвольный набор колонок для редактирования. Если никакой набор колонок в аргументах команды не
          * указан, то будет использован текущий набор колонок браузера. Если у браузера на этот момент не определён допустимый columnsConfig, то
          * возникнет ошибка.
          *
          * Команда возвращает обещание. По окончании редактирования пользователем результирующий набор колонок будет использован
          * для разрешения обещания, которое было возвращено командой при вызове. В случае, если пользователь после редактирования нажал кнопку
          * применения результата редактирования, то обещание будет разрешено новыми параметрами конфигурации колонок. Если же пользователь просто
          * закрыл редактор кнопкой "Закрыть", то обещание будет разрешено значением null. Следует иметь ввиду, что в возвращённом списке выбранных
          * пользователем колонок присутствуют все колонки, в том числе и те, что были помечены как фиксированные(обязательные) в исходных данных.
          * Если в аргументах команды указано значение applyToSelf===true, то результат редактирования будет применён к данному браузеру (при этом
          * значение columnsConfig.columns браузера останется неизменным). В этом случае никаких доплнительных действий с результирующими колонками
          * не требуется.
          *
          * @example
          * Простой пример использования команды:
          * <pre>
          *    this.sendCommand('showColumnsEditor', {
          *          editorOptions: {
          *             moveColumns:true
          *          }
          *       })
          *    .addCallbacks(
          *       function (columnsConfig) {
          *             // Если есть результат редактирования (то есть пользователь отредактировал колонки и нажал кнопку применить, а не закрыл редактор крестом)
          *             if (columnsConfig) {
          *                // Получена новая конфигурация колонок - сделать с нею то, что требуется
          *                var columns = columnsConfig.columns;
          *                var selected = columnsConfig.selectedColumns;
          *                ...
          *             }
          *          },
          *       function (err) {
          *             // Обработать ошибку
          *          }
          *    );
          * </pre>
          *
          * @example
          * Существует возможность использования предустановленных наборов колонок (пресетов). Для этого служат опции usePresets, staticPresets,
          * presetNamespace и selectedPresetId. При наличии статичечских пресетов пользователь может клонировать любой из них и сохранить его как
          * собственный. Простой пример использования:
          * <pre>
          *    require(['SBIS3.CONTROLS/Browser/ColumnsEditor/Preset/Unit'], function (PresetUnit) {
          *       var promise = this.sendCommand('showColumnsEditor', {
          *          editorOptions: {
          *             // Будем использовать предустановленные наборы колонок:
          *             usePresets: true,
          *             // Определим статически-заданные пресеты:
          *             staticPresets: [
          *                new PresetUnit({
          *                   id: 'preset-1',
          *                   title: 'Статический пресет 1',
          *                   selectedColumns: ['Номенклатура.НомНомер', 'ИНН/КПП']
          *                }), new PresetUnit({
          *                   id: 'preset-2',
          *                   title: 'Статический пресет 2',
          *                   selectedColumns: ['Номенклатура.НомНомер', 'ИНН/КПП']
          *                }), new PresetUnit({
          *                   id: 'preset-3',
          *                   title: 'Статический пресет 3',
          *                   selectedColumns: ['Номенклатура.НомНомер', 'ИНН/КПП']
          *                })
          *             ],
          *             // Пользователь будет сохранять свои пресеты в это пространство имён:
          *             presetNamespace: 'catalog-columns-presets',
          *             // Первоначально будет выбран пресет с таким идентификатором (опционально):
          *             selectedPresetId: 'preset-2',
          *             ...
          *             другие опции
          *             ...
          *          }
          *       })
          *    });
          * </pre>
          *
          * @command showColumnsEditor
          * @public
          * @param {object} [options] Опции открытия редактора колонок (опционально)
          * @param {object} [options.columnsConfig] Объект конфигурации колонок (опционально, если нет, будет использован текущий columnsConfig браузера)
          * @param {object} [options.editorOptions] Опции редактора, отличающиеся или не содержащиеся в columnsConfig. Имеют приоритет перед опциями из columnsConfig (опционально)
          * @param {string} [options.editorOptions.title] Заголовок редактора колонок (опционально)
          * @param {string} [options.editorOptions.applyButtonTitle] Название кнопки применения результата редактирования (опционально)
          * @param {object} [options.editorOptions.groupTitles] Ассоциированый массив имён групп по их идентификаторам (опционально)
          * @param {boolean} [options.editorOptions.usePresets] Разрешает использовать пресеты (опционально)
          * @param {string} [options.editorOptions.presetsTitle] Заголовок дропдауна пресетов (опционально)
          * @param {Array<SBIS3.CONTROLS/Browser/ColumnsEditor/Preset/Unit>} [options.editorOptions.staticPresets] Список объектов статически задаваемых пресетов (опционально)
          * @param {string} [options.editorOptions.presetNamespace] Пространство имён для сохранения пользовательских пресетов (опционально)
          * @param {string|number} [options.editorOptions.selectedPresetId] Идентификатор первоначально выбранного пресета в дропдауне (опционально)
          * @param {string} [options.editorOptions.newPresetTitle] Начальное название нового пользовательского пресета (опционально)
          * @param {boolean} [options.editorOptions.moveColumns] Указывает на необходимость включить перемещнение пользователем пунктов списка колонок (опционально)
          * @param {boolean} [options.applyToSelf] Применить результат редактирования к этому компоненту (опционально)
          * @return {Deferred<object>}
          *
          * @see _showColumnsEditor
          * @see columnsConfig
          * @see setColumnsConfig
          * @see getColumnsConfig
          * @see ColumnsConfigObject
          * @see SBIS3.CONTROLS/Browser/ColumnsEditor/Editor#open
          *
          * @demo Examples/ColumnsEditor/BrowserAndEditorButton/BrowserAndEditorButton Пример браузера с кнопкой редактора колонок
          * @demo Examples/ColumnsEditor/BrowserAndEditorButtonWithPresets/BrowserAndEditorButtonWithPresets Пример браузера с кнопкой редактора колонок, с пресетами и группами колонок
          * @demo Examples/ColumnsEditor/BrowserAndCustomButton/BrowserAndCustomButton Пример браузера с собственной кнопкой, открывающией редактор колонок
          * @demo Examples/ColumnsEditor/AllCustom/AllCustom Пример с одиночной кнопкой, открывающией редактор колонок (без браузера)
          */
         CommandDispatcher.declareCommand(this, 'showColumnsEditor', this._showColumnsEditor);

         /**
          * Изменить набор отображаемых колонок
          *
          * @command changeColumns
          * @public
          * @param {Array<string|number>} columnIds Список идентификаторов выбранных колонок (обязательный)
          *
          * @see _changeColumns
          */
         CommandDispatcher.declareCommand(this, 'changeColumns', this._changeColumns);
      },

      /**
       * Устанавливает параметры конфигурации колонок
       * @public
       * @param {object} config Параметры конфигурации колонок
       * @param {WS.Data/Collection/RecordSet} config.columns Набор колонок (обязательный)
       * @param {Array<string|number>} config.selectedColumns Список идентификаторов выбранных колонок (обязательный)
       * @param {object} [config.groupTitles] Ассоциированый массив имён групп по их идентификаторам (опционально)
       * @param {boolean} [config.usePresets] Разрешает использовать пресеты (опционально)
       * @param {string} [config.presetsTitle] Заголовок дропдауна пресетов (опционально)
       * @param {Array<SBIS3.CONTROLS/Browser/ColumnsEditor/Preset/Unit>} [config.staticPresets] Список объектов статически задаваемых пресетов (опционально)
       * @param {string} [config.presetNamespace] Пространство имён для сохранения пользовательских пресетов (опционально)
       * @param {string|number} [config.selectedPresetId] Идентификатор первоначально выбранного пресета в дропдауне (опционально)
       * @param {string} [config.newPresetTitle] Начальное название нового пользовательского пресета (опционально)
       * @see columnsConfig
       * @see getColumnsConfig
       * @see ColumnsConfigObject
       * @see showColumnsEditor
       * @see _showColumnsEditor
       * @see SBIS3.CONTROLS/Browser/ColumnsEditor/Editor#open
       */
      setColumnsConfig: function (config) {
         this._options.columnsConfig = config;
         if (!this._columnsController) {
            this._initColumnsController();
         }
         this._columnsController.setState(this._options.columnsConfig.selectedColumns);
         this._notifyOnPropertyChanged('columnsConfig');
      },
      /**
       * Возвращает параметры, установленные для Панели конфигурации колонок списка.
       * @returns {Object} Конфигурация.
       * @see columnsConfig
       * @see setColumnsConfig
       * @see ColumnsConfigObject
       * @see showColumnsEditor
       * @see _showColumnsEditor
       * @see SBIS3.CONTROLS/Browser/ColumnsEditor/Editor#open
       */
      getColumnsConfig: function() {
         return this._options.columnsConfig;
      },

      /**
       * Показать редактор колонок.
       *
       * Возвращает обещание, которое будет разрешено после завершения редактирования пользователем. В случае, если
       * пользователь после редактирования нажал кнопку применения результата редактирования, то обещание будет разрешено новыми параметрами
       * конфигурации колонок. Если же пользователь просто закрыл редактор кнопкой "Закрыть", то обещание будет разрешено значением null. Следует
       * иметь ввиду, что в возвращённом списке выбранных пользователем колонок присутствуют все колонки, в том числе и те, что были помечены как
       * фиксированные(обязательные) в исходных данных.
       *
       * @example
       * Существует возможность использования предустановленных наборов колонок (пресетов). Для этого служат опции usePresets, staticPresets,
       * presetNamespace и selectedPresetId. При наличии статичечских пресетов пользователь может клонировать любой из них и сохранить его как
       * собственный. Простой пример использования:
       * <pre>
       *    require(['SBIS3.CONTROLS/Browser/ColumnsEditor/Preset/Unit'], function (PresetUnit) {
       *       var promise = this.sendCommand('showColumnsEditor', {
       *          editorOptions: {
       *             // Будем использовать предустановленные наборы колонок:
       *             usePresets: true,
       *             // Определим статически-заданные пресеты:
       *             staticPresets: [
       *                new PresetUnit({
       *                   id: 'preset-1',
       *                   title: 'Статический пресет 1',
       *                   selectedColumns: ['Номенклатура.НомНомер', 'ИНН/КПП']
       *                }), new PresetUnit({
       *                   id: 'preset-2',
       *                   title: 'Статический пресет 2',
       *                   selectedColumns: ['Номенклатура.НомНомер', 'ИНН/КПП']
       *                }), new PresetUnit({
       *                   id: 'preset-3',
       *                   title: 'Статический пресет 3',
       *                   selectedColumns: ['Номенклатура.НомНомер', 'ИНН/КПП']
       *                })
       *             ],
       *             // Пользователь будет сохранять свои пресеты в это пространство имён:
       *             presetNamespace: 'catalog-columns-presets',
       *             // Первоначально будет выбран пресет с таким идентификатором (опционально):
       *             selectedPresetId: 'preset-2',
       *             ...
       *             другие опции
       *             ...
       *          }
       *       })
       *    });
       * </pre>
       *
       * @protected
       * @param {object} [options] Опции открытия редактора колонок (опционально)
       * @param {object} [options.columnsConfig] Объект конфигурации колонок (опционально, если нет, будет использован текущий columnsConfig браузера)
       * @param {object} [options.editorOptions] Опции редактора, отличающиеся или не содержащиеся в columnsConfig. Имеют приоритет перед опциями из columnsConfig (опционально)
       * @param {string} [options.editorOptions.title] Заголовок редактора колонок (опционально)
       * @param {string} [options.editorOptions.applyButtonTitle] Название кнопки применения результата редактирования (опционально)
       * @param {object} [options.editorOptions.groupTitles] Ассоциированый массив имён групп по их идентификаторам (опционально)
       * @param {boolean} [options.editorOptions.usePresets] Разрешает использовать пресеты (опционально)
       * @param {string} [options.editorOptions.presetsTitle] Заголовок дропдауна пресетов (опционально)
       * @param {Array<SBIS3.CONTROLS/Browser/ColumnsEditor/Preset/Unit>} [options.editorOptions.staticPresets] Список объектов статически задаваемых пресетов (опционально)
       * @param {string} [options.editorOptions.presetNamespace] Пространство имён для сохранения пользовательских пресетов (опционально)
       * @param {string|number} [options.editorOptions.selectedPresetId] Идентификатор первоначально выбранного пресета в дропдауне (опционально)
       * @param {string} [options.editorOptions.newPresetTitle] Начальное название нового пользовательского пресета (опционально)
       * @param {boolean} [options.editorOptions.moveColumns] Указывает на необходимость включить перемещнение пользователем пунктов списка колонок (опционально)
       * @param {boolean} [options.applyToSelf] Применить результат редактирования к этому компоненту (опционально)
       * @return {Deferred<object>}
       *
       * @see showColumnsEditor
       * @see columnsConfig
       * @see setColumnsConfig
       * @see getColumnsConfig
       * @see ColumnsConfigObject
       * @see SBIS3.CONTROLS/Browser/ColumnsEditor/Editor#open
       *
       * @demo Examples/ColumnsEditor/BrowserAndEditorButton/BrowserAndEditorButton Пример браузера с кнопкой редактора колонок
       * @demo Examples/ColumnsEditor/BrowserAndEditorButtonWithPresets/BrowserAndEditorButtonWithPresets Пример браузера с кнопкой редактора колонок, с пресетами и группами колонок
       * @demo Examples/ColumnsEditor/BrowserAndCustomButton/BrowserAndCustomButton Пример браузера с собственной кнопкой, открывающией редактор колонок
       * @demo Examples/ColumnsEditor/AllCustom/AllCustom Пример с одиночной кнопкой, открывающией редактор колонок (без браузера)
       */
      _showColumnsEditor: function (options) {
         var hasArgs = options && typeof options === 'object';
         var columnsConfig = hasArgs && options.columnsConfig ? options.columnsConfig : this._options.columnsConfig;
         if (!columnsConfig) {
            return Deferred.fail('ColumnsConfig required');
         }
         var promise = new Deferred();
         require(['SBIS3.CONTROLS/Browser/ColumnsEditor/Editor'], function (ColumnsEditor) {
            if (!this._columnsEditor) {
               this._columnsEditor = new ColumnsEditor();
            }

            promise.dependOn(this._columnsEditor.open(columnsConfig, hasArgs ? options.editorOptions : null));
            if (hasArgs && options.applyToSelf) {
               promise.addCallback(function (resultColumnsConfig) {
                  // Если есть результат редактирования (то есть пользователь отредактировал колонки и нажал кнопку применить, а не закрыл редактор крестом)
                  if (resultColumnsConfig) {
                     this._changeColumns(resultColumnsConfig.selectedColumns);
                  }
               }.bind(this))
            }
         }.bind(this));
         return promise;
      },

      /**
       * Изменить набор отображаемых колонок
       *
       * @protected
       * @param {Array<string|number>} columnIds Список идентификаторов выбранных колонок (обязательный)
       *
       * @see changeColumns
       */
      _changeColumns: function (columnIds) {
         columnIds = columnIds || [];
         var result = this._notify('onColumnsChange', columnIds);
         this._columnsController.setState(columnIds);
         var columnsConfig = this._options.columnsConfig;
         columnsConfig.selectedColumns = columnIds;
         var view = this._getView();
         view.setColumns(this._columnsController.getColumns(columnsConfig.columns));
         if (result === ChangeColumnsResult.RELOAD) {
            view.reload();
         }
         else {
            view.redraw();
         }
      },

      _modifyOptions: function() {
         var options = Browser.superclass._modifyOptions.apply(this, arguments);

	      if (!options.contentTpl) {
		      options.contentTpl = tplUtil.prepareTemplate(options.content);
	      }

         return options;
      },

      _folderEdit: function(){
         this._notify('onEditCurrentFolder', this._componentBinder.getCurrentRootRecord());
      },

      addItem: function(metaData) {
         //При создании записи в простом случае просто зовем onEdit с пустыми параметрами
         this._notify('onEdit', {id: null, item: null});
      },

      getView: function() {
         return this._view;
      },

       /**
       * Привязать новый список по имени
       * @param name {String} Имя списка
       * @see viewName
       */
      setViewName: function(name) {
         this._unbindView();
         this._options.viewName = name;
         this._bindView();
      },

      _unbindView: function() {
         if (this._view) {
            this._view.unsubscribe('onItemActivate', this._onItemActivateHandler);
         }
         if (this._columnsController) {
            this._columnsController.destroy();
         }
         if (this._backButton) {
            this._backButton.unsubscribe('onArrowActivated', this._folderEditHandler);
         }
         if (this._componentBinder) {
            this._componentBinder.destroy();
         }
         if (this._filterButton) {
            this.unsubscribeFrom(this._filterButton, 'onApplyFilter', this._onApplyFilterHandler);
         }
      },

      _bindView: function() {
         var
            self = this;
         this._view = this._getView();
         this._view.subscribe('onItemActivate', this._onItemActivateHandler);

         if (this._options.columnsConfig) {
            this._initColumnsController();
         }

         this._hierMode = checkViewType(this._view);

         if (this._hierMode) {
            this._backButton = this._getBackButton();
            this._breadCrumbs = this._getBreadCrumbs();
            if (this._backButton && this._breadCrumbs) {
               this._backButton.subscribe('onArrowActivated', this._folderEditHandler);
               this._componentBinder = new ComponentBinder({
                  backButton : this._backButton,
                  breadCrumbs : this._breadCrumbs,
                  view: this._view,
                  backButtonTemplate: this._options.backButtonTemplate
               });
               this._componentBinder.bindBreadCrumbs();
            }
            else {
               this._componentBinder = new ComponentBinder({
                  view: this._view
               });
            }
         }
         else {
            this._componentBinder = new ComponentBinder({
               view: this._view
            });
         }

         this._searchForm = this._getSearchForm();
         if (this._searchForm) {
            this._componentBinder.bindSearchGrid(
               this._options.searchParam,
               this._options.searchCrumbsTpl,
               this._searchForm,
               this._options.searchMode,
               false,
               this._options.keyboardLayoutRevert,
               this._options.hierarchyViewMode);
         }


         this._operationsPanel = this._getOperationsPanel();
         if (this._operationsPanel) {
            this._componentBinder.bindOperationPanel(!this._options.showCheckBoxes, this._operationsPanel);
            //Временное решение. Необходимо для решения ошибки: https://inside.tensor.ru/opendoc.html?guid=18468d65-ec58-4e2d-a0f0-fc35af4dfde5
            //Если Browser переделать на flex-box то такие придроты не понадобятся.
            //Выписана задача https://inside.tensor.ru/opendoc.html?guid=04d2ea0c-133c-4ee1-bf9b-4b222921b7d3
            this._operationsPanel.subscribe('onToggle', function() {
               self._container.toggleClass('controls-Browser__operationPanel-opened', this.isVisible());
            });
         }

         this._filterButton = this._getFilterButton();
         this._fastDataFilter = this._getFastDataFilter();

         if (this._filterButton) {
            this.subscribeTo(this._filterButton, 'onApplyFilter', this._onApplyFilterHandler);
            if(this._options.historyId) {
               this._bindFilterHistory();
            } else {
               this._notifyOnFiltersReady();
            }
         } else {
            this._notifyOnFiltersReady();
         }

         if(this._options.pagingId && this._view.getProperty('showPaging')) {
            this._componentBinder.bindPagingHistory(this._view, this._options.pagingId);
         }

         //Необходимо вызывать bindFilters, который выполняет подписку на applyFilter, позже, иначе произойдет неверная синхронизация фильтров при биндинге структуры
         if (this.isInitialized()) {
            this._onInitBindingsHandler();
         }
         else {
            this.subscribe('onInit', this._onInitBindingsHandler);
         }
      },

      _initColumnsController: function() {
         var
            columnsState;
         this._columnsController = new ColumnsController();
         columnsState = this._columnsController.getState();
         if (!columnsState) {
            this._columnsController.setState(this._options.columnsConfig.selectedColumns);
         }
         this._getView().setColumns(this._columnsController.getColumns(this._options.columnsConfig.columns));
         this._getView().redraw();
      },

      _onItemActivate: function(e, itemMeta) {
         this._notifyOnEditByActivate(itemMeta);
      },

      _onApplyFilter:function() {
         (this._searchForm || this.getView()).setActive(true);
      },

      _onInitBindings: function() {
         if( (this._filterButton || this._fastDataFilter) &&
            /* Новый механизм включаем, только если нет биндов на структуру фильтров (такая проверка временно) */
            (!this._filterButton || this._filterButton && !cFind(this._filterButton._getOptions().bindings, function(obj) {return obj.propName === 'filterStructure'}))) {
            this._componentBinder.bindFilters(this._filterButton, this._fastDataFilter, this._view);
         }
      },

      /**
       * Установить отображение нового пути для хлебных крошек и кнопки назад
       * @param {Array} path новый путь, последний элемент попадает в BackButton, остальные в хлебные крошки
       */
      setPath: function(path){
         this._componentBinder.setPath(path);
      },

      /**
       * Устанавливает занчение идентификатора истории
       * @param id
       */
      setHistoryId: function(id) {
         this._options.historyId = id;
         this._bindFilterHistory();
      },

      _bindFilterHistory: function() {
         if(this._filterButton && this._options.historyId) {
            this._componentBinder.bindFilterHistory(
               this._filterButton,
               this._fastDataFilter,
               this._options.searchParam,
               this._options.historyId,
               this._options.ignoreFiltersList,
               this._options.applyHistoryFilterOnLoad,
               this,
               this._options.updateFilterHistory,
               this._options.saveRootInHistory);
         }
      },

      _notifyOnFiltersReady: function() {
         var fastFilter = this._fastDataFilter;

         /* Если фильтр скрыт, то не будем его отображать */
         if(fastFilter && fastFilter.isVisible()) {
            fastFilter.getContainer().removeClass('ws-hidden');
         }
         this._notify('onFiltersReady');
      },

      _getLinkedControl: function(name) {
         var ctrl = null;
         if (this.hasChildControlByName(name)) {
            ctrl = this.getChildControlByName(name);
         }
         return ctrl;
      },

      _getView: function() {
         return this._getLinkedControl(this._options.viewName);
      },
      _getFilterButton: function() {
         return this._getLinkedControl('browserFilterButton');
      },
      _getSearchForm: function() {
         return this._getLinkedControl('browserSearch');
      },
      _getColumnsEditorButton: function() {
         return this._getLinkedControl('browserColumnsEditorButton');
      },
      _getBackButton: function() {
         return this._getLinkedControl('browserBackButton');
      },
      _getBreadCrumbs: function() {
         return this._getLinkedControl('browserBreadCrumbs');
      },
      _getOperationsPanel: function() {
         return this._getLinkedControl('browserOperationsPanel');
      },
      _getFastDataFilter: function() {
         return this._getLinkedControl('browserFastDataFilter');
      },

      _notifyOnEditByActivate: function(itemMeta) {
         this._notify('onEdit', itemMeta)
      },

      destroy: function() {
         if (this._columnsController) {
            this._columnsController.destroy();
            this._columnsController = null;
         }
         Browser.superclass.destroy.apply(this, arguments);
      }
   });

   Browser.ChangeColumnsResult = ChangeColumnsResult;

   return Browser;
});