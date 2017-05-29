/* global define, require */
define('js!WS.Data/Display/TreeItem', [
   'js!WS.Data/Display/CollectionItem',
   'js!WS.Data/Di'
], function (
   CollectionItem,
   Di
) {
   'use strict';

   /**
    * Элемент дерева
    * @class WS.Data/Display/TreeItem
    * @extends WS.Data/Display/CollectionItem
    * @public
    * @author Мальцев Алексей
    */
   var TreeItem = CollectionItem.extend(/** @lends WS.Data/Display/TreeItem.prototype */{
      _moduleName: 'WS.Data/Display/TreeItem',

      /**
       * @cfg {WS.Data/Display/TreeItem} Родительский узел
       * @name WS.Data/Display/TreeItem#parent
       */
      _$parent: undefined,

      /**
       * @cfg {Boolean} Является узлом
       * @name WS.Data/Display/TreeItem#node
       */
      _$node: false,

      /**
       * @cfg {Boolean} Развернут или свернут узел. По умолчанию свернут.
       * @name WS.Data/Display/TreeItem#expanded
       */
      _$expanded: false,

      /**
       * @cfg {Boolean} Загружен ли узел. По умолчанию не загружен.
       * @name WS.Data/Display/TreeItem#loaded
       */
      _$loaded: false,

      /**
       * @cfg {String} Название свойства, содержащего дочерние элементы узла. Используется для анализа на наличие дочерних элементов.
       * @name WS.Data/Display/TreeItem#childrenProperty
       */
      _$childrenProperty: '',

      _instancePrefix: 'tree-item-',

      constructor: function $TreeItem(options) {
         TreeItem.superclass.constructor.call(this, options);
         this._$node = !!this._$node;
         this._$loaded = !!this._$loaded;
      },

      //region WS.Data/Entity/SerializableMixin

      _getSerializableState: function(state) {
         state =  TreeItem.superclass._getSerializableState.call(this, state);

         delete state.$options.parent;

         return state;
      },

      //endregion WS.Data/Entity/SerializableMixin

      //region Public methods

      /**
       * Возвращает родительский узел
       * @return {WS.Data/Display/TreeItem}
       */
      getParent: function () {
         return this._$parent;
      },

      /**
       * Устанавливает родительский узел
       * @param {WS.Data/Display/TreeItem} parent Родительский узел
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
       * @return {WS.Data/Display/TreeItem}
       */
      getRoot: function () {
         if (this._$parent === this) {
            return;
         }
         return this._$parent ? this._$parent.getRoot() : this;
      },

      /**
       * Является ли корнем дерева
       * @return {Boolean}
       */
      isRoot: function () {
         return !this._$parent;
      },

      /**
       * Возвращает уровень вложенности относительно корня
       * @return {Number}
       */
      getLevel: function () {
         if (this._$parent) {
            return this._$parent.getLevel() + 1;
         }
         var owner = this.getOwner();
         return owner && owner.isRootEnumerable() ? 1 : 0;
      },

      /**
       * Возвращает признак, является ли элемент узлом
       * @return {Boolean}
       */
      isNode: function () {
         return this._$node;
      },

      /**
       * Устанавливает признак, является ли элемент узлом
       * @param {Boolean} node Является ли элемент узлом
       */
      setNode: function (node) {
         this._$node = node;
      },

      /**
       * Возвращает признак, что узел развернут
       * @return {Boolean}
       */
      isExpanded: function () {
         return this._$expanded;
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
       * @return {Boolean}
       */
      isLoaded: function () {
         return this._$loaded;
      },

      /**
       * Устанавливает свойство загруженности узла
       * @param {Boolean} value
       */
      setLoaded: function (value) {
         this._$loaded = !!value;
      },


      /**
       * Возвращает название свойства, содержащего дочерние элементы узла
       * @return {String}
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
       * @protected
       */
      _notifyItemChangeToOwner: function(property) {
         TreeItem.superclass._notifyItemChangeToOwner.call(this, property);

         var root = this.getRoot(),
            rootOwner = root ? root.getOwner() : undefined;
         if (rootOwner && rootOwner !== this._$owner) {
            rootOwner.notifyItemChange(this, property);
         }
      }

      //endregion Protected methods

   });

   Di.register('display.tree-item', TreeItem);

   return TreeItem;
});
