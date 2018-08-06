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
       * @category Popup
       * @extends Controls/Popup/Opener/Base
       */
      var Dialog = Base.extend({

         /**
          * Открыть диалоговое окно
          * @function Controls/Popup/Opener/Dialog#open
          * @param config конфигурация попапа
          */
         open: function(config) {
            config.isDefaultOpener = config.isDefaultOpener !== undefined ? config.isDefaultOpener : true;
            Base.prototype.open.call(this, config, 'Controls/Popup/Opener/Dialog/DialogController');
         }
      });

      return Dialog;
   }
);
