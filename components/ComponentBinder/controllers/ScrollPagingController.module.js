define('js!SBIS3.CONTROLS.ScrollPagingController', 
   ['js!SBIS3.StickyHeaderManager', 'Core/Abstract', 'Core/core-instance', 'Core/WindowManager'], 
   function(StickyHeaderManager, cAbstract, cInstance, WindowManager) {

   var ScrollPagingController = cAbstract.extend({
      $protected: {
         _options: {
            view: null,
            paging: null
         },
         _scrollPages: [], // Набор страниц для скролл-пэйджина
         _pageOffset: 0, // offset последней страницы
         _currentScrollPage: 0,
         _windowResizeTimeout: null,
         _zIndex: null
      },

      init: function() {
         ScrollPagingController.superclass.init.apply(this, arguments);
         this._zIndex = WindowManager.acquireZIndex();
         this._options.paging.getContainer().css('z-index', this._zIndex);
         this._options.paging._zIndex = this._zIndex;
         //Говорим, что элемент видимый, чтобы WindowManager учитывал его при нахождении максимального zIndex
         WindowManager.setVisible(this._zIndex);
      },

      bindScrollPaging: function(paging) {
         var view = this._options.view, self = this;
         paging = paging || this._options.paging;
         var isTree = cInstance.instanceOfMixin(view, 'SBIS3.CONTROLS.TreeMixin');

         if (isTree){
            view.subscribe('onSetRoot', function(){
               var curRoot = view.getCurrentRoot();
               if (this._currentRoot !== curRoot){
                  this._options.paging.setPagesCount(0);
                  this.updateScrollPages(true);
                  this._currentRoot = curRoot;
               }
            }.bind(this));

            view.subscribe('onNodeExpand', function(){
               this.updateScrollPages(true);
            }.bind(this));
         }

         paging.subscribe('onLastPageSet', this._scrollToLastPage.bind(this));

         paging.subscribe('onSelectedItemChange', function(e, key, index){
            if (index != this._currentScrollPage && this._scrollPages.length){
               var view = this._options.view,
                  page = this._scrollPages[index];
               if (page){
                  this._scrollToPage(page);
               }
            }
         }.bind(this));

         view._getScrollWatcher().subscribe('onScroll', function(){
            var pageNumber = this.getScrollPage();
            var paging = this._options.paging;
            if (pageNumber >= 0 && paging.getItems() && this._currentScrollPage != pageNumber) {
               if (pageNumber > paging.getPagesCount()) {
                  paging.setPagesCount(pageNumber);
               }
               this._currentScrollPage = pageNumber;
               paging.setSelectedKey(pageNumber + 1);
            }
         }.bind(this));

         $(window).on('resize.wsScrollPaging', this._resizeHandler.bind(this));
      },

      _scrollToPage: function(page){
         // Если первая страница - проскролим к самому верху, не считая оффсет
         var offset = page.offset ? this._offsetTop : 0;
         view._scrollWatcher.scrollTo(page.offset + offset);
      },

      _scrollToLastPage: function(){
         this._options.view.setPage(-1);
      },

      _isPageStartVisisble: function(page){
         var top;
         if (this._options.view._getScrollWatcher().getScrollContainer()[0] == window) {
            top = page.element[0].getBoundingClientRect().bottom;
         } else {
            top = page.element.offset().top + page.element.outerHeight(true);
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

      getScrollPage: function(){
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

      updateScrollPages: function(reset){
         var view = this._options.view,
            viewport = $(view._scrollWatcher.getScrollContainer()),
            viewportHeight = viewport.height(),
            pageOffset = 0,
            lastPageStart = 0,
            self = this,
            //Учитываем все что есть в itemsContainer (группировка и тд)
            listItems = $('> *', view._getItemsContainer()).filter(':visible'),
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
         //Сбрасываем все для пересчета
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
         //Считаем оффсеты страниц начиная с последней (если ее нет - сначала)
         listItems.slice(lastPageStart ? lastPageStart + 1 : 0).each(function(){
            var $this = $(this),
               $next = $this.next('.controls-ListView__item'),
               // Считаем через position, так как для плитки не подходит сложение высот
               curBottom = $this.position().top + $this.outerHeight(true),
               nextBottom = $next[0] ? $next.position().top + $next.outerHeight(true) : 0;
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

         if (pagesCount > 1){
            this._options.view.getContainer().css('padding-bottom', '32px');
         }
         if (this._options.paging.getSelectedKey() > pagesCount){
            this._options.paging.setSelectedKey(pagesCount);
         }
         this._options.paging.setPagesCount(pagesCount);

         //Если есть страницы - покажем paging
         this._options.paging.setVisible(pagesCount > 1);
      },

      destroy: function(){
         $(window).off('resize.wsScrollPaging');
         WindowManager.releaseZIndex(this._zIndex);
         ScrollPagingController.superclass.destroy.apply(this, arguments);
      }

   });

   return ScrollPagingController;

});