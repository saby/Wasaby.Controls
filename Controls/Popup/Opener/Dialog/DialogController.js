define('Controls/Popup/Opener/Dialog/DialogController',
   [
      'Controls/Popup/Opener/BaseController',
      'Controls/Popup/Opener/Dialog/DialogStrategy'
   ],
   function(BaseController, DialogStrategy) {
      var _private = {
         prepareConfig: function(cfg, sizes) {
            cfg.position = DialogStrategy.getPosition(window.innerWidth, window.innerHeight, sizes, cfg.popupOptions);
         }
      };

      /**
       * Стратегия позиционирования окна.
       * @class Controls/Popup/Opener/Dialog/DialogController
       * @control
       * @public
       * @category Popup
       * @extends Controls/Popup/Opener/BaseController
       */
      var DialogController = BaseController.extend({
         elementCreated: function(cfg, container) {
            this.prepareConfig(cfg, container);
         },

         elementUpdated: function(cfg, container) {
            /* start: Снимаем установленные значения, влияющие на размер и позиционирование, чтобы получить размеры контента */
            var width = container.style.width;
            var height = container.style.height;
            container.style.width = 'auto';
            container.style.height = 'auto';

            /* end: Снимаем установленные значения, влияющие на размер и позиционирование, чтобы получить размеры контента */
            this.prepareConfig(cfg, container);

            /* start: Возвращаем все значения но узел, чтобы vdom не рассинхронизировался */
            container.style.width = width;
            container.style.height = height;

            /* end: Возвращаем все значения но узел, чтобы vdom не рассинхронизировался */
         },
         prepareConfig: function(cfg, container) {
            var sizes = this._getPopupSizes(cfg, container);
            _private.prepareConfig(cfg, sizes);
         }
      });
      return new DialogController();
   }
);
