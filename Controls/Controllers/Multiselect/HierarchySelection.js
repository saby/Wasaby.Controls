define('Controls/Controllers/Multiselect/HierarchySelection', [
   'Core/core-simpleExtend',
   'Core/core-clone',
   'Controls/Utils/ArraySimpleValuesUtil',
   'WS.Data/Relation/Hierarchy'
], function(
   cExtend,
   cClone,
   ArraySimpleValuesUtil,
   HierarchyRelation
) {
   'use strict';

   var ALLSELECTION_VALUE = [null];

   var _private = {
      getChildrenIds: function(rootId, items, hierarchyRelation) {
         return _private.getAllChildren(rootId, items, hierarchyRelation).map(function(child) {
            return child.getId();
         });
      },

      getAllChildren: function(rootId, items, hierarchyRelation) {
         var children = [];

         hierarchyRelation.getChildren(rootId, items).forEach(function(child) {
            if (hierarchyRelation.isNode(child)) {
               ArraySimpleValuesUtil.addSubArray(children, _private.getAllChildren(child.getId(), items, hierarchyRelation));
            }
            ArraySimpleValuesUtil.addSubArray(children, [child]);
         });

         return children;
      },

      getSelectedChildrenCount: function(rootId, selectedKeys, excludedKeys, items, hierarchyRelation, parentSelected) {
         var childId;
         return hierarchyRelation.getChildren(rootId, items).reduce(function(acc, child) {
            childId = child.getId();

            if (selectedKeys.indexOf(childId) !== -1 || parentSelected && excludedKeys.indexOf(childId) === -1) {
               if (hierarchyRelation.isNode(child)) {
                  return acc + 1 + _private.getSelectedChildrenCount(childId, selectedKeys, excludedKeys, items, hierarchyRelation, true);
               } else {
                  return acc + 1;
               }
            } else {
               if (hierarchyRelation.isNode(child)) {
                  return acc + _private.getSelectedChildrenCount(childId, selectedKeys, excludedKeys, items, hierarchyRelation, parentSelected);
               } else {
                  return acc;
               }
            }
         }, 0);
      },

      isAllSelection: function(rootId, selectedKeys, excludedKeys, items, strategy, hierarchyRelation) {
         var selectedChildrenCount, childrenIds, allChildrenSelected;
         if (strategy === 'allData') {
            allChildrenSelected = true;
            childrenIds = _private.getChildrenIds(rootId, items, hierarchyRelation);
            selectedChildrenCount = _private.getSelectedChildrenCount(rootId, selectedKeys, excludedKeys, items, hierarchyRelation, selectedKeys[0] === null);
            for (var i = 0; i < childrenIds.length; i++) {
               if (excludedKeys.indexOf(childrenIds[i]) !== -1) {
                  allChildrenSelected = false;
                  break;
               }
            }
            return (selectedKeys.indexOf(rootId) !== -1 || selectedChildrenCount === childrenIds.length) && allChildrenSelected;
         } else {
            //TODO: тут скорее нужно смотреть есть ли дети в excludedKeys
            return selectedKeys.indexOf(rootId) !== -1 && !excludedKeys.length;
         }
      },

      getCount: function(selectedKeys, excludedKeys, items, strategy, hierarchyRelation) {
         return _private.getSelectedChildrenCount(null, selectedKeys, excludedKeys, items, hierarchyRelation, selectedKeys[0] === null);
      }
   };

   var HierarchySelection = cExtend.extend({
      _selectedKeys: null,
      _excludedKeys: null,
      _items: null,
      _hierarchyRelation: null,

      //allData - все данные подгружены, можем не угадывать при расчёте count и отрисовке чекбоксов. partialData - не все данные подгружены.
      _strategy: '',

      constructor: function(options) {
         //TODO: эти опции я сейчас не прокидываю, а придётся
         this._hierarchyRelation = new HierarchyRelation({
            idProperty: options.keyProperty || 'id',
            parentProperty: options.parentProperty || 'Раздел',
            nodeProperty: options.nodeProperty || 'Раздел@'
         });

         //TODO: полная копипаста из Selection (хотя вроде это неправильно, в самом начале нужно почистить ключи, на всякий случай)
         this._selectedKeys = cClone(options.selectedKeys);
         this._excludedKeys = cClone(options.excludedKeys);

         //TODO: нужно кидать исключение, если нет items
         this._items = cClone(options.items);
         this._strategy = options.strategy;

         //excluded keys имеют смысл только когда выделено все, поэтому ситуацию, когда переданы оба массива считаем ошибочной
         if (options.excludedKeys.length && !_private.isAllSelection(null, this._selectedKeys, this._excludedKeys, this._items, this._strategy, this._hierarchyRelation)) {
            //TODO возможно надо кинуть здесь исключение
         }

         HierarchySelection.superclass.constructor.apply(this, arguments);
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
            childrenIds = _private.getChildrenIds(key, this._items, this._hierarchyRelation);
            ArraySimpleValuesUtil.removeSubArray(this._selectedKeys, childrenIds);
            ArraySimpleValuesUtil.removeSubArray(this._excludedKeys, childrenIds);

            parent = key === null ? null : this._hierarchyRelation.getParent(key, this._items);
            while (parent) {
               parentId = parent.getId();
               if (_private.isAllSelection(parentId, this._selectedKeys, this._excludedKeys, this._items, this._strategy, this._hierarchyRelation)) {
                  childrenIds = _private.getChildrenIds(parentId, this._items, this._hierarchyRelation);
                  ArraySimpleValuesUtil.removeSubArray(this._selectedKeys, childrenIds.concat(key));
                  ArraySimpleValuesUtil.addSubArray(this._selectedKeys, [parentId]);

                  parent = this._hierarchyRelation.getParent(parentId, this._items);
               } else {
                  break;
               }
            }
            if (parent === null) {
               if (_private.isAllSelection(null, this._selectedKeys, this._excludedKeys, this._items, this._strategy, this._hierarchyRelation)) {
                  childrenIds = _private.getChildrenIds(null, this._items, this._hierarchyRelation);
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
         var childrenIds, parent, parentId;

         ArraySimpleValuesUtil.removeSubArray(this._selectedKeys, keys);

         keys.forEach(function(key) {
            childrenIds = _private.getChildrenIds(key, this._items, this._hierarchyRelation);
            ArraySimpleValuesUtil.removeSubArray(this._excludedKeys, childrenIds);

            parent = key === null ? null : this._hierarchyRelation.getParent(key, this._items);
            while (parent) {
               parentId = parent.getId();
               if (_private.isAllSelection(parentId, this._selectedKeys, this._excludedKeys, this._items, this._strategy, this._hierarchyRelation)) {
                  ArraySimpleValuesUtil.addSubArray(this._excludedKeys, [key]);
                  break;
               } else {
                  parent = this._hierarchyRelation.getParent(parentId, this._items);
               }
            }
         }.bind(this));
      },

      selectAll: function() {
         //TODO: полная копипаста из Selection
         this._selectedKeys = ALLSELECTION_VALUE;
         this._excludedKeys = [];
      },

      unselectAll: function() {
         //TODO: полная копипаста из Selection
         this._selectedKeys = [];
         this._excludedKeys = [];
      },

      toggleAll: function() {
         //TODO: надо вот это посмотреть, подумать
         var swap;
         if (_private.isAllSelection(null, this._selectedKeys, this._excludedKeys, this._items, this._strategy, this._hierarchyRelation)) {
            swap = cClone(this._excludedKeys);
            this.unselectAll();
            this.select(swap);
         } else {
            swap = cClone(this._selectedKeys);
            this.selectAll();
            this.unselect(swap);
         }
      },

      getSelection: function() {
         //TODO: полная копипаста из Selection
         return {
            selected: this._selectedKeys,
            excluded: this._excludedKeys
         };
      },

      setItems: function(items) {
         //TODO: полная копипаста из Selection
         this._items = cClone(items);
      },

      getSelectionStatus: function(key) {
         //TODO: тут надо добавить ещё один кейс: выделен один из родителей. А так копипаста из Selection
         if (this._excludedKeys.indexOf(key) === -1 && _private.isAllSelection(null, this._selectedKeys, this._excludedKeys, this._items, this._strategy)) {
            return true;
         } else if (this._selectedKeys.indexOf(key) !== -1) {
            return true;
         } else {
            return false;
         }
      },

      getCount: function() {
         //TODO: полная копипаста из Selection
         return _private.getCount(this._selectedKeys, this._excludedKeys, this._items, this._strategy, this._hierarchyRelation);
      }
   });

   return HierarchySelection;
});
