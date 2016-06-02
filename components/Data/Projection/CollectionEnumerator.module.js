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
       * @member {Number} Текущая позиция
       */
      _position: -1,

      /**
       * @member {SBIS3.CONTROLS.Data.Projection.CollectionItem} Текущий элемент
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

      //region SBIS3.CONTROLS.Data.Collection.IEnumerator

      getCurrent: function () {
         return this._current;
      },

      reset: function () {
         this._position = -1;
         this._setCurrentByPosition();
      },

      //endregion SBIS3.CONTROLS.Data.Collection.IEnumerator

      //region SBIS3.CONTROLS.Data.Collection.IndexedEnumeratorMixin

      reIndex: function () {
         IndexedEnumeratorMixin.reIndex.call(this);
         this._internalToSource = null;
         this._sourceToInternal = [];
         this._position = -1;
         if (this._current) {
            this._setPositionByCurrent();
         }
      },

      _createIndex: function (property) {
         var savedPosition = this._position,
            result = IndexedEnumeratorMixin._createIndex.call(this, property);

         this._position = savedPosition;
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
         this._position = this.getInternalBySource(Array.indexOf(this._$items, item));
         this._setCurrentByPosition();
      },

      /**
       * Возвращает текущую позицию проекции
       * @returns {Number}
       */
      getPosition: function() {
         return this._position;
      },

      /**
       * Устанавливает текущую позицию
       * @param {Number} position Позиция проекции
       * @returns {Boolean}
       */
      setPosition: function(position) {
         this._checkPosition(position);
         this._position = position;
         this._setCurrentByPosition();
      },

      /**
       * Возвращает предыдущий элемент
       * @returns {*}
       */
      getPrevious: function () {
         if (this._position < 1) {
            return;
         }
         this._position--;
         this._setCurrentByPosition();
         return this.getCurrent();
      },

      /**
       * Возвращает следующий элемент
       * @returns {*}
       */
      getNext: function () {
         if (this._position >= this._$items.length - 1) {
            return;
         }
         this._position++;
         this._setCurrentByPosition();
         return this.getCurrent();
      },

      /**
       * Вычисляет позицию в проекции относительно позиции в исходной коллекции
       * @param {Number} source Позиция в исходной коллекции
       * @returns {Number}
       */
      getInternalBySource: function (source) {
         if (source === undefined || source === null || source === -1) {
            return source;
         }
         this._initInternalMap();

         if (this._sourceToInternal[source] === undefined) {
            this._sourceToInternal[source] = Array.indexOf(this._internalToSource, source);
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
         if (!this._isValidPosition(position)) {
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
         var index = this._current ? Array.indexOf(this._$items, this._current) : -1;
         if (
            index > -1 &&
            this._$filterMap[index]
         ) {
            this._position = this.getInternalBySource(index);
         } else {
            this._current = undefined;
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
