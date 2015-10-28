/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Projection.CollectionEnumerator', [
   'js!SBIS3.CONTROLS.Data.Collection.IEnumerator',
   'js!SBIS3.CONTROLS.Data.Collection.IndexedEnumeratorMixin'
], function (IEnumerator, IndexedEnumeratorMixin) {
   'use strict';

   /**
    * Энумератор для проекции коллекции
    * @class SBIS3.CONTROLS.Data.Projection.CollectionEnumerator
    * @mixes SBIS3.CONTROLS.Data.Collection.IEnumerator
    * @mixes SBIS3.CONTROLS.Data.Collection.IndexedEnumeratorMixin
    * @public
    * @author Мальцев Алексей
    */

   return $ws.core.extend({}, [IEnumerator, IndexedEnumeratorMixin], /** @lends SBIS3.CONTROLS.Data.Projection.CollectionEnumerator.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Projection.CollectionEnumerator',
      $protected: {
         _options: {
            /**
             * @var {SBIS3.CONTROLS.Data.Collection.CollectionItem[]} Индекс проекции коллекции
             */
            itemsMap: [],

            /**
             * @cfg {*[]} Индекс исходной коллекции
             */
            sourceMap: [],

            /**
             * @cfg {Boolean[]} Результат применения фильтра
             */
            filterMap: [],

            /**
             * @cfg {Number[]} Результат применения сортировки
             */
            sortMap: []
         },

         /**
          * @var {SBIS3.CONTROLS.Data.Collection.CollectionItem} Текущий элемент
          */
         _сurrent: undefined,

         /**
          * @var {Number} Текущая позиция (в исходной коллекции)
          */
         _currentPosition: -1,

         /**
          * @cfg {Number[]} Соответствие позиций проекции и исходной коллекции
          */
         _internalMap: undefined

      },

      $constructor: function () {
         if (!(this._options.itemsMap instanceof Array)) {
            throw new Error('Items map should be instance of an Array');
         }
         if (!(this._options.sourceMap instanceof Array)) {
            throw new Error('Source map should be instance of an Array');
         }
         if (!(this._options.filterMap instanceof Array)) {
            throw new Error('Filter map should be instance of an Array');
         }
         if (!(this._options.sortMap instanceof Array)) {
            throw new Error('Sort map should be instance of an Array');
         }

         this._buildInternalMap();
      },

      //region SBIS3.CONTROLS.Data.Collection.IEnumerator

      getNext: function () {
         var internalPosition = this.getInternalBySource(this._currentPosition);
         internalPosition++;
         var newPosition = this.getSourceByInternal(internalPosition);

         if (newPosition === undefined || newPosition > this._options.itemsMap.length - 1) {
            return undefined;
         }

         this._currentPosition = newPosition;
         this._storeSourceCurrent();
         return this._сurrent;
      },

      getCurrent: function () {
         this._storeSourceCurrent();
         return this._сurrent;
      },

      reset: function (items) {
         this._currentPosition = -1;
         this._storeSourceCurrent();
      },

      //endregion SBIS3.CONTROLS.Data.Collection.IEnumerator

      //region Public methods

      /**
       * Возвращает элемент по индексу
       * @param {Number} index Индекс
       * @returns {SBIS3.CONTROLS.Data.Collection.CollectionItem}
       * @state mutable
       */
      at: function (index) {
         return index === undefined ?
            undefined :
            this._options.itemsMap[this.getSourceByInternal(index)];
      },

      /**
       * Устанавливает текущий элемент
       * @param {SBIS3.CONTROLS.Data.Collection.CollectionItem} item Текущий элемент
       */
      setCurrent: function(item) {
         this._currentPosition = Array.indexOf(this._options.itemsMap, item);
         this._storeSourceCurrent();
      },

      /**
       * Возвращает текущую позицию в проекции
       * @returns {Number}
       */
      getPosition: function() {
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
         this._storeSourceCurrent();
      },

      /**
       * Возвращает предыдущий элемент
       * @returns {*}
       */
      getPrevious: function () {
         var internalPosition = this.getInternalBySource(this._currentPosition);
         internalPosition--;
         var newPosition = this.getSourceByInternal(internalPosition);

         if (newPosition === undefined || newPosition < 0) {
            return undefined;
         }

         this._currentPosition = newPosition;
         this._storeSourceCurrent();
         return this._сurrent;
      },

      /**
       * Переиндексирует энумератор
       */
      reIndex: function () {
         IndexedEnumeratorMixin.reIndex.call(this);
         this._buildInternalMap();
      },

      /**
       * Вычисляет позицию в проекции относительно позиции в исходной коллекции
       * @param {Number} sourcePosition Позиция в исходной коллекции
       * @returns {Number}
       */
      getInternalBySource: function (source) {
         if (source === undefined) {
            return source;
         }
         return Array.indexOf(this._internalMap, source);
      },

      /**
       * Вычисляет позицию в исходной коллекции относительно позиции в проекции
       * @param {Number} internal Позиция в проекции
       * @returns {Number}
       */
      getSourceByInternal: function (internal) {
         if (internal === undefined || internal === -1 || internal === null) {
            return internal;
         }
         return this._internalMap[internal];
      },

      //endregion Public methods

      //region Protected methods

      /**
       * Строит соответствие позиций проекции и исходной коллекции
       * @private
       */
      _buildInternalMap: function () {
         this._internalMap = [];
         this._currentPosition = -1;

         var processItem = function(sourceIndex) {
            if (this._options.filterMap[sourceIndex]) {
               this._internalMap.push(sourceIndex);
               if (this._сurrent && this._сurrent === this._options.itemsMap[sourceIndex]) {
                  this._currentPosition = sourceIndex;
               }
            }
         };

         if (this._options.sortMap.length) {
            this._options.sortMap.map(function(index){
               processItem.call(this, index);
            }, this);
         } else {
            this._options.sourceMap.map(function(item, index){
               processItem.call(this, index);
            }, this);
         }

         this._storeSourceCurrent();
      },

      /**
       * Запоминает текущий элемент
       * @private
       */
      _storeSourceCurrent: function () {
         this._сurrent = this._options.itemsMap[this._currentPosition];
      },

      /**
       * Проверяет корректность позиции
       * @param {Number} position Позиция
       * @private
       */
      _checkPosition: function (position) {
         if (!this._isValidPosition(position)) {
            throw new Error('Index is out of bounds');
         }
      },

      /**
       * Возвращает признак корректности позиции
       * @param {Number} position Позиция
       * @returns {Boolean}
       * @private
       */
      _isValidPosition: function (position) {
         return position >= -1 && position < this._options.sourceMap.length;
      }

      //endregion Protected methods
   });
});
