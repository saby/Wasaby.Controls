/* global define, require, $ws */
define('js!SBIS3.CONTROLS.Data.Projection.TreeItem', [
   'js!SBIS3.CONTROLS.Data.Projection.CollectionItem',
   'js!SBIS3.CONTROLS.Data.Di',
   'js!SBIS3.CONTROLS.Data.Utils'
], function (CollectionItem, Di, Utils) {
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

      /**
       * @cfg {SBIS3.CONTROLS.Data.Projection.TreeItem} Родительский узел
       * @name SBIS3.CONTROLS.Data.Projection.TreeItem#parent
       */
      _$parent: undefined,

      /**
       * @cfg {Boolean} Является узлом
       * @name SBIS3.CONTROLS.Data.Projection.TreeItem#node
       */
      _$node: false,

      /**
       * @cfg {Boolean} Развернут или свернут узел. По умолчанию свернут.
       * @name SBIS3.CONTROLS.Data.Projection.TreeItem#expanded
       */
      _$expanded: false,

      /**
       * @cfg {String} Название свойства, содержащего дочерние элементы узла. Используется для анализа на наличие дочерних элементов.
       * @name SBIS3.CONTROLS.Data.Projection.TreeItem#childrenProperty
       */
      _$childrenProperty: '',

      /**
       * @cfg {String} Название свойства, содержащего признак загруженности узла
       * <pre>
       *    new TreeItem({
       *       loadedProperty: 'Раздел$'
       *    })
       * </pre>
       *
       */
      _$loadedProperty: '',

      _hashPrefix: 'tree-item-',

      constructor: function $TreeItem(options) {
         TreeItem.superclass.constructor.call(this, options);
         this._$node = !!this._$node;
      },

      //region Public methods

      /**
       * Возвращает родительский узел
       * @returns {SBIS3.CONTROLS.Data.Projection.TreeItem}
       */
      getParent: function () {
         return this._$parent;
      },

      /**
       * Устанавливает родительский узел
       * @param {SBIS3.CONTROLS.Data.Projection.TreeItem} parent Родительский узел
       * @param {Boolean} [silent=false] Не генерировать событие
       */
      setParent: function (parent, silent) {
         if (this._$parent === parent) {
            return;
         }
         this._$parent = parent;
         if (!silent) {
            this._notifyItemChangeToOwner('parent');
         }
      },

      /**
       * Возвращает корневой элемент дерева
       * @returns {SBIS3.CONTROLS.Data.Projection.TreeItem}
       */
      getRoot: function () {
         if (this._$parent === this) {
            return;
         }
         return this._$parent ? this._$parent.getRoot() : this;
      },

      /**
       * Является ли корнем дерева
       * @returns {Boolean}
       */
      isRoot: function () {
         return !this._$parent;
      },

      /**
       * Возвращает уровень вложенности относительно корня
       * @returns {Number}
       */
      getLevel: function () {
         return this._$parent ? this._$parent.getLevel() + 1 : 0;
      },

      /**
       * Является ли элемент узлом
       * @returns {Boolean}
       */
      isNode: function () {
         return this._$node;
      },

      /**
       * Возвращает признак, что узел развернут
       * @returns {Boolean}
       */
      isExpanded: function () {
         return this._$expanded;
      },

      /**
       * Устанавливает свойство наличия дочерних элементов
       * @param {String} name
       * @see loadedProperty
       */
      setLoadedProperty: function (name) {
         this._$loadedProperty = name;
      },

      /**
       * Возвращает название свойства наличия дочерних элементов
       * @returns {String}
       * @see loadedProperty
       */
      getLoadedProperty: function () {
         return this._$loadedProperty;
      },

      /**
       * Устанавливает признак, что узел развернут или свернут
       * @param {Boolean} expanded Развернут или свернут узел
       */
      setExpanded: function (expanded) {
         if (this._$expanded === expanded) {
            return;
         }
         this._$expanded = expanded;
         this._notifyItemChangeToOwner('expanded');
      },

      /**
       * Переключает признак, что узел развернут или свернут
       */
      toggleExpanded: function () {
         this.setExpanded(!this.isExpanded());
      },

      /**
       * Возвращает значение свойства загруженности узла
       * @returns {Boolean}
       */
      isLoaded: function () {
         this._checkLoadedProperty();
         return Utils.getItemPropertyValue(this.getContents(), this.getLoadedProperty());
      },

      /**
       * Устанавливает свойство загруженности узла
       * @param {Boolean} value
       */
      setLoaded: function (value) {
         this._checkLoadedProperty();
         Utils.setItemPropertyValue(this.getContents(), this.getLoadedProperty(), !!value);
      },


      /**
       * Возвращает название свойства, содержащего дочерние элементы узла
       * @returns {String}
       */
      getChildrenProperty: function () {
         return this._$childrenProperty;
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
         if (rootOwner && rootOwner !== this._$owner) {
            rootOwner.notifyItemChange(this, property);
         }
      },

      _checkLoadedProperty: function() {
         if(!this.getLoadedProperty()) {
            throw new Error('Loaded property is not defined, please set it and try again.');
         }
      }

      //endregion Protected methods

   });

   Di.register('projection.tree-item', TreeItem);

   return TreeItem;
});
