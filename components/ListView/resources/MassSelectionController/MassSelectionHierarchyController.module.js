define('js!SBIS3.CONTROLS.MassSelectionHierarchyController',
    [
        'js!SBIS3.CONTROLS.MassSelectionController',
        "Core/core-instance",
        "Core/helpers/collection-helpers",
        "js!WS.Data/Chain",
        "js!SBIS3.CONTROLS.ArraySimpleValuesUtil"
    ],
    function(MassSelectionController, cInstance, colHelpers, Chain, ArraySimpleValuesUtil) {

        var MassSelectionHierarchyController = MassSelectionController.extend( /** @lends SBIS3.CONTROLS.MassSelectionHierarchyController.prototype */ {
            $protected: {
                _traceDeepChanges: true
            },

            _onProjectionChangeAdd: function(newItems) {
                var
                    itemId,
                    addSelection = [],
                    selectedKeys = this._getSelectedKeys(),
                    parentProperty = this._options.linkedObject.getParentProperty();
                colHelpers.forEach(newItems, function (item) {
                    item = item.getContents();
                    itemId = item.get(this._options.idProperty);
                    if ((ArraySimpleValuesUtil.hasInArray(selectedKeys, item.get(parentProperty))) && !ArraySimpleValuesUtil.hasInArray(this._options.excluded, itemId)) {
                        addSelection.push(itemId);
                    }
                }, this);
                if (addSelection.length) {
                    this._options.linkedObject.addItemsSelection(addSelection);
                }
            },

            _getSelectedKeys: function() {
                var
                    linkedObject = this._options.linkedObject,
                    result = Array.clone(linkedObject.getSelectedKeys());
                //Может быть фейковый корень, тогда если он выбран он и так должен быть в selectedKeys, если фейкового
                //корня нет, и включен режим массового выделения, значит добавим id корня в список выделенных записей.
                if (this._options.selectedAll && !isPlainObject(linkedObject.getRoot())) {
                    result.push(linkedObject.getRoot() || null);
                }
                return result;
            },

            _onSelectedItemsChange: function(event, idArray, changed) {
                var
                    deepAdded,
                    deepRemoved,
                    linkedObject = this._options.linkedObject;

                MassSelectionHierarchyController.superclass._onSelectedItemsChange.apply(this, arguments);

                if (this._traceDeepChanges) {
                    this._traceDeepChanges = false;
                    deepAdded = this._getDeepFromProjection(changed.added);
                    deepRemoved = this._getDeepFromSelected(changed.removed);

                    if (deepAdded.length) {
                        linkedObject.addItemsSelection(deepAdded);
                    }

                    //При удалении из выбранных вложенных записей, отключим отслеживание исключённых, чтобы они не попали
                    //в опцию excluded, так как они там не нужны.
                    if (deepRemoved.length) {
                        this._traceExcluded = false;
                        linkedObject.removeItemsSelection(deepRemoved);
                        this._traceExcluded = true;
                    }
                    this._traceDeepChanges = true;
                }
            },

            toggleSelectedAll: function() {
                this._traceDeepChanges = false;
                MassSelectionHierarchyController.superclass.toggleSelectedAll.apply(this, arguments);
                this._traceDeepChanges = true;
            },

            _getDeepFromSelected: function(items) {
                var
                    result = [],
                    linkedObject = this._options.linkedObject,
                    selectedItems = linkedObject.getSelectedItems(),
                    parentProperty = linkedObject.getParentProperty();

                breadthFirstSearch(items, function(id) {
                    result.push(id);
                    return Chain(selectedItems.getIndicesByValue(parentProperty, id)).map(function(index) {
                        return selectedItems.at(index).get(this._options.idProperty);
                    }, this).value();
                }, this);

                return result;
            },


            _getDeepFromProjection: function(items) {
                var
                    result = [],
                    linkedObject = this._options.linkedObject,
                    projection = linkedObject._getItemsProjection();

                breadthFirstSearch(items, function(item) {
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
            items = Array.clone(items);
            for (var i = 0; i < items.length; i++) {
                callbackResult = callback.call(context, items[i]);
                if (Array.isArray(callbackResult)) {
                    items = items.concat(callbackResult);
                }
            }
        }

        return MassSelectionHierarchyController;
    });
