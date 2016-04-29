/* global define */
define('js!SBIS3.CONTROLS.Data.IObject', [], function () {
   'use strict';

   /**
    * Интерфейс доступа к свойствам объекта
    * @mixin SBIS3.CONTROLS.Data.IObject
    * @public
    * @author Мальцев Алексей
    */

   return /** @lends SBIS3.CONTROLS.Data.IObject.prototype */{
      /**
       * @event onPropertyChange После изменения свойств объекта
       * @param {$ws.proto.EventObject} event Дескриптор события.
       * @param {Object.<String, *>} properties Названия и новые значения изменившихся свойств
       * @example
       * <pre>
       *    user.subscribe('onPropertyChange', function(event, properties){
       *       if ('gender' in properties) {
       *          Di.resolve('the.big.brother').alert('Transgender detected! :)', event.getTarget());
       *       }
       *    });
       * </pre>
       */

      /**
       * Возвращает значение свойства.
       * Если свойство не существует, возвращает undefined.
       * @param {String} name Название свойства
       * @returns {*}
       * @example
       * Получим логин пользователя:
       * <pre>
       *    var userLogin = user.get('login');
       * </pre>
       */
      get: function (name) {
         throw new Error('Method must be implemented');
      },

      /**
       * Устанавливает значение свойства.
       * Если свойство только для чтения, генерирует исключение.
       * @param {StringObject.<String, *>} name Название свойства или набор названий свойств и их значений
       * @param {*} value Значение свойства
       * @example
       * Установим логин пользователя:
       * <pre>
       *    user.set('login', 'john-snow');
       * </pre>
       * Установим данные пользователя:
       * <pre>
       *    user.set({
       *       login: 'john-snow',
       *       name: 'John',
       *       house: 'House Stark'
       *    });
       * </pre>
       */
      set: function (name, value) {
         throw new Error('Method must be implemented');
      },

      /**
       * Проверяет наличие свойства у объекта.
       * @param {String} name Название свойства
       * @returns {Boolean}
       * @example
       * Проверим наличие связей:
       * <pre>
       *    var hasRelations = user.has('relations');
       * </pre>
       */
      has: function (name) {
         throw new Error('Method must be implemented');
      }
   };
});
