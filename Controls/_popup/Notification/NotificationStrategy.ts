/**
 * Created by as.krasilnikov on 21.03.2018.
 */
define('Controls/Popup/Opener/Notification/NotificationStrategy', [], function() {
   return {
      getPosition: function(offset) {
         return {
            right: 0,
            bottom: offset
         };
      }
   };
});
