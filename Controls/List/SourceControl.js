define('Controls/List/SourceControl', [
   'Core/Control',
   'Core/IoC',
   'tmpl!Controls/List/SourceControl/SourceControl',
   'require',
   'Controls/List/Controllers/ScrollController',
   'Controls/List/Controllers/VirtualScroll',
   'Controls/Controllers/SourceController',
   'Core/Deferred',
   'css!Controls/List/SourceControl/SourceControl'
], function (Control,
             IoC,
             SourceControlTpl,
             require,
             ScrollController,
             VirtualScroll,
             SourceController,
             Deferred
) {
   'use strict';

   var _private = {

      reload: function(self) {
         if (self._sourceController) {
            _private.showIndicator(self);
            return self._sourceController.load(self._filter, self._sorting).addCallback(function (list) {

               self._notify('onDataLoad', list);

               //TODO это кривой способ заставить пэйджинг пересчитаться. Передалть, когда будут готовы команды от Зуева
               //убираю, когда будет готов реквест от Зуева
               setTimeout(function(){
                  if (self._scrollController.hasScroll()) {
                     self._scrollPagingCtr.setEnabled(true);
                  }
               }, 100);

               _private.hideIndicator(self);

               if (self._listViewModel) {
                  self._listViewModel.setItems(list);
               }

               self._virtualScroll.setItemsCount(self._listViewModel.getCount());
               _private.handleListScroll.call(self, 0);
            }).addErrback(function(error){
               _private.processLoadError(self, error)
            })
         }
         else {
            IoC.resolve('ILogger').error('SourceControl', 'Source option is undefined. Can\'t load data');
         }
      },

      loadToDirection: function(self, direction) {
         _private.showIndicator(self, direction);
         if (self._sourceController) {
            return self._sourceController.load(self._filter, self._sorting, direction).addCallback(function(addedItems){

               self._notify('onDataLoad', addedItems);

               //TODO это кривой способ заставить пэйджинг пересчитаться. Передалть, когда будут готовы команды от Зуева
               //убираю, когда будет готов реквест от Зуева
               setTimeout(function(){
                  if (self._scrollController.hasScroll()) {
                     self._scrollPagingCtr.setEnabled(true);
                  }
               }, 100);

               _private.hideIndicator(self);

               if (direction === 'down') {
                  self._listViewModel.appendItems(addedItems);
                  self._virtualScroll.appendItems(addedItems.getCount());
               } else if (direction === 'up') {
                  self._listViewModel.prependItems(addedItems);
                  self._virtualScroll.prependItems(addedItems.getCount());
               }

               //обновить начало/конец видимого диапазона записей и высоты распорок
               _private.applyVirtualWindow(self, self._virtualScroll.getVirtualWindow());
            }).addErrback(function(error){
               _private.processLoadError(self, error)
            })
         }
         else {
            IoC.resolve('ILogger').error('SourceControl', 'Source option is undefined. Can\'t load data');
         }
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

      scrollToEdge: function(self, direction) {
         if (self._sourceController && self._sourceController.hasMoreData(direction)) {
            self._sourceController.setEdgeState(direction);
            _private.reload(self).addCallback(function(){
               if (direction === 'up') {
                  self._scrollController.scrollToTop();
               }
               else {
                  self._scrollController.scrollToBottom();
               }
            });
         }
         else {
            if (direction === 'up') {
               self._scrollController.scrollToTop();
            }
            else {
               self._scrollController.scrollToBottom();
            }
         }
      },

      scrollTo: function(offset) {
         //TODO без скролл вотчера пока так
         this._container.closest('.ws-scrolling-content').scrollTop = offset;
      },

      createScrollController: function(self, scrollContainer) {
         var
            children = self._children,
            triggers = {
               topListTrigger: children.topListTrigger,
               bottomListTrigger: children.bottomListTrigger,
               topLoadTrigger: children.topLoadTrigger,
               bottomLoadTrigger: children.bottomLoadTrigger
            },
            eventHandlers = {
               onLoadTriggerTop: function() {
                  if (self._options.navigation && self._options.navigation.view === 'infinity') {
                     if (self._sourceController.hasMoreData('up') && !self._sourceController.isLoading()) {
                        _private.loadToDirection(self, 'up')
                     }
                     if (self._scrollPagingCtr) {
                        self._scrollPagingCtr.handleScrollTop();
                     }
                  }
               },
               onLoadTriggerBottom: function() {
                  if (self._options.navigation && self._options.navigation.view === 'infinity') {
                     if (self._sourceController.hasMoreData('down') && !self._sourceController.isLoading()) {
                        _private.loadToDirection(self, 'down')
                     }
                     if (self._scrollPagingCtr) {
                        self._scrollPagingCtr.handleScrollBottom();
                     }
                  }
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

      createScrollPagingController: function(self) {
         var def = new Deferred();
         require(['Controls/List/Controllers/ScrollPaging'], function (ScrollPagingController) {
            var scrollPagingCtr;
            scrollPagingCtr = new ScrollPagingController({
               //scrollContainer: scrollContainer,
               mode: self._options.navigation.viewConfig.pagingMode,
               enabled: self._scrollController.hasScroll(),
               pagingCfgTrigger: function(cfg) {
                  self._pagingCfg = cfg;
                  self._forceUpdate();
               }
            });

            def.callback(scrollPagingCtr);


         }, function(error){
            def.errback(error);
         });

         return def;
      },

      showIndicator: function(self, direction) {
         self._loadingState = direction ? direction : 'all';
         setTimeout(function() {
            if (self._loadingIndicatorState !== self._loadingState) {
               self._loadingIndicatorState = self._loadingState;
               self._forceUpdate();
            }
         }, 2000)
      },

      hideIndicator: function(self) {
         self._loadingState = null;
         if (self._loadingIndicatorState !== null) {
            self._loadingIndicatorState = self._loadingState;
            self._forceUpdate();
         }
      },

      /**
       * Обновить размеры распорок и начало/конец отображаемых элементов
       */
      applyVirtualWindow: function(self, virtualWindow) {
         self._topPlaceholderHeight = virtualWindow.topPlaceholderHeight;
         self._bottomPlaceholderHeight = virtualWindow.bottomPlaceholderHeight;
         self._listViewModel.updateIndexes(virtualWindow.indexStart, virtualWindow.indexStop);
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
         if (this._scrollPagingCtr) {
            this._scrollPagingCtr.handleScroll(scrollTop)
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
         return self._listViewModel ? self._listViewModel.getCount() : 0;
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

   var SourceControl = Control.extend({
      _controlName: 'Controls/List/SourceControl',
      _template: SourceControlTpl,
      iWantVDOM: true,
      _isActiveByClick: false,

      _listViewModel: null,

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
         SourceControl.superclass.constructor.apply(this, arguments);
         this._publish('onDataLoad');
      },

      _beforeMount: function(newOptions) {
         var self = this;
         this._virtualScroll = new VirtualScroll({
            maxVisibleItems: newOptions.virtualScrollConfig && newOptions.virtualScrollConfig.maxVisibleItems,
            itemsCount: 0
         });

         /* Load more data after reaching end or start of the list.
          TODO могут задать items как рекордсет, надо сразу обработать тогда навигацию и пэйджинг
          */
         this._filter = newOptions.filter;

         if (newOptions.listViewModel) {
            this._listViewModel = newOptions.listViewModel;
            this._virtualScroll.setItemsCount(this._listViewModel.getCount());
         }

         if (newOptions.source) {
            this._sourceController = new SourceController({
               source : newOptions.source,
               navigation : newOptions.navigation  //TODO возможно не всю навигацию надо передавать а только то, что касается source
            });



            if (!this._items) {
               _private.reload(this);
            }
         }
      },

      _afterMount: function() {
         var self = this;
         SourceControl.superclass._afterMount.apply(this, arguments);


         //TODO кривое обращение к DOM бцдет переделано на схему с Listner-Catcher
         var scrollContainer = this._container.closest('.ws-scrolling-content');
         if (scrollContainer) {
            this._scrollController = _private.createScrollController(this, scrollContainer);

            if (this._options.navigation
               && this._options.navigation.view === 'infinity'
               && this._options.navigation.viewConfig
               && this._options.navigation.viewConfig.pagingMode
            ) {
               _private.createScrollPagingController(this).addCallback(function(scrollPagingCtr){
                  self._scrollPagingCtr = scrollPagingCtr
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

         if (newOptions.filter !== this._options.filter) {
            this._filter = newOptions.filter;
         }

         if (newOptions.listViewModel && (newOptions.listViewModel !== this._options.listViewModel)) {
            this._listViewModel = newOptions.listViewModel;
            this._virtualScroll.setItemsCount(this._listViewModel.getCount());
         } else
            if (newOptions.selectedKey !== this._options.selectedKey) {
               this._listViewModel.setMarkedKey(newOptions.selectedKey);
            }


         if (newOptions.dataSource !== this._options.dataSource) {
            if (this._sourceController) {
               this._sourceController.destroy();
            }
            //TODO обработать смену фильтров и т.д. позвать релоад если надо

            this._sourceController = new SourceController({
               source : newOptions.source,
               navigation: newOptions.navigation
            });

            _private.reload(this);
         }

      },

      _beforeUnmount: function() {
         if (this._scrollController) {
            this._scrollController.destroy();
         }

         if (this._sourceController) {
            this._sourceController.destroy();
         }

         if (this._scrollPagingCtr) {
            this._scrollPagingCtr.destroy()
         }

         SourceControl.superclass._beforeUnmount.apply(this, arguments);
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
         if (this._scrollController) {
            switch (arrow) {
               case 'Next': this._scrollController.scrollPageDown(); break;
               case 'Prev': this._scrollController.scrollPageUp(); break;
               case 'Begin': _private.scrollToEdge(this, 'up'); break;
               case 'End': _private.scrollToEdge(this, 'down'); break;
            }
         }
      },

      reload: function() {
         _private.reload(this);
      }

   });

   //TODO https://online.sbis.ru/opendoc.html?guid=17a240d1-b527-4bc1-b577-cf9edf3f6757
   /*ListView.getOptionTypes = function getOptionTypes(){
    return {
    dataSource: Types(ISource)
    }
    };*/
   SourceControl._private = _private;
   return SourceControl;
});