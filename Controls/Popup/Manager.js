define('Controls/Popup/Manager',
   [
      'Core/Control',
      'tmpl!Controls/Popup/Manager/Manager',
      'Controls/Popup/Manager/ManagerController',
      'Core/helpers/Number/randomId',
      'WS.Data/Collection/List'
   ],

   function(Control, template, ManagerController, randomId, List) {
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
            var removeDeferred = element.controller.elementDestroyed(element, container, id);
            _private.redrawItems(self._popupItems);
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
               element.controller.elementCreated(element, _private.getItemContainer(id), id);
               this._notify('managerPopupCreated', [element, this._popupItems], {bubbling: true});
               return true;
            }
            return false;
         },

         popupUpdated: function(id) {
            var element = ManagerController.find(id);
            if (element) {
               element.controller.elementUpdated(element, _private.getItemContainer(id)); // при создании попапа, зарегистрируем его
               this._notify('managerPopupUpdated', [element, this._popupItems], {bubbling: true});
               return true;
            }
            return false;
         },

         popupAfterUpdated: function(id) {
            var element = ManagerController.find(id);
            if (element) {
               return element.controller.elementAfterUpdated(element, this.getItemContainer(id)); // при создании попапа, зарегистрируем его
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
            return item && item._container;
         },

         redrawItems: function(items) {
            ManagerController.getContainer().setPopupItems(items);
         }
      };

      var Manager = Control.extend({
         _template: template,
         _afterMount: function() {
            ManagerController.setManager(this);
            this._popupItems = new List();
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
            var item = {
               id: randomId('popup-'),
               isModal: options.isModal,
               controller: controller,
               popupOptions: options
            };
            controller.getDefaultConfig(item);
            _private.addElement.call(this, item);
            _private.redrawItems(this._popupItems);
            return item.id;
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
               element.popupOptions = options;
               element.controller.elementUpdated(element, _private.getItemContainer(id));
               _private.updateOverlay.call(this);
               _private.redrawItems(this._popupItems);
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
         }
      });

      Manager.prototype._private = _private;
      return Manager;
   });
