/**
 * Created by dv.zuev on 13.03.2017.
 */
define('js!SBIS3.CONTROLS.ListView/ListView.compatible', [
   'js!SBIS3.CONTROLS.ItemsToolbar',
   'Core/core-functions',
   'Core/helpers/dom&controls-helpers',
   "Core/helpers/Object/isEmpty",
   'Core/helpers/functional-helpers',
   "Core/Deferred",
   'Core/constants'
], function (ItemsToolbar,
             cFunctions,
             dcHelpers,
             isEmpty,
             fHelpers,
             Deferred,
             constants) {
   'use strict';

   return {

      _prepareItemData: function(cfg) {
         var buildArgsMethod;
         if ((cfg||this._options)._canServerRender) {
            buildArgsMethod = (cfg||this._options)._buildTplArgs;
         }
         else {
            buildArgsMethod = this._buildTplArgs;
         }
         if (!this._itemData) {
            this._itemData = cFunctions.clone(buildArgsMethod.call(this, cfg||this._options));
         }
         return this._itemData;
      },

      _getItemsContainer: function () {
         return $('.controls-ListView__itemsContainer', this._container.get(0)).first();
      },
      _getItemContainer: function(parent, item) {
         return parent.find('>[data-id="' + item.getId() + '"]:not(".controls-editInPlace")');
      },
      _notifyOnItemClick: function(id, data, target, e) {
         return this._notify('onItemClick', id, data, target, e);
      },

      _eventProxyHandler: function(e) {
         var self = this,
            originalEvent = e.originalEvent,
            mobFix = 'controls-ListView__mobileSelected-fix',
            isTouchEvent = originalEvent ? ((!originalEvent.movementX && !originalEvent.movementY && constants.compatibility.touch && (originalEvent.touches || constants.browser.isMobilePlatform)) || (originalEvent.sourceCapabilities && originalEvent.sourceCapabilities.firesTouchEvents)) : true;
         if (!this.iWantVDOM) {
            this._setTouchSupport(
               /* touch события - однозначно включаем touch режим */
               Array.indexOf(['swipe', 'tap', 'touchend'], e.type) !== -1 ||
               /* IOS - однозначно включаем touch режим */
               constants.browser.isMobileIOS ||
               /* Для остальных устройств из-за большого количества неожиданных багов, таких как:
                - mousemove срабатывает при клике пальцем (после touchStart), можно определить по координатам сдвига 0.0
                - mousemove срабатывает через случайный промежуток времени после touchEnd
                - mousemove бывает проскакивает между touchmove, особенно часто повторяется на android и windows устройствах
                написана специальная проверка */
               (e.type === 'mousemove' && isTouchEvent)
            );
         }

         switch (e.type) {
            case 'mousemove':
               self._allowMouseMoveEvent && !isTouchEvent && this._mouseMoveHandler(e);
               break;
            case 'touchstart':
               this._touchstartHandler(e);
               // На windows 10 планшетах между touch-событиями прилетают события мыши
               // поэтому на секунду игнорируем mouseMove событие т.к. произошло касание и мыши быть не может
               if(self._allowMouseMoveEvent && !constants.browser.isMobileIOS) {
                  self._allowMouseMoveEvent = false;
                  setTimeout(function () {
                     self._allowMouseMoveEvent = true;
                  }, 1000);
               }
               break;
            case 'swipe':
               this._swipeHandler(e);
               break;
            case 'tap':
               this._tapHandler(e);
               break;
            case 'mouseleave':
               this._mouseLeaveHandler(e);
               break;
            case 'touchend':
               /* Ipad пакетирует измененния, и не применяет их к дому, пока не закончит работу синхронный код.
                Для того, чтобы сэмулировать мновенную обработку клика, надо сделать изменения в DOM'e
                раньше события click. Поэтому на touchEnd (срабатывает раньше клика) вешаем специальный класс,
                который показывает по :hover оранжевый маркер и по событию tap его снимаем. */
               this._container.addClass(mobFix);
               break;
            case 'taphold':
               this._container.removeClass(mobFix);
               break;
            case 'contextmenu':
               this._contextMenuHandler(e);
               /* Выставляем этот флаг, чтобы не было имитации клика (см. метод _onActionHandler в Control.module.js).
                Сейчас проблема в том, что при клике двумя пальцами на touch устройствах событие contextmenu срабатывает,
                а click нет, поэтому в методе _onActionHandler происходит имитация клика, которая при срабатывании события contextmenu не нужна. */
               this._clickState.detected = true;
               break;
            case 'mousedown':
               this._mouseDownHandler(e);
               break;
            case 'mouseup':
               this._mouseUpHandler(e);
               break;
            case 'click':
               if (this.iWantVDOM) {
                  this._baseItemClickHandler(e);
               }
               break;
         }
      },


      _baseItemClickHandler: function(e){
         var $target = $(e.target),
            target = this._findItemByElement($target),
            model;

         if (target.length && this._isViewElement(target)) {
            model = this._getItemsProjection().getByHash(target.data('hash')).getContents();
            this._elemClickHandler(model.getId(), model, e.target, e);
         }
         if (this._options.multiselect && $target.length && $target.hasClass('controls-DataGridView__th__checkBox')){
            $target.hasClass('controls-DataGridView__th__checkBox__checked') ? this.setSelectedKeys([]) :this.setSelectedItemsAll();
            $target.toggleClass('controls-DataGridView__th__checkBox__checked');
         }
         if (this._options.groupBy && !isEmpty(this._options.groupBy) && this._options.groupBy.clickHandler instanceof Function) {
            var closestGroup = $target.closest('.controls-GroupBy', this._getItemsContainer());
            if (closestGroup.length) {
               this._options.groupBy.clickHandler.call(this, $target);
            }
         }
         if (!isEmpty(this._options.groupBy) && this._options.easyGroup && $(e.target).hasClass('controls-GroupBy__separatorCollapse')) {
            var idGroup = $(e.target).closest('.controls-GroupBy').attr('data-group');
            this.toggleGroup(idGroup);
         }
      },

      _elemClickHandler: function (id, data, target, e) {
         var $target = $(target),
            self = this,
            elClickHandler = this._options.elemClickHandler,
            needSelect = true,
            afterHandleClickResult = fHelpers.forAliveOnly(function(result) {
               if (result !== false) {
                  if(needSelect) {
                     self.setSelectedKey(id);
                  }
                  self._elemClickHandlerInternal(data, id, target, e);
                  elClickHandler && elClickHandler.call(self, id, data, target, e);
               }
            }, this),
            onItemClickResult;

         if (this._options.multiselect) {
            if ($target.hasClass('js-controls-ListView__itemCheckBox')) {
               if(this._isItemSelected(id)) {
                  needSelect = false;
               }
               this._onCheckBoxClick($target);
            }
            else {
               onItemClickResult = this._notifyOnItemClick(id, data, target, e);
            }
         }
         else {
            onItemClickResult = this._notifyOnItemClick(id, data, target, e);
         }
         if (onItemClickResult instanceof Deferred) {
            onItemClickResult.addCallback(function (result) {
               afterHandleClickResult(result);
               return result;
            });
         } else {
            afterHandleClickResult(onItemClickResult);
         }
      },

      _elemClickHandlerInternal: function (data, id, target, e) {
         /* Клик по чекбоксу не должен вызывать активацию элемента */
         if(!$(target).hasClass('js-controls-ListView__itemCheckBox')) {
            this._activateItem(id);
         }
      },

      /**
       * Выбирает элемент коллекции по переданному идентификатору.
       * @remark
       * На выбранный элемент устанавливается маркер (оранжевая вертикальная черта) и изменяется фон.
       * При выполнении команды происходит события {@link onItemActivate} и {@link onSelectedItemChange}.
       * @param {Number} id Идентификатор элемента коллекции, который нужно выбрать.
       * @example
       * <pre>
       *    myListView.sendCommand('activateItem', myId);
       * </pre>
       * @private
       * @command activateItem
       * @see sendCommand
       * @see beginAdd
       * @see cancelEdit
       * @see commitEdit
       */
      _activateItem : function(id) {
         var item = this.getItems().getRecordById(id);
         this._notify('onItemActivate', {id: id, item: item});
      },
      
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
      _isViewElement: function (elem) {
         return  dcHelpers.contains(this._getItemsContainer()[0], elem[0]);
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