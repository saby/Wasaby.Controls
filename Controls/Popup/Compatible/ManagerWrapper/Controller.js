/**
 * Created by as.krasilnikov on 20.11.2018.
 */
define('Controls/Popup/Compatible/ManagerWrapper/Controller', [], function() {
   return {
      _managerWrapper: null,
      _globalPopup: null,
      registerManager: function(ManagerWrapper) {
         this._managerWrapper = ManagerWrapper;
      },
      registerGlobalPopup: function(GlobalPopup) {
         this._globalPopup = GlobalPopup;
      },
      getManagerWrapper: function() {
         return this._managerWrapper;
      },
      getGlobalPopup: function() {
         return this._globalPopup;
      },
      registerGlobalPopupOpeners: function(GlobalPopupOpeners) {
         this._globalPopupOpeners = GlobalPopupOpeners;
      },
      getGlobalPopupOpeners: function() {
         return this._globalPopupOpeners;
      },
      scrollHandler: function() {
         if (this._managerWrapper) {
            this._managerWrapper._scrollHandler();
         }
      },
      registerListener: function(event, registerType, component, callback) {
         if (this._managerWrapper) {
            this._managerWrapper.registerListener(event, registerType, component, callback);
         }
      },
      unregisterListener: function(event, registerType, component) {
         if (this._managerWrapper) {
            this._managerWrapper.unregisterListener(event, registerType, component);
         }
      }
   };
});
