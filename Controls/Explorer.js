define('Controls/Explorer', [
   'Core/Control'

], function(Control
) {
   'use strict';

   var _private = {};

   /**
    * Компонент иерархического списка, с возможностью распахивания, а так же проваливания в узлы. Обладает возможностью загрузки/подгрузки данных из источника.
    * @class Controls/Explorer
    * @extends Controls/Control
    * @mixes Controls/interface/ISource
    * @mixes Controls/interface/IPromisedSelectable
    * @mixes Controls/interface/IGroupedView
    * @mixes Controls/interface/INavigation
    * @mixes Controls/interface/IFilter
    * @mixes Controls/interface/IHighlighter
    * @mixes Controls/List/interface/IListControl
    * @mixes Controls/List/interface/IHierarchy
    * @mixes Controls/List/interface/ITreeControl
    * @mixes Controls/List/interface/IExplorer
    * @control
    * @public
    * @category List
    */

   var Explorer = Control.extend({

   });
   return Explorer;
});
