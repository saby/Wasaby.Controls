define('js!Controls/Popup/Opener/Sticky/Strategy',
   [
      'js!Controls/Popup/Opener/BaseStrategy',
      'Controls/Popup/Opener/PositioningHelpers',
      'js!Controls/Popup/TargetCoords'
   ],
   function (BaseStrategy, PositioningHelpers, TargetCoords) {

      /**
       * Стратегия позиционирования прилипающего диалога.
       * @class Controls/Popup/Opener/Sticky/Strategy
       * @control
       * @public
       * @category Popup
       */
      var Strategy = BaseStrategy.extend({
         addElement: function (cfg, width, height) {
            var
               target = cfg.popupOptions.target ? cfg.popupOptions.target : document.body,
               tCoords = TargetCoords.get(target, cfg.popupOptions.corner),
               hAlign = cfg.popupOptions.horizontalAlign,
               vAlign = cfg.popupOptions.verticalAlign;
            cfg.position = PositioningHelpers.sticky(tCoords, hAlign, vAlign, width, height, window.outerWidth, window.outerHeight);
         }
      });

      return new Strategy();
   }
);