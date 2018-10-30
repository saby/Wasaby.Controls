define('Controls/List/TreeControl', [
   'Core/Control',
   'wml!Controls/List/TreeControl/TreeControl',
   'Controls/Controllers/SourceController',
   'Core/core-clone',
   'WS.Data/Relation/Hierarchy',
   'Controls/Utils/ArraySimpleValuesUtil',
   'Core/Deferred'
], function(
   Control,
   TreeControlTpl,
   SourceController,
   cClone,
   HierarchyRelation,
   ArraySimpleValuesUtil,
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
      toggleExpanded: function(self, dispItem) {
         var
            filter = cClone(self._options.filter),
            listViewModel = self._children.baseControl.getViewModel(),
            nodeKey = dispItem.getContents().getId();
         if (!self._nodesSourceControllers[nodeKey] && !dispItem.isRoot()) {
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
               listViewModel.toggleExpanded(dispItem);
            });
         } else {
            listViewModel.toggleExpanded(dispItem);
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
      getParentId: function(key, items, parentProperty) {
         var item = items.getRecordById(key);

         if (item) {
            return item.get(parentProperty);
         }
      },
      getAllParentsIds: function(hierarchyRelation, key, items) {
         var
            parentsIds = [],
            parentId = _private.getParentId(key, items, hierarchyRelation.getParentProperty());

         while (parentId) {
            parentsIds.push(parentId);
            parentId = _private.getParentId(parentId, items, hierarchyRelation.getParentProperty());
         }

         return parentsIds;
      },
      getAllChildren: function(hierarchyRelation, rootId, items) {
         var
            children = [];

         hierarchyRelation.getChildren(rootId, items).forEach(function(child) {
            if (hierarchyRelation.isNode(child)) {
               ArraySimpleValuesUtil.addSubArray(children, _private.getAllChildren(hierarchyRelation, child.getId(), items));
            }
            ArraySimpleValuesUtil.addSubArray(children, [child]);
         });

         return children;
      },
      getSelectedChildrenCount: function(hierarchyRelation, rootId, selectedKeys, items) {
         return _private.getAllChildren(hierarchyRelation, rootId, items).reduce(function(acc, child) {
            if (selectedKeys.indexOf(child.getId()) !== -1) {
               return acc + 1;
            }
            return acc;
         }, 0);
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
         if (typeof cfg.root !== 'undefined') {
            this._root = cfg.root;
         }
         return TreeControl.superclass.constructor.apply(this, arguments);
      },
      _beforeMount: function(cfg) {
         this._hierarchyRelation = new HierarchyRelation({
            idProperty: cfg.keyProperty,
            parentProperty: cfg.parentProperty,
            nodeProperty: cfg.nodeProperty
         });
      },
      _afterMount: function() {
         TreeControl.superclass._afterMount.apply(this, arguments);
         this._onNodeRemovedFn = this._onNodeRemoved.bind(this);

         // https://online.sbis.ru/opendoc.html?guid=d99190bc-e3e9-4d78-a674-38f6f4b0eeb0
         this._children.baseControl.getViewModel().subscribe('onNodeRemoved', this._onNodeRemovedFn);
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
      _onNodeExpanderClick: function(e, dispItem) {
         _private.toggleExpanded(this, dispItem);
      },
      _onLoadMoreClick: function(e, dispItem) {
         _private.loadMore(this, dispItem);
      },
      reload: function(filter) {
         _private.clearSourceControllers(this);
         this._children.baseControl.reload(filter);
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
      _onCheckBoxClick: function(e, key, status) {
         var
            parents,
            newSelectedKeys,
            diff,
            childrenIds;
         if (status === true || status === null) {
            parents = _private.getAllParentsIds(this._hierarchyRelation, key, this._options.items);
            newSelectedKeys = this._options.selectedKeys.slice();
            newSelectedKeys.splice(newSelectedKeys.indexOf(key), 1);
            childrenIds = _private.getAllChildren(this._hierarchyRelation, key, this._options.items).map(function(child) {
               return child.getId();
            });
            ArraySimpleValuesUtil.removeSubArray(newSelectedKeys, childrenIds);
            for (var i = 0; i < parents.length; i++) {
               // TODO: проверка на hasMore должна быть тут
               if (_private.getSelectedChildrenCount(this._hierarchyRelation, parents[i], newSelectedKeys, this._options.items) === 0) {
                  newSelectedKeys.splice(newSelectedKeys.indexOf(parents[i]), 1);
               } else {
                  break;
               }
            }
            diff = ArraySimpleValuesUtil.getArrayDifference(this._options.selectedKeys, newSelectedKeys);
            this._notify('selectedKeysChanged', [newSelectedKeys, diff.added, diff.removed]);
         } else {
            newSelectedKeys = this._options.selectedKeys.slice();
            newSelectedKeys.push(key);
            this._notify('selectedKeysChanged', [newSelectedKeys, [key], []]);
         }
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
         filter: {},
         multiSelectVisibility: 'hidden'
      };
   };

   TreeControl._private = _private;

   return TreeControl;
});
