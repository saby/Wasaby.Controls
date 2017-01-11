define('js!SBIS3.CONTROLS.ViewportController', 
   ['Core/Abstract', 'js!SBIS3.StickyHeaderManager'], 
   function(cAbstract, StickyHeaderManager) {

   var ViewportController = cAbstract.extend({
      $protected: {
         _options: {
            view: null,
         },
         _scrollPages: [],
         _pageOffset: 0, // offset последней страницы
         _currentScrollPage: 1,
         _windowResizeTimeout: null,
      },

      init: function(){
         ViewportController.superclass.init.call(this);
         this._options.view._scrollWatcher.subscribe('onScroll', function(e, scrollTop){
            var page = this.getScrollPage();
               newKey = page + 1;
            if (page >= 0 && this._currentScrollPage != newKey) {
               this._currentScrollPage = newKey;
               this._notify('onScrollPageChange', page);
            }
         }.bind(this));
      },

      getScrollPages: function(){
         return this._scrollPages;
      },

      updateScrollPages: function(reset){
         var view = this._options.view, 
            viewportHeight = $(view._scrollWatcher.getScrollContainer()).height(),
            pageHeight = 0,
            lastPageStart = 0,
            self = this,
            //Учитываем все что есть в itemsContainer (группировка и тд)
            listItems = $('> *', view._getItemsContainer()).filter(':visible'),
            stickyHeaderHeight = StickyHeaderManager.getStickyHeaderHeight(view.getContainer()) || 0,
            elements = $([]);

         // Нужно учитывать отступ от родителя, что бы правильно скроллить к странице
         if (!this._offsetTop){
            this._offsetTop = view._getItemsContainer().get(0).getBoundingClientRect().top;
         }

         //Сбрасываем все для пересчета
         if (reset){
            this._scrollPages = [];
            self._pageOffset = 0;
         }
         //Берем последнюю посчитаную страницу, если она есть
         if (this._scrollPages.length){
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
               nextHeight = $this.next('.controls-ListView__item').outerHeight(true);
            pageHeight += $this.outerHeight(true);
            elements.push(this);
            // Если набралось записей на выстору viewport'a добавим еще страницу
            // При этом нужно учесть отступ сверху от view и фиксированую шапку
            var offsetTop = self._scrollPages.length == 1 ? self._offsetTop : stickyHeaderHeight;
            if (pageHeight + nextHeight > viewportHeight - offsetTop) {
               self._pageOffset += pageHeight;
               self._scrollPages.push({
                  start: $this,
                  offset: self._pageOffset - stickyHeaderHeight,
                  elements: elements
               });
               self._scrollPages[self._scrollPages.length - 2].elements = elements;
               elements = $([]);
               pageHeight = 0;
            }
         });
      },

      scrollToPage: function(pageNumber){
         var view = this._options.view,
            page = this._scrollPages[pageNumber];
         if (pageNumber != this._currentScrollPage && this._scrollPages.length){
            var page = this._scrollPages[pageNumber - 1];
            if (page){
               var offset = page.offset ? this._offsetTop : 0;
               view._scrollWatcher.scrollTo(page.offset + offset);
            }
            this._currentScrollPage = pageNumber;
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