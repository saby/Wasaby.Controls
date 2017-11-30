define('js!Controls/Popup/Opener/Notification',
   [
      'Core/Control',
      'js!Controls/Popup/interface/IAction',
      'js!Controls/Popup/Manager',
      'js!Controls/Popup/Opener/Notification/Strategy',
      'Core/core-merge',
      'js!Controls/Popup/Controller'
   ],
   function (Control, IAction, Manager, Strategy, CoreMerge, Controller) {

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

         execute: function (config) {
            var
               cfg = config || {};
            CoreMerge(cfg, this._options.popupOptions);
            if (this._popupId) {
               this._popupId = Manager.update(this._popupId, cfg);
            }
            if (!this._popupId) {
               this._controller = new Controller();
               this._controller.subscribe('onResult', this._notifyOnResult.bind(this));
               this._popupId = Manager.show(cfg, this, Strategy, this._controller);
            }
         },

         _notifyOnResult: function (event, args) {
            this._notify.apply(this, ['onResult'].concat(args));
         }
      });

      return Notification;
   }
);