/* global define */
define('js!WS.Data/Di', [], function () {
   'use strict';

   /**
    * Реализация шаблона проектирования "Dependency injection" через IoC контейнер.
    * @class WS.Data/Di
    * @public
    * @author Мальцев Алексей
    */

   /**
    * Приватные свойства
    */
   var _private = {
      map: {}
   };

   var Di = /** @lends WS.Data/Di.prototype */{
      _moduleName: 'WS.Data/Di',

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
       * Зарегистрируем модель пользователя:
       * <pre>
       *    var User = Model.extend({});
       *    Di.register('model.$user', User, {instantiate: false});
       *    Di.register('model.user', User);
       * </pre>
       * Зарегистрируем экземпляр текущего пользователя системы:
       * <pre>
       *    var currentUser = new Model();
       *    Di.register('app.user', currentUser, {instantiate: false});
       * </pre>
       * Зарегистрируем логер, который будет singleton:
       * <pre>
       *    define(['Core/core-extend'], function(CoreExtend) {
       *       var Logger = CoreExtend.extend({
       *          log: function() {}
       *       });
       *       Di.register('app.logger', Logger, {single: true});
       *    });
       * </pre>
       * Зарегистрируем модель пользователя с переопределенными аргументами конструктора:
       * <pre>
       *    define(['Core/core-functions'], function(CoreFunctions) {
       *       Di.register('model.crm-user', function(options) {
       *          return new User(CoreFunctions.merge(options, {
       *             context: 'crm',
       *             dateFormat: 'Y/m/d'
       *          }));
       *       });
       *    });
       * </pre>
       */
      register: function (alias, factory, options) {
         Di._checkAlias(alias);
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
         Di._checkAlias(alias);
         delete _private.map[alias];
      },

      /**
       * Проверяет регистрацию зависимости
       * @param {String} alias Название зависимости
       * @return Boolean
       * @static
       * @example
       * <pre>
       *    var userRegistered = Di.isRegistered('model.user');
       * </pre>
       */
      isRegistered: function (alias) {
         Di._checkAlias(alias);
         return _private.map.hasOwnProperty(alias);
      },

      /**
       * Создает экземпляр зарегистрированной зависимости.
       * @param {String|Function|Object} alias Название зависимости, или конструктор объекта или инстанс объекта
       * @param {Object} [options] Опции конструктора
       * @return Object
       * @static
       * @example
       * <pre>
       *    var User = Model.extend();
       *    Di.register('model.$user', User, {instantiate: false});
       *    //...
       *    var newUser = Di.create('model.$user', {
       *       rawData: {}
       *    });
       * </pre>
       */
      create: function (alias, options) {
         var result = Di.resolve(alias, options);
         if (typeof result === 'function') {
            return Di.resolve(result, options);
         }
         return result;
      },

      /**
       * Разрешает зависимость
       * @param {String|Function|Object} alias Название зависимости, или конструктор объекта или инстанс объекта
       * @param {Object} [options] Опции конструктора
       * @return {Object|Function}
       * @static
       * @example
       * <pre>
       *    var User = Model.extend();
       *    Di.register('model.$user', User, {instantiate: false});
       *    Di.register('model.user', User);
       *    //...
       *    var User = Di.resolve('model.$user'),
       *       newUser = new User({
       *       rawData: {}
       *    });
       *    //...or...
       *    var newUser = Di.resolve('model.user', {
       *       rawData: {}
       *    });
       * </pre>
       */
      resolve: function (alias, options) {
         var aliasType = typeof alias,
            Factory,
            config,
            singleInst;

         switch (aliasType) {
            case 'function':
               Factory = alias;
               break;
            case 'object':
               Factory = alias;
               config = {instantiate: false};
               break;
            default:
               if (!Di.isRegistered(alias)) {
                  throw new ReferenceError('Alias ' + alias + ' is not registered');

               }
               Factory = _private.map[alias][0];
               config = _private.map[alias][1];
               singleInst = _private.map[alias][2];
         }

         if (config) {
            if (config.instantiate === false) {
               return Factory;
            }
            if (config.single === true) {
               if (singleInst === undefined) {
                  singleInst = _private.map[alias][2] = new Factory(options);
               }
               return singleInst;
            }
         }

         return new Factory(options);
      },

      /**
       * Проверяет валидность названия зависимости
       * @param {String} alias Название зависимости
       * @static
       * @protected
       */
      _checkAlias: function (alias) {
         if (typeof alias !== 'string') {
            throw new TypeError('Alias should be a string');
         }
         if (!alias) {
            throw new TypeError('Alias is empty');
         }
      }
   };

   return Di;
});
