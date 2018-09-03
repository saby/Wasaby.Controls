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
       * @author Красильников А.С.
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
          * @param {popupOptions} [popupOptions] конфиг попапа.
          */
         open: function(popupOptions) {
            popupOptions = popupOptions || {};

            //Убираем автофокусировку, чтобы не закрывались окна с autoHide true
            popupOptions.autofocus = false;
            Base.prototype.open.call(this, popupOptions, 'Controls/Popup/Opener/Notification/NotificationController');
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
