define('Controls/Controllers/Multiselect/HierarchySelection', [
   'Controls/Controllers/Multiselect/Selection',
   'Controls/Utils/ArraySimpleValuesUtil',
   'WS.Data/Relation/Hierarchy'
], function(
   Selection,
   ArraySimpleValuesUtil,
   HierarchyRelation
) {
   'use strict';

   /**
    * @class Controls/Controllers/Multiselect/HierarchySelection
    * @extends Controls/Controllers/Multiselect/Selection
    * @author Зайцев А.С.
    * @private
    */

   /**
    * @name Controls/Controllers/Multiselect/HierarchySelection#nodeProperty
    * @cfg {String} Name of the field describing the type of the node (list, node, hidden node).
    */

   /**
    * @name Controls/Controllers/Multiselect/HierarchySelection#parentProperty
    * @cfg {String} Name of the field that contains information about parent node.
    */

   var
      SELECTION_STATUS = {
         NOT_SELECTED: false,
         SELECTED: true,
         PARTIALLY_SELECTED: null
      },
      _private = {
         getAllChildren: function(hierarchyRelation, rootId, items) {
            var children = [];

            hierarchyRelation.getChildren(rootId, items).forEach(function(child) {
               if (hierarchyRelation.isNode(child)) {
                  ArraySimpleValuesUtil.addSubArray(children, _private.getAllChildren(hierarchyRelation, child.getId(), items));
               }
               ArraySimpleValuesUtil.addSubArray(children, [child]);
            });

            return children;
         },

         getChildrenIds: function(hierarchyRelation, rootId, items) {
            return _private.getAllChildren(hierarchyRelation, rootId, items).map(function(child) {
               return child.getId();
            });
         },

         isParentSelected: function(hierarchyRelation, key, selectedKeys, excludedKeys, items) {
            if (key === null) {
               return selectedKeys[0] === null;
            }

            var
               parent = hierarchyRelation.getParent(key, items),
               parentSelected = false,
               parentId;

            while (parent) {
               parentId = parent.getId();
               if (selectedKeys.indexOf(parentId) !== -1) {
                  parentSelected = true;
                  break;
               }
               if (excludedKeys.indexOf(parentId) !== -1) {
                  break;
               }
               parent = hierarchyRelation.getParent(parentId, items);
            }

            if (parent === null && selectedKeys[0] === null) {
               parentSelected = true;
            }

            return parentSelected;
         },

         isParentExcluded: function(hierarchyRelation, key, selectedKeys, excludedKeys, items) {
            var
               parent = hierarchyRelation.getParent(key, items),
               parentExcluded,
               parentId;

            while (parent) {
               parentId = parent.getId();
               if (selectedKeys.indexOf(parentId) !== -1) {
                  parentExcluded = false;
                  break;
               }
               if (excludedKeys.indexOf(parentId) !== -1) {
                  parentExcluded = true;
                  break;
               }
               parent = hierarchyRelation.getParent(parentId, items);
            }

            if (parent === null && selectedKeys[0] === null) {
               parentExcluded = false;
            }

            return parentExcluded;
         },

         getSelectedChildrenCount: function(hierarchyRelation, rootId, selectedKeys, excludedKeys, items) {
            var
               parentSelected = selectedKeys.indexOf(rootId) !== -1 || _private.isParentSelected(hierarchyRelation, rootId, selectedKeys, excludedKeys, items),
               childId;

            return hierarchyRelation.getChildren(rootId, items).reduce(function(acc, child) {
               childId = child.getId();

               if (selectedKeys.indexOf(childId) !== -1 || parentSelected && excludedKeys.indexOf(childId) === -1) {
                  if (hierarchyRelation.isNode(child)) {
                     return acc + 1 + _private.getSelectedChildrenCount(hierarchyRelation, childId, selectedKeys, excludedKeys, items);
                  } else {
                     return acc + 1;
                  }
               } else {
                  if (hierarchyRelation.isNode(child) && excludedKeys.indexOf(childId) === -1) {
                     return acc + _private.getSelectedChildrenCount(hierarchyRelation, childId, selectedKeys, excludedKeys, items);
                  } else {
                     return acc;
                  }
               }
            }, 0);
         }
      };

   var HierarchySelection = Selection.extend({
      _hierarchyRelation: null,

      constructor: function(options) {
         HierarchySelection.superclass.constructor.apply(this, arguments);

         this._hierarchyRelation = new HierarchyRelation({
            idProperty: options.keyProperty || 'id',
            parentProperty: options.parentProperty || 'Раздел',
            nodeProperty: options.nodeProperty || 'Раздел@'
         });
      },

      select: function(keys) {
         // 1) Удаляем все ключи из excludedKeys, если они там есть. Если их там нет, то добавляем в selectedKeys
         // 2) Для каждого ключа получаем всех детей и удаляем их из обоих массивов
         var childrenIds;
         this._selectedKeys = this._selectedKeys.slice();
         this._excludedKeys = this._excludedKeys.slice();

         keys.forEach(function(key) {
            if (this._excludedKeys.indexOf(key) !== -1) {
               ArraySimpleValuesUtil.removeSubArray(this._excludedKeys, keys);
            } else {
               ArraySimpleValuesUtil.addSubArray(this._selectedKeys, keys);
            }
            childrenIds = _private.getChildrenIds(this._hierarchyRelation, key, this._items);
            ArraySimpleValuesUtil.removeSubArray(this._selectedKeys, childrenIds);
            ArraySimpleValuesUtil.removeSubArray(this._excludedKeys, childrenIds);
         }.bind(this));
      },

      unselect: function(keys) {
         // 1) Удаляем всех из selectedKeys
         // 2) Удаляем всех детей из excludedKeys
         // 3) Для каждого ключа бежим по всем родителям, как только нашли полностью выделенного родителя, то добавляем в excludedKeys и заканчиваем бежать
         var
            childrenIds,
            parent,
            parentId;
         this._selectedKeys = this._selectedKeys.slice();
         this._excludedKeys = this._excludedKeys.slice();

         ArraySimpleValuesUtil.removeSubArray(this._selectedKeys, keys);

         keys.forEach(function(key) {
            childrenIds = _private.getChildrenIds(this._hierarchyRelation, key, this._items);
            ArraySimpleValuesUtil.removeSubArray(this._excludedKeys, childrenIds);
            ArraySimpleValuesUtil.removeSubArray(this._selectedKeys, childrenIds);

            parent = key === null ? null : this._hierarchyRelation.getParent(key, this._items);
            while (parent) {
               parentId = parent.getId();
               if (this._isAllSelection(this._getParams(parentId))) {
                  ArraySimpleValuesUtil.addSubArray(this._excludedKeys, [key]);
               }
               parent = this._hierarchyRelation.getParent(parentId, this._items);
            }
            if (parent === null && this._isAllSelection(this._getParams(null))) {
               ArraySimpleValuesUtil.addSubArray(this._excludedKeys, [key]);
            }
         }.bind(this));
      },

      getCount: function() {
         return _private.getSelectedChildrenCount(this._hierarchyRelation, null, this._selectedKeys, this._excludedKeys, this._items);
      },

      getSelectedKeysForRender: function() {
         var
            res = [],
            self = this,
            itemId,
            isParentSelected,
            isParentExcluded,
            hasSelectedChildren,
            excluded;

         this._items.forEach(function(item) {
            itemId = item.getId();
            isParentSelected = _private.isParentSelected(self._hierarchyRelation, itemId, self._selectedKeys, self._excludedKeys, self._items);
            isParentExcluded = _private.isParentExcluded(self._hierarchyRelation, itemId, self._selectedKeys, self._excludedKeys, self._items);
            hasSelectedChildren = _private.getSelectedChildrenCount(self._hierarchyRelation, itemId, self._selectedKeys, self._excludedKeys, self._items) > 0;
            excluded = self._excludedKeys.indexOf(itemId) !== -1 || isParentExcluded;
            if ((self._selectedKeys[0] === null || isParentSelected || hasSelectedChildren) && !excluded || self._selectedKeys.indexOf(itemId) !== -1) {
               res.push(itemId);
            }
         });

         return res;
      },

      _getParams: function(rootId) {
         var params = HierarchySelection.superclass._getParams.apply(this, arguments);
         params.rootId = rootId ? rootId : null;
         params.hierarchyRelation = this._hierarchyRelation;
         return params;
      },

      _isAllSelection: function(options) {
         var
            rootId = options.rootId,
            selectedKeys = options.selectedKeys,
            excludedKeys = options.excludedKeys,
            items = options.items,
            isParentSelected = _private.isParentSelected(this._hierarchyRelation, rootId, selectedKeys, excludedKeys, items);

         return isParentSelected || selectedKeys.indexOf(rootId) !== -1;
      }
   });

   HierarchySelection.SELECTION_STATUS = SELECTION_STATUS;

   return HierarchySelection;
});
