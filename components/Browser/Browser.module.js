define('js!SBIS3.CONTROLS.Browser', [
   'js!SBIS3.CORE.CompoundControl',
   'tmpl!SBIS3.CONTROLS.Browser',
   'js!SBIS3.CONTROLS.ComponentBinder',
   'js!SBIS3.CONTROLS.ColumnsController',
   'Core/core-merge',
   'js!SBIS3.CONTROLS.Utils.TemplateUtil',
   'Core/core-instance',
   'css!SBIS3.CONTROLS.Browser'
], function(CompoundControl, dotTplFn, ComponentBinder, ColumnsController, cMerge, tplUtil, cInstance){
   'use strict';

   /**
    * Базовый класс для реестра
    *
    * @class SBIS3.CONTROLS.Browser
    * @extends SBIS3.CORE.CompoundControl
    * @author Крайнов Дмитрий Олегович
    * @demo SBIS3.CONTROLS.Demo.MyBrowser
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
         if (view && cInstance.instanceOfModule(view, 'SBIS3.CONTROLS.ListView')) {
            return cInstance.instanceOfMixin(view, 'SBIS3.CONTROLS.TreeMixin');
         }
         else {
            throw new Error('Browser: Can\'t define linkedView');
         }
      };

   var Browser = CompoundControl.extend( /** @lends SBIS3.CONTROLS.Browser.prototype */{
      /**
       * @event onEdit Происходит при редактировании или создании новой записи реестра.
       * @remark
       * Для <a href='https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/components/list/list-settings/list-types/#_4'>иерархических списков</a> событие происходит только для записей типа "Лист" (см. <a href='https://wi.sbis.ru/doc/platform/developmentapl/workdata/structure/vocabl/tabl/relations/#hierarchy'>Иерархия</a>).
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {Object} meta Мета параметры события.
       * @param {String|Number} meta.id Идентификатор записи. В случае создания новой записи значение параметра - null.
       * @param {WS.Data/Entity/Record} meta.item Экземпляр класса записи. В случае создания новой записи значение параметра - null.
       */
      /**
       * @event onEditCurrentFolder Происходит при редактировании или создании новой папки (записей типа "Узел" и "Скрытый узел").
       * @remark
       * Подробнее о типах записей читайте в разделе <a href='https://wi.sbis.ru/doc/platform/developmentapl/workdata/structure/vocabl/tabl/relations/#hierarchy'>Иерархия</a>.
       * Событие актуально только для <a href='https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/components/list/list-settings/list-types/#_4'>иерархических списков</a>.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {String} id Идентификатор редактируемой папки. В случае добавления новой папки значение параметра - null.
       */
      /**
       * @event onFiltersReady Происходит после построения экземпляра классов окружения списка: "Быстрый фильтр" (см. {@link SBIS3.CONTROLS.FastDataFilter}) и "Кнопки с фильтром" (см. {@link SBIS3.CONTROLS.FilterButton}).
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       */
      /**
       * @typedef {Object} СolumnsConfigObject
       * @property {WS.Data/Collection/RecordSet} columns Набор записей, каждая из которых описывает элемент панели редактирования колонок. <br/>
       * Поля записи:
       * <ol>
       *    <li><b>id (String)</b> - идентификатор элемента.</li>
       *    <li><b>title (String)</b> - отображаемый текст элемента.</li>
       *    <li><b>fixed (Boolean)</b> - признак "Фиксированный". На панели редактирования колонок элементы с таким признаком выбраны и недоступны для взаимодействия, а колонки элемента, описанные в опции **columnConfig**, всегда отображены в списке.</li>
       *    <li><b>columnConfig (Array)</b> - массив с конфигурацией колонок (см. {@link SBIS3.CONTROLS.DataGridView#columns columns}).</li>
       * </ol>
       * @property {Array.<String|Number>} selectedColumns Массив идентификаторов элементов, которые будут отмечены на панели редактирования колонок. Параметр актуален для элементов с опцией *fixed=false*.
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
             * @cfg {Boolean} showCheckBoxes необходимо ли показывать чекбоксы, когда панель массовых операций закрыта.
             */
            showCheckBoxes: false,
	        contentTpl: null,
            /**
             * @cfg {СolumnsConfigObject} Устанавливает параметры для Панели редактирования колонок.
             * @remark
             * Вызов панели производят кликом по иконке с шестерёнкой, которая расположена справа от строки поиска.
             * Иконка отображается, когда в опции установлено значение.
             * @example
             * 1. В файле MyColumnsConfig.module.js описан RecordSet для конфигурации Панели редактирования колонок:
             * <pre>
             * define('js!SBIS3.MyArea.MyColumnsConfig', ['js!WS.Data/Collection/RecordSet'], function(RecordSet) {
             *    var data = [
             *        {
             *           id: 1,
             *           title: 'Базовая группа колонок',
             *
             *           // Признак "Фиксированный"
             *           fixed: true,
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
             *       },
             *       {
             *          id: 2,
             *          title: 'Колонка "Дата выпуска"',
             *          fixed: false,
             *          columnConfig: [{
             *              title: 'Дата выпуска',
             *              field: 'Дата_выпуска'
             *          }]
             *       },
             *       ...
             *    ];
             *    return new RecordSet({
             *       rawData: data,
             *       idProperty: 'id'
             *    });
             * });
             * </pre>
             * 2. Для JS-модуль реестра импортирован RecordSet:
             * <pre>
             * define('js!SBIS3.MyArea.MyReportBrowser',[ ... , 'js!SBIS3.MyArea.MyColumnsConfig'], function(... , MyColumnsConfig) {
             *    ...
             *    $protected: {
             *       _options : {
             *
             *          // Создана опция для конфигурации опции columnsConfig
             *          _columnsConfig: {
             *             columns: myConfig,
             *             selectedColumns: [2, 3]
             *          }
             *       }
             *    }
             *    ...
             * });
             * </pre>
             * 3. В разметке реестра передана конфигурация в опцию columnsConfig:
             * <pre>
             *     <ws:SBIS3.Engine.ReportBrowser columnsConfig="{{ _columnsConfig }}">
             *         ...
             *     </ws:SBIS3.Engine.ReportBrowser>
             * </pre>
             * @see setColumnsConfig
             * @see getColumnsConfig
             */
            columnsConfig: null,
            /**
             * @cfg {Boolean} hierarchyViewMode Включать группировку при поиске.
             */
            hierarchyViewMode: true
         }
      },

      $constructor: function () {
      },

      init: function() {
         var
            self = this,
            columnsState;
         this._publish('onEdit', 'onEditCurrentFolder', 'onFiltersReady');
         Browser.superclass.init.apply(this, arguments);
         this._view = this._getView();
         this._view.subscribe('onItemActivate', function(e, itemMeta) {
            self._notifyOnEditByActivate(itemMeta);
         });

         if (this._options.columnsConfig) {
            this._columnsController = new ColumnsController();
            columnsState = this._columnsController.getState();
            if (!columnsState) {
               this._columnsController.setState(this._options.columnsConfig.selectedColumns);
            }
            this._getView().setColumns(this._columnsController.getColumns(this._options.columnsConfig.columns));
            this._getView().redraw();
            this._columnsEditor = this._getColumnsEditor();
            if (this._columnsEditor) {
               this._columnsEditor.subscribe('onSelectedColumnsChange', this._onSelectedColumnsChange.bind(this));
               this._columnsEditor.subscribe('onColumnsEditorShow', this._onColumnsEditorShow.bind(this));
            }
         }

         this._hierMode = checkViewType(this._view);


         if (this._hierMode) {
            this._backButton = this._getBackButton();
            this._breadCrumbs = this._getBreadCrumbs();
               if (this._backButton && this._breadCrumbs) {
                  this._backButton.subscribe('onArrowActivated', this._folderEditHandler.bind(this));
                  this._componentBinder = new ComponentBinder({
                     backButton : this._backButton,
                     breadCrumbs : this._breadCrumbs,
                     view: this._view
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
            this.subscribeTo(this._filterButton, 'onApplyFilter', function() {
               self.getView().setActive(true);
            });

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
      },

      _onSelectedColumnsChange: function(event, columns) {
         this._columnsController.setState(columns);
         this._getView().setColumns(this._columnsController.getColumns(this._options.columnsConfig.columns));
         this._getView().redraw();
      },
      /**
       * Устанавливает параметры для Панели конфигурации колонок списка.
       * @param config {Object} Конфигурация.
       * @see columnsConfig
       * @see getColumnsConfig
       */
      setColumnsConfig: function(config) {
         this._options.columnsEditorConfig = config;
         this._notifyOnPropertyChanged('columnsEditorConfig');
      },
      /**
       * Возвращает параметры, установленные для Панели конфигурации колонок списка.
       * @returns {Object} Конфигурация.
       * @see columnsConfig
       * @see setColumnsConfig
       */
      getColumnsConfig: function() {
         return this._options.columnsConfig;
      },

      _onColumnsEditorShow: function(event) {
         event.setResult({
            columns: this._options.columnsConfig.columns,
            selectedColumns: this._columnsController.getState()
         });
      },

      _modifyOptions: function() {
         var options = Browser.superclass._modifyOptions.apply(this, arguments);

	      if (!options.contentTpl) {
		      options.contentTpl = tplUtil.prepareTemplate(options.content);
	      }

         return options;
      },

      _folderEditHandler: function(){
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
               this);
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
         return this._getLinkedControl('browserView');
      },
      _getFilterButton: function() {
         return this._getLinkedControl('browserFilterButton');
      },
      _getSearchForm: function() {
         return this._getLinkedControl('browserSearch');
      },
      _getColumnsEditor: function() {
         return this._getLinkedControl('browserColumnsEditor');
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

   return Browser;
});