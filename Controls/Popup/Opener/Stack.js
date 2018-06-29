define('Controls/Popup/Opener/Stack',
   [
      'Controls/Popup/Opener/BaseOpener'
   ],
   function(Base) {
      var POPUP_CLASS = 'controls-Stack';

      /**
       * Действие открытия стековой панели
       * @class Controls/Popup/Opener/Stack
       * @control
       * @public
       * @category Popup
       * @extends Controls/Popup/Opener/Base
       * @demo Controls-demo/Popup/PopupPage
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
