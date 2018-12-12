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

   var DRAG_MAX_OFFSET = 15;

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
      toggleExpanded: function(self, dispItem) {
         var
            filter = cClone(self._options.filter),
            listViewModel = self._children.baseControl.getViewModel(),
            item = dispItem.getContents(),
            nodeKey = item.getId(),
            expanded = !listViewModel.isExpanded(dispItem);
         self._notify(expanded ? 'itemExpand' : 'itemCollapse', [item]);
         if (!_private.isExpandAll(self._options.expandedItems) && !self._nodesSourceControllers[nodeKey] && !dispItem.isRoot()) {
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
      },
      isExpandAll: function(expandedItems) {
         return expandedItems instanceof Array && expandedItems[0] === null;
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
         if (typeof cfg.root !== 'undefined') {
            this._root = cfg.root;
         }
         return TreeControl.superclass.constructor.apply(this, arguments);
      },
      _afterMount: function() {
         // https://online.sbis.ru/opendoc.html?guid=d99190bc-e3e9-4d78-a674-38f6f4b0eeb0
         this._children.baseControl.getViewModel().subscribe('onNodeRemoved', this._onNodeRemovedFn);
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
            self._children.baseControl.getViewModel().resetExpandedItems();
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

         if (model.getDragItemData() && itemData.dispItem.isNode()) {
            this._nodeMouseMove(itemData, nativeEvent);
         }
      },

      _nodeMouseMove: function(itemData, event) {
         var
            position,
            topOffset,
            bottomOffset,
            dragTargetRect,
            dragTargetPosition,
            model = this._children.baseControl.getViewModel(),
            dragTarget = event.target.closest('.js-controls-TreeView__dragTargetNode');

         if (dragTarget) {
            dragTargetRect = dragTarget.getBoundingClientRect();
            topOffset = event.nativeEvent.pageY - dragTargetRect.top;
            bottomOffset = dragTargetRect.top + dragTargetRect.height - event.nativeEvent.pageY;

            if (topOffset < DRAG_MAX_OFFSET || bottomOffset < DRAG_MAX_OFFSET) {
               position = topOffset < DRAG_MAX_OFFSET ? 'before' : 'after';
               dragTargetPosition = model.calculateDragTargetPosition(itemData, position);

               if (dragTargetPosition && this._notify('changeDragTarget', [model.getDragEntity(), dragTargetPosition.item, dragTargetPosition.position]) !== false) {
                  model.setDragTargetPosition(dragTargetPosition);
               }
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
