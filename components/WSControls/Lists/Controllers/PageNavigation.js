define('js!WSControls/Lists/Controllers/PageNavigation',
   ['Core/Abstract'],
   function (Abstract) {
      /**
       *
       * @author Крайнов Дмитрий
       * @public
       */
      var PageNavigation = Abstract.extend({
         _page: 0,
         _nextPage: 1,
         _prevPage: 0,
         _more: null,
         constructor: function(cfg) {
            this._options = cfg;
            if (cfg.page) {
               this._page = cfg.page || 0;
               this._nextPage = this._page + 1;
            }
         },

         prepareQueryParams: function(projection, direction) {
            var addParams = {}, neededPage;
            if (direction == 'down') {
               neededPage = this._nextPage;
            }
            else if (direction == 'up') {
               neededPage = this._prevPage;
            }
            else {
               neededPage = this._page;
            }
            if (this._options.pageSize) {
               addParams.offset = neededPage * this._options.pageSize;
               addParams.limit = this._options.pageSize;
            }
            return addParams;
         },

         calculateState: function(list, display, direction) {
            var meta = list.getMetaData();
            if (this._options.mode == 'withTotalCount') {
               if (typeof meta.more == 'number') {
                  this._more = meta.more;
               }
               else {
                  throw new Error('"more" Parameter has incorrect type. Must be numeric')
               }
            }
            else {
               if (typeof meta.more == 'number') {
                  this._more = meta.more;
               }
               else {
                  throw new Error('"more" Parameter has incorrect type. Must be numeric')
               }
            }
            if (direction == 'down') {
               this._nextPage++;
            }
            else if (direction == 'up') {

            }
            else {
               this._nextPage = this._page + 1;
            }
         },

         hasMoreData: function(direction) {

         }

      });

      return PageNavigation;
   });
