define('Controls/Container/TreeMassSelector', [
   'Controls/Container/MassSelector',
   'WS.Data/Relation/Hierarchy'
], function(MassSelector, HierarchyRelation) {
   'use strict';

   var _private = {
      isNode: function(item) {
         return !!item.get('Раздел@');
      },

      getTreeStateFromItems: function(items) {
         var treeState = {};

         items.forEach(function(item) {
            if (_private.isNode(item)) {
               treeState[item.getId()] = item.get('multiSelectionProperty');
            }
         });

         return treeState;
      },

      //TODO: этот и следующий метод хорошо бы превратить в один
      hasSelectedChildren: function(item, items, selectedKeys, excludedKeys, hierarchyRelation, treeState) {
         //TODO: Сейчас я завязываюсь на то, что я зову эту функцию только при снятии отметки, это вроде как-то неправильно
         /*
             В папке есть выделенные дети, если:
             1) Один из детей лежит в selectedKeys
             2) Одна из дочерних папок находится в состоянии true или null (т.е. внутри той папки что-то выделено)
             3) Текущая папка была в состоянии true, с одного из детей сняли выделение, но детей больше 1
             TODO: вообще странный кейс. Если все дети есть в excludedKeys, то вроде как можно их убрать оттуда.
             4) Текущая папка была в состоянии null, с одного из детей сняли выделение, детей больше 1, но не все дети есть в excludedKeys
          */
         var
            children = hierarchyRelation.getChildren(item, items),
            hasSelectedChildren = false,
            childId;
         if (children.length > 1) {
            if (treeState[item.getId()]) {
               hasSelectedChildren = true;
            } else {
               children.forEach(function(child) {
                  childId = child.getId();
                  if (selectedKeys.indexOf(childId) !== -1 || excludedKeys.indexOf(childId) === -1 || treeState[childId] || treeState[childId] === null) {
                     hasSelectedChildren = true;
                  }
               });
            }
         }
         return hasSelectedChildren;
      },

      hasNotSelectedChildren: function(item, items, selectedKeys, excludedKeys, hierarchyRelation, treeState) {
         /*
             В папке есть НЕ выделенные дети, если:
             1) Одного из детей нет в selectedKeys
             2) Один из детей есть в excludedKeys
             3) Дочерняя папка находится в состоянии false или null
          */
         var
            hasNotSelectedChildren = false,
            childId;
         hierarchyRelation.getChildren(item, items).forEach(function(child) {
            childId = child.getId();
            if (selectedKeys.indexOf(childId) === -1 || excludedKeys.indexOf(childId) !== -1 || !treeState[childId]) {
               hasNotSelectedChildren = true;
            }
         });
         return hasNotSelectedChildren;
      },

      updateChildren: function(treeState, hierarchyRelation, items, item, selectedKeys, excludedKeys, status) {
         hierarchyRelation.getChildren(item, items).forEach(function(child) {
            if (!_private.isNode(child)) {
               return;
            }
            _private.updateChildren(treeState, hierarchyRelation, items, child, selectedKeys, excludedKeys, status);
            if (status) {
               treeState[child.getId()] = _private.hasSelectedChildren(child, items, selectedKeys, excludedKeys, hierarchyRelation, treeState) ? null : false;
            } else {
               treeState[child.getId()] = _private.hasNotSelectedChildren(child, items, selectedKeys, excludedKeys, hierarchyRelation, treeState) ? null : true;
            }
         });
      },

      updateParents: function(treeState, hierarchyRelation, items, item, selectedKeys, excludedKeys, status) {
         var parent = hierarchyRelation.getParent(item, items);
         while (parent) {
            if (status) {
               treeState[parent.getId()] = _private.hasSelectedChildren(parent, items, selectedKeys, excludedKeys, hierarchyRelation, treeState) ? null : false;
            } else {
               treeState[parent.getId()] = _private.hasNotSelectedChildren(parent, items, selectedKeys, excludedKeys, hierarchyRelation, treeState) ? null : true;
            }
            parent = hierarchyRelation.getParent(parent, items);
         }
      },

      updateTreeState: function(treeState, hierarchyRelation, items, item, selectedKeys, excludedKeys, status) {
         if (_private.isNode(item)) {
            treeState[item.getId()] = !status;
            _private.updateChildren(treeState, hierarchyRelation, items, item, selectedKeys, excludedKeys, status);
         }
         _private.updateParents(treeState, hierarchyRelation, items, item, selectedKeys, excludedKeys, status);
      },

      removeChildrenFromSelectedKeys: function(hierarchyRelation, items, selectedKeys, folderKey) {
         var children = hierarchyRelation.getChildren(folderKey, items),
            isSelectedChild;
         return selectedKeys.filter(function(key) {
            isSelectedChild = false;
            children.forEach(function(child) {
               if (child.getId() === key) {
                  isSelectedChild = true;
               }
            });
            return !isSelectedChild;
         });
      }
   };

   var TreeMassSelector = MassSelector.extend({
      _treeState: null,

      _beforeMount: function(options) {
         this._hierarchyRelation = new HierarchyRelation({
            idProperty: options.keyProperty,
            parentProperty: options.parentProperty
         });

         TreeMassSelector.superclass._beforeMount.apply(this, arguments);
      },

      _itemsReadyCallback: function(items) {
         this._treeState = _private.getTreeStateFromItems(items);
         TreeMassSelector.superclass._itemsReadyCallback.apply(this, arguments);
      },

      _onCheckBoxClickHandler: function(event, key, status) {
         //TODO: count всё же надо считать, т.к. он используется в ПМО
         //TODO: excluded тоже надо учитывать
         //TODO: children это вроде только дети первого уровня. Так что если в selectedKeys есть более глубоко лежащие дети, то этот метод их не вычистит. Надо проверить
         var
            currentSelection = this._multiselection.getSelection(),
            selected = _private.removeChildrenFromSelectedKeys(this._hierarchyRelation, this._items, currentSelection.selected, key),
            excluded = currentSelection.excluded,
            item = this._items.getRecordById(key),
            parentId = this._hierarchyRelation.getParent(item, this._items).getId();

         //TODO: неправильная логика
         //В excluded нужно класть если было выделение на всей папке, но его сняли с этого узла
         //Убирать из excluded нужно, если запись до этого там была
         if (status) {
            if (this._treeState[parentId]) {
               excluded.push(key);
            } else if (excluded.indexOf(key) !== -1) {
               selected.splice(selected.indexOf(key), 1);
            }
         }
         if (this._treeState[parentId] || this._treeState[parentId] === null) {
            if (status) {
            } else {
               excluded.splice(excluded.indexOf(key), 1);
            }
         } else {
            if (status) {
            } else {
               selected.push(key);
            }
         }

         _private.updateTreeState(this._treeState, this._hierarchyRelation, this._items, item, selected, excluded, status);

         this._multiselection.unselectAll();
         this._multiselection.select(selected);
         this._multiselection.unselect(excluded);

         this._updateCount();
         this._updateSelectedKeys();
         this._updateContext();
      }
   });

   return TreeMassSelector;
});
