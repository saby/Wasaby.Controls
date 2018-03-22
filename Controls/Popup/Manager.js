define('Controls/Popup/Manager',
   [
      'Core/helpers/random-helpers',
      'WS.Data/Collection/List'
   ],

   function (Random, List) {
      'use strict';

      var _popupContainer;

      var _private = {
         addElement: function (element) {
            this._popupItems.add(element);
            if (element.isModal) {
               _private.getPopupContainer().setOverlay(this._popupItems.getCount() - 1);
            }
         },

         removeElement: function (element, container, id) {
            var self = this;
            return element.strategy.elementDestroyed(element, container, id).addCallback( function(){
               self._popupItems.remove(element);
               if (element.isModal) {
                  var indices = self._popupItems.getIndicesByValue('isModal', true);
                  _private.getPopupContainer().setOverlay(indices.length ? indices[indices.length - 1] : -1);
                  return element;
               }
            });
         },

         /**
          * Получить Popup/Container
          * TODO временное решение, пока непонятно, как Manager должен узнать о контейнере
          */
         getPopupContainer: function () {
            if (document && !_popupContainer) {
               var element = document.getElementById('popup');
               if (element && element.controlNodes && element.controlNodes.length) {
                  _popupContainer = element.controlNodes[0].control;
                  _popupContainer.eventHandlers = {
                     onClosePopup: function (event, id, container) {
                        _private.popupClose(id, container);
                     },
                     onPopupCreated: function (event, id) {
                        _private.popupCreated(id);
                     },
                     onPopupUpdated: function (event, id) {
                        _private.popupUpdated(id);
                     },
                     onPopupFocusIn: function (event, id, focusedControl) {
                        _private.popupFocusIn(id, focusedControl);
                     },
                     onPopupFocusOut: function (event, id, focusedControl) {
                        _private.popupFocusOut(id, focusedControl);
                     },
                     onResult: function (event, id, result) {
                        _private.sendResult(id, result);
                     }
                  };
               }
            }
            return _popupContainer;
         },

         popupCreated: function (id) {
            var element = Manager.find(id);
            if (element) {
               var strategy = element.strategy;
               if (strategy) {
                  // при создании попапа, зарегистрируем его
                  strategy.elementCreated(element, this.getItemContainer(id), id);
                  Manager._redrawItems();
               }
            }
         },

         popupUpdated: function (id) {
            var element = Manager.find(id);
            if (element) {
               var strategy = element.strategy;
               if (strategy) {
                  strategy.elementUpdated(element, this.getItemContainer(id)); // при создании попапа, зарегистрируем его
                  Manager._redrawItems();
               }
            }
         },
         
         fireEventHandler: function(id, event, eventArg) {
            var element = Manager.find(id);
            if (element && element.popupOptions.eventHandlers && element.popupOptions.eventHandlers.hasOwnProperty(event)) {
               element.popupOptions.eventHandlers[event](eventArg);
            }
         },
         
         popupFocusIn: function(id, focusedControl){
            _private.fireEventHandler(id, 'onFocusIn', focusedControl);
         },

         popupFocusOut: function (id, focusedControl) {
            _private.fireEventHandler(id, 'onFocusOut', focusedControl);
         },

         sendResult: function (id, result) {
            _private.fireEventHandler(id, 'onResult', result);
         },
         
         popupClose: function(id) {
            _private.fireEventHandler(id, 'onClose');
            Manager.remove(id, this.getItemContainer(id));
         },
         getItemContainer: function (id) {
            var popupContainer = this.getPopupContainer();
            var item = popupContainer && popupContainer._children[id];
            return item && item._container;
         }
      };

      var Manager = {
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
         show: function (options, strategy) {
            var element = {
               id: Random.randomId('popup-'),
               isModal: options.isModal,
               strategy: strategy,
               position: {
                  top: -10000,
                  left: -10000
               },
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
         update: function (id, options) {
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
         remove: function (id, container) {
            var
               element = this.find(id);
            if (element) {
               _private.removeElement.call(this, element, container, id).addCallback( function(){
                  Manager._redrawItems();
                  return element;
               });
            }
         },

         /**
          * Найти конфиг попапа
          * @function Controls/Popup/Manager#find
          * @param id идентификатор попапа
          */
         find: function (id) {
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
         _redrawItems: function () {
            var container = _private.getPopupContainer();
            if (container) {
               container.setPopupItems(this._popupItems);
            }
         }
      };

      Manager._popupItems = new List();
      Manager._private = _private;
      return Manager;
   }
);