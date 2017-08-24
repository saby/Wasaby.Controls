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
         _more: null,
         constructor: function(cfg) {
            this._options = cfg;
            if (cfg.page) {
               this._page = cfg.page
            }
         },

         prepareQueryParams: function(projection, direction) {

         },

         calculateState: function(list, display, direction) {
            var meta = list.getMetaData();
            if (this._options.mode == 'withCommonCount') {
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
         },

         hasMoreData: function(direction) {

         }

      });

      return PageNavigation;
   });
