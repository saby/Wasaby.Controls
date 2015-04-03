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
               key: null,
               container: null
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
               multiselect: false
            }
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
               if (targetKey && this._hoveredItem.key !== targetKey) {
                  this._hoveredItem = {
                     key: targetKey,
                     container: target
                  };
                  this._notify('onChangeHoveredItem', target, targetKey);
                  this._onChangeHoveredItem(target, targetKey);
               }
            }
         },
         /**
          * Обрабатывает уведение мышки с элемента представления
          * @private
          */
         _mouseLeaveHandler: function() {
            this._hoveredItem = {
               key: null,
               container: null
            };
            this._notify('onChangeHoveredItem', false);
            this._onChangeHoveredItem(false);
         },
         /**
          * Обработчик на смену выделенного элемента представления
          * @param target
          * @param targetKey
          * @private
          */
         _onChangeHoveredItem: function(target, targetKey) {
           if(this._options.itemsActions.length) {
              if(target) {
                 this._showItemActions(target);
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

         setElemClickHandler: function (method) {
            this._options.elemClickHandler = method;
         },
         /**
          * Показывает оперцаии над записью для элемента
          * @param item
          * @private
          */
         _showItemActions: function(item) {
            var res;

            //Создадим операции над записью, если их нет
            if(!this._itemActionsGroup) {
               this._initItemActions();
            }
            //Если показывается меню, то не надо позиционировать операции над записью
            if(this._itemActionsGroup.isItemActionsMenuVisible()) {
               return;
            }

            this._itemActionsGroup.applyItemActions(item);
            this._itemActionsGroup.showItemActions(item);
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
         }
      });

      return ListViewDS;

   });