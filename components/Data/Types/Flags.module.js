/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Types.Flags', [
   'js!SBIS3.CONTROLS.Data.Types.IFlags',
   'js!SBIS3.CONTROLS.Data.Collection.IEnumerable'
], function (IFlags, IEnumerable) {
   'use strict';
   /**
    * Интерфейс флагов
    * @mixin SBIS3.CONTROLS.Data.Types.IFlags
    * @public
    * @author Ганшин Ярослав
    */

   var Flags = $ws.core.extend({}, [IFlags, IEnumerable], {
      _moduleName: 'SBIS3.CONTROLS.Data.Types.Flags',
      $protected: {
         _options: {
            data: {},
         },
         _selected: [],
         _enumerator: undefined,
         _indexed: {},
         _length: undefined
      },
      $constructor: function(cfg) {

      },

      get: function (name) {
         var data = this._options.data;
         if (data.hasOwnProperty(name)) {
            return data[name];
         }
         return undefined;
      },

      set: function (name, value) {
         var data = this._options.data;
         if (data.hasOwnProperty(name)) {
            data[name] = value === null ? null : !!value;
            return true;
         }
         return false;
      },

      getByIndex: function(index) {
         var key = this._getKeByIndex(index);
         return this._data[key];
      },

      setByIndex: function(index, value) {
         var key = this._getKeByIndex(index);
         return this.set(key, value);
      },

      _getKeByIndex: function(index) {
         return this._indexed[index];
      },

      _setAll: function(value) {
         var data = this._options.data;
         value = value === null ? null : !!value;
         for (var key in data) {
            if (data.hasOwnProperty(key)) {
               data[key] = value;
            }
         }
      },

      setFalseAll: function() {
         this._setAll(false);
      },

      setTrueAll: function() {
         this._setAll(true);
      },

      setNullAll: function() {
         this._setAll(null);
      },

      equal: function(value) {
         if (!(value instanceof Flags)) {
            throw new Error("Value isn't flags");
         }
         var result = true,
            self = this,
            len = 0;
         value.each(function(value, key){
            if(result && self.get(key) === value)
               len++;
            else
               result = false;
         });
         if (result && this._length === len) {
            return true;
         }
         return false;
      },

      each: function(callback, context) {
         context = context||this;
         $ws.helpers.forEach(this._options.data, callback, context);
      }
   });
   return Flags;
});
