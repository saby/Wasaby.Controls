define('js!SBIS3.SPEC.interface.IItems', [
], function() {

   /**
    * Интерфейс работы списков.
    * @mixin SBIS3.SPEC.interface.IItems
    * @public
    */

   /**
    * @name SBIS3.SPEC.interface.IItems#items
    * @cfg {Array} Список с данными для отображения.
    */
   /**
    * @name SBIS3.SPEC.interface.IItems#itemTemplate
    * @cfg Шаблон для отображения строки списка.
    */
   /**
    * @name SBIS3.SPEC.interface.IItems#displayProperty
    * @cfg {String} Имя поля в объекте из набора items, которое используется для отображения значения в шаблоне строки по умолчанию, когда не задана опция itemTemplate.
    */
});