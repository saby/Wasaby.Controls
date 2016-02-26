/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.ContextField.Base', [], function () {
   'use strict';
   /**
    * Базовый класс для поддержки типов в контексте
    * @class SBIS3.CONTROLS.Data.ContextField.Base
    * @author Мальцев Алексей
    */
   return $ws.core.extend({}, /** @lends SBIS3.CONTROLS.Data.ContextField.Base.prototype*/{
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