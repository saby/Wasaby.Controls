define('js!SBIS3.CONTROLS.VirtualScrollController', 
   ['Core/Abstract'], 
   function(cAbstract) {

   var BATCH_SIZE = 20;

   var VirtualScrollController = cAbstract.extend({
      $protected: {
         _options: {
            view: null,
            mode: 'up'
         },
         _virtualPages: [{offset: 0}],
         _bottomIndex: null,
         _topWrapper: null,
         _bottomWrapper: null,
      },

      init: function(){
         var view = this._options.view;
         VirtualScrollController.superclass.init.call(this);
         
         view.subscribe('onDataLoad', function(){
            this._virtualPages = [{offset: 0}];
         }.bind(this));

         if (this._options.mode == 'down') {
            this._topWrapper = $('.controls-ListView__virtualScrollTop', view.getContainer());
            this._bottomWrapper = $('.controls-ListView__virtualScrollBottom', view.getContainer());
         } else {
         // при загрузке вверх все в точности наборот, так проще выставлять размеры - так как алгоритм одинаковый
            this._bottomWrapper = $('.controls-ListView__virtualScrollTop', view.getContainer());
            this._topWrapper = $('.controls-ListView__virtualScrollBottom', view.getContainer());
         }
         //this._onVirtualPageChangeDebounce = this._onVirtualPageChange.debounce(10);
         this._currentWindow = this._getRangeToShow(0, BATCH_SIZE, 5);
         view._getScrollWatcher().subscribe('onScroll', this._scrollHandler.bind(this));
      },

      _scrollHandler: function(e, scrollTop){
         clearTimeout(this._scrollTimeout);
         this._scrollTimeout = setTimeout(function(){
            var page = this._getPage();
            if (page >= 0 && this._currentVirtualPage!= page) {
               this._scrollingDown = this._currentVirtualPage < page;
               this._currentVirtualPage = page;
               this._onVirtualPageChange(page);
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
            if (pageOffset > scrollTop){
               return i;
            }
         }
         this.updateVirtualPages();
         return this._virtualPages.length - 1;
      },

      _onVirtualPageChange: function(pageNumber) {
         var pages = this._virtualPages,
            at = 0,
            segments = [],
            haveToAdd = false, 
            haveToRemove = false,
            newWindow = this._getRangeToShow(pageNumber, BATCH_SIZE, 5),
            diff = this._getDiff(this._currentWindow, newWindow),
            pagesToRemove, pagesToAdd;

         console.log('page', pageNumber);
         console.log('widnow', newWindow);
         
         if (!diff) {
            this._currentWindow = newWindow;
            return;
         }
         
         console.log('diff.top', diff.top);
         console.log('diff.bottom', diff.bottom);

         if (this._currentWindow[0] < newWindow[0]) {
            segments[0] = diff.top;
            segments[1] = diff.bottom;
            pagesToRemove = this._getPagesByRange(segments[0], BATCH_SIZE);
            pagesToAdd = this._getPagesByRange(segments[1], BATCH_SIZE);
            if (this._options.mode == 'down') {
               at = diff.bottom[0];
            }
         } else {
            segments[0] = diff.bottom;
            segments[1] = diff.top;
            pagesToRemove = this._getPagesByRange(segments[0], BATCH_SIZE);
            pagesToAdd = this._getPagesByRange(segments[1], BATCH_SIZE);
            if (this._options.mode == 'up') {
               // TODO: тут вообще не должно этого быть, нужно только в событии сообщать в начало или в конец
               at = this._options.view._getItemsProjection().getCount() - pagesToAdd.length * BATCH_SIZE;
            }
         }

         // Помечаем страницы как удаленные
         for (var i = 0; i < pagesToRemove.length; i++) {
            if (pages[pagesToRemove[i]]){
               pages[pagesToRemove[i]].detached = true;
               haveToRemove = true;
            }
         }
         // Помечаем страницы как отображаемые
         for (var i = 0; i < pagesToAdd.length; i++) {
            if (pages[pagesToAdd[i]] && pages[pagesToAdd[i]].detached) {
               pages[pagesToAdd[i]].detached = false;
               haveToAdd = true;
            }
         }
         // удаляем записи
         if (haveToRemove) {
            this._remove(segments[0]);
         }   
         // добавляем записи
         if (haveToAdd){
            this._add(segments[1], at);
         }

         this._setWrappersHeight(pageNumber);

         this._currentWindow = newWindow;
         if (!this._checkOrder()){
         //   debugger;
         }
      },

      _setWrappersHeight: function(page) {
         var pages = this._virtualPages,
            bottomPage = page + 2,
            topPage = page - 2;
         if (this._virtualPages[bottomPage]) {
            this._bottomWrapperHeight = pages[pages.length - 1].offset - pages[bottomPage].offset;
         } else {
            this._bottomWrapperHeight = 0;
         }
         if (this._virtualPages[topPage]) {
            this._topWrapperHeight = pages[topPage].offset;
         } else {
            this._topWrapperHeight = 0;
         }

         this._topWrapper.height(this._topWrapperHeight);
         this._bottomWrapper.height(this._bottomWrapperHeight);
      },

      /**
       * по промежутку индексов получить номера страниц входящих в этот промежуток
       * @param  {Array} range    индексы 
       * @param  {Number} pageSize размер страницы
       * @return {Array}          номера станиц в промежутке
       * @private
       */
      _getPagesByRange: function(range, pageSize){
         from = Math.floor((range[0] + 1) / pageSize);
         to = Math.floor((range[1] + 1) / pageSize);
         var pages = [];
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
         console.log('remove from', from, 'to', to);
      },

      _add: function(range, at) {
         var toAdd = [],
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
            prjItem = this._options.view._getItemsProjection().at(index);
            if (!prjItem){
               break;
            }
            toAdd.push(prjItem);
         }
         if (this._options.mode == 'up'){
            toAdd.reverse();
         }
         this._options.view._addItems(toAdd, at);
         console.log('add from', from, 'to', to, 'at', at);
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
         {
            if (currentRange[0] - newRange[0] < 0) {
               top = [currentRange[0], newRange[0] - 1];
               bottom = [currentRange[1] + 1, newRange[1]];
            } else {
               top = [newRange[0], currentRange[0] - 1];
               bottom = [newRange[1] + 1, currentRange[1]];
            }
         }

         return {
            top: top,
            bottom: bottom
         };
      },

      _checkOrder: function(){
         var check = true;
         var broken;
         var prev;
         var sign = this._options.mode == 'down' ? 1 : -1;
         $('.controls-DataGridView__tr').each(function(){
            var id = $(this).data('id');
            if (prev && id !== prev + 1 * sign){
               check = false;
               broken = this;
               return false;
            }
            prev = id;
         });
         console.log('order check: ', check);
         if (broken){
            console.log('broke at ', broken);
            return false;
         }
         return true;
      },

      _getElementOffset: function(element) {
         element = $(element);
         var view = this._options.view;
         if (this._options.mode == 'down') {
            var next = element.next('.controls-ListView__item');
            return element.position().top + element.outerHeight(true) + this._topWrapperHeight;;
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
            if (this._virtualPages[i].detached){
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
                  offset: self._getElementOffset(this),
                  element: this
               });
               count = 0;
            }
         });
      },

      addItems: function(items){
         // this._newItemsCount += items.length;
         // if (this._newItemsCount >= BATCH_SIZE) {
         //    var newPageHeight = 
         // }
      },

      getCurrentRange: function(){
         return this._currentWindow;
      }

   });

   return VirtualScrollController;

});