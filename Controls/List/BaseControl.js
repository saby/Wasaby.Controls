define('Controls/List/BaseControl', [
   'Core/Control',
   'Core/IoC',
   'Core/core-clone',
   'tmpl!Controls/List/BaseControl/BaseControl',
   'Controls/List/resources/utils/ItemsUtil',
   'require',
   'Controls/List/Controllers/VirtualScroll',
   'Controls/Controllers/SourceController',
   'Core/helpers/Object/isEqual',
   'Core/Deferred',
   'tmpl!Controls/List/BaseControl/multiSelect',
   'WS.Data/Collection/RecordSet',
   'Controls/Utils/Toolbar',
   'Controls/List/ItemActions/Utils/Actions',
   'Controls/List/EditInPlace',
   'Controls/List/ItemActions/ItemActionsControl',
   'css!Controls/List/BaseControl/BaseControl'
], function(Control,
   IoC,
   cClone,
   BaseControlTpl,
   ItemsUtil,
   require,
   VirtualScroll,
   SourceController,
   isEqualObject,
   Deferred,
   multiSelectTpl,
   RecordSet,
   tUtil,
   aUtil
) {
   'use strict';

   var _private = {
      reload: function(self, filter, userCallback, userErrback) {
         if (self._sourceController) {
            _private.showIndicator(self);

            //Need to create new Deffered, returned success result
            //load() method may be fired with errback
            var resDeferred = new Deferred();
            self._sourceController.load(filter, self._sorting).addCallback(function(list) {

               if (userCallback && userCallback instanceof Function) {
                  userCallback(list);
               }

               _private.hideIndicator(self);

               if (self._listViewModel) {
                  self._listViewModel.setItems(list);
               }

               //pre scroll loading
               //не использовать удалить по задаче https://online.sbis.ru/opendoc.html?guid=f968dcef-6d9f-431c-9653-5aea20aeaff2
               if (!list.getCount()) {
                  self._notify('checkScroll', [], {bubbling: true});
               }

               //self._virtualScroll.setItemsCount(self._listViewModel.getCount());


               _private.handleListScroll(self, 0);
               resDeferred.callback(list);
            }).addErrback(function(error) {
               _private.processLoadError(self, error, userErrback);
               resDeferred.callback(null);
            });

            return resDeferred;
         } else {
            IoC.resolve('ILogger').error('BaseControl', 'Source option is undefined. Can\'t load data');
         }
      },

      loadToDirection: function(self, direction, userCallback, userErrback) {
         _private.showIndicator(self, direction);
         if (self._sourceController) {
            return self._sourceController.load(self._options.filter, self._sorting, direction).addCallback(function(addedItems) {

               if (userCallback && userCallback instanceof Function) {
                  userCallback(addedItems, direction);
               }

               _private.hideIndicator(self);

               if (direction === 'down') {
                  self._listViewModel.appendItems(addedItems);
                  self._virtualScroll.appendItems(addedItems.getCount());
               } else if (direction === 'up') {
                  self._listViewModel.prependItems(addedItems);
                  self._virtualScroll.prependItems(addedItems.getCount());
               }

               //pre scroll loading
               //не использовать удалить по задаче https://online.sbis.ru/opendoc.html?guid=f968dcef-6d9f-431c-9653-5aea20aeaff2
               if (!addedItems.getCount()) {
                  self._notify('checkScroll', [], {bubbling: true});
               }

               return addedItems;

               //обновить начало/конец видимого диапазона записей и высоты распорок
               //_private.applyVirtualWindow(self, self._virtualScroll.getVirtualWindow());
            }).addErrback(function(error) {
               return _private.processLoadError(self, error, userErrback);
            });
         } else {
            IoC.resolve('ILogger').error('BaseControl', 'Source option is undefined. Can\'t load data');
         }
      },


      processLoadError: function(self, error, userErrback) {
         if (!error.canceled) {
            _private.hideIndicator(self);

            if (userErrback && userErrback instanceof Function) {
               userErrback(error);
            }

            if (!(error.processed || error._isOfflineMode)) {//Не показываем ошибку, если было прервано соединение с интернетом
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

      onScrollLoadEdge: function(self, direction) {
         if (self._options.navigation && self._options.navigation.view === 'infinity') {
            if (self._sourceController.hasMoreData(direction) && !self._sourceController.isLoading()) {
               _private.loadToDirection(self, direction, self._options.dataLoadCallback, self._options.dataLoadErrback);
            }
         }
      },

      onScrollListEdge: function(self, direction) {
         if (self._scrollPagingCtr) {
            self._scrollPagingCtr.handleScrollEdge(direction);
         }
      },

      scrollToEdge: function(self, direction) {
         if (self._sourceController && self._sourceController.hasMoreData(direction)) {
            self._sourceController.setEdgeState(direction);
            _private.reload(self, self._options.filter, self._options.dataLoadCallback, self._options.dataLoadErrback).addCallback(function() {
               if (direction === 'up') {
                  self._notify('doScroll', ['top'], {bubbling: true});
               } else {
                  self._notify('doScroll', ['bottom'], {bubbling: true});
               }
            });
         } else {
            if (direction === 'up') {
               self._notify('doScroll', ['top'], {bubbling: true});
            } else {
               self._notify('doScroll', ['bottom'], {bubbling: true});
            }
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
         self._loadingState = direction ? direction : 'all';
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
       * @param scrollTop
       */
      handleListScroll: function(self, scrollTop) {
         var virtualWindowIsChanged = self._virtualScroll.setScrollTop(scrollTop);
         if (virtualWindowIsChanged) {
            //_private.applyVirtualWindow(self, self._virtualScroll.getVirtualWindow());
         }
         if (self._scrollPagingCtr) {
            self._scrollPagingCtr.handleScroll(scrollTop);
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
            //_private.applyVirtualWindow(self, res.virtualWindow);
         }
      },

      getItemsCount: function(self) {
         return self._listViewModel ? self._listViewModel.getCount() : 0;
      },

      initListViewModelHandler: function(self, model) {
         model.subscribe('onListChange', function() {
            self._forceUpdate();
         });
      },

      showActionsMenu: function(self, event, itemData, childEvent, showAll) {
         var
            context = event.type === 'itemcontextmenu',
            showActions = (context || showAll) && itemData.itemActions.all
               ? itemData.itemActions.all
               : itemData.itemActions && itemData.itemActions.all.filter(function(action) {
                  return action.showType !== tUtil.showType.TOOLBAR;
               });
         if (context && self._isTouch) {
            return false;
         }
         if (showActions && showActions.length) {
            var
               rs = new RecordSet({rawData: showActions});
            childEvent.nativeEvent.preventDefault();
            childEvent.stopImmediatePropagation();
            itemData.contextEvent = context;
            self._listViewModel.setActiveItem(itemData);
            self._children.itemActionsOpener.open({
               opener: self._children.listView,
               target: !context ? childEvent.target : false,
               templateOptions: {items: rs},
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
            aUtil.actionClick(self, event, action, self._listViewModel.getActiveItem());
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
            closeByExternalClick: true,
            corner: {vertical: 'top', horizontal: 'right'},
            horizontalAlign: {side: 'left'},
            eventHandlers: {
               onResult: self._closeActionsMenu,
               onClose: self._closeActionsMenu
            },
            templateOptions: {
               showClose: true
            }
         };
      }
   };

   /**
    * Компонент плоского списка, с произвольным шаблоном отображения каждого элемента. Обладает возможностью загрузки/подгрузки данных из источника.
    * @class Controls/List/BaseControl
    * @extends Core/Control
    * @mixes Controls/interface/ISource
    * @mixes Controls/interface/IPromisedSelectable
    * @mixes Controls/interface/IGroupedView
    * @mixes Controls/interface/INavigation
    * @mixes Controls/interface/IFilter
    * @mixes Controls/interface/IHighlighter
    * @mixes Controls/List/interface/IBaseControl
    * @mixes Controls/interface/IRemovable
    * @mixes Controls/interface/IEditInPlace
    * @control
    * @public
    * @category List
    */

   var BaseControl = Control.extend({
      _template: BaseControlTpl,
      iWantVDOM: true,
      _isActiveByClick: false,

      _listViewModel: null,

      _loader: null,
      _loadingState: null,
      _loadingIndicatorState: null,

      //TODO пока спорные параметры
      _sorting: undefined,

      _itemTemplate: null,
      _multiSelectTpl: multiSelectTpl,

      _loadOffset: 100,
      _topPlaceholderHeight: 0,
      _bottomPlaceholderHeight: 0,
      _menuIsShown: null,

      _popupOptions: null,

      constructor: function(cfg) {
         BaseControl.superclass.constructor.apply(this, arguments);
      },

      _beforeMount: function(newOptions, context, receivedState) {
         _private.bindHandlers(this);
         _private.setPopupOptions(this);

         this._virtualScroll = new VirtualScroll({
            maxVisibleItems: newOptions.virtualScrollConfig && newOptions.virtualScrollConfig.maxVisibleItems,
            itemsCount: 0
         });

         /* Load more data after reaching end or start of the list.
          TODO могут задать items как рекордсет, надо сразу обработать тогда навигацию и пэйджинг
          */

         if (newOptions.viewModelConfig && newOptions.viewModelConstructor) {
            this._listViewModel = new newOptions.viewModelConstructor(newOptions.viewModelConfig);
            this._virtualScroll.setItemsCount(this._listViewModel.getCount());
            _private.initListViewModelHandler(this, this._listViewModel);
         }

         if (newOptions.source) {
            this._sourceController = new SourceController({
               source: newOptions.source,
               navigation: newOptions.navigation  //TODO возможно не всю навигацию надо передавать а только то, что касается source
            });

            if (receivedState) {
               this._sourceController.calculateState(receivedState);
               this._listViewModel.setItems(receivedState);
            } else {
               return _private.reload(this, newOptions.filter, newOptions.dataLoadCallback, newOptions.dataLoadErrback);
            }
         }
      },

      getViewModel: function() {
         return this._listViewModel;
      },

      getSourceController: function() {
         return this._sourceController;
      },

      _afterMount: function() {
         _private.startScrollEmitter(this);

         if (_private.getItemsCount(this)) {
            //Посчитаем среднюю высоту строки и отдадим ее в VirtualScroll
            _private.initializeAverageItemsHeight(this);
         }
      },

      _beforeUpdate: function(newOptions) {
         var filterChanged = !isEqualObject(newOptions.filter, this._options.filter);
         var sourceChanged = newOptions.source !== this._options.source;

         if (newOptions.viewModelConfig && (newOptions.viewModelConfig !== this._options.viewModelConfig)) {
            this._listViewModel = new newOptions.viewModelConstructor(newOptions.viewModelConfig);
            _private.initListViewModelHandler(this, this._listViewModel);

            //this._virtualScroll.setItemsCount(this._listViewModel.getCount());
         } else
         if (newOptions.selectedKey !== this._options.selectedKey) {
            this._listViewModel.setMarkedKey(newOptions.selectedKey);
         }


         if (sourceChanged) {
            if (this._sourceController) {
               this._sourceController.destroy();
            }

            //TODO обработать смену фильтров и т.д. позвать релоад если надо

            this._sourceController = new SourceController({
               source: newOptions.source,
               navigation: newOptions.navigation
            });
         }

         if (filterChanged || sourceChanged) {
            _private.reload(this, newOptions.filter, newOptions.dataLoadCallback,  newOptions.dataLoadErrback);
         }

         if (this._options.selectedKeys !== newOptions.selectedKeys) {
            this._listViewModel.select(newOptions.selectedKeys);
         }

      },

      _beforeUnmount: function() {

         if (this._sourceController) {
            this._sourceController.destroy();
         }

         if (this._scrollPagingCtr) {
            this._scrollPagingCtr.destroy();
         }

         BaseControl.superclass._beforeUnmount.apply(this, arguments);
      },


      _afterUpdate: function() {
         if (_private.getItemsCount(this)) {
            _private.initializeAverageItemsHeight(this);
         }
      },

      __onPagingArrowClick: function(e, arrow) {
         switch (arrow) {
            case 'Next': this._notify('doScroll', ['pageDown'], {bubbling: true}); break;
            case 'Prev': this._notify('doScroll', ['pageUp'], {bubbling: true}); break;
            case 'Begin': _private.scrollToEdge(this, 'up'); break;
            case 'End': _private.scrollToEdge(this, 'down'); break;
         }
      },

      __onEmitScroll: function(e, type, params) {
         var self = this;
         switch (type) {
            case 'loadTop': _private.onScrollLoadEdge(self, 'up'); break;
            case 'loadBottom': _private.onScrollLoadEdge(self, 'down'); break;
            case 'listTop': _private.onScrollListEdge(self, 'up'); break;
            case 'listBottom': _private.onScrollListEdge(self, 'down'); break;
            case 'scrollMove': _private.handleListScroll(self, params.scrollTop); break;
            case 'canScroll': _private.onScrollShow(self); break;
            case 'cantScroll': _private.onScrollHide(self); break;
         }

      },

      _onCheckBoxClick: function(e, key, status) {
         this._notify('onCheckBoxClick', [key, status]);
      },

      _listSwipe: function(event, itemData, childEvent) {
         var direction = childEvent.nativeEvent.direction;
         this._children.itemActionsOpener.close();
         if (direction === 'right' && itemData.multiSelectVisibility) {
            var status = itemData.multiSelectStatus;
            this._notify('onCheckBoxClick', [itemData.key, status]);
         }
         if (direction === 'right' || direction === 'left') {
            var newKey = ItemsUtil.getPropertyValue(itemData.item, this._options.viewConfig.keyProperty);
            this._listViewModel.setMarkedKey(newKey);
         }
      },

      removeItems: function(items) {
         this._children.removeControl.removeItems(items);
      },

      _beforeItemsRemove: function(event, items) {
         return this._notify('beforeItemsRemove', [items]);
      },

      _afterItemsRemove: function(event, items, result) {
         this._notify('afterItemsRemove', [items, result]);
      },

      _showIndicator: function(event, direction) {
         _private.showIndicator(this, direction);
         event.stopPropagation();
      },

      _hideIndicator: function(event) {
         _private.hideIndicator(this);
         event.stopPropagation();
      },

      reload: function() {
         return _private.reload(this, this._options.filter, this._options.dataLoadCallback, this._options.dataLoadErrback);
      },

      _onGroupClick: function(e, item, baseEvent) {
         // if clicked on group expander element
         if (baseEvent.target.className.indexOf('controls-ListView__groupExpander') !== -1) {
            this._listViewModel.toggleGroup(item);
         }
      },

      _onItemClick: function(e, item) {
         var newKey = ItemsUtil.getPropertyValue(item, this._options.viewConfig.keyProperty);
         this._listViewModel.setMarkedKey(newKey);
      },

      /**
      * Starts editing in place.
      * @param {ItemEditOptions} options Options of editing.
      * @returns {Core/Deferred}
      */
      editItem: function(options) {
         this._children.editInPlace.editItem(options);
      },

      /**
      * Starts adding.
      * @param {AddItemOptions} options Options of adding.
      * @returns {Core/Deferred}
      */
      addItem: function(options) {
         this._children.editInPlace.addItem(options);
      },

      _onBeforeItemAdd: function(e, options) {
         return this._notify('beforeItemAdd', [options]);
      },

      _onBeforeItemEdit: function(e, options) {
         return this._notify('beforeItemEdit', [options]);
      },

      _onAfterItemEdit: function(e, item, isAdd) {
         this._notify('afterItemEdit', [item, isAdd]);
         this._children.itemActions.updateItemActions(item, true);
      },

      _onBeforeItemEndEdit: function(e, item, commit, isAdd) {
         return this._notify('beforeItemEndEdit', [item, commit, isAdd]);
      },

      _onAfterItemEndEdit: function(e, item, isAdd) {
         this._notify('afterItemEndEdit', [item, isAdd]);
         this._children.itemActions.updateItemActions(item);
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

      _closeActionsMenu: function(args) {
         _private.closeActionsMenu(this, args);
      },

      moveItemUp: function(item) {
         this._children.moveControl.moveItemUp(item);
      },

      moveItemDown: function(item) {
         this._children.moveControl.moveItemDown(item);
      },

      moveItems: function(items, target, position) {
         this._children.moveControl.moveItems(items, target, position);
      },

      _beforeItemsMove: function(event, items, target, position) {
         return this._notify('beforeItemsMove', [items, target, position]);
      },

      _afterItemsMove: function(event, items, target, position, result) {
         this._notify('afterItemsMove', [items, target, position, result]);
      },

      _onActionClick: function(e, action, item) {
         this._notify('actionClick', [action, item]);
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
            }
         }
      },

      _dragStart: function(event, dragObject) {
         this._listViewModel.setDragItems(dragObject.entity.getItems());
      },

      _dragEnd: function(event, dragObject) {
         if (this._options.itemsDragNDrop) {
            this._dragEndHandler(dragObject);
         }
      },

      _dragEndHandler: function(dragObject) {
         var
            items = dragObject.entity.getItems(),
            dragTarget = this._listViewModel.getDragTargetItem(),
            targetPosition = this._listViewModel.getDragTargetPosition();

         if (dragTarget && this._notify('dragEnd', [items, dragTarget.item, targetPosition.position]) !== false) {
            this._children.moveControl.moveItems(items, dragTarget.item, targetPosition.position);
         }
      },

      _dragLeave: function() {
         this._listViewModel.setDragTargetItem(null);
      },

      _documentDragStart: function() {
         this._isDragging = true;
      },

      _documentDragEnd: function() {
         this._isDragging = false;
         this._listViewModel.setDragTargetItem(null);
         this._listViewModel.setDragItems(null);
      },

      _itemMouseEnter: function(event, itemData) {
         if (this._options.itemsDragNDrop && this._isDragging && !itemData.isDragging) {
            this._listViewModel.setDragTargetItem(itemData);
         }
      }
   });

   //TODO https://online.sbis.ru/opendoc.html?guid=17a240d1-b527-4bc1-b577-cf9edf3f6757
   /*ListView.getOptionTypes = function getOptionTypes(){
    return {
    dataSource: Types(ISource)
    }
    };*/
   BaseControl._private = _private;
   BaseControl.getDefaultOptions = function() {
      return {
         uniqueKeys: true
      };
   };
   return BaseControl;
});
