define('Controls/TreeGrid', [
   'Controls/Grid',
   'Controls/List/TreeGrid/TreeGridViewModel',
   'Core/core-merge',
   'Controls/List/TreeGrid/TreeGridView',
   'css!Controls/List/TreeGrid/TreeGrid',
   'Controls/List/TreeControl'
], function(Grid, TreeGridViewModel, cMerge) {
   'use strict';

   var _private = {
      prepareModelConfig: function(cfg) {
         return {
            parentProperty: cfg.parentProperty,
            nodeProperty: cfg.nodeProperty
         };
      },
      prepareViewConfig: function(cfg) {
         return {
            parentProperty: cfg.parentProperty,
            nodeProperty: cfg.nodeProperty
         };
      }
   };

   /**
    * Hierarchical list with custom item template. Can load data from data source.
    *
    * @class Controls/TreeGrid
    * @extends Controls/Grid
    * @mixes Controls/interface/ISource
    * @mixes Controls/interface/ISingleSelectable
    * @mixes Controls/interface/IPromisedSelectable
    * @mixes Controls/interface/IGroupedView
    * @mixes Controls/interface/INavigation
    * @mixes Controls/interface/IFilter
    * @mixes Controls/interface/IHighlighter
    * @mixes Controls/List/interface/IListControl
    * @mixes Controls/List/interface/IHierarchy
    * @mixes Controls/List/interface/ITreeControl
    * @control
    * @public
    * @category List
    */

   var Tree = Grid.extend({
      _viewName: 'Controls/List/TreeGrid/TreeGridView',
      _viewTemplate: 'Controls/List/TreeControl',
      _getModelConstructor: function() {
         return TreeGridViewModel;
      },
      _prepareModelConfig: function(cfg) {
         return cMerge(Tree.superclass._prepareModelConfig(cfg), _private.prepareModelConfig(cfg));
      },
      _prepareViewConfig: function(cfg) {
         return cMerge(Tree.superclass._prepareViewConfig(cfg), _private.prepareViewConfig(cfg));
      }
   });
   return Tree;
});
