define('js!SBIS3.SPEC.interface.IInfinitySelectable', [
], function() {

   /**
    * Интерфейс работы списков.
    * @mixin SBIS3.SPEC.interface.IInfinitySelectable
    * @public
    */

   /**
    * @name SBIS3.SPEC.interface.IInfinitySelectable#selectedKeys
    * @cfg {Array} Массив ключевых полей выбранных элементов "бесконечного" списка.
    * Если выделен весь бесконечный список, то значение массива [null]
    */

   /**
    * @name SBIS3.SPEC.interface.IInfinitySelectable#excludedKeys
    * @cfg {Array}  Массив ключевых полей, которые необходимо исключить из набора выбранных элементов "бесконечного" списка.
    */


   /**
    * @event SBIS3.SPEC.interface.IInfinitySelectable#onChangeSelectedKeys Происходит при изменении массива выделенных записей.
    * @param {Array} keys массив ключей выбранных элементов коллекции.
    * @param {Array} added массив добавленных ключей в списке выбранных элементов коллекции.
    * @param {Array} deleted массив удаленных ключей из списка выбранных элементов коллекции.
    */

   /**
    * @event SBIS3.SPEC.interface.IInfinitySelectable#onChangeExcludedKeys Происходит при изменении массива записей исключения выделения.
    * @param {Array} keys массив ключей, которые необходимо исключить из набора выбранных элементов "бесконечного" списка.
    * @param {Array} added массив добавленных ключей.
    * @param {Array} deleted массив удаленных.
    */

   /**
    * Выделить все
    * @function SBIS3.SPEC.interface.IInfinitySelectable#selectAll
    */

   /**
    * Снять выделение
    * @function SBIS3.SPEC.interface.IInfinitySelectable#UnselectAll
    */

});