define('js!SBIS3.CONTROLS.hierarchyMixin', [], function () {

   var hierarchyMixin = /** @lends SBIS3.CONTROLS.hierarchyMixin.prototype */{
      $protected: {
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
            parents = [];
         do {

            DataSet.each(function (record) {

               if ((self.getParentKey(DataSet, record) || null) === (curParent ? curParent.getKey() : null)) {
                  parents.push(record);
                  //TODO: тут можно сделать кэш дерева
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
      },

      getParentKey: function (DataSet, record) {
         return DataSet.getStrategy().getParentKey(record.get(this._options.hierField));
      }


   };

   return hierarchyMixin;

});