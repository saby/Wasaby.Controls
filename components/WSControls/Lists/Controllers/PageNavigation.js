define('js!WSControls/Lists/Controllers/PageNavigation',
   ['Core/Abstract', 'js!WSControls/Lists/Controllers/INavigation'],
   function (Abstract, INavigation) {
      /**
       *
       * @author Крайнов Дмитрий
       * @public
       */
      var PageNavigation = Abstract.extend([INavigation], {
         _nextPage: 1,
         _prevPage: -1,
         _more: null,
         constructor: function(cfg) {
            this._options = cfg;
            if (cfg.page !== undefined) {
               this._options.page = cfg.page || 0;
               this._prevPage = this._options.page - 1;
               this._nextPage = this._options.page + 1;
            }
            if (!this._options.pageSize) {
               throw new Error ('Option pageSize is undefined in PageNavigation')
            }
         },

         prepareSource: function() {

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
               neededPage = this._options.page;
            }

            addParams.offset = neededPage * this._options.pageSize;
            addParams.limit = this._options.pageSize;

            return addParams;
         },

         calculateState: function(list, display, direction) {
            var meta = list.getMetaData();
            if (this._options.mode == 'totalCount') {
               if (typeof meta.more == 'number') {
                  this._more = meta.more;
               }
               else {
                  throw new Error('"more" Parameter has incorrect type. Must be numeric')
               }
            }
            else {
               if (typeof meta.more == 'boolean') {
                  this._more = meta.more;
               }
               else {
                  throw new Error('"more" Parameter has incorrect type. Must be boolean')
               }
            }
            if (direction == 'down') {
               this._nextPage++;
            }
            else if (direction == 'up') {
               this._nextPage--;
            }
            else {
               this._nextPage = this._options.page + 1;
            }
         },

         hasMoreData: function(direction) {
            if (direction == 'down') {
               if (this._options.mode == 'totalCount') {
                  //в таком случае в more приходит общее число записей в списке
                  //значит умножим номер след. страницы на число записей на одной странице и сравним с общим
                  return this._nextPage * this._options.pageSize < this._more;
               }
               else {
                  return this._more;
               }
            }
            else if (direction == 'up'){
               return this._prevPage >= 0;
            }
            else {
               throw new Error('Parameter direction is not defined in hasMoreData call')
            }
         }

      });

      return PageNavigation;
   });
