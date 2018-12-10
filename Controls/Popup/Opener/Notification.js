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
       * @mixes Controls/interface/INotificationOptions
       */

      /**
       * @name Controls/Popup/Opener/Notification#closePopupBeforeUnmount
       * @cfg {Object} Determines whether to close the popup when the component is destroyed.
       */

      /**
       * @typedef {Object} popupOptions
       * @property {Function} template Шаблон отображения внутреннего содержимого
       * @property {Object} templateOptions Шаблон отображения внутреннего содержимого
       */
      var Notification = Base.extend({

         /**
          * Open dialog popup.
          * @function Controls/Popup/Opener/Notification#open
          * @param {popupOptions} popupOptions Notification popup options.
          * @returns {Undefined}
          * @example
          * wml
          * <pre>
          *    <Controls.Popup.Opener.Notification name="notificationOpener">
          *       <ws:popupOptions template="wml!Controls/Template/NotificationTemplate">
          *       </ws:popupOptions>
          *    </Controls.Popup.Opener.Notification>
          *
          *    <Controls.Button name="openNotificationButton" caption="open notification" on:click="_open()"/>
          * </pre>
          * js
          * <pre>
          *   Control.extend({
          *      ...
          *       _open() {
          *          var popupOptions = {
          *              templateOptions: {
          *                 style: "done",
          *                 text: "Сообщение отправлено",
          *                 icon: "Admin"
          *              }
          *          }
          *          this._children.notificationOpener.open(popupOptions)
          *      }
          *      ...
          *   });
          * </pre>
          * @see close
          */
         open: function(popupOptions) {
            popupOptions = popupOptions || {};

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

/**
 * @name Controls/Popup/Opener/Notification#close
 * @description Close popup.
 * @function
 */
/**
 * @name Controls/Popup/Opener/Notification#isOpened
 * @function
 * @description Popup opened status.
 */

