/* global define, $ws */
define('js!SBIS3.CONTROLS.PagerMore', [
   'js!SBIS3.CORE.CompoundControl',
   'js!SBIS3.CONTROLS.Data.Collection.ISourceLoadable',
   'html!SBIS3.CONTROLS.PagerMore'
], function(CompoundControl, ISourceLoadable, dotTplFn) {
   'use strict';

   /**
    * Контрол, загружающий записи в коллекцию c реализацией интерфейса SBIS3.CONTROLS.Data.Collection.ISourceLoadable постранично
    * @class SBIS3.CONTROLS.PagerMore
    * @extends SBIS3.CORE.CompoundControl
    * @public
    * @author Крайнов Дмитрий Олегович
    */

   var PagerMore = CompoundControl.extend([], /** @lends SBIS3.CONTROLS.PagerMore.prototype */{
      _moduleName: 'SBIS3.CONTROLS.PagerMore',
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {
            /**
             * @cfg {SBIS3.CONTROLS.Data.Collection.ISourceLoadable} Коллекция, в которую загружаются записи
             * @name items
             */

            /**
             * @cfg {Number} Номер текущей страницы
             */
            pageNum: 0,

            /**
             * @cfg {Number} Размер страницы
             */
            pageSize: 0,
            
            /**
             * @cfg {PageType} Вид постраничной навигации
             */
            pageType: 'scroll'
         },
         
         /**
          * @var {SBIS3.CONTROLS.Data.Collection.ISourceLoadable} Коллекция, в которую загружаются записи
          */
         _items: undefined
      },

      //region Public methods

      $constructor: function(cfg) {
         cfg = cfg || {};
         if ('items' in cfg) {
            this.setItems(cfg.items);
         }
      },

      init: function() {
         PagerMore.superclass.init.call(this);

         this.getContainer().on('click', 'a', (function() {
            this._loadNext();
            return false;
         }).bind(this));
      },

      /**
       * Возвращает коллекцию, в которую загружаются записи
       * @returns {SBIS3.CONTROLS.Data.Collection.ISourceLoadable}
       * @see items
       * @see setItems
       */
      getItems: function() {
         return this._items;
      },

      /**
       * Устанавливает коллекцию, в которую загружаются записи
       * @param {SBIS3.CONTROLS.Data.Collection.ISourceLoadable} items Коллекция
       * @see items
       * @see getItems
       */
      setItems: function(items) {
         this._items = items;
         this._applySettings();
      },

      /**
       * Возвращает номер текущей страницы
       * @returns {Number}
       * @see pageNum
       * @see setPageNum
       */
      getPageNum: function() {
         return this._options.pageNum;
      },

      /**
       * Устанавливает номер текущей страницы
       * @param {Number} pageNum
       * @see pageNum
       * @see getPageNum
       */
      setPageNum: function(pageNum) {
         if (this._options.pageNum === pageNum) {
            return;
         }
         this._options.pageNum = pageNum;

         this._applySettings();
      },

      /**
       * Возвращает количество записей, выводимое на одной странице.
       * @returns {Number}
       * @see pageSize
       * @see setPageSize
       */
      getPageSize: function() {
         return this._options.pageSize;
      },

      /**
       * Устанавливает количество записей, выводимое на одной странице.
       * @param {Number} pageSize
       * @see pageSize
       * @see getPageSize
       */
      setPageSize: function(pageSize) {
         if (this._options.pageSize === pageSize) {
            return;
         }
         this._options.pageSize = pageSize;

         this._applySettings();
      },

      /**
       * Возвращает признак, что есть еще записи для загрузки
       * @returns {Boolean}
       */
      hasMore: function() {
         return this._items && this._items.hasMore();
      },

      /**
       * Применяет настройки постраничной навигации
       * @private
       */
      _applySettings: function() {
         if (!this._items) {
            return;
         }
         
         if ($ws.helpers.instanceOfMixin(this._items, 'SBIS3.CONTROLS.Data.Query.IQueryable')) {
            this._items.getQuery()
               .offset(this._getOffset())
               .limit(this._options.pageSize);
         }
      },

      /**
       * Возвращает индекс начального элемента выборки
       * @returns {Number}
       */
      _getOffset: function() {
         return this._options.pageNum * this._options.pageSize;
      },

      /**
       * Загружает следующую страницу
       * @private
       */
      _loadNext: function() {
         this._options.pageNum++;
         this._load(ISourceLoadable.MODE_APPEND);
      },

      /**
       * Загружает предыдущую страницу
       * @private
       */
      _loadPrevious: function() {
         this._options.pageNum--;
         this._load(ISourceLoadable.MODE_PREPEND);
      },

      /**
       * Загружает указанную в настройках страницу
       * @param {String} mode Режим загрузки
       * @private
       */
      _load: function(mode) {
         if (!this._options.items) {
            return;
         }

         this._applySettings();
         
         if ($ws.helpers.instanceOfMixin(this._items, 'SBIS3.CONTROLS.Data.Collection.ISourceLoadable')) {
            this._items.load(mode);
         }
      }
   });

   return PagerMore;
});
