define('js!SBIS3.CONTROLS.InfiniteScrollController', [], function () {

   'use strict';

   /**
    * @class SBIS3.CONTROLS.InfiniteScrollController
    * @extends SBIS3.CORE.CompoundControl
    * @control
    * @public
    */
   
   InfiniteScrollController = CompoundControl.extend(/** @lends SBIS3.CONTROLS.InfiniteScrollController.prototype */ {
      $protected: {
         _options: {
            view: null,
            scrollContainer: null,
            loadDirection: null
         },
         // Состояние подгрузки по скроллу
         // mode: null - выключена; up - грузим предыдущую страницу; down - грузим следующую страницу
         // reverse: false - верхняя страница вставляется вверх, нижняя вниз; true - нижняя страница вставляется вверх;
         _infiniteScrollState: {
            mode: null,
            reverse: false
         },
         _allowInfiniteScroll: true,
         _scrollOffset: {
            top: null,
            bottom: null
         },
         _containerScrollHeight: undefined,
      },
      $constructor: function () {

      },

      init: function(){
         var view = this._options.view,
            topParent = view.getTopParent();

         if (this.isInfiniteScroll()) {
            this._createLoadingIndicator();
            this._createScrollWatcher();

            if (this._options.infiniteScroll == 'demand'){
               this._setInfiniteScrollState('down');
               return;
            }
            // Пока по умолчанию считаем что везде подгрузка вниз, и если указана 'up' - значит она просто перевернута
            this._setInfiniteScrollState('down', this._options.loadDirection == 'up');
            /**TODO Это специфическое решение из-за того, что нам нужно догружать данные пока не появится скролл
             * Если мы находися на панельке, то пока она скрыта все данные уже могут загрузиться, но новая пачка не загрузится
             * потому что контейнер невидимый*/
            if (cInstance.instanceOfModule(topParent, 'SBIS3.CORE.FloatArea')){
               var afterFloatAreaShow = function(){
                  if (self.getItems()) {
                     if (self._options.loadDirection == 'up'){
                        self._moveTopScroll();
                     }
                     self._preScrollLoading();
                  }
                  topParent.unsubscribe('onAfterShow', afterFloatAreaShow);
               };
               //Делаем через subscribeTo, а не once, что бы нормально отписываться при destroy FloatArea
               this.subscribeTo(topParent, 'onAfterShow', afterFloatAreaShow);
            }
            this._options.scrollWatcher.subscribe('onTotalScroll', this._onTotalScrollHandler.bind(this));
         }
      },

      isInfiniteScroll: function () {
         return this._allowInfiniteScroll && this._options.loadDirection !== null;
      },

      _setInfiniteScrollState: function(mode, reverse){
         if (mode) {
            this._infiniteScrollState.mode = mode;
         }
         if (reverse){
            this._infiniteScrollState.reverse = reverse;
         }
      },

      _createLoadingIndicator : function () {
         var view = this._options.view;
         this._loadingIndicator = view.getContainer().find('.controls-ListView-scrollIndicator');
         // При подгрузке вверх индикатор должен быть над списком
         if (this._options.loadDirection == 'up'){
            this._loadingIndicator.prependTo(view.getContainer());
         }
      },

      _showLoadingIndicator: function () {
         if (!this._loadingIndicator) {
            this._createLoadingIndicator();
         }
         this._loadingIndicator.removeClass('ws-hidden');
      },

      _hideLoadingIndicator: function () {
         if (this._loadingIndicator && !this._loader) {
            this._loadingIndicator.addClass('ws-hidden');
         }
      },

      /**
       * Если скролл находится в самом верху и добавляются записи вверх - скролл не останнется на месте,
       * а будет все так же вверху. Поэтому после отрисовки записей вверх, подвинем скролл на прежнее место -
       * конец предпоследней страницы
       * @private
       */
      _moveTopScroll: function() {
         var view = this._options.view,
            scrollWatcher = this._options.scrollWatcher,
            scrollAmount = scrollWatcher.getScrollHeight() - this._containerScrollHeight;
         //Если запускаем 1ый раз, то нужно поскроллить в самый низ (ведь там "начало" данных), в остальных догрузках скроллим вниз на
         //разницы величины скролла (т.е. на сколько добавилось высоты, на столько и опустили). Получается плавно
         if (scrollAmount) {
            scrollWatcher.scrollTo(scrollAmount);
         }
      },

      /**
       * Функция догрузки данных пока не появится скролл
       */
      _preScrollLoading: function(){
         var scrollWatcher = this._options.scrollWatcher,
            scrollDown = this._infiniteScrollState.mode == 'down' && !this._infiniteScrollState.reverse;
         // Если нет скролла или скролл внизу (при загрузке вниз), значит нужно догружать еще записи
         if ((this.isScrollOnBottom() && scrollDown) || !scrollWatcher.hasScroll()) {
            this._scrollLoadNextPage();
         }
      },

      _reloadInfiniteScrollParams : function(){
         this._containerScrollHeight = 0;
         this._needScrollCompensation = this._options.loadDirection == 'up';
         if (this.isInfiniteScroll()) {
            this._scrollOffset.top = this._offset;
            this._scrollOffset.bottom = this._offset;
         }
      },

      _updateScrolOffset: function(){
         if (this._infiniteScrollState.mode === 'down' || this._infiniteScrollState.mode == 'demand') {
            this._scrollOffset.bottom += this._limit;
         } else {
            if (this._scrollOffset.top >= this._limit){
               this._scrollOffset.top -= this._limit;
            } else {
               this._scrollOffset.top = 0;
            }
         }
      },

      _onTotalScrollHandler: function(event, type){
         var view = this._options.view,
            mode = this._infiniteScrollState.mode,
            scrollOnEdge =  (mode === 'up' && type === 'top') ||   // скролл вверх и доскролили до верхнего края
                            (mode === 'down' && type === 'bottom' && !this._infiniteScrollState.reverse) || // скролл вниз и доскролили до нижнего края
                            (mode === 'down' && type === 'top' && this._infiniteScrollState.reverse) || // скролл верх с запросом данных вниз и доскролили верхнего края
                            (this._options.loadDirection === 'both');

         if (scrollOnEdge && view.getItems()) {
            // Досткролили вверх, но на самом деле подгружаем данные как обычно, а рисуем вверх
            if (type == 'top' && this._infiniteScrollState.reverse) {
               this._setInfiniteScrollState('down');
            } else {
               this._setInfiniteScrollState(type == 'top' ? 'up' : 'down');
            }
            this._scrollLoadNextPage();
         }
      },

      /**
       * Подгрузить еще данные вверх или вниз
       * @param  {String} direction в какую сторону грузим
       */
      _scrollLoadNextPage: function (direction) {
         var scrollWatcher = this._options.scrollWatcher,
            view = this._options.view,
            loadAllowed  = this.isInfiniteScroll() && this._options.loadDirection !== 'demand',
            more = view.getItems().getMetaData().more,
            isContainerVisible = dcHelpers.isElementVisible(this.getContainer()),
            // отступ с учетом высоты loading-indicator
            hasScroll = scrollWatcher.hasScroll(this._loadingIndicator.height()),
            hasNextPage = view._hasNextPage(more, this._scrollOffset.bottom);

         //Если подгружаем элементы до появления скролла показываем loading-indicator рядом со списком, а не поверх него
         view.getContainer().toggleClass('controls-ListView__outside-scroll-loader', !hasScroll);

         //Если в догруженных данных в датасете пришел n = false, то больше не грузим.
         if (loadAllowed && isContainerVisible && hasNextPage && !view.isLoading()) {
            this._loadNextPage();
         }
      },

   });

   return InfiniteScrollController;
});