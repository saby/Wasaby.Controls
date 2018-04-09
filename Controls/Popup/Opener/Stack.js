define('Controls/Popup/Opener/Stack',
   [
      'Controls/Popup/Opener/BaseOpener',
      'Controls/Popup/Opener/Stack/StackController',
      'css!Controls/Popup/Opener/Stack/Stack'
   ],
   function(Base, Strategy) {
      var POPUP_CLASS = 'controls-Stack';

      /**
       * Действие открытия стековой панели
       * @class Controls/Popup/Opener/Stack
       * @control
       * @public
       * @category Popup
       * @extends Controls/Popup/Opener/Base
       */
      var Stack = Base.extend({

         /**
          * Открыть стек-панель
          * @function Controls/Popup/Opener/Stack#open
          * @param config конфигурация попапа
          */
         open: function(config) {
            config.className += ' ' + POPUP_CLASS;
            return Base.prototype.open.call(this, config, Strategy);
         }
      });

      return Stack;
   }
);
