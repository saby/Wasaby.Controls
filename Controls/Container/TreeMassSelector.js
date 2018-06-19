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

      updateTreeState: function(treeState, hierarchyRelation, items, item, selectedKeys, status) {
         var
            parent = hierarchyRelation.getParent(item, items),
            children,
            hasSelectedChildren,
            hasNotSelectedChildren, //TODO: дичь
            newStatus;
         while (parent) {
            hasSelectedChildren = false;
            hasNotSelectedChildren = false;
            children = hierarchyRelation.getChildren(parent.getId(), items);
            if (status) {
               //сняли выделение
               if (children.length > 1) {
                  children.forEach(function(child) {
                     if (selectedKeys.indexOf(child.getId()) !== -1) {
                        hasSelectedChildren = true;
                     }
                  });
                  newStatus = hasSelectedChildren ? null : false;
               } else {
                  newStatus = false;
               }
            } else {
               if (children.length > 1) {
                  children.forEach(function(child) {
                     if (selectedKeys.indexOf(child.getId()) === -1) {
                        hasNotSelectedChildren = true;
                     }
                  });
                  newStatus = hasNotSelectedChildren ? null : true;
               } else {
                  newStatus = true;
               }
            }
            treeState[parent.getId()] = newStatus;
            parent = hierarchyRelation.getParent(parent, items);
         }
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
      _treeState: {},

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
         //TODO: excluded тоже надо учитывать, так вроде и немного проще будет
         var currentSelection = this._multiselection.getSelection(),
            selected = _private.removeChildrenFromSelectedKeys(this._hierarchyRelation, this._items, currentSelection.selected, key),
            excluded = currentSelection.excluded;

         if (this._treeState[key] || this._treeState[key] === null) {
            if (status || status === null) {
               //сняли выделение
               excluded.push(key);
            } else {
               excluded.splice(excluded.indexOf(key), 1);
            }
            selected = [null];
         } else {
            if (status || status === null) {
               //сняли выделение
               selected.splice(selected.indexOf(key), 1);
            } else {
               selected.push(key);
            }
         }

         _private.updateTreeState(this._treeState, this._hierarchyRelation, this._items, key, selected, status);


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
