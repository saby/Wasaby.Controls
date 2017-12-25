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
       * @param averageItemHeight - средняя высота записи
       * @param maxVisibleItems - максимальное число видимых записей
       * @param itemsCount - общее число записей в проекции
       * @private
       */
      calculateVirtualWindow: function(topIndex, averageItemHeight, maxVisibleItems, itemsCount) {
         var
            newWindow = _private.calcVirtualWindowIndexes(topIndex, maxVisibleItems, itemsCount),
            wrapperHeight = _private.calcPlaceholderHeight(newWindow, itemsCount, averageItemHeight);

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
       * @param averageItemHeight средняя высота записей
       * @returns {number}
       * @private
       */
      getPage: function(scrollTop, averageItemHeight) {
         //Индекс первой видимой записи
         var topIndex = Math.floor(scrollTop / averageItemHeight);

         return {
            topIndex: topIndex,
            page: Math.ceil(topIndex / virtualPageSize)
         };
      },

      /**
       * рассчитать высоты распорок
       * @param virtualWindow индексы начала/конца видимого промежутка записей
       * @param displayCount общее число записей
       * @param averageItemHeight средняя высота строки
       * @returns {{top: number, bottom: number}}
       * @private
       */
      calcPlaceholderHeight: function(virtualWindow, displayCount, averageItemHeight) {
         //Пока считаем просто. Умножить количество на высоту
         return {
            top: virtualWindow.start * averageItemHeight,
            bottom: (displayCount - virtualWindow.stop) * averageItemHeight
         };
      },

      /**
       * Индексы отображаемых записей
       * @param firstIndex номер первой видимой записи
       * @param maxVisibleItems максимальное число отображаемых записей
       * @param displayCount общее число записей
       * @returns {{start: number, stop: number}}
       * @private
       */
      calcVirtualWindowIndexes: function(firstIndex, maxVisibleItems, displayCount) {
         var
            thirdOfItems = Math.ceil(maxVisibleItems / 3),   //Треть от максимального числа записей
            topIndex = Math.max(firstIndex - thirdOfItems, 0),                    //показываем от (текущая - треть)
            bottomIndex = Math.min(firstIndex + thirdOfItems * 2, displayCount);  //до (текущая + две трети)

         return {start: topIndex, stop: bottomIndex};
      }
   };


   /**
    *
    * @author Девятов Илья
    * @public контроллер для работы виртуального скролла. Вычисляет по scrollTop диапазон отображаемых записей и высоты распорок
    */
   var VirtualScroll = simpleExtend.extend({
      _itemsCount: null,          // Число записей в проекции
      _maxVisibleItems: 75,       // максимальное число одновременно отображаемых записей
      _averageItemHeight: null,   // Средняя высота строки

      _currentPage: null,
      _currentTopIndex: null,
      _virtualWindow: null,

      /**
       *
       * @param cfg
       * @param cfg.maxVisibleItems {Number} - максимальное число отображаемых записей
       * @param cfg.itemsCount {Number} - общее число записей в проекции
       * @param cfg.itemHeight {Number} - высота (средняя) однй строки
       */
      constructor: function(cfg) {
         VirtualScroll.superclass.constructor.apply(this, arguments);

         this._maxVisibleItems = cfg.maxVisibleItems || this._maxVisibleItems;
         this._itemsCount = cfg.itemsCount;
         this._averageItemHeight = cfg.itemHeight;
      },

      getVirtualWindow: function() {
         return this._virtualWindow;
      },

      setItemsCount: function(itemsCount) {
         this._itemsCount = itemsCount;
      },

      /**
       * Обновление виртуального окна после того, как в проекции добавились элементы
       * @param index позиция, с которой появились новые элементы
       * @param countAddedItems количество добавленных элементов
       */
      insertItems: function(index, countAddedItems) {
         if (index < this._virtualWindow.indexStart) {
            //Если добавили ДО видимого диапазона, сдвинем видимый диапазон и увеличим верхнюю распорку
            this._virtualWindow.indexStart += countAddedItems;
            this._virtualWindow.indexStop += countAddedItems;
            this._virtualWindow.topPlaceholderHeight += (this._averageItemHeight * countAddedItems);
         } else {
            //В остальных случаях - просто увеличим нижнюю границу
            this._virtualWindow.indexStop += countAddedItems;
         }
         this._itemsCount += countAddedItems;

         //часть добавленных записей может уйти в нижнюю распорку
         var range = _private.calcVirtualWindowIndexes(this._currentTopIndex, this._maxVisibleItems, this._itemsCount);
         if (this._virtualWindow.indexStop > range.stop) {
            this._virtualWindow.bottomPlaceholderHeight += (this._virtualWindow.indexStop - range.stop) * this._averageItemHeight;
            this._virtualWindow.indexStop = range.stop;
         }
      },

      /**
       * Добавить новые элементы в конец списка
       * @param countAddedItems количество добавленных элементов
       */
      appendItems: function(countAddedItems) {
         this.insertItems(this._itemsCount, countAddedItems);
      },

      /**
       * Добавить новые элементы в начало списка
       * @param countAddedItems количество добавленных элементов
       */
      prependItems: function(countAddedItems) {
         this.insertItems(0, countAddedItems);
      },

      /**
       * Установить новый scrollTop, на его основе рассчитать индексы отображаемых записей и распорки
       * @param scrollTop
       * @returns {boolean} изменились ли индексы/распорки
       */
      setScrollTop: function(scrollTop) {
         var newPage = _private.getPage(scrollTop, this._averageItemHeight);

         if (this._currentPage === newPage.page) {
            return false;
         }

         this._currentPage = newPage.page;
         this._currentTopIndex = newPage.topIndex;
         this._virtualWindow = _private.calculateVirtualWindow(newPage.topIndex, this._averageItemHeight, this._maxVisibleItems, this._itemsCount);

         return true;
      }
   });

   VirtualScroll._private = _private;

   return VirtualScroll;
});
