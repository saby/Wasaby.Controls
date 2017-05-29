/* global define */
define('js!WS.Data/Display/ItemsStrategy/AdjacencyList', [
   'js!WS.Data/Display/ItemsStrategy/Direct',
   'js!WS.Data/Utils',
   'js!WS.Data/Di'
], function (
   Direct,
   Utils,
   Di
) {
   'use strict';

   /**
    * Стратегия получения элементов проекции по списку смежных вершин
    * @class WS.Data/Display/ItemsStrategy/AdjacencyList
    * @extends WS.Data/Display/ItemsStrategy/Direct
    * @public
    * @author Мальцев Алексей
    */

   var AdjacencyList = Direct.extend(/** @lends WS.Data/Display/ItemsStrategy/AdjacencyList.prototype */{
      /**
       * @typedef {Object} Options
       * @property {String|Function} itemModule Алиас зависимости или конструктора элементов проекции
       * @property {String} idProperty Имя свойства, хранящего первичный ключ
       * @property {String} parentProperty Имя свойства, хранящего первичный ключ родителя
       * @property {String} nodeProperty Имя свойства, хранящего признак "узел/лист"
       * @property {String} loadedProperty Имя свойства, хранящего признак "загружен"
       * @property {Boolean} unique Отслеживать уникальность первичного ключа
       * @property {WS.Data/Display/TreeItem} root Корень
       */

      _moduleName: 'WS.Data/Display/ItemsStrategy/AdjacencyList',

      constructor: function $AdjacencyList(display, options) {
         options = options || {};

         AdjacencyList.superclass.constructor.call(this, display, options);

         if (!options.idProperty) {
            Utils.logger.info(this._moduleName +'::constructor(): option "idProperty" is not defined - only root elements will be fetched');
         }
      },

      //region Public methods

      addSorters: function (sorters) {
         AdjacencyList.superclass.addSorters.call(this, sorters);

         sorters.push({
            name: 'tree',
            enabled: true,
            method: AdjacencyList.sortItems,
            options: this._options
         });
      },

      convertToItem: function (source, options) {
         var loadedProperty = this._options.loadedProperty,
            invertLoaded = false,
            loaded;
         if (typeof loadedProperty === 'string' && loadedProperty[0] === '!') {
            loadedProperty = loadedProperty.substr(1);
            invertLoaded = true;
         }
         loaded = Utils.getItemPropertyValue(source, loadedProperty);

         options = options || {};
         options.contents = source;
         options.owner = this._display;
         options.loaded = invertLoaded ? !loaded : loaded;
         if (!('node' in options)) {
            options.node = Utils.getItemPropertyValue(source, this._options.nodeProperty);
         }

         return Di.resolve(this.getItemModule(), options);
      }

      //endregion Public methods

      //region Protected methods

      //endregion Protected methods
   });

   /**
    * Создает индекс сортировки в порядке списка смежных вершин - от корневой вершины вглубь до конечных вершин
    * @param {Array.<WS.Data/Display/CollectionItem>} items Элементы проекции.
    * @param {Array.<Number>} current Текущий индекс сортировки
    * @param {Object} options Опции
    * @return {Array.<Number>}
    */
   AdjacencyList.sortItems = function (items, current, options) {
      var push = Array.prototype.push,
         root = typeof options.root === 'function' ? options.root() : options.root,
         idProperty = options.idProperty,
         parentProperty = options.parentProperty,
         unique = options.unique,
         treeIndex = {},
         itemsProcessed = {},
         parentsProcessing = {},

         getChildren = function(parent) {
            var result = [],
               parentData = parent.getContents(),
               parentId = parentData instanceof Object ? Utils.getItemPropertyValue(
                  parentData,
                  idProperty
               ) : parentData,
               children = treeIndex[parentId] || [];

            if (parentsProcessing[parentId]) {
               Utils.logger.error(AdjacencyList.prototype._moduleName +': recursive traversal detected: parent with id "' + parentId + '" is already in progress.');
            } else {
               //FIXME: для совместимости с логикой контролов - корневые записи дерева могут вообще не иметь поля с именем parentProperty
               if (!children.length && parentId === null && parent.isRoot()) {
                  //Считаем, что элементы коллекции без поля parentProperty находятся в корне
                  children = treeIndex[undefined] || [];
               }

               var i, child;
               for (i = 0; i < children.length; i++) {
                  child = items[children[i]];
                  if (child) {
                     child.setParent(parent, true);
                  }

                  result.push(children[i]);
                  if (child && idProperty && parentProperty) {
                     parentsProcessing[parentId] = true;
                     push.apply(
                        result,
                        getChildren(child)
                     );
                     parentsProcessing[parentId] = false;
                  }
               }
            }

            return result;
         };

      var index,
         count,
         item,
         itemId,
         itemIndex,
         parentId;

      for (index = 0, count = current.length; index < count; index++) {
         itemIndex = current[index];
         item = items[itemIndex];
         //Корень не должен попасть в индекс, иначе он может быть найден среди среди собственных детей
         if (item === root) {
            continue;
         }

         if (unique) {
            itemId = Utils.getItemPropertyValue(
               item.getContents(),
               idProperty
            );
            if (itemsProcessed[itemId]) {
               continue;
            }
            itemsProcessed[itemId] = true;
         }

         //TODO: научиться работать с parentId === Object|Array
         parentId = Utils.getItemPropertyValue(
            item.getContents(),
            parentProperty
         );
         if (!treeIndex.hasOwnProperty(parentId)) {
            treeIndex[parentId] = [];
         }
         treeIndex[parentId].push(itemIndex);
      }

      return getChildren(root);
   };

   return AdjacencyList;
});
