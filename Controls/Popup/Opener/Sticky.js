define('Controls/Popup/Opener/Sticky',
   [
      'Controls/Popup/Opener/BaseOpener',
      'Controls/Popup/Opener/Sticky/StickyController'

   ],
   function(Base, Strategy) {
      /**
       * Действие открытия окна
       * @class Controls/Popup/Opener/Sticky
       * @mixes Controls/interface/IStickyOpener
       * @control
       * @public
       * @category Popup
       * @extends Controls/Popup/Opener/Base
       */
      var Sticky = Base.extend({

         /**
          * Открыть всплывающее окно
          * @function Controls/Popup/Opener/Sticky#open
          * @param config конфигурация попапа (popupOptions).
          */
         open: function(config) {
            Base.prototype.open.call(this, config, Strategy);
         }
      });

      return Sticky;
   }
);
