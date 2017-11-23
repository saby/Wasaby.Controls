define('js!Controls/Popup/Opener/Dialog',
   [
      'Core/Control',
      'js!Controls/Popup/Manager',
      'js!Controls/Popup/Opener/Dialog/Strategy'
   ],
   function (Control, Manager, Strategy) {
      /**
       * Действие открытия окна
       * @class Controls/Popup/Opener/Dialog
       * @mixes Controls/Popup/interface/IAction
       * @control
       * @public
       * @category Popup
       */
      var Dialog = Control.extend({
         _controlName: 'Controls/Popup/Opener/Dialog',
         iWantVDOM: true,

         execute: function () {
            var strategy = new Strategy();
            Manager.show(this._options.popupOptions, this, strategy);
         }
      });

      return Dialog;
   }
);