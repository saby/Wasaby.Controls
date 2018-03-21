define('Controls/Popup/Opener/Stack/StackController',
   [
      'Controls/Popup/Opener/BaseController',
      'Controls/Popup/Opener/Stack/StackStrategy',
      'WS.Data/Collection/List',
      'Core/Deferred',
      'Core/constants'
   ],
   function (BaseController, StackStrategy, List, cDeferred, cConstants) {
      'use strict';

      var POPUP_CLASS = 'ws-Container__stack-panel';

      /**
       * Контроллер стековых панелей.
       * @class Controls/Popup/Opener/Stack/StackController
       * @control
       * @private
       * @category Popup
       */

      var StackController = BaseController.extend({
         constructor: function (cfg) {
            StackController.superclass.constructor.call(this, cfg);
            this._stack = new List();
         },

         elementCreated: function (element) {
            if (!element.popupOptions) {
               element.popupOptions = {};
            }
            //Добавляем стандартный класс
            element.popupOptions.className += ' ' + POPUP_CLASS;
            this._stack.add(element, 0);
            this._update();
         },

         elementUpdated: function(){
            this._update();
         },

         elementDestroyed: function (element, container) {
            var
               self = this,
               def = new cDeferred();
            if( cConstants.browser.chrome && !cConstants.browser.isMobilePlatform ){
               container.addEventListener('transitionend', function(){
                  self._stack.remove(element);
                  self._update();
                  def.callback();
               });
               container.style.width = '0';
            }
            else{
               self._stack.remove(element);
               self._update();
               def.callback();
            }
            return def;
         },

         _update: function () {
            var tCoords = StackStrategy.getStackParentCoords(),
                previous;
            this._stack.each(function (item, index) {
               var
                  prevWidth = previous ? previous.width : null,
                  prevRight = previous ? previous.right : null,
                  width = StackStrategy.getPanelWidth(item.popupOptions.minWidth, item.popupOptions.maxWidth, window.innerWidth),
                  maxPanelWidth = StackStrategy.getMaxPanelWidth(window.innerWidth);
               item.position = StackStrategy.getPosition(index, tCoords, width, maxPanelWidth, prevWidth, prevRight);
               previous = item.position;
               if (!previous) {
                  item.position = {
                     top: -10000,
                     left: -10000,
                     width: 0
                  };
               }
            });
         }
      });

      return new StackController();
   }
);