define('js!Controls/List/interface/ITreeControl', [
], function() {

   /**
    * Интерфейс работы списков в виде дерева
    *
    * @mixin Controls/List/interface/ITreeControl
    * @public
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
    * @name Controls/List/interface/ITreeControl#singleExpand
    * @cfg {Boolean} Включает режим при котором открытие одного узла вызывает закрытие остальных
    */

   /**
    * @name Controls/List/interface/ITreeControl#expandedItems
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
    * @event Controls/List/interface/ITreeControl#itemExpand Перед разворачиванием узла
    */
   /**
    * @event Controls/List/interface/ITreeControl#itemExpanded После разворачивания узла
    */
   /**
    * @event Controls/List/interface/ITreeControl#itemCollapse Перед сворачиванием узла
    */
   /**
    * @event Controls/List/interface/ITreeControl#itemCollapsed После сворачивания узла
    */

});