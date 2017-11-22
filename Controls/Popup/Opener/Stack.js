define('js!Controls/Popup/Opener/Stack',
   [
      'Core/Control',
      'js!Controls/Popup/Manager',
      'js!Controls/Popup/Opener/Stack/Strategy'
   ],
   function (Control, Manager, Strategy) {

      /**
       * Действие открытия прилипающего окна
       * @class Controls/Popup/Opener/Stack
       * @mixes Controls/Popup/interface/IAction
       * @control
       * @public
       * @category Popup
       */
      var Dialog = Control.extend({
         _controlName: 'Controls/Popup/Opener/Stack',
         iWantVDOM: true,

         constructor: function (cfg) {
            Dialog.superclass.constructor.apply(this, arguments);
         },

         execute: function () {
            var strategy = new Strategy();
            Manager.show(this._options.popupOptions, this, strategy);
         }
      });

      return Dialog;
   }
);