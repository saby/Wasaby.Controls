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
             * @cfg {*[]} Карта исходной коллекции
             */
            sourceMap: [],

            /**
             * @cfg {Boolean[]} Результат применения фильтра
             */
            filterMap: [],

            /**
             * @cfg {Number[]} Результат применения сортировки
             */
            sortMap: [],

            /**
             * @cfg {Boolean} Отдавать оригинальные элементы в методах на чтение
             */
            unwrapOnRead: false
         },

         /**
          * @var {Number} Текущий элемент
          */
         _sourceCurrent: undefined,

         /**
          * @var {Number} Текущая позиция (в исходной коллекции)
          */
         _sourcePosition: -1,

         /**
          * @cfg {Number[]} Соответствие позиций проекции и исходной коллекции
          */
         _internalMap: undefined

      },

      $constructor: function () {
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

      /**
       * Возвращает элемент по индексу
       * @param {Number} [index] Индекс
       * @returns {*}
       * @state mutable
       */
      at: function (index, unwrap) {
         return index === undefined ?
            undefined :
            this._getItemContent(this._options.sourceMap[this.getSourceByInternal(index)], unwrap);
      },

      getCurrent: function (unwrap) {
         this._storeSourceCurrent();
         return this._getItemContent(this._sourceCurrent, unwrap);
      },

      setCurrent: function(item) {
         this._sourcePosition = Array.indexOf(this._options.sourceMap, item);
         this._storeSourceCurrent();
      },

      getNext: function (unwrap) {
         var internalPosition = this.getInternalBySource(this._sourcePosition);
         internalPosition++;
         var newPosition = this.getSourceByInternal(internalPosition);

         if (newPosition === undefined || newPosition > this._options.sourceMap.length - 1) {
            return undefined;
         }

         this._sourcePosition = newPosition;
         this._storeSourceCurrent();
         return this._getItemContent(this._sourceCurrent, unwrap);
      },

      //region SBIS3.CONTROLS.Data.Collection.IEnumerator

      reset: function (items) {
         this._sourcePosition = -1;
         this._storeSourceCurrent();
      },

      //endregion SBIS3.CONTROLS.Data.Collection.IEnumerator

      //region Public methods

      /**
       * Возвращает текущую позицию в проекции
       * @returns {Number}
       */
      getPosition: function() {
         return this.getInternalBySource(this._sourcePosition);
      },

      /**
       * Устанавливает текущую позицию
       * @param {Number} internal Позиция в проекции
       * @returns {Boolean}
       */
      setPosition: function(internal) {
         var position = this.getSourceByInternal(internal);

         this._checkPosition(position);

         this._sourcePosition = position;
         this._storeSourceCurrent();
      },

      /**
       * Возвращает предыдущий элемент
       * @returns {*}
       */
      getPrevious: function (unwrap) {
         var internalPosition = this.getInternalBySource(this._sourcePosition);
         internalPosition--;
         var newPosition = this.getSourceByInternal(internalPosition);

         if (newPosition === undefined || newPosition < 0) {
            return undefined;
         }

         this._sourcePosition = newPosition;
         this._storeSourceCurrent();
         return this._getItemContent(this._sourceCurrent, unwrap);
      },

      /**
       * Переиндексирует энумератор
       */
      reIndex: function () {
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
         this._sourcePosition = -1;

         var processItem = function(sourceIndex) {
            if (this._options.filterMap[sourceIndex]) {
               this._internalMap.push(sourceIndex);

               if (this._sourceCurrent === this._options.sourceMap[sourceIndex]) {
                  this._sourcePosition = sourceIndex;
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
         this._sourceCurrent = this._options.sourceMap[this._sourcePosition];
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
      },
      /**
       * возвращает содержимое элемента, если стоит флаг _unwrapOnRead
       * @param item
       * @returns {*}
       * @private
       */
      _getItemContent:function(item, unwrap){
         if(typeof item === 'undefined')
            return item;
         unwrap = (typeof unwrap === 'undefined') ? this._options.unwrapOnRead : unwrap;
         return unwrap ? item.getContents() : item;
      }
      //endregion Protected methods
   });
});
