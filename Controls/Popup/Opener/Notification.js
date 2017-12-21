define('js!Controls/Popup/Opener/Notification',
   [
      'js!Controls/Popup/Opener/Base',
      'js!Controls/Popup/Opener/Notification/Strategy'

   ],
   function (Base, Strategy) {
      /**
       * Действие открытия окна
       * @class Controls/Popup/Opener/Notification
       * @control
       * @public
       * @category Popup
       * @extends Controls/Control
       */
      var Notification = Base.extend({
         getStrategy: function(){
            return Strategy;
         }
      });

      return Notification;
   }
);