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
          *    <Controls.Popup.Opener.Dialog name="dialog">
          *       <ws:popupOptions template="Controls-demo/Popup/TestDialog" isModal="{{true}}">
          *          <ws:templateOptions key="111"/>
          *       </ws:popupOptions>
          *    </Controls.Popup.Opener.Dialog>
          *
          *    <Controls.Button name="openDialogButton" caption="open dialog" on:click="_openDialog()"/>
          *    <Controls.Button name="closeDialogButton" caption="close dialog" on:click="_closeDialog()"/>
          * </pre>
          * js
          * <pre>
          *   Control.extend({
          *      ...
          *
          *       _openDialog() {
          *          var popupOptions = {
          *              autofocus: true
          *          }
          *          this._children.dialog.open(popupOptions)
          *       }
          *
          *       _closeDialog() {
          *          this._children.dialog.close()
          *       }
          *       ...
          *   });
          * </pre>
          * @see close
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

/**
 * @name Controls/Popup/Opener/Notification#close
 * @description Close popup.
 * @function
 */
