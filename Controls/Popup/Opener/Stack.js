define('js!Controls/Popup/Opener/Stack',
   [
      'Core/Control',
      'js!Controls/Popup/interface/IOpener',
      'js!Controls/Popup/Manager',
      'js!Controls/Popup/Opener/Stack/Strategy',
      'Core/core-merge',
      'js!Controls/Popup/Controller'
   ],
   function (Control, IOpener, Manager, Strategy, CoreMerge, Controller) {

      /**
       * Действие открытия прилипающего окна
       * @class Controls/Popup/Opener/Stack
       * @mixes Controls/Popup/interface/IOpener
       * @control
       * @public
       * @category Popup
       */
      var Stack = Control.extend([IOpener], {
         _controlName: 'Controls/Popup/Opener/Stack',

         open: function (config, opener) {
            var
               cfg = config || {};
            CoreMerge(cfg, this._options.popupOptions);
            if (this._popupId) {
               this._popupId = Manager.update(this._popupId, cfg);
            }
            if (!this._popupId) {
               this._controller = new Controller();
               this._controller.subscribe('onResult', this._notifyOnResult.bind(this));
               this._popupId = Manager.show(cfg, opener || this, Strategy, this._controller);
            }
         }
      });

      return Stack;
   }
);