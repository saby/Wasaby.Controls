define('Controls/Popup/Opener/Notification/NotificationController',
   [
      'Controls/Popup/Opener/BaseController',
      'Controls/Popup/Opener/Notification/NotificationStrategy'
   ],
   function(BaseController, NotificationStrategy) {
      var _private = {
         prepareConfig: function(cfg) {
            cfg.position = NotificationStrategy.getPosition();
         }
      };

      /**
       * Стратегия позиционирования нотификационного окна.
       * @class Controls/Popup/Opener/Notification/NotificationController
       * @control
       * @public
       * @category Popup
       * @extends Controls/Popup/Opener/BaseController
       */
      var NotificationController = BaseController.extend({
         elementCreated: function(cfg) {
            _private.prepareConfig(cfg);
         },

         elementUpdated: function(cfg) {
            _private.prepareConfig(cfg);
         }
      });

      return new NotificationController();
   }
);
