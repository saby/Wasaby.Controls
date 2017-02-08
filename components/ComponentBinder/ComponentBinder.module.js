define('js!SBIS3.CONTROLS.ComponentBinder',
    [
       "Core/Abstract",
       "Core/core-functions",
       "Core/core-merge",
       "Core/constants",
       'js!SBIS3.CONTROLS.HistoryController',
       'js!SBIS3.CONTROLS.SearchController',
       'js!SBIS3.CONTROLS.ScrollPagingController',
       'js!SBIS3.CONTROLS.PagingController',
       'js!SBIS3.CONTROLS.BreadCrumbsController',
       'js!SBIS3.CONTROLS.FilterHistoryController',
       'js!SBIS3.CONTROLS.FilterHistoryControllerUntil',
       "Core/helpers/collection-helpers",
       "Core/core-instance",
       "Core/helpers/functional-helpers"
    ],
    function (cAbstract, cFunctions, cMerge, constants, HistoryController, SearchController, ScrollPagingController, PagingController, BreadCrumbsController, FilterHistoryController, FilterHistoryControllerUntil, colHelpers, cInstance, fHelpers) {
   /**
    * Контроллер для осуществления базового взаимодействия между компонентами.
    *
    * @class SBIS3.CONTROLS.ComponentBinder
    * @extends Core/Abstract
    * @author Крайнов Дмитрий Олегович
    * @public
    */
   /*методы для поиска*/

   function toggleCheckBoxes(operationPanel, gridView, hideCheckBoxes) {
      if (gridView._options.multiselect) {
         gridView._container.toggleClass('controls-ListView__showCheckBoxes', operationPanel.isVisible());
         if (hideCheckBoxes) {
            gridView.toggleCheckboxes(operationPanel.isVisible());
            gridView.removeItemsSelectionAll();
         }
         if (gridView._options.startScrollColumn !== undefined) {
            gridView.updateScrollAndColumns();
         }
      }
   }
   function drawItemsCallback(operationPanel, view) {
      //TODO: После перехода на экшены, кнопки ни чего знать о view не будут, и этот костыль уйдёт.
      colHelpers.forEach(operationPanel.getItemsInstances(), function(instance) {
         if (cInstance.instanceOfModule(instance, 'SBIS3.CONTROLS.OperationsMark')) {
            instance.setLinkedView(view);
         } else {
            instance._options.linkedView = view;
         }
      }, this)
   }

   /**
    * Контроллер, позволяющий связывать компоненты осуществляя базовое взаимодейтсие между ними
    * @author Крайнов Дмитрий
    * @class SBIS3.CONTROLS.ComponentBinder
    * @extends Core/Abstract
    * @public
    */
   var ComponentBinder = cAbstract.extend(/**@lends SBIS3.CONTROLS.ComponentBinder.prototype*/{
      $protected : {
         _options: {
            /**
             * @cfg {SBIS3.CONROLS.DataGridView} объект представления данных
             */
            view: undefined,
            /**
             * @cfg {SBIS3.CONROLS.BreadCrumbs} объект хлебных крошек
             */
            breadCrumbs: undefined,
            /**
             * @cfg {SBIS3.CONROLS.BackButton} объект кнопки назад
             */
            backButton: undefined,
            /**
             * @cfg {SBIS3.CONROLS.SearchForm} объект строки поиска
             */
            searchForm: undefined,
            /**
             * @cfg {SBIS3.CONROLS.OperationsPanel} объект панели массовых операций
             */
            operationPanel: undefined,
            /**
             * @cfg {SBIS3.CONROLS.FilterButton} объект кнопки фильтров
             */
            filterButton: undefined,
            /**
             * @cfg {SBIS3.CONROLS.Pagign} объект пэйджинга
             */
            paging: undefined
         },
         _historyController: null,
         _searchController: null,
         _scrollPagingController: null,
         _pagingController: null,
         _breadCrumbsController: null,
         _filterHistoryController: null,
         _pagingHistoryController: null
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
       * @param {SBIS3.CONROLS.SearchForm} [searchForm] объект формы поиска, если не передан используется тот, что задан в опциях
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
      bindSearchGrid : function(searchParamName, searchCrumbsTpl, searchForm, searchMode, doNotRespondOnReset) {
         if (!this._searchController){
            this._searchController = new SearchController({
               view: this._options.view,
               searchForm: searchForm || this._options.searchForm,
               searchParamName: searchParamName,
               searchCrumbsTpl: searchCrumbsTpl,
               searchMode: searchMode,
               doNotRespondOnReset: doNotRespondOnReset,
               breadCrumbs: this._options.breadCrumbs,
               backButton: this._options.backButton
            });
         }
         this._searchController.bindSearch();
      },
      bindSearchComposite: function() {
         this.bindSearchGrid.apply(this, arguments);
      },

      /**
       * Метод для связывания хлебных крошек с представлением данных
       * для работы необходимо задать опциию view
       * @param {SBIS3.CONROLS.BreadCrumbs} [breadCrumbs] объект хлебных крошек, если не передан используется тот, что задан в опциях
       * @param {SBIS3.CONROLS.BackButton} [backButton] объект книпоки назад, если не передан используется тот, что задан в опциях
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
      bindBreadCrumbs: function(breadCrumbs, backButton){
         if (!this._breadCrumbsController){
            this._breadCrumbsController = new BreadCrumbsController({
               view: this._options.view,
               breadCrumbs: breadCrumbs || this._options.breadCrumbs,
               backButton: backButton || this._options.backButton
            });
         }
         this._breadCrumbsController.bindBreadCrumbs(breadCrumbs, backButton);
      },
      /**
       * Метод для связывания панели массовых оперций с представлением данных
       * для работы необходимо задать опциию view
       * @param {Boolean} hideCheckBoxes флаг, показывающий, скрывать checkBox'ы для отметки записей
       * @param {SBIS3.CONROLS.OperationsPanel} [operationPanel] объект панели массовых операций, если не передан используется тот, что задан в опциях
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
         toggleCheckBoxes(operationPanel, view, hideCheckBoxes);
         view.subscribe('onSelectedItemsChange', function(event, idArray) {
            if (idArray.length && !operationPanel.isVisible()) {
               operationPanel.show();
            }
            operationPanel.onSelectedItemsChange(idArray);
         });
         operationPanel.subscribe('onToggle', function() {
            toggleCheckBoxes(operationPanel, view, hideCheckBoxes);
         });
      },
      /**
       * Метод для связывания истории фильтров с представлением данных
       */
      bindFilterHistory: function(filterButton, fastDataFilter, searchParam, historyId, ignoreFiltersList, applyOnLoad, browser) {
         var noSaveFilters = ['Разворот', 'ВидДерева'],
            view, filter, preparedStructure;

         if(browser) {
            view = browser.getView();
         }

         if(searchParam) {
            noSaveFilters.push(searchParam);
         }

         if(cInstance.instanceOfMixin(view, 'SBIS3.CONTROLS.TreeMixin')) {
            noSaveFilters.push(view.getParentProperty());
         }

         if(ignoreFiltersList && ignoreFiltersList.length) {
            noSaveFilters = noSaveFilters.concat(ignoreFiltersList);
         }

         if(this._filterHistoryController) {
            this._filterHistoryController.destroy();
         }

         this._filterHistoryController = new FilterHistoryController({
            historyId: historyId,
            filterButton: filterButton,
            fastDataFilter: fastDataFilter,
            view: view,
            noSaveFilters: noSaveFilters
         });

         filterButton.setHistoryController(this._filterHistoryController);
         if(applyOnLoad) {
            filter = this._filterHistoryController.getActiveFilter();

            if(filter) {
               /* Надо вмерживать структуру, полученную из истории, т.к. мы не сохраняем в историю шаблоны строки фильтров */
               preparedStructure = FilterHistoryControllerUntil.prepareStructureToApply(filter.filter, filterButton.getFilterStructure());

               if(ignoreFiltersList && ignoreFiltersList.length) {
                  FilterHistoryControllerUntil.resetStructureElementsByFilterKeys(filterButton, preparedStructure, ignoreFiltersList);
               }

               filterButton.setFilterStructure(preparedStructure);
            }
         }

         if(browser) {
            setTimeout(fHelpers.forAliveOnly(function () {
               // Через timeout, чтобы можно было подписаться на соыбтие, уйдёт с серверным рендерингом
               browser._notifyOnFiltersReady();
            }, view), 0);
         }
      },

      bindPagingHistory: function(view, id) {
         this._pagingHistoryController = new HistoryController({historyId: id});
         var historyLimit = this._pagingHistoryController.getHistory();

         if(historyLimit) {
            view.setPageSize(historyLimit, true);
         }

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
            })
         }
      },

      //TODO: избавиться - зовется из ListView
      _updateScrollPages: function(reset){
         if (this._scrollPagingController){
            this._scrollPagingController.updateScrollPages(reset);
         }
      },

      bindScrollPaging: function(paging) {
         if (!this._scrollPagingController) {
            this._scrollPagingController = new ScrollPagingController({
               view: this._options.view,
               paging: paging || this._options.paging
            })
         }
         this._scrollPagingController.bindScrollPaging();
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
         ComponentBinder.superclass.destroy.call(this);
      }

   });

   return ComponentBinder;
});
