define('Controls/Popup/Opener/Sticky',
   [
      'Controls/Popup/Opener/BaseOpener',
      'Core/core-merge'
   ],
   function(Base, coreMerge) {
      /**
       * Действие открытия окна
       * @class Controls/Popup/Opener/Sticky
       * @mixes Controls/interface/IStickyOpener
       * @control
       * @author Красильников А.С.
       * @category Popup
       * @extends Controls/Popup/Opener/Base
       */
      var Sticky = Base.extend({

         /**
          * Открыть всплывающее окно
          * @function Controls/Popup/Opener/Sticky#open
          * @param config конфигурация попапа (popupOptions).
          */
         open: function(config) {
            config.isDefaultOpener = config.isDefaultOpener !== undefined ? config.isDefaultOpener : true;
            this._setCompatibleConfig(config);
            Base.prototype.open.call(this, config, 'Controls/Popup/Opener/Sticky/StickyController');
         },

         _setCompatibleConfig: function(config) {
            config._type = 'sticky'; //for compoundArea
         }
      });

      Sticky.getDefaultOptions = function() {
         return coreMerge(Base.getDefaultOptions(), {});
      };
      return Sticky;
   }
);
