define('Controls/Grid', [
   'Controls/List',
   'Controls/List/Grid/GridViewModel',
   'Core/core-merge',
   'Controls/List/Grid/GridView',
   'Controls/List/BaseControl'
], function(List, GridViewModel, cMerge) {

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
      _private = {
         prepareModelConfig: function(cfg) {
            return {
               columns: cfg.columns,
               header: cfg.header,
               results: cfg.results,
               showRowSeparator: cfg.showRowSeparator,
               multiselect: cfg.multiselect,
               rowSpacing: cfg.rowSpacing,
               leftPadding: cfg.leftPadding,
               rightPadding: cfg.rightPadding,
               stickyFields: cfg.stickyFields
            };
         },
         prepareViewConfig: function(cfg) {
            return {
               columns: cfg.columns,
               header: cfg.header,
               results: cfg.results,
               showRowSeparator: cfg.showRowSeparator,
               rowSpacing: cfg.rowSpacing,
               leftPadding: cfg.leftPadding,
               rightPadding: cfg.rightPadding,
               stickyFields: cfg.stickyFields
            };
         }
      },
      Grid = List.extend({
         _viewConfig: null,
         _viewName: 'Controls/List/Grid/GridView',
         _viewTemplate: 'Controls/List/ListControl',
         _getModelConstructor: function() {
            return GridViewModel;
         },
         _prepareModelConfig: function(cfg) {
            return cMerge(Grid.superclass._prepareModelConfig(cfg), _private.prepareModelConfig(cfg));
         },
         _prepareViewConfig: function(cfg) {
            return cMerge(Grid.superclass._prepareViewConfig(cfg), _private.prepareViewConfig(cfg));
         }
      });

   return Grid;
});
