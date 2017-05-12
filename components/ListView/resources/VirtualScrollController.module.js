define('js!SBIS3.CONTROLS.VirtualScrollController', ['Core/Abstract'],
   function (cAbstract) {

      var BATCH_SIZE = 20;
      var PAGES_COUNT = 5;

      var VirtualScrollController = cAbstract.extend({
         $protected: {
            _options: {
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
            if (this._options.projection) {
               this._currentWindow = this._getRangeToShow(0, BATCH_SIZE, 1);
            }
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
               var page = this._getPage(scrollTop, viewportHeight, this._additionalHeight);
               if (page >= 0 && this._currentVirtualPage != page) {
                  this._onVirtualPageChange(page);
                  this._currentVirtualPage = page;
               }
            }.bind(this), 0);
         },

         _getPage: function (scrollTop, viewportHeight, additionalHeight) {
            for (var i = 0; i < this._virtualPages.length; i++) {
               if (this._virtualPages[i].offset + additionalHeight >= scrollTop) {
                  return i;
               }
            }
            return this._virtualPages.length - 1;
         },

         _onVirtualPageChange: function (pageNumber) {
            var pages = this._virtualPages,
               segments = [],
               projCount = this._options.projection.getCount(),
               newWindow = this._getRangeToShow(pageNumber, BATCH_SIZE, PAGES_COUNT),
               items;

            // разница между промежутками
            var diff = this._getDiff(this._currentWindow, newWindow);
            // нет разницы - нечего делать
            if (!diff) {
               return;
            }

            if (this._DEBUG) {
               console.log('page', pageNumber);
               console.log('Current widnow:', this._currentWindow[0], this._currentWindow[1], 'New widnow:', newWindow[0], newWindow[1]);
               console.log('diff.top', diff.top);
               console.log('diff.bottom', diff.bottom);
            }

            var direction = this._getDirection(this._currentWindow, newWindow),
               updateConfig = this._getUpdateConfig(diff, direction, this._newItemsCount);

            // удаляем записи
            if (updateConfig.isRemoved) {
               items = this._getItemsToRemove(direction ? diff.top : diff.bottom, updateConfig.removeOffset, projCount);
               this._notify('onItemsRemove', items);
            }
            // добавляем записи
            if (updateConfig.isAdded) {
               var at = this._getPositionToAdd(diff, direction, this._options.mode);
               items = this._getItemsToAdd(direction ? diff.bottom : diff.top, updateConfig.addOffset, projCount);
               this._notify('onItemsAdd', items, at);
            }

            // Если что то менялось, то поменяем высоту распорок
            if (updateConfig.isRemoved || updateConfig.isAdded) {
               this._setWrappersHeight(pageNumber);
            }

            // Если поменялась страница, или увеличилось окно (так может быть в начале) - запомним новое окно
            if (this._currentVirtualPage !== pageNumber || this._currentWindow[1] > newWindow[1]) {
               this._currentWindow = newWindow;
               if (this._DEBUG) {
                  console.log('displayed from ', newWindow[0], 'to', newWindow[1]);
               }
            }
         },

         /**
          * Поучить направление смещения окна
          * @param  {Array}   currentWindow текущее виртуальное окно
          * @param  {Array}   newWindow     новое виртуальное окно
          * @return {Boolean}               true - прокрутка к концу, false - прокрутка к началу
          */
         _getDirection: function(currentWindow, newWindow) {
            return (currentWindow[0] < newWindow[0] || currentWindow[0] > newWindow[1]) && currentWindow[1] > newWindow[0];
         },

         _getUpdateConfig: function(diff, direction, newItemsCount) {
            var segments = [],
               pagesToRemove = [],
               pagesToAdd = [],
               addOffset = 0, 
               removeOffset = 0,
               removed, added;
            // Прокрутка к концу списка
            if (direction) {
               pagesToRemove = this._getPagesByRange(diff.top, BATCH_SIZE);
               pagesToAdd = this._getPagesByRange(diff.bottom, BATCH_SIZE);
               addOffset = newItemsCount ? BATCH_SIZE - newItemsCount : 0;
            } else {
               // Прокрутка к началу списка
               if (diff.bottom[1] - diff.bottom[0] >= BATCH_SIZE - 1) {
                  pagesToRemove = this._getPagesByRange(diff.bottom, BATCH_SIZE);
               }
               pagesToAdd = this._getPagesByRange(diff.top, BATCH_SIZE);
               removeOffset = newItemsCount ? BATCH_SIZE - newItemsCount : 0;
            }

            // Помечаем страницы как удаленные
            isRemoved = this._markPages(true, pagesToRemove);
            // Помечаем страницы как добавленные
            isAdded = this._markPages(false, pagesToAdd);

            return {
               isAdded: isAdded,
               isRemoved: isRemoved,
               addOffset: addOffset,
               removeOffset: removeOffset
            };
         },

         _markPages: function(flag, pages) {
            var changed = false;
            for (var i = 0; i < pages.length; i++) {
               if (this._virtualPages[pages[i]] && this._virtualPages[pages[i]].dettached != flag) {
                  this._virtualPages[pages[i]].dettached = flag;
                  changed = true;
               }
            }
            return changed;
         },
         /**
          * Получить положение для вставки в проекцию
          * @param  {Arra} diff         разница промежутков
          * @param  {Boolean} direction направление смещения окна
          * @param  {String} mode       режим работы
          * @return {Number}            позиция вставки
          */
         _getPositionToAdd: function(diff, direction, mode, projCount){
            var at = 0;
            if (direction) {
               if (mode == 'down') {
                  at = diff.bottom[0];
               }
            } else {
               if (mode == 'up') {
                  at = projCount - (diff.top[1] - diff.top[0] + 1);
               }
            }
            return at;
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
               // Верхняя страница - теущая - половина страниц, но не меньше -1
               topPage = page - halfPage < 0 ? 0 : page - halfPage + 1;
            
            if (bottomPage >= this._virtualPages.length) {
               bottomPage = this._virtualPages.length - 1;
            }

            return [topPage, bottomPage];
         },

         /**
          * Получить высоту распорок
          * @param  {Array} shownPages Массив из номером первой и последней отображаемых страниц
          * @return {Array} Высота верхней и нижней распорок
          */
         _calculateWrappersHeight: function (shownPages) {
            var topPage = shownPages[0],
               bottomPage = shownPages[1];

            this._beginWrapperHeight = this._virtualPages[topPage].offset + this._additionalHeight;
            this._endWrapperHeight = this._virtualPages[this._virtualPages.length - 1].offset - this._virtualPages[bottomPage].offset;
            
            if (this._DEBUG) {
               console.log('top height', this._endWrapperHeight);
               console.log('bottom height', this._beginWrapperHeight);
            }
            return {
               begin: this._beginWrapperHeight, 
               end: this._endWrapperHeight
            };
         },

         _setWrappersHeight: function(pageNumber){
            var wrappersHeight = this._calculateWrappersHeight(
                  this._getShownPages(pageNumber, PAGES_COUNT)
               );
            this._options.beginWrapper.height(wrappersHeight.begin);
            this._options.endWrapper.height(wrappersHeight.end);
         },

         /**
          * по двум индексам получить номера страниц входящих в этот промежуток
          * @param  {Array}  range    индексы 
          * @param  {Number} pageSize размер страницы
          * @return {Array}           номера станиц в промежутке
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

         _getRangeToShow: function (pageNumber, pageSize, pagesCount) {
            var range = this._calculateRangeToShow(pageNumber, pageSize, pagesCount),
               projCount = this._options.projection.getCount();
            // Может добавиться меньше BATCH_SIZE новых элементов, учтем это
            if (range[0] >= BATCH_SIZE && this._newItemsCount) {
               range[0] -= (BATCH_SIZE - this._newItemsCount);
            }

            // Не можем отображать больше чем есть
            if (range[1] > projCount) {
               range[1] = projCount;
            }

            return range;
         },
         
         /**
          * @param  {Number} номер страницы
          * @param  {Number} размер страницы
          * @param  {Number} Количество страниц
          * @return {Array} номера записей в начале и конце этого промежутка страниц
          */
         _calculateRangeToShow: function(pageNumber, pageSize, pagesCount){
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