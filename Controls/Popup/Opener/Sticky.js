define('Controls/Popup/Opener/Sticky',
   [
      'tmpl!Controls/Popup/Opener/Sticky/Sticky',
      'Controls/Popup/Manager/ManagerController',
      'Controls/Popup/Opener/BaseOpener'

   ],
   function(template, ManagerController, Base) {
      /**
       * Действие открытия окна
       * @class Controls/Popup/Opener/Sticky
       * @mixes Controls/interface/IStickyOpener
       * @control
       * @public
       * @category Popup
       * @extends Controls/Popup/Opener/Base
       */
      var Sticky = Base.extend({
         _template: template,

         /**
          * Открыть всплывающее окно
          * @function Controls/Popup/Opener/Sticky#open
          * @param config конфигурация попапа (popupOptions).
          */
         open: function(config) {
            this._setCompatibleConfig(config);
            Base.prototype.open.call(this, config, 'Controls/Popup/Opener/Sticky/StickyController');
         },
         _scrollHandler: function() {
            if (this._options.targetTracking) {
               ManagerController.popupUpdated(this._popupId);
            }
         },

         _setCompatibleConfig: function(config) {
            config._type = 'sticky'; //for compoundArea
         }
      });

      return Sticky;
   }
);
