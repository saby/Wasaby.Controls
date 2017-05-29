/* global define */
define('js!WS.Data/Display/IBindCollection', [
   'js!WS.Data/Collection/IBind'
], function (
   ICollection
) {
   'use strict';

   /**
    * Интерфейс привязки к проекции коллекции
    * @interface WS.Data/Display/IBindCollection
    * @public
    * @author Мальцев Алексей
    */

   var IBindCollection = /** @lends WS.Data/Display/IBindCollection.prototype */{
      /**
       * @event onCollectionChange После изменения коллекции
       * @param {$ws.proto.EventObject} event Дескриптор события.
       * @param {WS.Data/Collection/IBind#ChangeAction} action Действие, приведшее к изменению.
       * @param {WS.Data/Display/CollectionItem[]} newItems Новые элементы коллекции.
       * @param {Number} newItemsIndex Индекс, в котором появились новые элементы.
       * @param {WS.Data/Display/CollectionItem[]} oldItems Удаленные элементы коллекции.
       * @param {Number} oldItemsIndex Индекс, в котором удалены элементы.
       * @param {String} groupId Идентификатор группы, в которой произошли изменения
       * @example
       * <pre>
       *    define([
       *       'js!WS.Data/Collection/ObservableList',
       *       'js!WS.Data/Display/Collection',
       *       'js!WS.Data/Display/IBindCollection'
       *    ], function(
       *       ObservableList,
       *       CollectionDisplay,
       *       IBindCollection
       *    ) {
       *       var list = new ObservableList(),
       *          display = new CollectionDisplay({
       *             collection: list
       *          });
       *       
       *       display.subscribe('onCollectionChange', function(eventObject, action){
       *          if (action == IBindCollection.ACTION_REMOVE){
       *             //Do something with removed items
       *          }
       *       });
       *    });
       * </pre>
       */

      /**
       * @event onCollectionItemChange После изменения элемента коллекции
       * @param {$ws.proto.EventObject} event Дескриптор события.
       * @param {WS.Data/Display/CollectionItem} item Измененный элемент коллекции.
       * @param {Number} index Индекс измененного элемента.
       * @param {Object.<String, *>} properties Названия и новые значения изменившихся свойств.
       * @example
       * <pre>
       *    display.subscribe('onCollectionItemChange', function(eventObject, item, index, properties) {
       *       if ('selected' in properties){
       *          //Do something if 'selected' property changed
       *       }
       *    });
       * </pre>
       */
   };

   /**
    * @const {String} Изменение коллекции: добавлены элементы
    */
   IBindCollection.ACTION_ADD = ICollection.ACTION_ADD;

   /**
    * @const {String} Изменение коллекции: удалены элементы
    */
   IBindCollection.ACTION_REMOVE = ICollection.ACTION_REMOVE;

   /**
    * @const {String} Изменение коллекции: заменены элементы
    */
   IBindCollection.ACTION_REPLACE = ICollection.ACTION_REPLACE;

   /**
    * @const {String} Изменение коллекции: перемещены элементы
    */
   IBindCollection.ACTION_MOVE = ICollection.ACTION_MOVE;

   /**
    * @const {String} Изменение коллекции: значительное изменение
    */
   IBindCollection.ACTION_RESET = ICollection.ACTION_RESET;

   return IBindCollection;
});
