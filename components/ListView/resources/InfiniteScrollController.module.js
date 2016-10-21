/**
 * Created by as.suhoruchkin on 21.07.2015.
 */
define('js!SBIS3.CONTROLS.InfiniteScrollController', ["Core/core-instance"], function(cInstance) {
   var MoveHandlers = {
      $protected: {
         _options: {
            view: null,
            infiniteScroll: null,
            infiniteScrollContainer: null
         },
         _loadMoreButton: null,
         _allowInfiniteScroll: false
      },

      init: function() {
         var topParent = view.getTopParent(),
            view = this._options.view;
         if (this.isInfiniteScroll()) {
            view._createLoadingIndicator();
            view._createScrollWatcher();
            /**TODO Это специфическое решение из-за того, что нам нужно догружать данные пока не появится скролл
             * Если мы находися на панельке, то пока она скрыта все данные уже могут загрузиться, но новая пачка не загрузится
             * потому что контейнер невидимый*/
            if (cInstance.instanceOfModule(topParent, 'SBIS3.CORE.FloatArea')) {
               var afterFloatAreaShow = function() {
                  if (view.getItems()) {
                     view._needScrollCompensation = view._options.infiniteScroll == 'up';
                     view._preScrollLoading();
                  }
                  topParent.unsubscribe('onAfterShow', afterFloatAreaShow);
               };
               //Делаем через subscribeTo, а не once, что бы нормально отписываться при destroy FloatArea
               this.subscribeTo(topParent, 'onAfterShow', afterFloatAreaShow);
            }
            view._scrollWatcher.subscribe('onTotalScroll', this._onTotalScrollHandler.bind(this));
         } else if (this._options.infiniteScroll == 'demand') {
            this._loadMoreButton = view.getChildControlByName('loadMoreButton');
            if (view.getItems()) {
               this._setLoadMoreCaption(veiw.getItems());
            }
            this.subscribeTo(loadMoreButton, 'onActivated', this._onLoadMoreButtonActivated.bind(this));
         }
      },

      isInfiniteScroll: function() {
         var scrollLoad = this._options.infiniteScroll !== undefined;
         return this._allowInfiniteScroll && scrollLoad;
      },

      _setLoadMoreCaption: function(dataSet) {
         var more = dataSet.getMetaData().more;
         if (typeof more == 'number') {
            this._loadMoreButton.setCaption('Еще ' + more);
         } else {
            if (more === false) {
               this._loadMoreButton.setVisible(false);
            } else {
               this._loadMoreButton.setCaption('Еще...');
            }
         }
      },

      _onTotalScrollHandler: function(event, type) {
         var scrollOnEdge = (this._options.infiniteScroll === 'up' && type === 'top') || // скролл вверх и доскролили до верхнего края
            (this._options.infiniteScroll === 'down' && type === 'bottom') || // скролл вниз и доскролили до нижнего края
            (this._options.infiniteScroll === 'both'); //скролл в обе стороны и доскролили до любого края

         if (scrollOnEdge && this.getItems()) {
            this._scrollLoadNextPage(type == 'top' ? 'up' : 'down');
         }
      },

      _onLoadMoreButtonActivated: function(event) {
         this._loadNextPage('down');
      },

      _updateScrolOffset: function(direction) {
         if (direction === 'down') {
            this._scrollOffset.bottom += this._limit;
         } else {
            if (this._scrollOffset.top >= this._limit) {
               this._scrollOffset.top -= this._limit;
            } else {
               this._scrollOffset.top = 0;
            }
            //FixMe: увеличиваем нижний оффсет для контактов - их скролл верх на самом деле скролл вниз + reverse
            if (this._options.infiniteScroll == 'up') {
               this._scrollOffset.bottom += this._limit;
            }
         }
      },

      /**
       * Функция догрузки данных пока не появится скролл.Если появился и мы грузили и дорисовывали вверх, нужно поуправлять скроллом.
       * @private
       */
      _preScrollLoading: function() {
         var hasScroll = (function() {
               return this._scrollWatcher.hasScroll();
            }).bind(this),
            scrollDown = this._options.infiniteScroll == 'down' || this._options.infiniteScroll == 'both';
         // Если нет скролла или скролл внизу (при загрузке вниз), значит нужно догружать еще записи
         if ((this.isScrollOnBottom() && scrollDown && !this._lastPageLoaded) || !hasScroll()) {
            this._scrollLoadNextPage();
         } else {
            if (this._needScrollCompensation) {
               this._moveTopScroll();
               this._needScrollCompensation = false;
            }
         }
      },
      /**
       * Если скролл находится в самом верху и добавляются записи вверх - скролл не останнется на месте,
       * а будет все так же вверху. Поэтому после отрисовки записей вверх, подвинем скролл на прежнее место -
       * конец предпоследней страницы
       * @private
       */
      _moveTopScroll: function() {
         var scrollAmount = this._scrollWatcher.getScrollHeight() - this._containerScrollHeight;
         //Если запускаем 1ый раз, то нужно поскроллить в самый низ (ведь там "начало" данных), в остальных догрузках скроллим вниз на
         //разницы величины скролла (т.е. на сколько добавилось высоты, на столько и опустили). Получается плавно
         if (scrollAmount) {
            this._scrollWatcher.scrollTo(scrollAmount);
         }
      },
   };

   return MoveHandlers;
});