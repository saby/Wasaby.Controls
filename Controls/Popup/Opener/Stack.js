define('Controls/Popup/Opener/Stack',
   [
      'Controls/Popup/Opener/BaseOpener'
   ],
   function(Base) {
      var POPUP_CLASS = 'controls-Stack controls-Stack__waiting';

      /**
       * Действие открытия стековой панели.
       * 
       * <a href="https://test-wi.sbis.ru/materials/demo-ws4-opener-stack">Демо-пример</a>.
       * <u>Внимание</u>: временно демо-пример размещён на test-wi.sbis.ru.
       * Для авторизации воспользуйтесь связкой логин/пароль как "Демо_тензор"/"Демо123".
       * 
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
            config.className = (config.className || '') + ' ' + POPUP_CLASS;
            this._setCompatibleConfig(config);
            return Base.prototype.open.call(this, config, 'Controls/Popup/Opener/Stack/StackController');
         },

         _setCompatibleConfig: function(config) {
            config._type = 'stack'; //for compoundArea
         }
      });

      return Stack;
   }
);
