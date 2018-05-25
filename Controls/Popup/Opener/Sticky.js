define('Controls/Popup/Opener/Sticky',
   [
      'tmpl!Controls/Popup/Opener/Sticky/Sticky',
      'Controls/Popup/Manager/ManagerController',
      'Controls/Popup/Opener/BaseOpener',
      'Controls/Popup/Opener/Sticky/StickyController'
   ],
   function(template, ManagerController, Base, Strategy) {
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
            Base.prototype.open.call(this, config, Strategy);
         },
         _scrollHandler: function() {
            if (this._options.targetTracking) {
               ManagerController.popupUpdated(this._popupId);
            }
         }
      });

      return Sticky;
   }
);
