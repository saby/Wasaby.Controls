/**
 * Created by am.gerasimov on 18.01.2017.
 */
define('js!SBIS3.CONTROLS.SBISStorageAdapter',
   [
      'Core/core-extend',
      'js!SBIS3.CONTROLS.IStorage'],

   function(coreExtend, IStorage) {

      'use strict';

      var SBISStorageAdapter = coreExtend({}, [IStorage], {
         $constructor: function(cfg) {
            this._storage = cfg.storage;
         },

         setItem: function(key, val) {
            return this._storage.setParam(key, val);
         },

         getItem: function(key) {
            return this._storage.getParam(key);
         },

         removeItem: function(key) {
            this._storage.removeParam(key);
         }
      });

      return SBISStorageAdapter;

   });