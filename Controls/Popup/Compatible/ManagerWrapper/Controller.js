/**
 * Created by as.krasilnikov on 20.11.2018.
 */
define('Controls/Popup/Compatible/ManagerWrapper/Controller', [], function() {
   return {
      _managerWrapper: null,
      registerManager: function(ManagerWrapper) {
         this._managerWrapper = ManagerWrapper;
      },
      scrollHandler: function() {
         if (this._managerWrapper) {
            this._managerWrapper._scrollHandler();
         }
      }
   };
});
