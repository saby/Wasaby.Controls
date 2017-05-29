/* global define */
define('js!WS.Data/Entity/IObject', [], function () {
   'use strict';

   /**
    * Интерфейс доступа к свойствам объекта.
    * Позволяет читать и записывать значения свойств, а также проверять их наличие.
    * @interface WS.Data/Entity/IObject
    * @public
    * @author Мальцев Алексей
    */

   return /** @lends WS.Data/Entity/IObject.prototype */{
      _wsDataEntityIObject: true,

      /**
       * @event onPropertyChange После изменения набора свойств объекта.
       * @param {$ws.proto.EventObject} event Дескриптор события.
       * @param {Object.<String, *>} properties Названия и новые значения изменившихся свойств.
       * @example
       * <pre>
       *    var human = new Record({
       *       rawData: {
       *          firstName: 'Laurence',
       *          lastName: 'Wachowski',
       *          born: 'June 21, 1965',
       *          gender: 'Male'
       *       }
       *    });
       *
       *    human.subscribe('onPropertyChange', function(event, properties) {
       *       if ('gender' in properties) {
       *          Di.resolve('the.big.brother').getRegistry('Transgenders').add(event.getTarget());
       *       }
       *    });
       *
       *    human.set({
       *       firstName: 'Lana',
       *       gender: 'Female'
       *    })
       * </pre>
       */

      /**
       * Возвращает значение свойства.
       * Если свойство не существует, возвращает undefined.
       * Если свойство является объектом, то всегда возвращается один и тот же объект (если он не был заменен через вызов метода set).
       * @param {String} name Название свойства
       * @return {*}
       * @example
       * Получим имя и сведения о родителях персонажа:
       * <pre>
       *    var timeline = 'before s6e10',
       *       character = new Record({
       *          rawData: {
       *             name: 'Jon',
       *             familyName: 'Snow',
       *             father: {
       *                name: 'Eddard',
       *                familyName: 'Stark'
       *             }
       *          }
       *       });
       *
       *    character.get('name');//'Jon'
       *    character.get('father');//{name: 'Eddard', familyName: 'Stark'}
       *    character.get('mother');//undefined
       * </pre>
       */
      get: function (name) {
         throw new Error('Method must be implemented');
      },

      /**
       * Устанавливает значение свойства.
       * Если свойство только для чтения, генерирует исключение.
       * @param {String|Object.<String, *>} name Название свойства или набор названий свойств и их значений
       * @param {*} [value] Значение свойства (передается в случае, если name - строка)
       * @example
       * Установим имя персонажа:
       * <pre>
       *    var character = new Record();
       *    character.set('name', 'Jon');
       * </pre>
       * Установим данные персонажа:
       * <pre>
       *    var character = new Record();
       *    character.set({
       *       name: 'Jon',
       *       familyName: 'Snow',
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
       * @return {Boolean}
       * @example
       * Проверим наличие связей персонажа:
       * <pre>
       *    var timeline = 'before s6e10',
       *       character = new Record({
       *          rawData: {
       *             name: 'Jon',
       *             familyName: 'Snow',
       *             father: {
       *                name: 'Eddard',
       *                familyName: 'Stark'
       *             }
       *          }
       *       });
       *    
       *    character.has('father');//true
       *    character.has('mother');//false
       * </pre>
       */
      has: function (name) {
         throw new Error('Method must be implemented');
      }
   };
});
