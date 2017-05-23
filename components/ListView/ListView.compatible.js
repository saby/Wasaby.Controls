/**
 * Created by dv.zuev on 13.03.2017.
 */
define('js!SBIS3.CONTROLS.ListView/ListView.compatible', [
   'js!SBIS3.CONTROLS.ItemsToolbar',
   'Core/core-functions'
], function (ItemsToolbar,
            cFunctions) {
   'use strict';


   return {

      //<editor-fold desc="БЛОК ОПЕРАЦИЙ НАД ЗАПИСЬЮ">
      //********************************//
      //   БЛОК ОПЕРАЦИЙ НАД ЗАПИСЬЮ    //
      //*******************************//
      _isSupportedItemsToolbar: function() {
         return this._options.itemsActions.length || this._options.editMode.indexOf('toolbar') !== -1;
      },

      _updateItemsToolbar: function() {
         var hoveredItem = this.getHoveredItem();

         if(hoveredItem.container && this._isSupportedItemsToolbar()) {
            this._showItemsToolbar(hoveredItem);
         }
      },

      _swipeHandler: function(e){
         var target = this._findItemByElement($(e.target));

         if(!target.length) {
            return;
         }

         if (e.direction == 'left') {
            this._changeHoveredItem(target);
            this._onLeftSwipeHandler();
         } else {
            this._onRightSwipeHandler(target);
            if(this._hasHoveredItem()) {
               this._clearHoveredItem();
               this._notifyOnChangeHoveredItem();
            }
         }
         e.stopPropagation();
      },

      _onLeftSwipeHandler: function() {
         if (this._isSupportedItemsToolbar()) {
            if (this._hasHoveredItem()) {
               this._showItemsToolbar(this._hoveredItem);
               this.setSelectedKey(this._hoveredItem.key);
            } else {
               this._hideItemsToolbar();
            }
         }
      },

      /**
       * Возвращает, есть ли сейчас выделенный элемент в представлении
       * @returns {boolean}
       * @private
       */
      _hasHoveredItem: function () {
         return !!this._hoveredItem.container;
      },

      _onRightSwipeHandler: function(target) {
         var key = target[0].getAttribute('data-id');

         this.setSelectedKey(key);
         this.toggleItemsSelection([key]);

         if (this._isSupportedItemsToolbar()) {
            this._hideItemsToolbar(true);
         }
      },

      _tapHandler: function(e){
         var target = this._findItemByElement($(e.target));

         if(target.length) {
            this.setSelectedKey(target.data('id'));
         }
      },

      _findItemByElement: function(target){
         if(!target.length) {
            return [];
         }

         var elem = target.closest('.js-controls-ListView__item', this._getItemsContainer()),
            domElem = elem[0],
            dataId, dataHash;

         if(domElem) {
            dataId = domElem.getAttribute('data-id');
            dataHash = domElem.getAttribute('data-hash');
         } else {
            return elem;
         }

         if(this._getItemsProjection() && this._getItemProjectionByItemId(dataId) && this._getItemProjectionByHash(dataHash)) {
            return elem;
         } else {
            return this._findItemByElement(elem.parent());
         }
      },
      /**
       * Показывает оперцаии над записью для элемента
       * @private
       */
      _showItemsToolbar: function(target) {
         var
            toolbar = this._getItemsToolbar();
         toolbar.show(target, this._touchSupport);
         //При показе тулбара, возможно он будет показан у редактируемой строки.
         //Цвет редактируемой строки отличается от цвета строки по ховеру.
         //В таком случае переключим классы тулбара в режим редактирования.
         if (this._options.editMode.indexOf('toolbar') === -1) {
            if (this.isEdit()) {
               this._getEditInPlace().addCallback(function(editInPlace) {
                  toolbar._toggleEditClass(editInPlace.getEditingRecord().getId() == target.key);
               });
            } else {
               toolbar._toggleEditClass(false);
            }
         }
      },

      _unlockItemsToolbar: function() {
         if (this._itemsToolbar) {
            this._itemsToolbar.unlockToolbar();
         }
      },
      _hideItemsToolbar: function (animate) {
         if (this._itemsToolbar) {
            this._itemsToolbar.hide(animate);
         }
      },
      _getItemsToolbar: function() {
         var self = this;

         if (!this._itemsToolbar) {
            this._setTouchSupport(this._touchSupport);
            this._itemsToolbar = new ItemsToolbar({
               element: this.getContainer().find('> .controls-ListView__ItemsToolbar-container'),
               parent: this,
               visible: false,
               touchMode: this._touchSupport,
               className: this._notEndEditClassName,
               itemsActions: cFunctions.clone(this._options.itemsActions),
               showEditActions: this._options.editMode.indexOf('toolbar') !== -1,
               handlers: {
                  onShowItemActionsMenu: function() {
                     var hoveredKey = self.getHoveredItem().key;

                     /* По стандарту, при открытии меню операций над записью,
                      строка у которой находятся оперции должна стать активной */
                     if(hoveredKey) {
                        self.setSelectedKey(hoveredKey);
                     }
                  },
                  onItemActionActivated: function(e, key) {
                     self.setSelectedKey(key);
                     if(self._touchSupport) {
                        self._clearHoveredItem();
                     }
                  }

               }
            });
            //Когда массив action's пустой getItemsAction вернет null
            var actions = this._itemsToolbar.getItemsActions();
            if (actions) {
               actions.subscribe('onHideMenu', function () {
                  self.setActive(true);
               });
            }
         }
         return this._itemsToolbar;
      },
      /**
       * Возвращает массив, описывающий установленный набор операций над записью, доступных по наведению курсора.
       * @returns {ItemsActions[]}
       * @example
       * <pre>
       *     DataGridView.subscribe('onChangeHoveredItem', function(hoveredItem) {
          *        var actions = DataGridView.getItemsActions(),
          *        instances = actions.getItemsInstances();
          *
          *        for (var i in instances) {
          *           if (instances.hasOwnProperty(i)) {
          *              //Будем скрывать кнопку удаления для всех строк
          *              instances[i][i === 'delete' ? 'show' : 'hide']();
          *           }
          *        }
          *     });
       * </pre>
       * @see itemsActions
       * @see setItemsActions
       */
      getItemsActions: function () {
         return this._getItemsToolbar().getItemsActions();
      },
      /**
       * Устанавливает набор операций над записью, доступных по наведению курсора.
       * @param {ItemsActions[]} itemsActions
       * @example
       * <pre>
       *     DataGridView.setItemsActions([{
          *        name: 'delete',
          *        icon: 'sprite:icon-16 icon-Erase icon-error',
          *        caption: 'Удалить',
          *        isMainAction: true,
          *        onActivated: function(item) {
          *           this.deleteRecords(item.data('id'));
          *        }
          *     },
       *     {
          *        name: 'addRecord',
          *        icon: 'sprite:icon-16 icon-Add icon-error',
          *        caption: 'Добавить',
          *        isMainAction: true,
          *        onActivated: function(item) {
          *           this.showRecordDialog();
          *        }
          *     }]
       * <pre>
       * @see itemsActions
       * @see getItemsActions
       * @see getHoveredItem
       */
      setItemsActions: function (itemsActions) {
         this._options.itemsActions = itemsActions;
         if(this._itemsToolbar) {
            this._itemsToolbar.setItemsActions(cFunctions.clone(this._options.itemsActions));
            if (this.getHoveredItem().container) {
               this._notifyOnChangeHoveredItem()
            }
         }
         this._notifyOnPropertyChanged('itemsActions');
      },
      /**
       * @returns {boolean}
       * @private
       */
      // todo Проверка на "searchParamName" - костыль. Убрать, когда будет адекватная перерисовка записей (до 150 версии, апрель 2016)
      _isSearchMode: function() {
         return this._options.hierarchyViewMode;
      },

      _showToolbar: function(model) {
         var itemsInstances, itemsToolbar, editedItem, editedContainer;
         if (this._options.editMode.indexOf('toolbar') !== -1) {
            itemsToolbar = this._getItemsToolbar();

            itemsToolbar.unlockToolbar();
            /* Меняем выделенный элемент на редактируемую/добавляемую запись */
            editedContainer = this._getElementByModel(model);
            this._changeHoveredItem(editedContainer);
            //Отображаем кнопки редактирования
            itemsToolbar.showEditActions();
            if (!this.getItems().getRecordById(model.getId())) {
               if (this.getItemsActions()) {
                  itemsInstances = this.getItemsActions().getItemsInstances();
                  if (itemsInstances['delete']) {
                     this._lastDeleteActionState = itemsInstances['delete'].isVisible();
                     itemsInstances['delete'].hide();
                  }
               }
            }
            // подменяю рекод выделенного элемента на рекорд редактируемого
            // т.к. тулбар в режиме редактикрования по месту должен работать с измененной запись
            editedItem = cFunctions.clone(this.getHoveredItem());
            editedItem.record = model;
            // на событие onBeginEdit могут поменять модель, запись перерисуется и контейнер на который ссылается тулбар затрется
            if(!dcHelpers.contains(this.getContainer(), editedItem.container)){
               editedItem.container = editedContainer;
            }

            //Отображаем itemsToolbar для редактируемого элемента и фиксируем его
            this._showItemsToolbar(editedItem);
            itemsToolbar.lockToolbar();
         } else {
            if(this._touchSupport) {
               /* По стандарту перевод редактирования(без связных операций) на ipad'e
                должен скрывать операции и убирать ховер */
               this._mouseLeaveHandler();
            } else {
               this._updateItemsToolbar();
            }
         }
      },

      _hideToolbar: function() {
         if (this._options.editMode.indexOf('toolbar') !== -1) {
            //Скрываем кнопки редактирования
            this._getItemsToolbar().unlockToolbar();
            this._getItemsToolbar().hideEditActions();
            if (this._lastDeleteActionState !== undefined) {
               this.getItemsActions().getItemsInstances()['delete'].toggle(this._lastDeleteActionState);
               this._lastDeleteActionState = undefined;
            }
            // Если после редактирования более hoveredItem остался - то нотифицируем об его изменении, в остальных случаях просто скрываем тулбар
            if (this.getHoveredItem().container && !this._touchSupport) {
               this._notifyOnChangeHoveredItem();
            } else {
               this._hideItemsToolbar();
            }
         } else {
            this._updateItemsToolbar();
         }
      },


      //**********************************//
      //КОНЕЦ БЛОКА ОПЕРАЦИЙ НАД ЗАПИСЬЮ //
      //*********************************//
      //</editor-fold>


      _bindEventHandlers: function(container) {
         this._eventProxyHdl = this._eventProxyHandler.bind(this);
         container.on('swipe tap mousemove mouseleave touchend taphold touchstart contextmenu mousedown mouseup', this._eventProxyHdl);
      },

      _unbindEventHandlers: function(container) {
         container.off('swipe tap mousemove mouseleave touchend taphold touchstart contextmenu mousedown mouseup', this._eventProxyHdl);
      },



   };

});