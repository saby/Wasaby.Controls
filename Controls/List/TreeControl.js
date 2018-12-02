define('Controls/List/TreeControl', [
   'Core/Control',
   'wml!Controls/List/TreeControl/TreeControl',
   'Controls/Controllers/SourceController',
   'Core/core-clone',
   'Core/Deferred'
], function(
   Control,
   TreeControlTpl,
   SourceController,
   cClone,
   Deferred
) {
   'use strict';

   var DRAG_MAX_OFFSET = 10;

   var _private = {
      clearSourceControllers: function(self) {
         for (var prop in self._nodesSourceControllers) {
            if (self._nodesSourceControllers.hasOwnProperty(prop)) {
               self._nodesSourceControllers[prop].destroy();
               delete self._nodesSourceControllers[prop];
            }
         }
      },
      toggleExpandedOnModel: function(self, listViewModel, dispItem, expanded) {
         listViewModel.toggleExpanded(dispItem);
         self._notify(expanded ? 'itemExpanded' : 'itemCollapsed', [dispItem.getContents()]);
      },
      prepareExpandedItems: function(nodeProperty, viewModel) {
         var
            expandedItems = [],
            items = viewModel.getItems();
         if (items) {
            items.each(function(item) {
               if (item.get(nodeProperty) === true && viewModel.hasChildItem(item.getId())) {
                  expandedItems.push(item.getId());
               }
            });
         }
         return expandedItems;
      },
      toggleExpanded: function(self, dispItem) {
         var
            filter = cClone(self._options.filter),
            listViewModel = self._children.baseControl.getViewModel(),
            item = dispItem.getContents(),
            nodeKey = item.getId(),
            expanded = !listViewModel.isExpanded(dispItem);
         self._notify(expanded ? 'itemExpand' : 'itemCollapse', [item]);
         if (!self._options.expandAll && !self._nodesSourceControllers[nodeKey] && !dispItem.isRoot()) {
            self._nodesSourceControllers[nodeKey] = new SourceController({
               source: self._options.source,
               navigation: self._options.navigation
            });

            filter[self._options.parentProperty] = nodeKey;
            self._nodesSourceControllers[nodeKey].load(filter, self._sorting).addCallback(function(list) {
               listViewModel.setHasMoreStorage(_private.prepareHasMoreStorage(self._nodesSourceControllers));
               if (self._options.uniqueKeys) {
                  listViewModel.mergeItems(list);
               } else {
                  listViewModel.appendItems(list);
               }
               _private.toggleExpandedOnModel(self, listViewModel, dispItem, expanded);
            });
         } else {
            _private.toggleExpandedOnModel(self, listViewModel, dispItem, expanded);
         }
      },
      prepareHasMoreStorage: function(sourceControllers) {
         var
            hasMore = {};
         for (var i in sourceControllers) {
            if (sourceControllers.hasOwnProperty(i)) {
               hasMore[i] = sourceControllers[i].hasMoreData('down');
            }
         }
         return hasMore;
      },
      loadMore: function(self, dispItem) {
         var
            filter = cClone(self._options.filter),
            listViewModel = self._children.baseControl.getViewModel(),
            nodeKey = dispItem.getContents().getId();
         filter[self._options.parentProperty] = nodeKey;
         self._nodesSourceControllers[nodeKey].load(filter, self._sorting, 'down').addCallback(function(list) {
            listViewModel.setHasMoreStorage(_private.prepareHasMoreStorage(self._nodesSourceControllers));
            if (self._options.uniqueKeys) {
               listViewModel.mergeItems(list);
            } else {
               listViewModel.appendItems(list);
            }
         });
      },
      onNodeRemoved: function(self, nodeId) {
         if (self._nodesSourceControllers[nodeId]) {
            self._nodesSourceControllers[nodeId].destroy();
         }
         delete self._nodesSourceControllers[nodeId];
      }
   };

   /**
    * Hierarchical list control with custom item template. Can load data from data source.
    *
    * @class Controls/List/TreeControl
    * @mixes Controls/interface/IEditableList
    * @extends Controls/List/ListControl
    * @control
    * @public
    * @category List
    */

   var TreeControl = Control.extend(/** @lends Controls/List/TreeControl.prototype */{
      _onNodeRemovedFn: null,
      _template: TreeControlTpl,
      _root: null,
      _updatedRoot: false,
      _nodesSourceControllers: null,
      constructor: function(cfg) {
         this._nodesSourceControllers = {};
         this._onNodeRemovedFn = this._onNodeRemoved.bind(this);
         this._viewModelReadyCallbackFn = this._viewModelReadyCallback.bind(this);
         if (typeof cfg.root !== 'undefined') {
            this._root = cfg.root;
         }
         return TreeControl.superclass.constructor.apply(this, arguments);
      },
      _viewModelReadyCallback: function(viewModel) {
         var expandedItems;
         viewModel.subscribe('onNodeRemoved', this._onNodeRemovedFn);
         if (this._options.expandAll) {
            expandedItems = _private.prepareExpandedItems(this._options.nodeProperty, viewModel);
         } else {
            expandedItems = this._options.expandedItems;
         }
         viewModel.setExpandedItems(expandedItems);
      },
      _dataLoadCallback: function() {
         if (this._options.dataLoadCallback) {
            this._options.dataLoadCallback.apply(null, arguments);
         }
      },
      _onNodeRemoved: function(event, nodeId) {
         _private.onNodeRemoved(this, nodeId);
      },
      _beforeUpdate: function(newOptions) {
         TreeControl.superclass._beforeUpdate.apply(this, arguments);
         if (typeof newOptions.root !== 'undefined' && this._root !== newOptions.root) {
            this._root = newOptions.root;
            this._updatedRoot = true;
         }
         if (newOptions.expandedItems !== this._options.expandedItems) {

            // https://online.sbis.ru/opendoc.html?guid=d99190bc-e3e9-4d78-a674-38f6f4b0eeb0
            this._children.baseControl.getViewModel().setExpandedItems(newOptions.expandedItems);
         }
      },
      _afterUpdate: function(oldOptions) {
         var
            filter;
         TreeControl.superclass._afterUpdate.apply(this, arguments);
         if (this._updatedRoot) {
            this._updatedRoot = false;
            filter = cClone(this._options.filter || {});
            filter[this._options.parentProperty] = this._root;
            this.reload(filter);
            this._children.baseControl.getViewModel().setRoot(this._root);
         }
      },
      toggleExpanded: function(key) {
         var
            item = this._children.baseControl.getViewModel().getItemById(key, this._options.keyProperty);
         _private.toggleExpanded(this, item);
      },
      _onExpanderClick: function(e, dispItem) {
         _private.toggleExpanded(this, dispItem);
         e.stopImmediatePropagation();
      },
      _onLoadMoreClick: function(e, dispItem) {
         _private.loadMore(this, dispItem);
      },
      reload: function(filter) {
         var
            self = this,
            result;
         _private.clearSourceControllers(this);
         result = this._children.baseControl.reload(filter);
         result.addCallback(function() {
            // https://online.sbis.ru/opendoc.html?guid=d99190bc-e3e9-4d78-a674-38f6f4b0eeb0
            var
               viewModel = self._children.baseControl.getViewModel(),
               newExpandedItems = [];
            if (self._options.expandAll) {
               newExpandedItems = _private.prepareExpandedItems(self._options.nodeProperty, viewModel);
            }
            viewModel.setExpandedItems(newExpandedItems);
         });
         return result;
      },
      beginEdit: function(options) {
         return this._options.readOnly ? Deferred.fail() : this._children.baseControl.beginEdit(options);
      },
      beginAdd: function(options) {
         return this._options.readOnly ? Deferred.fail() : this._children.baseControl.beginAdd(options);
      },

      cancelEdit: function() {
         return this._options.readOnly ? Deferred.fail() : this._children.baseControl.cancelEdit();
      },

      commitEdit: function() {
         return this._options.readOnly ? Deferred.fail() : this._children.baseControl.commitEdit();
      },

      _markedKeyChangedHandler: function(event, key) {
         this._notify('markedKeyChanged', [key]);
      },

      _itemMouseMove: function(event, itemData, nativeEvent) {
         var model = this._children.baseControl.getViewModel();

         if (model.getDragTargetItem() && itemData.dispItem.isNode()) {
            this._setDragPositionOnNode(itemData, nativeEvent);
         }
      },

      _setDragPositionOnNode: function(itemData, event) {
         var
            topOffset,
            bottomOffset,
            dragTargetRect,
            model = this._children.baseControl.getViewModel(),
            dragTarget = event.target.closest('.js-controls-TreeView__dragTargetNode');

         if (dragTarget) {
            dragTargetRect = dragTarget.getBoundingClientRect();
            topOffset = event.nativeEvent.pageY - dragTargetRect.top;
            bottomOffset = dragTargetRect.top + dragTargetRect.height - event.nativeEvent.pageY;

            if (topOffset < DRAG_MAX_OFFSET || bottomOffset < DRAG_MAX_OFFSET) {
               model.setDragPositionOnNode(itemData, topOffset < DRAG_MAX_OFFSET ? 'before' : 'after');
            }
         }
      },

      _beforeUnmount: function() {
         _private.clearSourceControllers(this);
         TreeControl.superclass._beforeUnmount.apply(this, arguments);
      }
   });

   TreeControl.getDefaultOptions = function() {
      return {
         uniqueKeys: true,
         filter: {}
      };
   };

   TreeControl._private = _private;

   return TreeControl;
});
