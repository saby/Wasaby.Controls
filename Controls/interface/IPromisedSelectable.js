define('js!Controls/interface/IPromisedSelectable', [
], function() {

   /**
    * Интерфейс работы списков.
    * @mixin Controls/interface/IPromisedSelectable
    * @public
    */

   /**
    * @name Controls/interface/IPromisedSelectable#selectedKeys
    * @cfg {Array} Массив ключевых полей выбранных элементов "бесконечного" списка.
    * Если выделен весь бесконечный список, то значение массива [null]
    */

   /**
    * @name Controls/interface/IPromisedSelectable#excludedKeys
    * @cfg {Array} Массив ключевых полей, которые необходимо исключить из набора выбранных элементов "бесконечного" списка.
    */

   /**
    * Выделить все
    * @function Controls/interface/IPromisedSelectable#selectAll
    */

   /**
    * Снять выделение
    * @function Controls/interface/IPromisedSelectable#unselectAll
    */

   /**
    * Инвертировать выделение
    * @function Controls/interface/IPromisedSelectable#toggleSelection
    */

   /**
    * @event Controls/interface/IPromisedSelectable#changeSelectedKeys Происходит при изменении массива выделенных записей.
    * @param {Array} keys массив ключей выбранных элементов коллекции.
    * @param {Array} added массив добавленных ключей в списке выбранных элементов коллекции.
    * @param {Array} deleted массив удаленных ключей из списка выбранных элементов коллекции.
    */

   /**
    * @event Controls/interface/IPromisedSelectable#changeExcludedKeys Происходит при изменении массива записей исключения выделения.
    * @param {Array} keys массив ключей, которые необходимо исключить из набора выбранных элементов "бесконечного" списка.
    * @param {Array} added массив добавленных ключей.
    * @param {Array} deleted массив удаленных.
    */

});