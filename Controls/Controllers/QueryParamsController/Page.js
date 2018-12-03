define('Controls/Controllers/QueryParamsController/Page',
   ['Core/core-simpleExtend', 'WS.Data/Source/SbisService'],
   function(cExtend, SbisService) {
      /**
       *
       * @author Крайнов Дмитрий
       * @public
       */
      var PageNavigation = cExtend.extend({
         _nextPage: 1,
         _prevPage: -1,
         _more: null,
         _page: 0,
         constructor: function(cfg) {
            this._options = cfg;
            PageNavigation.superclass.constructor.apply(this, arguments);
            this._page = cfg.page || 0;
            if (this._page !== undefined) {
               this._prevPage = this._page - 1;
               this._nextPage = this._page + 1;
            }
            if (!this._options.pageSize) {
               throw new Error('Option pageSize is undefined in PageNavigation');
            }
         },

         prepareQueryParams: function(direction) {
            var addParams = {}, neededPage;
            if (direction == 'down') {
               neededPage = this._nextPage;
            } else if (direction == 'up') {
               neededPage = this._prevPage;
            } else {
               neededPage = this._page;
            }

            addParams.offset = neededPage * this._options.pageSize;
            addParams.limit = this._options.pageSize;

            return addParams;
         },

         calculateState: function(list, direction) {
            var meta = list.getMetaData();
            if (this._options.mode == 'totalCount') {
               if (typeof meta.more != 'number') {
                  throw new Error('"more" Parameter has incorrect type. Must be numeric');
               }
            } else {
               if (typeof meta.more != 'boolean') {
                  throw new Error('"more" Parameter has incorrect type. Must be boolean');
               }
            }
            this._more = meta.more;

            if (direction == 'down') {
               this._nextPage++;
            } else if (direction == 'up') {
               this._prevPage--;
            } else {
               //Если направление не указано, значит это расчет параметров после начальной загрузки списка или после перезагрузки
               this._nextPage = this._page + 1;
               this._prevPage = this._page - 1;
            }
         },

         getAllDataCount: function() {
            return this._more;
         },

         getLoadedDataCount: function() {
            return this._nextPage * this._options.pageSize;
         },

         hasMoreData: function(direction) {
            if (direction == 'down') {
               if (this._options.mode == 'totalCount') {
                  //в таком случае в more приходит общее число записей в списке
                  //значит умножим номер след. страницы на число записей на одной странице и сравним с общим
                  return this.getLoadedDataCount() < this.getAllDataCount();
               } else {
                  return this._more;
               }
            } else if (direction == 'up') {
               return this._prevPage >= 0;
            } else {
               throw new Error('Parameter direction is not defined in hasMoreData call');
            }
         },

         prepareSource: function(source) {
            var options = source.getOptions();
            options.navigationType = SbisService.prototype.NAVIGATION_TYPE.PAGE;
            source.setOptions(options);
         },

         setEdgeState: function(direction) {
            if (direction == 'up') {
               this._page = 0;
            } else if (direction == 'down') {
               if (typeof this._more == 'number') {
                  this._page = this._more / this._options.pageSize - 1;
               } else {
                  this._page = -1;
               }
            } else {
               throw new Error('Wrong argument Direction in NavigationController::setEdgeState');
            }
         },

         destroy: function() {
            this._options = null;
         }
      });

      return PageNavigation;
   });

