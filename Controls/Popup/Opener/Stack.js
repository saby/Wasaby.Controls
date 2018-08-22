define('Controls/Popup/Opener/Stack',
   [
      'Controls/Popup/Opener/BaseOpener'
   ],
   function(BaseOpener) {

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
       * @author Красильников А.С.
       * @category Popup
       * @extends Controls/Popup/Opener/BaseOpener
       */

      var _private = {
         getStackConfig: function(config) {
            config = config || {};
            config.isDefaultOpener = config.isDefaultOpener !== undefined ? config.isDefaultOpener : true;
            return config;
         }
      };

      var Stack = BaseOpener.extend({

         /**
          * Открыть стек-панель
          * @function Controls/Popup/Opener/Stack#open
          * @param config конфигурация попапа
          */
         open: function(config) {
            config = _private.getStackConfig(config);
            this._setCompatibleConfig(config);
            return BaseOpener.prototype.open.call(this, config, 'Controls/Popup/Opener/Stack/StackController');
         },

         _setCompatibleConfig: function(config) {
            config._type = 'stack'; // for compoundArea
         }
      });

      Stack._private = _private;

      return Stack;
   });
