/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Di', [], function () {
   'use strict';

   /**
    * Реализация шаблона проектирования "Dependency injection"
    * @class SBIS3.CONTROLS.Data.Di
    * @public
    * @author Мальцев Алексей
    */

   /**
    * Приватные свойства
    */
   var _private = {
      map: {}
   };

   return /** @lends SBIS3.CONTROLS.Data.Di.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Di',

      /**
       * @typedef {Object} DependencyOptions
       * @property {Boolean} [single=false] Инстанциировать только один объект
       * @property {Boolean} [instantiate=true] Создавать новый экземпляр или использовать переданный инстанс
       */

      /**
       * Регистрирует зависимость
       * @param {String} alias Название зависимости
       * @param {Function|Object} factory Фабрика объектов или готовый инстанс
       * @param {DependencyOptions} [options] Опции
       * @static
       * @example
       * <pre>
       *    var User = Model.extend({});
       *    Di.register('model.user', User);
       * </pre>
       * @example
       * <pre>
       *    var currentUser = new Model();
       *    Di.register('app.user', currentUser, {instantiate: false});
       * </pre>
       * @example
       * <pre>
       *    var Logger = $ws.core.extend({
       *       log: function() {}
       *    });
       *    Di.register('app.logger', Logger, {single: true});
       * </pre>
       */
      register: function (alias, factory, options) {
         if (!alias) {
            throw new TypeError('Alias is not defined');
         }
         _private.map[alias] = [factory, options];
      },

      /**
       * Удаляет регистрацию зависимости
       * @param {String} alias Название зависимости
       * @static
       * @example
       * <pre>
       *    Di.unregister('model.user');
       * </pre>
       */
      unregister: function (alias) {
         if (!alias) {
            throw new TypeError('Alias is not defined');
         }
         delete _private.map[alias];
      },

      /**
       * Проверяет регистрацию зависимости
       * @param {String} alias Название зависимости
       * @returns Boolean
       * @static
       * @example
       * <pre>
       *    var userRegistered = Di.isRegistered('model.user');
       * </pre>
       */
      isRegistered: function (alias) {
         if (!alias) {
            throw new TypeError('Alias is not defined');
         }
         return _private.map.hasOwnProperty(alias);
      },

      /**
       * Разрешает зависимость
       * @param {String} alias Название зависимости
       * @param {Object} [options] Опции конструктора
       * @static
       * @example
       * <pre>
       *    var User = Model.extend();
       *    Di.register('model.user', User);
       *    //...
       *    var newUser = Di.resolve('model.user', {
       *       rawData: {}
       *    });
       * </pre>
       */
      resolve: function (alias, options) {
         if (!alias) {
            throw new TypeError('Alias is not defined');
         }
         var Factory,
            config,
            singleInst;

         if (typeof alias === 'function') {
            Factory = alias;
         } else {
            if (!_private.map.hasOwnProperty(alias)) {
               throw new ReferenceError('Alias ' + alias + ' is not registered');

            }
            Factory = _private.map[alias][0],
               config = _private.map[alias][1],
               singleInst = _private.map[alias][2];
         }

         if (config && config.instantiate === false) {
            return factory;
         }

         if (config && config.single === true) {
            if (singleInst === undefined) {
               singleInst = _private.map[alias][2] = new Factory(options);
            }
            return singleInst;
         }

         return new Factory(options);
      }
   };
});
