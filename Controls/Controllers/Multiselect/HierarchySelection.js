define('Controls/Controllers/Multiselect/HierarchySelection', [
   'Controls/Controllers/Multiselect/Selection',
   'Core/core-clone',
   'Controls/Utils/ArraySimpleValuesUtil',
   'WS.Data/Relation/Hierarchy',

   //TODO: подгружать асинхронно
   'Controls/Controllers/Multiselect/Strategy/Hierarchy/AllData',
   'Controls/Controllers/Multiselect/Strategy/Hierarchy/PartialData'
], function(
   Selection,
   cClone,
   ArraySimpleValuesUtil,
   HierarchyRelation,
   AllData,
   PartialData
) {
   'use strict';

   var
      SELECTION_STATUS = {
         NOT_SELECTED: false,
         SELECTED: true,
         PARTIALLY_SELECTED: null
      };

   var HierarchySelection = Selection.extend({
      _hierarchyRelation: null,

      constructor: function(options) {
         HierarchySelection.superclass.constructor.apply(this, arguments);

         this._strategy = options.strategy === 'allData' ? new AllData(options) : new PartialData(options);

         //TODO: надо подумать как не создавать hierarchyRelation в двух местах, потому что он нужен и здесь и в стратегиях
         this._hierarchyRelation = new HierarchyRelation({
            idProperty: options.keyProperty || 'id',
            parentProperty: options.parentProperty || 'Раздел',
            nodeProperty: options.nodeProperty || 'Раздел@'
         });
      },

      select: function(keys) {
         // 1) Удаляем все ключи из excludedKeys, если они там есть. Если их там нет, то добавляем в selectedKeys
         // 2) Для каждого ключа получаем всех детей и удаляем их из обоих массивов
         // 3) Для каждого ключа бежим по всем родителям, если в них выделены все записи, то сносим всех детей из selectedKeys, добавляем туда родителя
         var childrenIds, parent, parentId;
         this._selectedKeys = this._selectedKeys.slice();
         this._excludedKeys = this._excludedKeys.slice();

         keys.forEach(function(key) {
            if (this._excludedKeys.indexOf(key) !== -1) {
               ArraySimpleValuesUtil.removeSubArray(this._excludedKeys, keys);
            } else {
               ArraySimpleValuesUtil.addSubArray(this._selectedKeys, keys);
            }
            childrenIds = this._strategy.getChildrenIds(key, this._items);
            ArraySimpleValuesUtil.removeSubArray(this._selectedKeys, childrenIds);
            ArraySimpleValuesUtil.removeSubArray(this._excludedKeys, childrenIds);

            parent = key === null ? null : this._hierarchyRelation.getParent(key, this._items);
            while (parent) {
               parentId = parent.getId();
               if (this._strategy.isAllChildrenSelected(this._getParams(parentId))) {
                  childrenIds = this._strategy.getChildrenIds(parentId, this._items);
                  ArraySimpleValuesUtil.removeSubArray(this._selectedKeys, childrenIds.concat(key));
                  ArraySimpleValuesUtil.addSubArray(this._selectedKeys, [parentId]);

                  parent = this._hierarchyRelation.getParent(parentId, this._items);
               } else {
                  break;
               }
            }
            if (parent === null) {
               if (this._strategy.isAllChildrenSelected(this._getParams(null))) {
                  childrenIds = this._strategy.getChildrenIds(null, this._items);
                  ArraySimpleValuesUtil.removeSubArray(this._selectedKeys, childrenIds.concat(key));
                  ArraySimpleValuesUtil.addSubArray(this._selectedKeys, [null]);
               }
            }
         }.bind(this));
      },

      unselect: function(keys) {
         // 1) Удаляем всех из selectedKeys
         // 2) Удаляем всех детей из excludedKeys
         // 3) Для каждого ключа бежим по всем родителям, как только нашли полностью выделенного родителя, то добавляем в excludedKeys и заканчиваем бежать
         // 3.1) Если стратегия allData и если после этого у полностью выделенного родителя все дети оказались в excludedKeys, то снимаем выделение с него.
         var
            childrenIds,
            parent,
            parentId;
         this._selectedKeys = this._selectedKeys.slice();
         this._excludedKeys = this._excludedKeys.slice();

         ArraySimpleValuesUtil.removeSubArray(this._selectedKeys, keys);

         keys.forEach(function(key) {
            ArraySimpleValuesUtil.removeSubArray(this._excludedKeys, this._strategy.getChildrenIds(key, this._items));

            parent = key === null ? null : this._hierarchyRelation.getParent(key, this._items);
            while (parent) {
               parentId = parent.getId();
               if (this._strategy.isAllSelection(this._getParams(parentId))) {
                  ArraySimpleValuesUtil.addSubArray(this._excludedKeys, [key]);
                  if (this._strategy instanceof AllData) {
                     if (!this._strategy.getSelectedChildrenCount(parentId, this._selectedKeys, this._excludedKeys, this._items)) {
                        childrenIds = this._strategy.getChildrenIds(parentId, this._items);
                        ArraySimpleValuesUtil.removeSubArray(this._excludedKeys, childrenIds);
                        ArraySimpleValuesUtil.removeSubArray(this._selectedKeys, [parentId]);
                        ArraySimpleValuesUtil.addSubArray(this._excludedKeys, [parentId]);
                     }
                  }
               }
               parent = this._hierarchyRelation.getParent(parentId, this._items);
            }
            if (parent === null && this._strategy.isAllSelection(this._getParams(null))) {
               ArraySimpleValuesUtil.addSubArray(this._excludedKeys, [key]);
               if (this._strategy instanceof AllData) {
                  if (!this._strategy.getSelectedChildrenCount(null, this._selectedKeys, this._excludedKeys, this._items)) {
                     childrenIds = this._strategy.getChildrenIds(null, this._items);
                     ArraySimpleValuesUtil.removeSubArray(this._excludedKeys, childrenIds);
                     ArraySimpleValuesUtil.removeSubArray(this._selectedKeys, [null]);
                  }
               }
            }
         }.bind(this));
      },

      getSelectionStatus: function(key) {
         /*
            Папка выделена полностью, если:
            1) Она есть в selectedKeys и её детей нет в excludedKeys.
            2) Выделен её родитель и её детей нет в excludedKeys.
            Папка выделена частично, если:
            1) Она есть в selectedKeys и её дети есть в excludedKeys.
            2) Выделен её родитель и её дети есть в excludedKeys.
            3) Её дети есть в selectedKeys
            Лист выделен, если:
            1) Он есть в selectedKeys
            2) Выделен его родитель и листа нет в excludedKeys
          */
         var
            hasExcludedChildren = false,
            hasSelectedChildren = false;
         if (key === null || this._hierarchyRelation.isNode(this._items.getRecordById(key), this._items)) {
            this._strategy.getChildrenIds(key, this._items).forEach(function(childId) {
               if (this._excludedKeys.indexOf(childId) !== -1) {
                  hasExcludedChildren = true;
               }
               if (this._selectedKeys.indexOf(childId) !== -1) {
                  hasSelectedChildren = true;
               }
            }.bind(this));
            if (this._selectedKeys.indexOf(key) !== -1 || (this._excludedKeys.indexOf(key) === -1 && this._strategy.isParentSelected(key, this._selectedKeys, this._excludedKeys, this._items))) {
               return hasExcludedChildren ? HierarchySelection.SELECTION_STATUS.PARTIALLY_SELECTED : HierarchySelection.SELECTION_STATUS.SELECTED;
            }
            if (hasSelectedChildren) {
               return HierarchySelection.SELECTION_STATUS.PARTIALLY_SELECTED;
            }
         } else {
            if (this._selectedKeys.indexOf(key) !== -1 || this._excludedKeys.indexOf(key) === -1 && this._strategy.isParentSelected(key, this._selectedKeys, this._excludedKeys, this._items)) {
               return HierarchySelection.SELECTION_STATUS.SELECTED;
            }
         }

         return HierarchySelection.SELECTION_STATUS.NOT_SELECTED;
      },

      _getParams: function(rootId) {
         var params = HierarchySelection.superclass._getParams.apply(this, arguments);
         params.rootId = rootId ? rootId : null;
         return params;
      }
   });

   HierarchySelection.SELECTION_STATUS = SELECTION_STATUS;

   return HierarchySelection;
});
