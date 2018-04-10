define('Controls/interface/IMultiSelectable', [
], function() {

   /**
    * Интерфейс работы списков.
    * @mixin Controls/interface/IMultiSelectable
    * @public
    */

   /**
    * @name Controls/interface/IMultiSelectable#selectedKeys
    * @cfg {Array} Массив ключевых полей выбранных элементов коллекции.
    * @variant [null] выделено все
    * @variant [] не выделено ничего
    */

   /**
    * @event Controls/interface/IMultiSelectable#selectedKeysChanged Происходит при изменении массива выделенных записей.
    * @param {Array} keys массив ключей выбранных элементов коллекции.
    * @param {Array} added массив добавленных ключей в списке выбранных элементов коллекции.
    * @param {Array} deleted массив удаленных ключей из списка выбранных элементов коллекции.
    */
});
