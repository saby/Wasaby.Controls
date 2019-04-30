define('Controls/List/TreeControl', ['Controls/_treeGrid/TreeControl'], function(Control) {
   /**
    * Hierarchical list control with custom item template. Can load data from data source.
    *
    * @class Controls/treeGrid:TreeControl
    * @mixes Controls/interface/IEditableList
    * @mixes Controls/List/TreeGridView/Styles
    * @extends Controls/list:ListControl
    * @control
    * @private
    * @category List
    */
   return Control;
});
