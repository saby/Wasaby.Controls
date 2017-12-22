define('js!Controls/Popup/Manager',
   [
      'Core/helpers/random-helpers',
      'js!Controls/Popup/Manager/Container',
      'WS.Data/Collection/List'
   ],

   function (Random, Container, List) {
      'use strict';

      var _popupContainer;

      var _private = {
         /**
          * Вернуть следующий z-index
          */
         calculateZIndex: function () {
            if (!Manager._zIndex) {
               Manager._zIndex = 10;
            }
            return Manager._zIndex += 10;
         },

         focusOut: function (id, focusedControl) {
            var
               element = Manager._find(id);
            if (element) {
               if (!!element.popupOptions.autoHide) {
                  var
                     opener = element.popupOptions.opener,
                     parent = focusedControl.to;
                  while (!!parent) {
                     if (parent._options.id === opener._options.id || parent._options.id === id) {
                        return;
                     }
                     parent = parent.getParent();
                  }
                  Manager.remove(id);
               }
            }
         },

         /**
          * Вытолкнуть окно наверх
          * @param popup инстанс попапа
          */
         pushUp: function (popup) {
            var
               element = Manager._find(popup._options.id);
            if (element) {
               element.zIndex = _private.calculateZIndex();
               Manager._setItems();
            }
         },

         /**
          * Пересчитать положение попапа
          * @param popup инстанс попапа
          */
         recalcPosition: function (popup) {
            var
               element = Manager._find(popup._options.id);
            if (element) {
               if (element.strategy) {
                  element.position = element.strategy.getPosition(popup);
                  Manager._setItems();
               }
            }
         },

         getPopupContainer: function(){
            // временное решение, пока непонятно как Manager должен узнать о контейнере
            if( document && !_popupContainer){
               var element = document.getElementById('popup');
               if( element && element.controlNodes && element.controlNodes.length ){
                  _popupContainer = element.controlNodes[0].control;
                  _popupContainer.eventHandlers = {
                     onClosePopup: function(event, id){
                        Manager.remove(id);
                     },
                     onFocusIn: function (event, id) {

                     },
                     onFocusOut: function (event, id, focusedControl) {
                        _private.focusOut(id, focusedControl);
                     },
                     onRecalcPosition: function (event, popup) {
                        _private.recalcPosition(popup);
                     }
                  };
               }
            }
            return _popupContainer;
         }
      };

      /**
       * Менеджер окон
       * @class Controls/Popup/Manager
       * @control
       * @public
       * @category Popup
       * @singleton
       */
      var Manager = {
         /**
          * Показать всплывающее окно
          * @function Controls/Popup/Manager#show
          * @param options компонент, который будет показан в окне
          * @param strategy стратегия позиционирования всплывающего окна
          * @param controller контроллер
          */
         show: function (options, strategy, controller) {
            var element = {};
            element.id = Random.randomId('popup-');
            options.controller = controller;
            element.popupOptions = options;
            element.strategy = strategy;
            // TODO вероятно позиция по умолчанию должна задаваться не здесь
            element.position = {
               left: -10000,
               top: -10000
            };
            element.zIndex = _private.calculateZIndex();
            this._popupItems.add(element);
            this._setItems();
            return element.id;
         },

         /**
          * Обновить опции существующего попапа
          * @function Controls/Popup/Manager#update
          * @param id идентификатор попапа, для которого нужно обновить опции
          * @param options новые опиции
          */
         update: function (id, options) {
            var
               element = this._find(id);
            if (element) {
               options.controller = element.popupOptions.controller;
               element.popupOptions = options;
               this._setItems();
               return id;
            }
            return null;
         },

         /**
          * Удалить окно
          * @function Controls/Popup/Manager#remove
          * @param id идентификатор попапа
          */
         remove: function (id) {
            var
               element = this._find(id);
            if (element) {
               this._popupItems.remove(element);
               this._setItems();
            }
         },

         _setItems: function(){
            var container = _private.getPopupContainer();
            if( container ){
               container.setPopupItems(this._popupItems);
            }
         },

         _find: function (id) {
            var
               element,
               index = this._popupItems.getIndexByValue('id', id);
            if (index > -1) {
               element = this._popupItems.at(index);
            }
            return element;
         }
      };

      Manager._popupItems = new List();

      return Manager;
   }
);