/**
 * Created by am.gerasimov on 18.01.2017.
 */
define('SBIS3.CONTROLS/Storages/SessionStorage',
   [
      'Core/SessionStorage'
   ],

   function(CSessionStorage) {

      'use strict';

      return {
         setItem: function (key, val) {
            CSessionStorage.set(key, val, true);
         },

         getItem: function (key) {
            return CSessionStorage.get(key);
         },

         removeItem: function (key) {
            CSessionStorage.remove(key);
         }
      }

   });