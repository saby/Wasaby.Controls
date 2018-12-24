define('Controls/Container/List',
   [
      'Core/Control',
      'wml!Controls/Container/List/List',
      'WS.Data/Source/Memory',
      'Controls/Controllers/_SearchController',
      'Core/core-merge',
      'Core/helpers/Object/isEqual',
      'Controls/Container/Search/SearchContextField',
      'Controls/Container/Filter/FilterContextField',
      'Core/Deferred',
      'Core/core-instance'
   ],
   
   function(Control, template, Memory, SearchController, merge, isEqual, SearchContextField, FilterContextField, Deferred, cInstance) {
      
      'use strict';
      
      var SEARCH_CONTEXT_FIELD = 'searchLayoutField';
      var SEARCH_VALUE_FIELD = 'searchValue';
      var FILTER_CONTEXT_FIELD = 'filterLayoutField';
      var FILTER_VALUE_FIELD = 'filter';
      
      var _private = {
         getSearchController: function(self) {
            var options = self._options;
            
            if (!self._searchController) {
               self._searchController = new SearchController({
                  filter: merge({}, options.filter),
                  searchParam: options.searchParam,
                  minSearchLength: options.minSearchLength,
                  source: options.source,
                  navigation: options.navigation,
                  sorting: options.sorting,
                  searchDelay: options.searchDelay,
                  searchCallback: _private.searchCallback.bind(self, self),
                  searchErrback: _private.searchErrback.bind(self, self),
                  abortCallback: _private.abortCallback.bind(self, self)
               });
            }
            
            return self._searchController;
         },
         
         resolveOptions: function(self, options) {
            self._options = options;
            self._filter = options.filter;
            self._source = options.source;
            self._navigation = options.navigation;
         },
         
         cachedSourceFix: function(self) {
            /* Пока не cached source не используем навигацию и фильтрацию,
             просто отдаём данные в список, иначе memorySource данные не вернёт,
             т.к. фильтрация работает в нём только по полному совпадению */
            self._navigation = null;
            self._filter = {};
         },

         updateSource: function(self, data) {
            var source = _private.getOriginSource(self._options.source);
            
            /* TODO will be a cached source */
            _private.cachedSourceFix(self);
            self._source = new Memory({
               model: data.getModel(),
               idProperty: data.getIdProperty(),
               data: data.getRawData(),
               adapter: source.getAdapter()
            });
         },
         
         updateFilter: function(self, resultFilter) {
            /* Копируем объект, чтобы порвать ссылку и опция у списка изменилась*/
            var filterClone = merge({}, self._options.filter);
            self._filter = merge(filterClone, resultFilter);
            _private.getSearchController(self).setFilter(self._filter);
         },
         
         abortCallback: function(self, filter) {
            if (self._options.searchEndCallback) {
               self._options.searchEndCallback(null, filter);
            }
   
            if (!isEqual(filter, _private.getFilterFromContext(self, self._context))) {
               _private.updateFilter(self, filter);
            }
            self._searchMode = false;
            self._source = self._options.source;
            self._navigation = self._options.navigation;
            self._forceUpdate();
         },
   
         searchErrback: function(self, error) {
            var source = _private.getOriginSource(self._options.source);
            if (self._options.searchErrback) {
               self._options.searchErrback(error);
            }
            self._source = new Memory({
               model: source.getModel(),
               idProperty: source.getIdProperty()
            });
         },
         
         searchCallback: function(self, result, filter) {
            if (self._options.searchEndCallback) {

               /* FIXME
                  Когда отдаёшь memory источник с данными,
                  запрос искуственно делаем асинхронным в BaseControl, поэтому и список строится асинхронным. Но, т.к. в VDOM'е
                  асинхронное построение контролов сейчас работает с ошибками, тоже эмулирую асинхронность.
                  Правится по ошибке в плане Зуева https://online.sbis.ru/opendoc.html?guid=fb08b40e-f2ac-4dd2-9a84-dfbfc404da02 */
               Deferred.fromTimer(10).addCallback(function() {
                  self._options.searchEndCallback(result, filter);
               });
            }
   
            if (!isEqual(filter, _private.getFilterFromContext(self, self._context)) || !isEqual(filter, self._filter)) {
               _private.updateFilter(self, filter);
            }

            self._searchDeferred = new Deferred();
            _private.updateSource(self, result.data);
            self._searchDeferred.callback();
            self._forceUpdate();
         },
         
         searchValueChanged: function(self, value, filter) {
            var searchController = _private.getSearchController(self);
            
            if (self._options.searchStartCallback) {
               self._options.searchStartCallback();
            }
   
            _private.cancelSearchDeferred(self);
            
            if (filter) {
               searchController.setFilter(filter);
            }
            self._searchMode = true;
            self._searchValue = value;
            searchController.search(value);
         },
         
         cancelSearchDeferred: function(self) {
            if (self._searchDeferred && self._searchDeferred.isReady()) {
               self._searchDeferred.cancel();
               self._searchDeferred = null;
            }
         },
         
         getValueFromContext: function(context, contextField, valueField) {
            if (context && context[contextField]) {
               return context[contextField][valueField];
            } else {
               return null;
            }
         },
         
         isFilterChanged: function(self, context) {
            var oldValue = self._filter || this.getFilterFromContext(self, self._context),
               newValue = this.getFilterFromContext(self, context),
               changed = false;
            
            if (newValue) {
               if (self._searchMode) {
                  /* if search mode on, filter will be changed after search */
                  changed = !isEqual(_private.getSearchController(self).getFilter(), newValue);
               } else {
                  changed = !isEqual(oldValue, newValue);
               }
            }
            return changed;
         },
         
         isSearchValueChanged: function(self, context) {
            var oldValue = self._searchValue || this.getSearchValueFromContext(self, self._context),
               newValue = this.getSearchValueFromContext(self, context);
            return !isEqual(oldValue, newValue);
         },
         
         getFilterFromContext: function(self, context) {
            return this.getValueFromContext(context, FILTER_CONTEXT_FIELD, FILTER_VALUE_FIELD);
         },
         
         getSearchValueFromContext: function(self, context) {
            return this.getValueFromContext(context, SEARCH_CONTEXT_FIELD, SEARCH_VALUE_FIELD);
         },
         
         checkContextValues: function(self, context) {
            var filterChanged = this.isFilterChanged(self, context);
            var searchChanged = this.isSearchValueChanged(self, context);
            var searchValue = this.getSearchValueFromContext(self, context);
            var filterValue = this.getFilterFromContext(self, context);
            
            if (searchChanged && filterChanged) {
               this.searchValueChanged(self, searchValue, filterValue);
            } else if (searchChanged) {
               this.searchValueChanged(self, searchValue);
            } else if (filterChanged) {
               if (self._searchMode) {
                  this.searchValueChanged(self, searchValue, filterValue);
               } else {
                  this.updateFilter(self, filterValue);
               }
            }
         },
         
         destroySearchController: function(self) {
            if (self._searchController) {
               self._searchController.abort();
               self._searchController = null;
            }
         },
         
         getOriginSource: function(source) {
            //костыль до перевода Suggest'a на Search/Controller,
            //могут в качестве source передать prefetchSource, у которого нет методов getModel, getAdapter.
            //После этого этот модуль можно будет удалить.
            return cInstance.instanceOfModule(source, 'Data/_source/PrefetchProxy') ? source._$target : source;
         }
      };
      
      var List = Control.extend({
         
         _template: template,
         _searchDeferred: null,
         _searchMode: false,
         
         _beforeMount: function(options, context) {
            this._source = options.source;

            _private.resolveOptions(this, options);
            _private.checkContextValues(this, context);

            /***************************
               FIXME
               VDOM не умеет обрабатываеть ситуацию,
               когда в асинхронной фазе построения компонента может измеиться состояние родетельского компонента,
               вместо того, чтобы дождаться постоения дочернего компонента, он начинает создавать новый компонент.
               Ошибка выписна, в плане у Зуева https://online.sbis.ru/opendoc.html?guid=fb08b40e-f2ac-4dd2-9a84-dfbfc404da02 */
            //return this._searchDeferred;

            if (this._searchMode) {
               _private.cachedSourceFix(this);
               this._source = new Memory({
                  model: options.source.getModel(),
                  idProperty: options.source.getIdProperty()
               });
            }

            /***********************/

         },
         
         _beforeUpdate: function(newOptions, context) {
            if (this._options.source !== newOptions.source || !isEqual(this._options.navigation, newOptions.navigation) || this._options.searchDelay !== newOptions.searchDelay) {
               var currentFilter = this._searchController ? this._searchController.getFilter() : _private.getFilterFromContext(this, this._context);
               var source = this._source;
               
               _private.resolveOptions(this, newOptions);
               
               if (this._searchMode) {
                  _private.cachedSourceFix(this);
                  
                  /* back memory source if now searchMode is on. (Will used cached source by task https://online.sbis.ru/opendoc.html?guid=ab4d807e-9e1a-4a0a-b95b-f0c3f6250f63) */
                  this._source = source;
               }
               
               /* create searchController with new options */
               this._searchController = null;
               _private.getSearchController(this).setFilter(currentFilter);
            }
            _private.checkContextValues(this, context);
         },
         
         _beforeUnmount: function() {
            _private.cancelSearchDeferred(this);
            _private.destroySearchController(this);
         }
         
      });
      
      List.contextTypes = function() {
         return {
            searchLayoutField: SearchContextField,
            filterLayoutField: FilterContextField
         };
      };
      
      List.getDefaultOptions = function() {
         return {
            searchDelay: 500,
            minSearchLength: 3,
            filter: {}
         };
      };
      
      /* For tests */
      List._private = _private;
      return List;
      
   });
