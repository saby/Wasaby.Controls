define('js!Controls/Popup/Opener/Base',
   [
      'Core/Control',
      'js!Controls/Popup/Manager',
      'Core/core-merge',
      'js!Controls/Popup/Controller'
   ],
   function (Control, Manager, CoreMerge, Controller) {
      /**
       * Базовый опенер
       * @category Popup
       * @class Controls/Popup/Opener/Base
       * @control
       * @author Лощинин Дмитрий
       */
      var Base = Control.extend({
         _beforeUnmount: function () {
            this.close();
         },

         /**
          * Открыть всплывающую панель
          * @function Controls/Popup/Opener/Base#open
          * @param config конфигурация попапа
          * @param strategy стратегия позиционирования попапа
          */
         open: function (config, strategy) {
            var
               cfg = config || {};
            CoreMerge(cfg, this._options.popupOptions);
            if (this._popupId) {
               this._popupId = Manager.update(this._popupId, cfg);
            }
            if (!this._popupId) {
               if (!cfg.opener) {
                  cfg.opener = this;
               }
               this._controller = new Controller({
                  eventHandlers: {
                     onResult: this._options.onResult
                  }
               });
               this._popupId = Manager.show(cfg, strategy, this._controller);
            }
         },

         /**
          * Закрыть всплывающую панель
          * @function Controls/Popup/Opener/Base#show
          */
         close: function () {
            if (this._popupId) {
               Manager.remove(this._popupId);
            }
         }
      });
      return Base;
   }
);