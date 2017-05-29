/* global define */
define('js!WS.Data/Entity/OptionsMixin', function () {
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
    * @class WS.Data/Entity/OptionsMixin
    * @public
    * @author Мальцев Алексей
    */

   var optionPrefix = '_$',
      optionPrefixLen = 2;

   var OptionsMixin = /** @lends WS.Data/Entity/OptionsMixin.prototype */{
      /**
       * Конструктор объекта, принимающий набор опций в качестве первого аргумента
       * @param {Object.<String, *>} options Значения опций
       */
      constructor: function $OptionsMixin(options) {
         if (options && typeof options === 'object') {
            var prefix = optionPrefix,
               keys = Object.keys(options),
               option,
               property,
               i,
               count;
            for (i = 0, count = keys.length; i < count; i++) {
               option = keys[i];
               property = prefix + option;
               if (property in this) {
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
         var options = {},
            keys = Object.keys(this),
            key,
            i;
         for (i = 0; i < keys.length; i++) {
            key = keys[i];
            if (key.substr(0, optionPrefixLen) === optionPrefix) {
               options[key.substr(optionPrefixLen)] = this[key];
            }
         }

         //FIXME: отказаться от устаревших _options
         if (this._options) {
            for (key in this._options) {
               if (this._options.hasOwnProperty(key) && !(key in options)) {
                  options[key] = this._options[key];
               }
            }
         }

         return options;
      }
   };

   return OptionsMixin;
});
