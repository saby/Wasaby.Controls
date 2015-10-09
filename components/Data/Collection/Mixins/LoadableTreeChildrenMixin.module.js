/* global define, require, $ws */
define('js!SBIS3.CONTROLS.Data.Collection.LoadableTreeChildrenMixin', [
   'js!SBIS3.CONTROLS.Data.Collection.LoadableTreeItem',
   'js!SBIS3.CONTROLS.Data.Utils'
], function (LoadableTreeItem, Utils) {
   'use strict';

   /**
    * Коллекция дочерних элементов узла дерева, в которой можно отслеживать изменения.
    * @mixin SBIS3.CONTROLS.Data.Collection.LoadableTreeChildrenMixin
    * @public
    * @author Мальцев Алексей
    */

   var LoadableTreeChildrenMixin = /** @lends SBIS3.CONTROLS.Data.Collection.LoadableTreeChildrenMixin.prototype */{
      $protected: {
         _options: {
            /**
             * @cfg {SBIS3.CONTROLS.Data.Collection.LoadableTreeItem} Узел-владелец
             * @name owner
             */
         },

         _itemConstructor: LoadableTreeItem,
         _itemModule: 'SBIS3.CONTROLS.Data.Collection.LoadableTreeItem'
      },

      $constructor: function () {
         //Наследуем query от родителя, если родитель не корень
         var parent = this.getOwner().getParent();
         if (parent) {
            this._query = parent.getQuery();
         }
      },

      before: {
         //region SBIS3.CONTROLS.Data.Collection.ISourceLoadable

         load: function () {
            //FIXME: загрузка нескольких узлов сразу
            var parentField = this._options.owner.getParentField();
            if (parentField) {
               var idField = this._options.source.getModelIdField(),
                   idValue = idField && Utils.getItemPropertyValue(this._options.owner.getContents(), idField),
                   where = this.getQuery().getWhere();
               if (idValue === undefined && this._options.owner.isRoot()) {
                   idValue = this._options.owner.getRootNodeId();
               }

               if (idValue !== undefined) {
                   where[parentField] = idValue;
                   this.getQuery().where(where);
               }
            }
         }

         //endregion SBIS3.CONTROLS.Data.Collection.ISourceLoadable
      },

      around: {
         _convertToItem: function (parentFnc, item) {
            if (!$ws.helpers.instanceOfMixin(item, 'SBIS3.CONTROLS.Data.Collection.ITreeItem')) {
               if ($ws.helpers.instanceOfMixin(item, 'SBIS3.CONTROLS.Data.Collection.ICollectionItem')) {
                  item =  item.getContents();
               }
               var nodeField = this._options.owner.getNodeField(),
                  isNode = nodeField && Utils.getItemPropertyValue(item, nodeField) || false;
               item = new this._itemConstructor({
                  contents: item,
                  parent: this._options.owner,
                  node: isNode,
                  source: this._options.source,
                  parentField: this._options.owner.getParentField(),
                  nodeField: nodeField
               });
            }
            return parentFnc.call(this, item);
         }
      }
   };

   return LoadableTreeChildrenMixin;
});
