/* global define, require, $ws */
define('js!SBIS3.CONTROLS.Data.Projection.TreeItem', [
   'js!SBIS3.CONTROLS.Data.Projection.CollectionItem',
   'js!SBIS3.CONTROLS.Data.Projection.ITreeItem'
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
      }

      //endregion Protected methods

   });

   $ws.single.ioc.bind('SBIS3.CONTROLS.Data.Projection.TreeItem', function(config) {
      return new TreeItem(config);
   });

   return TreeItem;
});
