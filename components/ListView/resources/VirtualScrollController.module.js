define('js!SBIS3.CONTROLS.VirtualScrollController', 
   ['Core/Abstract'], 
   function(cAbstract) {

   var VirtualScrollController = cAbstract.extend({
      $protected: {
         _options: {
            view: null,
            viewportController: null
         },
         _topDetachedItems: {},
         _bottomDetachedItems: [],
         _topWrapper: null,
         _bottomWrapper: null
      },

      init: function(){
         var view = this._options.view;
         VirtualScrollController.superclass.init.call(this);
         this._options.viewportController.subscribe('onScrollPageChange', this._onScrollPageChange.bind(this));

         this._topWrapper = $('.controls-ListView__virtualScrollTop', view.getContainer())
         this._bottomWrapper = $('.controls-ListView__virtualScrollBottom', view.getContainer())
      },

      _onScrollPageChange: function(event, pageNumber) {
         var 
            view = this._options.view,
            viewportController = this._options.viewportController,
            scrollPages = viewportController.getScrollPages(),
            pageToDetach = pageNumber - 3,
            pageToAttach = pageNumber - 2,
            detached;
         
         if (!this._topDetachedItems[pageToDetach] && pageNumber > 2){
            // strat removeing from 3rd page
            detached = scrollPages[pageToDetach].elements.detach();
            this._topDetachedItems[pageToDetach] = detached;
            this._topWrapper.height(scrollPages[pageToDetach + 1].offset)
         } else {
            if (this._topDetachedItems[pageToAttach]) {
               this._topDetachedItems[pageToAttach].prependTo(view._getItemsContainer());
               delete this._topDetachedItems[pageToAttach];
               this._topWrapper.height(scrollPages[pageToAttach].offset)
            }
         }
      }

   });

   return VirtualScrollController;

});