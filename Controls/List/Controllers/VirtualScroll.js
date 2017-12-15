define('js!Controls/List/Controllers/VirtualScroll', [
   'Core/core-simpleExtend'
], function(simpleExtend
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
      calculateVirtualWindow: function(topIndex, rowHeight, maxVisibleRows, itemsCount) {
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
       * @param rowHeight средняя высота строки
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
    * @public контроллер для работы виртуального скролла. Вычисляет по scrollTop диапазон отображаемых записей и высоты распорок
    */
   var VirtualScroll = simpleExtend.extend({
      _rowCount: null,           // Число записей в проекции
      _maxVisibleRows: 75,       // максимальное число одновременно отображаемых записей
      _averageRowHeight: null,   // Средняя высота строки

      _currentPage: null,
      _currentTopIndex: null,
      _virtualWindow: null,

      /**
       *
       * @param cfg
       * @param cfg.maxVisibleRows {Number} - максимальное число отображаемых записей
       * @param cfg.itemsCount {Number} - общее число записей в проекции
       * @param cfg.rowHeight {Number} - высота (средняя) однй строки
       */
      constructor: function(cfg) {
         VirtualScroll.superclass.constructor.apply(this, arguments);

         this._maxVisibleRows = cfg.maxVisibleRows || this._maxVisibleRows;
         this._rowCount = cfg.itemsCount;
         this._averageRowHeight = cfg.rowHeight;
      },

      getVirtualWindow: function() {
         return this._virtualWindow;
      },

      setRowCount: function(rowCount) {
         this._rowCount = rowCount;
      },

      /**
       * Обновление виртуального окна после того, как в проекции добавились элементы
       * @param index позиция, с которой появились новые элементы
       * @param countAddedItems количество добавленных элементов
       */
      updateOnAddingItems: function(index, countAddedItems) {
         if (index < this._virtualWindow.indexStart) {
            //Если добавили ДО видимого диапазона, сдвинем видимый диапазон и увеличим верхнюю распорку
            this._virtualWindow.indexStart += countAddedItems;
            this._virtualWindow.indexStop += countAddedItems;
            this._virtualWindow.topPlaceholderHeight += (this._averageRowHeight * countAddedItems);
         } else {
            //В остальных случаях - просто увеличим нижнюю границу (затем скорректируем)
            this._virtualWindow.indexStop += countAddedItems;
         }
         this._rowCount += countAddedItems;

         //Рассчитать новый максимальный индекс с учетом того, тчо записей стало больше
         var range = _private.getRangeToShowByIndex(this._currentTopIndex, this._maxVisibleRows, this._rowCount);

         //корректируем конец видимого диапазона (часть добавленных записей может уйти в распорку, часть в видимую область)
         if (this._virtualWindow.indexStop > range.stop) {
            this._virtualWindow.bottomPlaceholderHeight += (this._virtualWindow.indexStop - range.stop) * this._averageRowHeight;
            this._virtualWindow.indexStop = range.stop;
         }
      },

      /**
       * рассчиать индексы и распорки, исходя из позиции скролла.
       * @param scrollTop
       * @returns {*}
       */
      calcVirtualWindow: function(scrollTop) {
         var newPage = _private.getPage(scrollTop, this._averageRowHeight);

         if (this._currentPage === newPage.page) {
            return {
               changed: false,
               virtualWindow: this._virtualWindow
            };
         }

         this._currentPage = newPage.page;
         this._currentTopIndex = newPage.topIndex;
         this._virtualWindow = _private.calculateVirtualWindow(newPage.topIndex, this._averageRowHeight, this._maxVisibleRows, this._rowCount);

         return {
            changed: true,
            virtualWindow: this._virtualWindow
         };
      }
   });

   VirtualScroll._private = _private;

   return VirtualScroll;
});
