/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.ContextField.ContextFieldMixin', [], function () {
   'use strict';
   return {
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
   };

});