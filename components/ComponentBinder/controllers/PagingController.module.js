define('js!SBIS3.CONTROLS.PagingController', ["Core/Abstract"], function(cAbstract) {

   var PagingController = cAbstract.extend({
      $protected: {
         _options: {
            view: null,
            paging: null
         }
      },

      bindPaging: function(paging) {
         var view = this._options.view,
            self = this;
         paging = paging || this._options.paging;

         paging.subscribe('onSelectedItemChange', function(e, key) {
            var newPage, curPage;
            if (key > 0) {
               newPage = key - 1;
               curPage = view.getPage();
               if (curPage != newPage) {
                  view.setPage(newPage);
               }
            }
         });

         view.subscribe('onPageChange', function(e, page) {
            var newKey, curKey;
            if (page >= 0) {
               newKey = page + 1;
               curKey = parseInt(paging.getSelectedKey(), 10);
               if (curKey != newKey) {
                  paging.setSelectedKey(newKey);
               }
            }
         });

         view.subscribe('onDataLoad', function(e, list) {
            if ((paging.getMode() == 'part')) {
               var meta = list.getMetaData && list.getMetaData().more;
               if (meta && (paging.getSelectedKey() == paging.getItems().getCount()) && view._hasNextPage(meta)) {
                  paging.setPagesCount(paging.getPagesCount() + 1);
               }
            }
         })
      }

   });

   return PagingController;

});