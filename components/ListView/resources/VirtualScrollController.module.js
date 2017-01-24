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
      },

      init: function(){
         var view = this._options.view;
         VirtualScrollController.superclass.init.call(this);
         //this._options.viewportController.subscribe('onVirtualPageChange', this._onVirtualPageChange.bind(this));

         this._topWrapper = $('.controls-ListView__virtualScrollTop', view.getContainer());
         this._bottomWrapper = $('.controls-ListView__virtualScrollBottom', view.getContainer());

         view._getScrollWatcher().subscribe('onScroll', this._scrollHandler.bind(this));
      },

      _scrollHandler: function(e, scrollTop){
         var page = this._getPage();
         if (page >= 0 && this._currentVirtualPage!= page) {
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
            pageToDetach = pageNumber - 5,
            pageToAttach = pageNumber - 4,
            pages = this._virtualPages,
            hashes, pageStart;
         console.log('page', pageNumber);
         if (pageToDetach >= 0 && !this._topDetachedPages[pageToDetach]){
            var toDetach = [];
            pageStart = pageToDetach * BATCH_SIZE;

            this._topWrapper.height(pages[pageToDetach + 1]);
            //TODO: Это должно перехать во view, тут только стрелять событием 
            for (var i = pageStart; i < pageStart + BATCH_SIZE; i++){
               toDetach.push(view._getItemsProjection().at(i));
            }
            view._removeItems(toDetach);
            /***************************************************************/

            console.log('removed ', pageToDetach);
            this._topDetachedPages[pageToDetach] = true;
         } else {
            if (this._topDetachedPages[pageToAttach]){
               var toAttach = [];
               pageStart = pageToAttach * BATCH_SIZE;
               console.log('attach', pageToAttach);
               
               this._topWrapper.height(pages[pageToAttach])
               //TODO: Это должно перехать во view, тут только стрелять событием 
               for (var i = pageStart; i < pageStart + BATCH_SIZE; i++){
                  toAttach.push(view._getItemsProjection().at(i));
               }
               view._addItems(toAttach, 0);
               /***************************************************************/

               this._topDetachedPages[pageToAttach] = false;
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
            pageOffset = 0,
            lastPageStart = 0,
            self = this,
            //Учитываем все что есть в itemsContainer (группировка и тд)
            listItems = $('> *', view._getItemsContainer()).filter(':visible'),
            count = 0;

         lastPageStart = (this._virtualPages.length - 1) * BATCH_SIZE;
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