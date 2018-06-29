define('Controls/Popup/Opener/Notification',
   [
      'Controls/Popup/Opener/BaseOpener'
   ],
   function(Base) {
      /**
       * Действие открытия окна
       * @class Controls/Popup/Opener/Notification
       * @control
       * @public
       * @category Popup
       * @extends Controls/Popup/Opener/BaseOpener
       */
      var Notification = Base.extend({

         /**
          * Открыть нотификационное окно
          * @function Controls/Popup/Opener/Notification#open
          * @param {Controls/interface/IOpener#popupOptions} popupOptions
          */
         open: function(popupOptions) {
            Base.prototype.open.call(this, popupOptions, 'Controls/Popup/Opener/Notification/NotificationController');
         }
      });

      return Notification;
   }
);
