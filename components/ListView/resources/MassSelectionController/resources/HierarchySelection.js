/* global define */
define('SBIS3.CONTROLS/ListView/resources/MassSelectionController/resources/HierarchySelection', [
   'SBIS3.CONTROLS/ListView/resources/MassSelectionController/resources/Selection',
   'WS.Data/Entity/Record',
   'WS.Data/Relation/Hierarchy',
   'WS.Data/Collection/RecordSet',
   'Core/core-clone',
   'Core/IoC',
   'Controls/Utils/ArraySimpleValuesUtil'
], function (Selection, Record, HierarchyRelation, RecordSet, cClone, IoC, ArraySimpleValuesUtil) {
   'use strict';

   var
      STATUS_FILED = 'status',
      PARENT_FIELD = 'parent',
      ID_FIELD = 'id',
      DATA_TYPE = {
         RECORD_SET: 'rs',
         MARKED_TREE: 'mt'
      },
      STATUS = {
         NOT_SELECTED: 0,
         SELECTED: 1,
         PARTIALLY_FULL: 2,
         PARTIALLY: 3
   };

   var HierarchySelection = Selection.extend(/** @lends SBIS3.CONTROLS/ListView/resources/MassSelectionController/resources/HierarchySelection */{
      _parentProperty: undefined,
      _hierarchyRelations: {},
      _markedTree: undefined,

      constructor: function (options) {
         HierarchySelection.superclass.constructor.call(this, options);
         this._markedTree = new RecordSet({
            rawData: options.markedTree || [],
            idProperty: ID_FIELD,
            format: {
               id: 'string',
               status: 'integer',
               parent: 'string'
            }
         });
      },

      setProjection: function(projection) {
         HierarchySelection.superclass.setProjection.apply(this, arguments);
         this._parentProperty = projection.getParentProperty();
      },

      setRoot: function(root) {
         this._options.root = root;
      },

      select: function (ids) {
         this._changeTree(ids, true);
         ArraySimpleValuesUtil.removeSubArray(ids, [this._options.root]);
         HierarchySelection.superclass.select.call(this, ids);
      },

      unselect: function (ids) {
         var
            self = this,
            exclude = [];

         //В excludedKeys добавляем, только если родительский узел выбран.
         ids.forEach(function(id) {
            if (self._parentIsMarked(id)) {
               exclude.push(id);
            }
         });

         ArraySimpleValuesUtil.addSubArray(this._options.excludedKeys, exclude);
         this._changeTree(ids, false);
         ArraySimpleValuesUtil.removeSubArray(this._options.selectedKeys, ids);
      },

      _parentIsMarked: function(key) {
         var
            parentFromTree = this._markedTree.getRecordById(this._getParentIdById(key)),
            parentStatus = parentFromTree ? parentFromTree.get(STATUS_FILED) : STATUS.NOT_SELECTED;

         return parentStatus === STATUS.SELECTED || parentStatus === STATUS.PARTIALLY_FULL;
      },

      selectAll: function () {
         var rootId = this._options.projection.getRoot().getContents();
         if (rootId === this._options.root) {
            this._markedTree.clear();
            HierarchySelection.superclass.selectAll.call(this);
         }
         this.select([rootId]);
      },

      unselectAll: function () {
         this._markedTree.clear();
         HierarchySelection.superclass.unselectAll.call(this);
      },


      toggleAll: function () {
         var rootId = this._options.projection.getRoot().getContents();
         if (rootId === this._options.root) {
            HierarchySelection.superclass.toggleAll.call(this);
         } else {
            this._toggleAllInNode(rootId)
         }
      },

      _toggleAllInNode: function (nodeId) {
         var
            forChange = [],
            root = this._markedTree.getRecordById(nodeId),
            rootStatus = root ? root.get(STATUS_FILED) : STATUS.NOT_SELECTED,
            isSelected = rootStatus === STATUS.SELECTED || rootStatus === STATUS.PARTIALLY_FULL,
            containsArray = isSelected ? this._options.excludedKeys : this._options.selectedKeys;

         breadthFirstSearch([nodeId], function(id) {
            if (ArraySimpleValuesUtil.hasInArray(containsArray, id)) {
               forChange.push(id);
            }
            return this._getChildren(isSelected ? DATA_TYPE.RECORD_SET : DATA_TYPE.MARKED_TREE, id, true);
         }, this);

         if (isSelected) {
            this.unselect([nodeId]);
            this.select(forChange);
         } else {
            this.select([nodeId]);
            this.unselect(forChange);
         }
      },

      getSelection: function (allMarked) {
         return {
            marked: this._getMarked(allMarked),
            excluded: this._options.excludedKeys,
            markedAll: this._options.markedAll
         }
      },

      _changeTree: function (ids, isAdd) {
         if (this._options.projection) {
            //Вычитываем изменения вниз
            this._changeTreeDown(ids, isAdd);
            //Вычитываем изменения вверх
            this._changeTreeUp(ids);
         }
      },

      _changeTreeDown: function(ids, isAdd) {
         var type = isAdd ? DATA_TYPE.RECORD_SET : DATA_TYPE.MARKED_TREE;
         breadthFirstSearch(ids, function(id) {
            ArraySimpleValuesUtil.addSubArray(ids, [id]);
            if (isAdd) {
               this._addRecordToTree(id, STATUS.SELECTED);
            } else {
               this._removeRecordFromTree(id);
            }
            return this._getChildren(type, id, true);
         }, this);
      },

      _changeTreeUp: function (ids) {
         var
            parentId,
            applyResult,
            nodesStatus = {};
         breadthFirstSearch(ids, function (id) {
            parentId = this._getParentIdById(id);
            if (parentId !== undefined && nodesStatus[parentId] === undefined) {
               nodesStatus[parentId] = this._getNodeSelectionStatus(parentId);
               applyResult = this._applyNodeStatus(parentId, nodesStatus[parentId]);
               ArraySimpleValuesUtil.addSubArray(ids, applyResult);
               return [parentId];
            }
         }, this);
      },

      _applyNodeStatus: function (id, status) {
         var
            addStatus,
            result = [],
            itemFromSelection = this._markedTree.getRecordById(id),
            selectionStatus = itemFromSelection ? itemFromSelection.get(STATUS_FILED) : STATUS.NOT_SELECTED;
         if (status === true) {
            if (selectionStatus === STATUS.PARTIALLY_FULL) {
               result.push(id);
               addStatus = STATUS.SELECTED;
            } else if (selectionStatus !== STATUS.SELECTED) {
               addStatus = STATUS.PARTIALLY;
            }
         } else if (status === false) {
            addStatus = STATUS.NOT_SELECTED;
            result.push(id);
         } else if (status === null) {
            if (selectionStatus === STATUS.SELECTED) {
               result.push(id);
               addStatus = STATUS.PARTIALLY_FULL;
            } else if (selectionStatus === STATUS.NOT_SELECTED) {
               addStatus = STATUS.PARTIALLY;
            }
         }
         if (addStatus === STATUS.NOT_SELECTED) {
            this._removeRecordFromTree(id)
         } else if (addStatus !== undefined) {
            this._addRecordToTree(id, addStatus);
         }

         return result;
      },

      _getParentIdById: function (id) {
         var
            path, item, result,
            collection = this._options.projection.getCollection();

         if (id !== this._options.root) {
            item = collection.getRecordById(id);
            if (item) {
               result = item.get(this._parentProperty);
            } else {
               path = collection.getMetaData().path;
               if (path) {
                  item = path.getRecordById(id);
                  if (item) {
                     result = item.get(this._parentProperty);
                  } else {
                     IoC.resolve('ILogger').info('HierarchySelection:', 'The "path" parameter must contain all nodes, from the current to the root');
                  }
               } else {
                  IoC.resolve('ILogger').info('HierarchySelection:', 'The list method must return a parameter: path');
               }
            }
         }

         return result;
      },

      _getNodeSelectionStatus: function (id) {
         var
            status,
            result,
            selectedCount = 0,
            partiallySelectedCount = 0,
            childrenFromTree = this._getChildren(DATA_TYPE.MARKED_TREE, id),
            childrenCount = this._getChildren(DATA_TYPE.RECORD_SET, id).length;

         if (childrenCount === 0) {
            //Нет информации, непонятно что делать.
            result = childrenFromTree.length ? null : false;
         } else {
            childrenFromTree.forEach(function (item) {
               status = item.get(STATUS_FILED);
               if (status === STATUS.SELECTED) {
                  selectedCount++;
               } else {
                  partiallySelectedCount++;
               }
            }, this);
            if (childrenCount === selectedCount) {
               result = true;
            } else {
               result = (selectedCount || partiallySelectedCount) ? null : false;
            }
         }

         return result;
      },

      _getMarked: function (allMarked) {
         var
            parent,
            record,
            status,
            parentId,
            parentStatus,
            result = [];
         if (this._options.selectedKeys.length) {
            breadthFirstSearch([this._options.root], function (id) {
               record = this._markedTree.getRecordById(id);
               status = record ? record.get(STATUS_FILED) : STATUS.NOT_SELECTED;
               if (status === STATUS.SELECTED || status === STATUS.PARTIALLY_FULL) {
                  if (id !== this._options.root) {
                     parentId = this._markedTree.getRecordById(id).get(PARENT_FIELD);
                     parent = this._markedTree.getRecordById(parentId);
                     parentStatus = parent ? parent.get(STATUS_FILED) : STATUS.NOT_SELECTED;
                  }
                  if (allMarked || id === this._options.root || (parentStatus !== STATUS.PARTIALLY_FULL && parentStatus !== STATUS.SELECTED)) {
                     result.push(id);
                  }
               }
               if (allMarked || status !== STATUS.SELECTED) {
                  return this._getChildren(DATA_TYPE.MARKED_TREE, id, true);
               }
            }, this);
         }

         return result;
      },

      getPartiallySelected: function () {
         var
            status,
            result = [];
         this._markedTree.each(function (item) {
            status = item.get(STATUS_FILED);
            if (status === STATUS.PARTIALLY || status === STATUS.PARTIALLY_FULL) {
               result.push(item.get(ID_FIELD));
            }
         }, this);
         return result;
      },

      _getChildren: function(from, id, returnIds) {
         var
            idProperty = this._getIdProperty(from),
            parentProperty = this._getParentProperty(from),
            items = this._getHierarchyRelation(idProperty, parentProperty).getChildren(id, this._getCollection(from));

         return returnIds ? this._getIds(items, idProperty) : items;
      },

      _getIds: function(items, idProperty) {
         return items.map(function (item) {
            return item.get(idProperty);
         }, this);
      },

      _getIdProperty: function(type) {
         return type === DATA_TYPE.RECORD_SET ? this._idProperty : ID_FIELD;
      },

      _getParentProperty: function(type) {
         return type === DATA_TYPE.RECORD_SET ? this._parentProperty : PARENT_FIELD;
      },

      _getCollection: function(type) {
         return type === DATA_TYPE.RECORD_SET ? this._options.projection.getCollection() : this._markedTree;
      },

      _getHierarchyRelation: function(idProperty, parentProperty) {
         var name = idProperty + '_' + parentProperty;
         if (!this._hierarchyRelations[name]) {
            this._hierarchyRelations[name] = new HierarchyRelation({
               idProperty: idProperty,
               parentProperty: parentProperty
            });
         }
         return this._hierarchyRelations[name];
      },

      _addRecordToTree: function (id, status) {
         this._removeRecordFromTree(id);
         this._markedTree.add(new Record({
            rawData: {
               id: id,
               status: status,
               parent: this._getParentIdById(id)
            }
         }));
      },

      _removeRecordFromTree: function (id) {
         var record = this._markedTree.getRecordById(id);
         if (record) {
            this._markedTree.remove(record);
         }
      }
   });

   function breadthFirstSearch(items, callback, context) {
      var
         callbackResult,
         processedItems = [];
      items = cClone(items);
      for (var i = 0; i < items.length; i++) {
         //Защита от зацикливания при обходе в ширину
         if (processedItems.indexOf(items[i]) === -1) {
            callbackResult = callback.call(context, items[i]);
            processedItems.push(items[i]);

            if (callbackResult instanceof Array) {
               items = items.concat(callbackResult);
            } else if (callbackResult === false) {
               break;
            }
         }
      }
   }

   HierarchySelection.SELECTION_STATUS = STATUS;

   return HierarchySelection;
});
