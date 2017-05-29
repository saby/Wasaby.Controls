/* global define */
define('js!WS.Data/Display/CollectionEnumerator', [
   'js!WS.Data/Entity/Abstract',
   'js!WS.Data/Entity/OptionsMixin',
   'js!WS.Data/Collection/IEnumerator',
   'js!WS.Data/Collection/IndexedEnumeratorMixin'
], function (
   Abstract,
   OptionsMixin,
   IEnumerator,
   IndexedEnumeratorMixin
) {
   'use strict';

   /**
    * Энумератор для проекции коллекции
    * @class WS.Data/Display/CollectionEnumerator
    * @extends WS.Data/Entity/Abstract
    * @mixes WS.Data/Entity/OptionsMixin
    * @implements WS.Data/Collection/IEnumerator
    * @mixes WS.Data/Collection/IndexedEnumeratorMixin
    * @public
    * @author Мальцев Алексей
    */

   var CollectionEnumerator = Abstract.extend([OptionsMixin, IEnumerator, IndexedEnumeratorMixin], /** @lends WS.Data/Display/CollectionEnumerator.prototype */{
      _moduleName: 'WS.Data/Display/CollectionEnumerator',

      /**
       * @cfg {Array.<WS.Data/Display/CollectionItem>} Индекс проекции коллекции
       * @name WS.Data/Display/CollectionEnumerator#items
       */
      _$items: null,

      /**
       * @cfg {Array.<Boolean>} Результат применения фильтра
       * @name WS.Data/Display/CollectionEnumerator#filterMap
       */
      _$filterMap: null,

      /**
       * @cfg {Array.<Number>} Результат применения сортировки
       * @name WS.Data/Display/CollectionEnumerator#sortMap
       */
      _$sortMap: null,

      /**
       * @member {Number} Текущая позиция
       */
      _position: -1,

      /**
       * @member {WS.Data/Display/CollectionItem} Текущий элемент
       */
      _current: undefined,

      /**
       * @member {Array.<Number>} Соответствие позиций проекции и исходной коллекции
       */
      _internalToSource: null,

      /**
       * @member {Array.<Number>} Соответствие позиций исходной коллекции и проекции
       */
      _sourceToInternal: null,

      constructor: function $CollectionEnumerator(options) {
         this._$items = [];
         this._$filterMap = [];
         this._$sortMap = [];
         this._sourceToInternal = [];

         CollectionEnumerator.superclass.constructor.call(this, options);
         OptionsMixin.constructor.call(this, options);
         IndexedEnumeratorMixin.constructor.call(this);

         if (!(this._$items instanceof Array)) {
            throw new TypeError(this._moduleName + '::constructor(): items should be instance of an Array');
         }
         if (!(this._$filterMap instanceof Array)) {
            throw new TypeError(this._moduleName + '::constructor(): filter map should be instance of an Array');
         }
         if (!(this._$sortMap instanceof Array)) {
            throw new TypeError(this._moduleName + '::constructor(): sort map should be instance of an Array');
         }
      },

      //region WS.Data/Collection/IEnumerator

      getCurrent: function () {
         return this._current;
      },

      getCurrentIndex: function () {
         return this._position;
      },

      reset: function () {
         this._position = -1;
         this._setCurrentByPosition();
      },

      //endregion WS.Data/Collection/IEnumerator

      //region WS.Data/Collection/IndexedEnumeratorMixin

      reIndex: function (action, start, count) {
         IndexedEnumeratorMixin.reIndex.call(this, action, start, count);
         this._internalToSource = null;
         this._sourceToInternal = [];
         this._position = -1;
         if (this._current) {
            this._setPositionByCurrent();
         }
      },

      _createIndex: function (property) {
         var savedPosition = this._position,
            savedCurrent = this._current;
         IndexedEnumeratorMixin._createIndex.call(this, property);
         this._position = savedPosition;
         this._current = savedCurrent;
      },

      //endregion WS.Data/Collection/IndexedEnumeratorMixin

      //region Public methods

      /**
       * Возвращает элемент по индексу
       * @param {Number} index Индекс
       * @return {WS.Data/Display/CollectionItem}
       * @state mutable
       */
      at: function (index) {
         return index === undefined ?
            undefined :
            this._$items[this.getSourceByInternal(index)];
      },

      /**
       * Возвращает кол-во элементов
       * @return {Number}
       */
      getCount: function () {
         this._initInternalMap();
         return this._internalToSource.length;
      },

      /**
       * Устанавливает текущий элемент
       * @param {WS.Data/Display/CollectionItem} item Текущий элемент
       */
      setCurrent: function(item) {
         this._position = this.getInternalBySource(this._$items.indexOf(item));
         this._setCurrentByPosition();
      },

      /**
       * Возвращает текущую позицию проекции
       * @return {Number}
       */
      getPosition: function() {
         return this._position;
      },

      /**
       * Устанавливает текущую позицию
       * @param {Number} position Позиция проекции
       * @return {Boolean}
       */
      setPosition: function(position) {
         this._checkPosition(position);
         this._position = position;
         this._setCurrentByPosition();
      },

      /**
       * Возвращает признак корректности позиции
       * @param {Number} position Позиция
       * @return {Boolean}
       */
      isValidPosition: function (position) {
         return position >= -1 && position < this.getCount();
      },

      /**
       * Возвращает предыдущий элемент
       * @return {*}
       */
      getPrevious: function () {
         if (this._position < 1) {
            return;
         }
         this._position--;
         this._setCurrentByPosition();
         return this.getCurrent();
      },

      moveNext: function () {
         if (this._position >= this.getCount() - 1) {
            return false;
         }
         this._position++;
         this._setCurrentByPosition();
         return true;
      },

      /**
       * Возвращает следующий элемент
       * @return {*}
       */
      getNext: function () {
         return this.moveNext() ? this.getCurrent() : undefined;
      },

      /**
       * Вычисляет позицию в проекции относительно позиции в исходной коллекции
       * @param {Number} source Позиция в исходной коллекции
       * @return {Number}
       */
      getInternalBySource: function (source) {
         if (source === undefined || source === null || source === -1) {
            return source;
         }
         this._initInternalMap();

         if (this._sourceToInternal[source] === undefined) {
            this._sourceToInternal[source] = this._internalToSource.indexOf(source);
         }
         return this._sourceToInternal[source];
      },

      /**
       * Вычисляет позицию в исходной коллекции относительно позиции в проекции
       * @param {Number} internal Позиция в проекции
       * @return {Number}
       * @protected
       */
      getSourceByInternal: function (internal) {
         if (internal === undefined || internal === null || internal === -1) {
            return internal;
         }
         this._initInternalMap();
         return this._internalToSource[internal];
      },

      //endregion Public methods

      //region Protected methods

      /**
       * Инициализирует массив соответствия позиций проекции и исходной коллекции
       * @protected
       */
      _initInternalMap: function () {
         if (this._internalToSource === null) {
            this._internalToSource = this._buildInternalMap();
         }
      },

      /**
       * Строит массив соответствия позиций проекции и исходной коллекции
       * @return {Array}
       * @protected
       */
      _buildInternalMap: function () {
         var result = [],
            sortMap = this._$sortMap,
            filterMap = this._$filterMap,
            i,
            index;

         for (i = 0; i < sortMap.length; i++) {
            index = sortMap[i];
            if (filterMap[index]) {
               result.push(index);
            }
         }

         return result;
      },

      /**
       * Проверяет корректность позиции
       * @param {Number} position Позиция
       * @protected
       */
      _checkPosition: function (position) {
         if (!this.isValidPosition(position)) {
            throw new Error(this._moduleName + ': position is out of bounds');
         }
      },

      /**
       * Устанавливает текущий элемент исходя из позиции
       * @protected
       */
      _setCurrentByPosition: function () {
         this._current = this._position > -1 ?
            this._$items[this.getSourceByInternal(this._position)] :
            undefined;
      },

      /**
       * Устанавливает позицию исходя из текущего элемента
       * @protected
       */
      _setPositionByCurrent: function () {
         this._position = -1;
         var index = this._current ? this._$items.indexOf(this._current) : -1;
         if (
            index > -1 &&
            this._$filterMap[index]
         ) {
            this._position = this.getInternalBySource(index);
         } else {
            this._current = undefined;
         }
      }

      //endregion Protected methods
   });

   return CollectionEnumerator;
});
