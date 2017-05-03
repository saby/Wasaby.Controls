define('js!SBIS3.CONTROLS.VirtualScrollController', ['Core/Abstract'],
   function (cAbstract) {

      var BATCH_SIZE = 20;
      var PAGES_COUNT = 5;

      var VirtualScrollController = cAbstract.extend({
         $protected: {
            _options: {
               view: null,
               mode: 'down',
               projection: null,
               beginWrapper: null,
               endWrapper: null,
               viewport: null,
               itemsContainer: null
            },
            _currentVirtualPage: 0,
            _virtualPages: [{
               offset: 0
            }],
            _bottomIndex: null,
            _beginWrapperHeight: 0,
            _endWrapperHeight: 0,
            _newItemsCount: 0,
            _additionalHeight: 0,
            _lastPageHeight: 0,
            _notAddedAmount: 0,
            _DEBUG: false,
         },

         init: function () {
            var view = this._options.view;
            VirtualScrollController.superclass.init.call(this);
            // В начале только одна страница
            this._currentWindow = this._getRangeToShow(0, BATCH_SIZE, 1);
            if (this._options.viewport) {
               this._options.viewport[0].addEventListener('scroll', this._scrollHandler.bind(this), { passive: true });
            }
         },

         _scrollHandler: function (e, scrollTop) {
            clearTimeout(this._scrollTimeout);
            this._scrollTimeout = setTimeout(function () {
               var viewportHeight = this._options.viewport.height(), 
                  scrollTop;
               if (this._options.mode == 'down') {
                  scrollTop = this._options.viewport.scrollTop();
               } else {
                  scrollTop = this._options.viewContainer.height() - scrollTop - this._scrollableHeight;
               }
               var page = this._getPage(scrollTop, viewportHeight, this._additionalHeight, this._virtualPages);
               if (page >= 0 && this._currentVirtualPage != page) {
                  this._onVirtualPageChange(page);
                  this._currentVirtualPage = page;
               }
            }.bind(this), 0);
         },

         _getPage: function (scrollTop, viewportHeight, additionalHeight, pages) {
            for (var i = 0; i < pages.length; i++) {
               if (pages[i].offset + additionalHeight >= scrollTop) {
                  return i;
               }
            }
            return pages.length - 1;
         },

         _onVirtualPageChange: function (pageNumber) {
            var pages = this._virtualPages,
               at = 0,
               removeOffset = 0,
               addOffset = 0,
               segments = [],
               pagesToRemove = [],
               pagesToAdd = [],
               haveToAdd = false,
               haveToRemove = false,
               newWindow = this._getRangeToShow(pageNumber, BATCH_SIZE, PAGES_COUNT),
               projCount = this._options.projection.getCount(),
               i, items;

            // Может добавиться меньше BATCH_SIZE новых элементов, учтем это
            if (newWindow[0] >= BATCH_SIZE && this._newItemsCount) {
               newWindow[0] -= (BATCH_SIZE - this._newItemsCount);
            }
            // Не можем отображать больше чем есть
            if (newWindow[1] > projCount) {
               newWindow[1] = projCount;
            }

            // разница между промежутками
            var diff = this._getDiff(this._currentWindow, newWindow);

            // нет разницы - нечего делать
            if (!diff) {
               this._currentWindow = newWindow;
               return;
            }

            if (this._DEBUG) {
               console.log('page', pageNumber);
               console.log('widnow', newWindow);
               console.log('diff.top', diff.top);
               console.log('diff.bottom', diff.bottom);
               console.log('WINDOWS. Current:', this._currentWindow[0], this._currentWindow[1], 'New:', newWindow[0], newWindow[1]);
            }


            // Прокрутка к концу списка
            if ((this._currentWindow[0] < newWindow[0] || this._currentWindow[0] > newWindow[1]) && this._currentWindow[1] > newWindow[0]) {
               segments[0] = diff.top;
               segments[1] = diff.bottom;
               pagesToRemove = this._getPagesByRange(segments[0], BATCH_SIZE);
               pagesToAdd = this._getPagesByRange(segments[1], BATCH_SIZE);
               if (this._options.mode == 'down') {
                  at = diff.bottom[0];
               }
               addOffset = this._newItemsCount ? BATCH_SIZE - this._newItemsCount : 0;
            } else {
               // Прокрутка к началу списка
               segments[0] = diff.bottom;
               segments[1] = diff.top;
               if (diff.bottom[1] - diff.bottom[0] >= BATCH_SIZE - 1) {
                  pagesToRemove = this._getPagesByRange(segments[0], BATCH_SIZE);
               }
               pagesToAdd = this._getPagesByRange(segments[1], BATCH_SIZE);
               if (this._options.mode == 'up') {
                  at = projCount - (diff.top[1] - diff.top[0] + 1);
               }
               removeOffset = this._newItemsCount ? BATCH_SIZE - this._newItemsCount : 0;
            }

            // Помечаем страницы как удаленные
            for (i = 0; i < pagesToRemove.length; i++) {
               if (pages[pagesToRemove[i]]) {
                  pages[pagesToRemove[i]].dettached = true;
                  haveToRemove = true;
               }
            }
            // Помечаем страницы как отображаемые
            for (i = 0; i < pagesToAdd.length; i++) {
               if (pages[pagesToAdd[i]] && pages[pagesToAdd[i]].dettached) {
                  pages[pagesToAdd[i]].dettached = false;
                  haveToAdd = true;
               }
            }
            // удаляем записи
            if (haveToRemove) {
               items = this._getItemsToRemove(segments[0], removeOffset, projCount);
               this._notify('onItemsRemove', items);
            }
            // добавляем записи
            if (haveToAdd) {
               items = this._getItemsToAdd(segments[1], addOffset, projCount);
               this._processingAdd = true;
               this._notify('onItemsAdd', items, at);
               this._processingAdd = false;
            }

            // Если что то менялось, то поменяем высоту распорок
            if (haveToRemove || haveToAdd) {
               var wrappersHeight = this._getWrappersHeight(
                     this._virtualPages,
                     this._getShownPages(pageNumber, PAGES_COUNT)
                  );
               this._options.beginWrapper.height(wrappersHeight[0]);
               this._options.endWrapper.height(wrappersHeight[1]);
            }

            if (this._currentVirtualPage !== pageNumber || this._currentWindow[1] > newWindow[1]) {
               this._currentWindow = newWindow;
               this._notify('onVirtualWinodowChange', newWindow[0], newWindow[1]);
               if (this._DEBUG) {
                  console.log('displayed from ', newWindow[0], 'to', newWindow[1]);
               }
            }
         },

         /**
          * Получить верхнюю и нижниюю отображаемые страницы
          * @param {Number} page номер страницы
          * @param {Number} pagesCount количество отображаемых страниц
          */
         _getShownPages: function(page, pagesCount){
            var 
               //половина страниц
               halfPage = Math.ceil(pagesCount / 2),
               // Нижняя страница - текущая + половина страниц, но не меньше чем количество отображаемых страниц
               bottomPage = page + halfPage < pagesCount ? pagesCount : page + halfPage,
               // Верхняя страница - теущая - половина страниц, но не меньше 0
               topPage = page - halfPage < 0 ? 0 : page - halfPage;
            return [topPage, bottomPage];
         },

         /**
          * Получить высоту распорок
          * @param  {Array} shownPages Массив из номером первой и последней отображаемых страниц
          * @return {Array} Высота верхней и нижней распорок
          */
         _getWrappersHeight: function (pages, shownPages) {
            var topPage = shownPages[0],
               bottomPage = shownPages[1];

            if (pages[bottomPage] && pages[bottomPage].dettached) {
               this._endWrapperHeight = pages[pages.length - 1].offset - pages[bottomPage].offset;
            } else {
               this._endWrapperHeight = 0;
            }
            if (pages[topPage] && pages[topPage].dettached) {
               this._beginWrapperHeight = pages[topPage + 1].offset + this._additionalHeight;
            } else {
               this._beginWrapperHeight = 0;
            }
            if (this._DEBUG) {
               console.log('top height', this._endWrapperHeight);
               console.log('bottom height', this._beginWrapperHeight);
            }
            return [this._beginWrapperHeight, this._endWrapperHeight];
         },

         /**
          * по двум индексам получить номера страниц входящих в этот промежуток
          * @param  {Array} range    индексы 
          * @param  {Number} pageSize размер страницы
          * @return {Array} номера станиц в промежутке
          * @private
          */
         _getPagesByRange: function (range, pageSize) {
            var pages = [], from, to;
            if (Math.abs(range[0] - range[1]) < pageSize - 1) {
               return [Math.floor(range[0] / pageSize)];
            }
            from = Math.ceil((range[0]) / pageSize);
            to = Math.ceil((range[1]) / pageSize);
            for (var i = from; i < to; i++) {
               pages.push(i);
            }
            return pages;
         },
         /**
          * Удаляет промежуток range записей из списка с отсупом в offset
          * @param  {Array} Промежуток записей
          * @param  {Number} отступ
          * @param  {IList} проекция
          */
         _getItemsToRemove: function (range, offset, count) {
            var toRemove = [],
               from = range[0],
               to = range[1] < count ? range[1] : count,
               index;
            for (var i = from; i <= to; i++) {
               if (this._options.mode == 'down') {
                  index = i;
               } else {
                  index = count - i - 1 + offset;
               }
               toRemove.push(index);
            }
            if (this._DEBUG) {
               console.log('remove from', from, 'to', to);
            }
            return toRemove;
         },

         /**
          * Добавляет промежуток range записей в позицию at списка с отсупом в offset
          * @param  {Array} Промежуток записей
          * @param  {Number} отступ
          * @param  {IList} проекция
          */
         _getItemsToAdd: function (range, offset, count) {
            var toAdd = [],
               from = range[0],
               to = range[1] < count ? range[1] : count,
               index;

            offset = offset || this._notAddedAmount;

            for (var i = from; i <= to; i++) {
               if (this._options.mode == 'down') {
                  index = i;
               } else {
                  index = count - i - 1 + offset;
               }
               toAdd.push(index);
            }
            if (this._options.mode == 'up') {
               toAdd.reverse();
            }
            if (this._DEBUG) {
               console.log('add from', from, 'to', to, 'at', at);
            }
            return toAdd;
         },

         /**
          * @param  {Number} номер страницы
          * @param  {Number} размер страницы
          * @param  {Number} Количество страниц
          * @return {Array} номера записей в начале и конце этого промежутка страниц
          */
         _getRangeToShow: function (pageNumber, pageSize, pagesCount) {
            var sidePagesCount = Math.floor(pagesCount / 2),
               toShow;
            if (pageNumber - sidePagesCount < 0) {
               return [0, pagesCount * pageSize - 1];
            }
            return [(pageNumber - sidePagesCount) * pageSize, (pageNumber + sidePagesCount + 1) * pageSize - 1];
         },


         /**
          *                                                                             a      b            c      d
          * @param  {Array} Текущий отображаемый промежуток элементов    [a,c]          |-------------------|       
          * @param  {Array} Новый промежуток элементов                   [b,d]                 |-------------------|
          * @return {Array} Разница между промежутками - два промежутка  [[a,b],[c,d]]  |------|            |------|
          */
         _getDiff: function (currentRange, newRange) {
            var top, bottom;

            if (currentRange[0] == newRange[0] && currentRange[1] == newRange[1]) {
               return false;
            }

            // Если промежутки не пересекаются
            if (currentRange[1] < newRange[0]) {
               if (this._options.mode == 'down') {
                  top = newRange;
                  bottom = currentRange;
               } else {
                  top = currentRange;
                  bottom = newRange;
               }
               return {
                  top: top,
                  bottom: bottom
               };
            }

            // Если промежутки не пересекаются
            if (currentRange[0] > newRange[1]) {
               if (this._options.mode == 'down') {
                  top = currentRange;
                  bottom = newRange;
               } else {
                  top = newRange;
                  bottom = currentRange;
               }
               return {
                  top: top,
                  bottom: bottom
               };
            }

            //Если промежутки пересекаются
            if (currentRange[0] - newRange[0] < 0) {
               top = [currentRange[0], newRange[0] - 1];
               bottom = [currentRange[1] + 1, newRange[1]];
            } else {
               top = [newRange[0], currentRange[0] - 1];
               bottom = [newRange[1] + 1, currentRange[1]];
            }

            return {
               top: top,
               bottom: bottom
            };
         },

         _getElementOffset: function (element) {
            element = $(element);
            if (this._options.mode == 'down') {
               var next = element.next('.controls-ListView__item');
               return element.position().top + element.outerHeight(true) + this._beginWrapperHeight;
            } else {
               return this._viewHeight - element.position().top;
            }
         },
         /*
          * Пересчет страниц для VirtualScroll
          * Для каждой страницы хранится отступ ее первого элемента от начала списка и состояние dettached удалена из DOM или нет
          * Вызывается на каждый onResizeHandler у родительского списка
          */
         updateVirtualPages: function () {
            var view = this._options.view,
               pageOffset = 0,
               self = this,
               //Учитываем все что есть в itemsContainer (группировка и тд)
               listItems = $('> *', this._options.itemsContainer).filter(':visible'),
               count = 0,
               lastPageStart;

            var dettachedCount = 0;
            for (var i = 0; i < this._virtualPages.length; i++) {
               if (this._virtualPages[i].dettached) {
                  dettachedCount++;
               } else {
                  break;
               }
            }

            if (self._options.mode == 'up') {
               listItems = $(listItems.get().reverse());
            }
            lastPageStart = (this._virtualPages.length - dettachedCount - 1) * BATCH_SIZE;

            if (lastPageStart <= listItems.length) {
               this._viewHeight = this._options.viewContainer[0].offsetHeight;
               this._scrollableHeight = this._options.viewport[0].offsetHeight;
            }

            //Считаем оффсеты страниц начиная с последней (если ее нет - сначала)
            listItems.slice(lastPageStart).each(function () {
               // Если набралось записей на выстору viewport'a добавим еще страницу
               // При этом нужно учесть отступ сверху от view и фиксированую шапку
               if (++count == BATCH_SIZE) {
                  self._virtualPages.push({
                     offset: self._getElementOffset(this) - self._additionalHeight
                  });
                  count = 0;
               }
            });
         },

         // Добавление новых элементов, когда они добавляются не через подгрузку по скроллу
         // TODO: пока не работает для элементов которые в данный момент не нужно вставлять в DOM
         addItems: function (items, at) {
            var additionalHeight = 0,
               hash;

            // Пока рассчитываем, что добавляется один элемент за раз
            if (items.length == 1) {
               this._currentWindow[1] += 1;
               if (this._newItemsCount === 0) {
                  this._virtualPages.unshift({
                     offset: -this._additionalHeight
                  });
               }
               this._newItemsCount += 1;
               hash = items[0].getHash();
               var itemHeight = $('[data-hash="' + hash + '"]', this._options.viewContainer).height();
               this._additionalHeight += itemHeight;
               this._virtualPages[0].offset = -this._additionalHeight;
            }

            if (this._newItemsCount == BATCH_SIZE) {
               this._onVirtualPageChange(this._currentVirtualPage);
               this._newItemsCount = 0;
            }
         },

         getCurrentRange: function () {
            return this._currentWindow;
         }

      });

      return VirtualScrollController;

   });