define('js!Controls/List/interface/ITreeControl', [
], function() {

   /**
    * Интерфейс работы списков в виде дерева
    *
    * @mixin Controls/List/interface/ITreeControl
    * @public
    */

   /**
    * @name Controls/List/interface/ITreeControl#root
    * @cfg {String} Идентификатор узла, являющегося корнем выборки
    */

   /**
    * @name Controls/List/interface/ITreeControl#hasChildrenProperty
    * @cfg {String} Имя свойства элемента, в котором содержится информация о наличии потомков для данного элемента
    */

   /**
    * @typedef {String} hierarchyViewModeEnum
    * @variant tree в виде дерева
    * @variant breadcrumbs только листья, папки в виде путей
    */
   /**
    * @name Controls/List/interface/ITreeControl#hierarchyViewMode
    * @cfg {hierarchyViewModeEnum} Режим отображения иерархии
    */

   /**
    * @name Controls/List/interface/ITreeControl#nodeProperty
    * @cfg {String} Имя свойства элемента, в котором содержится информация о типе элемента (лист/узел/скрытый узел)
    */

   /**
    * @name Controls/List/interface/ITreeControl#parentProperty
    * @cfg {String} Имя свойства элемента, в котором содержится информация о родительском элементе
    */

   /**
    * @name Controls/List/interface/ITreeControl#singleExpand
    * @cfg {Boolean} Включает режим при котором открытие одного узла вызывает закрытие остальных
    */

   /**
    * @name Controls/List/interface/ITreeControl#expandedNodes
    * @cfg {{Array.<String>}} Массив ключей узлов, которые должны быть развернуты
    */

   /**
    * @name Controls/List/interface/IListControl#multiSelectMode
    * @cfg {Boolean} (Может поменяться) Режим множественного выбора
    * @variant all Выделять все
    * @variant nodes Выделять только узлы
    * @variant leafs Выделять только листья
    */


   /**
    * @event Controls/List/interface/ITreeControl#nodeExpand Перед разворачиванием узла
    */
   /**
    * @event Controls/List/interface/ITreeControl#nodeExpanded После разворачивания узла
    */
   /**
    * @event Controls/List/interface/ITreeControl#nodeCollapse Перед сворачиванием узла
    */
   /**
    * @event Controls/List/interface/ITreeControl#nodeCollapsed После сворачивания узла
    */

});