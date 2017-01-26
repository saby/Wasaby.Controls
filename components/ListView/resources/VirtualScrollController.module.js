define('js!SBIS3.CONTROLS.VirtualScrollController', 
   ['Core/Abstract'], 
   function(cAbstract) {

   var BATCH_SIZE = 20;

   var VirtualScrollController = cAbstract.extend({
      $protected: {
         _options: {
            view: null,
         },
         _virtualPages: [{offset: 0}],
         _threshold: 100,
         _topIndex: 0,
         _bottomIndex: null,
         _topWrapper: null,
         _bottomWrapper: null,
         _topDetachedPages: [],
         _bottomDetachedPages: []
      },

      init: function(){
         var view = this._options.view;
         VirtualScrollController.superclass.init.call(this);
         //this._options.viewportController.subscribe('onVirtualPageChange', this._onVirtualPageChange.bind(this));

         this._topWrapper = $('.controls-ListView__virtualScrollTop', view.getContainer());
         this._bottomWrapper = $('.controls-ListView__virtualScrollBottom', view.getContainer());

         //this._onVirtualPageChangeDebounce = this._onVirtualPageChange.debounce(10);
         this._currentWindow = this._getRangeToShow(0, BATCH_SIZE, 5);
         view._getScrollWatcher().subscribe('onScroll', this._scrollHandler.bind(this));
      },

      _scrollHandler: function(e, scrollTop){
         var page = this._getPage();
         if (page >= 0 && this._currentVirtualPage!= page) {
            this._scrollingDown = this._currentVirtualPage < page;
            this._currentVirtualPage = page;
            this._onVirtualPageChange(page);
         }
      },

      _getPage: function(){
         var view = this._options.view;
         if (view.isScrollOnBottom(true)){
            return this._virtualPages.length - 1;
         }
         var scrollTop = view._getScrollWatcher().getScrollContainer().scrollTop();
         for (var i = 0; i < this._virtualPages.length; i++){
            var pageOffset = this._virtualPages[i].offset;
            if (pageOffset > scrollTop){
               return i;
            }
         }
      },

      _onVirtualPageChange: function(pageNumber) {
         var pages = this._virtualPages,
            at,
            pagesToRemove,
            pagesToAdd,
            haveToAdd = false, 
            haveToRemove = false;

         var newWindow = this._getRangeToShow(pageNumber, BATCH_SIZE, 5);
         var diff = this._getDiff(this._currentWindow, newWindow);
         console.log('page', pageNumber);
         console.log('widnow', newWindow);
         if (!diff) {
            this._currentWindow = newWindow;
            return;
         }
         console.log('diff.top', diff.top);
         console.log('diff.bottom', diff.bottom);
         
         // если скроллим вниз (текущее окно ниже предыдущего)
         if (this._currentWindow[0] < newWindow[0]) {
            pagesToRemove = this._getPagesByIndexes(diff.top[0], diff.top[1], BATCH_SIZE);
            pagesToAdd = this._getPagesByIndexes(diff.bottom[0], diff.bottom[1], BATCH_SIZE);
            
            // Меняем высоту распорок
            this._topWrapper.height(pages[pagesToRemove[0] + 1].offset);
            var lastPageToAdd = pagesToAdd[pagesToAdd.length - 1];
            if (pages[lastPageToAdd + 1]){
               this._bottomWrapper.height(this._bottomWrapper.height() - (pages[lastPageToAdd + 1].offset - pages[lastPageToAdd ].offset));
            } else {
               this._bottomWrapper.height(0);
            }
            // Помечаем страницы как удаленные
            for (var i = 0; i < pagesToRemove.length; i++) {
               if (pages[pagesToRemove[i]]){
                  pages[pagesToRemove[i]].detached = true;
                  haveToRemove = true;
               }
            }
            // затем удаляем их
            if (haveToRemove) {
               this._remove(diff.top[0], diff.top[1]);
            }
            
            // Помечаем страницы как отображаемые
            for (var i = 0; i < pagesToAdd.length; i++) {
               if (pages[pagesToAdd[i]] && pages[pagesToAdd[i]].detached) {
                  pages[pagesToAdd[i]].detached = false;
                  haveToAdd = true;
               }
            }
            // затем добавляем их
            if (haveToAdd){
               this._add(diff.bottom[0], diff.bottom[1], diff.bottom[0]);
            }

         } else {
            pagesToRemove = this._getPagesByIndexes(diff.bottom[0], diff.bottom[1], BATCH_SIZE);
            pagesToAdd = this._getPagesByIndexes(diff.top[0], diff.top[1], BATCH_SIZE);
            
            this._topWrapper.height(pages[pagesToAdd[0]].offset);
            var lastPageToRemove = pagesToRemove[pagesToRemove.length - 1];
            if (pages[lastPageToRemove + 1]) {
               this._bottomWrapper.height(this._bottomWrapper.height() + (pages[lastPageToRemove + 1].offset - pages[lastPageToRemove].offset));
            }

            for (var i = 0; i < pagesToRemove.length; i++) {
               if (pages[pagesToRemove[i]]){
                  pages[pagesToRemove[i]].detached = true;
                  haveToRemove = true;
               }
            }
            if (haveToRemove) {
               this._remove(diff.bottom[0], diff.bottom[1]);
            }
            for (var i = 0; i < pagesToAdd.length; i++) {
               if (pages[pagesToAdd[0]] && pages[pagesToAdd[0]].detached) {
                  pages[pagesToAdd[0]].detached = false;
                  haveToAdd = true;
               }
            }
            if (haveToAdd){
               this._add(diff.top[0], diff.top[1], 0);
            }
         }

         this._currentWindow = newWindow;
         if (!this._checkOrder()){
            debugger;
         }
      },

      _getPagesByIndexes: function(a, b, pageSize){
         a = Math.floor((a + 1) / pageSize);
         b = Math.floor((b + 1) / pageSize);
         var pages = [];
         for (var i = a; i <= b; i++) {
            pages.push(i);
         }
         pages.pop();
         return pages;
      },

      _remove: function(from, to){
         var toRemove = [], prjItem;
         for (var i = from; i <= to; i++) {
            prjItem = this._options.view._getItemsProjection().at(i);
            if (!prjItem){
               break;
            }
            toRemove.push(prjItem);
         }
         this._options.view._removeItems(toRemove);
         console.log('remove from', from, 'to', to);
      },

      _add: function(from, to, at){
         var toAdd = [], prjItem;
         for (var i = from; i <= to; i++) {
            prjItem = this._options.view._getItemsProjection().at(i);
            if (!prjItem){
               break;
            }
            toAdd.push(prjItem);
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

         if (currentRange[1] < newRange[0] || currentRange[0] > newRange[1]){
            return {
               top: newRange,
               bottom: currentRange
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

      _checkOrder: function(){
         var check = true;
         var broken;
         var prev;
         $('.controls-DataGridView__tr').each(function(){
            var id = $(this).data('id');
            if (prev && id !== prev + 1){
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

      _getElementOffsetBottom: function(element) {
         element = $(element);
         var next = element.next('.controls-ListView__item'),
            topWrapperHeight = this._options.view.getContainer().find('.controls-ListView__virtualScrollTop').height(),
            // Считаем через position, так как для плитки не подходит сложение высот
            curBottom = element.position().top + element.outerHeight(true) + topWrapperHeight;
         return curBottom;
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
            count = 0;

         var topDettachedCount = 0;
         for (var i = 0; i < this._virtualPages.length; i++){
            if (this._virtualPages[i].detached){
               topDettachedCount++;
            } else {
               break;
            }
         }

         var lastPageStart = (this._virtualPages.length - topDettachedCount - 1) * BATCH_SIZE;
         //Считаем оффсеты страниц начиная с последней (если ее нет - сначала)
         listItems.slice(lastPageStart).each(function(){
            // Если набралось записей на выстору viewport'a добавим еще страницу
            // При этом нужно учесть отступ сверху от view и фиксированую шапку
            if (++count == BATCH_SIZE) {
               self._virtualPages.push({
                  offset: self._getElementOffsetBottom(this)
               });
               count = 0;
            }
         });
      },

   });

   return VirtualScrollController;

});