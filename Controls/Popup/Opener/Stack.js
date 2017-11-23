define('js!Controls/Popup/Opener/Stack',
   [
      'Core/Control',
      'js!Controls/Popup/Manager',
      'js!Controls/Popup/Opener/Stack/Strategy',
      'Core/core-merge'
   ],
   function (Control, Manager, Strategy, cMerge) {

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

         execute: function (config, opener) {
            var cfg = config || {};
            cMerge(cfg, this._options);
            var strategy = new Strategy(cfg.position, opener);
            Manager.show(cfg.popupOptions, this, strategy);
         }
      });

      return Dialog;
   }
);