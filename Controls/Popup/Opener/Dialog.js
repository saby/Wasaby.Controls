define('js!Controls/Popup/Opener/Dialog',
   [
      'Core/Control',
      'js!Controls/Popup/interface/IOpener',
      'js!Controls/Popup/Opener/Dialog/Strategy',
      'Core/core-merge',
      'js!Controls/Popup/Controller'
   ],
   function (Control, IOpener, Strategy, CoreMerge, Controller) {
      /**
       * Действие открытия окна
       * @class Controls/Popup/Opener/Dialog
       * @mixes Controls/Popup/interface/IOpener
       * @control
       * @public
       * @category Popup
       * @extends Controls/Control
       */
      var Dialog = Control.extend([IOpener], {
         _controlName: 'Controls/Popup/Opener/Dialog',

         open: function (config, opener) {
            var
               self = this,
               cfg = config || {};
            require(['js!Controls/Popup/Manager'], function (Manager) {
               CoreMerge(cfg, self._options.popupOptions);
               if (self._popupId) {
                  self._popupId = Manager.update(self._popupId, cfg);
               }
               if (!self._popupId) {
                  self._controller = new Controller();
                  self._controller.subscribe('onResult', self._notifyOnResult.bind(self));

                  self._popupId = Manager.show(cfg, opener || self, Strategy, self._controller);

               }
            });
         }
      });

      return Dialog;
   }
);