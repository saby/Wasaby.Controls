define('js!SBIS3.CONTROLS.hierarchyMixin', [], function () {

   var hierarchyMixin = /** @lends SBIS3.CONTROLS.hierarchyMixin.prototype */{
      $protected: {
         _indexTree: {},
         _options: {
            /**
             * @cfg {String} Поле иерархии
             */
            hierField: null
         }
      },
      $constructor: function () {
      },

      setHierField: function (hierField) {
         this._options.hierField = hierField;
      },

      hierIterate: function (DataSet, iterateCallback, status) {
         var self = this,
            curParent = null,
            parents = [],
            indexTree = {};

         do {

            DataSet.each(function (record) {
               var parentKey = self.getParentKey(DataSet, record);

               if ((parentKey || null) === (curParent ? curParent.getKey() : null)) {
                  parents.push(record);

                  if (!indexTree.hasOwnProperty(parentKey)) {
                     indexTree[self.getParentKey(DataSet, record)] = [];
                  }

                  indexTree[self.getParentKey(DataSet, record)].push(record.getKey());

                  iterateCallback.call(this, record);
               }

            }, status);

            if (parents.length) {
               var a = Array.remove(parents, 0);
               curParent = a[0];
            }
            else {
               curParent = null;
            }
         } while (curParent);

         this._indexTree = indexTree;
         DataSet.setIndexTree(indexTree);
      },

      getParentKey: function (DataSet, record) {
         return DataSet.getStrategy().getParentKey(record.get(this._options.hierField));
      }


   };

   return hierarchyMixin;

});