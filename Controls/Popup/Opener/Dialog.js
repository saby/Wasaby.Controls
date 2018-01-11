define('js!Controls/Popup/Opener/Dialog',
   [
      'js!Controls/Popup/Opener/Base',
      'js!Controls/Popup/Opener/Dialog/Strategy'

   ],
   function (Base, Strategy) {
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
         open: function(config){
            return Base.prototype.open.call(this, config, Strategy);
         }
      });

      return Dialog;
   }
);