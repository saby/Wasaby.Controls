define('js!Controls/Popup/Opener/Stack',
   [
      'Core/Control',
      'js!Controls/Popup/interface/IAction',
      'js!Controls/Popup/Manager',
      'js!Controls/Popup/Opener/Stack/Strategy',
      'Core/core-merge'
   ],
   function (Control, IAction, Manager, Strategy, cMerge) {

      /**
       * Действие открытия прилипающего окна
       * @class Controls/Popup/Opener/Stack
       * @mixes Controls/Popup/interface/IAction
       * @control
       * @public
       * @category Popup
       */
      var Dialog = Control.extend([IAction], {
         _controlName: 'Controls/Popup/Opener/Stack',
         iWantVDOM: true,

         execute: function (config) {
            var cfg = config || {};
            cMerge(cfg, this._options);
            Manager.show(cfg, this, Strategy);
         }
      });

      return Dialog;
   }
);