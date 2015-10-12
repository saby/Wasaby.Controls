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
         this._onCollectionChange.bind(this);
      },

      //region Public methods

      /**
       * Возвращает первый элемент с указанным значением свойства. Если такого элемента нет - вернет undefined.
       * @param {String} property Название свойства элемента.
       * @param {*} value Значение свойства элемента.
       * @returns {*}
       */
      getItemByPropertyValue: function (property, value) {
         var item = this._getIndexValue(property, value);
         return item === undefined ? undefined : item[1];
      },

      /**
       * Возвращает индекс первого элемента с указанным значением свойства. Если такого элемента нет - вернет -1.
       * @param {String} property Название свойства элемента.
       * @param {*} value Значение свойства элемента.
       * @returns {Number}
       */
      getItemIndexByPropertyValue: function (property, value) {
         var item = this._getIndexValue(property, value);
         return item === undefined ? undefined : item[0];
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
       * @returns {Array|undefined}
       * @private
       */
      _getIndexValue: function (property, value) {
         var index = this._enumeratorIndexes[property];
         if (index === undefined) {
            index = this._createIndex(property);
         }
         return index[value];
      },

      /**
       * Создает индекс для указанного свойства.
       * @param {String} property Название свойства.
       * @returns {Array}
       * @private
       */
      _createIndex: function (property) {
         var index = this._enumeratorIndexes[property] = [],
            position = 0,
            item,
            value;
         this.reset();
         while ((item = this.getNext(true))) {
            value = Utils.getItemPropertyValue(item, property);
            index[value] = [position, item];
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
         this._enumeratorIndexes = {};
      }


      //endregion Protected methods
   };

   return IndexedEnumeratorMixin;
});

