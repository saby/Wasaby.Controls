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
         //TODO: user defined order support
         var idProperty = this._options.idProperty,
            parentProperty = this._options.parentProperty,
            collection = this._options.collection,
            itemsMap = this._options.itemsMap,
            sortMap = this._options.sortMap,
            buildHierarchy = function(parent) {
               var result = [],
                  parentData = parent.getContents(),
                  parentId = parentData instanceof Object ? Utils.getItemPropertyValue(
                     parentData,
                     idProperty
                  ) : parentData,
                  children = collection.getIndiciesByValue(
                     parentProperty,
                     parentId
                  );

               //FIXME: для совместимости с логикой контролов - корневые записи дерева могут вообще не иметь поля с именем parentProperty
               if (!children.length && parentId === null && parent.isRoot()) {
                  //Считаем, что элементы коллекции без поля parentProperty находятся в корне
                  children = collection.getIndiciesByValue(
                     parentProperty
                  );
               }

               var i, child;
               for (i = 0; i < children.length; i++) {
                  child = itemsMap[children[i]];
                  if (child) {
                     child.setParent(parent);
                  }
                  result.push(children[i]);
                  if (child) {
                     Array.prototype.push.apply(
                        result,
                        buildHierarchy(child)
                     );
                  }
               }
               return result;
            };

         sortMap.length = 0;
         Array.prototype.push.apply(sortMap, buildHierarchy(this._options.root));

         return TreeEnumerator.superclass._buildInternalMap.call(this);
      }

      //endregion Protected methods
   });

   return TreeEnumerator;
});
