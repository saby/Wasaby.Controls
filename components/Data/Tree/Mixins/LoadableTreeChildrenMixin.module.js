/* global define, require, $ws */
define('js!SBIS3.CONTROLS.Data.Tree.LoadableTreeChildrenMixin', [
   'js!SBIS3.CONTROLS.Data.Utils',
   'js!SBIS3.CONTROLS.Data.Tree.LoadableTreeItem'
], function (Utils) {
   'use strict';

   /**
    * Коллекция дочерних элементов узла дерева, в которой можно отслеживать изменения.
    * @mixin SBIS3.CONTROLS.Data.Tree.LoadableTreeChildrenMixin
    * @public
    * @author Мальцев Алексей
    */

   var LoadableTreeChildrenMixin = /** @lends SBIS3.CONTROLS.Data.Tree.LoadableTreeChildrenMixin.prototype */{
      $protected: {
         _options: {
            /**
             * @cfg {SBIS3.CONTROLS.Data.Tree.LoadableTreeItem} Узел-владелец
             * @name owner
             */
         },

         _itemModule: 'SBIS3.CONTROLS.Data.Tree.LoadableTreeItem'
      },

      $constructor: function () {
         //Наследуем параметры query от родителя, если родитель не корень
         var parent = this.getOwner().getParent();
         if (parent) {
            this._query = parent.getQuery().clone();
         }
      },

      before: {
         //region SBIS3.CONTROLS.Data.Collection.ISourceLoadable

         load: function () {
            //FIXME: загрузка нескольких узлов сразу
            var parentProperty = this._options.owner.getParentProperty();
            if (parentProperty) {
               var idProperty = this._options.source.getIdProperty(),
                   idValue = idProperty && Utils.getItemPropertyValue(this._options.owner.getContents(), idProperty),
                   where = this.getQuery().getWhere();
               if (idValue === undefined && this._options.owner.isRoot()) {
                   idValue = this._options.owner.getRootNodeId();
               }

               if (idValue !== undefined) {
                   where[parentProperty] = idValue;
                   this.getQuery().where(where);
               }
            }
         }

         //endregion SBIS3.CONTROLS.Data.Collection.ISourceLoadable
      },

      around: {
         _convertToItem: function (parentFnc, item) {
            if (!$ws.helpers.instanceOfMixin(item, 'SBIS3.CONTROLS.Data.Tree.ITreeItem')) {
               if ($ws.helpers.instanceOfMixin(item, 'SBIS3.CONTROLS.Data.Collection.ICollectionItem')) {
                  item =  item.getContents();
               }
               var nodeProperty = this._options.owner.getNodeProperty(),
                  isNode = nodeProperty && Utils.getItemPropertyValue(item, nodeProperty) || false;
               item = $ws.single.ioc.resolve(this._itemModule, {
                  owner: this,
                  contents: item,
                  parent: this._options.owner,
                  node: isNode,
                  source: this._options.source,
                  parentProperty: this._options.owner.getParentProperty(),
                  nodeProperty: nodeProperty
               });
            }
            return parentFnc.call(this, item);
         }
      }
   };

   return LoadableTreeChildrenMixin;
});
