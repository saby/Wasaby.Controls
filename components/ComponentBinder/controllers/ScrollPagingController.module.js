define('js!SBIS3.CONTROLS.ScrollPagingController', 
   [
      'js!SBIS3.StickyHeaderManager',
      'Core/Abstract',
      'Core/core-instance',
      'Core/WindowManager',
      'Core/helpers/Function/throttle',
      'css!SBIS3.CONTROLS.ScrollPagingController'
   ],
   function(StickyHeaderManager, cAbstract, cInstance, WindowManager, throttle) {

   var SCROLL_THROTTLE_DELAY = 200;
   
   var ScrollPagingController = cAbstract.extend({
      $protected: {
         _options: {
            view: null,
            zIndex: null
         },
         _scrollPages: [], // Набор страниц для скролл-пэйджина
         _pageOffset: 0, // offset последней страницы
         _currentScrollPage: 0,
         _windowResizeTimeout: null,
         _zIndex: null
      },

      init: function() {
         ScrollPagingController.superclass.init.apply(this, arguments);
         this._options.paging.getContainer().css('z-index', this._options.zIndex || WindowManager.acquireZIndex());
         this._options.paging._zIndex = this._options.zIndex;
         //Говорим, что элемент видимый, чтобы WindowManager учитывал его при нахождении максимального zIndex
         WindowManager.setVisible(this._options.zIndex);
         // отступ viewport от верха страницы
         this._containerOffset = this._getViewportOffset();
         this._scrollHandler = throttle.call(this, this._scrollHandler.bind(this), SCROLL_THROTTLE_DELAY, true);
      },

      _getViewportOffset: function(){
         var viewport = this._options.view._getScrollWatcher().getScrollContainer();
         if (viewport[0] == window) {
            return 0;
         } else {
            return viewport.offset().top;
         }
      },

      bindScrollPaging: function(paging) {
         var view = this._options.view,
             isTree = cInstance.instanceOfMixin(view, 'SBIS3.CONTROLS.TreeMixin');
        
         paging = paging || this._options.paging;

         if (isTree){
            view.subscribe('onSetRoot', this._changeRootHandler.bind(this));

            view.subscribe('onNodeExpand', function(){
               this.updateScrollPages(true);
            }.bind(this));
         }

         paging.subscribe('onFirstPageSet', this._scrollToFirstPage.bind(this));

         paging.subscribe('onLastPageSet', this._scrollToLastPage.bind(this))
               .subscribe('onSelectedItemChange', this._pagingSelectedChange.bind(this));

         view._getScrollWatcher().subscribe('onScroll', this._scrollHandler);

         $(window).on('resize.wsScrollPaging', this._resizeHandler.bind(this));
      },

      _changeRootHandler: function(){
         var curRoot = this._options.view.getCurrentRoot();
         this._options.paging.setSelectedKey(0);
         this._options.paging.setPagesCount(0);
         this._currentScrollPage = 0;
         this.updateScrollPages(true);         
      },

      _scrollHandler: function(event, scrollTop) {
         var pageNumber = this._calculateScrollPage(scrollTop);
         var paging = this._options.paging;
         if (pageNumber >= 0 && paging.getItems() && this._currentScrollPage != pageNumber) {
            if (pageNumber > paging.getPagesCount()) {
               paging.setPagesCount(pageNumber);
            }
            this._currentScrollPage = pageNumber;
            paging.setSelectedKey(pageNumber + 1);
         }
      },

      _pagingSelectedChange: function(e, key, index){
         if (index != this._currentScrollPage && this._scrollPages.length){
            var view = this._options.view,
               page = this._scrollPages[index];
            if (page){
               this._scrollToPage(page);
            }
         }
      },

      _scrollToPage: function(page){
         // Если первая страница - проскролим к самому верху, не считая оффсет
         var offset = page.offset ? this._offsetTop : 0;
         var view = this._options.view;
         view._getScrollWatcher().scrollTo(page.offset + offset);
      },

      _scrollToLastPage: function(){
         this._options.view.setPage(-1);
      },

      _scrollToFirstPage: function(){
         this._options.view.setPage(0);
      },

      _isPageStartVisisble: function(page){
         var top;
         if (page.element.parents('html').length === 0) {
            return false;
         }

         if (this._options.view._getScrollWatcher().getScrollContainer()[0] == window) {
            top = page.element[0].getBoundingClientRect().bottom;
         } else {
            top = page.element.offset().top + page.element.outerHeight(true) - this._containerOffset;
         }
         return top >= 0;
      },

      _resizeHandler: function(){
         var windowHeight = $(window).height();
         clearTimeout(this._windowResizeTimeout);
         if (this._windowHeight != windowHeight){
            this._windowHeight = windowHeight;
            this._windowResizeTimeout = setTimeout(function(){
               this.updateScrollPages(true);
            }.bind(this), 200);
         }
      },

      _calculateScrollPage: function(scrollTop){
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

      getScrollPage: function(){
         return this._scrollPages[this._currentScrollPage];
      },

      updateScrollPages: function(reset){
         var view = this._options.view,
            viewport = $(view._scrollWatcher.getScrollContainer()),
            viewportHeight = viewport.height(),
            pageOffset = 0,
            lastPageStart = 0,
            self = this,
            /* Находим все строки в списке */
            listItems = view._getItemsContainer().find('> *').filter(function() {
               /* Отфильтровывем скрытые строки,
                  и строки которые будут вырезаться и перемещаться в прилипающую шапку,
                  т.к. по ним нельзя корректно посчитать положение. */
               return !$(this).hasClass('ws-hidden') &&
                      !$(this).hasClass('ws-sticky-header__table-sticky-row');
            }),
            stickyHeaderHeight = StickyHeaderManager.getStickyHeaderHeight(view.getContainer()) || 0;

         //Если элементов в верстке то нечего и считать
         if (!listItems.length){
            this._options.paging.setVisible(false);
            return;
         }

         // Нужно учитывать отступ от родителя, что бы правильно скроллить к странице
         if (this._offsetTop === undefined){
            var viewTop = view.getContainer().get(0).getBoundingClientRect().top,
               viewportTop = viewport[0] == window ? 0 : viewport.get(0).getBoundingClientRect().top;
            this._offsetTop = viewTop - viewportTop;
         }
         //Cбрасываем все для пересчета
         if (reset){
            this._scrollPages = [];
            self._pageOffset = 0;
         }

         //Берем последнюю посчитаную страницу, если она есть
         if (this._scrollPages.length){
            lastPageStart = this._scrollPages[this._scrollPages.length - 1].element.index();
         } else {
            //Запушим первый элемент, если он есть
            var element = listItems.eq(0);
            if (view.getItems() && view.getItems().getCount() && element.length){
               this._scrollPages.push({
                  element: element,
                  offset: self._pageOffset
               });
            }
         }

         var topWrapperHeight = $('.controls-ListView__virtualScrollTop', view.getContainer()).height() || 0;

         //Считаем оффсеты страниц начиная с последней (если ее нет - сначала)
         listItems.slice(lastPageStart ? lastPageStart + 1 : 0).each(function(){
            var $this = $(this),
               $next = $this.next('.controls-ListView__item'),
               // Считаем через position, так как для плитки не подходит сложение высот
               curBottom = Math.floor($this.position().top) + $this.outerHeight(true) + topWrapperHeight,
               nextBottom = $next[0] ? Math.floor($next.position().top) + $next.outerHeight(true) : 0 + topWrapperHeight;
            curBottom = curBottom > pageOffset ? curBottom : pageOffset;
            nextBottom = nextBottom > curBottom ? nextBottom : curBottom;
            pageOffset = curBottom;
            // Если набралось записей на выстору viewport'a добавим еще страницу
            // При этом нужно учесть отступ сверху от view и фиксированую шапку
            var offsetTop = self._scrollPages.length == 1 ? self._offsetTop : 0;
            var prevPageOffset = self._scrollPages.length ? self._scrollPages[self._scrollPages.length - 1].offset : 0;
            if (nextBottom - prevPageOffset > viewportHeight - offsetTop) {
               self._pageOffset = pageOffset;
               self._scrollPages.push({
                  element: $this,
                  offset: self._pageOffset - stickyHeaderHeight
               });
            }
         });
         
         var pagesCount = this._scrollPages.length;
         var pagingVisibility = pagesCount > 1 && view._getOption('infiniteScroll') !== 'up';
   
         /* Если пэйджинг скрыт - паддинг не нужен */
         view.getContainer().toggleClass('controls-ScrollPaging__pagesPadding', pagingVisibility);
         if (this._options.paging.getSelectedKey() > pagesCount){
            this._options.paging.setSelectedKey(pagesCount);
         }
   
         /* Для пэйджинга считаем, что кол-во страниц это:
          текущее кол-во загруженных страниц + 1, если в метаинформации рекордсета есть данные о том, что на бл есть ещё записи.
          Необходимо для того, чтобы в пэйджинге не моргала кнопка перехода к следующей странице, пока грузятся данные. */
         this._options.paging.setPagesCount(pagesCount + (view._hasNextPage(view.getItems().getMetaData().more) ? 1 : 0));

         //Если есть страницы - покажем paging
         
         this._options.paging.setVisible(pagingVisibility && !this._options.hiddenPager);
      },

      destroy: function(){
         this._options.view._getScrollWatcher().unsubscribe('onScroll', this._scrollHandler);
         clearTimeout(this._windowResizeTimeout);
         $(window).off('resize.wsScrollPaging');
         WindowManager.releaseZIndex(this._options.zIndex);
         ScrollPagingController.superclass.destroy.apply(this, arguments);
      }

   });

   return ScrollPagingController;

});