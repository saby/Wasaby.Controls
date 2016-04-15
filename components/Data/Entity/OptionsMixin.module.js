/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Entity.OptionsMixin', function () {
   'use strict';

   /**
    * Примесь, позволяющая передавать в конструктор сущности набор опций (объект вида ключ-значение).
    * Для разделения защищенных свойств и опций последние должны именоваться определенным образом - имя должно
    * начинаться с префикса '_$':
    * <pre>
    *    var Device = Core.extend([OptionsMixin], {
       *       _$vendor: '',
       *       getVendor: function () {
       *          return this._$vendor;
       *       }
       *    });
    * </pre>
    * Если класс-наследник имеет свой конструктор, обязательно вызовите конструктор примеси (или конструктор
    * родительского класса, если примесь уже есть у родителя):
    * <pre>
    *    var Device = Core.extend([OptionsMixin], {
       *       _$vendor: '',
       *       constructor: function(options) {
       *          OptionsMixin.constructor.call(this, options);
       *       },
       *       getVendor: function () {
       *          return this._$vendor;
       *       }
       *    });
    * </pre>
    * Потому что именно конструктор примеси OptionsMixin раскладывает значения аргумента options по защищенным свойствам:
    * <pre>
    *    var hdd = new Device({
    *       vendor: 'Seagate'
    *    });
    *    hdd.getVendor();//Seagate
    * </pre>
    * @class SBIS3.CONTROLS.Data.Entity.OptionsMixin
    * @public
    * @author Мальцев Алексей
    */

   var optionPrefix = '_$',
      optionPrefixLen = 2,
      OptionsMixin = /** @lends SBIS3.CONTROLS.OptionsMixin.prototype */{
      /**
       * Конструктор объекта, принимающий набор опций в качестве первого аргумента
       * @param {Object.<String, *>} options Значения опций
       */
      constructor: function $Options(options) {
         if (options instanceof Object) {
            var option, property;
            for (option in options) {
               if (options.hasOwnProperty(option) &&
                  (property = optionPrefix + option) in this
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
            if (key.substr(0, optionPrefixLen) === optionPrefix) {
               options[key.substr(optionPrefixLen)] = this[key];
            }
         }
         return options;
      }
   };

   return OptionsMixin;
});
