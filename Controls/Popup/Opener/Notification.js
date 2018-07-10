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

      /**
       * @typedef {Object} popupOptions
       * @property {Function} template Шаблон отображения внутреннего содержимого
       * @property {Object} templateOptions Шаблон отображения внутреннего содержимого
       */
      var Notification = Base.extend({

         /**
          * Открыть нотификационное окно
          * @function Controls/Popup/Opener/Notification#open
          * @param {popupOptions} popupOptions конфиг попапа.
          */
         open: function(popupOptions) {
            Base.prototype.open.call(this, popupOptions, 'Controls/Popup/Opener/Notification/NotificationController', 'multiple');
         }
      });

      Notification.getDefaultOptions = function() {
         return {
            displayMode: 'multiple'
         };
      };

      return Notification;
   }
);
