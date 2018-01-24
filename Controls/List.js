define('Controls/List', [
   'Core/Control',
   'tmpl!Controls/List/ListControl',
   'Controls/List/ListControl/ListViewModel',
   'Controls/List/resources/utils/DataSourceUtil',
   'Controls/List/Controllers/PageNavigation',
   'Core/helpers/functional-helpers',
   'require',
   'Controls/List/Controllers/ScrollController',
   'Controls/List/Controllers/VirtualScroll',
   'css!Controls/List/ListControl/ListControl'
], function (Control,
             ListControlTpl,
             ListViewModel,
             DataSourceUtil,
             PageNavigation,
             fHelpers,
             require,
             ScrollController,
             VirtualScroll
 ) {
   'use strict';

   var _private = {
      createListModel: function(items, cfg) {
         return new ListViewModel ({
            items : items,
            idProperty: cfg.idProperty,
            displayProperty: cfg.displayProperty,
            selectedKey: cfg.selectedKey
         });
      },

      initNavigation: function(navOption, dataSource) {
         var navController;
         if (navOption && navOption.source === 'page') {
            navController = new PageNavigation(navOption.sourceConfig);
            navController.prepareSource(dataSource);
         }
         return navController;
      },

      paramsWithNavigation: function(params, navigCtrl, display, direction) {
         var navigParams = navigCtrl.prepareQueryParams(display, direction);
         params.limit = navigParams.limit;
         params.offset = navigParams.offset;
         //TODO фильтр и сортировка не забыть приделать
         return params;
      },

      paramsWithUserEvent: function(params, userParams) {
         params.filter = userParams['filter'] || params.filter;
         params.sorting = userParams['sorting'] || params.sorting;
         params.offset = userParams['offset'] || params.offset;
         params.limit = userParams['limit'] || params.limit;
         return params;
      },

      reload: function(self) {
         _private.load(self).addCallback(function(list){

            if (self._navigationController) {
               self._navigationController.calculateState(list);
            }

            if (!self._listModel) {
               self._listModel = _private.createListModel(list, self._options);
               self._forceUpdate();
            }
            else {
               self._listModel.setItems(list);
            }

            self._virtualScroll.setItemsCount(self._listModel.getCount());
            _private.handleListScroll.call(self, 0);
         })
      },

      loadToDirection: function(self, direction) {
         _private.load(self, direction).addCallback(function(addedItems){

            if (self._navigationController) {
               self._navigationController.calculateState(addedItems, direction);
            }

            if (direction === 'down') {
               self._listModel.appendItems(addedItems);
               self._virtualScroll.appendItems(addedItems.getCount());
            } else if (direction === 'up') {
               self._listModel.prependItems(addedItems);
               self._virtualScroll.prependItems(addedItems.getCount());
            }

            //обновить начало/конец видимого диапазона записей и высоты распорок
            _private.applyVirtualWindow(self, self._virtualScroll.getVirtualWindow());
         })
      },


      load: function(self, direction) {
         if (self._dataSource) {
            var def, queryParams;

            queryParams = {
               filter: self._filter,
               sorting: self._sorting,
               limit: undefined,
               offset: undefined
            };
            //модифицируем параметры через навигацию
            if (self._navigationController) {
               queryParams = _private.paramsWithNavigation(queryParams, self._navigationController, self._display, direction);
            }

            //позволяем модифицировать параметры юзеру
            var userParams = self._notify('onBeforeDataLoad', queryParams.filter, queryParams.sorting, queryParams.offset, queryParams.limit);
            if (userParams) {
               queryParams = _private.paramsWithUserEvent(queryParams, userParams);
            }

            _private.showIndicator(self, direction);
            def = DataSourceUtil.callQuery(self._dataSource, self._options.idProperty, queryParams.filter, queryParams.sorting, queryParams.offset, queryParams.limit)
               .addCallback(fHelpers.forAliveOnly(function (list) {
                  self._notify('onDataLoad', list);

                  //TODO это кривой способ заставить пэйджинг пересчитаться. Передалть, когда будут готовы команды от Зуева
                  //убираю, когда будет готов реквест от Зуева
                  window.setTimeout(function(){
                     if (self._scrollPagingCtr) {
                        self._scrollPagingCtr.resetHeights();
                     }
                  }, 100);

                  _private.hideIndicator(self);

                  return list;
               }, self))
               .addErrback(fHelpers.forAliveOnly(function(err){
                  _private.processLoadError(self, err);
               }, self));
            self._loader = def;
            return def;
         }
         else {
            throw new Error('Option dataSource is undefined. Can\'t load data');
         }
      },

      /**
       * Идет ли загрузка данных с БЛ
       */
      isLoading: function(self) {
         return self._loader && !self._loader.isReady();
      },

      processLoadError: function(self, error) {
         if (!error.canceled) {
            _private.hideIndicator(self);
            if (self._notify('onDataLoadError', error) !== true && !error._isOfflineMode) {//Не показываем ошибку, если было прервано соединение с интернетом
               //TODO новые попапы
               /*InformationPopupManager.showMessageDialog(

                     opener: self,

                     status: 'error'
                  }
               );*/
               error.processed = true;
            }
         }
         return error;
      },

      scrollToEdge: function(direction) {
         var self = this;
         if (this._navigationController && this._navigationController.hasMoreData(direction)) {
            this._navigationController.setEdgeState(direction);
            _private.reload(this).addCallback(function(){

               //TODO Убрать перейдя на методы из ScrollWatcher
               _private.scrollTo.call(self, direction == 'up' ? 0 : 100000000)
            });
         }
         else {
            _private.scrollTo.call(self, direction == 'up' ? 0 : 100000000)
         }
      },

      scrollTo: function(offset) {
         //TODO без скролл вотчера пока так
         this._container.closest('.ws-scrolling-content').scrollTop = offset;
      },

      scrollLoadMore: function(self, direction) {
         //TODO нужна компенсация при подгрузке вверх

         if (self._navigationController && self._navigationController.hasMoreData(direction) && !_private.isLoading(self)) {
            _private.loadToDirection(self, direction);
         }
      },

      createScrollController: function(scrollContainer) {
         var
            self = this,
            children = this._children,
            triggers = {
               topListTrigger: children.topListTrigger,
               bottomListTrigger: children.bottomListTrigger,
               topLoadTrigger: children.topLoadTrigger,
               bottomLoadTrigger: children.bottomLoadTrigger
            },
            eventHandlers = {
               onLoadTriggerTop: function() {
                  _private.scrollLoadMore(self, 'up');
               },
               onLoadTriggerBottom: function() {
                  _private.scrollLoadMore(self, 'down');
               },
               onListTop: function() {
               },
               onListBottom: function() {
               },
               onListScroll: function(scrollTop) {
                  _private.handleListScroll.call(self, scrollTop);
               }
            };

         return new ScrollController ({
            triggers : triggers,
            scrollContainer: scrollContainer,
            loadOffset: this._loadOffset,
            eventHandlers: eventHandlers
         });
      },
      showIndicator: function(self, direction) {
         self._loadingState = direction ? direction : 'all';
         setTimeout(function() {
            self._loadingIndicatorState = self._loadingState || null;
            self._forceUpdate();
         }, 2000)
      },

      hideIndicator: function(self) {
         self._loadingState = null;
         self._loadingIndicatorState = null;
         self._forceUpdate();
      },

      /**
       * Обновить размеры распорок и начало/конец отображаемых элементов
       * @param virtualWindow результат из virtualScroll контроллера
       */
      applyVirtualWindow: function(self, virtualWindow) {
         self._topPlaceholderHeight = virtualWindow.topPlaceholderHeight;
         self._bottomPlaceholderHeight = virtualWindow.bottomPlaceholderHeight;
         self._listModel.updateIndexes(virtualWindow.indexStart, virtualWindow.indexStop);
         self._forceUpdate();
      },

      /**
       * Обработать прокрутку списка виртуальным скроллом
       * @param scrollTop
       */
      handleListScroll: function(scrollTop) {
         var virtualWindowIsChanged = this._virtualScroll.setScrollTop(scrollTop);
         if (virtualWindowIsChanged) {
            _private.applyVirtualWindow(this, this._virtualScroll.getVirtualWindow());
         }
      },

      /**
       * отдать в VirtualScroll контейнер с отрисованными элементами для расчета средней высоты 1 элемента
       * Отдаю именно контейнер, а не высоту, чтобы не считать размер, когда высоты уже проинициализированы
       * @param self
       */
      initializeAverageItemsHeight: function(self) {
         //TODO брать _container - плохо. Узнаю у Зуева как сделать хорошо
         //Узнал тут, пока остается _container: https://online.sbis.ru/open_dialog.html?guid=01b6161a-01e7-a11f-d1ff-ec1731d3e21f
         var res = self._virtualScroll.calcAverageItemHeight(self._children.listView._container);
         if (res.changed) {
            _private.applyVirtualWindow(self, res.virtualWindow);
         }
      },
      
      getItemsCount: function(self) {
         return self._listModel ? self._listModel.getCount() : 0;
      }
   };

   /**
    * Компонент плоского списка, с произвольным шаблоном отображения каждого элемента. Обладает возможностью загрузки/подгрузки данных из источника.
    * @class Controls/List
    * @extends Controls/Control
    * @mixes Controls/interface/ISource
    * @mixes Controls/interface/IPromisedSelectable
    * @mixes Controls/interface/IGroupedView
    * @mixes Controls/interface/INavigation
    * @mixes Controls/interface/IFilter
    * @mixes Controls/interface/IHighlighter
    * @mixes Controls/List/interface/IListControl
    * @control
    * @public
    * @category List
    */

   var ListControl = Control.extend({
         _controlName: 'Controls/List/ListControl',
         _template: ListControlTpl,
         iWantVDOM: true,
         _isActiveByClick: false,

         _items: null,
         _itemsChanged: true,

         _dataSource: null,
         _loader: null,
         _loadingState: null,
         _loadingIndicatorState: null,

         //TODO пока спорные параметры
         _filter: undefined,
         _sorting: undefined,

         _itemTemplate: null,

         _loadOffset: 100,
         _topPlaceholderHeight: 0,
         _bottomPlaceholderHeight: 0,

         constructor: function (cfg) {
            ListControl.superclass.constructor.apply(this, arguments);
            this._publish('onDataLoad');
         },

         _beforeMount: function(newOptions) {
            this._virtualScroll = new VirtualScroll({
               maxVisibleItems: newOptions.virtualScrollConfig && newOptions.virtualScrollConfig.maxVisibleItems,
               itemsCount: 0
            });

          /* Load more data after reaching end or start of the list.
            TODO могут задать items как рекордсет, надо сразу обработать тогда навигацию и пэйджинг
          */
            this._filter = newOptions.filter;
            if (newOptions.items) {
               this._items = newOptions.items;
               this._listModel = _private.createListModel(this._items, newOptions);
               this._virtualScroll.setItemsCount(this._items.getCount());
            }
            if (newOptions.dataSource) {
               this._dataSource = DataSourceUtil.prepareSource(newOptions.dataSource);
               this._navigationController = _private.initNavigation(newOptions.navigation, this._dataSource);
               if (!this._items) {
                  _private.reload(this);
               }
            }
         },

         _afterMount: function() {
            ListControl.superclass._afterMount.apply(this, arguments);

            //Если есть подгрузка по скроллу и список обернут в скроллКонтейнер, то создаем ScrollWatcher
            //TODO вместо проверки на навигацию - позже будет аналогичная проверка на наличие виртуального скролла.
            //TODO пока создаем ScrollWatcher всегда, когда есть скроллКонтейнер
            //if ((this._options.navigation && this._options.navigation.source === 'page')) {
               var scrollContainer = this._container.closest('.ws-scrolling-content');
               if (scrollContainer) {
                  this._scrollController = _private.createScrollController.call(this, scrollContainer);
               }
            //}

            if (this._options.navigation && this._options.navigation.view == 'infinity') {
               //TODO кривое обращение к DOM
               //убарть когда перейду на скролл вотчер от Ильи Девятова
               scrollContainer = this._container.closest('.ws-scrolling-content');
               if (scrollContainer && this._options.navigation.viewConfig && this._options.navigation.viewConfig.pagingMode) {
                  var self = this;
                  require(['Controls/List/Controllers/ScrollPaging'], function (ScrollPagingController) {
                     self._scrollPagingCtr = new ScrollPagingController({
                        scrollContainer: scrollContainer,
                        mode: self._options.navigation.viewConfig.pagingMode
                     });

                     self._scrollPagingCtr.subscribe('onChangePagingCfg', function(e, pCfg){
                        self._pagingCfg = pCfg;
                        self._forceUpdate();
                     });

                     self._scrollPagingCtr.startObserve();
                  });
               }
            }

            if (_private.getItemsCount(this)) {
               //Посчитаем среднюю высоту строки и отдадим ее в VirtualScroll
               _private.initializeAverageItemsHeight(this);
            }
         },

         _beforeUpdate: function(newOptions) {

            //TODO могут задать items как рекордсет, надо сразу обработать тогда навигацию и пэйджинг

            if (newOptions.filter != this._options.filter) {
               this._filter = newOptions.filter;
            }

            if (newOptions.items && (newOptions.items != this._options.items)) {
               this._items = newOptions.items;
               this._listModel = _private.createListModel(this._items, newOptions);
            } else if (newOptions.selectedKey !== this._options.selectedKey) {
               this._listModel.setSelectedKey(newOptions.selectedKey);
            }
            

            if (newOptions.dataSource !== this._options.dataSource) {
               this._dataSource = DataSourceUtil.prepareSource(newOptions.dataSource);
               this._navigationController = _private.initNavigation(newOptions.navigation, this._dataSource);
               _private.reload(this);
            }
            //TODO обработать смену фильтров и т.д. позвать релоад если надо
         },

         _beforeUnmount: function() {
            if (this._scrollController) {
               this._scrollController.destroy();
            }

            ListControl.superclass._beforeUnmount.apply(this, arguments);
         },


         _afterUpdate: function() {
            if (_private.getItemsCount(this)) {
               _private.initializeAverageItemsHeight(this);
   
               //Проверим, не достигли ли границ контейнера. Если достигли, возможно нужна подгрузка соседней страницы
               if (this._scrollController) {
                  this._scrollController.checkBoundaryContainer();
               }
            }
         },

         __onPagingArrowClick: function(e, arrow) {
            if (this._scrollPagingCtr) {
               switch (arrow) {
                  case 'Next': this._scrollPagingCtr.scrollForward(); break;
                  case 'Prev': this._scrollPagingCtr.scrollBackward(); break;
                  case 'Begin': _private.scrollToEdge.call(this, 'up'); break;
                  case 'End': _private.scrollToEdge.call(this, 'down'); break;
               }
            }
         },
         //<editor-fold desc='DataSourceMethods'>
         reload: function() {
            _private.reload(this);
         },

         destroy: function() {
            if (this._scrollPagingCtr) {
               this._scrollPagingCtr.destroy()
            }
            ListControl.superclass.destroy.apply(this, arguments);
         }
      });

   //TODO https://online.sbis.ru/opendoc.html?guid=17a240d1-b527-4bc1-b577-cf9edf3f6757
   /*ListView.getOptionTypes = function getOptionTypes(){
    return {
    dataSource: Types(ISource)
    }
    };*/
   ListControl._private = _private;
   return ListControl;
});