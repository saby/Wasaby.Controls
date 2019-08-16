/**
 * Интерфейс привязки к проекции коллекции
 * @interface Types/_display/IBind
 * @public
 * @author Мальцев А.А.
 */
const IBind = {
   '[Types/_display/IBind]': true

   /**
    * @event После изменения коллекции
    * @name Types/_display/IBind#onCollectionChange
    * @param {Env/Event.Object} event Дескриптор события.
    * @param {Types/_collection/IObservable#ChangeAction} action Действие, приведшее к изменению.
    * @param {Types/_display/CollectionItem[]} newItems Новые элементы коллекции.
    * @param {Number} newItemsIndex Индекс, в котором появились новые элементы.
    * @param {Types/_display/CollectionItem[]} oldItems Удаленные элементы коллекции.
    * @param {Number} oldItemsIndex Индекс, в котором удалены элементы.
    * @param {String} groupId Идентификатор группы, в которой произошли изменения
    * @example
    * <pre>
    *    define([
    *       'Types/_collection/ObservableList',
    *       'Types/_display/Collection',
    *       'Types/_display/IBindCollection'
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
};

export default IBind;
