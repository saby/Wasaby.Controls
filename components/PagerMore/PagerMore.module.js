/* global define, $ws */
define('js!SBIS3.CONTROLS.PagerMore', [
   'js!SBIS3.CORE.CompoundControl',
   'js!SBIS3.CONTROLS.Data.Collection.ISourceLoadable',
   'html!SBIS3.CONTROLS.PagerMore'
], function(CompoundControl, ISourceLoadable, dotTplFn) {
   'use strict';

   /**
    * Контрол, добавляющий записи в коллекцию по одной странице
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
             * @cfg {SBIS3.CONTROLS.Data.Collection.ISourceLoadable} Коллекция, в которую надо добавлять записи
             */
            items: undefined,

            /**
             * @cfg {Number} Номер текущей страницы
             */
            pageNum: 0,

            /**
             * @cfg {Number} Размер страницы
             */
            pageSize: undefined
         },

         /**
          * @var {SBIS3.CONTROLS.CollectionControl.ListPresenter} Презентер списка
          */
         _presenter: undefined
      },

      //region Public methods

      $constructor: function() {
         this._applySettings();
      },

      init: function() {
         PagerMore.superclass.init.call(this);

         this.getContainer().on('click', 'a', (function() {
            this._loadNext();
            return false;
         }).bind(this));
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
       * @param {Number} pageSize Количество записей.
       * @example
       * <pre>
       *     myListView.setPageSize(20);
       * </pre>
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
       * @param {Number} pageSize Количество записей.
       * @example
       * <pre>
       *     myListView.setPageSize(20);
       * </pre>
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
       * Применяет настройки постраничной навигации
       * @private
       */
      _applySettings: function() {
         if (!this._options.items) {
            return;
         }
         if ($ws.helpers.instanceOfMixin(this._options.items, 'SBIS3.CONTROLS.Data.Query.IQueryable')) {
            this._options.items.getQuery()
               .offset(this._options.pageNum * this._options.pageSize)
               .limit(this._options.pageSize);
         }
      },

      /**
       * Загружает следующую страницу
       */
      _loadNext: function() {
         this._options.pageNum++;
         this._load(ISourceLoadable.MODE_APPEND);
      },

      /**
       * Загружает предыдущую страницу
       */
      _loadPrevious: function() {
         this._options.pageNum--;
         this._load(ISourceLoadable.MODE_PREPEND);
      },

      /**
       * Загружает указанную в настройках страницу
       * @param {String} mode Режим загрузки
       */
      _load: function(mode) {
         if (!this._options.items) {
            return;
         }

         this._applySettings();

         if ($ws.helpers.instanceOfMixin(this._options.items, 'SBIS3.CONTROLS.Data.Collection.ISourceLoadable')) {
            this._options.items.load(mode);
         }
      }
   });

   return PagerMore;
});
