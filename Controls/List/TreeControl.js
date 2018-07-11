define('Controls/List/TreeControl', [
   'Core/Control',
   'tmpl!Controls/List/TreeControl/TreeControl',
   'Controls/List/resources/utils/ItemsUtil',
   'Core/core-clone',
   'WS.Data/Relation/Hierarchy',
   'Controls/Container/MultiSelector/SelectionContextField',
   'Controls/Container/Data/ContextOptions',
   'Controls/Utils/ArraySimpleValuesUtil'
], function(
   Control,
   TreeControlTpl,
   ItemsUtil,
   cClone,
   HierarchyRelation,
   SelectionContextField,
   DataContext,
   ArraySimpleValuesUtil
) {
   'use strict';

   var _private = {
      toggleExpanded: function(self, dispItem) {
         var
            filter = cClone(self._options.filter),
            listViewModel = self._children.baseControl.getViewModel(),
            nodeKey = ItemsUtil.getPropertyValue(dispItem.getContents(), self._options.viewConfig.keyProperty);
         if (!self._loadedNodes[nodeKey]) {
            filter[self._options.viewConfig.parentProperty] = nodeKey;
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
            idProperty: cfg.keyProperty || 'id',
            parentProperty: cfg.parentProperty || 'Раздел',
            nodeProperty: cfg.nodeProperty || 'Раздел@'
         });
         return TreeControl.superclass.constructor.apply(this, arguments);
      },
      _onNodeExpanderClick: function(e, dispItem) {
         _private.toggleExpanded(this, dispItem);
      },
      removeItems: function(items) {
         this._children.baseControl.removeItems(items);
      },
      moveItemUp: function(item) {
         this._children.baseControl.moveItemUp(item);
      },
      moveItemDown: function(item) {
         this._children.baseControl.moveItemDown(item);
      },
      moveItems: function(items, target, position) {
         this._children.baseControl.moveItems(items, target, position);
      },
      reload: function() {
         this._children.baseControl.reload();
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
            childrenIds;
         if (status === true || status === null) {
            parents = _private.getAllParentsIds(this._hierarchyRelation, key, this.context.get('dataOptions').items);
            newSelectedKeys = this.context.get('selection').calculatedSelectedKeys.slice();
            newSelectedKeys.splice(newSelectedKeys.indexOf(key), 1);
            childrenIds = _private.getAllChildren(this._hierarchyRelation, key, this.context.get('dataOptions').items).map(function(child) {
               return child.getId();
            });
            ArraySimpleValuesUtil.removeSubArray(newSelectedKeys, childrenIds);
            for (var i = 0; i < parents.length; i++) {
               //TODO: проверка на hasMore должна быть тут
               if (_private.getSelectedChildrenCount(this._hierarchyRelation, parents[i], newSelectedKeys, this.context.get('dataOptions').items) === 0) {
                  newSelectedKeys.splice(newSelectedKeys.indexOf(parents[i]), 1);
               } else {
                  break;
               }
            }
            this._notify('selectionChange', [ArraySimpleValuesUtil.getArrayDifference(this.context.get('selection').calculatedSelectedKeys, newSelectedKeys)]);
         } else {
            this._notify('selectionChange', [{added: [key], removed: []}]);
         }
      },

      _onAfterItemsRemoveHandler: function(e, keys) {
         var
            self = this,
            newSelectedKeys = this.context.get('selection').calculatedSelectedKeys.slice(),
            parents;

         ArraySimpleValuesUtil.removeSubArray(newSelectedKeys, keys);

         keys.forEach(function(key) {
            parents = _private.getAllParentsIds(self._hierarchyRelation, key, self.context.get('dataOptions').items);
            for (var i = 0; i < parents.length; i++) {
               //TODO: проверка на hasMore должна быть тут
               if (_private.getSelectedChildrenCount(self._hierarchyRelation, parents[i], newSelectedKeys, self.context.get('dataOptions').items) === 0) {
                  newSelectedKeys.splice(newSelectedKeys.indexOf(parents[i]), 1);
               } else {
                  break;
               }
            }
         });

         this._notify('selectionChange', [ArraySimpleValuesUtil.getArrayDifference(this.context.get('selection').calculatedSelectedKeys, newSelectedKeys)]);
      }
   });

   TreeControl.getDefaultOptions = function() {
      return {
         uniqueKeys: true,
         filter: {}
      };
   };
   
   TreeControl.contextTypes = function contextTypes() {
      return {
         selection: SelectionContextField,
         dataOptions: DataContext
      };
   };


   return TreeControl;
});
