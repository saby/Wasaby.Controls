define('js!Controls/Popup/Opener/Sticky',
   [
      'Core/Control',
      'js!Controls/Popup/interface/IOpener',
      'js!Controls/Popup/Opener/Sticky/Strategy',
      'Core/core-merge',
      'js!Controls/Popup/Controller'
   ],
   function (Control, IOpener, Strategy, CoreMerge, Controller) {

      /**
       * Действие открытия прилипающего окна
       * @class Controls/Popup/Opener/Sticky
       * @mixes Controls/Popup/interface/IOpener
       * @control
       * @public
       * @category Popup
       */
      var Sticky = Control.extend([IOpener], {
         _controlName: 'Controls/Popup/Opener/Sticky',

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

      return Sticky;
   }
);