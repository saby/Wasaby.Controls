define('js!SBIS3.CONTROLS.VirtualScrollController', 
   ['Core/Abstract'], 
   function(cAbstract) {

   var BATCH_SIZE = 20;
   var PAGES_COUNT = 5;

   var VirtualScrollController = cAbstract.extend({
      $protected: {
         _options: {
            view: null,
            mode: 'up'
         },
         _currentVirtualPage: 0,
         _virtualPages: [{offset: 0}],
         _bottomIndex: null,
         _beginWrapper: null,
         _endWrapper: null,
         _newItemsCount: 0,
         _additionalHeight: 0,
         _lastPageHeight: 0,
         _DEBUG: true
      },

      init: function(){
         var view = this._options.view;
         VirtualScrollController.superclass.init.call(this);
         
         view.subscribe('onDataLoad', function(){
            this._virtualPages = [{offset: 0}];
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
         //this._onVirtualPageChangeDebounce = this._onVirtualPageChange.debounce(10);
         this._currentWindow = this._getRangeToShow(0, BATCH_SIZE, this._virtualPages.length);
         view._scrollWatcher.getScrollContainer()[0].addEventListener('scroll', this._scrollHandler.bind(this), { passive: true });
      },

      _scrollHandler: function(e, scrollTop){
         clearTimeout(this._scrollTimeout);
         this._scrollTimeout = setTimeout(function(){
            var page = this._getPage();
            if (page >= 0 && this._currentVirtualPage!= page) {
               this._scrollingDown = this._currentVirtualPage < page;
               this._onVirtualPageChange(page);
               this._currentVirtualPage = page;
            }
         }.bind(this), 0);
      },

      _getPage: function() {
         var view = this._options.view;
         var scrollContainer = view._getScrollWatcher().getScrollContainer(),
            scrollTop = scrollContainer.scrollTop();
         if (this._options.mode == 'down'){
            if (view.isScrollOnBottom(true)){
               return this._virtualPages.length - 1;
            }
         } else {
            scrollTop = view.getContainer().height() - scrollTop - this._scrollableHeight;
         }
         for (var i = 0; i < this._virtualPages.length; i++){
            var pageOffset = this._virtualPages[i].offset;
            if (pageOffset + this._additionalHeight > scrollTop){
               return i;
            }
         }
         this.updateVirtualPages();
         return this._virtualPages.length - 1;
      },

      _onVirtualPageChange: function(pageNumber) {
         var pages = this._virtualPages,
            at = 0,
            offset = 0,
            segments = [],
            haveToAdd = false, 
            haveToRemove = false,
            newWindow = this._getRangeToShow(pageNumber, BATCH_SIZE, PAGES_COUNT);

         if (newWindow[0] >= BATCH_SIZE && this._newItemsCount) {
            newWindow[0] -= (BATCH_SIZE - this._newItemsCount);
         }

         var diff = this._getDiff(this._currentWindow, newWindow),
            pagesToRemove, pagesToAdd, i;

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

         if (this._currentWindow[0] < newWindow[0]) {
            segments[0] = diff.top;
            segments[1] = diff.bottom;
            pagesToRemove = this._getPagesByRange(segments[0], BATCH_SIZE);
            pagesToAdd = this._getPagesByRange(segments[1], BATCH_SIZE);
            if (this._options.mode == 'down') {
               at = diff.bottom[0];
            }
            offset = this._newItemsCount ? BATCH_SIZE - this._newItemsCount : 0;
         } else {
            segments[0] = diff.bottom;
            segments[1] = diff.top;
            pagesToRemove = this._getPagesByRange(segments[0], BATCH_SIZE);
            pagesToAdd = this._getPagesByRange(segments[1], BATCH_SIZE);
            if (this._options.mode == 'up') {
               at = this._options.view._getItemsProjection().getCount() - (diff.top[1] - diff.top[0] + 1);
            }
         }

         // Помечаем страницы как удаленные
         for (i = 0; i < pagesToRemove.length; i++) {
            if (pages[pagesToRemove[i]]){
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
            this._remove(segments[0], BATCH_SIZE - this._newItemsCount);
         }   
         // добавляем записи
         if (haveToAdd){
            this._add(segments[1], at, offset);
         }

         if (this._currentVirtualPage !== pageNumber || this._currentWindow[1] > newWindow[1]) {
            this._currentWindow = newWindow;
            this._notify('onVirtualWinodowChange', newWindow[0], newWindow[1]);
            if (this._DEBUG) {
               console.log('displayed from ', newWindow[0], 'to', newWindow[1]);
            }
         }
         if (haveToRemove || haveToAdd) {
             this._setWrappersHeight(pageNumber);
         }
      },

      _setWrappersHeight: function(page) {
         var pages = this._virtualPages,
            bottomPage = page + 3 < 5 ? 5 : page + 3,
            topPage = page - 3 < 0 ? 0 : page - 3;
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
         this._beginWrapper.height(this._beginWrapperHeight);
         this._endWrapper.height(this._endWrapperHeight);
      },

      /**
       * по двум индексам получить номера страниц входящих в этот промежуток
       * @param  {Array} range    индексы 
       * @param  {Number} pageSize размер страницы
       * @return {Array} номера станиц в промежутке
       * @private
       */
      _getPagesByRange: function(range, pageSize){
         var pages = [];
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

      _remove: function(range){
         var toRemove = [],
            from = range[0],
            to = range[1], 
            projection = this._options.view._getItemsProjection(),
            prjItem, index;
         for (var i = from; i <= to; i++) {
            if (this._options.mode == 'down'){
               index = i;
            } else {
               index = projection.getCount() - i - 1;
            }
            prjItem = projection.at(index);
            if (!prjItem){
               break;
            }
            toRemove.push(prjItem);
         }
         this._options.view._removeItems(toRemove);
         if (this._DEBUG) {
            console.log('remove from', from, 'to', to);
         }
      },

      _add: function(range, at, offset) {
         var toAdd = [],
            from = range[0],
            to = range[1], 
            projection = this._options.view._getItemsProjection(),
            prjItem, index;
         for (var i = from; i <= to; i++) {
            if (this._options.mode == 'down'){
               index = i;
            } else {
               index = projection.getCount() - i - 1;// + offset;
            }
            prjItem = projection.at(index);
            if (!prjItem){
               break;
            }
            toAdd.push(prjItem);
         }
         if (this._options.mode == 'up'){
            toAdd.reverse();
         }
         this._options.view._addItems(toAdd, at);
         if (this._DEBUG) {
            console.log('add from', from, 'to', to, 'at', at);
         }
      },

      _getRangeToShow: function(pageNumber, pageSize, pagesCount) {
         var sidePagesCount = Math.floor(pagesCount / 2),
            toShow;
         if (pageNumber - sidePagesCount < 0) {
            return [0, pagesCount * pageSize - 1];
         }
         return [(pageNumber - sidePagesCount) * pageSize, (pageNumber + sidePagesCount + 1) * pageSize - 1];
      },

      _getDiff: function(currentRange, newRange) {
         var top, bottom;

         if (currentRange[0] == newRange[0] && currentRange[1] == newRange[1]){
            return false;
         }

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

      _getOffsets: function(){
         var offsets = [];
         for (var i = 0; i < this._virtualPages.length; i++){
            offsets.push(this._virtualPages[i].offset);
         }
         return offsets;
      },

      _getElementOffset: function(element) {
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
       */
      updateVirtualPages: function(){
         var view = this._options.view,
            pageOffset = 0,
            self = this,
            //Учитываем все что есть в itemsContainer (группировка и тд)
            listItems = $('> *', view._getItemsContainer()).filter(':visible'),
            count = 0,
            lastPageStart;
         
         var dettachedCount = 0;
         for (var i = 0; i < this._virtualPages.length; i++){
            if (this._virtualPages[i].dettached){
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
         listItems.slice(lastPageStart).each(function(){
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

      addItems: function(items, at) {
         var additionalHeight = 0,
            hash;
         
         // Пока рассчитываем, что добавляется один элемент за раз
         if (items.length == 1) {
            this._currentWindow[1] += 1;
            if (this._newItemsCount === 0) {
               this._onVirtualPageChange(this._currentVirtualPage);
               this._virtualPages.unshift({offset: -this._additionalHeight});
            }
            this._newItemsCount += 1;
            hash = items[0].getHash();
            var itemHeight = $('[data-hash="' + hash + '"]', this._options.view.getContainer()).height();
            this._additionalHeight += itemHeight;
            this._lastPageHeight += itemHeight;
            this._virtualPages[0].offset = -this._additionalHeight;
         }

         if (this._newItemsCount == BATCH_SIZE) {
            this._newItemsCount = 0;
            this._lastPageHeight = 0;
         }
      },

      getCurrentRange: function(){
         return this._currentWindow;
      }

   });

   return VirtualScrollController;

});