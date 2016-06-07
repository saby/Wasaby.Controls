/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Collection.List', [
   'js!SBIS3.CONTROLS.Data.Collection.IEnumerable',
   'js!SBIS3.CONTROLS.Data.Collection.IList',
   'js!SBIS3.CONTROLS.Data.Collection.IIndexedCollection',
   'js!SBIS3.CONTROLS.Data.Bind.ICollection',
   'js!SBIS3.CONTROLS.Data.ICloneable',
   'js!SBIS3.CONTROLS.Data.Entity.Abstract',
   'js!SBIS3.CONTROLS.Data.Entity.OptionsMixin',
   'js!SBIS3.CONTROLS.Data.Entity.ObservableMixin',
   'js!SBIS3.CONTROLS.Data.SerializableMixin',
   'js!SBIS3.CONTROLS.Data.CloneableMixin',
   'js!SBIS3.CONTROLS.Data.OneToManyMixin',
   'js!SBIS3.CONTROLS.Data.Collection.ArrayEnumerator',
   'js!SBIS3.CONTROLS.Data.Di',
   'js!SBIS3.CONTROLS.Data.Utils',
   'js!SBIS3.CONTROLS.Data.ContextField.List'
], function (
   IEnumerable,
   IList,
   IIndexedCollection,
   IBindCollection,
   ICloneable,
   Abstract,
   OptionsMixin,
   ObservableMixin,
   SerializableMixin,
   CloneableMixin,
   OneToManyMixin,
   ArrayEnumerator,
   Di,
   Utils,
   ContextFieldList
) {
   'use strict';

   var arraySplice = Array.prototype.splice;

   /**
    * Список - коллекция c доступом по порядковому индексу
    * @class SBIS3.CONTROLS.Data.Collection.List
    * @extends SBIS3.CONTROLS.Data.Entity.Abstract
    * @mixes SBIS3.CONTROLS.Data.Collection.IEnumerable
    * @mixes SBIS3.CONTROLS.Data.Collection.IList
    * @mixes SBIS3.CONTROLS.Data.Collection.IIndexedCollection
    * @mixes SBIS3.CONTROLS.Data.ICloneable
    * @mixes SBIS3.CONTROLS.Data.Entity.OptionsMixin
    * @mixes SBIS3.CONTROLS.Data.Entity.ObservableMixin
    * @mixes SBIS3.CONTROLS.Data.SerializableMixin
    * @mixes SBIS3.CONTROLS.Data.CloneableMixin
    * @mixes SBIS3.CONTROLS.Data.OneToManyMixin
    * @public
    * @author Мальцев Алексей
    */

   var List = Abstract.extend([IEnumerable, IList, IIndexedCollection, ICloneable, OptionsMixin, ObservableMixin, SerializableMixin, CloneableMixin, OneToManyMixin], /** @lends SBIS3.CONTROLS.Data.Collection.List.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Collection.List',

      /**
       * @cfg {Array.<*>} Элементы списка
       * @name SBIS3.CONTROLS.Data.Collection.List#items
       */
      _$items: null,

      /**
       * @member {SBIS3.CONTROLS.Data.Collection.ArrayEnumerator} Служебный энумератор
       */
      _serviceEnumerator: undefined,

      /**
       * @member {Object} Индекс хешей элементов
       */
      _hashIndex: undefined,

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
         this._$items = this._$items || [];
      },

      // region SBIS3.CONTROLS.Data.SerializableMixin

      _getSerializableState: function(state) {
         return SerializableMixin._getSerializableState.call(this, state);
      },

      _setSerializableState: function(state) {
         return SerializableMixin._setSerializableState(state).callNext(function() {
            this._clearServiceEnumerator();
         });
      },

      // endregion SBIS3.CONTROLS.Data.SerializableMixin

      //region SBIS3.CONTROLS.Data.Collection.IEnumerable

      /**
       * Возвращает энумератор для перебора элементов коллеции
       * @returns {SBIS3.CONTROLS.Data.Collection.ArrayEnumerator}
       */
      getEnumerator: function () {
         return new ArrayEnumerator(this._$items);
      },

      /**
       * Итератор для обхода всех элементов коллекции
       * Цикл проходит полное количество итераций, его невозможно прервать досрочно
       * @param callback
       * @param context
       */
      each: function (callback, context) {
         //так быстрее, чем по правильному - через enumerator
         for (var i = 0, count = this._$items.length; i < count; i++) {
            callback.call(
               context || this,
               this._$items[i],
               i
            );
         }
      },

      //endregion SBIS3.CONTROLS.Data.Collection.IEnumerable

      //region SBIS3.CONTROLS.Data.Collection.IList

      assign: function (items) {
         this._$items.length = 0;
         items = this._splice(items || [], 0, 0, IBindCollection.ACTION_REPLACE);

         for (var i = 0, count = items.length; i < count; i++) {
            this._addChild(items[i], 'owner');
         }
      },

      append: function (items) {
         items = this._splice(items, this.getCount(), 0, IBindCollection.ACTION_ADD);

         for (var i = 0, count = items.length; i < count; i++) {
            this._addChild(items[i], 'owner');
         }
      },

      prepend: function (items) {
         items = this._splice(items, 0, 0, IBindCollection.ACTION_ADD);

         for (var i = 0, count = items.length; i < count; i++) {
            this._addChild(items[i], 'owner');
         }
      },

      clear: function () {
         this._$items.length = 0;
         this._getMediator().clear(this);
         this._reindex();
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

         this._addChild(item, 'owner');
         this._reindex(IBindCollection.ACTION_ADD, at, 1);
      },

      at: function (index) {
         return this._$items[index];
      },

      remove: function (item) {
         var index = this.getIndex(item);
         if(index !== -1) {
            this.removeAt(index);
            return true;
         }
         return false;
      },

      removeAt: function (index) {
         if (!this._isValidIndex(index)) {
            throw new Error('Index is out of bounds');
         }
         this._removeChild(this._$items[index]);
         this._$items.splice(index, 1);
         this._reindex(IBindCollection.ACTION_REMOVE, index, 1);
      },

      replace: function (item, at) {
         if (!this._isValidIndex(at)) {
            throw new Error('Index is out of bounds');
         }
         this._removeChild(this._$items[at], 'owner');
         this._$items[at] = item;
         this._addChild(item, 'owner');

         this._reindex(IBindCollection.ACTION_REPLACE, at, 1);
      },

      getIndex: function (item) {
         if (item && $ws.helpers.instanceOfMixin(item, 'SBIS3.CONTROLS.Data.IHashable')) {
            return this._getItemIndexByHash(item.getHash());
         }

         return Array.indexOf(this._$items, item);
      },

      getCount: function () {
         return this._$items.length;
      },

      //endregion SBIS3.CONTROLS.Data.Collection.IList

      //region SBIS3.CONTROLS.Data.Collection.IIndexedCollection

      getIndexByValue: function (property, value) {
         return this._getServiceEnumerator().getIndexByValue(property, value);
      },

      getIndicesByValue: function (property, value) {
         return this._getServiceEnumerator().getIndicesByValue(property, value);
      },

      //endregion SBIS3.CONTROLS.Data.Collection.IIndexedCollection

      //region deprecated

      /**
       * Возвращает индексы всех элементов с указанным значением свойства.
       * @param {String} property Название свойства элемента.
       * @param {*} value Значение свойства элемента.
       * @deprecated метод будет удален в 3.7.4 используйте getIndicesByValue()
       * @returns {Array.<Number>}
       */
      getIndiciesByValue: function (property, value) {
         Utils.logger.stack(this._moduleName + '::getIndiciesByValue(): method is deprecated and will be removed in 3.7.4. Use getIndicesByValue() instead.');
         return this.getIndicesByValue(property, value);
      },

      /**
       * Присоединяет другую коллекцию
       * @param {SBIS3.CONTROLS.Data.Collection.IEnumerable} items Коллекция, которая будет присоединена
       * @param {Boolean} [prepend=false] Присоединить в начало
       * @deprecated метод будет удален в 3.7.4 используйте append() или prepend()
       */
      concat: function (items, prepend) {
         Utils.logger.stack(this._moduleName + '::concat(): method is deprecated and will be removed in 3.7.4. Use append() or prepend() instead.');
         if (prepend) {
            this.prepend(items);
         } else {
            this.append(items);
         }
      },

      /**
       * Возвращает коллекцию в виде массива
       * @returns {Array}
       * @deprecated метод не рекомендуется к использованию, используйте each()
       */
      toArray: function () {
         return this._$items.slice();
      },

      //endregion deprecated

      //region Public methods

      equals: function (another) {
         Utils.logger.stack(this._moduleName + '::equals(): method is deprecated and will be removed in 3.7.4. Use isEqual() instead.');
         return this.isEqual(another);
      },

      /**
       * Проверяет эквивалентность элементов другого списка (должно совпадать количество элементов и сами элементы (строгое сравнение))
       * @param {SBIS3.CONTROLS.Data.Collection.List} list Список, эквивалентность которого проверяется
       * @returns {Boolean}
       */
      isEqual: function (list) {
         if (list === this) {
            return true;
         }
         if (!list ||
            !$ws.helpers.instanceOfModule(list, 'SBIS3.CONTROLS.Data.Collection.List')
         ) {
            return false;
         }

         if (this.getCount() !== list.getCount()) {
            return false;
         }
         for (var i = 0, count = this.getCount(); i < count; i++) {
            if (this.at(i) !== list.at(i)) {
               return false;
            }
         }
         return true;
      },

      //endregion Public methods

      //region Protected methods

      /**
       * Возвращает Служебный энумератор
       * @returns {SBIS3.CONTROLS.Data.Collection.ArrayEnumerator}
       */
      _getServiceEnumerator: function () {
         return this._serviceEnumerator || (this._serviceEnumerator = new ArrayEnumerator(this._$items));
      },

      _clearServiceEnumerator: function () {
          this._serviceEnumerator = undefined;
      },
      /**
       * Проверяет корректность индекса
       * @param {Number} index Индекс
       * @param {Boolean} [addMode=false] Режим добавления
       * @returns {Boolean}
       * @private
       */
      _isValidIndex: function (index, addMode) {
         var max = this.getCount();
         if (addMode) {
            max++;
         }
         return index >= 0 && index < max;
      },

      _getItemIndexByHash: function (hash) {
         if (this._hashIndex === undefined) {
            this._createHashIndex();
         }
         return this._hashIndex.hasOwnProperty(hash) ? this._hashIndex[hash] : -1;
      },

      _createHashIndex: function () {
         this._hashIndex = {};
         for (var i = 0, count = this._$items.length; i < count; i++) {
            var item = this._$items[i];
            if ($ws.helpers.instanceOfMixin(item, 'SBIS3.CONTROLS.Data.IHashable')) {
               this._hashIndex[item.getHash()] = i;
            }
         }

      },

      /**
       * Переиндексирует список
       * @param {SBIS3.CONTROLS.Data.Bind.ICollection/ChangeAction.typedef[]} action Действие, приведшее к изменению.
       * @param {Number} [start=0] С какой позиции переиндексировать
       * @param {Number} [count=0] Число переиндексируемых элементов
       * @protected
       */
      _reindex: function (action, start, count) {
         this._hashIndex = undefined;
         this._getServiceEnumerator().reIndex(action, start, count);
      },

      /**
       * Вызывает метод splice
       * @param {SBIS3.CONTROLS.Data.Collection.IEnumerable|Array} items Коллекция с элементами для замены
       * @param {Number} start Индекс в массиве, с которого начинать добавление.
       * @param {SBIS3.CONTROLS.Data.Bind.ICollection/ChangeAction.typedef[]} action Действие, приведшее к изменению.
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

         return items;
      },

      /**
       * Приводит переденные элементы к массиву
       * @param items
       * @returns {Array}
       * @protected
       */
      _itemsToArray: function (items){
         if(items instanceof Array) {
            return items;
         } else if(items && $ws.helpers.instanceOfMixin(items, 'SBIS3.CONTROLS.Data.Collection.IEnumerable')) {
            var result = [];
            items.each(function (item) {
               result.push(item);
            });
            return result;
         } else {
            throw new TypeError('Argument "items" must be an instance of Array or implement SBIS3.CONTROLS.Data.Collection.IEnumerable.');
         }
      }

      //endregion Protected methods
   });

   SerializableMixin._checkExtender(List);

   Di.register('collection.list', List);

   $ws.proto.Context.registerFieldType(new ContextFieldList({module: List}));

   return List;
});
