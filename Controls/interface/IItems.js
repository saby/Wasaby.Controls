define('js!Controls/interface/IItems', [
], function() {

   /**
    * Интерфейс работы списков.
    * @mixin Controls/interface/IItems
    * @public
    */

   /**
    * @name Controls/interface/IItems#items
    * @cfg {Array} Список с данными для отображения.
    */
   /**
    * @name Controls/interface/IItems#itemTemplate
    * @cfg Шаблон для отображения строки списка.
    */
   /**
    * @name Controls/interface/IItems#displayProperty
    * @cfg {String} Имя поля в объекте из набора items, которое используется для отображения значения в шаблоне строки по умолчанию, когда не задана опция itemTemplate.
    */
});