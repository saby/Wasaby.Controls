define('Controls/List/ListControl', ['Controls/_lists/ListControl'], function(Control) {
/**
 * Plain list control with custom item template. Can load data from data source.
 *
 * @class Controls/list:View
 * @extends Controls/List/BaseControl
 * @mixes Controls/interface/ISource
 * @mixes Controls/interface/IItemTemplate
 * @mixes Controls/interface/IPromisedSelectable
 * @mixes Controls/interface/IGrouped
 * @mixes Controls/interface/INavigation
 * @mixes Controls/interface/IFilter
 * @mixes Controls/interface/IHighlighter
 * @mixes Controls/List/interface/IList
 * @mixes Controls/interface/IEditableList
 * @control
 * @public
 * @author Авраменко А.С.
 * @category List
 */
   /** @lends Controls/List/ListControl.prototype */
   return Control;
});
