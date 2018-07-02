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
         //TODO: вроде неплохо бы почистить ключи, на всякий случай
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
         // 1) Безусловно удаляем все ключи из excludedKeys
         // 2) Безусловно добавляем все ключи в selectedKeys
         // 3) Для каждого ключа получаем всех детей и удаляем их из обоих массивов
         // 4) Для каждого ключа бежим по всем родителям, если в них выделены все записи, то сносим всех детей из selectedKeys, добавляем туда родителя
         var childrenIds, parent, parentId;

         ArraySimpleValuesUtil.removeSubArray(this._excludedKeys, keys);
         ArraySimpleValuesUtil.addSubArray(this._selectedKeys, keys);

         keys.forEach(function(key) {
            childrenIds = this._strategy.getChildrenIds(key, this._items);
            ArraySimpleValuesUtil.removeSubArray(this._selectedKeys, childrenIds);
            ArraySimpleValuesUtil.removeSubArray(this._excludedKeys, childrenIds);

            parent = key === null ? null : this._hierarchyRelation.getParent(key, this._items);
            while (parent) {
               parentId = parent.getId();
               if (this._strategy.isAllSelection(this._getParamsForIsAllSelection(parentId))) {
                  childrenIds = this._strategy.getChildrenIds(parentId, this._items);
                  ArraySimpleValuesUtil.removeSubArray(this._selectedKeys, childrenIds.concat(key));
                  ArraySimpleValuesUtil.addSubArray(this._selectedKeys, [parentId]);

                  parent = this._hierarchyRelation.getParent(parentId, this._items);
               } else {
                  break;
               }
            }
            if (parent === null) {
               if (this._strategy.isAllSelection(this._getParamsForIsAllSelection(null))) {
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

         ArraySimpleValuesUtil.removeSubArray(this._selectedKeys, keys);

         keys.forEach(function(key) {
            ArraySimpleValuesUtil.removeSubArray(this._excludedKeys, this._strategy.getChildrenIds(key, this._items));

            parent = key === null ? null : this._hierarchyRelation.getParent(key, this._items);
            while (parent) {
               parentId = parent.getId();
               if (this._strategy.isAllSelection(this._getParamsForIsAllSelection(parentId))) {
                  ArraySimpleValuesUtil.addSubArray(this._excludedKeys, [key]);
                  if (this._strategy instanceof AllData) {
                     if (!this._strategy.getSelectedChildrenCount(parentId, this._selectedKeys, this._excludedKeys, this._items)) {
                        childrenIds = this._strategy.getChildrenIds(parentId, this._items);
                        ArraySimpleValuesUtil.removeSubArray(this._excludedKeys, childrenIds);
                        ArraySimpleValuesUtil.removeSubArray(this._selectedKeys, [parentId]);
                     }
                  }
                  break;
               } else {
                  parent = this._hierarchyRelation.getParent(parentId, this._items);
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
         //TODO: опять сложно получилось
         var
            hasExcludedChildren = true,
            hasSelectedChildren = false;
         if (key === null || this._hierarchyRelation.isNode(this._items.getRecordById(key), this._items)) {
            this._strategy.getChildrenIds(key, this._items).forEach(function(childId) {
               if (this._excludedKeys.indexOf(childId) !== -1) {
                  hasExcludedChildren = false;
               }
               if (this._selectedKeys.indexOf(childId) !== -1) {
                  hasSelectedChildren = true;
               }
            }.bind(this));
            if (this._selectedKeys.indexOf(key) !== -1 || (this._excludedKeys.indexOf(key) === -1 && this._strategy.isParentSelected(key, this._selectedKeys, this._excludedKeys, this._items))) {
               return hasExcludedChildren ? HierarchySelection.SELECTION_STATUS.SELECTED : HierarchySelection.SELECTION_STATUS.PARTIALLY_SELECTED;
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

      _getParamsForIsAllSelection: function(rootId) {
         var params = HierarchySelection.superclass._getParamsForIsAllSelection.apply(this, arguments);
         params.rootId = rootId ? rootId : null;
         return params;
      }
   });

   HierarchySelection.SELECTION_STATUS = SELECTION_STATUS;

   return HierarchySelection;
});
