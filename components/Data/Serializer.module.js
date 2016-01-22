/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Serializer', [
], function () {
   'use strict';

   /**
    * Сериалайзер - обеспечивает возможность сериализовать и десериализовать специальные типы
    * @class SBIS3.CONTROLS.Data.Serializer
    * @public
    * @author Мальцев Алексей
    */

   var Serializer = $ws.core.extend({}, /** @lends SBIS3.CONTROLS.Data.Serializer.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Serializer',
      $protected: {
         /**
          * @var {Number} Счетчик экземпляров
          */
         _instanceCounter: 0,

         /**
          * @var {Function[]} Хранилище функций
          */
         _functionStorage: [],

         /**
          * @var {Object} Хранилище инстансов
          */
         _instanceStorage: {}
      },

      /**
       * @member {Object<String, RegExp>} Сигнатуры результатов сериализации через метод toJSON для стандартных JS-объектов
       */
      _patterns: {
         'Date': /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:[0-9\.]+Z$/
      },

      $constructor: function () {
         this.serialize = this.serialize.bind(this);
         this.deserialize = this.deserialize.bind(this);
      },

      /**
       * Replacer для использования в JSON.stringify(value[, replacer]).
       * @param {String} name Название сериализуемого свойства
       * @param {Object} value Значение сериализуемого свойства
       * @returns {*}
       * @static
       */
      serialize: function (name, value) {
         if (typeof value === 'function') {
            this._functionStorage.push(value);
            return {
               $serialized$: 'func',
               id: this._functionStorage.length - 1
               //TODO: При сериализации на сервере надо сохранять и код функций-"не членов класса"?
               //code: $ws.single.base64.encode(value.toString())
            };
         } else if (value === Infinity) {
            return {
               $serialized$: '+inf'
            };
         } else if (value === -Infinity) {
            return {
               $serialized$: '-inf'
            };
         } else if (!isNaN(Number(name)) && Number(name) >= 0 && value === undefined) {
            // В массивах позволяем передавать undefined
            return {
               $serialized$: 'undef'
            };
         } else {
            return value;
         }
      },

      /**
       * Reviver для использования в JSON.parse(text[, reviver]).
       * @param {String} name Название десериализуемого свойства
       * @param {*} value Значение десериализуемого свойства
       * @returns {*}
       * @static
       */
      deserialize: function (name, value) {
         var result = value;

         if ((value instanceof Object) &&
            value.hasOwnProperty('$serialized$')
         ) {
            switch (value.$serialized$) {
               case 'func':
                  result = this._functionStorage[value.id];
                  break;
               case 'inst':
                  if (this._instanceStorage[value.id]) {
                     result = this._instanceStorage[value.id];
                  } else {
                     //Используем SerializableMixin для инстанциирования
                     var Module = require('js!' + value.module),
                        instance = Module.prototype.fromJSON.call(Module, value);
                     this._instanceStorage[value.id] = instance;
                     result = instance;
                  }
                  break;
               case '+inf':
                  result = Infinity;
                  break;
               case '-inf':
                  result = -Infinity;
                  break;
               case 'undef':
                  result = undefined;
                  break;
               default:
                  throw new Error('Unknown serialized type "' + value.$serialized$ + '" detected');
            }
         }

         if (typeof result === 'string') {
            for (var key in this._patterns) {
               if (this._patterns.hasOwnProperty(key) &&
                  this._patterns[key].test(result)
               ) {
                  switch (key) {
                     case 'Date':
                        return new Date(result);
                  }
               }
            }
         }

         return result;
      }
   });

   return Serializer;
});
