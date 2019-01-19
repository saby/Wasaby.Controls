define('Controls/Popup/Opener/Notification/NotificationController',
   [
      'Core/Deferred',
      'WS.Data/Collection/List',
      'Controls/Popup/Opener/BaseController',
      'Controls/Popup/Opener/Notification/NotificationStrategy'
   ],
   function(Deferred, List, BaseController, NotificationStrategy) {
      /**
       * Notification Popup Controller
       * @class Controls/Popup/Opener/Notification/NotificationController
       * @control
       * @private
       * @category Popup
       * @extends Controls/Popup/Opener/BaseController
       */
      var NotificationController = BaseController.extend({
         constructor: function(cfg) {
            NotificationController.superclass.constructor.call(this, cfg);
            this._stack = new List();
         },

         elementCreated: function(item, container) {
            item.height = container.offsetHeight;
            this._stack.add(item, 0);
            this._updatePositions();
         },

         elementUpdated: function(item, container) {
            item.height = container.offsetHeight;
            this._updatePositions();
         },

         elementDestroyed: function(item) {
            this._stack.remove(item);
            this._updatePositions();

            NotificationController.superclass.elementDestroyed.call(item);

            return new Deferred().callback();
         },

         _updatePositions: function() {
            var height = 0;

            /**
             * In item.height is the height of the popup.
             * It takes into account the indentation between the notification popups,
             * specified in the template via css. This is done to support theming.
             */
            this._stack.each(function(item) {
               item.position = NotificationStrategy.getPosition(height);
               height += item.height;
            });
         }
      });

      return new NotificationController();
   });
