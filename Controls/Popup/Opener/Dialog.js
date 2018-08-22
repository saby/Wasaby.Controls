define('Controls/Popup/Opener/Dialog',
   [
      'Controls/Popup/Opener/BaseOpener'
   ],
   function(Base) {
      /**
       * Действие открытия окна
       * @class Controls/Popup/Opener/Dialog
       * @control
       * @public
       * @author Красильников А.С.
       * @category Popup
       * @extends Controls/Popup/Opener/Base
       */

      var _private = {
         getDialogConfig: function(config) {
            config = config || {};
            config.isDefaultOpener = config.isDefaultOpener !== undefined ? config.isDefaultOpener : true;
            return config;
         }
      };

      var Dialog = Base.extend({

         /**
          * Открыть диалоговое окно
          * @function Controls/Popup/Opener/Dialog#open
          * @param config конфигурация попапа
          */
         open: function(config) {
            config = _private.getDialogConfig(config);
            Base.prototype.open.call(this, config, 'Controls/Popup/Opener/Dialog/DialogController');
         }
      });

      Dialog._private = _private;

      return Dialog;
   }
);
