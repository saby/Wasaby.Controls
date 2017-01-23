define('js!SBIS3.CONTROLS.ScrollPagingController', 
   ['Core/Abstract', 'Core/core-instance', 'Core/WindowManager'], 
   function(cAbstract, cInstance, WindowManager) {

   var ScrollPagingController = cAbstract.extend({
      $protected: {
         _options: {
            view: null,
            viewportController: null,
            paging: null
         },
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
         paging = paging || this._options.paging;
         var view = this._options.view,
            viewportController = this._options.viewportController,
            self = this,
            isTree = cInstance.instanceOfMixin(view, 'SBIS3.CONTROLS.TreeMixin');

         if (isTree){
            view.subscribe('onSetRoot', function(){
               var curRoot = view.getCurrentRoot();
               if (this._currentRoot !== curRoot){
                  this._options.paging.setPagesCount(0);
                  this.updateScrollPaging(true);
                  this._currentRoot = curRoot;
               }
            }.bind(this));

            view.subscribe('onNodeExpand', function(){
               this.updateScrollPaging(true);
            }.bind(this));
         }

         paging.subscribe('onLastPageSet', this._scrollToLastPage.bind(this));

         paging.subscribe('onSelectedItemChange', function(e, key, index){
            if (!this._pagesCountChanged) {
               viewportController.scrollToPage(key);
            }
         }.bind(this));

         viewportController.subscribe('onScrollPageChange', function(e, pageNumber){
            var paging = this._options.paging;
            if (paging.getItems()) {
               if (pageNumber > paging.getPagesCount()) {
                  paging.setPagesCount(pageNumber);
               }
               paging.setSelectedKey(pageNumber);
            }
         }.bind(this));

         $(window).on('resize.wsScrollPaging', this._resizeHandler.bind(this));
      },

      _scrollToLastPage: function(){
         this._options.view.setPage(-1);
      },

      _resizeHandler: function(){
         var windowHeight = $(window).height();
         clearTimeout(this._windowResizeTimeout);
         if (this._windowHeight != windowHeight){
            this._windowHeight = windowHeight;
            this._windowResizeTimeout = setTimeout(function(){
               if (this._options.viewportController.getScrollPages().length){
                  this.updateScrollPaging(true);
               }
            }.bind(this), 200);
         }
      },

      updateScrollPaging: function(reset){
         var view = this._options.view,
            paging = this._options.paging;

         this._options.viewportController.updateScrollPages(reset);

         var pagesCount = this._options.viewportController.getScrollPages().length;

         if (paging){
            if (pagesCount > 1){
               view.getContainer().css('padding-bottom', '32px');
            }
            if (paging.getSelectedKey() > pagesCount){
               paging.setSelectedKey(pagesCount - 1);
            }

            // После setPagesCount стеляет ненужный onSelectedItemChange, этот флаг для того, что бы его не обрабатывать
            this._pagesCountChanged = true;
            paging.setPagesCount(pagesCount);
            this._pagesCountChanged = false;
            //Если есть страницы - покажем paging
            paging.setVisible(pagesCount > 1);
         }
      },

      destroy: function(){
         $(window).off('resize.wsScrollPaging');
         WindowManager.releaseZIndex(this._zIndex);
         ScrollPagingController.superclass.destroy.apply(this, arguments);
      }

   });

   return ScrollPagingController;

});