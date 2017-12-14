define('js!Controls/List/HierarchyControl', [
   'Core/Control'

], function (Control
) {
   'use strict';

   var _private = {};

   /**
    * Tree Control
    * @class Controls/List/HierarchyControl
    * @extends Controls/Control
    * @mixes Controls/interface/IItems
    * @mixes Controls/interface/IDataSource
    * @mixes Controls/interface/ISingleSelectable
    * @mixes Controls/interface/IPromisedSelectable
    * @mixes Controls/interface/IGroupedView
    * @mixes Controls/interface/INavigation
    * @mixes Controls/interface/IFilter
    * @mixes Controls/interface/IHighlighter
    * @mixes Controls/List/interface/ITreeControl
    * @mixes Controls/List/interface/IHierarchyControl
    * @control
    * @public
    * @category List
    */

   var HierarchyControl = Control.extend({
      _controlName: 'Controls/List/HierarchyControl'

   });
   return HierarchyControl;
});