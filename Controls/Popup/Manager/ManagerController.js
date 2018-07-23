/**
 * Created by as.krasilnikov on 02.04.2018.
 */
define('Controls/Popup/Manager/ManagerController', [],
   function() {
      'use strict';
      return {
         _manager: null,
         _container: null,
         setManager: function(manager) {
            this._manager = manager;
         },
         setContainer: function(container) {
            this._container = container;
         },
         getContainer: function() {
            return this._container;
         },

         /**
          * Обновить popup
          */

         update: function(id, config) {
            return this._manager.update(id, config);
         },

         /**
          * Показать popup
          */

         show: function(config, strategy) {
            return this._manager.show(config, strategy);
         },

         /**
          * Удалить popup
          */

         remove: function(id) {
            return this._manager.remove(id);
         },

         popupUpdated: function(id) {
            return this._manager._eventHandler(null, 'popupUpdated', id);
         },

         /**
          * Найти popup
          */

         find: function(id) {
            return this._manager.find(id);
         },

         reindex: function() {
            this._manager.reindex();
         }
      };
   }
);
