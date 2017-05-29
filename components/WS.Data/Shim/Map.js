/* global define */
define('js!WS.Data/Shim/Map', function () {
   'use strict';

   //Return native implementation if supported
   if (typeof Map !== 'undefined') {
      return Map;
   }

   /**
    * Synthetic implementation for {@link https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Map Map}.
    * Only string keys supported!
    * @class WS.Data/Shim/Map
    * @author Мальцев Алексей
    */
   return (function() {
      var Map = function() {
         this.clear();
      };

      Map.prototype._hash = null;

      Object.defineProperty(Map.prototype, 'size', {
         get: function() {
            return Object.keys(this._hash).length;
         },
         enumerable: true,
         configurable: false
      });

      Map.prototype.clear = function() {
         this._hash = {};
      };

      Map.prototype.delete = function(key) {
         delete this._hash[key];
      };

      Map.prototype.entries = function() {
         throw new Error('Method is not supported');
      };

      Map.prototype.forEach = function(callbackFn, thisArg) {
         //FIXME: now not in insertion order
         var hash = this._hash;
         for (var key in hash) {
            if (hash.hasOwnProperty(key)) {
               callbackFn.call(thisArg, hash[key], key, this);
            }
         }
      };

      Map.prototype.get = function(key) {
         return this._hash[key];
      };

      Map.prototype.has = function(key) {
         return this._hash.hasOwnProperty(key);
      };

      Map.prototype.keys = function() {
         throw new Error('Method is not supported');
      };

      Map.prototype.set = function(key, value) {
         this._hash[key] = value;
         return this;
      };

      Map.prototype.values = function() {
         throw new Error('Method is not supported');
      };

      return Map;
   })();
});
