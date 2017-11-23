define('js!Controls/Popup/Opener/Sticky',
   [
      'Core/Control',
      'js!Controls/Popup/Manager',
      'js!Controls/Popup/Opener/Sticky/Strategy',
      'Core/core-merge'
   ],
   function (Control, Manager, Strategy, cMerge) {

      /**
       * Действие открытия прилипающего окна
       * @class Controls/Popup/Opener/Sticky
       * @mixes Controls/Popup/interface/IAction
       * @control
       * @public
       * @category Popup
       */
      var Dialog = Control.extend({
         _controlName: 'Controls/Popup/Opener/Sticky',
         iWantVDOM: true,

         execute: function (config, target) {
            var cfg = config || {};
            cMerge(cfg, this._options);
            var strategy = new Strategy(cfg.position, target);
            Manager.show(cfg.popupOptions, this, strategy);
         }
      });

      return Dialog;
   }
);