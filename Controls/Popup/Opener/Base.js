define('js!Controls/Popup/Opener/Base',
   [
      'Core/Control',
      'js!Controls/Popup/Manager',
      'Core/core-clone',
      'Core/core-merge',
      'js!Controls/Popup/Controller'
   ],
   function (Control, Manager, CoreClone, CoreMerge, Controller) {
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
               cfg = CoreClone(this._options.popupOptions);
            CoreMerge(cfg, config || {});
            if (this.isOpened()) {
               this._popupId = Manager.update(this._popupId, cfg);
            }
            else {
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
            return this._controller.resultDef;
         },

         /**
          * Закрыть всплывающую панель
          * @function Controls/Popup/Opener/Base#show
          */
         close: function () {
            if (this._popupId) {
               Manager.remove(this._popupId);
            }
         },

         /**
          * Получить признак, открыта или закрыта связанная всплывающая панель
          * @function Controls/Popup/Opener/Base#isOpened
          * @returns {Boolean} Признак открыта ли связанная всплывающая панель
          */
         isOpened: function () {
            return !!Manager.find(this._popupId);
         }
      });
      return Base;
   }
);