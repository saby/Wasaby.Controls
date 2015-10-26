/* global define */
define('js!SBIS3.CONTROLS.Data.Bind.ICollectionProjection', [
   'js!SBIS3.CONTROLS.Data.Bind.ICollection'
], function (ICollection) {
   'use strict';

   /**
    * Интерфейс привязки к проекции коллекции
    * @mixin SBIS3.CONTROLS.Data.Bind.ICollectionProjection
    * @public
    * @author Мальцев Алексей
    */

   var ICollectionProjection = /** @lends SBIS3.CONTROLS.Data.Bind.ICollectionProjection.prototype */{
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
       *    projection.subscribe('onCollectionChange', function(eventObject, action){
       *       if (action == ICollection.ACTION_REMOVE){
       *          //Do something
       *       }
       *    });
       * </pre>
       */

      /**
       * @event onCollectionItemChange После изменения элемента коллекции
       * @param {$ws.proto.EventObject} event Дескриптор события.
       * @param {SBIS3.CONTROLS.Data.Collection.ICollectionItem} item Измененный элемент коллеции.
       * @param {Integer} index Индекс измененного элемента.
       * @param {String} [property] Измененное свойство элемента
       * @example
       * <pre>
       *    projection.subscribe('onCollectionItemChange', function(eventObject, item, index, property){
       *       if (property === 'selected'){
       *          //Do something
       *       }
       *    });
       * </pre>
       */
   };

   /**
    * @const {String} Изменение коллекции: добавлены элементы
    */
   ICollectionProjection.ACTION_ADD = ICollection.ACTION_ADD;

   /**
    * @const {String} Изменение коллекции: удалены элементы
    */
   ICollectionProjection.ACTION_REMOVE = ICollection.ACTION_REMOVE;

   /**
    * @const {String} Изменение коллекции: заменены элементы
    */
   ICollectionProjection.ACTION_REPLACE = ICollection.ACTION_REPLACE;

   /**
    * @const {String} Изменение коллекции: перемещены элементы
    */
   ICollectionProjection.ACTION_MOVE = ICollection.ACTION_MOVE;

   /**
    * @const {String} Изменение коллекции: значительное изменение
    */
   ICollectionProjection.ACTION_RESET = ICollection.ACTION_RESET;

   return ICollectionProjection;
});
