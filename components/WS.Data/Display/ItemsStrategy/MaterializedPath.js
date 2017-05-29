/* global define */
define('js!WS.Data/Display/ItemsStrategy/MaterializedPath', [
   'js!WS.Data/Display/ItemsStrategy/Abstract',
   'js!WS.Data/Utils',
   'js!WS.Data/Di'
], function (
   Abstract,
   Utils,
   Di
) {
   'use strict';

   /**
    * Стратегия получения элементов проекции по материализованному пути из порядковых номеров элементов в коллекции
    * @class WS.Data/Display/ItemsStrategy/MaterializedPath
    * @extends WS.Data/Display/ItemsStrategy/Abstract
    * @public
    * @author Мальцев Алексей
    */

   var MaterializedPath = Abstract.extend(/** @lends WS.Data/Display/ItemsStrategy/MaterializedPath.prototype */{
      /**
       * @typedef {Object} Options
       * @property {String|Function} itemModule Алиас зависимости или конструктора элементов проекции
       * @property {String} childrenProperty Имя свойства, хранящего вложенных детей узла
       * @property {String} nodeProperty Имя свойства, хранящего признак "узел/лист"
       * @property {String} loadedProperty Имя свойства, хранящего признак "загружен"
       * @property {WS.Data/Display/TreeItem} root Корень
       */

      _moduleName: 'WS.Data/Display/ItemsStrategy/MaterializedPath',

      /**
       * @member {Array.<Array.<Number>>} Соответствие "индекс в коллекции" - "путь"
       */
      _indexToPath: null,

      constructor: function $MaterializedPath(display, options) {
         this._indexToPath = [];
         MaterializedPath.superclass.constructor.call(this, display, options);
      },

      //region Public methods

      at: function (index) {
         if (!this._items[index]) {
            var path = this._getPathTo(this._collection, index),
               source;

            if (path) {
               source = this._getItemByPath(this._collection, path);
            }

            if (source) {
               this._items[index] = this.convertToItem(source);

               var parent = this._getParent(index, path);
               if (parent) {
                  this._items[index].setParent(parent);
               }
            }
         }

         return this._items[index];
      },

      getCount: function() {
         var index = 0;
         while (this.at(index) !== undefined) {
            index++;
         }
         return index;
      },

      getItems: function () {
         var index = 0;
         while (this.at(index) !== undefined) {
            index++;
         }
         return this._items;
      },

      splice: function (start) {
         this._items.length = start;
         this._indexToPath.length = start;
      },

      addSorters: function (sorters) {
         MaterializedPath.superclass.addSorters.call(this, sorters);

         sorters.push({
            name: 'tree',
            enabled: true,
            method: MaterializedPath.sortItems,
            options: function() {
               return {
                  indexToPath: this._indexToPath
               };
            }.bind(this)
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
      },

      //endregion Public methods

      //region Protected methods

      /**
       * Возвращает путь до элемента с порядковым номером
       * @param {Array|WS.Data/Collection/IList|WS.Data/Collection/IEnumerable} collection Коллекция
       * @param {Number} index Порядковый номер
       * @return {Array.<Number>}
       * @protected
       */
      _getPathTo: function(collection, index) {
         if (this._indexToPath[index]) {
            return this._indexToPath[index];
         }

         var childrenProperty = this._options.childrenProperty,
            current,
            iterator,
            path;

         iterator = function(search, parent, path) {
            var isArray = parent instanceof Array,
               isList = parent._wsDataCollectionIList,//CoreInstance.instanceOfMixin(parent, 'WS.Data/Collection/IList')
               isEnumerable = parent._wsDataCollectionIEnumerable,//CoreInstance.instanceOfMixin(parent, 'WS.Data/Collection/IEnumerable')
               enumerator,
               isLast,
               item,
               children,
               sub,
               index;

            index = 0;
            for(;;) {
               if (isArray) {
                  isLast = parent.length <= index;
                  if (!isLast) {
                     item = parent[index];
                  }
               } else if (isList) {
                  isLast = parent.getCount() <= index;
                  if (!isLast) {
                     item = parent.at(index);
                  }
               } else if (isEnumerable) {
                  if (!enumerator) {
                     enumerator = parent.getEnumerator();
                  }
                  item = enumerator.getNext();
                  isLast = item === undefined;
               } else {
                  throw new TypeError('Unsupported object type: only Array, WS.Data/Collection/IList or WS.Data/Collection/IEnumerable are supported.');
               }

               if (isLast) {
                  break;
               }

               if (search === current) {
                  return path.concat(index);
               }

               current++;

               children = Utils.getItemPropertyValue(item, childrenProperty);
               if (children instanceof Object) {
                  sub = iterator(search, children, path.concat(index));
                  if (sub) {
                     return sub;
                  }

               }

               index++;
            }
         };

         current = 0;
         path = iterator(index, collection, []);
         if (path) {
            this._indexToPath[index] = path;
         }

         return path;
      },

      /**
       * Возвращает элемент, находящийся по указанному пути
       * @param {Array|WS.Data/Collection/IList|WS.Data/Collection/IEnumerable} collection Коллекция
       * @param {Array.<Number>} path Путь до элемента
       * @return {*}
       * @protected
       */
      _getItemByPath: function(collection, path) {
         var childrenProperty = this._options.childrenProperty,
            item = collection,
            level;

         for (level = 0; level < path.length;) {
            item = this._getItemAt(collection, path[level]);
            level++;
            if (level < path.length) {
               collection = Utils.getItemPropertyValue(item, childrenProperty);
            }
         }
         return item;
      },

      /**
       * Возвращает родителя элемента с указанными порядковым номером и путем
       * @param {Number} index Порядковый номер элемента
       * @param {Array.<Number>} path Путь до элемента
       * @return {WS.Data/Display/CollectionItem} Родитель элемента
       * @protected
       */
      _getParent: function (index, path) {
         var parentPath = path.slice(0, path.length - 1);
         if (parentPath.length) {
            var parentSource = this._getItemByPath(this._collection, parentPath);
            if (parentSource) {
               for (var i = index - 1; i >=0; i--) {
                  if (this._items[i] && this._items[i].getContents() === parentSource) {
                     return this._items[i];
                  }
               }
            }
         } else {
            return typeof this._options.root === 'function' ? this._options.root() : this._options.root;
         }
      },

      /**
       * Возвращает элемент по индексу в родителе
       * @param {Array|WS.Data/Collection/IList|WS.Data/Collection/IEnumerable} collection Родитель
       * @param {Number} at Индекс элемента
       * @return {*}
       * @protected
       */
      _getItemAt: function(collection, at) {
         var isArray = collection instanceof Array,
            isList = collection._wsDataCollectionIList,//CoreInstance.instanceOfMixin(collection, 'WS.Data/Collection/IList')
            isEnumerable = collection._wsDataCollectionIEnumerable,//CoreInstance.instanceOfMixin(collection, 'WS.Data/Collection/IEnumerable')
            item;

         if (isArray) {
            item = collection[at];
         } else if (isList) {
            item = collection.at(at);
         } else if (isEnumerable) {
            var enumerator = collection.getEnumerator(),
               current,
               index = 0;
            while ((current = enumerator.getNext()) !== undefined) {
               if (index === at) {
                  item = current;
                  break;
               }
               index++;
            }
         } else {
            throw new TypeError('Unsupported object type: only Array, WS.Data/Collection/IList or WS.Data/Collection/IEnumerable are supported.');
         }

         if (item === undefined) {
            throw new ReferenceError('Item at ' + at + ' is out of range.');
         }

         return item;
      }

      //endregion Protected methods
   });

   /**
    * Создает индекс сортировки по материализованному пути - от корневой вершины вглубь до конечных вершин
    * @param {Array.<WS.Data/Display/CollectionItem>} items Элементы проекции.
    * @param {Array.<Number>} current Текущий индекс сортировки
    * @param {Object} options Опции
    * @return {Array.<Number>}
    */
   MaterializedPath.sortItems = function (items, current, options) {
      var pathToString = function(path) {
            return path.join('.');
         },
         getIndexByPath = function(path) {
            return stringPathToIndex[pathToString(path)];
         },
         comparePaths = function(pathA, pathB) {
            var realIndexA = getIndexByPath(pathA),
               realIndexB = getIndexByPath(pathB);

            return current.indexOf(realIndexA) - current.indexOf(realIndexB);
         },
         indexToPath = options.indexToPath,
         stringIndexToPath = indexToPath.map(pathToString),
         stringPathToIndex = {};

      stringIndexToPath.forEach(function(path, index) {
         stringPathToIndex[path] = index;
      });

      return current.slice().sort(function(indexA, indexB) {
         var pathA = indexToPath[indexA],
            pathB = indexToPath[indexB],
            pathALength = pathA.length,
            pathBLength = pathB.length,
            minLength = Math.min(pathALength, pathBLength),
            result = 0,
            level;

         //Going deep into path and compare each level
         for(level = 0; level < minLength; level++) {
            //Same paths are equal
            if (pathA[level] === pathB[level]) {
               continue;
            }

            //Different paths possibly are not equal
            result = comparePaths(
               pathA.slice(0, 1 + level),
               pathB.slice(0, 1 + level)
            );

            if (result !== 0) {
               //Paths are not equal
               break;
            }
         }

         //Equal paths but various level: child has deeper level than parent, child should be after parent
         if (result === 0 && pathALength !== pathBLength) {
            result = pathALength - pathBLength;
         }

         return result;
      });
   };

   return MaterializedPath;
});
