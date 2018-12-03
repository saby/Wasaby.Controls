/**
 * Created by as.krasilnikov on 02.04.2018.
 */
define('Controls/Popup/Manager/ManagerController', ['Controls/Popup/Opener/BaseController'],
   function(BaseController) {
      'use strict';
      return {
         _manager: null,
         _container: null,
         _indicator: null,
         setManager: function(manager) {
            this._manager = manager;
         },
         setContainer: function(container) {
            this._container = container;
         },
         setIndicator: function(indicator) {
            this._indicator = indicator;
         },
         getIndicator: function() {
            return this._indicator;
         },
         getContainer: function() {
            return this._container;
         },

         popupUpdated: function(id) {
            return this._manager._eventHandler(null, 'popupUpdated', id);
         },

         /**
          * Найти popup
          */

         find: function() {
            return this._callManager('find', arguments);
         },

         /**
          * Удалить popup
          */

         remove: function() {
            return this._callManager('remove', arguments);
         },

         /**
          * Обновить popup
          */

         update: function() {
            return this._callManager('update', arguments);
         },

         /**
          * Показать popup
          */

         show: function() {
            return this._callManager('show', arguments);
         },

         reindex: function() {
            return this._callManager('reindex', arguments);
         },

         isPopupCreating: function(id) {
            var item = this.find(id);
            return item && (item.popupState === BaseController.POPUP_STATE_INITIALIZING || item.popupState === BaseController.POPUP_STATE_CREATING);
         },

         _callManager: function(methodName, args) {
            if (this._manager) {
               return this._manager[methodName].apply(this._manager, args || []);
            }
            return false;
         },
      };
   }
);
