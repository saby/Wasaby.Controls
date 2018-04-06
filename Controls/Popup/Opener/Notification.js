define('Controls/Popup/Opener/Notification',
   [
      'Controls/Popup/Opener/BaseOpener',
      'Controls/Popup/Opener/Notification/NotificationController'

   ],
   function (Base, Strategy) {
      /**
       * Действие открытия окна
       * @class Controls/Popup/Opener/Notification
       * @control
       * @public
       * @category Popup
       * @extends Controls/Popup/Opener/Base
       */
      var Notification = Base.extend({
         /**
          * Открыть нотификационное окно
          * @function Controls/Popup/Opener/Notification#open
          * @param config конфигурация попапа
          */
         open: function(config){
            Base.prototype.open.call(this, config, Strategy);
         }
      });

      return Notification;
   }
);