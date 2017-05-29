/* global define */
define('js!WS.Data/Collection/List', [
   'js!WS.Data/Collection/IEnumerable',
   'js!WS.Data/Collection/IList',
   'js!WS.Data/Collection/IIndexedCollection',
   'js!WS.Data/Collection/IBind',
   'js!WS.Data/Entity/ICloneable',
   'js!WS.Data/Entity/IEquatable',
   'js!WS.Data/Entity/IVersionable',
   'js!WS.Data/Entity/Abstract',
   'js!WS.Data/Entity/OptionsMixin',
   'js!WS.Data/Entity/ObservableMixin',
   'js!WS.Data/Entity/SerializableMixin',
   'js!WS.Data/Entity/CloneableMixin',
   'js!WS.Data/Entity/OneToManyMixin',
   'js!WS.Data/Entity/VersionableMixin',
   'js!WS.Data/Collection/ArrayEnumerator',
   'js!WS.Data/Collection/Indexer',
   'js!WS.Data/Di',
   'js!WS.Data/Utils',
   'js!WS.Data/ContextField/List',
   'Core/core-instance',
   'Core/Context'
], function (
   IEnumerable,
   IList,
   IIndexedCollection,
   IBindCollection,
   ICloneable,
   IEquatable,
   IVersionable,
   Abstract,
   OptionsMixin,
   ObservableMixin,
   SerializableMixin,
   CloneableMixin,
   OneToManyMixin,
   VersionableMixin,
   ArrayEnumerator,
   CollectionIndexer,
   Di,
   Utils,
   ContextFieldList,
   CoreInstance,
   CoreContext
) {
   'use strict';

   var arraySplice = Array.prototype.splice;

   /**
    * Список - коллекция c доступом по индексу.
    * Основные возможности:
    * <ul>
    *    <li>последовательный перебор элементов коллекции - поддержка интерфейса {@link WS.Data/Collection/IEnumerable};</li>
    *    <li>доступ к элементам коллекции по индексу - поддержка интерфейса {@link WS.Data/Collection/IList};</li>
    *    <li>поиск элементов коллекции по значению свойства - поддержка интерфейса {@link WS.Data/Collection/IIndexedCollection}.</li>
    * </ul>
    * Создадим рекордсет, в котором в качестве сырых данных используется plain JSON (адаптер для данных в таком формате используется по умолчанию):
    * <pre>
    *    var characters = new List({
    *       items: [{
    *          id: 1,
    *          firstName: 'Tom',
    *          lastName: 'Sawyer'
    *       }, {
    *          id: 2,
    *          firstName: 'Huckleberry',
    *          lastName: 'Finn'
    *       }]
    *    });
    *    characters.at(0).firstName;//'Tom'
    *    characters.at(1).firstName;//'Huckleberry'
    * </pre>
    * @class WS.Data/Collection/List
    * @extends WS.Data/Entity/Abstract
    * @implements WS.Data/Collection/IEnumerable
    * @implements WS.Data/Collection/IList
    * @implements WS.Data/Collection/IIndexedCollection
    * @implements WS.Data/Entity/ICloneable
    * @implements WS.Data/Entity/IEquatable
    * @mixes WS.Data/Entity/OptionsMixin
    * @mixes WS.Data/Entity/ObservableMixin
    * @mixes WS.Data/Entity/SerializableMixin
    * @mixes WS.Data/Entity/CloneableMixin
    * @mixes WS.Data/Entity/OneToManyMixin
    * @public
    * @author Мальцев Алексей
    */

   var List = Abstract.extend([IEnumerable, IList, IIndexedCollection, ICloneable, IEquatable, IVersionable, OptionsMixin, ObservableMixin, SerializableMixin, CloneableMixin, OneToManyMixin, VersionableMixin], /** @lends WS.Data/Collection/List.prototype */{
      _moduleName: 'WS.Data/Collection/List',

      /**
       * @cfg {Array.<*>} Элементы списка
       * @name WS.Data/Collection/List#items
       */
      _$items: null,

      /**
       * @member {WS.Data/Collection/Indexer} Индексатор
       */
      _indexer: null,

      constructor: function $List(options) {
         if (options) {
            if ('items' in options) {
               if (!(options.items instanceof Array)) {
                  throw new TypeError('Option "items" should be an instance of Array');
               }
            }
         }

         List.superclass.constructor.call(this, options);
         OptionsMixin.constructor.call(this, options);
         ObservableMixin.constructor.call(this, options);
         this._$items = this._$items || [];
         for (var i = 0, count = this._$items.length; i < count; i++) {
            this._addChild(this._$items[i]);
         }
      },

      destroy: function() {
         this._$items = null;
         this._indexer = null;

         ObservableMixin.destroy.call(this);
         OneToManyMixin.destroy.call(this);
         List.superclass.destroy.call(this);
      },

      // region WS.Data/Entity/SerializableMixin

      _getSerializableState: function(state) {
         return SerializableMixin._getSerializableState.call(this, state);
      },

      _setSerializableState: function(state) {
         return SerializableMixin._setSerializableState(state).callNext(function() {
            this._clearIndexer();
         });
      },

      // endregion WS.Data/Entity/SerializableMixin

      // region WS.Data/Entity/OneToManyMixin

      _addChild: function(child, name) {
         OneToManyMixin._addChild.call(this, child, name || 'owner');
      },

      // endregion WS.Data/Entity/OneToManyMixin

      //region WS.Data/Collection/IEnumerable

      /**
       * Возвращает энумератор для перебора элементов списка.
       * Пример использования можно посмотреть в модуле {@link WS.Data/Collection/IEnumerable}.
       * @return {WS.Data/Collection/ArrayEnumerator}
       */
      getEnumerator: function () {
         return new ArrayEnumerator(this._$items);
      },

      each: function (callback, context) {
         //так быстрее, чем по правильному - через enumerator
         for (var i = 0, count = this.getCount(); i < count; i++) {
            callback.call(
               context || this,
               this.at(i),
               i,
               this
            );
         }
      },

      //endregion WS.Data/Collection/IEnumerable

      //region WS.Data/Collection/IList

      assign: function (items) {
         var i, count;
         for (i = 0, count = this._$items.length; i < count; i++) {
            this._removeChild(this._$items[i]);
         }
         this._$items.length = 0;

         items = this._splice(items || [], 0, IBindCollection.ACTION_RESET);

         for (i = 0, count = items.length; i < count; i++) {
            this._addChild(items[i]);
         }
         this._childChanged(items);
      },

      append: function (items) {
         items = this._splice(items, this.getCount(), IBindCollection.ACTION_ADD);

         for (var i = 0, count = items.length; i < count; i++) {
            this._addChild(items[i]);
         }
         this._childChanged(items);
      },

      prepend: function (items) {
         items = this._splice(items, 0, IBindCollection.ACTION_ADD);

         for (var i = 0, count = items.length; i < count; i++) {
            this._addChild(items[i]);
         }
         this._childChanged(items);
      },

      clear: function () {
         this._$items.length = 0;
         this._reindex();
         this._getMediator().clear(this);
         this._childChanged();
         this._nextVersion();
      },

      add: function (item, at) {
         if (at === undefined) {
            at = this._$items.length;
            this._$items.push(item);
         } else {
            at = at || 0;
            if (at !== 0 && !this._isValidIndex(at, true)) {
               throw new Error('Index is out of bounds');
            }
            this._$items.splice(at, 0, item);
         }

         this._addChild(item);
         this._childChanged(item);
         this._nextVersion();
         this._reindex(IBindCollection.ACTION_ADD, at, 1);
      },

      at: function (index) {
         return this._$items[index];
      },

      remove: function (item) {
         var index = this.getIndex(item);
         if(index !== -1) {
            this.removeAt(index);
            this._childChanged(item);
            return true;
         }
         return false;
      },

      removeAt: function (index) {
         if (!this._isValidIndex(index)) {
            throw new Error('Index is out of bounds');
         }
         this._removeChild(this._$items[index]);
         var deleted = this._$items.splice(index, 1);
         this._reindex(IBindCollection.ACTION_REMOVE, index, 1);
         this._childChanged(index);
         this._nextVersion();
         return deleted[0];
      },

      replace: function (item, at) {
         if (!this._isValidIndex(at)) {
            throw new Error('Index is out of bounds');
         }

         var oldItem = this._$items[at];
         //Replace with itself has no effect
         if (oldItem === item) {
            return;
         }

         this._removeChild(oldItem);
         this._$items[at] = item;
         this._addChild(item);
         this._reindex(IBindCollection.ACTION_REPLACE, at, 1);
         this._childChanged(item);
         this._nextVersion();
      },

      move: function (from, to) {
         if (!this._isValidIndex(from)) {
            throw new Error('Argument "from" is out of bounds');
         }
         if (!this._isValidIndex(to)) {
            throw new Error('Argument "to" is out of bounds');
         }
         if (from === to) {
            return;
         }

         var items = this._$items.splice(from, 1);
         this._$items.splice(to, 0, items[0]);

         if (from < to) {
            this._reindex(IBindCollection.ACTION_REPLACE, from, 1 + to - from);
         } else {
            this._reindex(IBindCollection.ACTION_REPLACE, to, 1 + from - to);
         }
         this._nextVersion();
      },

      getIndex: function (item) {
         return this._$items.indexOf(item);
      },

      getCount: function () {
         return this._$items.length;
      },

      //endregion WS.Data/Collection/IList

      //region WS.Data/Collection/IIndexedCollection

      getIndexByValue: function (property, value) {
         return this._getIndexer().getIndexByValue(property, value);
      },

      getIndicesByValue: function (property, value) {
         return this._getIndexer().getIndicesByValue(property, value);
      },

      //endregion WS.Data/Collection/IIndexedCollection

      //region WS.Data/Entity/IEquatable

      isEqual: function (to) {
         if (to === this) {
            return true;
         }
         if (!to || !(to instanceof List)) {
            return false;
         }

         if (this.getCount() !== to.getCount()) {
            return false;
         }
         for (var i = 0, count = this.getCount(); i < count; i++) {
            if (this.at(i) !== to.at(i)) {
               return false;
            }
         }
         return true;
      },

      //endregion WS.Data/Entity/IEquatable

      //region Deprecated methods

      /**
       * Присоединяет другую коллекцию
       * @param {WS.Data/Collection/IEnumerable} items Коллекция, которая будет присоединена
       * @param {Boolean} [prepend=false] Присоединить в начало
       * @deprecated метод будет удален в версии платформы СБИС 3.7.6, используйте append() или prepend()
       */
      concat: function (items, prepend) {
         Utils.logger.stack(this._moduleName + '::concat(): method is deprecated and will be removed in 3.7.6. Use append() or prepend() instead.', 0, 'error');
         if (prepend) {
            this.prepend(items);
         } else {
            this.append(items);
         }
      },

      /**
       * Возвращает коллекцию в виде массива
       * @return {Array}
       * @deprecated Метод будет удален в 3.7.5, используйте {@link WS.Data/Chain}::toArray()
       */
      toArray: function () {
         Utils.logger.stack(this._moduleName + '::toArray(): method is deprecated and will be removed in 3.7.5. Use WS.Data/Chain::toArray() instead. See https://wi.sbis.ru/docs/WS/Data/Chain/ for details.');
         return this._$items.slice();
      },

      //endregion Deprecated methods

      //region Protected methods

      /**
       * Возвращает индексатор коллекции
       * @return {WS.Data/Collection/Indexer}
       * @protected
       */
      _getIndexer: function () {
         return this._indexer || (this._indexer = new CollectionIndexer(
            this._$items,
            function(items) {
               return items.length;
            },
            function(items, at) {
               return items[at];
            },
            function(item, property) {
               return Utils.getItemPropertyValue(item, property);
            }
         ));
      },

      /**
       * Очищает индексатор коллекции
       * @protected
       */
      _clearIndexer: function () {
         this._indexer = null;
      },

      /**
       * Проверяет корректность индекса
       * @param {Number} index Индекс
       * @param {Boolean} [addMode=false] Режим добавления
       * @return {Boolean}
       * @protected
       */
      _isValidIndex: function (index, addMode) {
         var max = this.getCount();
         if (addMode) {
            max++;
         }
         return index >= 0 && index < max;
      },

      /**
       * Переиндексирует список
       * @param {WS.Data/Collection/IBind/ChangeAction.typedef[]} action Действие, приведшее к изменению.
       * @param {Number} [start=0] С какой позиции переиндексировать
       * @param {Number} [count=0] Число переиндексируемых элементов
       * @protected
       */
      _reindex: function (action, start, count) {
         if (!this._indexer) {
            return;
         }

         var indexer = this._getIndexer();
         switch (action){
            case IBindCollection.ACTION_ADD:
               indexer.shiftIndex(start, this.getCount() - start, count);
               indexer.updateIndex(start, count);
               break;
            case IBindCollection.ACTION_REMOVE:
               indexer.removeFromIndex(start, count);
               indexer.shiftIndex(start + count, this.getCount() - start, -count);
               break;
            case IBindCollection.ACTION_REPLACE:
               indexer.removeFromIndex(start, count);
               indexer.updateIndex(start, count);
               break;
            case IBindCollection.ACTION_RESET:
               indexer.resetIndex();
               break;
            default:
               if (count > 0) {
                  indexer.removeFromIndex(start, count);
                  indexer.updateIndex(start, count);
               } else {
                  indexer.resetIndex();
               }
         }
      },

      /**
       * Вызывает метод splice
       * @param {WS.Data/Collection/IEnumerable|Array} items Коллекция с элементами для замены
       * @param {Number} start Индекс в массиве, с которого начинать добавление.
       * @param {WS.Data/Collection/IBind/ChangeAction.typedef[]} action Действие, приведшее к изменению.
       * @return {Array}
       * @protected
       */
      _splice: function (items, start, action) {
         items = this._itemsToArray(items);
         arraySplice.apply(
            this._$items,
            [start, 0].concat(items)
         );
         this._reindex(action, start, items.length);
         this._nextVersion();
         return items;
      },

      /**
       * Приводит переденные элементы к массиву
       * @param items
       * @return {Array}
       * @protected
       */
      _itemsToArray: function (items){
         if (items instanceof Array) {
            return items;
         } else if (items && items._wsDataCollectionIEnumerable) {//it's equal to CoreInstance.instanceOfMixin(items, 'WS.Data/Collection/IEnumerable')
            var result = [];
            items.each(function (item) {
               result.push(item);
            });
            return result;
         } else {
            throw new TypeError('Argument "items" must be an instance of Array or implement WS.Data/Collection/IEnumerable.');
         }
      }

      //endregion Protected methods
   });

   //Aliases
   List.prototype.forEach = List.prototype.each;

   Di.register('collection.list', List);

   CoreContext.registerFieldType(new ContextFieldList(List));

   return List;
});
