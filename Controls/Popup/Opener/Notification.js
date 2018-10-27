define('Controls/Popup/Opener/Notification',
   [
      'Controls/Popup/Opener/BaseOpener'
   ],
   function(Base) {
      /**
       * Component that opens a popup that is positioned in the lower right corner of the browser window. Multiple notification Windows can be opened at the same time. In this case, they are stacked vertically. {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/wasaby/components/openers/#_5 See more}.
       *
       * @class Controls/Popup/Opener/Notification
       * @control
       * @public
       * @author Красильников А.С.
       * @category Popup
       * @extends Controls/Popup/Opener/BaseOpener
       * @mixes Controls/interface/INotificationOptions
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
