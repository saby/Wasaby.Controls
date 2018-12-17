define('Controls/Popup/Opener/Dialog/DialogController',
   [
      'Controls/Popup/Opener/BaseController',
      'Controls/Popup/Opener/Dialog/DialogStrategy'
   ],
   function(BaseController, DialogStrategy) {
      var _private = {
         prepareConfig: function(item, sizes) {
            // After popup will be transferred to the synchronous change of coordinates, 
            // we need to return the calculation of the position with the keyboard.
            var windowData = {
               width: document.body.clientWidth,
               height: document.body.clientHeight,
               scrollTop: 0,
            };

            // Positioning relative to body
            item.position = DialogStrategy.getPosition(windowData, sizes, item);
            _private.fixCompatiblePosition(item);
         },
         fixCompatiblePosition: function(cfg) {
            //COMPATIBLE: for old windows user can set the coordinates relative to the body
            if (cfg.popupOptions.top && cfg.popupOptions.left) {
               cfg.position.top = cfg.popupOptions.top;
               cfg.position.left = cfg.popupOptions.left;
            }
         }
      };

      /**
       * Стратегия позиционирования окна.
       * @class Controls/Popup/Opener/Dialog/DialogController
       * @control
       * @private
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
            if (cfg.popupOptions.maxWidth) {
               container.style.maxWidth = cfg.popupOptions.maxWidth + 'px';
            }
            if (cfg.popupOptions.maxHeight) {
               container.style.maxHeight = cfg.popupOptions.maxHeight + 'px';
            }

            /* end: Снимаем установленные значения, влияющие на размер и позиционирование, чтобы получить размеры контента */
            this.prepareConfig(cfg, container);

            /* start: Возвращаем все значения но узел, чтобы vdom не рассинхронизировался */
            container.style.width = width;
            container.style.height = height;
            container.style.maxWidth = '';
            container.style.maxHeight = '';

            /* end: Возвращаем все значения но узел, чтобы vdom не рассинхронизировался */
         },

         getDefaultConfig: function(item) {
            // set sizes before positioning. Need for templates who calculate sizes relatively popup sizes
            item.position = {
               top: -10000,
               left: -10000,
               height: item.popupOptions.maxHeight,
               width: item.popupOptions.maxWidth
            };
         },

         popupDragStart: function(item, container, offset) {
            if (!item.startPosition) {
               item.startPosition = {
                  left: item.position.left,
                  top: item.position.top
               };
            }
            item.dragged = true;
            item.position.left = item.startPosition.left + offset.x;
            item.position.top = item.startPosition.top + offset.y;

            // Take the size from cache, because they don't change when you move
            _private.prepareConfig(item, item.sizes);
         },

         popupDragEnd: function(item) {
            delete item.startPosition;
         },

         prepareConfig: function(cfg, container) {
            var sizes = this._getPopupSizes(cfg, container);
            cfg.sizes = sizes;
            _private.prepareConfig(cfg, sizes);
         },

         needRecalcOnKeyboardShow: function() {
            return false;
         },
         _private: _private
      });
      return new DialogController();
   }
);
