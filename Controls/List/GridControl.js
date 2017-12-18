define('js!Controls/List/GridControl', [
   'Core/Control'
], function (Control) {

   /**
    * Компонент плоского списка, отображаемого в виде таблицы. Обладает возможностью загрузки/подгрузки данных из источника.
    *
    * @class Controls/List/GridControl
    * @extends Controls/Control
    * @mixes Controls/interface/ISource
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