define('Controls/Popup/Opener/Notification/NotificationController',
   [
      'Core/Deferred',
      'WS.Data/Collection/List',
      'Controls/Popup/Opener/BaseController',
      'Controls/Popup/Opener/Notification/NotificationStrategy'
   ],
   function(Deferred, List, BaseController, NotificationStrategy) {
      /**
       * Стратегия позиционирования нотификационного окна.
       * @class Controls/Popup/Opener/Notification/NotificationController
       * @control
       * @public
       * @category Popup
       * @extends Controls/Popup/Opener/BaseController
       */
      var NotificationController = BaseController.extend({
         constructor: function() {
            NotificationController.superclass.constructor.call(this, arguments);
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
             * В item.height лежит высота попапа. В ней учитываются отступы между нотификационными окнами,
             * задаваемые в шаблоне, через css. Это сделано для поддержки тематизации.
             */
            this._stack.each(function(item) {
               item.position = NotificationStrategy.getPosition(height);
               height += item.height;
            });
         }
      });

      return new NotificationController();
   }
);
