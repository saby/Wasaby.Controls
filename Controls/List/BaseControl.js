define('Controls/List/BaseControl', [
   'Core/Control',
   'Core/IoC',
   'Core/core-clone',
   'Core/core-merge',
   'Core/core-instance',
   'wml!Controls/List/BaseControl/BaseControl',
   'Controls/List/resources/utils/ItemsUtil',
   'require',
   'Controls/List/Controllers/VirtualScroll',
   'Controls/Controllers/SourceController',
   'Core/helpers/Object/isEqual',
   'Core/Deferred',
   'WS.Data/Collection/RecordSet',
   'Controls/Utils/Toolbar',
   'Controls/List/ItemActions/Utils/Actions',
   'Controls/Utils/tmplNotify',
   'wml!Controls/List/BaseControl/Footer',
   'css!theme?Controls/List/BaseControl/BaseControl'
], function(
   Control,
   IoC,
   cClone,
   cMerge,
   cInstance,
   BaseControlTpl,
   ItemsUtil,
   require,
   VirtualScroll,
   SourceController,
   isEqualObject,
   Deferred,
   RecordSet,
   tUtil,
   aUtil,
   tmplNotify
) {
   'use strict';

   //TODO: getDefaultOptions зовётся при каждой перерисовке, соответственно если в опции передаётся не примитив, то они каждый раз новые
   //Нужно убрать после https://online.sbis.ru/opendoc.html?guid=1ff4a7fb-87b9-4f50-989a-72af1dd5ae18
   var
      defaultSelectedKeys = [],
      defaultExcludedKeys = [];

   var _private = {
      reload: function(self, filter, sorting, userCallback, userErrback) {
         var
            resDeferred = new Deferred();
         if (self._sourceController) {
            _private.showIndicator(self);

            // Need to create new Deffered, returned success result
            // load() method may be fired with errback
            self._sourceController.load(filter, sorting).addCallback(function(list) {
               if (userCallback && userCallback instanceof Function) {
                  userCallback(list);
               }

               _private.hideIndicator(self);

               if (self._listViewModel) {
                  self._listViewModel.setItems(list);
                  self._items = self._listViewModel.getItems();
               }

               //self._virtualScroll.setItemsCount(self._listViewModel.getCount());

               _private.prepareFooter(self, self._options.navigation, self._sourceController);

               _private.handleListScroll(self, 0);
               resDeferred.callback(list);

               // If received list is empty, make another request. If it’s not empty, the following page will be requested in resize event handler after current items are rendered on the page.
               if (!list.getCount()) {
                  _private.checkLoadToDirectionCapability(self);
               }
            }).addErrback(function(error) {
               _private.processLoadError(self, error, userErrback);
               resDeferred.callback(null);
            });
         } else {
            resDeferred.callback();
            IoC.resolve('ILogger').error('BaseControl', 'Source option is undefined. Can\'t load data');
         }
         return resDeferred;
      },

      prepareFooter: function(self, navigation, sourceController) {
         self._shouldDrawFooter = navigation && navigation.view === 'demand' && sourceController.hasMoreData('down');
         if (self._shouldDrawFooter) {
            if (typeof self._sourceController.getLoadedDataCount() !== 'undefined' && self._sourceController.getAllDataCount()) {
               self._loadMoreCaption = self._sourceController.getAllDataCount() - self._sourceController.getLoadedDataCount();
            } else {
               self._loadMoreCaption = '...';
            }
         }
      },

      loadToDirection: function(self, direction, userCallback, userErrback) {
         _private.showIndicator(self, direction);
         if (self._sourceController) {
            return self._sourceController.load(self._options.filter, self._options.sorting, direction).addCallback(function(addedItems) {
               if (userCallback && userCallback instanceof Function) {
                  userCallback(addedItems, direction);
               }

               _private.hideIndicator(self);

               if (direction === 'down') {
                  self._listViewModel.appendItems(addedItems);

                  // Virtual scroll: https://online.sbis.ru/opendoc.html?guid=cb6361c4-8eda-4894-b484-5c6ebfa6085a
                  // self._virtualScroll.appendItems(addedItems.getCount());
               } else if (direction === 'up') {
                  self._listViewModel.prependItems(addedItems);

                  // Virtual scroll: https://online.sbis.ru/opendoc.html?guid=cb6361c4-8eda-4894-b484-5c6ebfa6085a
                  // self._virtualScroll.prependItems(addedItems.getCount());
               }

               // If received list is empty, make another request. If it’s not empty, the following page will be requested in resize event handler after current items are rendered on the page.
               if (!addedItems.getCount()) {
                  _private.checkLoadToDirectionCapability(self);
               }

               _private.prepareFooter(self, self._options.navigation, self._sourceController);

               return addedItems;

               // обновить начало/конец видимого диапазона записей и высоты распорок
               // _private.applyVirtualWindow(self, self._virtualScroll.getVirtualWindow());
            }).addErrback(function(error) {
               return _private.processLoadError(self, error, userErrback);
            });
         }
         IoC.resolve('ILogger').error('BaseControl', 'Source option is undefined. Can\'t load data');
      },


      processLoadError: function(self, error, userErrback) {
         if (!error.canceled) {
            _private.hideIndicator(self);

            if (userErrback && userErrback instanceof Function) {
               userErrback(error);
            }

            if (!(error.processed || error._isOfflineMode)) {// Не показываем ошибку, если было прервано соединение с интернетом
               // TODO новые попапы
               /* InformationPopupManager.showMessageDialog(

                opener: self,

                status: 'error'
                }
                ); */
               error.processed = true;
            }
         }
         return error;
      },

      checkLoadToDirectionCapability: function(self) {
         if (self._needScrollCalculation) {
            if (self._loadTriggerVisibility.up) {
               _private.onScrollLoadEdge(self, 'up');
            }
            if (self._loadTriggerVisibility.down) {
               _private.onScrollLoadEdge(self, 'down');
            }
         }
      },

      onScrollLoadEdgeStart: function(self, direction) {
         self._loadTriggerVisibility[direction] = true;
         _private.onScrollLoadEdge(self, direction);
      },

      onScrollLoadEdgeStop: function(self, direction) {
         self._loadTriggerVisibility[direction] = false;
      },

      loadToDirectionIfNeed: function(self, direction) {
         if (self._sourceController.hasMoreData(direction) && !self._sourceController.isLoading() && !self._hasUndrawChanges) {
            _private.loadToDirection(self, direction, self._options.dataLoadCallback, self._options.dataLoadErrback);
         }
      },

      onScrollLoadEdge: function(self, direction) {
         if (self._options.navigation && self._options.navigation.view === 'infinity') {
            _private.loadToDirectionIfNeed(self, direction);
         }
      },

      onScrollListEdge: function(self, direction) {

      },

      scrollToEdge: function(self, direction) {
         if (self._sourceController && self._sourceController.hasMoreData(direction)) {
            self._sourceController.setEdgeState(direction);
            _private.reload(self, self._options.filter, self._options.sorting, self._options.dataLoadCallback, self._options.dataLoadErrback).addCallback(function() {
               if (direction === 'up') {
                  self._notify('doScroll', ['top'], { bubbling: true });
               } else {
                  self._notify('doScroll', ['bottom'], { bubbling: true });
               }
            });
         } else if (direction === 'up') {
            self._notify('doScroll', ['top'], { bubbling: true });
         } else {
            self._notify('doScroll', ['bottom'], { bubbling: true });
         }
      },

      startScrollEmitter: function(self) {
         var
            children = self._children,
            triggers = {
               topListTrigger: children.topListTrigger,
               bottomListTrigger: children.bottomListTrigger,
               topLoadTrigger: children.topLoadTrigger,
               bottomLoadTrigger: children.bottomLoadTrigger
            };

         self._children.ScrollEmitter.startRegister(triggers);
      },

      onScrollShow: function(self) {
         if (!self._scrollPagingCtr) {
            if (self._options.navigation &&
               self._options.navigation.view === 'infinity' &&
               self._options.navigation.viewConfig &&
               self._options.navigation.viewConfig.pagingMode
            ) {
               _private.createScrollPagingController(self).addCallback(function(scrollPagingCtr) {
                  self._scrollPagingCtr = scrollPagingCtr;
               });
            }
         } else {

         }
      },

      onScrollHide: function(self) {
         self._pagingCfg = null;
         self._forceUpdate();
      },

      createScrollPagingController: function(self) {
         var def = new Deferred();
         require(['Controls/List/Controllers/ScrollPaging'], function(ScrollPagingController) {
            var scrollPagingCtr;
            scrollPagingCtr = new ScrollPagingController({
               mode: self._options.navigation.viewConfig.pagingMode,
               pagingCfgTrigger: function(cfg) {
                  self._pagingCfg = cfg;
                  self._forceUpdate();
               }
            });

            def.callback(scrollPagingCtr);
         }, function(error) {
            def.errback(error);
         });

         return def;
      },

      showIndicator: function(self, direction) {
         self._loadingState = direction || 'all';
         self._loadingIndicatorState = self._loadingState;
         setTimeout(function() {
            if (self._loadingState) {
               self._showLoadingIndicatorImage = true;
               self._forceUpdate();
            }
         }, 2000);
      },

      hideIndicator: function(self) {
         self._loadingState = null;
         self._showLoadingIndicatorImage = false;
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
       */
      handleListScroll: function(self, scrollTop, position) {
         var virtualWindowIsChanged = self._virtualScroll.setScrollTop(scrollTop);
         var hasMoreData;

         if (virtualWindowIsChanged) {
            // _private.applyVirtualWindow(self, self._virtualScroll.getVirtualWindow());
         }

         if (self._scrollPagingCtr) {
            if (position === 'middle') {
               self._scrollPagingCtr.handleScroll(scrollTop);
            } else {
               // when scroll is at the edge we will send information to scrollPaging about the availability of data next/prev
               if (self._sourceController) {
                  hasMoreData = {
                     up: self._sourceController.hasMoreData('up'),
                     down: self._sourceController.hasMoreData('down')
                  };
               }
               self._scrollPagingCtr.handleScrollEdge(position, hasMoreData);
            }
         }
      },

      needScrollCalculation: function(navigationOpt) {
         return navigationOpt && navigationOpt.view === 'infinity';
      },

      /**
       * отдать в VirtualScroll контейнер с отрисованными элементами для расчета средней высоты 1 элемента
       * Отдаю именно контейнер, а не высоту, чтобы не считать размер, когда высоты уже проинициализированы
       * @param self
       */
      initializeAverageItemsHeight: function(self) {
         // TODO брать _container - плохо. Узнаю у Зуева как сделать хорошо
         // Узнал тут, пока остается _container: https://online.sbis.ru/open_dialog.html?guid=01b6161a-01e7-a11f-d1ff-ec1731d3e21f
         var res = self._virtualScroll.calcAverageItemHeight(self._children.listView._container);
         if (res.changed) {
            // _private.applyVirtualWindow(self, res.virtualWindow);
         }
      },

      getItemsCount: function(self) {
         return self._listViewModel ? self._listViewModel.getCount() : 0;
      },

      initListViewModelHandler: function(self, model) {
         model.subscribe('onListChange', function() {
            self._hasUndrawChanges = true;
            self._forceUpdate();
         });
         model.subscribe('onGroupsExpandChange', function(event, changes) {
            _private.groupsExpandChangeHandler(self, changes);
         });
      },

      showActionsMenu: function(self, event, itemData, childEvent, showAll) {
         var
            context = event.type === 'itemcontextmenu',
            showActions;
         if ((context && self._isTouch) || !itemData.itemActions) {
            return false;
         }
         showActions = (context || showAll) && itemData.itemActions.all
            ? itemData.itemActions.all
            : itemData.itemActions && itemData.itemActions.all.filter(function(action) {
               return action.showType !== tUtil.showType.TOOLBAR;
            });
         if (showActions && showActions.length) {
            var
               rs = new RecordSet({ rawData: showActions });
            childEvent.nativeEvent.preventDefault();
            childEvent.stopImmediatePropagation();
            itemData.contextEvent = context;
            self._listViewModel.setActiveItem(itemData);
            self._children.itemActionsOpener.open({
               opener: self._children.listView,
               target: !context ? childEvent.target : false,
               templateOptions: {
                  items: rs,
                  keyProperty: 'id',
                  parentProperty: 'parent',
                  nodeProperty: 'parent@',
                  dropdownClassName: 'controls-itemActionsV__popup'
               },
               nativeEvent: context ? childEvent.nativeEvent : false
            });
            self._menuIsShown = true;
         }
      },

      closeActionsMenu: function(self, args) {
         var
            actionName = args && args.action,
            event = args && args.event;

         if (actionName === 'itemClick') {
            var action = args.data && args.data[0] && args.data[0].getRawData();
            aUtil.itemActionsClick(self, event, action, self._listViewModel.getActiveItem());
            self._children.itemActionsOpener.close();
         }
         self._listViewModel.setActiveItem(null);
         self._children.swipeControl.closeSwipe();
         self._menuIsShown = false;
         self._forceUpdate();
      },

      bindHandlers: function(self) {
         self._closeActionsMenu = self._closeActionsMenu.bind(self);
      },

      setPopupOptions: function(self) {
         self._popupOptions = {
            className: 'controls-Toolbar__menu-position',
            closeByExternalClick: true,
            corner: { vertical: 'top', horizontal: 'right' },
            horizontalAlign: { side: 'right' },
            eventHandlers: {
               onResult: self._closeActionsMenu,
               onClose: self._closeActionsMenu
            },
            templateOptions: {
               showClose: true
            }
         };
      },

      groupsExpandChangeHandler: function(self, changes) {
         self._notify(changes.changeType === 'expand' ? 'onGroupExpanded' : 'onGroupCollapsed', [changes.group], { bubbling: true });
         requirejs(['Controls/List/resources/utils/GroupUtil'], function(GroupUtil) {
            GroupUtil.storeCollapsedGroups(changes.collapsedGroups, self._options.historyIdCollapsedGroups);
         });
      },

      prepareCollapsedGroups: function(config) {
         var
            result = new Deferred();
         if (config.historyIdCollapsedGroups) {
            requirejs(['Controls/List/resources/utils/GroupUtil'], function(GroupUtil) {
               GroupUtil.restoreCollapsedGroups(config.historyIdCollapsedGroups).addCallback(function(collapsedGroupsFromStore) {
                  result.callback(collapsedGroupsFromStore || config.collapsedGroups);
               });
            });
         } else {
            result.callback(config.collapsedGroups);
         }
         return result;
      },
      
      getSortingOnChange: function(currentSorting, propName, sortingType) {
         var sorting = currentSorting ? currentSorting.slice() : [];
         var sortElemIndex = -1;
         var sortElem;
         var newSortElem = {};
   
         //use same algorithm when sortingType is not 'single', if the number of properties is equal to one
         if (sortingType !== 'single' || sorting.length === 1 && sorting[0][propName]) {
            sorting.forEach(function(elem, index) {
               if (elem.hasOwnProperty(propName)) {
                  sortElem = elem;
                  sortElemIndex = index;
               }
            });
         } else {
            sorting = [];
         }
   
         // change sorting direction by rules:
         // 'DESC' -> 'ASC'
         // 'ASC' -> empty
         // empty -> 'DESC'
         if (sortElem) {
            if (sortElem[propName] === 'DESC') {
               sortElem[propName] = 'ASC';
            } else {
               sorting.splice(sortElemIndex, 1);
            }
         } else {
            newSortElem[propName] = 'DESC';
            sorting.push(newSortElem);
         }
         
         return sorting;
      }

   };

   /**
    * Компонент плоского списка, с произвольным шаблоном отображения каждого элемента. Обладает возможностью загрузки/подгрузки данных из источника.
    * @class Controls/List/BaseControl
    * @extends Core/Control
    * @mixes Controls/interface/ISource
    * @mixes Controls/interface/IItemTemplate
    * @mixes Controls/interface/IPromisedSelectable
    * @mixes Controls/interface/IGroupedView
    * @mixes Controls/interface/INavigation
    * @mixes Controls/interface/IFilter
    * @mixes Controls/interface/IHighlighter
    * @mixes Controls/List/interface/IBaseControl
    * @mixes Controls/interface/IEditableList
    * @control
    * @public
    * @author Авраменко А.С.
    * @category List
    */

   var BaseControl = Control.extend(/** @lends Controls/List/BaseControl.prototype */{
      _template: BaseControlTpl,
      iWantVDOM: true,
      _isActiveByClick: false,

      _listViewModel: null,
      _viewModelConstructor: null,

      _loadMoreCaption: null,
      _shouldDrawFooter: false,

      _loader: null,
      _loadingState: null,
      _loadingIndicatorState: null,

      // TODO пока спорные параметры
      _sorting: undefined,

      _itemTemplate: null,

      _needScrollCalculation: false,
      _loadTriggerVisibility: null,
      _loadOffset: 100,
      _topPlaceholderHeight: 0,
      _bottomPlaceholderHeight: 0,
      _menuIsShown: null,

      _popupOptions: null,
      _hasUndrawChanges: false,

      _beforeMount: function(newOptions, context, receivedState) {
         var
            self = this;

         _private.bindHandlers(this);
         _private.setPopupOptions(this);

         this._virtualScroll = new VirtualScroll({
            maxVisibleItems: newOptions.virtualScrollConfig && newOptions.virtualScrollConfig.maxVisibleItems,
            itemsCount: 0
         });

         this._needScrollCalculation = _private.needScrollCalculation(newOptions.navigation);

         if (this._needScrollCalculation) {
            this._loadTriggerVisibility = {
               up: false,
               down: false
            };
         }

         return _private.prepareCollapsedGroups(newOptions).addCallback(function(collapsedGroups) {
            var
               viewModelConfig = collapsedGroups ? cMerge(cClone(newOptions), { collapsedGroups: collapsedGroups }) : newOptions;
            if (newOptions.viewModelConstructor) {
               self._viewModelConstructor = newOptions.viewModelConstructor;
               self._listViewModel = new newOptions.viewModelConstructor(viewModelConfig);
               self._virtualScroll.setItemsCount(self._listViewModel.getCount());
               _private.initListViewModelHandler(self, self._listViewModel);
            }

            if (newOptions.source) {
               self._sourceController = new SourceController({
                  source: newOptions.source,
                  navigation: newOptions.navigation // TODO возможно не всю навигацию надо передавать а только то, что касается source
               });

               if (receivedState) {
                  self._sourceController.calculateState(receivedState);
                  self._listViewModel.setItems(receivedState);
                  self._items = self._listViewModel.getItems();
                  _private.prepareFooter(self, newOptions.navigation, self._sourceController);
               } else {
                  var
                     loadDef = _private.reload(self, newOptions.filter, newOptions.sorting, newOptions.dataLoadCallback, newOptions.dataLoadErrback);
                  loadDef.addCallback(function(items) {
                     return items;
                  });
                  return loadDef;
               }
            }
         });
      },

      getViewModel: function() {
         return this._listViewModel;
      },

      getSourceController: function() {
         return this._sourceController;
      },

      _afterMount: function() {
         if (this._needScrollCalculation) {
            _private.startScrollEmitter(this);
         }
         if (_private.getItemsCount(this)) {
            // Посчитаем среднюю высоту строки и отдадим ее в VirtualScroll
            _private.initializeAverageItemsHeight(this);
         }
      },

      _beforeUpdate: function(newOptions) {
         var filterChanged = !isEqualObject(newOptions.filter, this._options.filter);
         var recreateSource = newOptions.source !== this._options.source ||
             !isEqualObject(newOptions.navigation, this._options.navigation);
         var sortingChanged = newOptions.sorting !== this._options.sorting;

         if (newOptions.viewModelConstructor !== this._viewModelConstructor) {
            this._viewModelConstructor = newOptions.viewModelConstructor;
            this._listViewModel = new newOptions.viewModelConstructor(newOptions);
            this._virtualScroll.setItemsCount(this._listViewModel.getCount());
            _private.initListViewModelHandler(this, this._listViewModel);
         }

         if (newOptions.markedKey !== this._options.markedKey) {
            this._listViewModel.setMarkedKey(newOptions.markedKey);
         }

         this._needScrollCalculation = _private.needScrollCalculation(newOptions.navigation);

         if (recreateSource) {
            if (this._sourceController) {
               this._sourceController.destroy();
            }

            this._sourceController = new SourceController({
               source: newOptions.source,
               navigation: newOptions.navigation
            });
         }

         if (newOptions.multiSelectVisibility !== this._options.multiSelectVisibility) {
            this._listViewModel.setMultiSelectVisibility(newOptions.multiSelectVisibility);
         }
         
         if (sortingChanged) {
            this._listViewModel.setSorting(newOptions.sorting);
         }

         if (filterChanged || recreateSource || sortingChanged) {
            _private.reload(this, newOptions.filter, newOptions.sorting, newOptions.dataLoadCallback, newOptions.dataLoadErrback);
         }
      },

      _beforeUnmount: function() {
         if (this._sourceController) {
            this._sourceController.destroy();
         }

         if (this._scrollPagingCtr) {
            this._scrollPagingCtr.destroy();
         }

         if (this._listViewModel) {
            this._listViewModel.destroy();
         }
         this._loadTriggerVisibility = null;

         BaseControl.superclass._beforeUnmount.apply(this, arguments);
      },

      _afterUpdate: function() {
         if (_private.getItemsCount(this)) {
            _private.initializeAverageItemsHeight(this);
         }
         if (this._hasUndrawChanges) {
            this._hasUndrawChanges = false;
            _private.checkLoadToDirectionCapability(this);
         }
      },

      __onPagingArrowClick: function(e, arrow) {
         switch (arrow) {
            case 'Next': this._notify('doScroll', ['pageDown'], { bubbling: true }); break;
            case 'Prev': this._notify('doScroll', ['pageUp'], { bubbling: true }); break;
            case 'Begin': _private.scrollToEdge(this, 'up'); break;
            case 'End': _private.scrollToEdge(this, 'down'); break;
         }
      },

      __onEmitScroll: function(e, type, params) {
         var self = this;
         switch (type) {
            case 'loadTopStart': _private.onScrollLoadEdgeStart(self, 'up'); break;
            case 'loadTopStop': _private.onScrollLoadEdgeStop(self, 'up'); break;
            case 'loadBottomStart': _private.onScrollLoadEdgeStart(self, 'down'); break;
            case 'loadBottomStop': _private.onScrollLoadEdgeStop(self, 'down'); break;
            case 'listTop': _private.onScrollListEdge(self, 'up'); break;
            case 'listBottom': _private.onScrollListEdge(self, 'down'); break;
            case 'scrollMove': _private.handleListScroll(self, params.scrollTop, params.position); break;
            case 'canScroll': _private.onScrollShow(self); break;
            case 'cantScroll': _private.onScrollHide(self); break;
         }
      },

      _onCheckBoxClick: function(e, key, status) {
         this._children.selectionController.onCheckBoxClick(key, status);
         this._notify('checkboxClick', [key, status]);
      },

      _listSwipe: function(event, itemData, childEvent) {
         var direction = childEvent.nativeEvent.direction;
         this._children.itemActionsOpener.close();
         if (direction === 'right' && itemData.multiSelectVisibility && !itemData.isSwiped) {
            var status = itemData.multiSelectStatus;
            this._notify('checkboxClick', [itemData.key, status]);
         }
         if (direction === 'right' || direction === 'left') {
            var newKey = ItemsUtil.getPropertyValue(itemData.item, this._options.keyProperty);
            this._listViewModel.setMarkedKey(newKey);
         }
      },

      _showIndicator: function(event, direction) {
         _private.showIndicator(this, direction);
         event.stopPropagation();
      },

      _hideIndicator: function(event) {
         _private.hideIndicator(this);
         event.stopPropagation();
      },

      reload: function(filter, sorting) {
         var reloadFilter = filter || this._options.filter;
         var reloadSorting = sorting || this._options._sorting;
         return _private.reload(this, reloadFilter, reloadSorting, this._options.dataLoadCallback, this._options.dataLoadErrback);
      },

      _onGroupClick: function(e, item, baseEvent) {
         if (baseEvent.target.closest('.controls-ListView__groupExpander')) {
            this._listViewModel.toggleGroup(item);
         }
      },

      _onItemClick: function(e, item, originalEvent) {
         if (originalEvent.target.closest('.js-controls-ListView__checkbox')) {
            /*
             When user clicks on checkbox we shouldn't fire itemClick event because no one actually expects or wants that.
             We can't stop click on checkbox from propagating because we can only subscribe to valueChanged event and then
             we'd be stopping the propagation of valueChanged event, not click event.
             And even if we could stop propagation of the click event, we shouldn't do that because other components
             can use it for their own reasons (e.g. something like TouchDetector can use it).
             */
            e.stopPropagation();
         }
         var newKey = ItemsUtil.getPropertyValue(item, this._options.keyProperty);
         this._listViewModel.setMarkedKey(newKey);
      },

      _viewResize: function() {
         _private.checkLoadToDirectionCapability(this);
      },

      beginEdit: function(options) {
         return this._options.readOnly ? Deferred.fail() : this._children.editInPlace.beginEdit(options);
      },

      beginAdd: function(options) {
         return this._options.readOnly ? Deferred.fail() : this._children.editInPlace.beginAdd(options);
      },

      cancelEdit: function() {
         return this._options.readOnly ? Deferred.fail() : this._children.editInPlace.cancelEdit();
      },

      commitEdit: function() {
         return this._options.readOnly ? Deferred.fail() : this._children.editInPlace.commitEdit();
      },

      _notifyHandler: tmplNotify,

      _onAfterBeginEdit: function(e, item, isAdd) {
         this._notify('afterBeginEdit', [item, isAdd]);
         if (this._options.itemActions) {
            this._children.itemActions.updateItemActions(item, true);
         }
      },

      _onAfterEndEdit: function(e, item, isAdd) {
         this._notify('afterEndEdit', [item, isAdd]);
         if (this._options.itemActions) {
            this._children.itemActions.updateItemActions(item);
         }
      },

      _closeSwipe: function(event, item) {
         this._children.itemActions.updateItemActions(item);
      },

      _commitEditActionHandler: function() {
         this._children.editInPlace.commitEdit();
      },

      _cancelEditActionHandler: function() {
         this._children.editInPlace.cancelEdit();
      },

      _showActionsMenu: function(event, itemData, childEvent, showAll) {
         _private.showActionsMenu(this, event, itemData, childEvent, showAll);
      },

      _onItemContextMenu: function(event, itemData) {
         this._showActionsMenu.apply(this, arguments);
         this._listViewModel.setMarkedKey(itemData.key);
      },

      _closeActionsMenu: function(args) {
         _private.closeActionsMenu(this, args);
      },

      _itemMouseDown: function(event, itemData, domEvent) {
         var
            items,
            dragItemIndex,
            dragStartResult;
         if (this._options.itemsDragNDrop) {
            items = cClone(this._options.selectedKeys) || [];
            dragItemIndex = items.indexOf(itemData.key);
            if (dragItemIndex !== -1) {
               items.splice(dragItemIndex, 1);
            }
            items.unshift(itemData.key);
            dragStartResult = this._notify('dragStart', [items]);
            if (dragStartResult) {
               this._children.dragNDropController.startDragNDrop(dragStartResult, domEvent);
               this._itemDragData = itemData;
            }
         }
      },

      _onLoadMoreClick: function() {
         _private.loadToDirectionIfNeed(this, 'down');
      },

      _dragStart: function(event, dragObject) {
         this._listViewModel.setDragEntity(dragObject.entity);
         this._listViewModel.setDragItemData(this._itemDragData);
      },

      _dragEnd: function(event, dragObject) {
         if (this._options.itemsDragNDrop) {
            this._dragEndHandler(dragObject);
         }
      },

      _dragEndHandler: function(dragObject) {
         var targetPosition = this._listViewModel.getDragTargetPosition();

         if (targetPosition) {
            this._notify('dragEnd', [dragObject.entity, targetPosition.item, targetPosition.position]);
         }
      },

      _dragEnter: function(event, dragObject) {
         var
            dragEnterResult,
            draggingItemProjection;

         if (!this._listViewModel.getDragEntity()) {
            dragEnterResult = this._notify('dragEnter', [dragObject.entity]);

            if (cInstance.instanceOfModule(dragEnterResult, 'WS.Data/Entity/Record')) {
               draggingItemProjection = this._listViewModel._prepareDisplayItemForAdd(dragEnterResult);
               this._listViewModel.setDragItemData(this._listViewModel.getItemDataByItem(draggingItemProjection));
               this._listViewModel.setDragEntity(dragObject.entity);
            } else if (dragEnterResult === true) {
               this._listViewModel.setDragEntity(dragObject.entity);
            }
         }
      },

      _dragLeave: function() {
         this._listViewModel.setDragTargetPosition(null);
      },

      _documentDragEnd: function() {
         this._listViewModel.setDragTargetPosition(null);
         this._listViewModel.setDragItemData(null);
         this._listViewModel.setDragEntity(null);
      },

      _itemMouseEnter: function(event, itemData) {
         var
            dragPosition,
            dragItemData,
            dragEntity = this._listViewModel.getDragEntity();

         if (dragEntity) {
            dragItemData = this._listViewModel.getDragItemData();

            if (!dragItemData || dragItemData.key !== itemData.key) {
               dragPosition = this._listViewModel.calculateDragTargetPosition(itemData);

               if (this._notify('changeDragTarget', [this._listViewModel.getDragEntity(), dragPosition.item, dragPosition.position]) !== false) {
                  this._listViewModel.setDragTargetPosition(dragPosition);
               }
            }
         }
      },
      
      _sortingChanged: function(event, propName, sortingType) {
         var newSorting = _private.getSortingOnChange(this._options.sorting, propName, sortingType);
         event.stopPropagation();
         this._notify('sortingChanged', [newSorting]);
      }
   });

   // TODO https://online.sbis.ru/opendoc.html?guid=17a240d1-b527-4bc1-b577-cf9edf3f6757
   /* ListView.getOptionTypes = function getOptionTypes(){
    return {
    dataSource: Types(ISource)
    }
    }; */
   BaseControl._private = _private;
   BaseControl.getDefaultOptions = function() {
      return {
         uniqueKeys: true,
         multiSelectVisibility: 'hidden',
         style: 'default',
         selectedKeys: defaultSelectedKeys,
         excludedKeys: defaultExcludedKeys
      };
   };
   return BaseControl;
});
