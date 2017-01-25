define('js!SBIS3.CONTROLS.VirtualScrollController', 
   ['Core/Abstract'], 
   function(cAbstract) {

   var BATCH_SIZE = 20;

   var VirtualScrollController = cAbstract.extend({
      $protected: {
         _options: {
            view: null,
         },
         _virtualPages: [0],
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
            var page = this._virtualPages[i];
            if (page > scrollTop){
               return i;
            }
         }
      },

      _onVirtualPageChange: function(pageNumber) {
         var 
            view = this._options.view,
            pageToDetachTop = pageNumber - 5,
            pageToAttachTop = pageNumber - 4,
            pageToDetachBottom = pageNumber + 4,
            pageToAttachBottom = pageNumber + 5,
            pages = this._virtualPages,
            hashes, pageStart;
         console.log('page', pageNumber);
         if (this._scrollingDown){
            /*------------------------Удаляем записи сверху--------------------*/
            var toDetach = [], 
               dettached = false;
            for (var i = 0; i < pageToDetachTop; i++) {
               if (!this._topDetachedPages[i]){
                  pageStart = i * BATCH_SIZE;

                  //TODO: Это должно перехать во view, тут только стрелять событием с массивом индексов
                  for (var j = pageStart; j < pageStart + BATCH_SIZE; j++){
                     toDetach.push(view._getItemsProjection().at(j));
                  }
               }
               this._topDetachedPages[i] = true;
               dettached = true;
            }
            if (dettached) {
               console.log('removed top', pageToDetachTop);
               this._topWrapper.height(pages[pageToDetachTop + 1]);
               view._removeItems(toDetach);
            }
            /*------------------------Добавляем записи снизу--------------------*/
            var toAttach = [],
               attached = false;
            for (var i = 0; i < pageToAttachBottom; i++) {
               if (this._bottomDetachedPages[i]){
                  pageStart = i * BATCH_SIZE;
                    
                  //TODO: Это должно перехать во view, тут только стрелять событием с массивом индексов
                  for (var j = pageStart; j < pageStart + BATCH_SIZE; j++){
                     toAttach.push(view._getItemsProjection().at(j));
                  }
                  /***************************************************************/

                  this._bottomDetachedPages[i] = false;
                  attached = true;
               }
            }
            if (attached) {
               console.log('attached bottom', pageToAttachBottom);
               this._bottomWrapper.height(pages[pageToAttachBottom + 1] ? this._bottomWrapper.height() - (pages[pageToAttachBottom + 1] - pages[pageToAttachBottom]) : 0);
               view._addItems(toAttach, (pageToAttachBottom - 2) * BATCH_SIZE);
            }

         } else {
            /*------------------------Добавляем записи сверху--------------------*/
            var toAttach = [], 
               attached = false;
            for (var i = pageToAttachTop; i < this._topDetachedPages.length; i++) {
               if (this._topDetachedPages[i]){
                  pageStart = i * BATCH_SIZE;
                    
                  //TODO: Это должно перехать во view, тут только стрелять событием с массивом индексов
                  for (var j = pageStart; j < pageStart + BATCH_SIZE; j++){
                     toAttach.push(view._getItemsProjection().at(j));
                  }

                  this._topDetachedPages[i] = false;
                  attached = true;
               }
            }
            if (attached) {
               console.log('attached top', pageToAttachTop);
               this._topWrapper.height(pages[pageToAttachTop] ? pages[pageToAttachTop] : 0);
               view._addItems(toAttach, 0);
            }
            /*------------------------Удаляем записи снизу--------------------*/
            var toDetach = [], 
                  dettached = false;
            // почему -1 ???
            for (var i = pageToDetachBottom; i < pages.length - 1; i++) {
               if (!this._bottomDetachedPages[i]){
                  pageStart = i * BATCH_SIZE;

                  //TODO: Это должно перехать во view, тут только стрелять событием с массивом индексов
                  for (var j = pageStart; j < pageStart + BATCH_SIZE; j++){
                     toDetach.push(view._getItemsProjection().at(j));
                  }
               }
               this._bottomDetachedPages[i] = true;
               dettached = true;
            }
            if (dettached) {
               console.log('removed bottom', pageToDetachBottom);
               this._bottomWrapper.height(this._bottomWrapper.height() + (pages[pageToDetachBottom + 1] - pages[pageToDetachBottom]));
               view._removeItems(toDetach);
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

      /*
       * Пересчет страниц для VirtualScroll
       */
      updateVirtualPages: function(){
         var view = this._options.view,
            detachedCount = this._topDetachedPages.filter(function(e){ return e || false; }).length,
            pageOffset = 0,
            self = this,
            //Учитываем все что есть в itemsContainer (группировка и тд)
            listItems = $('> *', view._getItemsContainer()).filter(':visible'),
            count = 0;

         var lastPageStart = (this._virtualPages.length - detachedCount - 1) * BATCH_SIZE;
         //Считаем оффсеты страниц начиная с последней (если ее нет - сначала)
         listItems.slice(lastPageStart).each(function(){
            // Если набралось записей на выстору viewport'a добавим еще страницу
            // При этом нужно учесть отступ сверху от view и фиксированую шапку
            if (++count == BATCH_SIZE) {
               self._pageOffset = self._getElementOffsetBottom(this);
               self._virtualPages.push(self._pageOffset);
               count = 0;
            }
         });
      },

   });

   return VirtualScrollController;

});