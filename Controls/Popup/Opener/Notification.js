define('js!Controls/Popup/Opener/Notification',
   [
      'Core/Control',
      'js!Controls/Popup/interface/IAction',
      'js!Controls/Popup/Manager',
      'js!Controls/Popup/Opener/Notification/Strategy',
      'Core/core-merge'
   ],
   function (Control, IAction, Manager, Strategy, cMerge) {

      /**
       * Действие открытия окна
       * @class Controls/Popup/Opener/Notification
       * @mixes Controls/Popup/interface/IAction
       * @control
       * @public
       * @category Popup
       */
      var Notification = Control.extend([IAction], {
         _controlName: 'Controls/Popup/Opener/Notification',
         iWantVDOM: true,

         execute: function (config) {
            var cfg = config || {};
            cMerge(cfg, this._options);
            Manager.show(cfg, this, Strategy);
         }
      });

      return Notification;
   }
);