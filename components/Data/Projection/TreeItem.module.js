/* global define, require, $ws */
define('js!SBIS3.CONTROLS.Data.Projection.TreeItem', [
   'js!SBIS3.CONTROLS.Data.Projection.CollectionItem',
   'js!SBIS3.CONTROLS.Data.Di'
], function (CollectionItem, Di) {
   'use strict';

   /**
    * Элемент дерева
    * @class SBIS3.CONTROLS.Data.Projection.TreeItem
    * @extends SBIS3.CONTROLS.Data.Projection.CollectionItem
    * @public
    * @author Мальцев Алексей
    */
   var TreeItem = CollectionItem.extend(/** @lends SBIS3.CONTROLS.Data.Projection.TreeItem.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Projection.TreeItem',
      $protected: {
         _options: {
            /**
             * @cfg {SBIS3.CONTROLS.Data.Projection.TreeItem} Родительский узел
             */
            parent: undefined,

            /**
             * @cfg {Boolean} Является узлом
             */
            node: false,

            /**
             * @cfg {Boolean} Развернут или свернут узел. По умолчанию свернут.
             */
            expanded: false,

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

      //region Public methods

      /**
       * Возвращает родительский узел
       * @returns {SBIS3.CONTROLS.Data.Projection.TreeItem}
       */
      getParent: function () {
         return this._options.parent;
      },

      /**
       * Устанавливает родительский узел
       * @param {SBIS3.CONTROLS.Data.Projection.TreeItem} parent Родительский узел
       * @param {Boolean} [silent=false] Не генерировать событие
       */
      setParent: function (parent, silent) {
         if (this._options.parent === parent) {
            return;
         }
         this._options.parent = parent;
         if (!silent) {
            this._notifyItemChangeToOwner('parent');
         }
      },

      /**
       * Возвращает корневой элемент дерева
       * @returns {SBIS3.CONTROLS.Data.Projection.TreeItem}
       */
      getRoot: function () {
         if (this._options.parent === this) {
            return;
         }
         return this._options.parent ? this._options.parent.getRoot() : this;
      },

      /**
       * Является ли корнем дерева
       * @returns {Boolean}
       */
      isRoot: function () {
         return !this._options.parent;
      },

      /**
       * Возвращает уровень вложенности относительно корня
       * @returns {Number}
       */
      getLevel: function () {
         return this._options.parent ? this._options.parent.getLevel() + 1 : 0;
      },

      /**
       * Является ли элемент узлом
       * @returns {Boolean}
       */
      isNode: function () {
         return this._options.node;
      },

      /**
       * Возвращает признак, что узел развернут
       * @returns {Boolean}
       */
      isExpanded: function () {
         return this._options.expanded;
      },

      /**
       * Устанавливает признак, что узел развернут или свернут
       * @param {Boolean} expanded Развернут или свернут узел
       */
      setExpanded: function (expanded) {
         if (this._options.expanded === expanded) {
            return;
         }
         this._options.expanded = expanded;
         this._notifyItemChangeToOwner('expanded');
      },

      /**
       * Переключает признак, что узел развернут или свернут
       */
      toggleExpanded: function () {
         this.setExpanded(!this.isExpanded());
      },

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
         if (rootOwner && rootOwner !== this._options.owner) {
            rootOwner.notifyItemChange(this, property);
         }
      }

      //endregion Protected methods

   });

   Di.register('projection.tree-item', TreeItem);

   return TreeItem;
});
