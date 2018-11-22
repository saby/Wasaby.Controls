define('Controls/Popup/Manager',
   [
      'Core/Control',
      'wml!Controls/Popup/Manager/Manager',
      'Controls/Popup/Manager/ManagerController',
      'Core/helpers/Number/randomId',
      'WS.Data/Collection/List',
      'Core/EventBus',
      'Core/detection'
   ],

   function(Control, template, ManagerController, randomId, List, EventBus, cDetection) {
      'use strict';

      var _private = {
         addElement: function(element) {
            this._popupItems.add(element);
            if (element.isModal) {
               ManagerController.getContainer().setOverlay(this._popupItems.getCount() - 1);
            }
         },

         removeElement: function(element, container, id) {
            var self = this;
            var removeDeferred = element.controller._elementDestroyed(element, container, id);
            _private.redrawItems(self._popupItems);

            if (element.popupOptions.maximize) {
               self._hasMaximizePopup = false;
            }

            return removeDeferred.addCallback(function afterRemovePopup() {
               self._popupItems.remove(element);
               _private.updateOverlay.call(self);
               self._notify('managerPopupDestroyed', [element, self._popupItems], {bubbling: true});
               return element;
            });
         },

         updateOverlay: function() {
            var indices = this._popupItems.getIndicesByValue('isModal', true);
            ManagerController.getContainer().setOverlay(indices.length ? indices[indices.length - 1] : -1);
         },

         popupCreated: function(id) {
            var element = ManagerController.find(id);
            if (element) {
               // при создании попапа, зарегистрируем его
               element.controller._elementCreated(element, _private.getItemContainer(id), id);
               this._notify('managerPopupCreated', [element, this._popupItems], {bubbling: true});
               return true;
            }
            return false;
         },

         popupUpdated: function(id) {
            var element = ManagerController.find(id);
            if (element) {
               var needUpdate = element.controller._elementUpdated(element, _private.getItemContainer(id)); // при создании попапа, зарегистрируем его
               this._notify('managerPopupUpdated', [element, this._popupItems], {bubbling: true});
               return !!needUpdate;
            }
            return false;
         },

         popupMaximized: function(id, state) {
            var element = ManagerController.find(id);
            if (element) {
               element.controller.elementMaximized(element, _private.getItemContainer(id), state);
               this._notify('managerPopupMaximized', [element, this._popupItems], {bubbling: true});
               return true;
            }
            return false;
         },

         popupAfterUpdated: function(id) {
            var element = ManagerController.find(id);
            if (element) {
               return element.controller._elementAfterUpdated(element, _private.getItemContainer(id)); // при создании попапа, зарегистрируем его
            }
            return false;
         },

         popupDeactivated: function(id) {
            var element = ManagerController.find(id);
            if (element) {
               element.controller.popupDeactivated(element, _private.getItemContainer(id)); // при создании попапа, зарегистрируем его
            }
            return false;
         },

         popupDragStart: function(id, offset) {
            var element = ManagerController.find(id);
            if (element) {
               element.controller.popupDragStart(element, _private.getItemContainer(id), offset);
               return true;
            }
            return false;
         },

         popupDragEnd: function(id, offset) {
            var element = ManagerController.find(id);
            if (element) {
               element.controller.popupDragEnd(element, offset);
               return true;
            }
            return false;
         },

         popupResult: function(id) {
            var args = Array.prototype.slice.call(arguments, 1);
            return _private.fireEventHandler.apply(_private, [id, 'onResult'].concat(args));
         },

         popupClose: function(id) {
            ManagerController.remove(id, _private.getItemContainer(id));
            return false;
         },

         popupAnimated: function(id) {
            var element = ManagerController.find(id);
            if (element) {
               return element.controller.elementAnimated(element, _private.getItemContainer(id));
            }
            return false;
         },

         fireEventHandler: function(id, event) {
            var element = ManagerController.find(id);
            var args = Array.prototype.slice.call(arguments, 2);
            if (element && element.popupOptions.eventHandlers && typeof element.popupOptions.eventHandlers[event] === 'function') {
               element.popupOptions.eventHandlers[event].apply(element.popupOptions, args);
               return true;
            }
            return false;
         },

         getItemContainer: function(id) {
            var popupContainer = ManagerController.getContainer();
            var item = popupContainer && popupContainer._children[id];
            var container = item && item._container;

            // При работе popup'ов внутри слоя совместимости, _container может быть обернут
            // в jQuery. Так как система работает с нативными элементами, нужно в таком случае
            // снять jQuery-обертку
            if (container && container.jquery) {
               container = container[0];
            }
            return container;
         },

         redrawItems: function(items) {
            ManagerController.getContainer().setPopupItems(items);
         },

         controllerVisibilityChangeHandler: function(instance) {
            instance._popupItems.each(function(item) {
               if (item.controller.needRecalcOnKeyboardShow()) {
                  item.controller._elementUpdated(item, _private.getItemContainer(item.id));
               }
            });
            _private.redrawItems(instance._popupItems);
         }
      };

      var Manager = Control.extend({
         _template: template,
         _afterMount: function() {
            ManagerController.setManager(this);
            this._hasMaximizePopup = false;
            this._popupItems = new List();
            if (cDetection.isMobileIOS) {
               _private.controllerVisibilityChangeHandler = _private.controllerVisibilityChangeHandler.bind(_private, this);
               EventBus.globalChannel().subscribe('MobileInputFocus', _private.controllerVisibilityChangeHandler);
               EventBus.globalChannel().subscribe('MobileInputFocusOut', _private.controllerVisibilityChangeHandler);
            }
         },

         /**
          * Менеджер окон
          * @class Controls/Popup/Manager
          * @private
          * @singleton
          * @category Popup
          * @author Красильников Андрей
          */

         /**
          * Показать всплывающее окно
          * @function Controls/Popup/Manager#show
          * @param options конфигурация попапа
          * @param controller стратегия позиционирования попапа
          */
         show: function(options, controller) {
            var item = this._createItemConfig(options, controller);
            controller.getDefaultConfig(item);
            _private.addElement.call(this, item);
            _private.redrawItems(this._popupItems);
            return item.id;
         },

         _createItemConfig: function(options, controller) {
            if (!this._hasMaximizePopup && options.maximize) {
               this._hasMaximizePopup = true;
            }
            return {
               id: randomId('popup-'),
               isModal: options.isModal,
               controller: controller,
               popupOptions: options,
               sizes: {},
               popupState: controller.POPUP_STATE_INITIALIZING,
               hasMaximizePopup: this._hasMaximizePopup
            };
         },

         /**
          * Обновить опции существующего попапа
          * @function Controls/Popup/Manager#update
          * @param id идентификатор попапа, для которого нужно обновить опции
          * @param options новые опции
          */
         update: function(id, options) {
            var element = this.find(id);
            if (element) {
               var oldOptions = element.popupOptions;
               element.popupOptions = options;
               if (element.controller._elementUpdated(element, _private.getItemContainer(id))) {
                  _private.updateOverlay.call(this);
                  _private.redrawItems(this._popupItems);
               } else {
                  element.popupOptions = oldOptions;
               }
               return id;
            }
            return null;
         },

         /**
          * Удалить окно
          * @function Controls/Popup/Manager#remove
          * @param id идентификатор попапа
          * @param container контейнер
          */
         remove: function(id) {
            var self = this;
            var element = this.find(id);
            if (element) {
               _private.fireEventHandler(id, 'onClose');
               _private.removeElement.call(this, element, _private.getItemContainer(id), id).addCallback(function() {
                  _private.redrawItems(self._popupItems);
                  return element;
               });
            }
         },

         /**
          * Найти конфиг попапа
          * @function Controls/Popup/Manager#find
          * @param id идентификатор попапа
          */
         find: function(id) {
            var
               element,
               index = this._popupItems.getIndexByValue('id', id);
            if (index > -1) {
               element = this._popupItems.at(index);
            }
            return element;
         },

         /**
          * Переиндексировать набор попапов, например после изменения конфигурации
          * одного из них
          * @function Controls/Popup/Manager#reindex
          */
         reindex: function() {
            this._popupItems._reindex();
         },

         _eventHandler: function(event, actionName) {
            var args = Array.prototype.slice.call(arguments, 2);
            var actionResult = _private[actionName].apply(this, args);
            if (actionResult === true) {
               _private.redrawItems(this._popupItems);
            }
         },
         _beforeUnmount: function() {
            if (cDetection.isMobileIOS) {
               EventBus.globalChannel().unsubscribe('MobileInputFocus', _private.controllerVisibilityChangeHandler);
               EventBus.globalChannel().unsubscribe('MobileInputFocusOut', _private.controllerVisibilityChangeHandler);
            }
         }
      });

      Manager.prototype._private = _private;
      return Manager;
   });
