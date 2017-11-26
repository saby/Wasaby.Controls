define('js!Controls/Popup/Opener/Dialog',
   [
      'Core/Control',
      'js!Controls/Popup/interface/IAction',
      'js!Controls/Popup/Manager',
      'js!Controls/Popup/Opener/Dialog/Strategy',
      'Core/core-merge'
   ],
   function (Control, IAction, Manager, Strategy, cMerge) {
      /**
       * Действие открытия окна
       * @class Controls/Popup/Opener/Dialog
       * @mixes Controls/Popup/interface/IAction
       * @control
       * @public
       * @category Popup
       */
      var Dialog = Control.extend([IAction], {
         _controlName: 'Controls/Popup/Opener/Dialog',
         iWantVDOM: true,

         execute: function (config, opener) {
            var cfg = config || {};
            cMerge(cfg, this._options.popupOptions);
            Manager.show(cfg, opener || this, Strategy);
         }
      });

      return Dialog;
   }
);