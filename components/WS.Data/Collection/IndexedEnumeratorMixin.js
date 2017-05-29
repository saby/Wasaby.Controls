/* global define */
define('js!WS.Data/Collection/IndexedEnumeratorMixin', [
   'js!WS.Data/Collection/IBind',
   'js!WS.Data/Utils'
], function (
   IBindCollection,
   Utils
) {
   'use strict';

   /**
    * Миксин, позволящий использовать индесацию элементов в экземплярах, реализующих интерфейс WS.Data/Collection/IEnumerator
    * @mixin WS.Data/Collection/IndexedEnumeratorMixin
    * @public
    * @author Мальцев Алексей
    */

   var IndexedEnumeratorMixin = /**@lends WS.Data/Collection/IndexedEnumeratorMixin.prototype  */{
      /**
       * @member {Object} Индексы, распределенные по полям
       */
      _enumeratorIndexes: null,

      constructor: function () {
         this._enumeratorIndexes = {};
         this._onCollectionChange = this._onCollectionChange.bind(this);
      },

      //region Public methods

      /**
       * Переиндексирует энумератор
       * @param {WS.Data/Collection/IBind/ChangeAction.typedef[]} [action] Действие, приведшее к изменению.
       * @param {Number} [start=0] С какой позиции переиндексировать
       * @param {Number} [count=0] Число переиндексируемых элементов
       */
      reIndex: function (action, start, count) {
         switch (action){
            case IBindCollection.ACTION_ADD:
               this._shiftIndex(start, count);
               this._addToIndex(start, count);
               break;
            case IBindCollection.ACTION_REMOVE:
               this._removeFromIndex(start, count);
               this._shiftIndex(start + count, -count);
               break;
            case IBindCollection.ACTION_REPLACE:
               this._replaceInIndex(start, count);
               break;
            default:
               this._resetIndex();
         }
      },

      /**
       * Возвращает индекс первого элемента с указанным значением свойства. Если такого элемента нет - вернет -1.
       * @param {String} property Название свойства элемента.
       * @param {*} value Значение свойства элемента.
       * @return {Number}
       */
      getIndexByValue: function (property, value) {
         var index = this._getIndexForPropertyValue(property, value);
         return index.length ? index[0] : -1;
      },

      /**
       * Возвращает индексы всех элементов с указанным значением свойства.
       * @param {String} property Название свойства элемента.
       * @param {*} value Значение свойства элемента.
       * @return {Array.<Number>}
       */
      getIndicesByValue: function (property, value) {
         return this._getIndexForPropertyValue(property, value);
      },

      /**
       * Устанавливает коллекцию при изменении которой поисходит переиндексация энумератора
       * @param {WS.Data/Collection/IBind} collection
       */
      setObservableCollection: function (collection) {
         collection.subscribe('onCollectionChange', this._onCollectionChange);
      },

      /**
       * Сбрасывает коллекцию при изменении которой поисходит переиндексация энумератора
       * @param {WS.Data/Collection/IBind} collection
       */
      unsetObservableCollection: function (collection) {
         collection.unsubscribe('onCollectionChange', this._onCollectionChange);
      },

      //endregion Public methods

      //region Protected methods

      /**
       * Возвращает индекс для указанного значения свойства.
       * @param {String} property Название свойства элемента.
       * @param {*} value Значение свойства элемента.
       * @return {Array.<Number>}
       * @protected
       */
      _getIndexForPropertyValue: function (property, value) {
         var index = this._getIndex(property);
         return (index && index[value]) || [];
      },

      /**
       * Проверяет наличие индекса для указанного свойства.
       * @param {String} [property] Название свойства.
       * @protected
       */
      _hasIndex: function (property) {
         if (property) {
            return Object.prototype.hasOwnProperty.call(this._enumeratorIndexes, property);
         } else {
            return Object.isEmpty(this._enumeratorIndexes);
         }
      },

      /**
       * Возвращает индекс для указанного свойства.
       * @param {String} property Название свойства.
       * @return {Object}
       * @protected
       */
      _getIndex: function (property) {
         if (property && !this._hasIndex(property)) {
            this._createIndex(property);
         }
         return this._enumeratorIndexes[property];
      },

      /**
       * Сбрасывает индекс
       */
      _resetIndex: function () {
         this._enumeratorIndexes = {};
      },

      /**
       * Удаляет индекс для указанного свойства.
       * @param {String} property Название свойства.
       * @protected
       */
      _deleteIndex: function (property) {
         delete this._enumeratorIndexes[property];
      },

      /**
       * Создает индекс для указанного свойства.
       * @param {String} property Название свойства.
       * @protected
       */
      _createIndex: function (property) {
         var index = this._enumeratorIndexes[property] = {},
            position = 0;
         this.reset();
         while (this.moveNext()) {
            this._setToIndex(
               index,
               property,
               this.getCurrent(),
               position
            );
            position++;
         }
      },

      /**
       * Добавляет элементы в индекс
       * @param {Number} start С какой позиции переиндексировать
       * @param {Number} count Число переиндексируемых элементов
       * @protected
       */
      _addToIndex: function (start, count) {
         var index,
            finish = start + count,
            position;

         for (var property in this._enumeratorIndexes) {
            if (this._enumeratorIndexes.hasOwnProperty(property)) {
               index = this._enumeratorIndexes[property];
               position = 0;
               this.reset();
               while (this.moveNext()) {
                  if (position >= start) {
                     this._setToIndex(
                        index,
                        property,
                        this.getCurrent(),
                        position
                     );
                  }
                  position++;
                  if (position >= finish) {
                     break;
                  }
               }
            }
         }
      },

      /**
       * Удаляет элементы из индекса
       * @param {Number} start С какой позиции переиндексировать
       * @param {Number} count Число переиндексируемых элементов
       * @protected
       */
      _removeFromIndex: function (start, count) {
         var index,
            value,
            elem,
            i,
            at;
         for (var property in this._enumeratorIndexes) {
            if (this._enumeratorIndexes.hasOwnProperty(property)) {
               index = this._enumeratorIndexes[property];
               for (value in index) {
                  if (index.hasOwnProperty(value)) {
                     elem = index[value];
                     for (i = 0; i < count; i++) {
                        at = elem.indexOf(start + i);
                        if (at > -1) {
                           elem.splice(at, 1);
                        }
                     }
                  }
               }
            }
         }
      },

      /**
       * Заменяет элементы в индексе
       * @param {Number} start С какой позиции заменять
       * @param {Number} count Число замененных элементов
       * @protected
       */
      _replaceInIndex: function (start, count) {
         this._removeFromIndex(start, count);
         this._addToIndex(start, count);
      },

      /**
       * Сдвигает позицию элементов индекса
       * @param {Number} start С какой позиции
       * @param {Number} offset Сдвиг
       * @protected
       */
      _shiftIndex: function (start, offset) {
         var index,
            item,
            i;
         for (var property in this._enumeratorIndexes) {
            if (this._enumeratorIndexes.hasOwnProperty(property)) {
               index = this._enumeratorIndexes[property];
               for (var value in index) {
                  if (index.hasOwnProperty(value)) {
                     item = index[value];
                     for (i = 0; i < item.length; i++) {
                        if (item[i] >= start) {
                           item[i]+= offset;
                        }
                     }
                  }
               }
            }
         }
      },

      /**
       * Устанавливает элемент в индекс
       * @protected
       */
      _setToIndex: function (index, property, item, position) {
         var value = Utils.getItemPropertyValue(item, property);

         //FIXME: для проекций решить проблему, кода поиск осуществляется как по CollectionItem, так и по его contents
         if (value === undefined &&
            item instanceof Object &&
            typeof item.getContents === 'function'//CoreInstance.instanceOfModule(item, 'WS.Data/Display/CollectionItem')
         ) {
            value = Utils.getItemPropertyValue(item.getContents(), property);
         }

         if (!Object.prototype.hasOwnProperty.call(index, value)) {
            index[value] = [];
         }
         index[value].push(position);
      },

      /**
       * Удаляет индексы при изменении исходной коллекции
       * @param {$ws.proto.EventObject} event Дескриптор события.
       * @param {String} action Действие, приведшее к изменению.
       * @param {Array.<*>} newItems Новые элементы коллекции.
       * @param {Number} newItemsIndex Индекс, в котором появились новые элементы.
       * @param {Array.<*>} oldItems Удаленные элементы коллекции.
       * @param {Number} oldItemsIndex Индекс, в котором удалены элементы.
       * @protected
       */
      _onCollectionChange: function (event, action, newItems, newItemsIndex, oldItems, oldItemsIndex) {
         switch (action){
            case IBindCollection.ACTION_ADD:
            case IBindCollection.ACTION_REPLACE:
               this.reIndex(action, newItemsIndex, newItems.length);
               break;
            case IBindCollection.ACTION_REMOVE:
               this.reIndex(action, oldItemsIndex, oldItems.length);
               break;
            default:
               this.reIndex(action);
         }
      }

      //endregion Protected methods
   };

   return IndexedEnumeratorMixin;
});

