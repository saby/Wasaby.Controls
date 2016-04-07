/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Collection.IndexedEnumeratorMixin', [
   'js!SBIS3.CONTROLS.Data.Utils'
], function (Utils) {
   'use strict';

   /**
    * Миксин, позволящий использовать индесацию элементов в экземплярах, реализующих интерфейс SBIS3.CONTROLS.Data.Collection.IEnumerator
    * @mixin SBIS3.CONTROLS.Data.Collection.IndexedEnumeratorMixin
    * @public
    * @author Мальцев Алексей
    */

   var IndexedEnumeratorMixin = /**@lends SBIS3.CONTROLS.Data.Collection.IndexedEnumeratorMixin.prototype  */{
      $protected: {
         /**
          * @var {Object} Индексы, распределенные по полям
          */
         _enumeratorIndexes: {}
      },

      $constructor: function () {
         this._onCollectionChange = this._onCollectionChange.bind(this);
      },

      //region Public methods

      /**
       * Переиндексирует энумератор
       */
      reIndex: function () {
         this._enumeratorIndexes = {};
      },

      /**
       * Возвращает индекс первого элемента с указанным значением свойства. Если такого элемента нет - вернет -1.
       * @param {String} property Название свойства элемента.
       * @param {*} value Значение свойства элемента.
       * @returns {Number}
       */
      getIndexByValue: function (property, value) {
         var index = this._getIndexForPropertyValue(property, value);
         return index.length ? index[0][0] : -1;
      },

      /**
       * Возвращает индексы всех элементов с указанным значением свойства.
       * @param {String} property Название свойства элемента.
       * @param {*} value Значение свойства элемента.
       * @returns {Array}
       */
      getIndicesByValue: function (property, value) {
         return $ws.helpers.map(this._getIndexForPropertyValue(property, value), function(item) {
            return item[0];
         });
      },

      /**
       * Возвращает индексы всех элементов с указанным значением свойства.
       * @param {String} property Название свойства элемента.
       * @param {*} value Значение свойства элемента.
       * @returns {Array}
       * @deprecated метод будет удален в 3.7.4 используйте getIndicesByValue()
       */
      getIndiciesByValue: function (property, value) {
         Utils.logger.stack(this._moduleName + '::getIndiciesByValue(): method is deprecated and will be removed in 3.7.4. Use getIndicesByValue() instead.');
         return this.getIndicesByValue(property, value);
      },

      /**
       * Устанавливает коллекцию при изменении которой поисходит переиндексация энумератора
       * @param {SBIS3.CONTROLS.Data.Bind.ICollection} collection
       */
      setObservableCollection: function (collection) {
         collection.subscribe('onCollectionChange', this._onCollectionChange);
      },

      /**
       * Сбрасывает коллекцию при изменении которой поисходит переиндексация энумератора
       * @param {SBIS3.CONTROLS.Data.Bind.ICollection} collection
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
       * @returns {Array}
       * @private
       */
      _getIndexForPropertyValue: function (property, value) {
         var index;
         if (Object.prototype.hasOwnProperty.call(this._enumeratorIndexes, property)) {
            index = this._enumeratorIndexes[property];
         } else {
            index = this._createIndex(property);
         }
         return index[value] || [];
      },

      /**
       * Создает индекс для указанного свойства.
       * @param {String} property Название свойства.
       * @returns {Object}
       * @private
       */
      _createIndex: function (property) {
         var index = this._enumeratorIndexes[property] = {},
            position = 0,
            item,
            value;
         this.reset();
         while ((item = this.getNext())) {
            value = Utils.getItemPropertyValue(item, property);

            //FIXME: для проекций решить проблему, кода поиск осущетвляется как по CollectionItem, так и по его contents
            if (value === undefined &&
               item instanceof Object &&
               $ws.helpers.instanceOfModule(item, 'SBIS3.CONTROLS.Data.Projection.CollectionItem')
            ) {
               value = Utils.getItemPropertyValue(item.getContents(), property);
            }

            if (!Object.prototype.hasOwnProperty.call(index, value)) {
               index[value] = [];
            }
            index[value].push([position, item]);
            position++;
         }

         return index;
      },

      /**
       * Удаляет индекс для указанного свойства.
       * @param {String} property Название свойства.
       * @private
       */
      _deleteIndex: function (property) {
         delete this._enumeratorIndexes[property];
      },

      /**
       * Удаляет индексы при изменении исходной коллекции
       * @private
       */
      _onCollectionChange: function () {
         this.reIndex();
      }

      //endregion Protected methods
   };

   return IndexedEnumeratorMixin;
});

