/**
 * Created by iv.cheremushkin on 14.08.2014.
 */

define('js!SBIS3.CONTROLS.ListViewDS',
   [
      'js!SBIS3.CORE.CompoundControl',
      'js!SBIS3.CONTROLS.DSMixin',
      'js!SBIS3.CONTROLS.MultiSelectable',
      'js!SBIS3.CONTROLS.ItemActionsGroup',
      'html!SBIS3.CONTROLS.ListViewDS',
      'js!SBIS3.CONTROLS.CommonHandlers'
   ],
   function (CompoundControl, DSMixin, MultiSelectable, ItemActionsGroup, dotTplFn, CommonHandlers) {

      'use strict';

      /**
       * Контрол, отображающий внутри себя набор однотипных сущностей, умеет отображать данные списком по определенному шаблону, а так же фильтровать и сортировать
       * @class SBIS3.CONTROLS.ListViewDS
       * @extends $ws.proto.Control
       * @mixes SBIS3.CONTROLS.DSMixin
       * @mixes SBIS3.CONTROLS.MultiSelectable
       * @control
       */

      var ListViewDS = CompoundControl.extend([DSMixin, MultiSelectable, CommonHandlers], /** @lends SBIS3.CONTROLS.ListViewDS.prototype */ {
         $protected: {
            _floatCheckBox : null,
            _dotTplFn: dotTplFn,
            _dotItemTpl: null,
            _itemsContainer: null,
            _actsContainer: null,
            _mouseOnItemActions: false,
            _hoveredItem: {
               target: null,
               key: null,
               position: null,
               size: null
            },
            _itemActionsGroup: null,
               _options: {
               /**
                * @cfg {} Шаблон отображения каждого элемента коллекции
                */
               itemTemplate: '',
               /**
                * @cfg {Array} Набор действий, над элементами, отображающийся в виде иконок. Можно использовать для массовых операций.
                */
               itemsActions: [{
                  name: 'delete',
                  icon: 'sprite:icon-16 icon-Erase icon-error',
                  title: 'Удалить',
                  isMainAction: true,
                  onActivated: function(item) {
                     this.deleteRecords(item.data('id'));
                  }
               }],
               /**
                * @cfg {Boolean} Разрешено или нет перемещение элементов Drag-and-Drop
                */
               itemsDragNDrop: false,
               /**
                * @cfg {String|jQuery|HTMLElement} Что отображается когда нет записей
                */
               emptyHTML: null,
               /**
                * @cfg {Function} Обработчик клика на элемент
                */
               elemClickHandler: null,
               multiselect: false,

               infiniteScroll: false
            },
            _loadingIndicator: undefined,
            _hasScrollMore : true,
            _infiniteScrollOffset: null,
            _nowLoading: false,
            _allowInfiniteScroll: true,
            _scrollIndicatorHeight: 32,
            _isLoadBeforeScrollAppears : true,
            _infiniteScrollContainer: null
         },

         $constructor: function () {
            var self = this;
            this._publish('onChangeHoveredItem', 'onItemActions');

            this._container.mouseup(function (e) {
               if (e.which == 1) {
                  var $target = $(e.target),
                      target = $target.hasClass('controls-ListView__item') ? e.target : $target.closest('.controls-ListView__item');
                  if (target.length) {
                     var id = target.data('id');
                     self._elemClickHandler(id, self._dataSet.getRecordByKey(id), e.target);
                  }
               }
            });
            this._container.mousemove(this._mouseMoveHandler.bind(this))
                           .mouseleave(this._mouseLeaveHandler.bind(this));
            if (this.isInfiniteScroll()) {
               this._infiniteScrollContainer = this._container.closest('.controls-ListView__infiniteScroll');
               if (this._infiniteScrollContainer.length) {
                  //TODO Данный функционал пока не протестирован, проверить, когда появтся скроллы в контейнерах
                  this._infiniteScrollContainer.bind('scroll.wsInfiniteScroll', this._onInfiniteContainerScroll.bind(this));
               } else {
                  $(window).bind('scroll.wsInfiniteScroll', this._onWindowScroll.bind(this));
               }
            }
         },

         init: function () {
            var self = this;
            // запросим данные из источника
            this.reload();
         },
         /**
          * Обрабатывает перемещения мышки на элемент представления
          * @param e
          * @private
          */
         _mouseMoveHandler: function(e) {
            var $target = $(e.target),
               target,
               targetKey;
            //Если увели мышку на оперции по ховеру, то делать ничего не надо
            if(this._mouseOnItemActions) {
               return;
            }
            //Если увели мышку с контейнера с элементами(например на шапку), нужно об этом посигналить
            if($target.closest('.controls-DataGrid__thead').length) {
               this._mouseLeaveHandler();
               return;
            }
            target = $target.hasClass('controls-ListView__item') ? $target : $target.closest('.controls-ListView__item');
            if (target.length) {
               targetKey = target.data('id');
               if (targetKey !== undefined && this._hoveredItem.key !== targetKey) {
                  this._hoveredItem = {
                     key: targetKey,
                     container: target,
                     position: {
                        top: target[0].offsetTop,
                        left: target[0].offsetLeft
                     },
                     size: {
                        height: target[0].offsetHeight,
                        width: target[0].offsetWidth
                     }
                  };
                  this._notify('onChangeHoveredItem', this._hoveredItem);
                  this._onChangeHoveredItem(this._hoveredItem);
               }
            }
         },
         /**
          * Обрабатывает уведение мышки с элемента представления
          * @private
          */
         _mouseLeaveHandler: function() {
            this._hoveredItem = {
               container: null,
               key: null,
               position: null,
               size: null
            };
            this._notify('onChangeHoveredItem', this._hoveredItem);
            this._onChangeHoveredItem(this._hoveredItem);
         },
         /**
          * Обработчик на смену выделенного элемента представления
          * @private
          */
         _onChangeHoveredItem: function(hoveredItem) {
           if(this._options.itemsActions.length) {
              if(hoveredItem.container) {
                 this._showItemActions();
              } else {
                 //Если открыто меню опций, то скрывать опции не надо
                 if(this._itemActionsGroup && !this._itemActionsGroup.isItemActionsMenuVisible()) {
                    this._itemActionsGroup.hideItemActions();
                 }
              }
           }
         },

         /**
          * Установить, что отображается когда нет записей
          * @param html содержимое блока
          */
         setEmptyHTML: function (html) {

         },
         _getItemTemplate: function () {
            return this._options.itemTemplate;
         },

         _getItemsContainer : function() {
            return $(".controls-ListView__itemsContainer", this._container.get(0))
         },

         /* +++++++++++++++++++++++++++ */

         _elemClickHandler: function (id, data, target) {
            if (this._options.multiselect) {
               if ($(target).hasClass('controls-ListView__itemCheckBox')) {
                  var key = $(target).closest('.controls-ListView__item').data('id');
                  this.toggleItemsSelection([key]);
               }
               else {
                  if (this._options.elemClickHandler) {
                     this._options.elemClickHandler.call(this, id, data, target);
                  }
               }
            }
            else {
               this.setSelectedItems([id]);
               if (this._options.elemClickHandler) {
                  this._options.elemClickHandler.call(this, id, data, target);
               }
            }
         },

         _getItemActionsContainer: function (id) {
            return $(".controls-ListView__item[data-id='" + id + "']", this._container.get(0));
         },

         _drawSelectedItems: function (idArray) {
            $(".controls-ListView__item", this._container).removeClass('controls-ListView__item__selected');
            for (var i = 0; i < idArray.length; i++) {
               $(".controls-ListView__item[data-id='" + idArray[i] + "']", this._container).addClass('controls-ListView__item__selected');
            }
         },
         reload: function(){
            if (this.isInfiniteScroll()) {
               this._loadingIndicator = undefined;
               this._hasScrollMore = true;
               this._infiniteScrollOffset = this._offset;
               //После релоада придется заново догружать данные до появлени скролла
               this._isLoadBeforeScrollAppears = true;
            }
            ListViewDS.superclass.reload.apply(this, arguments);
         },

         setElemClickHandler: function (method) {
            this._options.elemClickHandler = method;
         },

         //********************************//
         //   БЛОК ОПЕРАЦИЙ НАД ЗАПИСЬЮ    //
         //*******************************//
         //TODO Сделать создание опций, как по одной, так и нескольких
         /**
          * Показывает оперцаии над записью для элемента
          * @param item
          * @private
          */
         _showItemActions: function() {
            console.time('1');
            //Создадим операции над записью, если их нет
            this.getItemActions();

            //Если показывается меню, то не надо позиционировать операции над записью
            if(this._itemActionsGroup.isItemActionsMenuVisible()) {
               return;
            }

            this._itemActionsGroup.applyItemActions();
            this._itemActionsGroup.showItemActions(this._hoveredItem);
            console.timeEnd('1');
         },
         /**
          * Создаёт операции над записью
          * @private
          */
         _drawItemActions: function() {
            return new ItemActionsGroup({
               items: this._options.itemsActions,
               element: this._container.find('> .controls-ListView__itemActions-container'),
               keyField: 'name',
               parent: this
            });
         },
         /**
          * Инициализирует операции над записью
          * @private
          */
         _initItemActions: function() {
            this._itemActionsGroup = this._drawItemActions();
            this._itemActionsGroup
               .getContainer()
               .bind('mousemove mouseleave', this._itemActionsHoverHandler.bind(this))
         },
         /**
          * Обрабатывает приход/уход мыши на операции строки
          * Нужен чтобы нормально работал ховер
          */
         _itemActionsHoverHandler: function(e) {
            this._mouseOnItemActions = e.type === 'mousemove';
            if (!this._itemActionsGroup.isItemActionsMenuVisible()) {
               this._itemActionsGroup.hoverImitation(e.type === 'mousemove');
            }
         },
         /**
          * Геттер для получения операций над записью
          * @returns {*}
          */
         getItemActions: function() {
            if(!this._itemActionsGroup && this._options.itemsActions.length) {
               this._initItemActions();
            }
            return this._itemActionsGroup;
         },
         //**********************************//
         //КОНЕЦ БЛОКА ОПЕРАЦИЙ НАД ЗАПИСЬЮ //
         //*********************************//

         _drawItemsCallback: function () {
            if (this.isInfiniteScroll()) {
               this._loadBeforeScrollAppears();
            }
            this._drawSelectedItems(this._options.selectedItems);
         },
         destroy: function() {
            if (this.isInfiniteScroll()){
               if (this._infiniteScrollContainer.length) {
                  this._infiniteScrollContainer.unbind('.wsInfiniteScroll');
               } else {
                  $(window).unbind('.wsInfiniteScroll');
               }
            }
         },
         //-----------------------------------infiniteScroll------------------------
         //TODO Сделать подгрузку вверх
         //TODO (?) избавиться от _allowInfiniteScroll - пусть все будет завязано на опцию infiniteScroll
         isInfiniteScroll : function(){
            return this._options.infiniteScroll;
         },
         /**
          *  Общая проверка и загрузка данных для всех событий по скроллу
          */
         _loadChecked: function(result){
            if (result) {
               this._nextLoad();
            }
         },
         _onWindowScroll: function(event){
            this._loadChecked(this._isBottomOfPage());
         },
         //TODO Проверить, когда появятся контейнеры со скроллом. Возможно нужно смотреть не на offset
         _onInfiniteContainerScroll: function(){
            this._loadChecked(this._infiniteScrollContainer.scrollTop() + this._scrollIndicatorHeight >= this._loadingIndicator.offset().top );
         },

         _nextLoad: function(){
            var self = this, records;
            //Если в догруженных данных в датасете пришел n = false, то больше не грузим.
            //TODO Когда в core появится возможность останавливать Deferred убрать _nowLoading и отменять или дожидаться загрузки по готовности Deferred
            // запоминать в query (Deferred.isReady()). Так же нужно будет исользовать для фильтрации
            if (this._allowInfiniteScroll && this._hasNextPage(this._dataSet.getMetaData().more) && this._hasScrollMore && !this._nowLoading) {
               this._addLoadingIndicator();
               this._nowLoading = true;
               this._dataSource.query(this._filter, this._sorting, this._infiniteScrollOffset  + this._limit, this._limit).addCallback(function (dataSet) {
                  self._nowLoading = false;
                  //Если данные пришли, нарисуем
                  if (dataSet.getCount()) {
                     records = dataSet._getRecords();
                     self._dataSet.merge(dataSet);
                     self._drawItems(records);
                  }
                  if (self._hasNextPage(dataSet.getMetaData().more)){
                     self._infiniteScrollOffset += self._limit;
                  } else {
                     self._hasScrollMore = false;
                     self._removeLoadingIndicator();
                  }
               });
            }
         },
         _isBottomOfPage : function() {
            var docBody = document.body,
               docElem = document.documentElement,
               clientHeight = Math.min (docBody.clientHeight, docElem.clientHeight),
               scrollTop = Math.max (docBody.scrollTop, docElem.scrollTop),
               scrollHeight = Math.max (docBody.scrollHeight, docElem.scrollHeight);
            return (clientHeight + scrollTop >= scrollHeight - this._scrollIndicatorHeight);//Учитываем отступ снизу на высоту картинки индикатора загрузки
         },
         _loadBeforeScrollAppears: function(){
            var elem = this._infiniteScrollContainer.length ? this._infiniteScrollContainer.get(0) : $('body').get(0);
            // Было: this._dataSet.getCount() <= parseInt(($(window).height() /  32 ) + 10 , 10
            if (this._isLoadBeforeScrollAppears && !(elem.scrollHeight > $(window).height())){
               this._nextLoad();
            } else {
               this._isLoadBeforeScrollAppears = false;
            }
         },
         _addLoadingIndicator: function(){
            if (!this._loadingIndicator ) {
               this._loadingIndicator = this._container.find('.controls-ListView-scrollIndicator');
               this._scrollIndicatorHeight = this._loadingIndicator.height();
            }
            this._loadingIndicator.removeClass('ws-hidden');
         },
         /**
          * Удаляет индикатор загрузки
          * @private
          */
         _removeLoadingIndicator: function(){
            if( this._loadingIndicator && !this._nowLoading){
               this._loadingIndicator.addClass('ws-hidden');
            }
         },
         /**
          * Разрешить или запретить подгрузку данных по скроллу.
          * @param {Boolean} allow - true - разрешить, false - запретить
          * @param {Boolean} [noLoad] - true - не загружать сразу
          */
         setInfiniteScroll: function(allow, noLoad){
            this._allowInfiniteScroll = allow;
            if (allow && !noLoad) {
               this._nextLoad();
               return;
            }
            this._removeLoadingIndicator();
         },
         /**
          * Геттер для получения текущего выделенного элемента
          * @returns {{key: null | number, container: (null | jQuery)}}
          */
         getHoveredItem: function() {
           return this._hoveredItem;
         }
      });

      return ListViewDS;

   });