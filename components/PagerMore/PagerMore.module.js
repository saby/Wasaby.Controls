/* global define, $ws */
define('js!SBIS3.CONTROLS.PagerMore', [
   'js!SBIS3.CORE.CompoundControl',
   'js!SBIS3.CONTROLS.Data.Collection.ISourceLoadable',
   'html!SBIS3.CONTROLS.PagerMore'
], function(CompoundControl, ISourceLoadable, dotTplFn) {
   'use strict';

   /**
    * Пейдер - загружает записи в коллекцию c реализацией интерфейса SBIS3.CONTROLS.Data.Collection.ISourceLoadable постранично
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
             * @typedef {String} PagerType
             * @variant scroll Загрузка по скроллу
             * @variant more Загрузка по нажатии на кнопку "Показать еще"
             * @variant single Навигация с выбором страницы
             */

            /**
             * @cfg {PagerType} Вид постраничной навигации. По умолчанию - по скроллу.
             * @example
             * <pre class="brush:xml">
             *     <option name="pagerType">scroll</option>
             * </pre>
             */
            pagerType: 'scroll',

            /**
             * @typedef {String} Direction
             * @variant down Загрузка вниз
             * @variant up Загрузка вверх
             */

            /**
             * @cfg {Direction} Направление загрузки. По умолчанию - вниз.
             * @example
             * <pre class="brush:xml">
             *     <option name="Direction">down</option>
             * </pre>
             */
            direction: 'down',

            /**
             * @cfg {String} Селектор родительского контейнера, который нужно скрыть, если больше нет записей для загрузки
             */
            visibleParentSelector: ''
         },
         
         /**
          * @var {SBIS3.CONTROLS.Data.Collection.ISourceLoadable} Коллекция, в которую загружаются записи
          */
         _items: undefined,

         /**
          * @var {Boolean} Признак, что коллекция загружается
          */
         _isItemsLoading: false,

         /**
          * @var {jQuery} Контейнер, в котором отслеживаем событие скролла
          */
         _scrollProvider: undefined,

         /**
          * @var {jQuery} Контейнер, в котором отслеживаем позицию скролла
          */
         _scrollContainer: undefined,

         /**
          * @var {Number} Отступ от видимых границ, при котором заранее начинается загрузка
          */
         _scrollPreloadOffset: 200
      },

      //region Public methods

      $constructor: function(cfg) {
         cfg = cfg || {};

         this._onBeforeItemsLoad = this._onBeforeItemsLoad.bind(this);
         this._onAfterItemsLoad = this._onAfterItemsLoad.bind(this);
         this._checkScroll = this._checkScroll.bind(this);

         if ('items' in cfg) {
            this.setItems(cfg.items);
         }
      },

      destroy: function() {
         this._unsubscribeItems();
         if (this._options.pagerType === 'scroll') {
            this._scrollProvider.off('scroll', this._checkScroll);
         }
         PagerMore.superclass.destroy.call(this);
      },

      init: function() {
         PagerMore.superclass.init.call(this);

         this.getContainer().on('click', 'a', (function() {
            this._loadAttempt();
            return false;
         }).bind(this));

         if (this._options.pagerType === 'scroll') {
            //TODO: стек панель в качестве скролл контейнера
            this._scrollProvider = $(window);
            this._scrollContainer = $('body');
            this._scrollProvider.on('scroll', this._checkScroll);
         }
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
         this._unsubscribeItems();
         this._items = items;
         this._items.subscribe('onBeforeCollectionLoad', this._onBeforeItemsLoad);
         this._items.subscribe('onAfterCollectionLoad', this._onAfterItemsLoad);

         this._applySettings();
      },

      _unsubscribeItems: function() {
         if (this._items) {
            this._items.unsubscribe('onBeforeCollectionLoad', this._onBeforeItemsLoad);
            this._items.unsubscribe('onAfterCollectionLoad', this._onAfterItemsLoad);
         }
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
       * Пытается загрузить очередную страницу
       * @private
       */
      _loadAttempt: function() {
         if (!this._options.items ||
            !$ws.helpers.instanceOfMixin(this._items, 'SBIS3.CONTROLS.Data.Collection.ISourceLoadable') ||
            this._isItemsLoading
         ) {
            return;
         }

         var mode = this._options.direction === 'up' ? ISourceLoadable.MODE_PREPEND : ISourceLoadable.MODE_APPEND;
         switch (mode) {
            case ISourceLoadable.MODE_PREPEND:
               if (this._options.pageNum < 1) {
                  return;
               }
               this._options.pageNum--;
               break;
            case ISourceLoadable.MODE_APPEND:
               if (!this.hasMore()) {
                  return;
               }
               this._options.pageNum++;
               break;
         }

         this._applySettings();
         this._isItemsLoading = true;
         this._items.load(mode);
      },

      /**
       * Проверяет, нужно ли еще отображать контрол
       * @private
       */
      _checkState: function() {
         var hasMore = this._options.direction === 'up' ? this._options.pageNum > 0 : this.hasMore();
         if (!hasMore) {
            this.hide();
            if (this._options.visibleParentSelector) {
               this.getContainer().closest(this._options.visibleParentSelector).addClass('ws-hidden');
            }
         }
      },

      /**
       * Обработчик события начала загрузки
       * @private
       */
      _onBeforeItemsLoad: function(event, mode, target) {
         if (this._items.getChildren() !== target) {
            return;
         }
         this._isItemsLoading = true;
      },

      /**
       * Обработчик события окончания загрузки
       * @private
       */
      _onAfterItemsLoad: function(event, mode, dataSet, target) {
         if (this._items.getChildren() !== target) {
            return;
         }
         this._isItemsLoading = false;

         this._checkState();

         //FIXME: для проверки состояния лучше подписаться на onAfterLoadedApply
         //Перед проверкой надо подождать, пока отработает рендер
         (function(){
            if (this._options.pagerType === 'scroll') {
               this._checkScroll();
            }
         }).debounce(250).call(this);
      },

      //region pagerType = scroll

      /**
       * Проверяет, надо ли загрузить еще одну страницу при скролле
       * @private
       */
      _checkScroll: function () {
         if (this._isPagerInViewport()) {
            this._loadAttempt();
         }
      },

      /**
       * Возвращает признак, что контейнер контрола отображается в видимой части окна
       * @private
       */
      _isPagerInViewport: function () {
         if (!this._scrollContainer || !this.isVisible()) {
            return false;
         }
         this._container.height();

         var height = this._container.offset().top || this._scrollContainer.height(),
            scrollTop = this._scrollContainer.scrollTop(),
            viewportHeight = document.documentElement.clientHeight || document.body.clientHeight,
            offsetTop = scrollTop - height +  - this._scrollPreloadOffset,
            offsetBottom = height - viewportHeight - scrollTop - this._scrollPreloadOffset;

         return offsetBottom <= 0 && offsetTop <= 0;
      }

      //endregion pagerType = scroll
   });

   return PagerMore;
});
