/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Entity.OptionsMixin', function () {
   'use strict';

   /**
    * Примесь, позволяющая передавать в конструктор сущности набор опций (ключ - значение)
    * @class SBIS3.CONTROLS.Data.Entity.OptionsMixin
    * @public
    * @author Мальцев Алексей
    */

   var OptionsMixin = /** @lends SBIS3.CONTROLS.OptionsMixin.prototype */{
      /**
       * Конструктор объекта, принимающий набор опций
       * @param {Object.<String, *>} options Значения опций
       */
      constructor: function $Options(options) {
         if (options instanceof Object) {
            var option, property;
            for (option in options) {
               if (options.hasOwnProperty(option) &&
                  (property = '$' + option) in this
               ) {
                  this[property] = options[option];
               }
            }
         }
      },

      /**
       * Возвращает опции объекта
       * @return {Object.<String, *>} Значения опций
       * @protected
       */
      _getOptions: function() {
         var options = {};
         for (var key in this) {
            if (key[0] === '$') {
               options[key.substr(1)] = this[key];
            }
         }
         return options;
      }
   };

   return OptionsMixin;
});
