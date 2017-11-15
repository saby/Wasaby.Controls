define('js!Controls/List/Controllers/VirtualScroll',
   ['Core/Abstract'],
   function(Abstract) {
      /**
       *
       * @author Девятов Илья
       * @public
       */
      var VirtualScroll = Abstract.extend([], {
         _heightRow: 25,   //высота строки
         _visiblePages: 5,   //сколько страниц рисуем, остальные вытесняем

         _startIndex: 0,
         _stopIndex: 0,

         _currentPage: 0,  //Текущая отображаемая страница

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
            this._heightRow = cfg.fixedHeightRow;

            this._oldHandledScrollTop = 0;   //Последнее обработанное смещение
            this._virtualWindow = {
               start: 0,   //Индекс первого отображаемого элемента
               end: Math.min((this._visiblePages - 1) * cfg.pageSize, cfg.itemsLength) //Индекс последнего отображаемого элемента
            };

            console.log('virtual window:' + this._virtualWindow.start + '  ' + this._virtualWindow.end );

            //this._publish('onScrollTop', 'onScrollButtom');
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
          * Проверка, нужно ли обновлять индексы отображаемых элементов
          * @param data (для работы через onScroll - data.scrollTop)
          * @private
          */
         _updateVirtualWindow: function(data) {
            var newPage = this._getPage(data.scrollTop);
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

         _onPageChange: function(page) {
            var
               newWindow = this._getRangeToShow(page, this._visiblePages),
               change = {
                  topChange: this._virtualWindow.start - newWindow.start,
                  bottomChange: newWindow.end - this._virtualWindow.end
               },
               wrapperHeight = this._calcWrapperHeight(newWindow, change);
            this._virtualWindow = newWindow;

            this._notify('onUpdateVisibleIndices',{
               topChange: change.topChange,
               bottomChange: change.bottomChange,

               startIndex: newWindow.start,
               stopIndex: newWindow.end,

               placeholderTop: wrapperHeight.top,
               placeholderBottom: wrapperHeight.bottom
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

            if (bottomPage >= this._itemsLength) {
               bottomPage = this._itemsLength - 1;
            }

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
               bottom: (this._itemsLength - virtualWindow.end) * this._heightRow
            };
         }
      });

      return VirtualScroll;
   });
