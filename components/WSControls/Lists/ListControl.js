define('js!WSControls/Lists/ListControl', [
   'Core/core-extend',
   'Core/Control',
   'tmpl!WSControls/Lists/ListControl',
   'js!WSControls/Lists/resources/utils/DataSourceUtil',
   'js!WSControls/Lists/Controllers/PageNavigation',
   'Core/helpers/functional-helpers',
   'WS.Data/Type/descriptor',
   'WS.Data/Source/ISource',
   'Core/core-instance'
], function (extend,
             Control,
             ListControlTpl,
             DataSourceUtil,
             PageNavigation,
             fHelpers,
             Types,
             ISource,
             cInstance
   ) {
   'use strict';

   var ListView = Control.extend(
      {
         _controlName: 'WSControls/Lists/ListControl',
         _template: ListControlTpl,
         iWantVDOM: true,
         _isActiveByClick: false,

         _items: null,

         _dataSource: null,
         _loader: null,

         //TODO пока спорные параметры
         _filter: undefined,
         _sorting: undefined,

         _itemTemplate: null,

         constructor: function (cfg) {
            ListView.superclass.constructor.apply(this, arguments);
            this._items = cfg.items;
            this._publish('onDataLoad');
         },

         __initNavigation: function(options, dataSource) {
            if (options.navigation && options.navigation.type == 'page') {
               this._navigationController = new PageNavigation(options.navigation.config);
               this._navigationController.prepareSource(dataSource);
            }
         },

         _beforeMount: function(newOptions) {
            this._filter = newOptions.filter;

            if (newOptions.dataSource) {
               this._dataSource = DataSourceUtil.prepareSource(newOptions.dataSource);
               this.__initNavigation(newOptions, this._dataSource);
               if (!this._items) {
                  this._reload(newOptions);
               }
            }
         },

         _beforeUpdate: function(newOptions) {
            if (newOptions.filter != this._options.filter) {
               this._filter = newOptions.filter;
            }

            if (newOptions.dataSource !== this._options.dataSource) {
               this._dataSource = DataSourceUtil.prepareSource(newOptions.dataSource);
               this.__initNavigation(newOptions, this._dataSource);
               this._reload(newOptions);
            }

            //TODO обработать смену фильтров и т.д. позвать релоад если надо
         },

         _prepareQueryParams: function(direction) {
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

         //<editor-fold desc='DataSourceMethods'>
         reload: function() {
            this._reload(this._options);
         },

         _reload: function(options) {
            if (this._dataSource) {
               var
                  def,
                  self = this;

               this._cancelLoading();

               var queryParams = this._prepareQueryParams();

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
                     this._onDSReload(list, options);
                     return list;
                  }, self))
                  .addErrback(fHelpers.forAliveOnly(this._loadErrorProcess, self));
               this._loader = def;
            }
            else {
               throw new Error('Option dataSource is undefined. Can\'t reload view');
            }
         },

         __loadPage: function(direction) {
            var def, self = this;
            if (this._dataSource) {
               var queryParams = this._prepareQueryParams(direction);
               def = DataSourceUtil.callQuery(this._dataSource, this._options.idProperty, queryParams.filter, queryParams.sorting, queryParams.offset, queryParams.limit)
                  .addCallback(fHelpers.forAliveOnly(function (list) {
                     self._notify('onDataLoad', list, direction);
                     this.__onLoadPage(list, direction);
                     return list;
                  }, self))
                  .addErrback(fHelpers.forAliveOnly(this._loadErrorProcess, self));
               this._loader = def;
            }
            else {
               throw new Error('Option dataSource is undefined. Can\'t load page');
            }
         },

         __onLoadPage: function(list, direction) {
            if (direction == 'down') {
               this._items.append(list);
            } else if (direction == 'up') {
               this._items.prepend(list);
            }
            if (this._navigationController) {
               this._navigationController.calculateState(list, direction);
            }
         },

         _isLoading: function(){
            return this._loader && !this._loader.isReady();
         },

         _cancelLoading: function () {
            if (this._isLoading()) {
               this._loader.cancel();
            }
            this._loader = null;
         },

         _toggleIndicator: function () {
            /*Must be implemented*/
         },
         _onDSReload: function(list, options) {
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

            this._toggleIndicator(false);
            return list;
         }

      });

   //TODO https://online.sbis.ru/opendoc.html?guid=17a240d1-b527-4bc1-b577-cf9edf3f6757
   /*ListView.getOptionTypes = function getOptionTypes(){
    return {
    dataSource: Types(ISource)
    }
    };*/

   return ListView;
});