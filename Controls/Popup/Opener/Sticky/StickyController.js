define('Controls/Popup/Opener/Sticky/StickyController',
   [
      'Controls/Popup/Opener/BaseController',
      'Controls/Popup/Manager/ManagerController',
      'Controls/Popup/Opener/Sticky/StickyStrategy',
      'Core/core-merge',
      'Core/core-clone',
      'Core/detection',
      'Core/helpers/Hcontrol/isElementVisible',
      'Controls/Popup/TargetCoords',
      'css!theme?Controls/Popup/Opener/Sticky/Sticky'
   ],
   function(BaseController, ManagerController, StickyStrategy, cMerge, cClone, cDetection, isElementVisible, TargetCoords) {
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

            cfg.popupOptions.position = this.prepareCfgContext(popupCfg);

            cfg.positionConfig = popupCfg;

            _private.updateClasses(cfg, popupCfg);
         },

         updateClasses: function(cfg, popupCfg) {
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

            if (!document) {
               return {
                  width: 0,
                  height: 0,
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  topScroll: 0,
                  leftScroll: 0
               };
            }

            return TargetCoords.get(cfg.popupOptions.target ? cfg.popupOptions.target : document.body);
         },

         prepareCfgContext: function(cfg) {
            return {
               horizontalAlign: cfg.align.horizontal,
               verticalAlign: cfg.align.vertical,
               corner: cfg.corner
            };
         },

         getWindowWidth: function() {
            return window.innerWidth;
         },
      };

      /**
       * Стратегия позиционирования прилипающего диалога.
       * @class Controls/Popup/Opener/Sticky/StickyController
       * @control
       * @private
       * @category Popup
       */
      var StickyController = BaseController.extend({

         elementCreated: function(item, container) {
            item.position.position = undefined;
            this.prepareConfig(item, container);
         },

         elementUpdated: function(item, container) {
            if (this._isElementVisible(item.popupOptions.target)) {
               _private.updateClasses(item, item.positionConfig);
               item.position = StickyStrategy.getPosition(item.positionConfig, _private._getTargetCoords(item, item.positionConfig.sizes));

               // In landscape orientation, the height of the screen is low when the keyboard is opened.
               // Open Windows are not placed in the workspace and chrome scrollit body.
               if (cDetection.isMobileAndroid) {
                  var height = item.position.height || container.clientHeight;
                  if (height > document.body.clientHeight) {
                     item.position.height = document.body.clientHeight;
                     item.position.top = 0;
                  } else if (item.position.height + item.position.top > document.body.clientHeight) {
                     // opening the keyboard reduces the height of the body. If popup was positioned at the bottom of
                     // the window, he did not have time to change his top coordinate => a scroll appeared on the body
                     var dif = item.position.height + item.position.top - document.body.clientHeight;
                     item.position.top -= dif;
                  }
               }
            } else {
               ManagerController.remove(item.id);
            }
         },

         elementAfterUpdated: function(item, container) {
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
            return true;
         },

         getDefaultConfig: function(item) {
            item.position = {
               top: -10000,
               left: -10000,
               maxWidth: _private.getWindowWidth(),

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
         },

         _isElementVisible: function(target) {
            return isElementVisible(target);
         },

         needRecalcOnKeyboardShow: function() {
            return true;
         },
         _private: _private
      });

      return new StickyController();
   });
