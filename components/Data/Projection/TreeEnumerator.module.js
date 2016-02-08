/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Projection.TreeEnumerator', [
   'js!SBIS3.CONTROLS.Data.Projection.CollectionEnumerator',
   'js!SBIS3.CONTROLS.Data.Utils'
], function (CollectionEnumerator, Utils) {
   'use strict';

   /**
    * Энумератор для проекции дерева
    * @class SBIS3.CONTROLS.Data.Projection.TreeEnumerator
    * @extends SBIS3.CONTROLS.Data.Projection.CollectionEnumerator
    * @public
    * @author Мальцев Алексей
    */

   var TreeEnumerator = CollectionEnumerator.extend(/** @lends SBIS3.CONTROLS.Data.Projection.TreeEnumerator.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Projection.TreeEnumerator',
      $protected: {
         _options: {
            /**
             * @cfg {SBIS3.CONTROLS.Data.Collection.IEnumerable} Исходная коллекция
             */
            collection: null,

            /**
             * @cfg {SBIS3.CONTROLS.Data.Projection.TreeItem} Корневой элемент дерева
             */
            root: null,

            /**
             * @cfg {String} Название свойства, содержащего идентификатор узла.
             */
            idProperty: '',

            /**
             * @cfg {String} Название свойства, содержащего идентификатор родительского узла.
             */
            parentProperty: ''
         }
      },

      //region SBIS3.CONTROLS.Data.Collection.IEnumerator

      /*getNext: function () {
         var children = this._getChildren(this._сurrent);
         if (children.length) {
            return children[0];
         } else {
            return CollectionEnumerator.superclass.getNext.call(this);
         }
      },*/

      //endregion SBIS3.CONTROLS.Data.Collection.IEnumerator

      //region SBIS3.CONTROLS.Data.Projection.IEnumerator

      //endregion SBIS3.CONTROLS.Data.Projection.IEnumerator

      //region SBIS3.CONTROLS.Data.Collection.IndexedEnumeratorMixin

      //endregion SBIS3.CONTROLS.Data.Collection.IndexedEnumeratorMixin

      //region Protected methods

      /*_getChildren: function (item) {
         return $ws.helpers.map(this._options.collection.getIndiciesByValue(
            this._options.parentProperty,
            Utils.getItemPropertyValue(
               item ? item.getContents() : null,
               this._options.idProperty
            )
         ), (function(index) {
            return this._options.itemsMap[index];
         }).bind(this));
      },*/

      _buildInternalMap: function () {
         var idProperty = this._options.idProperty,
            parentProperty = this._options.parentProperty,
            collection = this._options.collection,
            itemsMap = this._options.itemsMap,
            buildHierarchy = function(parent) {
               var result = [],
                  parentId = Utils.getItemPropertyValue(
                     parent ? parent.getContents() : null,
                     idProperty
                  ),
                  children = collection.getIndiciesByValue(
                     parentProperty,
                     parentId
                  );

               var i, child;
               for (i = 0; i < children.length; i++) {
                  child = itemsMap[children[i]];
                  child.setParent(parent);
                  result.push(children[i]);
                  Array.prototype.push.apply(
                     result,
                     buildHierarchy(child)
                  );
               }
               return result;
            };

         var hierarchy = buildHierarchy(this._options.root);
         this._internalMap = [];
         this._currentPosition = -1;

         $ws.helpers.map(hierarchy, function(sourceIndex) {
            this._addToInternalMap(sourceIndex);
         }, this);

         this._storeSourceCurrent();
      }

      //endregion Protected methods
   });

   return TreeEnumerator;
});
