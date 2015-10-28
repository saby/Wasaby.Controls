/* global define, require, $ws */
define('js!SBIS3.CONTROLS.Data.Projection.TreeItem', [
   'js!SBIS3.CONTROLS.Data.Projection.CollectionItem',
   'js!SBIS3.CONTROLS.Data.Projection.ITreeItem',
   'js!SBIS3.CONTROLS.Data.Projection.Tree'
], function (CollectionItem, ITreeItem) {
   'use strict';

   /**
    * Элемент дерева
    * @class SBIS3.CONTROLS.Data.Projection.TreeItem
    * @extends SBIS3.CONTROLS.Data.Projection.CollectionItem
    * @mixes SBIS3.CONTROLS.Data.Projection.ITreeItem
    * @public
    * @author Мальцев Алексей
    */
   var TreeItem = CollectionItem.extend([ITreeItem], /** @lends SBIS3.CONTROLS.Data.Projection.TreeItem.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Projection.TreeItem',
      $protected: {
         _options: {
            /**
             * @cfg {String} Название свойства, содержащего дочерние элементы узла. Используется для анализа на наличие дочерних элементов.
             */
            childrenProperty: ''
         },

         _hashPrefix: 'tree-item-'
      },

      $constructor: function (cfg) {
         cfg = cfg || {};

         if ('node' in cfg) {
            this._options.node = !!cfg.node;
         }

         /*if ('children' in cfg) {
            this._setChildren(cfg.children);
         }*/
      },

      //region SBIS3.CONTROLS.Data.Projection.ITreeItem

      getParent: function () {
         return this._options.parent;
      },

      setParent: function (parent) {
         if (this._options.parent === parent) {
            return;
         }
         this._options.parent = parent;
         this._notifyItemChangeToOwner('parent');
      },

      getRoot: function () {
         return this._options.parent ? this._options.parent.getRoot() : this;
      },

      isRoot: function () {
         return !this._options.parent;
      },

      getLevel: function () {
         return 1 + (this._options.parent ? this._options.parent.getLevel() : 0);
      },

      isNode: function () {
         return this._options.node;
      },

      isExpanded: function () {
         return this._options.expanded;
      },

      setExpanded: function (expanded) {
         if (this._options.expanded === expanded) {
            return;
         }
         this._options.expanded = expanded;
         this._notifyItemChangeToOwner('expanded');
      },

      toggleExpanded: function () {
         this.setExpanded(!this.isExpanded());
      },

      //endregion SBIS3.CONTROLS.Data.Projection.ITreeItem

      //region Public methods

      /**
       * Возвращает название свойства, содержащего дочерние элементы узла
       * @returns {String}
       */
      getChildrenProperty: function () {
         return this._options.childrenProperty;
      },

      /**
       * Генерирует в корневом узле об изменении коллекции дочерних узлов дерева.
       * @param {String} action Действие, приведшее к изменению.
       * @param {SBIS3.CONTROLS.Data.Projection.TreeItem[]} newItems Новые элементы коллеции.
       * @param {Number} newItemsIndex Индекс, в котором появились новые элементы.
       * @param {SBIS3.CONTROLS.Data.Projection.TreeItem[]} oldItems Удаленные элементы коллекции.
       * @param {Number} oldItemsIndex Индекс, в котором удалены элементы.
       * @private
       */
      notifyChildrenChangeToRoot: function (action, newItems, newItemsIndex, oldItems, oldItemsIndex) {
         this._bubbleUp(function() {
            this._notify(
               'onCollectionChange',
               action,
               newItems,
               newItemsIndex,
               oldItems,
               oldItemsIndex
            );
         });
      },

      //endregion Public methods

      //region Protected methods

      /**
       * Генерирует событие у владельца об изменении свойства элемента.
       * Помимо родительской коллекции уведомляет также и корневой узел дерева.
       * @param {String} property Измененное свойство
       * @private
       */
      _notifyItemChangeToOwner: function(property) {
         TreeItem.superclass._notifyItemChangeToOwner.call(this, property);

         var rootOwner = this.getRoot().getOwner();
         if (rootOwner !== this._options.owner) {
            rootOwner.notifyItemChange(this, property);
         }
      },

      /**
       * Обеспечивает всплытие метода до корневого узла и вызов его там
       * @param {Function} callback Метод, который должен быть выполнен на корневом узле
       * @param {Object} [context] Контекст метода (если не задан, то корневой узел)
       * @private
       */
      _bubbleUp: function (callback, context) {
         if (this._options.parent) {
            this._options.parent._bubbleUp(callback);
         } else {
            callback.call(context || this);
         }
      },

      /**
       * Устанавливает коллекцию дочерних элементов узла
       * @param {SBIS3.CONTROLS.Data.Projection.TreeChildren|Array} children Дочерние элементы
       * @private
       */
      _setChildren: function (children) {
         if (children === undefined) {
            return;
         }

         if (children instanceof Array) {
            children = $ws.single.ioc.resolve(this._childrenModule, {
               owner: this,
               items: children
            });
         }

         if (!$ws.helpers.instanceOfModule(children, this._childrenModule)) {
            throw new Error('Tree node children should be an instance of ' + this._childrenModule);
         }

         this._options.children = children;
      }

      //endregion Protected methods

   });

   $ws.single.ioc.bind('SBIS3.CONTROLS.Data.Projection.TreeItem', function(config) {
      return new TreeItem(config);
   });

   return TreeItem;
});
