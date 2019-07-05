import Control = require('Core/Control');
import template = require('wml!Controls/_explorer/View/View');
import {SearchGridViewModel, ViewModel as TreeGridViewModel, TreeGridView, SearchView} from 'Controls/treeGrid';
import {TreeViewModel as TreeTileViewModel, TreeView as TreeTileView} from 'Controls/tile';
import tmplNotify = require('Controls/Utils/tmplNotify');
import applyHighlighter = require('Controls/Utils/applyHighlighter');
import {factory} from 'Types/chain';
import cInstance = require('Core/core-instance');
import {constants} from 'Env/Env';
import keysHandler = require('Controls/Utils/keysHandler');
import 'css!theme?Controls/explorer';
import 'Types/entity';
import 'Controls/breadcrumbs';


   var
      HOT_KEYS = {
         backByPath: constants.key.backspace
      };

   var
      ITEM_TYPES = {
         node: true,
         hiddenNode: false,
         leaf: null
      },
      DEFAULT_VIEW_MODE = 'table',
      VIEW_NAMES = {
         search: SearchView,
         tile: TreeTileView,
         table: TreeGridView
      },
      VIEW_MODEL_CONSTRUCTORS = {
         search: SearchGridViewModel,
         tile: TreeTileViewModel,
         table: TreeGridViewModel
      },
      _private = {
         setRoot: function(self, root) {
            if (!self._options.hasOwnProperty('root')) {
               self._root = root;
            }
            self._notify('rootChanged', [root]);
            if (typeof self._options.itemOpenHandler === 'function') {
               self._options.itemOpenHandler(root);
            }
            self._forceUpdate();
         },
          setRestoredKeyObject: function(self, root) {
              self._restoredMarkedKeys[root] = {
                  parent: self._root,
                  markedKey: null,
              }
              if (self._restoredMarkedKeys[self._root]) {
                  self._restoredMarkedKeys[self._root].markedKey = root;
              }
              self._root = root;
          },
          cleanRestoredKeyObject: function(self, root) {
              _private.pathCleaner(self, root)
              self._root = root;
          },
         pathCleaner: function(self, root) {
            if (self._restoredMarkedKeys[root]) {
               if (self._restoredMarkedKeys[root].parent === undefined) {
                  const markedKey = self._restoredMarkedKeys[root].markedKey
                  self._restoredMarkedKeys = {
                     [root]: {
                        markedKey: markedKey
                     }
                  }
                  return;
               } else {
                  _remover(root);
               }
            } else if (root !== self._root) {
                   delete self._restoredMarkedKeys[self._root];
            }

            function _remover(key) {
               Object.keys(self._restoredMarkedKeys).forEach((cur) => {
                  if (self._restoredMarkedKeys[cur] && self._restoredMarkedKeys[cur].parent == String(key)) {
                     const nextKey = cur;
                     delete self._restoredMarkedKeys[cur];
                     _remover(nextKey);
                  }
               });
            };
         },
         getRoot: function(self) {
            return self._options.hasOwnProperty('root') ? self._options.root : self._root;
         },

         getPath: function(data) {
            let path = data.getMetaData().path;
            let breadCrumbs;

            if (path && path.getCount() > 0) {
               breadCrumbs = factory(path).toArray();
            } else {
               breadCrumbs = null;
            }

            return breadCrumbs;
         },
         dataLoadCallback: function(self, data) {
             self._breadCrumbsItems = _private.getPath(data);
             if (self._isGoingBack) {
                 if (self._restoredMarkedKeys[self._root]) {
                     self._children.treeControl.setMarkedKey(self._restoredMarkedKeys[self._root].markedKey);
                 }
                 self._isGoingBack = false;
             }
             self._forceUpdate();
             if (self._options.dataLoadCallback) {
                self._options.dataLoadCallback(data);
             }
         },
         itemsReadyCallback: function(self, items) {
            self._items = items;

            if (self._options.itemsReadyCallback) {
               self._options.itemsReadyCallback(items);
            }
         },
         setVirtualScrolling(self, viewMode, cfg): void {
            // todo https://online.sbis.ru/opendoc.html?guid=7274717e-838d-46c4-b991-0bec75bd0162
            // For viewMode === 'tile' disable virtualScrolling.
            self._virtualScrolling = viewMode === 'tile' ? false : cfg.virtualScrolling;
         },
         setViewMode: function(self, viewMode, cfg) {
            var currentRoot = _private.getRoot(self);
            var dataRoot = _private.getDataRoot(self);

            if (viewMode === 'search' && cfg.searchStartingWith === 'root' && dataRoot !== currentRoot) {
               _private.setRoot(self, dataRoot);
            }
            self._viewMode = viewMode;
            self._viewName = VIEW_NAMES[viewMode];
            self._viewModelConstructor = VIEW_MODEL_CONSTRUCTORS[viewMode];
            _private.setVirtualScrolling(self, self._viewMode, cfg);
         },
         backByPath: function(self) {
            if (self._breadCrumbsItems && self._breadCrumbsItems.length > 0) {
               _private.setRoot(self, self._breadCrumbsItems[self._breadCrumbsItems.length - 1].get(self._options.parentProperty));
            }
         },
         getDataRoot: function(self) {
            var result;

            if (self._breadCrumbsItems && self._breadCrumbsItems.length > 0) {
               result = self._breadCrumbsItems[0].get(self._options.parentProperty);
            } else {
               result = _private.getRoot(self);
            }

            return result;
         },
         dragItemsFromRoot: function(self, dragItems) {
            var
               item,
               itemFromRoot = true,
               root = _private.getDataRoot(self);

            for (var i = 0; i < dragItems.length; i++) {
               item = self._items.getRecordById(dragItems[i]);
               if (!item || item.get(self._options.parentProperty) !== root) {
                  itemFromRoot = false;
                  break;
               }
            }

            return itemFromRoot;
         }
      };

   /**
    * Иерархический список, узел которого можно развернуть и перейти в него.
    * <a href="/materials/demo-ws4-explorer">Демо-пример</a>.
    * <a href="/materials/demo-ws4-explorer-with-search">Демо-пример с поиском</a>.
    * Подробное описание и инструкции по настройке контрола можно найти <a href='https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/tile/'>здесь</a>.
    *
    * @class Controls/_explorer/View
    * @extends Core/Control
    * @mixes Controls/_interface/ISource
    * @mixes Controls/interface/ITreeGridItemTemplate
    * @mixes Controls/interface/IItemTemplate
    * @mixes Controls/interface/IPromisedSelectable
    * @mixes Controls/interface/IEditableList
    * @mixes Controls/interface/IGrouped
    * @mixes Controls/interface/INavigation
    * @mixes Controls/interface/IFilter
    * @mixes Controls/interface/IHighlighter
    * @mixes Controls/_list/interface/IList
    * @mixes Controls/_interface/IHierarchy
    * @mixes Controls/_treeGrid/interface/ITreeControl
    * @mixes Controls/_explorer/interface/IExplorer
    * @mixes Controls/_tile/interface/IDraggable
    * @mixes Controls/_tile/interface/ITile
    * @mixes Controls/_list/interface/IVirtualScroll
    * @mixes Controls/interface/IGroupedGrid
    * @mixes Controls/_grid/interface/IGridControl
    * @control
    * @public
    * @category List
    * @author Авраменко А.С.
    */

   /*
    * Hierarchical list that can expand and go inside the folders. Can load data from data source.
    * <a href="/materials/demo-ws4-explorer">Demo example</a>.
    * <a href="/materials/demo-ws4-explorer-with-search">Demo example with search</a>.
    * The detailed description and instructions on how to configure the control you can read <a href='https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/tile/'>here</a>.
    *
    * @class Controls/_explorer/View
    * @extends Core/Control
    * @mixes Controls/_interface/ISource
    * @mixes Controls/interface/ITreeGridItemTemplate
    * @mixes Controls/interface/IItemTemplate
    * @mixes Controls/interface/IPromisedSelectable
    * @mixes Controls/interface/IEditableList
    * @mixes Controls/interface/IGrouped
    * @mixes Controls/interface/INavigation
    * @mixes Controls/interface/IFilter
    * @mixes Controls/interface/IHighlighter
    * @mixes Controls/_list/interface/IList
    * @mixes Controls/_interface/IHierarchy
    * @mixes Controls/_treeGrid/interface/ITreeControl
    * @mixes Controls/_explorer/interface/IExplorer
    * @mixes Controls/_tile/interface/IDraggable
    * @mixes Controls/_tile/interface/ITile
    * @mixes Controls/_list/interface/IVirtualScroll
    * @mixes Controls/interface/IGroupedGrid
    * @mixes Controls/_grid/interface/IGridControl
    * @control
    * @public
    * @category List
    * @author Авраменко А.С.
    */

   /**
    * @name Controls/_exploer/View#displayProperty
    * @cfg {string} Имя свойства элемента, содержимое которого будет отображаться.
    * @example
    * <pre class="brush:html">
    * <Controls.explorers:View
    *   ...
    *   displayProperty="title">
    *       ...
    * </Controls.explorer:View>
    * </pre>
    */

   /*
    * @name Controls/_exploer/View#displayProperty
    * @cfg {string} sets the property to be displayed in search results
    * @example
    * <pre class="brush:html">
    * <Controls.explorers:View
    *   ...
    *   displayProperty="title">
    *       ...
    * </Controls.explorer:View>
    * </pre>
    */

   var Explorer = Control.extend({
      _template: template,
      _breadCrumbsItems: null,
      _root: null,
      _viewName: null,
      _viewMode: null,
      _viewModelConstructor: null,
      _dragOnBreadCrumbs: false,
      _hoveredBreadCrumb: undefined,
      _virtualScrolling: false,

      _beforeMount: function(cfg) {
         this._dataLoadCallback = _private.dataLoadCallback.bind(null, this);
         this._itemsReadyCallback = _private.itemsReadyCallback.bind(null, this);
         this._breadCrumbsDragHighlighter = this._dragHighlighter.bind(this);

         //process items from options to create a path
         //will be refactor after new scheme of a data receiving
         if (cfg.items) {
            this._breadCrumbsItems = _private.getPath(cfg.items);
         }

         _private.setViewMode(this, cfg.viewMode, cfg);
         const root = _private.getRoot(this);
         this._restoredMarkedKeys = {
         [root]: {
               markedKey: null
            }
         };
      },
      _beforeUpdate: function(cfg) {
         if (this._viewMode !== cfg.viewMode) {
            _private.setViewMode(this, cfg.viewMode, cfg);
            this._children.treeControl.resetExpandedItems();
         }
         if (cfg.virtualScrolling !== this._options.virtualScrolling) {
            _private.setVirtualScrolling(this, this._viewMode, cfg);
         }
      },
      _getRoot: function() {
         return _private.getRoot(this);
      },
      _dragHighlighter: function(itemKey, hasArrow) {
         return this._dragOnBreadCrumbs && this._hoveredBreadCrumb === itemKey
            ? 'controls-BreadCrumbsView__dropTarget_' + (hasArrow ? 'withArrow' : 'withoutArrow') : '';
      },
      _documentDragEnd: function(event, dragObject) {
         if (this._hoveredBreadCrumb !== undefined) {
            this._notify('dragEnd', [dragObject.entity, this._hoveredBreadCrumb, 'on']);
         }
         this._dragOnBreadCrumbs = false;
      },
      _documentDragStart: function(event, dragObject) {
         //TODO: Sometimes at the end of dnd, the parameter is not reset. Will be fixed by: https://online.sbis.ru/opendoc.html?guid=85cea965-2aa6-4f1b-b2a3-1f0d65477687
         this._hoveredBreadCrumb = undefined;

         if (this._options.itemsDragNDrop && this._options.parentProperty && cInstance.instanceOfModule(dragObject.entity, 'Controls/dragnDrop:ItemsEntity')) {

            //No need to show breadcrumbs when dragging items from the root, being in the root of the registry.
            this._dragOnBreadCrumbs = _private.getRoot(this) !== _private.getDataRoot(this) || !_private.dragItemsFromRoot(this, dragObject.entity.getItems());
         }
      },
      _hoveredCrumbChanged: function(event, item) {
         this._hoveredBreadCrumb = item ? item.getId() : undefined;

         // If you change hovered bread crumb, must be called installed in the breadcrumbs highlighter,
         // but is not called, because the template has no reactive properties.
         this._forceUpdate();
      },
      _onItemClick: function(event, item, clickEvent): void {
         const res = this._notify('itemClick', [item, clickEvent]);
         if (res !== false) {
            if (item.get(this._options.nodeProperty) === ITEM_TYPES.node) {
                _private.setRestoredKeyObject(this, item.getId());
                _private.setRoot(this, item.getId());
            }
         }
         event.stopPropagation();
      },
      _onBreadCrumbsClick: function(event, item) {
          _private.cleanRestoredKeyObject(this, item.getId());
          _private.setRoot(this, item.getId());
          this._isGoingBack = true;
      },
      _onExplorerKeyDown: function(event) {
         keysHandler(event, HOT_KEYS, _private, this);
      },
      reloadItem: function() {
         let treeControl = this._children.treeControl;
         return treeControl.reloadItem.apply(treeControl, arguments);
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
      reload: function() {
         return this._children.treeControl.reload();
      },
      // todo removed or documented by task:
      // https://online.sbis.ru/opendoc.html?guid=24d045ac-851f-40ad-b2ba-ef7f6b0566ac
      toggleExpanded: function(id) {
         this._children.treeControl.toggleExpanded(id);
      },
      _notifyHandler: tmplNotify,
      _applyHighlighter: applyHighlighter
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
         viewMode: DEFAULT_VIEW_MODE,
         backButtonStyle: 'secondary',
         stickyHeader: true,
         searchStartingWith: 'root'
      };
   };

   export = Explorer;

