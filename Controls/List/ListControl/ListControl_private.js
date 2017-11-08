/**
 * Created by kraynovdo on 08.11.2017.
 */
define('js!Controls/List/ListControl/ListControl_private', [
   'js!Controls/List/resources/utils/DataSourceUtil',
   'Core/helpers/functional-helpers',
   'js!Controls/List/Controllers/PageNavigation'
], function(DataSourceUtil, fHelpers, PageNavigation){
   var _private = {
      initNavigation: function(options, dataSource) {
         if (options.navigation && options.navigation.type == 'page') {
            this._navigationController = new PageNavigation(options.navigation.config);
            this._navigationController.prepareSource(dataSource);
         }
      },

      prepareQueryParams: function(direction) {
         var params = {
            filter: this._filter,
            sorting: this._sorting,
            limit: undefined,
            offset: undefined
         };

         if (this._navigationController) {
            var addParams = this._navigationController.prepareQueryParams(this._display, direction);
            params.limit = addParams.limit;
            params.offset = addParams.offset;
            //TODO фильтр и сортировка не забыть приделать
         }
         return params;
      },

      reload: function(options) {
         if (this._dataSource) {
            var
               def,
               self = this;

            var queryParams = _private.prepareQueryParams.call(this);

            var userParams = this._notify('onBeforeDataLoad', queryParams.filter, queryParams.sorting, queryParams.offset, queryParams.limit);
            if (userParams) {
               queryParams.filter = userParams['filter'] || queryParams.filter;
               queryParams.sorting = userParams['sorting'] || queryParams.sorting;
               queryParams.offset = userParams['offset'] || queryParams.offset;
               queryParams.limit = userParams['limit'] || queryParams.limit;
            }
            //TODO решить с параметрами
            def = DataSourceUtil.callQuery(this._dataSource, this._options.idProperty, queryParams.filter, queryParams.sorting, queryParams.offset, queryParams.limit)
               .addCallback(fHelpers.forAliveOnly(function (list) {
                  self._notify('onDataLoad', list);
                  _private.onDSReload.call(this, list, options);
                  return list;
               }, self))
               .addErrback(fHelpers.forAliveOnly(this._loadErrorProcess, self));
            this._loader = def;
         }
         else {
            throw new Error('Option dataSource is undefined. Can\'t reload view');
         }
      },

      loadPage: function(direction) {
         var def, self = this;
         if (this._dataSource) {
            var queryParams = _private.prepareQueryParams.call(this, direction);
            def = DataSourceUtil.callQuery(this._dataSource, this._options.idProperty, queryParams.filter, queryParams.sorting, queryParams.offset, queryParams.limit)
               .addCallback(fHelpers.forAliveOnly(function (list) {
                  self._notify('onDataLoad', list, direction);
                  _private.onLoadPage.call(this, list, direction);
                  return list;
               }, self))
               .addErrback(fHelpers.forAliveOnly(this._loadErrorProcess, self));
            this._loader = def;
         }
         else {
            throw new Error('Option dataSource is undefined. Can\'t load page');
         }
      },

      onLoadPage: function(list, direction) {
         if (direction == 'down') {
            this._items.append(list);
         } else if (direction == 'up') {
            this._items.prepend(list);
         }
         if (this._navigationController) {
            this._navigationController.calculateState(list, direction);
         }
      },

      onDSReload: function(list, options) {
         if (
            this._items && cInstance.instanceOfModule(this._items, 'WS.Data/Collection/RecordSet')
            && (list.getModel() === this._items.getModel())
            && (Object.getPrototypeOf(list).constructor == Object.getPrototypeOf(list).constructor)
            && (Object.getPrototypeOf(list.getAdapter()).constructor == Object.getPrototypeOf(this._items.getAdapter()).constructor)
            ) {
            this._items.setMetaData(list.getMetaData());
            this._items.assign(list);
         } else {
            this._items = list;
         }
         if (this._navigationController) {
            this._navigationController.calculateState(list)
         }

         return list;
      }
   };
   return _private;
});