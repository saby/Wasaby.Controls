define('js!Controls/List/GridControl', [
   'Core/Control'
], function (Control) {

   /**
    * Табличное представление данных
    *
    * @class Controls/List/GridControl
    * @extends Controls/Control
    * @mixes Controls/interface/IItems
    * @mixes Controls/interface/IDataSource
    * @mixes Controls/interface/ISingleSelectable
    * @mixes Controls/interface/IPromisedSelectable
    * @mixes Controls/interface/IGroupedView
    * @mixes Controls/interface/INavigation
    * @mixes Controls/interface/IFilter
    * @mixes Controls/interface/IHighlighter
    * @mixes Controls/List/interface/IListControl
    * @mixes Controls/List/interface/IGridControl
    * @control
    * @public
    * @category List
    */

   var GridControl = Control.extend({});

   return GridControl;
});