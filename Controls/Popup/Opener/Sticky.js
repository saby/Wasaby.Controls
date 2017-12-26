define('js!Controls/Popup/Opener/Sticky',
   [
      'js!Controls/Popup/Opener/Base',
      'js!Controls/Popup/Opener/Sticky/Strategy'

   ],
   function (Base, Strategy) {
      /**
       * Действие открытия окна
       * @class Controls/Popup/Opener/Sticky
       * @control
       * @public
       * @category Popup
       * @extends Controls/Popup/Opener/Base
       */
      var Sticky = Base.extend({
         /**
          * Открыть всплывающее окно
          * @function Controls/Popup/Opener/Sticky#open
          * @param config конфигурация попапа
          */
         open: function(config){
            Base.prototype.open.call(this, config, Strategy);
         }
      });

      return Sticky;
   }
);