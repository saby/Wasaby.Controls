define('js!Controls/Popup/Opener/Notification',
   [
      'Core/Control',
      'js!Controls/Popup/Manager',
      'js!Controls/Popup/interface/IOpener',
      'js!Controls/Popup/Opener/Notification/Strategy',
      'Core/core-merge',
      'js!Controls/Popup/Controller'
   ],
   function (Control, Manager, IOpener, Strategy, CoreMerge, Controller) {

      /**
       * Действие открытия окна
       * @class Controls/Popup/Opener/Notification
       * @mixes Controls/Popup/interface/IOpener
       * @control
       * @public
       * @category Popup
       */
      var Notification = Control.extend([IOpener], {
         _controlName: 'Controls/Popup/Opener/Notification',

         open: function (config, opener) {
            var
               self = this,
               cfg = config || {};
            CoreMerge(cfg, self._options.popupOptions);
            if (self._popupId) {
               self._popupId = Manager.update(self._popupId, cfg);
            }
            if (!self._popupId) {
               self._controller = new Controller({
                  eventHandlers: {
                     onResult: this._options.onResult
                  }
               });
               self._popupId = Manager.show(cfg, opener || self, Strategy, self._controller);
            }
         }
      });

      return Notification;
   }
);