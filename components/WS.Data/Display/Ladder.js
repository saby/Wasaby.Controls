define('js!WS.Data/Display/Ladder', [
   'Core/core-extend',
   'Core/core-instance',
   'js!WS.Data/Collection/IBind',
   'js!WS.Data/Entity/Abstract',
   'js!WS.Data/Utils'
], function (
   CoreExtend,
   CoreInstance,
   IBindCollection,
   Abstract,
   Utils
) {
   'use strict';

   /**
    * Лесенка - позволяет отслеживать повторяющиеся значения в колонках таблицы.
    * @class WS.Data/Display/Ladder
    * @extends WS.Data/Entity/Abstract
    * @public
    * @author Мальцев Алексей Александрович
    */
   var Ladder = CoreExtend.extend(Abstract, /** @lends WS.Data/Display/Ladder.prototype */{
      /**
       * @member {WS.Data/Display/Collection} Проекция, по которой строится лесенка
       */
      _collection: null,

      /**
       * @member {Object.<String, Function>|null} Конвертер значений
       */
      _converters: null,

      /**
       * @member {Array.<String>} Названия колонок, входящих в лесенку
       */
      _columnNames: null,

      /**
       * @member {Object.<String, Object.<String, Boolean>>} Лесенка по ключу элементов для каждого поля
       */
      _column2primaryId: null,

      /**
       * @member {Function} Обработчик события изменения проекции
       */
      _onCollectionChangeHandler: null,

      /**
       * @member {Function} Обработчик события изменения элемента проекции
       */
      _onCollectionItemChangeHandler: null,

      /**
       * Конструктор лесенки.
       * @param {WS.Data/Display/Collection} collection Проекция, по которой строится лесенка.
       */
      constructor: function $Ladder(collection) {
         Ladder.superclass.constructor.call(this);

         this._columnNames = [];
         this._column2primaryId = {};

         this._onCollectionChangeHandler = this._onCollectionChange.bind(this);
         this._onCollectionItemChangeHandler = this._onCollectionItemChange.bind(this);
         if (collection) {
            this.setCollection(collection);
         }
      },

      destroy: function() {
         this.setCollection(null);
         Ladder.superclass.destroy.call(this);
      },

      /**
       * Возвращает проекцию коллекции, по которой строится лесенка.
       * @return {WS.Data/Display/Collection|null}
       */
      getCollection: function() {
         return this._collection;
      },

      /**
       * Устанавливает проекцию коллекции, по которой строится лесенка.
       * @param {WS.Data/Display/Collection|null} collection Проекция, по которой строится лесенка.
       */
      setCollection: function(collection) {
         if (collection !== null && !CoreInstance.instanceOfModule(collection, 'WS.Data/Display/Collection')) {
            throw new TypeError('Argument "collection" should be an instance of WS.Data/Display/Collection');
         }

         if (this._collection) {
            this._collection.unsubscribe('onCollectionChange', this._onCollectionChangeHandler);
            this._collection.unsubscribe('onCollectionItemChange', this._onCollectionItemChangeHandler);
         }

         this._collection = collection;

         if (collection) {
            collection.subscribe('onCollectionChange', this._onCollectionChangeHandler);
            collection.subscribe('onCollectionItemChange', this._onCollectionItemChangeHandler);
         }

         this.reset();
      },

      reset: function() {
         if (this._columnNames.length > 0 && this._collection) {
            var ids = [];
            this._collection.each(function (item) {
               ids.push(this._getCollectionItemId(item));
            }.bind(this));
            this._columnNames.forEach(function (name) {
               var column = this._column2primaryId[name];
               for (var id in column) {
                  if (column.hasOwnProperty(id) && ids.indexOf(id) < 0) {
                     delete column[id];
                  }
               }
            }.bind(this));
         }
      },

      /**
       * Устанавливает конвертер значения поля
       * @param {String} columnName Название поля
       * @param {Function(*): String} converter Конвертер значения поля
       * @return {*}
       */
      setConverter: function(columnName, converter) {
         this._converters = this._converters || {};
         this._converters[columnName] = converter;
      },

      /**
       * Возвращает значение поля с учетом лесенки
       * @param {*} item Элемент коллекции, для котрой построена проекция
       * @param {String} columnName Название поля
       * @return {String}
       */
      get: function(item, columnName) {
         return this.isPrimary(item, columnName) ?
            Utils.getItemPropertyValue(item, columnName) :
            '';
      },

      /**
       * Возвращает признак, что значение является основным (отображается)
       * @param {*} item Элемент коллекции, для котрой построена проекция
       * @param {String} columnName Название поля
       * @return {Boolean}
       */
      isPrimary: function(item, columnName) {
         this._applyColumn(columnName);

         var id = this._getItemId(item),
            idx;
         if (!this._column2primaryId[columnName].hasOwnProperty(id)) {
            idx = this._collection.getIndexBySourceItem(item);
            this._checkRange(idx, 1);
         }

         return !!this._column2primaryId[columnName][id];
      },

      /**
       * Проверяет, что колонка входит в лесенку
       * @param {String} columnName Название поля
       * @return {Boolean}
       */
      isLadderColumn: function(columnName) {
         return this._column2primaryId.hasOwnProperty(columnName);
      },

      _applyColumn: function(columnName) {
         var columnNames = this._columnNames;
         if (columnNames.indexOf(columnName) > -1) {
            return;
         }
         columnNames.push(columnName);
         this._column2primaryId[columnName] = {};
      },

      _onCollectionItemChange: function(event, item, itemIndex) {
         this._notifyPrimaryChanges(this._checkRange(itemIndex - 1, 3));
      },

      _onCollectionChange: function(event, action, newItems, newItemsIndex, oldItems, oldItemsIndex) {
         var self = this,
            push = Array.prototype.push,
            result = [],
            makeSecondary = function(items, index) {
               if (items.length) {
                  var delta;
                  for (var columnName in self._column2primaryId) {
                     if (!self._column2primaryId.hasOwnProperty(columnName)) {
                        continue;
                     }
                     for (delta = 0; delta < items.length; ++delta) {
                        var itemId = self._getCollectionItemId(items[delta]);
                        self._makeSecondary(itemId, index + delta, columnName);
                     }
                  }
               }

            },
            checkItems = function(items, count, startIdx) {
               return count > 0 ? self._checkRange(startIdx - 1, items.length + 2) : [];
            };

         switch (action) {
            case IBindCollection.ACTION_ADD:
               push.apply(result, checkItems(newItems, newItems.length, newItemsIndex));
               break;
            case IBindCollection.ACTION_REMOVE:
               makeSecondary(oldItems, oldItemsIndex);
               push.apply(result, checkItems([], oldItems.length, oldItemsIndex));
               break;
            case IBindCollection.ACTION_MOVE:
               //если запись перемещают на верх то индекс сдвинется
               var startIndex = (newItemsIndex - oldItemsIndex) > 0 ? oldItemsIndex : oldItemsIndex+newItems.length;
               push.apply(result, checkItems([], oldItems.length, startIndex));

               push.apply(result, checkItems(newItems, newItems.length, newItemsIndex));
               break;
            default:
               this.reset();
         }

         this._notifyPrimaryChanges(result);
      },

      _notifyPrimaryChanges: function(changesArray) {
         var collection = this._collection,
            itemIdx,
            idx,
            columnName,
            item,
            props;

         for (idx = 0; idx < changesArray.length; ++idx) {
            if (changesArray[idx] === null) {
               continue;
            }
            itemIdx = changesArray[idx][0];
            columnName = changesArray[idx][1];
            item = collection.at(itemIdx);
            props = {};
            props[columnName] = this.get(item.getContents(), columnName);
            collection.notifyItemChange(
               collection.at(itemIdx),
               {contents: props}
            );
         }
      },

      _checkRange: function(startIdx, length) {
         var result = [],
            lo = Math.max(0, startIdx),
            hi = Math.min(startIdx + length, this._collection.getCount()),
            columnName,
            idx,
            adjusted;
         for (columnName in this._column2primaryId) {
            if (!this._column2primaryId.hasOwnProperty(columnName)) {
               continue;
            }
            for (idx = lo; idx < hi; ++idx) {
               adjusted = this._adjustPrimary(idx, this._collection.at(idx), columnName);
               if (adjusted !== null) {
                  result.push(adjusted);
               }
            }
         }
         return result;
      },

      _adjustPrimary: function(idx, item, columnName) {
         if (
            !item ||
            !this._column2primaryId[columnName]
         ) {
            return null;
         }

         var id = this._getCollectionItemId(item),
            isPrimary = this._isPrimary(idx, columnName),
            oldIsPrimary = this._column2primaryId[columnName][id];
         if (isPrimary !== oldIsPrimary) {
            this['_make' + (isPrimary ? 'Primary' : 'Secondary')](id, idx, columnName);
            return [idx, columnName];
         }

         return null;
      },

      _makePrimary: function(id, idx, columnName) {
         this._column2primaryId[columnName][id] = true;
      },

      _makeSecondary: function(id, idx, columnName) {
         this._column2primaryId[columnName][id] = false;
      },

      _isPrimary: function(idx, columnName) {
         if (idx === 0) {
            return true;
         }
         var prev = this._collection.at(idx - 1).getContents(),
            curr = this._collection.at(idx).getContents(),
            prevVal = Utils.getItemPropertyValue(prev, columnName),
            currVal = Utils.getItemPropertyValue(curr, columnName);

         if (this._converters && this._converters.hasOwnProperty(columnName)) {
            prevVal = this._converters[columnName](prevVal, prev);
            currVal = this._converters[columnName](currVal, curr);
         }

         if ((prevVal instanceof Object) && (currVal instanceof Object)) {
            prevVal = prevVal.valueOf();
            currVal = currVal.valueOf();
         }

         return prevVal !== currVal;
      },

      _getCollectionItemId: function(collectionItem) {
         return this._getItemId(collectionItem.getContents());
      },

      _getItemId: function(item) {
         if (item.getInstanceId instanceof Function) {
            return item.getInstanceId();
         } else if (item.getId instanceof Function) {
            return item.getId();
         } else if (item.get instanceof Function) {
            return item.get('id');
         }
         return item.id;
      }
   });

   return Ladder;
});
