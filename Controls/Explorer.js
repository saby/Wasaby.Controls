define('Controls/Explorer', [
   'Core/Control',
   'wml!Controls/Explorer/Explorer',
   'Controls/List/SearchView/SearchGridViewModel',
   'Controls/List/TreeGridView/TreeGridViewModel',
   'Controls/List/TreeTileView/TreeTileViewModel',
   'Controls/Utils/tmplNotify',
   'WS.Data/Chain',
   'Controls/List/TreeTileView/TreeTileView',
   'Controls/List/TreeGridView/TreeGridView',
   'Controls/List/SearchView',
   'Controls/List/TreeControl',
   'WS.Data/Entity/VersionableMixin',
   'Controls/TreeGrid',
   'Controls/BreadCrumbs/Path'
], function(
   Control,
   template,
   SearchGridViewModel,
   TreeGridViewModel,
   TreeTileViewModel,
   tmplNotify,
   chain
) {
   'use strict';

   var
      ITEM_TYPES = {
         node: true,
         hiddenNode: false,
         leaf: null
      },
      DEFAULT_VIEW_MODE = 'table',
      VIEW_NAMES = {
         search: 'Controls/List/SearchView',
         tile: 'Controls/List/TreeTileView/TreeTileView',
         table: 'Controls/List/TreeGridView/TreeGridView'
      },
      VIEW_MODEL_CONSTRUCTORS = {
         search: SearchGridViewModel,
         tile: TreeTileViewModel,
         table: TreeGridViewModel
      },
      _private = {
         setRoot: function(self, root) {
            self._root = root;
            self._notify('itemOpen', root);
            if (typeof self._options.itemOpenHandler === 'function') {
               self._options.itemOpenHandler(root);
            }
         },
         dataLoadCallback: function(self, data) {
            var metaData = data.getMetaData();
            if (metaData.path) {
               self._breadCrumbsItems = chain(metaData.path).toArray();
            } else {
               self._breadCrumbsItems = null;
            }
            self._forceUpdate();
            if (self._options.dataLoadCallback) {
               self._options.dataLoadCallback(data);
            }
         },
         setViewMode: function(self, viewMode) {
            if (viewMode === 'search') {
               self._root = typeof self._options.root !== 'undefined' ? self._options.root : null;
            }
            self._viewMode = viewMode;
            self._swipeViewMode = viewMode === 'search' ? 'list' : viewMode;
            self._viewName = VIEW_NAMES[viewMode];
            self._viewModelConstructor = VIEW_MODEL_CONSTRUCTORS[viewMode];
            self._leftPadding = viewMode === 'search' ? 'search' : undefined;
         }
      };

   /**
    * Hierarchical list that can expand and go inside the folders. Can load data from data source.
    *
    * @class Controls/Explorer
    * @extends Core/Control
    * @mixes Controls/interface/ISource
    * @mixes Controls/interface/IItemTemplate
    * @mixes Controls/interface/IPromisedSelectable
    * @mixes Controls/interface/IEditableList
    * @mixes Controls/interface/IGroupedView
    * @mixes Controls/interface/INavigation
    * @mixes Controls/interface/IFilter
    * @mixes Controls/interface/IHighlighter
    * @mixes Controls/List/interface/IListControl
    * @mixes Controls/List/interface/IHierarchy
    * @mixes Controls/List/interface/ITreeControl
    * @mixes Controls/List/interface/IExplorer
    * @control
    * @public
    * @category List
    * @author Авраменко А.С.
    */

   var Explorer = Control.extend({
      _template: template,
      _breadCrumbsItems: null,
      _root: null,
      _viewName: null,
      _viewMode: null,
      _viewModelConstructor: null,
      _leftPadding: null,
      constructor: function() {
         this._dataLoadCallback = _private.dataLoadCallback.bind(null, this);
         Explorer.superclass.constructor.apply(this, arguments);
      },
      _beforeMount: function(cfg) {
         _private.setViewMode(this, cfg.viewMode);
         Explorer.superclass._beforeMount.apply(this, arguments);
      },
      _beforeUpdate: function(cfg) {
         Explorer.superclass._beforeUpdate.apply(this, arguments);
         if (this._viewMode !== cfg.viewMode) {
            _private.setViewMode(this, cfg.viewMode);
         }
      },
      _onItemClick: function(event, item) {
         if (item.get(this._options.nodeProperty) === ITEM_TYPES.node) {
            _private.setRoot(this, item.getId());
         }
      },
      _onBreadCrumbsClick: function(event, item, setPreviousNode) {
         _private.setRoot(this, item.get(setPreviousNode ? this._options.parentProperty : this._options.keyProperty));
      },
      beginEdit: function(options) {
         return this._children.treeControl.beginEdit(options);
      },
      beginAdd: function(options) {
         return this._children.treeControl.beginAdd(options);
      },
      cancelEdit: function() {
         return this._children.treeControl.cancelEdit();
      },
      commitEdit: function() {
         return this._children.treeControl.commitEdit();
      },
      _notifyHandler: tmplNotify
   });

   Explorer._private = _private;
   Explorer._constants = {
      DEFAULT_VIEW_MODE: DEFAULT_VIEW_MODE,
      ITEM_TYPES: ITEM_TYPES,
      VIEW_NAMES: VIEW_NAMES,
      VIEW_MODEL_CONSTRUCTORS: VIEW_MODEL_CONSTRUCTORS
   };

   Explorer.getDefaultOptions = function() {
      return {
         multiSelectVisibility: 'hidden',
         viewMode: DEFAULT_VIEW_MODE
      };
   };

   return Explorer;
});
