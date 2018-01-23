define('Controls/Popup/Opener/Base',
   [
      'Core/Control',
      'Controls/Popup/Manager',
      'Core/core-clone',
      'Core/core-merge'
   ],
   function (Control, Manager, CoreClone, CoreMerge) {
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
               this._popupId = Manager.show(cfg, strategy);
            }
            return this._popupId;
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