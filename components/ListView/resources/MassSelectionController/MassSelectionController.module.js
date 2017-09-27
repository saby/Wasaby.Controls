define('js!SBIS3.CONTROLS.MassSelectionController',
    [
        'js!SBIS3.CORE.Control',
        "js!WS.Data/Collection/IBind",
        "Core/core-clone",
        "js!SBIS3.CONTROLS.ArraySimpleValuesUtil"
    ],
    function(Control, IBindCollection, coreClone, ArraySimpleValuesUtil) {

        var MassSelectionController = Control.Control.extend( /** @lends SBIS3.CONTROLS.MassSelectionController.prototype */ {
            $protected: {
                _options: {
                    idProperty: undefined,
                    linkedObject: undefined,
                    selectedAll: false,
                    excluded: []
                }
            },
            $constructor: function() {
                var
                    linkedObject = this._options.linkedObject,
                    projection = linkedObject._getItemsProjection();
                this.subscribeTo(linkedObject, 'onBeforeSelectedItemsChange', this._onBeforeSelectedItemsChange.bind(this));
                this.subscribeTo(linkedObject, 'onItemsReady', this._subscribeOnProjectionChange.bind(this));
                if (projection) {
                    this.subscribeTo(projection, 'onCollectionChange', this._onProjectionChange.bind(this));
                }
            },

            _subscribeOnProjectionChange: function() {
                this.subscribeTo(this._options.linkedObject._getItemsProjection(), 'onCollectionChange', this._onProjectionChange.bind(this));
            },

            getSelection: function() {
               return {
                  marked: this._options.selectedAll ? [] : this._options.linkedObject.getSelectedKeys(),
                  excluded: this._options.selectedAll ? this._options.excluded : []
               }
            },

            setSelectedAll: function(selectAll) {
                this._options.selectedAll = selectAll;
                this._options.linkedObject[selectAll ? 'setSelectedItemsAll' : 'removeItemsSelectionAll']();
                this._options.excluded = [];
            },

            toggleSelectedAll: function() {
                var selectedKeys = coreClone(this._options.linkedObject.getSelectedKeys());
                this._options.selectedAll = !this._options.selectedAll;
                this._options.linkedObject.toggleItemsSelectionAll();
                this._options.excluded = selectedKeys;
            },

            _addToArray: function(array, items) {
               items.forEach(function(item) {
                  if (!ArraySimpleValuesUtil.hasInArray(array, item)) {
                     array.push(item);
                  }
               });
            },

            _removeFromArray: function(array, items) {
               var index;
               items.forEach(function (item) {
                  index = ArraySimpleValuesUtil.invertTypeIndexOf(array, item);
                  if (index !== -1) {
                     array.splice(index, 1);
                  }
               });
            },

            _onBeforeSelectedItemsChange: function(event, idArray, changed) {
               this._addToArray(this._options.excluded, changed.removed);
               this._removeFromArray(this._options.excluded, changed.added);
            },

            _onProjectionChangeAdd: function(newItems) {
                var addSelection = [];
                if (this._options.selectedAll) {
                    newItems.forEach(function(item) {
                        addSelection.push(item.getContents().get(this._options.idProperty));
                    }, this);
                    this._options.linkedObject.addItemsSelection(addSelection);
                }
            },

            _onProjectionChange: function(eventObject, action, newItems) {
                switch (action) {
                    case IBindCollection.ACTION_ADD:
                    case IBindCollection.ACTION_RESET:
                        this._onProjectionChangeAdd(newItems);
                }
            }
        });

        return MassSelectionController;
    });
