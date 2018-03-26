define('Controls/Popup/Opener/Stack',
   [
      'Controls/Popup/Opener/Base',
      'Controls/Popup/Opener/Stack/StackController'
   ],
   function (Base, Strategy) {
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
         open: function (config) {
            return Base.prototype.open.call(this, config, Strategy);
         }
      });

      return Stack;
   }
);