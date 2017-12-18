define('js!Controls/List/Explorer', [
   'Core/Control'

], function (Control
) {
   'use strict';

   var _private = {};

   /**
    * Компонент иерархичесего списка, с возможностью распахивания, а так же проваливания в узлы. Обладает возможностью загрузки/подгрузки данных из источника.
    * @class Controls/List/Explorer
    * @extends Controls/Control
    * @mixes Controls/interface/IItems
    * @mixes Controls/interface/IConnection
    * @mixes Controls/interface/ISingleSelectable
    * @mixes Controls/interface/IPromisedSelectable
    * @mixes Controls/interface/IGroupedView
    * @mixes Controls/interface/INavigation
    * @mixes Controls/interface/IFilter
    * @mixes Controls/interface/IHighlighter
    * @mixes Controls/List/interface/IHierarchy
    * @mixes Controls/List/interface/ITreeControl
    * @mixes Controls/List/interface/IExplorer
    * @control
    * @public
    * @category List
    */

   var Explorer = Control.extend({
      _controlName: 'Controls/List/Explorer'

   });
   return Explorer;
});