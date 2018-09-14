define('Controls/List/TreeControl', [
   'Core/Control',
   'wml!Controls/List/TreeControl/TreeControl',
   'Controls/Controllers/SourceController',
   'Controls/List/resources/utils/ItemsUtil',
   'Core/core-clone',
   'WS.Data/Relation/Hierarchy',
   'Controls/Utils/ArraySimpleValuesUtil'
], function(
   Control,
   TreeControlTpl,
   SourceController,
   ItemsUtil,
   cClone,
   HierarchyRelation,
   ArraySimpleValuesUtil
) {
   'use strict';

   var _private = {
      clearSourceControllers: function(self) {
         var
            listViewModel = self._children.baseControl.getViewModel();
         for (var prop in self._nodesSourceControllers) {
            if (self._nodesSourceControllers.hasOwnProperty(prop)) {
               self._nodesSourceControllers[prop].destroy();
            }
         }
         self._nodesSourceControllers = {};
         listViewModel.setHasMoreStorage({});
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
      getAllParentsIds: function(hierarchyRelation, key, items) {
         var
            parentsIds = [],
            parent = hierarchyRelation.getParent(key, items);

         while (parent) {
            parentsIds.push(parent.getId());
            parent = hierarchyRelation.getParent(parent, items);
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
            } else {
               return acc;
            }
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
    * @extends Controls/List/ListControl
    * @control
    * @public
    * @category List
    */

   var TreeControl = Control.extend(/** @lends Controls/List/TreeControl */{
      _onNodeRemovedFn: null,
      _template: TreeControlTpl,
      _nodesSourceControllers: null,
      constructor: function() {
         this._nodesSourceControllers = {};
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
         var
            filter;
         if (this._options.root !== newOptions.root) {
            filter = cClone(this._options.filter || {});
            filter[this._options.parentProperty] = newOptions.root;
            this.reload(filter);
            this._children.baseControl.getViewModel().setRoot(newOptions.root);
         }
         TreeControl.superclass._beforeUpdate.apply(this, arguments);
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
      editItem: function(options) {
         this._children.baseControl.editItem(options);
      },
      addItem: function(options) {
         this._children.baseControl.addItem(options);
      },


      /**
       * Ends editing in place without saving.
       * @returns {Core/Deferred}
       */
      cancelEdit: function() {
         if (!this._options.readOnly) {
            this._children.baseControl.cancelEdit();
         }
      },

      /**
       * Ends editing in place with saving.
       * @returns {Core/Deferred}
       */
      commitEdit: function() {
         if (!this._options.readOnly) {
            this._children.baseControl.commitEdit();
         }
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
               //TODO: проверка на hasMore должна быть тут
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

      _onAfterItemsRemoveHandler: function(e, keys, result) {
         this._notify('afterItemsRemove', [keys, result]);

         if (this._options.selectedKeys) {
            var
               self = this,
               newSelectedKeys = this._options.selectedKeys.slice(),
               diff,
               parents;

            ArraySimpleValuesUtil.removeSubArray(newSelectedKeys, keys);

            keys.forEach(function(key) {
               parents = _private.getAllParentsIds(self._hierarchyRelation, key, self._options.items);
               for (var i = 0; i < parents.length; i++) {
                  //TODO: проверка на hasMore должна быть тут
                  if (_private.getSelectedChildrenCount(self._hierarchyRelation, parents[i], newSelectedKeys, self._options.items) === 0) {
                     newSelectedKeys.splice(newSelectedKeys.indexOf(parents[i]), 1);
                  } else {
                     break;
                  }
               }
            });

            diff = ArraySimpleValuesUtil.getArrayDifference(this._options.selectedKeys, newSelectedKeys);

            this._notify('selectedKeysChanged', [newSelectedKeys, diff.added, diff.removed]);
         }
      },

      _markedKeyChangedHandler: function(event, key) {
         this._notify('markedKeyChanged', [key]);
      },

      destroy: function() {
         _private.clearSourceControllers(this);
         TreeControl.superclass.destroy.apply(this, arguments);
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
