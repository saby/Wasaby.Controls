define('Controls/List/TreeControl', [
   'Core/Control',
   'tmpl!Controls/List/TreeControl/TreeControl',
   'Controls/List/resources/utils/ItemsUtil',
   'Core/core-clone',
   'WS.Data/Relation/Hierarchy',
   'Controls/Utils/ArraySimpleValuesUtil'
], function(
   Control,
   TreeControlTpl,
   ItemsUtil,
   cClone,
   HierarchyRelation,
   ArraySimpleValuesUtil
) {
   'use strict';

   var _private = {
      toggleExpanded: function(self, dispItem) {
         var
            filter = cClone(self._options.filter),
            listViewModel = self._children.baseControl.getViewModel(),
            nodeKey = ItemsUtil.getPropertyValue(dispItem.getContents(), self._options.keyProperty);
         if (!self._loadedNodes[nodeKey] && !dispItem.isRoot()) {
            filter[self._options.parentProperty] = nodeKey;
            self._children.baseControl.getSourceController().load(filter, self._sorting).addCallback(function(list) {
               if (self._options.uniqueKeys) {
                  listViewModel.mergeItems(list);
               } else {
                  listViewModel.appendItems(list);
               }
               self._loadedNodes[nodeKey] = true;
               listViewModel.toggleExpanded(dispItem);
            });
         } else {
            listViewModel.toggleExpanded(dispItem);
         }
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

   var TreeControl = Control.extend({
      _template: TreeControlTpl,
      _loadedNodes: null,
      constructor: function(cfg) {
         this._loadedNodes = {};
         this._hierarchyRelation =  new HierarchyRelation({
            idProperty: cfg.keyProperty,
            parentProperty: cfg.parentProperty,
            nodeProperty: cfg.nodeProperty
         });
         return TreeControl.superclass.constructor.apply(this, arguments);
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
      reload: function(filter) {
         this._loadedNodes = {};
         this._children.baseControl.reload(filter);
      },
      editItem: function(options) {
         this._children.baseControl.editItem(options);
      },
      addItem: function(options) {
         this._children.baseControl.addItem(options);
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

      _markedKeyChangedHandler: function(event, item) {
         this._notify('markedKeyChanged', [item]);
      }
   });

   TreeControl.getDefaultOptions = function() {
      return {
         uniqueKeys: true,
         filter: {}
      };
   };


   return TreeControl;
});
