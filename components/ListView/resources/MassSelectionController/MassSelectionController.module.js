define('js!SBIS3.CONTROLS.MassSelectionController',
   [
      'js!SBIS3.CORE.Control',
      "js!WS.Data/Collection/IBind",
      "Core/core-instance",
      "Core/helpers/collection-helpers",
      "js!SBIS3.CONTROLS.ArraySimpleValuesUtil"
   ],
   function(Control, IBindCollection, cInstance, colHelpers, ArraySimpleValuesUtil) {

      var MassSelectionController = Control.Control.extend( /** @lends SBIS3.CONTROLS.MassSelectionController.prototype */ {
         $protected: {
            _options: {
               idProperty: undefined,
               linkedObject: undefined,
               selectedAll: false,
               excluded: []
            },
            _traceExcluded: true
         },
         $constructor: function() {
            var
               linkedObject = this._options.linkedObject,
               projection = linkedObject._getItemsProjection();
            this.subscribeTo(linkedObject, 'onSelectedItemsChange', this._onSelectedItemsChange.bind(this));
            this.subscribeTo(linkedObject, 'onItemsReady', this._subscribeOnProjectionChange.bind(this));
            if (projection) {
               this.subscribeTo(projection, 'onCollectionChange', this._onProjectionChange.bind(this));
            }
         },

         _subscribeOnProjectionChange: function() {
            this.subscribeTo(this._options.linkedObject._getItemsProjection(), 'onCollectionChange', this._onProjectionChange.bind(this));
         },

         setSelectedAll: function(selectAll) {
            this._options.selectedAll = selectAll;
            this.setExcluded([]);
            this._traceExcluded = false;
            this._options.linkedObject[selectAll ? 'setSelectedItemsAll' : 'removeItemsSelectionAll']();
            this._traceExcluded = true;
         },

         toggleSelectedAll: function() {
            this._options.selectedAll = !this._options.selectedAll;
            this.setExcluded(Array.clone(this._options.linkedObject.getSelectedKeys()));
            this._traceExcluded = false;
            this._options.linkedObject.toggleItemsSelectionAll();
            this._traceExcluded = true;
         },

         getSelectedAll: function() {
            return this._options.selectedAll;
         },

         getExcluded: function() {
            return this._options.excluded;
         },

         setExcluded: function(excluded) {
            this._options.excluded = excluded;
         },

         addExcluded: function(excluded) {
            for (var i = excluded.length - 1; i >= 0; i--) {
               if (!ArraySimpleValuesUtil.hasInArray(this._options.excluded, excluded[i])) {
                  this._options.excluded.push(excluded[i]);
               }
            }
         },

         removeExcluded: function(excluded) {
            var index;
            for (var i = 0; i < excluded.length; i++) {
               index = ArraySimpleValuesUtil.invertTypeIndexOf(this._options.excluded, excluded[i]);
               if (index !== -1) {
                  Array.remove(this._options.excluded, index);
               }
            }
         },

         _onSelectedItemsChange: function(event, idArray, changed) {
            if (this._traceExcluded) {
               this.addExcluded(changed.removed);
               this.removeExcluded(changed.added);
            }
         },

         _onProjectionChangeAdd: function(newItems) {
            var addSelection = [];
            if (this._options.selectedAll) {
               colHelpers.forEach(newItems, function(item) {
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
