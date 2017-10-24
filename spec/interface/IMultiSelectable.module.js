define('js!SBIS3.SPEC.interface.IMultiSelectable', [
], function() {

   /**
    * Интерфейс работы списков.
    * @mixin SBIS3.SPEC.interface.IMultiSelectable
    * @public
    */

   /**
    * @name SBIS3.SPEC.interface.IMultiSelectable#selectedKeys
    * @cfg {Array} Массив ключевых полей выбранных элементов коллекции.
    */

   /**
    * @event SBIS3.SPEC.interface.IMultiSelectable#selectedKeysChanged Происходит при изменении массива выделенных записей.
    * @param {Array} keys массив ключей выбранных элементов коллекции.
    * @param {Array} added массив добавленных ключей в списке выбранных элементов коллекции.
    * @param {Array} deleted массив удаленных ключей из списка выбранных элементов коллекции.
    */
});