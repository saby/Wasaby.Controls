define('Controls/Popup/Opener/Sticky/StickyController',
   [
      'Controls/Popup/Opener/BaseController',
      'Controls/Popup/Opener/Sticky/StickyStrategy',
      'Core/core-merge',
      'Core/core-clone',
      'Controls/Popup/TargetCoords'
   ],
   function (BaseController, StickyStrategy, cMerge, cClone, TargetCoords) {
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
         prepareConfig: function (cfg, sizes) {
            var popupCfg = {
               corner: cMerge(cClone(DEFAULT_OPTIONS['corner']), cfg.popupOptions.corner || {}),
               align: {
                  horizontal: cMerge(cClone(DEFAULT_OPTIONS['horizontalAlign']), cfg.popupOptions.horizontalAlign || {}),
                  vertical: cMerge(cClone(DEFAULT_OPTIONS['verticalAlign']), cfg.popupOptions.verticalAlign || {})
               },
               sizes: sizes
            };

            cfg.position = StickyStrategy.getPosition(popupCfg, TargetCoords.get(cfg.popupOptions.target ? cfg.popupOptions.target : document.body));

            // Удаляем предыдущие классы характеризующие направление и добавляем новые
            if (cfg.popupOptions.className) {
               cfg.popupOptions.className = cfg.popupOptions.className.replace(/controls-Popup-corner\S*|controls-Popup-align\S*/g, '').trim();
               cfg.popupOptions.className += ' ' + _private.getOrientationClasses(popupCfg);
            }
            else {
               cfg.popupOptions.className = _private.getOrientationClasses(popupCfg);
            }
         },

         getOrientationClasses: function (cfg) {
            var className = 'controls-Popup-corner-vertical-' + cfg.corner.vertical;
            className += ' controls-Popup-corner-horizontal-' + cfg.corner.horizontal;
            className += ' controls-Popup-align-horizontal-' + cfg.align.horizontal.side;
            className += ' controls-Popup-align-vertical-' + cfg.align.vertical.side;
            return className;
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
         elementCreated: function (cfg, sizes) {
            this.prepareConfig(cfg, sizes);
         },

         elementUpdated: function (cfg, sizes) {
            this.prepareConfig(cfg, sizes);
         },
         prepareConfig: function (cfg, sizes) {
            _private.prepareConfig(cfg, sizes);
         }
      });

      return new StickyController();
   }
);