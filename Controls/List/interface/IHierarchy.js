define('Controls/List/interface/IHierarchy', [
], function() {

   /**
    * Интерфейс работы списков с наличием иерархии элментов
    *
    * @mixin Controls/List/interface/IHierarchy
    * @public
    */

   /**
    * @name Controls/List/interface/IHierarchy#root
    * @cfg {String} Идентификатор узла, являющегося корнем выборки
    */

   /**
    * @name Controls/List/interface/IHierarchy#hasChildrenProperty
    * @cfg {String} Имя свойства элемента, в котором содержится информация о наличии потомков для данного элемента
    */

   /**
    * @name Controls/List/interface/IHierarchy#nodeProperty
    * @cfg {String} Имя свойства элемента, в котором содержится информация о типе элемента (лист/узел/скрытый узел)
    */

   /**
    * @name Controls/List/interface/IHierarchy#parentProperty
    * @cfg {String} Имя свойства элемента, в котором содержится информация о родительском элементе
    */


});
