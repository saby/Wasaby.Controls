define('js!SBIS3.CONTROLS.Browser', [
   'js!SBIS3.CORE.CompoundControl',
   'html!SBIS3.CONTROLS.Browser',
   'js!SBIS3.CONTROLS.ComponentBinder',
   'html!SBIS3.CONTROLS.Browser/resources/contentTpl',
   'Core/core-instance'
], function(CompoundControl, dotTplFn, ComponentBinder, contentTpl, cInstance){
   'use strict';

   /**
    * Базовый класс для реестра
    *
    * @class SBIS3.CONTROLS.Browser
    * @extends $ws.proto.CompoundControl
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
       * @event onEdit при редактировании/создании записи
       * @event onEditCurrentFolder при редактировании записи текущей папки (только в случае иерархического представления!)
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {String} id Ид редактируемой записи. Для добавления будет null
       * @param {SBIS3.CONTROLS.Record} item Редактируемая запись
       * @example
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
            contentTpl : contentTpl
         }
      },

      $constructor: function () {

      },

      init: function() {
         var self = this;
         this._publish('onEdit', 'onEditCurrentFolder', 'onFiltersReady');
         Browser.superclass.init.apply(this, arguments);
         this._view = this._getView();
         this._view.subscribe('onItemActivate', function(e, itemMeta) {
            self._notifyOnEditByActivate(itemMeta);
         });


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
            this._componentBinder.bindSearchGrid(this._options.searchParam, this._options.searchCrumbsTpl, this._searchForm, this._options.searchMode);
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
            if(this._options.historyId) {
               this._componentBinder.bindFilterHistory(
                   this._filterButton,
                   this._fastDataFilter,
                   this._options.searchParam,
                   this._options.historyId,
                   this._options.ignoreFiltersList,
                   this._options.applyHistoryFilterOnLoad,
                   this);
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
      }

   });

   return Browser;
});