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

         constructor: function (cfg) {
            Dialog.superclass.constructor.apply(this, arguments);
         },

         execute: function (config) {
            cMerge(this._options, config);
            var strategy = new Strategy({
               target: this._options.target
            });
            Manager.show(this._options.popupOptions, this, strategy);
         }
      });

      return Dialog;
   }
);