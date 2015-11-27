/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.SerializableMixin', [
], function () {
   'use strict';

   /**
    * Миксин, позволяющий сериализовать объекты
    * @mixin SBIS3.CONTROLS.Data.SerializableMixin
    * @public
    * @author Мальцев Алексей
    */

   var SerializableMixin = /**@lends SBIS3.CONTROLS.Data.SerializableMixin.prototype */{
      $protected: {
         /**
          * @var {Number} Уникальный номер инстанса
          */
         _instanceId: 0
      },

      //region Public methods

      /**
       * Возвращает экземпляр в сериализованном виде
       * @returns {Object}
       */
      toJSON: function() {
         if (!this._moduleName) {
            throw new Error('Module name is undefined');
         }
         var result = {
            $serialized$: 'inst',
            module: this._moduleName,
            id: this._getInstanceId(),
            state: this._getSerializableState()
         };
         _instanceStorage[result.id] = this;
         return result;
      },

      /**
       * Replacer для использования в JSON.stringify(value[, replacer]). Метод вызывается статически.
       * @param {String} name Название сериализуемого свойства
       * @param {Object} value Значение сериализуемого свойства
       * @returns {*}
       * @static
       */
      jsonReplacer: function(name, value) {
         if (typeof value == 'function') {
            _functionStorage.push(value);
            return {
               $serialized$: 'func',
               id: _functionStorage.length - 1
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
       * Reviver для использования в JSON.parse(text[, reviver]). Метод вызывается статически.
       * @param {String} name Название десериализуемого свойства
       * @param {Object} value Значение десериализуемого свойства
       * @returns {*}
       * @static
       */
      jsonReviver: function (name, value) {
         var result = value;

         if ((value instanceof Object) &&
            value.hasOwnProperty('$serialized$')
         ) {
            switch (value.$serialized$) {
               case 'inst':
                  if (_instanceStorage[value.id]) {
                     result = _instanceStorage[value.id];
                  } else {
                     var Module = require('js!' + value.module),
                        instance,
                        initializer = Module.prototype._setSerializableState(value.state);
                     instance = new Module(value.state._options);
                     initializer.call(instance, value.id);

                     _instanceStorage[value.id] = instance;
                     result = instance;
                  }
                  break;
               case 'func':
                  result = _functionStorage[value.id];
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
                  throw new Error('Unknown serialized type "' + value.$type + '" detected');
            }
         }

         /*if (name === '') {
            _instanceCounter = 0;
            _functionStorage = [];
            _instanceStorage = [];
         }*/

         return result;
      },

      //endregion Public methods

      //region Protected methods

      /**
       * Возвращает всё, что нужно сложить в состояние объекта при сериализации, чтобы при десериализации вернуть его в это же состояние
       * @returns {Object}
       * @private
       */
      _getSerializableState: function() {
         return {
            _options: this._options
         };
      },

      /**
       * Проверяет сериализованное состояние перед созданием инстанса. Возвращает метод, востанавливающий состояние объекта после создания инстанса.
       * @returns {Function}
       * @private
       */
      _setSerializableState: function(state) {
         state._options = state._options || {};
         return function initializer(instanceId) {
            this._instanceId = instanceId;
         };
      },

      /**
       * Возвращает уникальный номер инстанса
       * @returns {Number}
       * @private
       */
      _getInstanceId: function() {
         return this._instanceId || (this._instanceId = ++_instanceCounter);
      }

      //endregion Protected methods
   };

   var _instanceCounter = 0,
      _functionStorage = [],
      _instanceStorage = [],
      _typeSignature = '!~type~:',
      _typeToSign = {
         'function': _typeSignature + 'f:',
         '+Infinity': _typeSignature + '+inf',
         '-Infinity': _typeSignature + '-inf',
         'undefined': _typeSignature + 'undef'
      };

   return SerializableMixin;
});
