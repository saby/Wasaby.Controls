define('js!Controls/List/Controllers/VirtualScroll',
   ['Core/Abstract'],
   function(Abstract) {
      /**
       *
       * @author Девятов Илья
       * @public
       */
      var VirtualScroll = Abstract.extend([], {
         _heightStrategy: 'fixed',  //Стратегия рассчетов высоты строки
         _heightRow: null,   //высота строки
         _visiblePages: 5,   //сколько страниц рисуем, остальные вытесняем

         _currentPage: 0,  //Текущая отображаемая страница
         _heights: [],     //массив высот

         _virtualWindow: {
            start: null,
            end: null
         },

         constructor: function(cfg) {
            //this._options = cfg;
            console.log('VirtualScroll constructor');

            this._itemsLength = cfg.itemsLength;
            this._pageSize = cfg.pageSize;
            this._visiblePages = cfg.visiblePages;
            this._heightStrategy = cfg.heightStrategy;
            this._heightRow = cfg.fixedHeightRow;

            this._oldHandledScrollTop = 0;   //Последнее обработанное смещение
            this._virtualWindow = {
               start: 0,
               end: Math.min((this._visiblePages - 1) * cfg.pageSize, cfg.itemsLength)
            };

            console.log('virtual window:' + this._virtualWindow.start + '  ' + this._virtualWindow.end );

            VirtualScroll.superclass.constructor.apply(this, arguments);
         },

         getVirtualWindow: function() {
            return this._virtualWindow;
         },

         /**
          * Найти нужные домЭлементы, подписаться на нужные события (работа через onScroll или IntersectionObserver)
          * @param container
          */
         initDomElements: function(container) {
            //Пока работаем через onScroll, ищем у кого подписаться, подписываемся
            var scrollContainer = container.closest('.scroll-container');
            scrollContainer[0].addEventListener('scroll', this._onScroll.bind(this));
         },

         /**
          * посчитать высоты отрисованных строк
          * @param itemsContainer контейнер с элементами
          */
         initHeights: function(itemsContainer) {
            debugger;
            if (this._heightStrategy !== 'calc') {
               return;
            }

            var self = this;
            itemsContainer.find('.ws-ListView__item').each(function(item) {
               self._heights.push(this.offsetHeight);
            });
         },

         /**
          * Обновление индексов отображаемых элементов, если это необходимо
          * @param data (для работы через onScroll - data.scrollTop)
          * @private
          */
         _updateVirtualWindow: function(data) {
            var newPage = this._getPage(data.scrollTop);
            //TODO Возможно, тут стоит еще какую-то проверку добавить, чтобы не проверять страницу слишком часто. Например, что было смещение на больше чем 100px
            if (this._currentPage !== newPage) {
               this._currentPage = newPage;
               console.log('Новая страница: ' + newPage);
               this._onPageChange(newPage);
            }
         },


         //--------------методы, специфичные только для работы через onScroll

         _onScroll: function(e) {
            clearTimeout(this._scrollTimeout);
            this._scrollTimeout = setTimeout(function () {
               var
                  scrollTop = e.target.scrollTop,
                  eventName = this._oldHandledScrollTop > scrollTop ? 'onScrollTop' : 'onScrollButtom';

               this._oldHandledScrollTop = scrollTop;
               this._notify(eventName, scrollTop);

               this._updateVirtualWindow({scrollTop: scrollTop});

            }.bind(this), 25);
         },

         /**
          * Получить номер страницы, которую нужно отобразить, исходя из текущего смещения
          * @param scrollTop
          * @private
          */
         _getPage: function(scrollTop) {
            //Индекс первой видимой записи
            var topIndex = scrollTop / this._heightRow;

            //номер видимой страницы
            return Math.ceil(topIndex / this._pageSize);
         },

         /**
          * рассчитать начало/конец видимой области и высоты распорок
          * @param page - новая отображаемая страница
          * @private
          */
         _onPageChange: function(page) {
            var
               newWindow = this._getRangeToShow(page, this._visiblePages),
               change = {
                  topChange: this._virtualWindow.start - newWindow.start,
                  bottomChange: newWindow.end - this._virtualWindow.end
               },
               wrapperHeight = this._calcWrapperHeight(newWindow, change),
               changeWrapperHeight = this._calcWrapperChange(newWindow, change);

            this._virtualWindow = newWindow;

            this._notify('onUpdateVisibleIndices',{
               topChange: change.topChange,
               bottomChange: change.bottomChange,

               startIndex: newWindow.start,
               stopIndex: newWindow.end,

               placeholderTop: wrapperHeight.top,
               placeholderBottom: wrapperHeight.bottom,

               placeholderTopChange: changeWrapperHeight.top,
               placeholderBottomChange: changeWrapperHeight.bottom
            });
         },

         /**
          * Индексы отображаемых записей
          * @param page
          * @param pagesCount
          * @returns {{start: number, end: number}}
          * @private
          */
         _getRangeToShow: function(page, pagesCount) {
            var
               //половина страниц
               halfPage = Math.ceil(pagesCount / 2),
               // Нижняя страница - текущая + половина страниц, но не меньше чем количество отображаемых страниц
               bottomPage = page + halfPage < pagesCount ? pagesCount : page + halfPage,
               // Верхняя страница - теущая - половина страниц, но не меньше -1
               topPage = page - halfPage < 0 ? 0 : page - halfPage + 1;

            topPage *= this._pageSize;
            bottomPage *= this._pageSize;
            bottomPage = Math.min(bottomPage, this._itemsLength);

            return {start: topPage, end: bottomPage};
         },

         /**
          * рассчитать высоты распорок
          * @param virtualWindow
          * @param change
          * @returns {{top: number, bottom: number}}
          * @private
          */
         _calcWrapperHeight: function(virtualWindow, change) {
            //Пока считаем просто. Умножить количество на высоту
            return {
               top: virtualWindow.start * this._heightRow,
               bottom: (this._itemsLength - virtualWindow.end - 1) * this._heightRow
            };
         },

         _calcWrapperChange: function(virtualWindow, change) {
            return {
               top: -change.topChange * this._heightRow,
               bottom: -change.bottomChange * this._heightRow
            };
         }
      });

      return VirtualScroll;
   });
