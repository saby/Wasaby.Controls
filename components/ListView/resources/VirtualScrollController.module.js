define('js!SBIS3.CONTROLS.VirtualScrollController', 
   ['Core/Abstract'], 
   function(cAbstract) {

   var VirtualScrollController = cAbstract.extend({
      $protected: {
         _options: {
            view: null,
            viewportController: null,
         },
         _threshold: 100,
         _batchSize: 20,
         _topIndex: 0,
         _bottomIndex: null,
         _topWrapper: null,
         _bottomWrapper: null
      },

      init: function(){
         var view = this._options.view;
         VirtualScrollController.superclass.init.call(this);
         /*this._options.viewportController.subscribe('onScrollPageChange', this._onScrollPageChange.bind(this));

         this._topWrapper = $('.controls-ListView__virtualScrollTop', view.getContainer());
         this._bottomWrapper = $('.controls-ListView__virtualScrollBottom', view.getContainer());*/
         view.subscribe('onDataLoad', function(event, items){
            this._bottomIndex = items.getCount();
         }.bind(this));

         view.subscribe('onDataMerge', function(event, items){
            this._bottomIndex += items.getCount();
         }.bind(this));

         this._options.viewportController.subscribe('onVirtualPageChange', this._onVirtualPageChange.bind(this));
      },

      _onScrollPageChange: function(event, pageNumber) {
         var 
            view = this._options.view,
            viewportController = this._options.viewportController,
            scrollPages = viewportController.getScrollPages(),
            // strat removing from 3rd page
            pageToDetach = pageNumber - 3,
            pageToAttach = pageNumber - 2,
            hashes;
            
      }

   });

   return VirtualScrollController;

});