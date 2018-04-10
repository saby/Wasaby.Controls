define('Controls/interface/IGroupedView', [
], function() {

   /**
    * Интерфейс для работы с группировкой.
    *
    * @mixin Controls/interface/IGroupedView
    * @public
    */


   /**
    * @typedef {Object} TItemsGroup
    * @property {Function} method - метод, по которому строится группировка. Для каждого элемента коллекции должен возвращать идентификатор, соотвествующей ему группы
    * @property {String} template - шаблон группы
    */

   /**
    * @name Controls/interface/IGroupedView#itemsGroup
    * @cfg {TItemsGroup} кофигурация группировки записей. Включает в себя метод, возвращающий идентификатор группы для переданной в него записи, а так же шаблон отрисовки группы.
    */

});
