define('Controls/Popup/Opener/Sticky/StickyController',
   [
      'Controls/Popup/Opener/BaseController',
      'Controls/Popup/Opener/Sticky/StickyStrategy',
      'Core/core-merge',
      'Core/core-clone',
      'Controls/Popup/TargetCoords',
      'css!Controls/Popup/Opener/Sticky/Sticky'
   ],
   function(BaseController, StickyStrategy, cMerge, cClone, TargetCoords) {
      var DEFAULT_OPTIONS = {
         horizontalAlign: {
            side: 'right',
            offset: 0
         },
         verticalAlign: {
            side: 'bottom',
            offset: 0
         },
         corner: {
            vertical: 'top',
            horizontal: 'left'
         }
      };

      var _private = {
         prepareConfig: function(cfg, sizes) {
            var popupCfg = {
               corner: cMerge(cClone(DEFAULT_OPTIONS.corner), cfg.popupOptions.corner || {}),
               align: {
                  horizontal: cMerge(cClone(DEFAULT_OPTIONS.horizontalAlign), cfg.popupOptions.horizontalAlign || {}),
                  vertical: cMerge(cClone(DEFAULT_OPTIONS.verticalAlign), cfg.popupOptions.verticalAlign || {})
               },
               config: {
                  maxWidth: cfg.popupOptions.maxWidth,
                  maxHeight: cfg.popupOptions.maxHeight
               },
               sizes: sizes,
               locationStrategy: cfg.popupOptions.locationStrategy
            };

            cfg.position = StickyStrategy.getPosition(popupCfg, _private._getTargetCoords(cfg, sizes));

            // Удаляем предыдущие классы характеризующие направление и добавляем новые
            _private.removeOrientationClasses(cfg);
            cfg.popupOptions.className = (cfg.popupOptions.className || '') + ' ' + _private.getOrientationClasses(popupCfg);
         },

         getOrientationClasses: function(cfg) {
            var className = 'controls-Popup-corner-vertical-' + cfg.corner.vertical;
            className += ' controls-Popup-corner-horizontal-' + cfg.corner.horizontal;
            className += ' controls-Popup-align-horizontal-' + cfg.align.horizontal.side;
            className += ' controls-Popup-align-vertical-' + cfg.align.vertical.side;
            className += ' controls-Sticky__reset-margins';
            return className;
         },

         removeOrientationClasses: function(cfg) {
            if (cfg.popupOptions.className) {
               cfg.popupOptions.className = cfg.popupOptions.className.replace(/controls-Popup-corner\S*|controls-Popup-align\S*|controls-Sticky__reset-margins/g, '').trim();
            }
         },

         _getTargetCoords: function(cfg, sizes) {
            if (cfg.popupOptions.nativeEvent) {
               var top = cfg.popupOptions.nativeEvent.clientY;
               var left = cfg.popupOptions.nativeEvent.clientX;
               var positionCfg = {
                  verticalAlign: {
                     side: 'bottom'
                  },
                  horizontalAlign: {
                     side: 'right'
                  }
               };
               cMerge(cfg.popupOptions, positionCfg);
               sizes.margins = { top: 0, left: 0 };
               return {
                  width: 1,
                  height: 1,
                  top: top,
                  left: left,
                  bottom: document.body.clientHeight - top,
                  right: document.body.clientWidth - left,
                  topScroll: 0,
                  leftScroll: 0
               };
            }
            return TargetCoords.get(cfg.popupOptions.target ? cfg.popupOptions.target : document.body);
         }
      };

      /**
       * Стратегия позиционирования прилипающего диалога.
       * @class Controls/Popup/Opener/Sticky/StickyController
       * @control
       * @public
       * @category Popup
       */
      var StickyController = BaseController.extend({
         elementCreated: function(item, container) {
            item.position.position = undefined;
            if (this._checkContainer(item, container)) {
               this.prepareConfig(item, container);
            }
         },

         elementUpdated: function(item) {
            item.stickyState = 'updated';
            item.popupOptions.className = (item.popupOptions.className || '') + ' controls-Sticky__reset-margins';
         },

         elementAfterUpdated: function(item, container) {
            //We react only after the update phase from the controller
            if (item.stickyState !== 'updated') {
               return false;
            }
            if (this._checkContainer(item, container)) {
               /* start: Снимаем установленные значения, влияющие на размер и позиционирование, чтобы получить размеры контента */
               var width = container.style.width;
               var height = container.style.height;
               container.style.width = 'auto';
               container.style.height = 'auto';

               /* end: Снимаем установленные значения, влияющие на размер и позиционирование, чтобы получить размеры контента */

               this.prepareConfig(item, container);

               /* start: Возвращаем все значения но узел, чтобы vdom не рассинхронизировался */
               container.style.width = width;
               container.style.height = height;

               /* end: Возвращаем все значения но узел, чтобы vdom не рассинхронизировался */
            }
            item.stickyState = 'afterUpdated';
            return true;
         },

         getDefaultConfig: function(item) {
            item.position = {
               top: -10000,
               left: -10000,

               // Плавающая ошибка на ios, когда position:absolute контейнер создается за пределами экрана и растягивает страницу
               // что влечет за собой неправильное позиционирование ввиду неверных координат. + на странице стреляют события скролла
               // Лечится position:fixed при позиционировании попапа за пределами экрана
               position: 'fixed'
            };
         },

         prepareConfig: function(item, container) {
            _private.removeOrientationClasses(item);
            var sizes = this._getPopupSizes(item, container);
            _private.prepareConfig(item, sizes);
         }
      });

      return new StickyController();
   });
