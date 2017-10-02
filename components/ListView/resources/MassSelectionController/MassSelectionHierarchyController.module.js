define('js!SBIS3.CONTROLS.MassSelectionHierarchyController',
    [
        'js!SBIS3.CONTROLS.MassSelectionController',
        "Core/core-instance",
        "Core/core-clone",
        "js!WS.Data/Chain",
        "js!SBIS3.CONTROLS.ArraySimpleValuesUtil"
    ],
    function(MassSelectionController, cInstance, coreClone, Chain, ArraySimpleValuesUtil) {

       var MassSelectionHierarchyController = MassSelectionController.extend(/** @lends SBIS3.CONTROLS.MassSelectionHierarchyController.prototype */ {
          $protected: {
             _traceDeepChanges: true,
             _partiallySelectedFull: [],
             _partiallySelected: []
          },

          $constructor: function () {
             var linkedObject = this._options.linkedObject;
             this.subscribeTo(linkedObject, 'onDrawItems', this._redrawPartiallySelection.bind(this));
             this.subscribeTo(linkedObject, 'onSelectedItemsChange', this._redrawPartiallySelection.bind(this));
          },

          //При добавлении элементов в проекцию добавляем их в набор выделенных записей, если:
          //1) Они находятся в папке, которая является выделенной
          //2) Родительский элемент не является "частично неполнолностью выделенной" (partiallySelected), т.к. такие элменты
          //так же как и "частично полностью выделенные" находятся в массиве выделенных, но дочерние элементы в них не должны выделяться
          //так как "частично неполнолностью выделенной" папка может стать только если она являлась невыделенной, и выделили её
          //дочерний элемент.
          //3) Запись не находится в наборе исключённых записей
          _onProjectionChangeAdd: function (newItems) {
             var
                itemId,
                parentId,
                addSelection = [],
                selectedKeys = this._getSelectedKeys(),
                parentProperty = this._options.linkedObject.getParentProperty();
             newItems.forEach(function (item) {
                item = item.getContents();
                itemId = item.get(this._options.idProperty);
                parentId = item.get(parentProperty);
                if (ArraySimpleValuesUtil.hasInArray(selectedKeys, parentId) &&
                   !ArraySimpleValuesUtil.hasInArray(this._partiallySelected, parentId) &&
                   !ArraySimpleValuesUtil.hasInArray(this._options.excluded, itemId)) {
                   addSelection.push(itemId);
                }
             }, this);
             if (addSelection.length) {
                this._options.linkedObject.addItemsSelection(addSelection);
             }
          },

          _getSelectedKeys: function () {
             var
                linkedObject = this._options.linkedObject,
                result = coreClone(linkedObject.getSelectedKeys());
             if (this._options.selectedAll) {
                result.push(linkedObject.getRoot() || null);
             }
             return result;
          },

          //Подмениваем изменения выделения в дереве. Метод очень тяжёлый, и желательно минимизировать его вызов.
          _onBeforeSelectedItemsChange: function (event, idArray, changed) {
             var
                upChanges,
                deepChanged = {},
                selectedKeys = this._getSelectedKeys(),
                projection = this._options.linkedObject._getItemsProjection();

             MassSelectionHierarchyController.superclass._onBeforeSelectedItemsChange.apply(this, arguments);
             this._removeFromPartiallySelected(changed.added.concat(changed.removed));
             //Вычисляем изменения вверх/вниз только если есть проекция.
             if (this._traceDeepChanges && projection) {
                //Вычитываем изменения вниз
                deepChanged.added = this._getDeepFromProjection(changed.added);
                deepChanged.removed = this._getDeepFromSelected(changed.removed);
                //Обновляем актуальность данных, чтобы в дальнейшем правильно определить статус выделенности родительских папок
                this._addToArray(selectedKeys, deepChanged.added);
                this._removeFromArray(selectedKeys, deepChanged.removed);
                this._removeFromArray(this._options.excluded, deepChanged.added);
                this._removeFromPartiallySelected(deepChanged.added.concat(deepChanged.removed));

                //Вычитываем изменения вверх
                upChanges = this._getDeepChangedUp(changed.added.concat(changed.removed), selectedKeys);
                deepChanged.added = deepChanged.added.concat(upChanges.added);
                deepChanged.removed = deepChanged.removed.concat(upChanges.removed);

                //Применяем изменения на внешние значения
                this._removeFromArray(idArray, deepChanged.removed);
                this._addToArray(idArray, deepChanged.added);
                this._addToArray(changed.removed, deepChanged.removed);
                this._addToArray(changed.added, deepChanged.added);
             }
          },

          _removeFromPartiallySelected: function(keys) {
             this._removeFromArray(this._partiallySelectedFull, keys);
             this._removeFromArray(this._partiallySelected, keys);
          },

          toggleSelectedAll: function () {
             this._traceDeepChanges = false;
             MassSelectionHierarchyController.superclass.toggleSelectedAll.apply(this, arguments);
             this._traceDeepChanges = true;
          },

          getSelection: function () {
             var selectedKeys = this._getSelectedKeys();

             this._removeFromArray(selectedKeys, this._partiallySelected);

             return {
                marked: selectedKeys,
                excluded: this._options.excluded
             };
          },

          setSelectedAll: function (selectAll) {
             var linkedObject = this._options.linkedObject;
             if (linkedObject.getCurrentRoot() === linkedObject.getRoot()) {
                MassSelectionHierarchyController.superclass.setSelectedAll.apply(this, arguments);
             } else {
                this._toggleCurrentBranch(selectAll);
             }
          },

          _redrawPartiallySelection: function () {
             var container = this._options.linkedObject.getContainer();

             $('.controls-ListView__item.controls-ListView__item__partiallySelected', container).removeClass('controls-ListView__item__partiallySelected');

             this._partiallySelected.concat(this._partiallySelectedFull).forEach(function (id) {
                $('.controls-ListView__item[data-id="' + id + '"]', container).addClass('controls-ListView__item__partiallySelected');
             }.bind(this));
          },

          _toggleCurrentBranch: function (selectAll) {
             var
                self = this,
                linkedObject = this._options.linkedObject,
                keys = [linkedObject.getCurrentRoot()],
                projection = linkedObject._getItemsProjection();

             projection.each(function (item) {
                keys.push(item.getContents().get(self._options.idProperty));
             });
             linkedObject[selectAll ? 'addItemsSelection' : 'removeItemsSelection'](keys);
          },

          _getNodeSelectionStatus: function (parent, selectedKeys) {
             var
                itemId,
                status,
                self = this,
                hasSelected = false,
                hasNotSelected = false,
                linkedObject = this._options.linkedObject,
                projection = linkedObject._getItemsProjection(),
                partiallySelected = this._partiallySelected.concat(this._partiallySelectedFull);

             breadthFirstSearch(Chain(projection.getChildren(parent)).toArray(), function (item) {
                itemId = item.getContents().get(self._options.idProperty);
                if (ArraySimpleValuesUtil.hasInArray(selectedKeys, itemId)) {
                   hasSelected = true;
                } else {
                   hasNotSelected = true;
                }
                if (ArraySimpleValuesUtil.hasInArray(partiallySelected, itemId)) {
                   hasSelected = hasNotSelected = true;
                }
                if (hasSelected && hasNotSelected) {
                   return false;
                } else if (item.isNode()) {
                   return Chain(projection.getChildren(item)).toArray();
                }
             }, this);

             if (hasSelected) {
                //В режиме поиска отметить всех детей одной из папок, то папка станет выделенной. Но в итоговую выборку
                //не должны попасть все дети папки. Поэтому для режима поиск, всегджа проставляем что папка частично выбрана
                //даже если все её дети выбраны.
                if (hasNotSelected || linkedObject._isSearchMode()) {
                   status = null;
                } else {
                   status = true;
                }
             } else {
                status = false;
             }
             return status;
          },

          _getDeepChangedUp: function (items, selectedKeys) {
             var
                parent,
                parentId,
                result = {
                   added: [],
                   removed: []
                },
                nodesStatus = {},
                linkedObject = this._options.linkedObject,
                projection = linkedObject._getItemsProjection();

             breadthFirstSearch(items, function (item) {
                if (!cInstance.instanceOfModule(item, 'WS.Data/Display/CollectionItem')) {
                   item = projection.getItemBySourceItem(linkedObject.getItems().getRecordById(item));
                }
                if (item && (parent = item.getParent())) {
                   parentId = parent.isRoot() ? parent.getContents() : parent.getContents().get(this._options.idProperty);
                   if (parentId !== this._options.linkedObject.getRoot() && parentId !== null && nodesStatus[parentId] === undefined) {
                      nodesStatus[parentId] = this._getNodeSelectionStatus(parent, selectedKeys);
                      if (nodesStatus[parentId] === true) {
                         result['added'].push(parentId);
                         this._addToArray(selectedKeys, [parentId]);
                         this._removeFromPartiallySelected([parentId]);
                      } else if (nodesStatus[parentId] === false) {
                         result['removed'].push(parentId);
                         this._removeFromArray(selectedKeys, [parentId]);
                         this._removeFromPartiallySelected([parentId]);
                      } else if (!ArraySimpleValuesUtil.hasInArray(this._partiallySelectedFull, parentId) && !ArraySimpleValuesUtil.hasInArray(this._partiallySelected, parentId)) {
                         if (ArraySimpleValuesUtil.hasInArray(selectedKeys, parentId)) {
                            this._addToArray(this._partiallySelectedFull, [parentId]);
                         } else {
                            this._addToArray(this._partiallySelected, [parentId]);
                         }
                         result['added'].push(parentId);
                         this._addToArray(selectedKeys, [parentId]);
                      }
                      return [parent];
                   }
                }
             }, this);

             return result;
          },

          _getDeepFromSelected: function (items) {
             var
                result = [],
                linkedObject = this._options.linkedObject,
                selectedItems = linkedObject.getSelectedItems(),
                parentProperty = linkedObject.getParentProperty();

             breadthFirstSearch(items, function (id) {
                result.push(id);
                return Chain(selectedItems.getIndicesByValue(parentProperty, id)).map(function (index) {
                   return selectedItems.at(index).get(this._options.idProperty);
                }, this).value();
             }, this);

             return result;
          },


          _getDeepFromProjection: function (items) {
             var
                result = [],
                linkedObject = this._options.linkedObject,
                projection = linkedObject._getItemsProjection();

             breadthFirstSearch(items, function (item) {
                if (!cInstance.instanceOfModule(item, 'WS.Data/Display/CollectionItem')) {
                   item = projection.getItemBySourceItem(linkedObject.getItems().getRecordById(item));
                }
                if (item) {
                   result.push(item.getContents().get(this._options.idProperty));
                   return Chain(projection.getChildren(item)).toArray();
                }
             }, this);
             return result;
          }
       });

       function breadthFirstSearch(items, callback, context) {
          var callbackResult;
          items = coreClone(items);
          for (var i = 0; i < items.length; i++) {
             callbackResult = callback.call(context, items[i]);
             if (callbackResult instanceof Array) {
                items = items.concat(callbackResult);
             } else if (callbackResult === false) {
                break;
             }
          }
       }

       return MassSelectionHierarchyController;
    });
