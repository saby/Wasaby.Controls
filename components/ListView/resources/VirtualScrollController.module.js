define('js!SBIS3.CONTROLS.VirtualScrollController', ['Core/Abstract'],
   function (cAbstract) {

      var BATCH_SIZE = 20;
      var PAGES_COUNT = 5;

      var VirtualScrollController = cAbstract.extend({
         $protected: {
            _options: {
               view: null,
               mode: 'down'
            },
            _currentVirtualPage: 0,
            _virtualPages: [{
               offset: 0
            }],
            _bottomIndex: null,
            _beginWrapper: 0,
            _endWrapper: 0,
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

            if (view) {
               // После первой загрузки инициализируем текущие страницы
               view.subscribe('onDataLoad', function () {
                  this._virtualPages = [{
                     offset: 0
                  }];
                  this.updateVirtualPages();
                  this._currentWindow = this._getRangeToShow(0, BATCH_SIZE, this._virtualPages.length);
               }.bind(this));

               if (this._options.mode == 'down') {
                  this._beginWrapper = $('.controls-ListView__virtualScrollTop', view.getContainer());
                  this._endWrapper = $('.controls-ListView__virtualScrollBottom', view.getContainer());
               } else {
                  // при загрузке вверх все в точности наборот, так проще выставлять размеры - так как алгоритм одинаковый
                  this._endWrapper = $('.controls-ListView__virtualScrollTop', view.getContainer());
                  this._beginWrapper = $('.controls-ListView__virtualScrollBottom', view.getContainer());
               }
               this._currentWindow = this._getRangeToShow(0, BATCH_SIZE, this._virtualPages.length);
               view._scrollWatcher.getScrollContainer()[0].addEventListener('scroll', this._scrollHandler.bind(this), {
                  passive: true
               });
            }
         },

         _scrollHandler: function (e, scrollTop) {
            clearTimeout(this._scrollTimeout);
            this._scrollTimeout = setTimeout(function () {
               var page = this._getPage();
               if (page >= 0 && this._currentVirtualPage != page) {
                  this._scrollingDown = this._currentVirtualPage < page;
                  this._onVirtualPageChange(page);
                  this._currentVirtualPage = page;
               }
            }.bind(this), 0);
         },

         _getPage: function () {
            var view = this._options.view;
            var scrollContainer = view._getScrollWatcher().getScrollContainer(),
               scrollTop = scrollContainer.scrollTop();
            if (this._options.mode == 'down') {
               if (view.isScrollOnBottom(true)) {
                  return this._virtualPages.length - 1;
               }
            } else {
               scrollTop = view.getContainer().height() - scrollTop - this._scrollableHeight;
            }
            for (var i = 0; i < this._virtualPages.length; i++) {
               var pageOffset = this._virtualPages[i].offset;
               if (pageOffset + this._additionalHeight > scrollTop) {
                  return i;
               }
            }
            this.updateVirtualPages();
            return this._virtualPages.length - 1;
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
               projCount = this._options.view._getItemsProjection().getCount(),
               i;

            // Может добавиться меньше BATCH_SIZE новых элементов, учтем это
            if (newWindow[0] >= BATCH_SIZE && this._newItemsCount) {
               newWindow[0] -= (BATCH_SIZE - this._newItemsCount);
            }
            // Не можем отображать больше чем есть
            if (newWindow[1] > projCount) {
               newWindow[1] = projCount;
            }

            // разница между промежутками
            // если начало списка вверху то, top - элменты которые нужно убрать, bottom - элементы которые нужно добавить
            // если список снизу вверх - то наоборот 
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
            }

            // Прокрутка к концу списка
            if (this._currentWindow[0] < newWindow[0]) {
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
                  at = this._options.view._getItemsProjection().getCount() - (diff.top[1] - diff.top[0] + 1);
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
               this._remove(segments[0], removeOffset);
            }
            // добавляем записи
            if (haveToAdd) {
               this._add(segments[1], at, addOffset);
            }

            if (haveToRemove || haveToAdd) {
               var wrappersHeight = this._getWrappersHeight(
                     this._virtualPages,
                     this._getShownPages(pageNumber, PAGES_COUNT)
                  );
               this._beginWrapper.height(wrappersHeight[0]);
               this._endWrapper.height(wrappersHeight[1]);
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
          */
         _remove: function (range, offset) {
            var toRemove = [],
               from = range[0],
               to = range[1],
               projection = this._options.view._getItemsProjection(),
               prjItem, index;
            for (var i = from; i <= to; i++) {
               if (this._options.mode == 'down') {
                  index = i;
               } else {
                  index = projection.getCount() - i - 1 + offset;
               }
               prjItem = projection.at(index);
               if (!prjItem) {
                  break;
               }
               toRemove.push(prjItem);
            }
            this._options.view._removeItems(toRemove);
            if (this._DEBUG) {
               console.log('remove from', from, 'to', to);
            }
         },

         /**
          * Добавляет промежуток range записей в позицию at списка с отсупом в offset
          * @param  {Array} Промежуток записей
          * @param  {Number} отступ
          */
         _add: function (range, at, offset) {
            var toAdd = [],
               from = range[0],
               to = range[1],
               projection = this._options.view._getItemsProjection(),
               prjItem, index;

            offset = offset || this._notAddedAmount;

            for (var i = from; i <= to; i++) {
               if (this._options.mode == 'down') {
                  index = i;
               } else {
                  index = projection.getCount() - i - 1 + offset;
               }
               prjItem = projection.at(index);
               if (!prjItem) {
                  break;
               }
               toAdd.push(prjItem);
            }
            if (this._options.mode == 'up') {
               toAdd.reverse();
            }
            this._processingReturn = true;
            this._options.view._addItems(toAdd, at);
            this._processingReturn = false;
            if (this._DEBUG) {
               console.log('add from', from, 'to', to, 'at', at);
            }
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
            var view = this._options.view;
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
               listItems = $('> *', view._getItemsContainer()).filter(':visible'),
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
               this._viewHeight = view.getContainer()[0].offsetHeight;
               this._scrollableHeight = view._getScrollWatcher().getScrollContainer()[0].offsetHeight;
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
               var itemHeight = $('[data-hash="' + hash + '"]', this._options.view.getContainer()).height();
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
         },

         isInShownRange: function (index) {
            var allow;
            this._notAddedAmount += 1;
            if (index < BATCH_SIZE || this._processingReturn) {
               allow = true;
            } else {
               index = this._options.view._getItemsProjection().getCount() - index;
               allow = index > this._currentWindow[0];
            }
            return allow;
         }

      });

      return VirtualScrollController;

   });