define('Controls/Container/Suggest/Layout',
   [
      'Core/Control',
      'tmpl!Controls/Container/Suggest/Layout/Suggest',
      'tmpl!Controls/Container/Suggest/Layout/empty',
      'WS.Data/Type/descriptor',
      'Controls/Container/Search/SearchContextField',
      'Controls/Container/Filter/FilterContextField',
      'css!Controls/Container/Suggest/Layout/Suggest'
   ],
   function(Control, template, emptyTemplate, types, SearchContextField, FilterContextField) {
      
      'use strict';
      
      var CURRENT_TAB_META_FIELD = 'tabsSelectedKey';
      
      var _private = {
         hasMore: function(searchResult) {
            return searchResult && searchResult.hasMore;
         },
   
         shouldShowFooter: function(self, searchResult) {
            return this.hasMore(searchResult) && self._options.footerTemplate;
         },
         
         suggestStateNotify: function(self, state) {
            if (self._options.suggestState !== state) {
               self._notify('suggestStateChanged', [state]);
            }
         },
         
         close: function(self) {
            this.suggestStateNotify(self, false);
         },
         
         open: function(self) {
            this.suggestStateNotify(self, true);
         },
   
         shouldSearch: function(self, value) {
            return self._active && value.length >= self._options.minSearchLength;
         },
   
         shouldShowSuggest: function(self, searchResult) {
            return (searchResult && searchResult.data.getCount()) || self._options.emptyTemplate;
         },
         
         precessResultData: function(self, resultData) {
            self._searchResult = resultData;
            if (resultData) {
               var data = resultData.data;
               var metaData = data && data.getMetaData();
   
               if (metaData) {
                  if (metaData[CURRENT_TAB_META_FIELD] && self._tabsSelectedKey !== metaData[CURRENT_TAB_META_FIELD]) {
                     self._tabsSelectedKey = metaData[CURRENT_TAB_META_FIELD];
                  }
               }
            }
   
            if (!_private.shouldShowSuggest(self, resultData)) {
               _private.close(self);
            } else {
               self._isFooterShown = _private.shouldShowFooter(self, resultData);
            }
         },
         
         updateFilter: function(self, searchValue, tabId) {
            var filter = {};
            if (tabId) {
               filter.currentTab = tabId;
            }
            filter[self._options.searchParam] = searchValue;
            self._filter = filter;
         },
         
         updateSuggestState: function(self) {
            if (_private.shouldSearch(self, self._searchValue)) {
               _private.updateFilter(self, self._searchValue, self._tabsSelectedKey);
               _private.open(self);
            } else {
               _private.close(self);
            }
         }
      };
   
      /**
       * Container for Input's that using suggest.
       *
       * @class Controls/Container/Suggest/Layout
       * @extends Core/Control
       * @mixes Controls/Input/interface/ISearch
       * @mixes Controls/interface/ISource
       * @mixes Controls/interface/IFilter
       * @mixes Controls/Input/interface/ISuggest
       * @mixes Controls/interface/INavigation
       * @control
       */
      var SuggestLayout = Control.extend({
         
         _template: template,
         
         //context value
         _searchValue: '',
         _isFooterShown: false,
         _tabsSource: null,
         _filter: null,
         _tabsSelectedKey: null,
         _searchResult: null,
         _orient: null,
         
         // <editor-fold desc="LifeCycle">
         
         _beforeMount: function() {
            this._searchStart = this._searchStart.bind(this);
            this._searchEnd = this._searchEnd.bind(this);
            this._select = this._select.bind(this);
         },
   
         _beforeUnmount: function() {
            this._searchResult = null;
            this._tabsSource = null;
            this._searchStart = null;
            this._searchEnd = null;
            this._select = null;
         },
         
         _beforeUpdate: function(newOptions) {
            if (!newOptions.suggestState) {
               this._orient = null;
            }
         },
         
         _afterUpdate: function() {
            /* 1) checking suggestionsContainer in children, because suggest initializing asynchronously
               2) do not change orientation of suggest, if suggest already showed */
            if (this._options.suggestState && this._children.suggestionsContainer && !this._orient) {
               var orient = this._orient;
               
               if (this._children.suggestionsContainer.getBoundingClientRect().bottom > window.innerHeight) {
                  this._orient = '-up';
               } else {
                  this._orient = '-down';
               }
               
               if (orient !== this._orient) {
                  this._forceUpdate();
               }
            }
         },
   
         _getChildContext: function() {
            return {
               filterLayoutField: new FilterContextField({ filter: this._filter }),
               searchLayoutField: new SearchContextField(this._searchValue)
            };
         },
         
         // </editor-fold>
         
         
         // <editor-fold desc="handlers">
         
         _close: function() {
            _private.close(this);
         },
         
         _changeValueHandler: function(event, value) {
            this._searchValue = value;
            _private.updateSuggestState(this);
         },
   
         _inputActivated: function() {
            if (this._options.autoDropDown) {
               _private.open(this);
            }
         },
   
         _tabsSelectedKeyChanged: function(event, key) {
            this._tabsSelectedKey = key;
            _private.updateFilter(this, this._searchValue, this._tabsSelectedKey);
         },
         
         _select: function(event, item) {
            item = item || event;
            _private.close(this);
            this._notify('choose', [item]);
         },
         
         _searchStart: function() {
            if (this._options.searchStartCallback) {
               this._options.searchStartCallback();
            }
         },
         
         _searchEnd: function(result) {
            _private.precessResultData(this, result);
            if (this._options.searchEndCallback) {
               this._options.searchEndCallback();
            }
            this._forceUpdate();
         },
         
         _showAllClick: function() {
            var self = this;
            
            //loading showAll templates
            requirejs(['Controls/Container/Suggest/Layout/Dialog'], function() {
               self._children.stackOpener.open({});
            });
            _private.close(this);
         },
         
         /* По стандарту все выпадающие списки закрываются при скроле.
            Мы не можем понять, что вызвало изменение положения элемента, ресайз или скролл,
            поэтому при ресайзе тоже закрываем.*/
         _resize: function(syntheticEvent, event) {
            /* событие resize могут вызывать компоненты при изменении своего размера,
               но нам интересен только resize у window, поэтому проверяем */
            if (event.target === window) {
               _private.close(this);
            }
         }
         
         // </editor-fold>
         
      });
      
      
      // <editor-fold desc="OptionsDesc">
      SuggestLayout.getOptionTypes = function() {
         return {
            searchParam: types(String).required()
         };
      };
   
      SuggestLayout.getDefaultOptions = function() {
         return {
            emptyTemplate: emptyTemplate,
            footerTemplate: {
               templateName: 'tmpl!Controls/Container/Suggest/Layout/footer'
            },
            suggestStyle: 'default',
            suggestState: false,
            minSearchLength: 3
         };
      };
      
      // </editor-fold>
   
      SuggestLayout._private = _private;
      return SuggestLayout;
   }
);
