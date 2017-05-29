/* global define */
define('js!WS.Data/Collection/IBind', [], function () {
   'use strict';

   /**
    * Интерфейс привязки к коллекции.
    * Позволяет узнавать об изменения, происходящих с элементами коллекции.
    * @interface WS.Data/Collection/IBind
    * @public
    * @author Мальцев Алексей
    */

   var ICollection = /** @lends WS.Data/Collection/IBind.prototype */{
      /**
       * @typedef {String} ChangeAction
       * @variant a Добавлены элементы
       * @variant rm Удалены элементы
       * @variant rp Заменены элементы
       * @variant m Перемещены элементы
       * @variant rs Значительное изменение
       */

      /**
       * @event onCollectionChange После изменения коллекции
       * @param {$ws.proto.EventObject} event Дескриптор события.
       * @param {ChangeAction} action Действие, приведшее к изменению.
       * @param {Array} newItems Новые элементы коллекции.
       * @param {Number} newItemsIndex Индекс, в котором появились новые элементы.
       * @param {Array} oldItems Удаленные элементы коллекции.
       * @param {Number} oldItemsIndex Индекс, в котором удалены элементы.
       * @example
       * <pre>
       *    define(['js!WS.Data/Collection/ObservableList', 'js!WS.Data/Collection/IBind'], function(ObservableList, IBindCollection) {
       *       var list = new ObservableList({
       *          items: [1, 2, 3]
       *       });
       *
       *       list.subscribe('onCollectionChange', function(eventObject, action, newItems, newItemsIndex, oldItems, oldItemsIndex) {
       *          if (action == IBindCollection.ACTION_REMOVE){
       *             console.log(oldItems);//[1]
       *             console.log(oldItemsIndex);//0
       *          }
       *       });
       *
       *       list.removeAt(0);
       *    });
       * </pre>
       */

      /**
       * @event onCollectionItemChange После изменения элемента коллекции
       * @param {$ws.proto.EventObject} event Дескриптор события.
       * @param {*} item Измененный элемент коллекции.
       * @param {Number} index Индекс измененного элемента.
       * @param {Object.<String, *>} [properties] Изменившиеся свойства
       * @example
       * Отследим изменение свойства title:
       * <pre>
       *    var records = [new Record(), new Record(), new Record()],
       *       list = new ObservableList({
       *          items: records
       *       });
       *
       *    list.subscribe('onCollectionItemChange', function(eventObject, item, index, properties) {
       *       console.log(item === records[2]);//true
       *       console.log(index);//2
       *       console.log('title' in properties);//true
       *    });
       *
       *    records[2].set('title', 'test');
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

   return ICollection;
});
