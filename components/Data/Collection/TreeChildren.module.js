/* global define, require, $ws */
define('js!SBIS3.CONTROLS.Data.Collection.TreeChildren', [
   'js!SBIS3.CONTROLS.Data.Collection.ITreeChildren',
   'js!SBIS3.CONTROLS.Data.Collection.List',
   'js!SBIS3.CONTROLS.Data.Utils',
   'js!SBIS3.CONTROLS.Data.Collection.TreeItem'
], function (ITreeChildren, List, Utils) {
   'use strict';

   /**
    * Список дочерних элементов узла дерева.
    * @class SBIS3.CONTROLS.Data.Collection.TreeChildren
    * @extends SBIS3.CONTROLS.Data.Collection.List
    * @mixes SBIS3.CONTROLS.Data.Collection.ITreeChildren
    * @public
    * @author Мальцев Алексей
    */

   var TreeChildren = List.extend([ITreeChildren], /** @lends SBIS3.CONTROLS.Data.Collection.TreeChildren.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Collection.TreeChildren',
      $protected: {
         _options: {
            /**
             * @cfg {SBIS3.CONTROLS.Data.Collection.TreeItem} Узел-владелец
             */
            owner: undefined
         },

         /**
          * @var {SBIS3.CONTROLS.Data.Collection.TreeItem[]} Элементы списка
          */
         _items: [],

         _itemModule: 'SBIS3.CONTROLS.Data.Collection.TreeItem',

         _unwrapOnRead: false
      },

      $constructor: function (cfg) {
         cfg = cfg || {};

         if (typeof cfg.owner !== 'object') {
            throw new Error('Tree children owner should be an object');
         }
         if (!$ws.helpers.instanceOfModule(cfg.owner, 'SBIS3.CONTROLS.Data.Collection.TreeItem')) {
            throw new Error('Tree children owner should be an instance of SBIS3.CONTROLS.Data.Collection.TreeItem');
         }
      },

      //region SBIS3.CONTROLS.Data.Collection.IEnumerable

      //endregion SBIS3.CONTROLS.Data.Collection.IEnumerable

      //region SBIS3.CONTROLS.Data.Collection.IList

      /**
       * Добавляет элемент
       * @param {SBIS3.CONTROLS.Data.Collection.TreeItem|*} item Элемент
       * @param {Number} [at] Позиция, в которую добавляется элемент (по умолчанию - в конец)
       */
      add: function (item, at) {
         TreeChildren.superclass.add.call(this, item, at);
      },

      /**
       * Возвращает элемент по позиции
       * @param {Number} index Позиция
       * @returns {SBIS3.CONTROLS.Data.Collection.TreeItem} Элемент списка
       */
      at: function (index) {
         return TreeChildren.superclass.at.call(this, index);
      },

      /**
       * Удаляет элемент
       * @param {SBIS3.CONTROLS.Data.Collection.TreeItem|*} item Удаляемый элемент
       */
      remove: function (item) {
         TreeChildren.superclass.remove.call(this, item);
      },

      removeAt: function (index) {
         if (this._isValidIndex(index)) {
            this._items[index].setParent();
         }
         List.prototype.removeAt.call(this, index);
      },

      /**
       * Заменяет элемент
       * @param {SBIS3.CONTROLS.Data.Collection.ITreeItem|*} item Заменяющий элемент
       * @param {Number} at Позиция, в которой будет произведена замена
       */
      replace: function (item, at) {
         TreeChildren.superclass.replace.call(this, item, at);
      },

      /**
       * Возвращает индекс дочернего элемента
       * @param {SBIS3.CONTROLS.Data.Collection.ITreeItem|*} item Искомый элемент
       * @returns {Number} Индекс элемента или -1, если не найден
       */
      getIndex: function (item) {
         return TreeChildren.superclass.getIndex.call(this, item);
      },

      //endregion SBIS3.CONTROLS.Data.Collection.IList

      //region SBIS3.CONTROLS.Data.Collection.ITreeChildren

      /**
       * Возвращает узел-владелец
       * @returns {SBIS3.CONTROLS.Data.Collection.TreeItem}
       */
      getOwner: function () {
         return this._options.owner;
      },

      //endregion SBIS3.CONTROLS.Data.Collection.ITreeChildren

      //region Protected methods

      /**
       * Превращает объект в элемент дерева
       * @param {*} item Объект
       * @returns {SBIS3.CONTROLS.Data.Collection.TreeItem}
       * @private
       */
      _convertToItem: function (item) {
         if ($ws.helpers.instanceOfModule(item, this._itemModule)) {
            item.setOwner(this);
            item.setParent(this._options.owner);
            return item;
         }

         if ($ws.helpers.instanceOfMixin(item, 'SBIS3.CONTROLS.Data.Collection.ICollectionItem')) {
            item =  item.getContents();
         }
         var children,
            childrenField = this._options.owner.getChildrenField(),
            node = false;
         if (childrenField) {
            children = Utils.getItemPropertyValue(item, childrenField);
            if (children) {
               node = true;
            }
         }

         return $ws.single.ioc.resolve(this._itemModule, {
            owner: this,
            contents: item,
            parent: this._options.owner,
            node: node,
            children: children,
            childrenField: childrenField
         });
      }

      //endregion Protected methods

   });

   $ws.single.ioc.bind('SBIS3.CONTROLS.Data.Collection.TreeChildren', function(config) {
      return new TreeChildren(config);
   });

   return TreeChildren;
});
