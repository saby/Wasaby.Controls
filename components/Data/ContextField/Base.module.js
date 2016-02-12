/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.ContextField.Base', [], function () {
   'use strict';
   return $ws.core.extend({}, {
      $protected: {
         _options: {
            module: undefined
         }
      },

      is: function (value) {
         return value instanceof this._options.module;
      },

      toJSON: function (value, deep) {
         return deep ? value.toObject() : value;
      }
   });

});