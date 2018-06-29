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
            return element.strategy.elementDestroyed(element, container, id).addCallback(function() {
               self._popupItems.remove(element);
               if (element.isModal) {
                  var indices = self._popupItems.getIndicesByValue('isModal', true);
                  ManagerController.getContainer().setOverlay(indices.length ? indices[indices.length - 1] : -1);
                  return element;
               }
            });
         },

         popupCreated: function(id) {
            var element = ManagerController.find(id);
            if (element) {
               // при создании попапа, зарегистрируем его
               element.strategy.elementCreated(element, this.getItemContainer(id), id);
               return true;
            }
            return false;
         },

         popupUpdated: function(id) {
            var element = ManagerController.find(id);
            if (element) {
               element.strategy.elementUpdated(element, this.getItemContainer(id)); // при создании попапа, зарегистрируем его
               return true;
            }
            return false;
         },

         popupResult: function(id) {
            var args = Array.prototype.slice.call(arguments, 1);
            return _private.fireEventHandler.apply(_private, [id, 'onResult'].concat(args));
         },

         popupClose: function(id) {
            ManagerController.remove(id, this.getItemContainer(id));
            return false;
         },

         popupAnimated: function(id) {
            var element = ManagerController.find(id);
            if (element) {
               element.strategy.elementAnimated(element, this.getItemContainer(id));
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
         }
      };

      var Manager = Control.extend({
         _template: template,
         constructor: function() {
            Manager.superclass.constructor.apply(this, arguments);
            ManagerController.setManager(this);
            this._popupItems = new List();
         },

         /**
          * Менеджер окон
          * @class Controls/Popup/Manager
          * @private
          * @singleton
          * @category Popup
          * @author Лощинин Дмитрий
          */

         /**
          * Показать всплывающее окно
          * @function Controls/Popup/Manager#show
          * @param options конфигурация попапа
          * @param strategy стратегия позиционирования попапа
          */
         show: function(options, strategy) {
            var element = {
               id: randomId('popup-'),
               isModal: options.isModal,
               strategy: strategy,
               position: strategy.getDefaultPosition(),
               popupOptions: options
            };
            _private.addElement.call(this, element);
            this._redrawItems();
            return element.id;
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
               element.strategy.elementUpdated(element, _private.getItemContainer(id));
               this._redrawItems();
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
                  self._redrawItems();
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
          * Установить набор попапов
          * @function Controls/Popup/Manager#_redrawItems
          */
         _redrawItems: function() {
            ManagerController.getContainer().setPopupItems(this._popupItems);
         },
         _eventHandler: function(event, actionName) {
            var args = Array.prototype.slice.call(arguments, 2);
            var actionResult = _private[actionName].apply(_private, args);
            if (actionResult === true) {
               this._redrawItems();
            }
         }
      });

      Manager.prototype._private = _private;
      return Manager;
   }
);
