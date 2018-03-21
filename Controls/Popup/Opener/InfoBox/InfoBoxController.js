define('Controls/Popup/Opener/InfoBox/InfoBoxController',
   [
      'Controls/Popup/Opener/Sticky/StickyController',
      'Controls/Popup/Opener/InfoBox/InfoBoxStrategy',
      'Core/core-merge',
      'Controls/Popup/Manager'
   ],
   function (StickyController, InfoBoxStrategy, cMerge, Manager) {
      /**
       * Стратегия позиционирования инфобокса
       * @class Controls/Popup/Opener/InfoBox/InfoBoxController
       * @control
       * @public
       * @category Popup
       */
      var InfoBoxController = StickyController.constructor.extend({
         _openedPopupId: null,

         elementCreated: function (cfg, sizes, id) {
            // Открыто может быть только одно окно
            if (this._openedPopupId) {
               Manager.remove(this._openedPopupId);
            }
            this._openedPopupId = id;

            return InfoBoxController.superclass.elementCreated.apply(this, arguments);
         },

         elementDestroyed: function(element, container, id){
            if (id === this._openedPopupId){
               this._openedPopupId = null;
            }

            return InfoBoxController.superclass.elementDestroyed.apply(this, arguments);
         },

         prepareConfig: function(cfg, sizes){
            cMerge(cfg.popupOptions, InfoBoxStrategy.getStickyParams(cfg.popupOptions.position, cfg.popupOptions.target));
            return InfoBoxController.superclass.prepareConfig.apply(this, arguments);
         }

      });

      return new InfoBoxController();
   }
);