define('js!SBIS3.CONTROLS.ComponentBinder', [], function () {
   /**
    * Контроллер для осуществления базового взаимодействия между компонентами.
    *
    * @class SBIS3.CONTROLS.ComponentBinder
    * @extends $ws.proto.Abstract
    * @public
    * @param backButton объект книпоки назад
    */
   /*методы для поиска*/
   function startHierSearch(text, searchParamName, searchCrumbsTpl) {
      if (text) {
         var filter = $ws.core.merge(this._options.view.getFilter(), {
               'Разворот': 'С разворотом',
               'usePages': 'full'
            }),
            view = this._options.view,
            groupBy = view.getSearchGroupBy(searchParamName);
         if (searchCrumbsTpl) {
            groupBy.breadCrumbsTpl = searchCrumbsTpl;
         }
         filter[searchParamName] = text;
         view.setHighlightText(text, false);
         view.setHighlightEnabled(true);
         view.setInfiniteScroll(true, true);
         view.setGroupBy(groupBy);
         if (this._firstSearch) {
            this._lastRoot = view.getCurrentRoot();
            if (this._options.breadCrumbs && this._options.breadCrumbs.getDataSet()){
               this._pathDSRawData = $ws.core.clone(this._options.breadCrumbs.getDataSet().getRawData());
            }
         }
         this._firstSearch = false;
         this._searchReload = true;
         // TODO нафиг это надо
         if (this._options.breadCrumbs) {
            this._options.breadCrumbs.setItems([]);
         }
         //Скрываем кнопку назад, чтобы она не наслаивалась на колонки
         if (this._options.backButton) {
            this._options.backButton.getContainer().css({'visibility': 'hidden'});
         }

         view.reload(filter, view.getSorting(), 0).addCallback(function(){
            view._container.addClass('controls-GridView__searchMode');
         });
      }
   }

   function startSearch(text, searchParamName){
      if (text){
         var view = this._options.view,
            filter = $ws.core.merge(view.getFilter(), {
               'usePages': 'full'
            });
         filter[searchParamName] = text;
         view.setHighlightText(text, false);
         view.setHighlightEnabled(true);
         view.setInfiniteScroll(true, true);
         view.reload(filter, view.getSorting(), 0);
      }
   }

   function resetSearch(searchParamName){
      var
         view = this._options.view,
         filter = view.getFilter();
      delete (filter[searchParamName]);
      view.setHighlightText('', false);
      view.setHighlightEnabled(false);      view.reload(filter, view.getSorting(), 0);   }

   function resetGroup(searchParamName) {
      //Если мы ничего не искали, то и сбрасывать нечего
      if (this._firstSearch) {
         return;
      }
      var view = this._options.view,
         filter = $ws.core.merge(view.getFilter(), {
            'Разворот' : 'Без разворота'
         });
      delete (filter[searchParamName]);

      view.setInfiniteScroll(this._isInfiniteScroll, true);
      view.setGroupBy(this._lastGroup);
      view.setHighlightText('', false);
      view.setHighlightEnabled(false);
      this._firstSearch = true;
      if (this._searchReload ) {
         //Нужно поменять фильтр и загрузить нужный корень.
         //TODO менять фильтр в контексте, когда появятся data-binding'и
         filter[view.getHierField()] = this._lastRoot;
         //DataGridView._filter = filter;
         //DataGridView.setCurrentRoot(self._lastRoot); - плохо, потому что ВСЕ крошки на странице получат изменения
         view.reload(filter, view.getSorting(), 0);
         this._path = this._pathDSRawData || [];
         if (this._options.breadCrumbs){
            this._options.breadCrumbs.getDataSet().setRawData(this._pathDSRawData);
            this._options.breadCrumbs._redraw();
         }
         if (this._options.backButton) {
            this._options.backButton.getContainer().css({'visibility': 'visible'});
         }
      } else {
         //Очищаем крошки. TODO переделать, когда появятся привзяки по контексту
         view.setFilter(filter, true);
      }
      //При любом релоаде из режима поиска нужно снять класс
      view.once('onDataLoad', function(){
         view._container.removeClass('controls-GridView__searchMode');
      });
   }

   function breakSearch(searchForm, withReload){
      this._searchReload = !!withReload;
      this._firstSearch = true;
      //Если в строке поиска что-то есть, очистим и сбросим Фильтр
      if (searchForm.getText()) {
         searchForm.setText('');
      }
   }

   function toggleCheckBoxes(operationPanel, gridView, hideCheckBoxes) {
      if (gridView._options.multiselect && hideCheckBoxes) {
         gridView._container.toggleClass('controls-ListView__showCheckBoxes', operationPanel.isOpen())
            .toggleClass('controls-ListView__hideCheckBoxes', !operationPanel.isOpen());
      }
   }
   /**
    * Контроллер, позволяющий связывать компоненты осуществляя базовое взаимодейтсие между ними
    * @author Крайнов Дмитрий
    * @class SBIS3.CONTROLS.ComponentBinder
    * @extends $ws.proto.Abstract
    * @public
    */
   var ComponentBinder = $ws.proto.Abstract.extend(/**@lends SBIS3.CONTROLS.ComponentBinder.prototype*/{
      $protected : {
         _searchReload : true,
         _searchForm : undefined,
         _lastRoot : undefined,
         _lastGroup: {},
         _currentRoot: null,
         _pathDSRawData : [],
         _firstSearch: true,
         _lastViewMode: null,
         _path: [],
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
            filterButton: undefined
         }
      },

      /**
       * Метод для связывания формы строки поиска с представлением данных.
       * для работы необходимо задать опциию view
       * @param {String} searchParamName параметр фильтрации для поиска
       * @param {String} searchCrumbsTpl шаблон отрисовки элемента пути в поиске
       * @param {SBIS3.CONROLS.SearchForm} [searchForm] объект формы поиска, если не передан используется тот, что задан в опциях
       * @example
       * <pre>
       *     myBinder = new ComponentBinder({
       *        view: myGridView,
       *        searchForm: mySearchForm
       *     });
       *     myBinder.bindSearchGrid('СтрокаПоиска');
       * </pre>
       */
      bindSearchGrid : function(searchParamName, searchCrumbsTpl, searchForm) {
         var self = this,
            view = this._options.view,
            hierarchy = $ws.helpers.instanceOfModule(view, 'SBIS3.CONTROLS.HierarchyDataGridView');
         searchForm = searchForm || this._options.searchForm;
         if (hierarchy){
            this._lastRoot = view.getCurrentRoot();
            //searchForm.subscribe('onReset', resetGroup);
            view.subscribe('onSetRoot', function(){
               self._lastRoot = view.getCurrentRoot();
               if (self._options.backButton) {
                  self._options.backButton.getContainer().css({'visibility': 'visible'});
               }
            });
            //Перед переключением в крошках в режиме поиска сбросим фильтр поиска
            view.subscribe('onSearchPathClick', function(){
               breakSearch.call(self, searchForm, true);
            });
         }

         this._lastGroup = view._options.groupBy;
         this._isInfiniteScroll = view.isInfiniteScroll();

         searchForm.subscribe('onTextChange', function(event, text){
            if (text.length < searchForm.getProperty('startCharacter')) {
               if (hierarchy) {
                  resetGroup.call(self, searchParamName);
               } else {
                  resetSearch.call(self, searchParamName);
               }
            }
         });

         searchForm.subscribe('onSearch', function(event, text) {
            if (hierarchy) {
               startHierSearch.call(self, text, searchParamName);
            } else {
               startSearch.call(self, text, searchParamName);
            }
         });
      },
      bindSearchComposite: function(searchParamName, searchCrumbsTpl, searchForm) {
         this.bindSearchGrid.apply(this, arguments);
         /*var self = this;
          compositeView.subscribe('onDataLoad', function(){
          if (searchForm.getText().length > 2) {
          self._lastViewMode = this.getViewMode();
          this.setViewMode('table');
          } else if (self._lastViewMode) {
          this.setViewMode(self._lastViewMode);
          }
          });*/
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
         var self = this,
            view = this._options.view;

         backButton = backButton || this._options.backButton;
         breadCrumbs = breadCrumbs || this._options.breadCrumbs;

         function createBreadCrumb(data){
            var point = {};
            point[breadCrumbs._options.displayField] = $ws.helpers.escapeHtml(data.title);
            point[breadCrumbs._options.keyField] = data.id;
            point[breadCrumbs._options.colorField] = data.color;
            point.data = data.data;
            return point;
         }

         function setPreviousRoot() {
            var previousRoot = self._path[self._path.length - 1];

            if(self._currentRoot !== null) {
               self._currentRoot = previousRoot;
               if (self._path.length) self._path.splice(self._path.length - 1);
               view.setCurrentRoot(previousRoot ? previousRoot[breadCrumbs._options.keyField] : null);
            }
            view.reload();
         }

         view.subscribe('onSetRoot', function(event, id, hier){
            var i;
            /*
             TODO: Хак для того перерисовки хлебных крошек при переносе из папки в папку
             Проверить совпадение родительского id и текущего единственный способ понять,
             что в папку не провалились, а попали через перенос.
             От этого нужно избавиться как только будут новые датасорсы и не нужно будет считать пути для крошек
             */
            if (self._currentRoot && hier.length && hier[hier.length - 1].parent != self._currentRoot.id){
               self._currentRoot = hier[0];
               self._path = hier.reverse();
            } else {
               if (id === null){
                   self._currentRoot = null;
               }
               for (i = hier.length - 1; i >= 0; i--) {
                  var rec = hier[i];
                  if (rec){
                     var c = createBreadCrumb(rec);
                     if (self._currentRoot ) {
                        self._path.push(self._currentRoot);
                     } else {

                     }
                     self._currentRoot = c;
                  }
               }
            }

            for (i = 0; i < self._path.length; i++){
               if (self._path[i].id == id) {
                  self._path.splice(i);
                  break;
               }
            }

            breadCrumbs._toggleHomeIcon(!self._currentRoot);
            breadCrumbs.setItems(self._path);
            backButton.setCaption(self._currentRoot ? $ws.helpers.escapeHtml(self._currentRoot.title) : '');
         });

         view.subscribe('onKeyPressed', function(event, jqEvent) {
            if(jqEvent.which === $ws._const.key.backspace) {
               setPreviousRoot();
               jqEvent.preventDefault();
            }
         });

         breadCrumbs.subscribe('onItemClick', function(event, id){
            self._currentRoot = this._dataSet.getRecordByKey(id);
            self._currentRoot = self._currentRoot ? self._currentRoot.getRaw() : null;
            if (id === null){
               self._path = [];
            }
            this.setItems(self._path);
            view.setCurrentRoot(id);
            view.reload();
            this._toggleHomeIcon(!self._path.length);
         });

         backButton.subscribe('onActivated', function(){
            setPreviousRoot();
         });
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
         operationPanel._addItemOptions = function(options) {
            options.linkedView = view;
         };
         toggleCheckBoxes(operationPanel, view, hideCheckBoxes);
         view.subscribe('onSelectedItemsChange', function(event, idArray) {
            operationPanel.setPanelState(idArray.length);
         });
         operationPanel.subscribe('onToggle', function() {
            toggleCheckBoxes(operationPanel, view, hideCheckBoxes);
         });
      },
      /**
       * Метод для связывания истории фильтров с представлением данных
       */
      bindFilterHistory: function(filterButton, fastDataFilter, historyId, controller, browser) {
         var view = browser.getView(),
             historyController = new controller({
                historyId: historyId,
                filterButton: filterButton,
                fastDataFilter: fastDataFilter,
                view: view
             }),
             filter = historyController.getActiveFilter();

         filterButton.setHistoryController(historyController);
         setTimeout($ws.helpers.forAliveOnly(function() {
            if(filter) {
               /* Надо вмерживать структуру, полученную из истории, т.к. мы не сохраняем в историю шаблоны строки фильтров */
               filterButton._updateFilterStructure($ws.core.merge(filterButton.getFilterStructure(), filter.filter));
               view.setFilter($ws.core.merge(view.getFilter(), filter.viewFilter), true);
            }
            browser._notifyOnFiltersReady();
         }, view), 0);
      }
   });

   return ComponentBinder;
});
