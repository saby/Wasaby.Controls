define('js!Controls/List/Controllers/VirtualScroll', [
   'Core/core-simpleExtend'
], function(simpleExtend,
            throttle
   ) {
   'use strict';

   var _private = {
      /**
       * Получить индекс текущей видимой страницы
       * @param scrollTop
       * @returns {number}
       * @private
       */
      getPage: function(scrollTop) {
         //Индекс первой видимой записи
         var topIndex = scrollTop / rowHeight;

         //номер видимой страницы
         return Math.ceil(topIndex / virtualPageSize);
      },

      /**
       * рассчитать высоты распорок
       * @param virtualWindow
       * @param displayCount
       * @returns {{top: number, bottom: number}}
       * @private
       */
      calcPlaceholderHeight: function(virtualWindow, displayCount) {
         //Пока считаем просто. Умножить количество на высоту
         return {
            top: virtualWindow.start * rowHeight,
            bottom: (displayCount - virtualWindow.stop) * rowHeight
         };
      },

      /**
       * Индексы отображаемых записей
       * @param page номер видимой страницы
       * @param maxVisibleRows максимальное число отображаемых записей
       * @param displayCount общее число записей
       * @returns {{start: number, stop: number}}
       * @private
       */
      getRangeToShow: function(page, maxVisibleRows, displayCount) {
         var
            pagesCount = maxVisibleRows / virtualPageSize,
            //половина страниц
            halfPage = Math.ceil(pagesCount / 2),
            // Нижняя страница = (текущая + половина страниц), но не меньше чем количество отображаемых страниц
            bottomPage = page + halfPage < pagesCount ? pagesCount : page + halfPage,
            // Верхняя страница = (теущая - половина страниц), но не меньше -1
            topPage = page - halfPage < 0 ? 0 : page - halfPage + 1;

         topPage *= virtualPageSize;
         bottomPage *= virtualPageSize;
         bottomPage = Math.min(bottomPage, displayCount);

         return {start: topPage, stop: bottomPage};
      }
   };

   //TODO высота строки
   var rowHeight = 25;

   //TODO количество записей на 1 видимой странице
   var virtualPageSize = 15;


   /**
    *
    * @author Девятов Илья
    * @public
    */
   var VirtualScroll = simpleExtend.extend({
      _displayCount: null,
      _maxVisibleRows: 75,

      _currentPage: null,

      /**
       *
       * @param cfg
       * @param cfg.maxRows {Number} - максимальное число отображаемых записей
       * @param cfg.displayCount {Number} - общее число записей в проекции
       */
      constructor: function(cfg) {
         VirtualScroll.superclass.constructor.apply(this, arguments);

         this._maxVisibleRows = cfg.maxRows || this._maxVisibleRows;
         this._displayCount = cfg.displayCount;
      },

      setDisplayCount: function(displayCount) {
         this._displayCount = displayCount;
      },

      updateListModel: function(direction) {
         //console.log('VirtualScroll::updateListModel ' + direction);
      },

      calcVirtualWindow: function(scrollTop) {
         var newPage = _private.getPage(scrollTop);

         if (this._currentPage === newPage) {
            return false;
         }

         this._currentPage = newPage;
         return this._onPageChange(newPage);
      },


      /**
       * рассчитать начало/конец видимой области и высоты распорок
       * @param page - новая отображаемая страница
       * @private
       */
      _onPageChange: function(page) {
         var
            newWindow = _private.getRangeToShow(page, this._maxVisibleRows, this._displayCount),
            wrapperHeight = _private.calcPlaceholderHeight(newWindow, this._displayCount);

         var res = {
            indexStart: newWindow.start,
            indexStop: newWindow.stop,

            topPlaceholderHeight: wrapperHeight.top,
            bottomPlaceholderHeight: wrapperHeight.bottom
         };

         return res;
      }
   });

   return VirtualScroll;
});
