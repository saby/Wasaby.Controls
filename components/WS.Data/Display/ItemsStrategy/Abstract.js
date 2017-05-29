/* global define */
define('js!WS.Data/Display/ItemsStrategy/Abstract', [
   'js!WS.Data/Entity/Abstract',
   'js!WS.Data/Di',
   'Core/core-instance'
], function (
   Abstract,
   Di,
   CoreInstance
) {
   'use strict';

   /**
    * Абстрактная стратегия получения элементов проекции
    * @class WS.Data/Display/ItemsStrategy/Abstract
    * @extends WS.Data/Entity/Abstract
    * @public
    * @author Мальцев Алексей
    */

   return Abstract.extend(/** @lends WS.Data/Display/ItemsStrategy/Abstract.prototype */{
      /**
       * @typedef {Object} Options
       * @property {String|Function} itemModule Алиас зависимости или конструктора элементов проекции
       */

      _moduleName: 'WS.Data/Display/ItemsStrategy/Abstract',

      /**
       * @member {WS.Data/Display/Collection} Проекция
       */
      _display: null,

      /**
       * @member {WS.Data/Collection/IEnumerable} Исходная коллекция
       */
      _collection: null,

      /**
       * @member {Array.<WS.Data/Display/CollectionItem>} Элементы проекции
       */
      _items: null,

      /**
       * @member {Options} Тип элемента проекции
       */
      _options: '',// eslint-disable-line check-location-options

      /**
       * Конструктор
       * @param {WS.Data/Display/Collection} display Проекция
       * @param {Options} options Опции
       */
      constructor: function $Abstract(display, options) {
         this._display = display;
         this._collection = display.getCollection();
         this._options = options || {};
         this._items = [];
         this._initItems();
      },

      //region Public methods

      /**
       * Возвращает опции
       * @return {Options}
       */
      getOptions: function () {
         return this._options;
      },

      /**
       * Возвращает элемент по позиции
       * @param {Number} index Позиция
       * @return {WS.Data/Display/CollectionItem}
       */
      at: function (index) {
         throw new Error('Method must be implemented');
      },

      /**
       * Возвращает количество элементов проекции
       * @return {Number}
       */
      getCount: function() {
         throw new Error('Method must be implemented');
      },

      /**
       * Возвращает элементы проекции
       * @return {Array.<WS.Data/Display/CollectionItem>}
       */
      getItems: function () {
         return this._items;
      },

      /**
       * Очищает сформированные результаты
       * @param {Number} start Позиция
       * @param {Number} deleteCount Количество удаляемых элементов
       * @param {Array} [added] Добавляемые элементы
       * @return {WS.Data/Display/CollectionItem} Удаленные элементы
       */
      splice: function (start, deleteCount, added) {
         throw new Error('Method must be implemented');
      },

      /**
       * Очищает сформированные результаты
       */
      reset: function () {
         this._items.length = 0;
         this._initItems();
      },

      /**
       * Добавляет методы сортировки
       * @param {Array.<Object>} sorters Набор методов сортировки
       */
      addSorters: function (sorters) {
      },

      /**
       * Оборачивает объект в элемент проекции, если он еще им не является
       * @param {*} source Объект
       * @param {*} [options] Опции
       * @return {WS.Data/Display/CollectionItem}
       */
      convertToItemIf: function (source, options) {
         if (CoreInstance.instanceOfModule(source, 'WS.Data/Display/CollectionItem')) {
            return source;
         }
         return this.convertToItem.apply(this, arguments);
      },

      /**
       * Оборачивает объект в элемент проекции
       * @param {*} source Объект
       * @param {*} [options] Опции
       * @return {WS.Data/Display/CollectionItem}
       */
      convertToItem: function (source, options) {
         options = options || {};
         options.contents = source;
         options.owner = this._display;

         return Di.resolve(this.getItemModule(), options);
      },

      /**
       * Возвращает имя модуля
       * @return {String|Function}
       */
      getItemModule: function() {
         return this._options.itemModule;
      },

      //endregion Public methods

      //region Protected methods

      /**
       * Инициализирует элементы
       * @protected
       */
      _initItems: function() {
      }

      //endregion Protected methods
   });
});
