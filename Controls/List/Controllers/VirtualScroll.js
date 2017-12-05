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
       * Получить индексы текущей видимой страницы и первой видимой записи
       * @param scrollTop
       * @returns {number}
       * @private
       */
      getPage: function(scrollTop) {
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
       * @param firstIndex номер первой видимой записи
       * @param maxVisibleRows максимальное число отображаемых записей
       * @param displayCount общее число записей
       * @returns {{start: number, stop: number}}
       * @private
       */
      getRangeToShowByIndex: function(firstIndex, maxVisibleRows, displayCount) {
         var
            thridRows = Math.ceil(maxVisibleRows / 3),   //Треть от максимального числа записей
            topIndex = Math.max(firstIndex - thridRows, 0),                    //показываем от (текущая - треть)
            bottomIndex = Math.min(firstIndex + thridRows * 2, displayCount);  //до (текущая + две трети)

         return {start: topIndex, stop: bottomIndex};
      }
   };

   //TODO высота строки
   var rowHeight = 25;


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

         if (this._currentPage === newPage.page) {
            return false;
         }

         this._currentPage = newPage.page;
         return this._onPageChange(newPage.page, newPage.topIndex);
      },


      /**
       * рассчитать начало/конец видимой области и высоты распорок
       * @param page - новая отображаемая страница
       * @param page - первый отображаемый индекс
       * @private
       */
      _onPageChange: function(page, topIndex) {
         var
            newWindow = _private.getRangeToShowByIndex(topIndex, this._maxVisibleRows, this._displayCount),
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
