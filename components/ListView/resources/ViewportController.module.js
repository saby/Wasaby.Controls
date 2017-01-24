define('js!SBIS3.CONTROLS.ViewportController', 
   ['Core/Abstract', 'js!SBIS3.StickyHeaderManager'], 
   function(cAbstract, StickyHeaderManager) {

   var VIRTUAL_SCROLLING = 'virtualScrolling';
   var SCROLL_PAGING = 'scrollPaging';
   var THRESHOLD = 20;

   var ViewportController = cAbstract.extend({
      $protected: {
         _options: {
            view: null,
            mode: VIRTUAL_SCROLLING
         },
         _virtualPages: [],
         _scrollPages: [],
         _pageOffset: 0, // offset последней страницы
         _currentScrollPage: 0,
         _currentVirtualPage: 0,
         _windowResizeTimeout: null,
      },

      init: function(){
         ViewportController.superclass.init.call(this);
         var view = this._options.view; 
         view._getScrollWatcher().subscribe('onScroll', this._scrollHandler.bind(this));
      },

      _scrollHandler: function(e, scrollTop){
         var page;
         if (this._options.mode == SCROLL_PAGING) {
            page = this._calcScrollPage();
            if (page >= 0 && this._currentScrollPage != page) {
               this._currentScrollPage = page;
               this._notify('onScrollPageChange', page);
            }
         } else {
            page = this.getVirtualPage();
            if (page >= 0 && this._currentVirtualPage!= page) {
               this._currentVirtualPage = page;
               this._notify('onVirtualPageChange', page);
            }
         }
      },

      _getElementOffsetBottom: function(element) {
         element = $(element);
         var next = element.next('.controls-ListView__item'),
            topWrapperHeight = this._options.view.getContainer().find('.controls-ListView__virtualScrollTop').height(),
            // Считаем через position, так как для плитки не подходит сложение высот
            curBottom = element.position().top + element.outerHeight(true) + topWrapperHeight;
         return curBottom;
      },

      update: function(reset){
         this.updateVirtualPages(reset);
      },

      /*
       * Пересчет страниц для VirtualScroll
       * @param reset пересчитать полностью, или добавить к существующим
       */
      updateVirtualPages: function(reset){
         var view = this._options.view,
            pageOffset = 0,
            lastPageStart = 0,
            self = this,
            //Учитываем все что есть в itemsContainer (группировка и тд)
            listItems = $('> *', view._getItemsContainer()).filter(':visible'),
            count = 0;

         //Сбрасываем все для пересчета
         if (reset){
            this._virtualPages = [];
            self._pageOffset = 0;
         }
         //Берем последнюю посчитаную страницу, если она есть
         if (this._virtualPages.length > 1){
            lastPageStart = this._virtualPages[this._virtualPages.length - 1].start.index();
         } else {
            //Запушим первый элемент, если он есть
            var element = listItems.eq(0);
            if (view.getItems() && view.getItems().getCount() && element.length){
               this._virtualPages.push({
                  start: element,
                  offset: 0
               });
            }
         }
         //Считаем оффсеты страниц начиная с последней (если ее нет - сначала)
         listItems.slice(lastPageStart ? lastPageStart + 1 : 0).each(function(){
            // Если набралось записей на выстору viewport'a добавим еще страницу
            // При этом нужно учесть отступ сверху от view и фиксированую шапку
            if (++count == THRESHOLD) {
               self._pageOffset = self._getElementOffsetBottom(this);
               self._virtualPages.push({
                  start: $(this),
                  offset: self._pageOffset
               });
               count = 0;
            }
         });
      },

      getVirtualPage: function(){
         var view = this._options.view;
         if (this._options.view.isScrollOnBottom(true)){
            return this._virtualPages.length - 1;
         }
         var scrollTop = this._options.view._getScrollWatcher().getScrollContainer().scrollTop();
         for (var i = 0; i < this._virtualPages.length; i++){
            var page = this._virtualPages[i];
            if (page.offset > scrollTop){
               return i;
            }
         }
      },

      /*
       * Пересчет страниц для ScrollPaging
       * @param reset пересчитать полностью, или добавить к существующим
       */
      updateScrollPages: function(reset){
         var view = this._options.view,
            viewport = $(view._scrollWatcher.getScrollContainer()),
            viewportHeight = viewport.height(),
            pageOffset = 0,
            lastPageStart = 0,
            self = this,
            //Учитываем все что есть в itemsContainer (группировка и тд)
            listItems = $('> *', view._getItemsContainer()).filter(':visible'),
            stickyHeaderHeight = StickyHeaderManager.getStickyHeaderHeight(view.getContainer()) || 0,
            topWrapperHeight = view.getContainer().find('.controls-ListView__virtualScrollTop').height();

         // Нужно учитывать отступ от родителя, что бы правильно скроллить к странице
         if (this._offsetTop === undefined){
            var viewTop = view.getContainer().get(0).getBoundingClientRect().top,
               viewportTop = viewport[0] == window ? 0 : viewport.get(0).getBoundingClientRect().top;
               this._offsetTop = viewTop - viewportTop;
         }

         //Сбрасываем все для пересчета
         if (reset){
            this._scrollPages = [];
            self._pageOffset = 0;
         }
         //Берем последнюю посчитаную страницу, если она есть
         if (this._scrollPages.length > 1){
            lastPageStart = this._scrollPages[this._scrollPages.length - 1].start.index();
         } else {
            //Запушим первый элемент, если он есть
            var element = listItems.eq(0);
            if (view.getItems() && view.getItems().getCount() && element.length){
               this._scrollPages.push({
                  start: element,
                  offset: self._pageOffset
               });
            }
         }
         //Считаем оффсеты страниц начиная с последней (если ее нет - сначала)
         listItems.slice(lastPageStart ? lastPageStart + 1 : 0).each(function(){
            var $this = $(this),
               $next = $this.next('.controls-ListView__item'),
               // Считаем через position, так как для плитки не подходит сложение высот
               curBottom = $this.position().top + $this.outerHeight(true) + topWrapperHeight,
               nextBottom = $next[0] ? $next.position().top + $next.outerHeight(true) : 0;
            curBottom = curBottom > pageOffset ? curBottom : pageOffset;
            nextBottom = nextBottom > curBottom ? nextBottom : curBottom;
            pageOffset = curBottom;
            // Если набралось записей на выстору viewport'a добавим еще страницу
            // При этом нужно учесть отступ сверху от view и фиксированую шапку
            var offsetTop = self._scrollPages.length == 1 ? self._offsetTop : stickyHeaderHeight,
               prevPage = self._scrollPages[self._scrollPages.length - 1],
               prevPageOffset = prevPage ? prevPage.offset : 0;
            if (nextBottom - prevPageOffset > viewportHeight - offsetTop) {
               self._pageOffset = pageOffset;
               self._scrollPages.push({
                  start: $this,
                  offset: self._pageOffset - stickyHeaderHeight
               });
            }
         });
      },

      scrollToPage: function(pageNumber){
         var view = this._options.view;
         if (pageNumber != this._currentScrollPage && this._scrollPages.length){
            var page = this._scrollPages[pageNumber];
            if (page){
               var offset = page.offset ? this._offsetTop : 0;
               view._scrollWatcher.scrollTo(page.offset + offset);
            }
         }
      },

      getScrollPage: function(){
         return this._currentScrollPage;
      },

      getScrollPages: function(){
         return this._scrollPages;
      },

      _calcScrollPage: function(){
         var view = this._options.view;
         if (this._options.view.isScrollOnBottom(true)){
            return this._scrollPages.length - 1;
         }
         for (var i = 0; i < this._scrollPages.length; i++){
            var page = this._scrollPages[i];
            if (this._isPageStartVisisble(page)){
               return i;
            }
         }
      },

      _isPageStartVisisble: function(page){
         var top = -1;
         if (page.start.is(':visible')){
            if (this._options.view._getScrollWatcher().getScrollContainer()[0] == window) {
               top = page.start[0].getBoundingClientRect().bottom;
            } else {
               top = page.start.offset().top + page.start.outerHeight(true);
            }
         }
         return top >= 0;
      },

   });

   return ViewportController;

});