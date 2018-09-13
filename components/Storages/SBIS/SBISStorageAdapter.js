/**
 * Created by am.gerasimov on 18.01.2017.
 */
define('SBIS3.CONTROLS/Storages/SBIS/SBISStorageAdapter',
   [
      'Core/core-extend',
      'SBIS3.CONTROLS/Interfaces/IStorage'],

   function(coreExtend, IStorage) {

      'use strict';

      var SBISStorageAdapter = coreExtend({}, [IStorage], {
         $constructor: function(cfg) {
            this._storage = cfg.storage;
         },

         setItem: function(key, val) {
            return this._storage.setParam(key, val);
         },

         getItem: function(key, ignoreCache) {
            return this._storage.getParam(key, ignoreCache);
         },

         removeItem: function(key) {
            this._storage.removeParam(key);
         }
      });

      return SBISStorageAdapter;

   });