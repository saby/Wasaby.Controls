define('js!Controls/interface/IItems', [
], function() {

   /**
    * Интерфейс работы списков.
    *
    * @mixin Controls/interface/IItems
    * @public
    */

   /**
    * @name Controls/interface/IItems#items
    * @cfg {Array} Список элементов коллекции, отображаемый в компоненте.
    */

   /**
    * @name Controls/interface/IItems#itemTemplate
    * @cfg {Function} Шаблон для отображения элемента коллекции.
    */

   /**
    * @name Controls/interface/IItems#keyProperty
    * @cfg {String} Имя свойства элемента, которое является идентификатором записи.
    */

   /**
    * @name Controls/interface/IItems#displayProperty
    * @cfg {String} Имя свойства элемента, которое используется для отображения значения в шаблоне строки по умолчанию, когда не задана опция itemTemplate.
    */

});