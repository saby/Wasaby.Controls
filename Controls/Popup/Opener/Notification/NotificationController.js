define('Controls/Popup/Opener/Notification/NotificationController',
   [
      'Core/Deferred',
      'Types/collection',
      'Controls/Popup/Opener/BaseController',
      'Controls/Popup/Opener/Notification/NotificationStrategy'
   ],
   function(Deferred, collection, BaseController, NotificationStrategy) {
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
            this._stack = new collection.List();
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

         getCustomZIndex: function(popupItems) {
            // Notification windows must be above all popup windows
            // will be fixed by https://online.sbis.ru/opendoc.html?guid=e6a136fc-be49-46f3-84d5-be135fae4761
            var count = popupItems.getCount();
            for (var i = 0; i < count; i++) {
               if (popupItems.at(i).hasMaximizePopup) {
                  var maximizedPopupZIndex = (i + 1) * 10;
                  return maximizedPopupZIndex - 1;
               }
            }
            return 100;
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
