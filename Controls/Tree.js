define('Controls/Tree', [
   'Core/Control'

], function(Control
) {
   'use strict';

   var _private = {};

   /**
    * Компонент иерархического списка, отображаемого в виде дерева, с произвольным шаблоном отображения каждого элемента. Обладает возможностью загрузки/подгрузки данных из источника.
    * @class Controls/Tree
    * @extends Controls/Control
    * @mixes Controls/interface/ISource
    * @mixes Controls/interface/ISingleSelectable
    * @mixes Controls/interface/IPromisedSelectable
    * @mixes Controls/interface/IGroupedView
    * @mixes Controls/interface/INavigation
    * @mixes Controls/interface/IFilter
    * @mixes Controls/interface/IHighlighter
    * @mixes Controls/List/interface/IListControl
    * @mixes Controls/List/interface/IHierarchy
    * @mixes Controls/List/interface/ITreeControl
    * @control
    * @public
    * @category List
    */

   var TreeControl = Control.extend({

   });
   return TreeControl;
});
