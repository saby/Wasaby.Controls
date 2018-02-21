define('Controls/Layout/List',
   [
      'Core/Control',
      'tmpl!Controls/Layout/List/List',
      'WS.Data/Source/Memory',
      'Controls/Controllers/_SearchController',
      'Core/core-merge',
      'Core/helpers/Object/isEqual',
      'Controls/Layout/Search/SearchContextField',
      'Controls/Layout/Filter/FilterContextField'
   ],
   
   function(Control, template, Memory, SearchController, merge, isEqual, SearchContextField, FilterContextField) {
      
      'use strict';
   
   
      var _private = {
         initSearchController: function(self) {
            var options = self._options;
   
            if(!self._searchController) {
               self._searchController = new SearchController({
                  filter: options.filter,
                  searchParam: options.searchParam,
                  minSearchLength: options.minSearchLength,
                  source: options.source,
                  navigation: options.navigation,
                  searchCallback: _private.searchCallback.bind(self, self),
                  abortCallback: _private.abortCallback.bind(self, self)
               });
            }
         },
         
         resolveOptions: function(self, options) {
            self._options = options;
            self._source = options.source;
            self._filter = options.filter;
         },
      
         updateSource: function(self, data) {
            /* TODO will be a cached source */
            self._source = new Memory({
               data: data.result.getRawData()
            });
         },
         
         updateFilter: function(self, resultFilter) {
            /* Копируем объект, чтобы порвать ссылку и опция у списка изменилась*/
            var filterClone = merge({}, self._options.filter);
            self._filter = merge(filterClone, resultFilter);
         },
      
         abortCallback: function(self, filter) {
            _private.updateFilter(self, filter);
            self._source = self._options.source;
            self._forceUpdate();
         },
      
         searchCallback: function(self, result, filter) {
            _private.updateFilter(self, filter);
            _private.updateSource(self, result);
            self._forceUpdate();
         }
      };
   
      /**
       * Компонент-обёртка для списка.
       * Принимает значения из контекста и фильтрует данные для списка.
       * @author Герасимов Александр
       * @class Controls/Layout/List
       * @mixes Controls/Input/interface/ISearch
       */
      
      /**
       * @name Controls/Layout/List#source
       * @cfg {WS.Data/Source/ISource} source
       */
   
      /**
       * @name Controls/Layout/List#navigation
       * @cfg 'Controls/interface/INavigation} source
       */
      var List = Control.extend({
         
         _template: template,
         
         constructor: function(options) {
            List.superclass.constructor.call(this, options);
            _private.resolveOptions(this, options);
         },
         
         _beforeUpdate: function (options, context) {
            if (!isEqual(this.context.get('searchLayoutField').searchValue, context.searchLayoutField.searchValue)) {
               this._searchValueChanged(context.searchLayoutField.searchValue);
            }
            
            if (!isEqual(this.context.get('filterLayoutField').filter, context.filterLayoutField.filter)) {
               this._filterChanged(context.filterLayoutField.filter);
            }
         },
   
         _searchValueChanged: function (value) {
            _private.initSearchController(this);
            this._searchController.search(value);
         },
         
         _filterChanged: function (filter) {
            _private.updateFilter(this, filter);
            this._forceUpdate();
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
      
      return List;
      
   });