define('Controls/Popup/Opener/Dialog/DialogController',
   [
      'Controls/Popup/Opener/BaseController',
      'Controls/Popup/Opener/Dialog/DialogStrategy'
   ],
   function (BaseController, DialogStrategy) {
      var _private = {
         prepareConfig: function(cfg, sizes) {
            cfg.position = DialogStrategy.getPosition(window.innerWidth, window.innerHeight, sizes);
         }
      };
      /**
       * Стратегия позиционирования окна.
       * @class Controls/Popup/Opener/Dialog/DialogController
       * @control
       * @public
       * @category Popup
       * @extends Controls/Control
       */
      var DialogController = BaseController.extend({
         elementCreated: function (cfg, sizes) {
            _private.prepareConfig(cfg, sizes);
         },

         elementUpdated: function (cfg, sizes) {
            _private.prepareConfig(cfg, sizes);
         }
      });
      return new DialogController();
   }
);