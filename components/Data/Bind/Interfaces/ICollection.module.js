/* global define */
define('js!SBIS3.CONTROLS.Data.Bind.ICollection', [], function () {
   'use strict';

   /**
    * Интерфейс привязки к коллекции
    * @mixin SBIS3.CONTROLS.Data.Bind.ICollection
    * @public
    * @author Мальцев Алексей
    */

   var ICollection = /** @lends SBIS3.CONTROLS.Data.Bind.ICollection.prototype */{
      /**
       * @event onCollectionChange После изменения коллекции
       * @param {$ws.proto.EventObject} event Дескриптор события.
       * @param {String} action Действие, приведшее к изменению.
       * @param {SBIS3.CONTROLS.Data.Collection.ICollectionItem[]} newItems Новые элементы коллеции.
       * @param {Integer} newItemsIndex Индекс, в котором появились новые элементы.
       * @param {SBIS3.CONTROLS.Data.Collection.ICollectionItem[]} oldItems Удаленные элементы коллекции.
       * @param {Integer} oldItemsIndex Индекс, в котором удалены элементы.
       * @example
       * <pre>
       *    menu.subscribe('onCollectionChange', function(eventObject, action){
       *       if (action == ICollection.ACTION_REMOVE){
       *          //Do something
       *       }
       *    });
       * </pre>
       */
   };

   /**
    * @const {String} Изменение коллекции: добавлены элементы
    */
   ICollection.ACTION_ADD = 'a';

   /**
    * @const {String} Изменение коллекции: удалены элементы
    */
   ICollection.ACTION_REMOVE = 'rm';

   /**
    * @const {String} Изменение коллекции: заменены элементы
    */
   ICollection.ACTION_REPLACE = 'rp';

   /**
    * @const {String} Изменение коллекции: перемещены элементы
    */
   ICollection.ACTION_MOVE = 'm';

   /**
    * @const {String} Изменение коллекции: значительное изменение
    */
   ICollection.ACTION_RESET = 'rs';

   /**
    * @const {String} Изменение коллекции: обновлены элементы
    */
   ICollection.ACTION_UPDATE = 'up';
   return ICollection;
});
