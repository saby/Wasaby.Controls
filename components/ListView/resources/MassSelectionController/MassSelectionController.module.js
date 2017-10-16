define('js!SBIS3.CONTROLS.MassSelectionController',
    [
        "js!SBIS3.CORE.Control",
        "Core/core-clone",
        "WS.Data/Collection/IBind",
        "js!SBIS3.CONTROLS.Selection",
        "js!SBIS3.CONTROLS.ArraySimpleValuesUtil"
    ],
    function(Control, cClone, IBindCollection, Selection, ArraySimpleValuesUtil) {

       var MassSelectionController = Control.Control.extend(/** @lends SBIS3.CONTROLS.MassSelectionController.prototype */ {
          $protected: {
             _options: {
                idProperty: undefined,
                linkedObject: undefined
             },
             _silent: false,
             _selection: undefined
          },
          $constructor: function () {
             this._selection = this._createSelection();

             this.subscribeTo(this._options.linkedObject, 'onItemsReady', this._onItemsReady.bind(this));
             if (this._getProjection()) {
                this._onItemsReady();
             }
          },

          _createSelection: function() {
             return new Selection({
                projection: this._getProjection()
             });
          },

          setSelectedKeys: function(keys) {
             this._selection.unselectAll();
             this._selection.select(keys);
          },

          addItemsSelection: function(keys) {
             if (!this._silent) {
                this._selection.select(keys);
             }
          },

          removeItemsSelection: function(keys) {
             if (!this._silent) {
                this._selection.unselect(keys);
             }
          },

          setSelectedItemsAll: function () {
             var selectedKeys = cClone(this._selection._options.selectedKeys);
             this._selection.selectAll();
             this._applyChanges(selectedKeys);
          },

          removeItemsSelectionAll: function () {
             var selectedKeys = cClone(this._selection._options.selectedKeys);
             this._selection.unselectAll();
             this._applyChanges(selectedKeys);
          },

          toggleItemsSelectionAll: function() {
             var selectedKeys = cClone(this._selection._options.selectedKeys);
             this._selection.toggleAll();
             this._applyChanges(selectedKeys);
          },

          _applyChanges: function(selectedKeys) {
             var diff = ArraySimpleValuesUtil.getArrayDifference(selectedKeys, this._selection._options.selectedKeys);
             this._silent = true;
             if (diff.added.length) {
                this._options.linkedObject.addItemsSelection(diff.added);
             }
             if (diff.removed.length) {
                this._options.linkedObject.removeItemsSelection(diff.removed);
             }
             this._silent = false;
          },

          getSelection: function () {
             return this._selection.getSelection();
          },

          _getProjection: function() {
             return this._options.linkedObject._getItemsProjection();
          },

          _onItemsReady: function () {
             var projection = this._getProjection();
             this._selection.setProjection(projection);
             this.subscribeTo(projection, 'onCollectionChange', this._onProjectionChange.bind(this));
          },

          _onProjectionChangeAdd: function (newItems) {
             var addSelection = [];
             if (this._selection._options.markedAll) {
                newItems.forEach(function (item) {
                   addSelection.push(item.getContents().get(this._options.idProperty));
                }, this);
                if (addSelection.length) {
                   this._options.linkedObject.addItemsSelection(addSelection);
                }
             }
          },

          _onProjectionChange: function (eventObject, action, newItems) {
             switch (action) {
                case IBindCollection.ACTION_ADD:
                case IBindCollection.ACTION_RESET:
                   this._onProjectionChangeAdd(newItems);
             }
          }
       });

        return MassSelectionController;
    });
