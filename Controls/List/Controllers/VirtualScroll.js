define('js!Controls/List/Controllers/VirtualScroll', [
   'Core/core-simpleExtend'
], function(simpleExtend,
            throttle
   ) {
   'use strict';

   //TODO количество записей на 1 видимой странице (для изменения индексов нужно проскроллить на это число)
   var virtualPageSize = 15;

   var _private = {
      /**
       * рассчитать начало/конец видимой области и высоты распорок
       * @param topIndex - первый отображаемый индекс
       * @param rowHeight - средняя высота записи
       * @param maxVisibleRows - максимальное число видимых записей
       * @param itemsCount - общее число записей в проекции
       * @private
       */
      onPageChange: function(topIndex, rowHeight, maxVisibleRows, itemsCount) {
         var
            newWindow = _private.getRangeToShowByIndex(topIndex, maxVisibleRows, itemsCount),
            wrapperHeight = _private.calcPlaceholderHeight(newWindow, itemsCount, rowHeight);

         return {
            indexStart: newWindow.start,
            indexStop: newWindow.stop,

            topPlaceholderHeight: wrapperHeight.top,
            bottomPlaceholderHeight: wrapperHeight.bottom
         };
      },
      /**
       * Получить индексы текущей видимой страницы и первой видимой записи
       * @param scrollTop
       * @param rowHeight средняя высота записей
       * @returns {number}
       * @private
       */
      getPage: function(scrollTop, rowHeight) {
         //Индекс первой видимой записи
         var topIndex = Math.floor(scrollTop / rowHeight);

         return {
            topIndex: topIndex,
            page: Math.ceil(topIndex / virtualPageSize)
         };
      },

      /**
       * рассчитать высоты распорок
       * @param virtualWindow индексы начала/конца видимого промежутка записей
       * @param displayCount общее число записей
       * @param rowHeight средняя высота записей
       * @returns {{top: number, bottom: number}}
       * @private
       */
      calcPlaceholderHeight: function(virtualWindow, displayCount, rowHeight) {
         //Пока считаем просто. Умножить количество на высоту
         return {
            top: virtualWindow.start * rowHeight,
            bottom: (displayCount - virtualWindow.stop) * rowHeight
         };
      },

      /**
       * Индексы отображаемых записей
       * @param firstIndex номер первой видимой записи
       * @param maxVisibleRows максимальное число отображаемых записей
       * @param displayCount общее число записей
       * @returns {{start: number, stop: number}}
       * @private
       */
      getRangeToShowByIndex: function(firstIndex, maxVisibleRows, displayCount) {
         var
            thirdOfRows = Math.ceil(maxVisibleRows / 3),   //Треть от максимального числа записей
            topIndex = Math.max(firstIndex - thirdOfRows, 0),                    //показываем от (текущая - треть)
            bottomIndex = Math.min(firstIndex + thirdOfRows * 2, displayCount);  //до (текущая + две трети)

         return {start: topIndex, stop: bottomIndex};
      }
   };


   /**
    *
    * @author Девятов Илья
    * @public контроллер для работы виртуального скролла. Вычисляет по scrollTop диапазон отображаемых записей
    */
   var VirtualScroll = simpleExtend.extend({
      _itemsCount: null,      //Число записей в проекции
      _maxVisibleRows: 75,    //максимальное число одновременно отображаемых записей
      _rowHeight: 25,         //Средняя высота строки

      _currentPage: null,

      /**
       *
       * @param cfg
       * @param cfg.maxRows {Number} - максимальное число отображаемых записей
       * @param cfg.itemsCount {Number} - общее число записей в проекции
       * @param cfg.rowHeight {Number} - высота (средняя) однй строки
       */
      constructor: function(cfg) {
         VirtualScroll.superclass.constructor.apply(this, arguments);

         this._maxVisibleRows = cfg.maxRows || this._maxVisibleRows;
         this._itemsCount = cfg.itemsCount;
         this._rowHeight = cfg.rowHeight;
      },

      setItemsCount: function(itemsCount) {
         this._itemsCount = itemsCount;
      },

      calcVirtualWindow: function(scrollTop) {
         var newPage = _private.getPage(scrollTop, this._rowHeight);

         if (this._currentPage === newPage.page) {
            return false;
         }

         this._currentPage = newPage.page;
         return _private.onPageChange(newPage.topIndex, this._rowHeight, this._maxVisibleRows, this._itemsCount);
      }
   });

   VirtualScroll._private = _private;

   return VirtualScroll;
});
