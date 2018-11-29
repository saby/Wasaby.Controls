define('SBIS3.CONTROLS/ComponentBinder',
    [
       "Core/Abstract",
       'SBIS3.CONTROLS/History/HistoryController',
       'SBIS3.CONTROLS/ComponentBinder/SearchController',
       'SBIS3.CONTROLS/ComponentBinder/ScrollPagingController',
       'SBIS3.CONTROLS/ComponentBinder/PagingController',
       'SBIS3.CONTROLS/ComponentBinder/BreadCrumbsController',
       'SBIS3.CONTROLS/Filter/HistoryController',
       'SBIS3.CONTROLS/Filter/HistoryController/FilterHistoryControllerUntil',
       'SBIS3.CONTROLS/ComponentBinder/DateRangeRelationController',
       'SBIS3.CONTROLS/ComponentBinder/FilterController',
       "Core/core-instance",
        'Core/helpers/Function/forAliveOnly',
       "Core/helpers/Object/find",
       "Core/Deferred"
    ],
    function (cAbstract, HistoryController, SearchController, ScrollPagingController, PagingController, BreadCrumbsController, FilterHistoryController, FilterHistoryControllerUntil, DateRangeRelationController, FilterController, cInstance, forAliveOnly, find, Deferred) {
   /**
    * Контроллер для осуществления базового взаимодействия между компонентами.
    *
    * @class SBIS3.CONTROLS/ComponentBinder
    * @extends Core/Abstract
    * @author Крайнов Д.О.
    * @public
    */
   /*методы для поиска*/

   function toggleCheckBoxes(visible, gridView, hideCheckBoxes) {
      //Вешаем класс даже для браузеров с multiselect = false, т.к. multiselect может измениться динамически, и проще
      //всегда тоглить классы, чем отслеживать изменение multiselect на браузере
      gridView.getContainer().toggleClass('controls-ListView__showCheckBoxes', visible);
      if (hideCheckBoxes) {
         gridView.toggleCheckboxes(visible);
      }
      if (gridView._options.startScrollColumn !== undefined && gridView._isPartScrollVisible) {
         gridView.updateScrollAndColumns();
      }
      if (cInstance.instanceOfModule(gridView, 'SBIS3.CONTROLS/Tree/DataGridView')) {
         gridView._updateEditArrow();
         gridView._checkBreadCrumbsWidth();
      }
   }
   function drawItemsCallback(operationPanel, view) {
      var instances = operationPanel.getItemsInstances();
      //TODO: После перехода на экшены, кнопки ни чего знать о view не будут, и этот костыль уйдёт.
      for (var key in instances) {
         if (instances.hasOwnProperty(key)) {
            if (typeof instances[key].setLinkedView == 'function') {
               instances[key].setLinkedView(view);
            } else {
               instances[key]._options.linkedView = view;
            }
         }
      }
   }

   /**
    * Контроллер, позволяющий связывать компоненты осуществляя базовое взаимодейтсие между ними
    * @author Герасимов А.М.
    * @class SBIS3.CONTROLS/ComponentBinder
    * @extends Core/Abstract
    * @public
    */
   var ComponentBinder = cAbstract.extend(/**@lends SBIS3.CONTROLS/ComponentBinder.prototype*/{
      /**
       * @event onDatesChange Происходит при изменении значения хотя бы одного из синхронизируемых контролов.
       * @param {Core/EventObject} eventObject Дескриптор события.
       */
      $protected : {
         _options: {
            /**
             * @cfg {SBIS3.CONTROLS/DataGridView} объект представления данных
             */
            view: undefined,
            /**
             * @cfg {SBIS3.CONTROLS/BreadCrumbs} объект хлебных крошек
             */
            breadCrumbs: undefined,
            /**
             * @cfg {SBIS3.CONTROLS/Button/BackButton} объект кнопки назад
             */
            backButton: undefined,
            /**
             * @cfg {SBIS3.CONTROLS/SearchForm} объект строки поиска
             */
            searchForm: undefined,
            /**
             * @cfg {SBIS3.CONTROLS/OperationsPanel} объект панели массовых операций
             */
            operationPanel: undefined,
            /**
             * @cfg {SBIS3.CONTROLS/Filter/Button} объект кнопки фильтров
             */
            filterButton: undefined,
            /**
             * @cfg {SBIS3.CONTROLS/Paging} Устанавливает конфигурацию постраничной навигации.
             * @remark
             * В качестве значения передают экземпляр класса {@link SBIS3.CONTROLS/Paging}.
             * <pre>
             *     // создаём экземпляр класса контрола "Постраничная навигация"
             *     var myPaging = new Paging({
             *
             *           // устанавливаем режим полной постраничной навигации
             *           mode: 'full',
             *
             *           // устанавливаем отображение по 10 элементов на странице
             *           pagesCount: 10
             *        }),
             *        ...
             *        myComponentBinder = new ComponentBinder({
             *           ...
             *
             *           // передаём конфигурацию постраничной навигации
             *           paging: myPaging
             *        });
             * </pre>
             */
            paging: undefined,
            /**
             * @cfg {SBIS3.CONTROLS.DateRangeSlider[]} массив из контролов диапазонов дат.
             */
            dateRanges: undefined
         },
         _historyController: null,
         _searchController: null,
         _scrollPagingController: null,
         _pagingController: null,
         _breadCrumbsController: null,
         _filterHistoryController: null,
         _pagingHistoryController: null,
         _dateRangeRelationController: null,
         _filterController: null
      },

      /**
       * Установить отображение нового пути для хлебных крошек и кнопки назад
       * @param {Array} path новый путь, последний элемент попадает в BackButton, остальные в хлебные крошки
       */
      setPath: function(path){
         if (this._breadCrumbsController) {
            this._breadCrumbsController.setPath(path);
         }

      },

      getCurrentRootRecord: function(){
         if (this._breadCrumbsController) {
            return this._breadCrumbsController.getCurrentRootRecord();
         }
         else {
            return null
         }
      },

      /**
       * Метод для связывания формы строки поиска с представлением данных.
       * для работы необходимо задать опциию view
       * @param {String} searchParamName параметр фильтрации для поиска
       * @param {String} searchCrumbsTpl шаблон отрисовки элемента пути в поиске
       * @param {SBIS3.CONTROLS/SearchForm} [searchForm] объект формы поиска, если не передан используется тот, что задан в опциях
       * @param {String} [searchMode] В каком узле ищем, в текущем или в корне
       * @example
       * <pre>
       *     myBinder = new ComponentBinder({
       *        view: myGridView,
       *        searchForm: mySearchForm
       *     });
       *     myBinder.bindSearchGrid('СтрокаПоиска');
       * </pre>
       */
      bindSearchGrid : function(searchParamName, searchCrumbsTpl, searchForm, searchMode, doNotRespondOnReset, keyboardLayoutRevert, hierarchyViewMode) {
         if (!this._searchController){
            var cfg;
            
            if(searchParamName instanceof Object) {
               cfg = searchParamName;
            } else {
               cfg = {
                  searchParamName: searchParamName,
                  searchCrumbsTpl: searchCrumbsTpl,
                  searchMode: searchMode,
                  doNotRespondOnReset: doNotRespondOnReset
               }
            }
            
            cfg.view = this._options.view;
            cfg.searchForm = searchForm || this._options.searchForm;
            cfg.breadCrumbs = this._options.breadCrumbs;
            cfg.backButton = this._options.backButton;
            cfg.keyboardLayoutRevert = keyboardLayoutRevert === undefined ? true : keyboardLayoutRevert;
            cfg.hierarchyViewMode = hierarchyViewMode === undefined ? true : hierarchyViewMode;
            
            this._searchController = new SearchController(cfg);
         }
         this._searchController.bindSearch();
      },
      bindSearchComposite: function() {
         this.bindSearchGrid.apply(this, arguments);
      },

      /**
       * Метод для связывания хлебных крошек с представлением данных
       * для работы необходимо задать опциию view
       * @param {SBIS3.CONTROLS/BreadCrumbs} [breadCrumbs] объект хлебных крошек, если не передан используется тот, что задан в опциях
       * @param {SBIS3.CONTROLS/Button/BackButton} [backButton] объект книпоки назад, если не передан используется тот, что задан в опциях
       * @example
       * <pre>
       *     myBinder = new ComponentBinder({
       *        view: myGridView,
       *        breadCrumbs: myBreadCrumbs,
       *        backButton: myBackButton
       *     });
       *     myBinder.bindBreadCrumbs();
       * </pre>
       */
      bindBreadCrumbs: function(breadCrumbs, backButton, backButtonTemplate){
         if (!this._breadCrumbsController){
            this._breadCrumbsController = new BreadCrumbsController({
               view: this._options.view,
               breadCrumbs: breadCrumbs || this._options.breadCrumbs,
               backButton: backButton || this._options.backButton,
               backButtonTemplate: backButtonTemplate || this._options.backButtonTemplate
            });
         }
         this._breadCrumbsController.bindBreadCrumbs(breadCrumbs, backButton);
      },
      /**
       * Метод для связывания панели массовых оперций с представлением данных
       * для работы необходимо задать опциию view
       * @param {Boolean} hideCheckBoxes флаг, показывающий, скрывать checkBox'ы для отметки записей
       * @param {SBIS3.CONTROLS/OperationsPanel} [operationPanel] объект панели массовых операций, если не передан используется тот, что задан в опциях
       * в представлении данных вместе с панелью или нет.
       * @example
       * <pre>
       *     myBinder = new ComponentBinder({
       *        view: myGridView,
       *        operationPanel: myOperationPanel
       *     });
       *     myBinder.bindOperationPanel(true);
       * </pre>
       */
      bindOperationPanel: function(hideCheckBoxes, operationPanel) {
         var view = this._options.view;
         operationPanel = operationPanel || this._options.operationPanel;
         operationPanel.subscribe('onDrawItems', function() {
            drawItemsCallback(operationPanel, view);
         });
         drawItemsCallback(operationPanel, view);
         toggleCheckBoxes(operationPanel.isVisible(), view, hideCheckBoxes);
         view.subscribe('onSelectedItemsChange', function(event, idArray) {
            if (idArray.length && !operationPanel.isVisible()) {
               operationPanel.show();
            }
            operationPanel.onSelectedItemsChange(idArray);
         });
         operationPanel.subscribe('onToggle', function() {
            var visible = operationPanel.isVisible();
            toggleCheckBoxes(visible, view, hideCheckBoxes);
            if (hideCheckBoxes && !visible) {
               view.removeItemsSelectionAll();
            }
         });
      },
      
      bindFilters: function(filterButton, fastDataFilter, view) {
         var self = this;
         
         if(!this._filterController) {
            this._filterController = new FilterController({
               view: view,
               filterButton: filterButton,
               fastDataFilter: fastDataFilter
            });
         }
   
         /* Из-за того, что историю фильтрации надо обновлять (из-за серверного рендеринга),
            надо и все синхронизации производить после вычитки новых параметров */
         (this._dFiltersReady || Deferred.success()).addCallback(forAliveOnly(function(res) {
            self._filterController.bindFilters();
            return res;
         }, view));
      },
      
      /**
       * Метод для связывания истории фильтров с представлением данных
       * @param {SBIS3.CONTROLS/Filter/Button} filterButton кнопка фильтра
       * @param {SBIS3.CONTROLS/Filter/FastData} fastDataFilter быстрый фильтр
       * @param {string} searchParam параметр поиска
       * @param {uuid} historyId идентификатор истории
       * @param {array} ignoreFiltersList массив ключей фильтров, которые не нужно запоминать (записывать в историю)
       * @param {boolean} applyOnLoad параметр, определяющий, нужно ли применять историю перед представления данных при загрузке
       * @param {SBIS3.CONTROLS/Browser} browser браузер
       */
      bindFilterHistory: function(filterButton, fastDataFilter, searchParam, historyId, ignoreFiltersList, applyOnLoad, browser, loadHistory, saveRootInHistory) {
            /* Этот параметр необходим для возможности делать запрос в конструкторе,
               когда мы не можем сделать соответствие фильтров по биндингам и нам нужен фильтр списка,
               но применять надо не все фильтры */
         var noSaveFilters = ['Разворот', 'ВидДерева'],
             self = this,
             byFilterButtonConfig = browser && browser._hasOption('filterButtonConfig') && find(browser._getOptions().bindings, function(elem) { return elem.propName && (elem.propName.indexOf("filterButtonConfig") !== -1); }),
             view, filter, preparedStructure;
            
         if(browser) {
            view = browser.getView();
         }

         if(searchParam) {
            noSaveFilters.push(searchParam);
         }

         if(ignoreFiltersList && ignoreFiltersList.length) {
            noSaveFilters = noSaveFilters.concat(ignoreFiltersList);
         }

         if(this._filterHistoryController) {
            this._filterHistoryController.destroy();
         }
   
         var filtersForHistory = [];
         if (saveRootInHistory && view) {
            filtersForHistory.push(view.getParentProperty());
         }
         self._filterHistoryController = new FilterHistoryController({
            historyId: historyId,
            filterButton: filterButton,
            fastDataFilter: fastDataFilter,
            view: view,
            noSaveFilters: noSaveFilters,
            filtersForHistory: filtersForHistory
         });
   
         this._dFiltersReady = historyId ? self._filterHistoryController.getHistory(true) : Deferred.success();
   
         this._dFiltersReady.addCallback(function(res) {
   
            filterButton.setHistoryController(self._filterHistoryController);
            if(applyOnLoad) {
               filter = self._filterHistoryController.getActiveFilter();
      
               if(filter) {
                  /* Надо вмерживать структуру, полученную из истории, т.к. мы не сохраняем в историю шаблоны строки фильтров */
                  preparedStructure = FilterHistoryControllerUntil.prepareStructureToApply(filter.filter, filterButton.getFilterStructure(), undefined, ignoreFiltersList);
         
                  if(ignoreFiltersList && ignoreFiltersList.length) {
                     FilterHistoryControllerUntil.resetStructureElementsByFilterKeys(filterButton, preparedStructure, ignoreFiltersList);
                  }
         
                  if (!byFilterButtonConfig) {
                     filterButton.setFilterStructure(preparedStructure);
                  }
               }
            }
   
            if(browser) {
               setTimeout(forAliveOnly(function () {
                  /* Через timeout, т.к. необходимо, чтобы уже работали бинды,
                     иначе перетрётся опция после синхронизации из контекста. + это позволяет не проставлять фильтр,
                     он проставится по биндам */
                  if(byFilterButtonConfig && filter && applyOnLoad) {
                     /* Если была забиндена не сама структура фильтров,
                        а конфиг фильтров (это происходит, когда конфиг передают объектом на новом шаблонизаторе, а не строкой),
                        то надо дополнительно обновить опцию filterButtonConfig, иначе после синхронизации сбросится стркутура. */
                     var filterButtonConfig =  browser.getProperty('filterButtonConfig');
   
                     filterButtonConfig.filterStructure = preparedStructure;
                     browser.setFilterButtonConfig(filterButtonConfig);
                     
                     if(!view.isLoading() && (!view.getItems() || !view.getItems().getCount())) {
                        filterButton.applyFilter();
                     }
                  }
                  // Через timeout, чтобы можно было подписаться на соыбтие, уйдёт с серверным рендерингом
                  browser._notifyOnFiltersReady();
               }, view), 0);
            }
            
            return res;
         });
      },

       /**
        * Метод для инициализации сохранения в историю текущего количества записей в списке
        * @param {SBIS3.CONTROLS/ListView} view представление данных
        * @param {uuid} id идентификатор истории
        */

      bindPagingHistory: function(view, id) {
         this._pagingHistoryController = new HistoryController({historyId: id});
         
         this._pagingHistoryController.getHistory(true).addCallback(function(limit) {
            if (limit) {
               view.setPageSize(limit, true);
            }
         });

         var self = this;
         view.subscribe('onPageSizeChange', function(event, pageSize) {
            self._pagingHistoryController.setHistory(pageSize, true);
         });
      },

      bindPaging: function(paging) {
         if (!this._pagingController){
            this._pagingController = new PagingController({
               view: this._options.view,
               paging: paging || this._options.paging
            });
         }
      },

      //TODO: избавиться - зовется из ListView
      _updateScrollPages: function(reset){
         if (this._scrollPagingController){
            this._scrollPagingController.updatePaging(reset);
         }
      },

      //TODO: избавиться - зовется из ListView
      _getScrollPage: function(){
         if (this._scrollPagingController){
            return this._scrollPagingController.getScrollPage();
         }
      },

      bindScrollPaging: function(paging, hidden) {
         if (!this._scrollPagingController) {
            this._scrollPagingController = new ScrollPagingController({
               view: this._options.view,
               paging: paging || this._options.paging,
               zIndex: this._options.pagingZIndex,
               hiddenPager: hidden
            });
         }
         this._scrollPagingController.bindScrollPaging();
      },

      freezePaging: function(freeze) {
         this._scrollPagingController.freezePaging(freeze);
      },

      moreThanTwo: function(state) {
         this._scrollPagingController.moreThanTwo(state);
      },
      /**
       *
       * @param dateRanges {SBIS3.CONTROLS.DateRangeSlider[]} массив из контролов диапазонов дат, если не передан используется тот, что задан в опциях.
       * @param step {Number} шаг в месяцах с которым устанавливаются периоды в контролах. Если не установлен, то в контролах
       * устанавливаются смежные периоды.
       * @param showLock {Boolean} включает или отключает отображение замка на всех связанных контроллах.
       * Если равен null или undefined, то оставляет отображение замочка без изменений.
       * @param onlyByCapacity {Boolean} только по разрядности. Т.е., выбирая новый период в одном контроле,
       * новые значения присвоятся в других контролах только если произошла смена разрядности или нарушено
       * условие I < II < III < IV< ... .
       * @param lockButton {SBIS3.CONTROLS/Button/StateButton} кнопка включаящая/выключаящая связывание компонентов.
       */
      bindDateRanges: function(dateRanges, step, showLock, onlyByCapacity, lockButton) {
         if (!this._dateRangeRelationController) {
            this._dateRangeRelationController = new DateRangeRelationController({
               dateRanges: dateRanges || this._options.dateRanges,
               step: step,
               showLock: showLock,
               onlyByCapacity: onlyByCapacity,
               lockButton: lockButton
            });
            this._dateRangeRelationController.subscribe('onDatesChange', function () {
               this._notify('onDatesChange');
            }.bind(this));
         }
         this._dateRangeRelationController.bindDateRanges();
      },

      /**
       * Shifts the period in the period selection controls back
       */
      dateRangesShiftPrev: function() {
         this._dateRangeRelationController.shiftPrev();
      },

      /**
       * Shifts the period in the period selection controls forward
       */
      dateRangesShiftNext: function() {
         this._dateRangeRelationController.shiftNext();
      },

      destroy: function(){
         if (this._historyController){
            this._historyController.destroy();
            this._historyController  = null;
         }
         if (this._searchController){
            this._searchController.destroy();
            this._searchController = null;
         }
         if (this._scrollPagingController){
            this._scrollPagingController.destroy();
            this._scrollPagingController = null;
         }
         if (this._pagingController){
            this._pagingController.destroy();
            this._pagingController = null;
         }
         if (this._breadCrumbsController){
            this._breadCrumbsController.destroy();
            this._breadCrumbsController = null;
         }
         if (this._filterHistoryController){
            this._filterHistoryController.destroy();
            this._filterHistoryController = null;
         }
         if (this._pagingHistoryController){
            this._pagingHistoryController.destroy();
            this._pagingHistoryController = null;
         }
         if (this._dateRangeRelationController){
            this._dateRangeRelationController.destroy();
            this._dateRangeRelationController = null;
         }
         ComponentBinder.superclass.destroy.call(this);
      }

   });

   return ComponentBinder;
});
