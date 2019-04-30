define('Controls/List/List', ['Controls/_list/List'], function(Control) {
/**
 * Created by kraynovdo on 31.01.2018.
 */
   /**
 * Plain list with custom item template. Can load data from data source.
 *
 * @class Controls/list:View
 * @extends Core/Control
 * @mixes Controls/interface/ISource
 * @mixes Controls/interface/IItemTemplate
 * @mixes Controls/interface/IPromisedSelectable
 * @mixes Controls/interface/IGrouped
 * @mixes Controls/interface/INavigation
 * @mixes Controls/interface/IFilter
 * @mixes Controls/interface/IHighlighter
 * @mixes Controls/_list/interface/IList
 * @mixes Controls/interface/IEditableList
 * @mixes Controls/_list/interface/IDraggable
 *
 * @mixes Controls/_list/BaseControlStyles
 * @mixes Controls/_list/ListStyles
 * @mixes Controls/_list/ItemActions/ItemActionsStyles
 *
 * @mixes Controls/_MoveDialog/Styles
 * @mixes Controls/_paging/PagingStyles
 * @mixes Controls/_list/DigitButtonsStyles
 *
 * @control
 * @author Авраменко А.С.
 * @public
 * @category List
 * @demo Controls-demo/List/List/BasePG
 */
   /** @lends Controls/list:View.prototype */
   return Control;
});
