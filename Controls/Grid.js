define('Controls/Grid', [
   'Controls/List',
   'Controls/List/Grid/GridViewModel',
   'Controls/List/Grid/GridView',
   'Controls/List/BaseControl'
], function(List, GridViewModel) {

   'use strict';

   /**
    * Table-looking list. Can load data from data source.
    *
    * @class Controls/Grid
    * @extends Controls/List
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

   var
      Grid = List.extend({
         _viewName: 'Controls/List/Grid/GridView',
         _viewTemplate: 'Controls/List/ListControl',
         _getModelConstructor: function() {
            return GridViewModel;
         }
      });

   return Grid;
});
