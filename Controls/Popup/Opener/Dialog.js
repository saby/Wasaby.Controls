define('js!Controls/Popup/Opener/Dialog',
   [
      'Core/Control',
      'js!Controls/Popup/interface/IOpener',
      'js!Controls/Popup/Manager',
      'js!Controls/Popup/Opener/Dialog/Strategy',
      'Core/core-merge',
      'js!Controls/Popup/Controller'
   ],
   function (Control, IOpener, Manager, Strategy, CoreMerge, Controller) {
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

         open: function (config) {
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
         }
      });

      return Dialog;
   }
);