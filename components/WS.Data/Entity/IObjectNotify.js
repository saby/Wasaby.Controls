/* global define */
define('/Entity/IObjectNotify', [], function () {
   'use strict';

   /**
    * Интерфейс уведомлений об изменении к свойств объекта.
    * @interface /Entity/IObjectNotify
    * @public
    * @author Мальцев Алексей
    */

   return /** @lends /Entity/IObjectNotify.prototype */{
      _wsDataEntityIObjectNotify: true

      /**
       * @event onPropertyChange После изменения набора свойств объекта.
       * @param {Core/EventObject} event Дескриптор события.
       * @param {Object} properties Названия и новые значения изменившихся свойств.
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
   };
});
