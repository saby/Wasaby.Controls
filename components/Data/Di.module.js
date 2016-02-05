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

   var Di = /** @lends SBIS3.CONTROLS.Data.Di.prototype */{
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
       * @returns Boolean
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
       * Разрешает зависимость
       * @param {String|Function|Object} alias Название зависимости, или конструктор объекта или инстанс объекта
       * @param {Object} [options] Опции конструктора
       * @returns Object
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
               Factory = _private.map[alias][0],
                  config = _private.map[alias][1],
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
       * @private
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
