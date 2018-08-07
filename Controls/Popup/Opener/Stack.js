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
       * @category Popup
       * @extends Controls/Popup/Opener/BaseOpener
       */
      var Stack = BaseOpener.extend({

         /**
          * Открыть стек-панель
          * @function Controls/Popup/Opener/Stack#open
          * @param config конфигурация попапа
          */
         open: function(config) {
            config.isDefaultOpener = config.isDefaultOpener !== undefined ? config.isDefaultOpener : true;
            this._setCompatibleConfig(config);
            return BaseOpener.prototype.open.call(this, config, 'Controls/Popup/Opener/Stack/StackController');
         },

         _setCompatibleConfig: function(config) {
            config._type = 'stack'; // for compoundArea
         }
      });

      return Stack;
   });
