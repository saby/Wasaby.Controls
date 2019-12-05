import {View as Grid} from 'Controls/grid';
import TreeGridViewModel = require('Controls/_treeGrid/TreeGridView/TreeGridViewModel');
import entity = require('Types/entity');
import TreeGridView = require('Controls/_treeGrid/TreeGridView/TreeGridView');
import TreeControl = require('Controls/_treeGrid/TreeControl');


/**
    * Контрол "Дерево".
    * @remark
    * Дополнительно о контроле:
    * * <a href="/doc/platform/developmentapl/interface-development/controls/list/tree/">Руководство разработчика</a>
    * * <a href="http://axure.tensor.ru/standarts/v7/%D0%B4%D0%B5%D1%80%D0%B5%D0%B2%D0%BE__%D0%B2%D0%B5%D1%80%D1%81%D0%B8%D1%8F_1_.html">Спецификация Axure</a>
    * * <a href="/materials/demo-ws4-tree-singleexpand">Демо-пример</a> с множественным выбором элементов и с единичным раскрытием содержимого папок
    * * <a href="/materials/demo-ws4-tree-grid-item-template">Демо-пример</a> с пользовательским шаблоном элемента списка
    * * <a href="/materials/demo-ws4-tree-with-photo">Демо-пример</a> с пользовательским шаблоном элемента списка с фото
    * * <a href="/materials/demo-ws4-tree-grid-extended">Демо-пример</a> с пользовательским шаблоном подвала (футера)
    * @class Controls/_treeGrid/View
    * @extends Controls/_grid/Grid
    * @mixes Controls/_interface/ISource
    * @mixes Controls/interface/IPromisedSelectable
    * @mixes Controls/interface/IGroupedGrid
    * @mixes Controls/interface/INavigation
    * @mixes Controls/_interface/IFilter
    * @mixes Controls/interface/IHighlighter
    * @mixes Controls/_list/interface/IList
    * @mixes Controls/_interface/IHierarchy
    * @mixes Controls/_treeGrid/interface/ITreeControl
    * @mixes Controls/interface/ITreeGridItemTemplate
    * @mixes Controls/interface/IDraggable
    * @mixes Controls/_grid/interface/IGridControl
    * @mixes Controls/interface/IGroupedGrid
    *
    * @mixes Controls/_list/interface/IVirtualScroll
    * @mixes Controls/_list/BaseControlStyles
    * @mixes Controls/_list/ListStyles
    * @mixes Controls/_grid/GridStyles
    * @mixes Controls/_treeGrid/Styles
    * @mixes Controls/_list/ItemActions/ItemActionsStyles
    * @mixes Controls/_list/Swipe/SwipeStyles
    *
    * @mixes Controls/MoveDialog/Styles
    * @mixes Controls/_paging/PagingStyles
    * @mixes Controls/_paging/DigitButtonsStyles
    * @mixes Controls/_grid/SortButtonStyles
    *
    * @control
    * @public
    * @author Авраменко А.С.
    * @category List
    * @demo Controls-demo/List/TreeGrid/BasePG
    */

   /*
    * Hierarchical list with custom item template. Can load data from data source.
    * The detailed description and instructions on how to configure the control you can read <a href='https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/'>here</a>.
    * The detailed description and instructions on how to configure editing you can read <a href='https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/edit-at-list/'>here</a>.
    * List of examples:
    * <ul>
    *    <li><a href="/materials/demo-ws4-edit-in-place">How to configure editing in your list</a>.</li>
    *    <li><a href="/materials/demo-ws4-tree-singleexpand">Tree with singleExpand option</a>.</li>
    * </ul>
    *
    * @class Controls/_treeGrid/View
    * @extends Controls/_grid/Grid
    * @mixes Controls/_interface/ISource
    * @mixes Controls/interface/IPromisedSelectable
    * @mixes Controls/interface/IGroupedGrid
    * @mixes Controls/interface/INavigation
    * @mixes Controls/_interface/IFilter
    * @mixes Controls/interface/IHighlighter
    * @mixes Controls/_list/interface/IList
    * @mixes Controls/_interface/ISorting
    * @mixes Controls/_interface/IHierarchy
    * @mixes Controls/_treeGrid/interface/ITreeControl
    * @mixes Controls/interface/ITreeGridItemTemplate
    * @mixes Controls/interface/IDraggable
    * @mixes Controls/_grid/interface/IGridControl
    * @mixes Controls/interface/IGroupedGrid
    *
    * @mixes Controls/_list/interface/IVirtualScroll
    * @mixes Controls/_list/BaseControlStyles
    * @mixes Controls/_list/ListStyles
    * @mixes Controls/_grid/GridStyles
    * @mixes Controls/_treeGrid/Styles
    * @mixes Controls/_list/ItemActions/ItemActionsStyles
    * @mixes Controls/_list/Swipe/SwipeStyles
    *
    * @mixes Controls/MoveDialog/Styles
    * @mixes Controls/_paging/PagingStyles
    * @mixes Controls/_paging/DigitButtonsStyles
    * @mixes Controls/_grid/SortButtonStyles
    *
    * @control
    * @public
    * @author Авраменко А.С.
    * @category List
    * @demo Controls-demo/List/TreeGrid/BasePG
    */

   var Tree = Grid.extend(/** @lends Controls/TreeGrid */{
      _viewName: TreeGridView,
      _viewTemplate: TreeControl,


      _getModelConstructor: function() {
         return TreeGridViewModel;
      },
      getOptionTypes: function() {
         return {
            keyProperty: entity.descriptor(String).required(),
            parentProperty: entity.descriptor(String).required()
         };
      },
      // todo removed or documented by task:
      // https://online.sbis.ru/opendoc.html?guid=24d045ac-851f-40ad-b2ba-ef7f6b0566ac
      toggleExpanded: function(id) {
         this._children.listControl.toggleExpanded(id);
      }
   });
   export = Tree;

