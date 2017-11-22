define('js!Controls/Popup/Opener/Notification',
   [
      'Core/Control',
      'js!Controls/Popup/Manager',
      'js!Controls/Popup/Opener/Notification/Strategy'
   ],
   function (Control, Manager, Strategy) {

      /**
       * Действие открытия окна
       * @class Controls/Popup/Opener/Notification
       * @mixes Controls/Popup/interface/IAction
       * @control
       * @public
       * @category Popup
       */
      var Notification = Control.extend({
         _controlName: 'Controls/Popup/Opener/Notification',
         iWantVDOM: true,

         constructor: function (cfg) {
            Notification.superclass.constructor.apply(this, arguments);
         },

         execute: function () {
            var strategy = new Strategy();
            Manager.show(this._options.popupOptions, this, strategy);
         }
      });

      return Notification;
   }
);