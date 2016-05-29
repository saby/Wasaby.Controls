/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Projection.CollectionEnumerator', [
   'js!SBIS3.CONTROLS.Data.Entity.Abstract',
   'js!SBIS3.CONTROLS.Data.Entity.OptionsMixin',
   'js!SBIS3.CONTROLS.Data.Collection.IEnumerator',
   'js!SBIS3.CONTROLS.Data.Collection.IndexedEnumeratorMixin'
], function (Abstract, OptionsMixin, IEnumerator, IndexedEnumeratorMixin) {
   'use strict';

   /**
    * Энумератор для проекции коллекции
    * @class SBIS3.CONTROLS.Data.Projection.CollectionEnumerator
    * @extends SBIS3.CONTROLS.Data.Entity.Abstract
    * @mixes SBIS3.CONTROLS.Data.Entity.OptionsMixin
    * @mixes SBIS3.CONTROLS.Data.Collection.IEnumerator
    * @mixes SBIS3.CONTROLS.Data.Collection.IndexedEnumeratorMixin
    * @public
    * @author Мальцев Алексей
    */

   var CollectionEnumerator = Abstract.extend([OptionsMixin, IEnumerator, IndexedEnumeratorMixin], /** @lends SBIS3.CONTROLS.Data.Projection.CollectionEnumerator.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Projection.CollectionEnumerator',

      /**
       * @cfg {Array.<SBIS3.CONTROLS.Data.Projection.CollectionItem>} Индекс проекции коллекции
       * @name SBIS3.CONTROLS.Data.Projection.CollectionEnumerator#items
       */
      _$items: null,

      /**
       * @cfg {Array.<Boolean>} Результат применения фильтра
       * @name SBIS3.CONTROLS.Data.Projection.CollectionEnumerator#filterMap
       */
      _$filterMap: null,

      /**
       * @cfg {Array.<Number>} Результат применения сортировки
       * @name SBIS3.CONTROLS.Data.Projection.CollectionEnumerator#sortMap
       */
      _$sortMap: null,

      /**
       * @member {SBIS3.CONTROLS.Data.Projection.CollectionItem} Текущий элемент
       */
      _сurrent: undefined,

      /**
       * @member {Number} Текущая позиция (в исходной коллекции)
       */
      _currentPosition: -1,

      /**
       * @member {Array.<Number>} Соответствие позиций проекции и исходной коллекции
       */
      _internalMap: null,

      /**
       * @member {Array.<Number>} Кэш соответствия позиций исходной коллекции и проекции
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

      //region SBIS3.CONTROLS.Data.Collection.IEnumerator

      getCurrent: function () {
         this._initInternalMap();
         this._setCurrentByPosition();
         return this._сurrent;
      },

      reset: function () {
         this._currentPosition = -1;
         this._setCurrentByPosition();
      },

      //endregion SBIS3.CONTROLS.Data.Collection.IEnumerator

      //region SBIS3.CONTROLS.Data.Collection.IndexedEnumeratorMixin

      reIndex: function () {
         IndexedEnumeratorMixin.reIndex.call(this);
         this._internalMap = null;
         this._sourceToInternal = [];
      },

      _createIndex: function (property) {
         var savedPosition = this._currentPosition,
            result = IndexedEnumeratorMixin._createIndex.call(this, property);

         this._currentPosition = savedPosition;
         return result;
      },

      //endregion SBIS3.CONTROLS.Data.Collection.IndexedEnumeratorMixin

      //region Public methods

      /**
       * Возвращает элемент по индексу
       * @param {Number} index Индекс
       * @returns {SBIS3.CONTROLS.Data.Projection.CollectionItem}
       * @state mutable
       */
      at: function (index) {
         return index === undefined ?
            undefined :
            this._$items[this.getSourceByInternal(index)];
      },

      /**
       * Устанавливает текущий элемент
       * @param {SBIS3.CONTROLS.Data.Projection.CollectionItem} item Текущий элемент
       */
      setCurrent: function(item) {
         this._currentPosition = Array.indexOf(this._$items, item);
         this._setCurrentByPosition();
      },

      /**
       * Возвращает текущую позицию в проекции
       * @returns {Number}
       */
      getPosition: function() {
         this._initInternalMap();
         return this.getInternalBySource(this._currentPosition);
      },

      /**
       * Устанавливает текущую позицию
       * @param {Number} internal Позиция в проекции
       * @returns {Boolean}
       */
      setPosition: function(internal) {
         var position = this.getSourceByInternal(internal);

         this._checkPosition(position);

         this._currentPosition = position;
         this._setCurrentByPosition();
      },

      /**
       * Возвращает предыдущий элемент
       * @returns {*}
       */
      getPrevious: function () {
         this._initInternalMap();
         var internalPosition = this.getInternalBySource(this._currentPosition);
         internalPosition--;
         var newPosition = this.getSourceByInternal(internalPosition);

         if (newPosition === undefined || newPosition < 0) {
            return undefined;
         }

         this._currentPosition = newPosition;
         this._setCurrentByPosition();
         return this._сurrent;
      },

      /**
       * Возвращает следующий элемент
       * @returns {*}
       */
      getNext: function () {
         this._initInternalMap();
         var internalPosition = this.getInternalBySource(this._currentPosition);
         internalPosition++;
         var newPosition = this.getSourceByInternal(internalPosition);

         if (newPosition === undefined || newPosition > this._$items.length - 1) {
            return;
         }

         this._currentPosition = newPosition;
         this._setCurrentByPosition();
         return this._сurrent;
      },

      /**
       * Вычисляет позицию в проекции относительно позиции в исходной коллекции
       * @param {Number} source Позиция в исходной коллекции
       * @returns {Number}
       */
      getInternalBySource: function (source) {
         if (source === undefined) {
            return source;
         }
         this._initInternalMap();

         if (this._sourceToInternal[source] === undefined) {
            this._sourceToInternal[source] = Array.indexOf(this._internalMap, source);
         }
         return this._sourceToInternal[source];
      },

      /**
       * Вычисляет позицию в исходной коллекции относительно позиции в проекции
       * @param {Number} internal Позиция в проекции
       * @returns {Number}
       * @protected
       */
      getSourceByInternal: function (internal) {
         if (internal === undefined || internal === -1 || internal === null) {
            return internal;
         }
         this._initInternalMap();
         return this._internalMap[internal];
      },

      //endregion Public methods

      //region Protected methods

      /**
       * Инициализирует массив соответствия позиций проекции и исходной коллекции
       * @protected
       */
      _initInternalMap: function () {
         if (this._internalMap === null) {
            this._currentPosition = -1;
            this._internalMap = this._buildInternalMap();
            this._setCurrentByPosition();
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
            i;

         for (i = 0; i < sortMap.length; i++) {
            this._addToInternalMap(result, sortMap[i]);
         }

         return result;
      },

      /**
       * Добавляет соответствие позиций проекции и исходной коллекции с учетом фильтра
       * @protected
       */
      _addToInternalMap: function (map, sourceIndex) {
         if (this._$filterMap[sourceIndex]) {
            map.push(sourceIndex);
            if (this._сurrent && this._сurrent === this._$items[sourceIndex]) {
               this._currentPosition = sourceIndex;
            }
         }
      },

      /**
       * Производит построение invertedMap
       * @return {Array.<Number>}
       * @protected
       */
      _buildInvertedMap: function () {
         var result = [];
         for (var i = 0; i < this._internalMap.length; i++) {
            result[this._internalMap[i]] = i;
         }
         return result;
      },

      /**
       * Запоминает текущий элемент исходя из текущей позиции
       * @protected
       */
      _setCurrentByPosition: function () {
         this._сurrent = this._$items[this._currentPosition];
      },

      /**
       * Проверяет корректность позиции
       * @param {Number} position Позиция
       * @protected
       */
      _checkPosition: function (position) {
         if (!this._isValidPosition(position)) {
            throw new Error(this._moduleName + ': position is out of bounds');
         }
      },

      /**
       * Возвращает признак корректности позиции
       * @param {Number} position Позиция
       * @returns {Boolean}
       * @protected
       */
      _isValidPosition: function (position) {
         return position >= -1 && position < this._$items.length;
      }

      //endregion Protected methods
   });

   return CollectionEnumerator;
});
