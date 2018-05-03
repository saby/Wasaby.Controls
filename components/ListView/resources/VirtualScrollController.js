define('SBIS3.CONTROLS/ListView/resources/VirtualScrollController', ['Core/Abstract'],
   function (cAbstract) {

      var BATCH_SIZE = 20;
      var PAGES_COUNT = 5;

      var VirtualScrollController = cAbstract.extend({
         $protected: {
            _options: {
               mode: 'down',
               projection: null,
               viewport: null,
               itemsContainer: null
            },
            _projection: null,
            _currentVirtualPage: 0,
            _heights: [],
            _notAddedAmount: 0,
            // количество не отображаемых страниц сверху списка
            _viewportHeight: 0,
            _DEBUG: false,
            _con: null
         },

         init: function () {
            VirtualScrollController.superclass.init.call(this);
            this._projection = this._options.projection;

            if (this._options.viewport) {
               this.initHeights();
            }

            if (this._projection) {
               this._currentWindow = this._getRangeToShow(0, PAGES_COUNT);
            }
            if (this._options.viewport) {
               //this._options.viewport[0].addEventListener('scroll', this._scrollHandler.bind(this), { passive: true });
            }
            //FIXME заглушка
            this._con = window && window.console;
            if (!this._con) {
               this._con = { log: function () {} };
            }
         },

         /**
          * Disables scroll handlers, so it doesn't update
          * virtual pages on scroll
          *
          * @param toggle
          */
         disableScrollHandler: function (toggle) {
            this._scrollHandlerDisabled = !!toggle;
         },

         /**
          * Check if item is currently shown
          */
         isItemVisible: function (itemIndex) {
            return itemIndex >= this._currentWindow[0] && itemIndex < this._currentWindow[1];
         },

         reset: function(){
            this._currentVirtualPage = 0;
            this._heights = [];
            this.initHeights();
            this._currentWindow = [0, this._projection.getCount()];
            clearTimeout(this._scrollTimeout);

            // Enable scroll handler after reset
            this.disableScrollHandler(false);

            // Set to first page -> remove extra items
            this._onVirtualPageChange(0);
         },

         /**
          * Updates virtual page (adds and removes list items)
          * based on the current scroll position.
          *
          * @private
          */
         _processScroll: function() {
            var scrollTop = this._options.viewport.scrollTop(),
               page = this._getPage(scrollTop);
            if (this._currentVirtualPage != page) {
               this._currentVirtualPage = page;
               this._onVirtualPageChange(page);
            }
         },

         _scrollHandler: function (e, scrollTop, scrollbarDragging) {
            if (!this._scrollHandlerDisabled) {
               clearTimeout(this._scrollTimeout);
               // Update virtual page with timeout when using scrollbar. This way, it
               // doesn't lag and scrolls smoothly, but content updates with a small delay.
               if (scrollbarDragging) {
                  this._scrollTimeout = setTimeout(this._processScroll.bind(this), 25);
               } else {
                  // When scrolling with mouse wheel, update pages immediately, so user
                  // doesn't see white pages.
                  this._processScroll();
               }

            }
         },

         _getPage: function (scrollTop) {
            var height = 0;
            for (var i = 0; i < this._heights.length; i++) {
               height += this._heights[i];
               if (height >= scrollTop) {
                  return Math.ceil(i / BATCH_SIZE);
               }
            }
            return Math.ceil((this._heights.length - 1) / BATCH_SIZE);
         },

         _onVirtualPageChange: function (pageNumber) {
            var projCount = this._projection.getCount(),
               newWindow = this._getRangeToShow(pageNumber, PAGES_COUNT),
               diff = this._getDiff(this._currentWindow, newWindow, projCount);

            if (diff) {   
                  
               if (this._DEBUG) {
                  this._con.log('page', pageNumber);
                  this._con.log('Current widnow:', this._currentWindow[0], this._currentWindow[1], 'New widnow:', newWindow[0], newWindow[1]);
                  this._con.log('add from', diff.add[0], 'to', diff.add[1], 'at', diff.addPosition);
                  this._con.log('remove from', diff.remove[0], 'to', diff.remove[1]);
                  this._con.log('displayed from ', newWindow[0], 'to', newWindow[1]);
               }

               var wrappersHeights = this._getWrappersHeight(newWindow);

               this._notify('onWindowChange', {
                  remove: diff.remove,
                  add: diff.add,
                  addPosition: diff.addPosition,
                  topWrapperHeight: wrappersHeights.begin,
                  bottomWrapperHeight: wrappersHeights.end
               });
            }

            this._currentWindow = newWindow;
         },

         /**
          * Получить высоту распорок
          * @return {Array} Высота верхней и нижней распорок
          */
         _getWrappersHeight: function (shownRange) {
            var beginHeight = 0,
               endHeight = 0;

            for (var i = 0; i < shownRange[0]; i++) {
               beginHeight += this._getHeightByIndex(i);
            }

            for (i = shownRange[1]; i < this._heights.length - 1; i++) {
               endHeight += this._getHeightByIndex(i);
            }

            if (this._DEBUG) {
               this._con.log('top height', beginHeight);
               this._con.log('bottom height', endHeight);
            }

            return {
               begin: beginHeight, 
               end: endHeight
            };
         },

         _getHeightByIndex: function(index){
            if (!this._heights[index]) {
               var item = this._projection.at(index);
               this._heights[index] = this._getItemHeight(item);
            }
            return this._heights[index];
         },

         /**
          * Получить верхнюю и нижниюю отображаемые страницы
          * @param {Number} page номер страницы
          * @param {Number} pagesCount количество отображаемых страниц
          */
         _getRangeToShow: function(page, pagesCount){
            var 
               //половина страниц
               halfPage = Math.ceil(pagesCount / 2),
               // Нижняя страница - текущая + половина страниц, но не меньше чем количество отображаемых страниц
               bottomPage = page + halfPage < pagesCount ? pagesCount : page + halfPage,
               // Верхняя страница - теущая - половина страниц, но не меньше -1
               topPage = page - halfPage < 0 ? 0 : page - halfPage + 1;
            
            topPage *= BATCH_SIZE;
            bottomPage *= BATCH_SIZE;

            if (bottomPage >= this._heights.length) {
               bottomPage = this._heights.length - 1;
            }

            return [topPage, bottomPage];
         },

         /**
          *                                                                             a      b            c      d
          * @param  {Array} Текущий отображаемый промежуток элементов    [a,c]          |-------------------|       
          * @param  {Array} Новый промежуток элементов                   [b,d]                 |-------------------|
          * @return {Array} Разница между промежутками - два промежутка  [[a,b],[c,d]]  |------|            |------|
          */
         _getDiff: function (currentRange, newRange, count) {
            var top, bottom, diff = {}, addPosition = 0;
            //Если промежутки равны
            if (currentRange[0] == newRange[0] && currentRange[1] == newRange[1]) {
               return false;
            }

            //Если промежутки пересекаются
            if (currentRange[0] < newRange[0] || currentRange[1] < newRange[1]) {
               diff.add = [currentRange[1] + 1, newRange[1]];
               diff.remove = [currentRange[0], newRange[0] - 1];
               addPosition = diff.add[0];
            } else {
               diff.add = [newRange[0], currentRange[0] - 1];
               diff.remove = [newRange[1] + 1, currentRange[1]];
            }

            // Если промежутки не пересекаются
            if (currentRange[1] < newRange[0]) {
               diff.remove = currentRange;
               diff.add = newRange;
               addPosition = diff.add[0];
            }

            // Если промежутки не пересекаются
            if (currentRange[0] > newRange[1]) {
               diff.add = newRange;
               diff.remove = currentRange;
            }

            if (diff.add[0] > count){
               diff.add[0] = count;
            }

            return {
               remove: diff.remove,
               add: diff.add,
               addPosition: addPosition
            };
         },

         /**
          * Return distance from the top of the list for the given item.
          *
          * @param index
          * @returns {number|*}
          */
         getScrollTopForItem: function(index) {
            return this._heights.slice(0, index).reduce(function(a, b) { return a + b }, 0);
         },

         /*
          * Первичная инициализация высот элементов 
          */
         initHeights: function () {
            var self = this,
               //Учитываем все что есть в itemsContainer (группировка и тд)
               /* Отфильтровывем скрытые строки,
                и строки которые будут вырезаться и перемещаться в прилипающую шапку,
                т.к. по ним нельзя корректно посчитать положение. */
               listItems = this._options.itemsContainer.find('> *').not('.ws-hidden, .ws-sticky-header__table-sticky-row');

            // пересчет только при инициализации
            // проверка нужна, так как нет нет точки входа после первой отрисовки, и метод зовется из _drawItemsCallback списка
            if (this._heights.length === 0) {
               this._viewportHeight = this._options.viewport[0].offsetHeight;
               //Считаем оффсеты страниц начиная с последней (если ее нет - сначала)
               listItems.each(function () {
                  self._heights.push(this.offsetHeight);
               });
            }
         },

         _getAverageItemHeight: function() {
            if (!this._heights.length) {
               return 0;
            }
            var sum = this._heights.reduce(function(a, b) { return a + b; }, 0);
            return Math.ceil(sum / this._heights.length);
         },

         _getItemHeight: function(item){
            var itemHeight = $('[data-hash="' + item.getHash() + '"]', this._options.viewContainer).height();
            // Если записи нет в видимой области, не получится посчитать ее высоту.
            if (!itemHeight) {
               return this._getAverageItemHeight();
            }
            return itemHeight;
         },

         addItems: function (items, at) {
            // Игнорируем если виртуальный скрол отключен (к примеру, после поиска в реестре)
            if (!this._scrollHandlerDisabled) {
               for (var i = 0; i < items.length; i++) {
                  this._heights.splice(at + i, 0, this._getItemHeight(items[i]));
                  if (i + at < this._currentWindow[0]) { // Добавили до видимого окна - надо сдвинуть индексы
                     this._currentWindow[0] += 1;
                     this._currentWindow[1] += 1;
                  } else if (i + at - 1 <= this._currentWindow[1] + 1) { // Добавили в видимом окне
                     this._currentWindow[1] += 1;
                  }
               }

               // текущее окно поменялось - пересчитаем отображаемые записи
               this._onVirtualPageChange(this._currentVirtualPage);
            }
         },

         removeItems: function(items, at) {
            // Игнорируем если виртуальный скрол отключен (к примеру, после поиска в реестре)
            if (!this._scrollHandlerDisabled) {
               this._heights.splice(at, items.length);

               for (i = 0; i < items.length; i++) {
                  if (i + at < this._currentWindow[0]) { // Удалили до видимого окна - надо сдвинуть индексы
                     this._currentWindow[0] -= 1;
                     this._currentWindow[1] -= 1;
                  } else if (i + at <= this._currentWindow[1]) { // Удалили в видимом окне
                     this._currentWindow[1] -= 1;
                  }
               }

               // текущее окно поменялось - пересчитаем отображаемые записи
               this._onVirtualPageChange(this._currentVirtualPage);
            }
         },

         /**
          * Save reference to new projection after list reload.
          *
          * @param newProjection
          */
         updateProjection: function (newProjection) {
            this._projection = newProjection;
         }

      });

      return VirtualScrollController;

   });