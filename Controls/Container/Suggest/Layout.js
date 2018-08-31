define('Controls/Container/Suggest/Layout',
   [
      'Core/Control',
      'tmpl!Controls/Container/Suggest/Layout/Suggest',
      'tmpl!Controls/Container/Suggest/Layout/empty',
      'WS.Data/Type/descriptor',
      'Controls/Container/Search/SearchContextField',
      'Controls/Container/Filter/FilterContextField',
      'Core/moduleStubs',
      'Core/core-clone',
      'css!Controls/Container/Suggest/Layout/Suggest'
   ],
   function(Control, template, emptyTemplate, types, SearchContextField, FilterContextField, mStubs, clone) {
      
      'use strict';
      
      var CURRENT_TAB_META_FIELD = 'tabsSelectedKey';
      var DEPS = ['Controls/Container/Suggest/Layout/_SuggestListWrapper', 'Controls/Container/Scroll'];
      
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
            this.resetSizesState(self);
            this.suggestStateNotify(self, false);
         },
         
         open: function(self) {
            _private.loadDependencies(self).addCallback(function() {
               _private.suggestStateNotify(self, true);
            });
         },
         
         searchErrback: function(self) {
            self._loading = false;
            requirejs(['tmpl!Controls/Container/Suggest/Layout/emptyError'], function(result) {
               self._emptyTemplate = result;
               self._forceUpdate();
            });
         },
         
         getSizes: function(self, dropDownContainer) {
            var boundingClientToJSON = function(bc) {
               var resultObj = {};

               // firefox bug, clientRect object haven't method toJSON
               if (bc.toJSON) {
                  resultObj = bc.toJSON();
               } else {
                  for (var i in bc) {
                     if (bc.hasOwnProperty(i)) {
                        resultObj[i] = bc[i];
                     }
                  }
               }

               return resultObj;
            };
            var suggestBCR = boundingClientToJSON(self._children.suggestionsContainer.getBoundingClientRect());
            var containerBCR =  boundingClientToJSON(self._container.getBoundingClientRect());
            var dropDownContainerBCR = _private.getDropDownContainerSize(dropDownContainer);
            
            /* because dropDownContainer can have height smaller, than window height */
            function fixSizesByDDContainer(size) {
               size.top -= dropDownContainerBCR.top;
               size.bottom -= dropDownContainerBCR.top;
               return size;
            }
            
            return {
               suggest: fixSizesByDDContainer(suggestBCR),
               container: fixSizesByDDContainer(containerBCR)
            };
         },
         
         getDropDownContainerSize: function(container) {
            container = container || document.getElementsByClassName('controls-Popup__stack-target-container')[0] || document.body;
            return container.getBoundingClientRect();
         },
   
         calcOrient: function(self, dropDownContainer) {
            /* calculate algorithm:
               - bottom of suggest behind the screen -> change orient, need to revert (-up)
               - bottom of suggest on screen and suggest reverted -> nothing to do (-up)
               - bottom of suggest on screen -> default orient (-down)
             */
            var sizes = _private.getSizes(self, dropDownContainer),
               suggestHeight = sizes.suggest.height,
               containerSize = sizes.container,
               dropDownContainerSize = _private.getDropDownContainerSize(dropDownContainer),
               needToRevert = suggestHeight + containerSize.bottom > dropDownContainerSize.height,
               newOrient;
            
            if (needToRevert && self._options.suggestStyle !== 'overInput') {
               if (containerSize.top - suggestHeight > 0) {
                  newOrient = '-up';
               } else {
                  newOrient = '-down';
               }
            } else {
               if (self._orient === '-up') {
                  newOrient = self._orient;
               } else {
                  newOrient = '-down';
               }
            }
            
            return newOrient;
         },
   
         /**
          * calculate height of suggestions container by orient and suggestions container sizes
          * @param self
          * @param currentOrient orient of suggestions container
          * @param sizes size of suggestions container and input container
          * @param dropDownContainer container for dropDown
          * @returns {string}
          */
         calcHeight: function(self, currentOrient, dropDownContainer) {
            var sizes = _private.getSizes(self, dropDownContainer);
            var dropDownContainerSize = _private.getDropDownContainerSize(dropDownContainer);
            var suggestSize = sizes.suggest;
            var containerSize = sizes.container;
            var containerOptionToGet = {
               '-up': 'top',
               '-down': 'bottom'
            };
            var height = self._height;
            var optionValue = containerSize[containerOptionToGet[currentOrient]];
            var suggestBottomSideCoord = optionValue + (currentOrient === '-up' ? -suggestSize.height : suggestSize.height);
            
            if (suggestBottomSideCoord < 0) {
               height = suggestSize.height + suggestBottomSideCoord + 'px';
            } else if (suggestBottomSideCoord > dropDownContainerSize.height) {
               height = suggestSize.height - (suggestBottomSideCoord - dropDownContainerSize.height) + 'px';
            }
            
            return height;
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
               var result = metaData.results;
   
               if (result && result.get(CURRENT_TAB_META_FIELD)) {
                  self._tabsSelectedKey = result.get(CURRENT_TAB_META_FIELD);
               }
            }
   
            if (!_private.shouldShowSuggest(self, resultData)) {
               _private.close(self);
            } else {
               self._isFooterShown = _private.shouldShowFooter(self, resultData);
            }
         },
   
         prepareFilter: function(self, filter, searchValue, tabId) {
            var preparedFilter = clone(filter) || {};
            
            if (tabId) {
               preparedFilter.currentTab = tabId;
            }
   
            preparedFilter[self._options.searchParam] = searchValue;
            
            return preparedFilter;
         },
         
         setFilter: function(self, filter) {
            self._filter = this.prepareFilter(self, filter, self._searchValue, self._tabsSelectedKey);
         },
         
         updateSuggestState: function(self) {
            if (_private.shouldSearch(self, self._searchValue)) {
               _private.setFilter(self, self._options.filter);
               _private.open(self);
            } else if (!self._options.autoDropDown) {
               //autoDropDown - close only on Esc key or deactivate
               _private.close(self);
            }
         },
         
         loadDependencies: function(self) {
            if (!self._dependenciesDeferred) {
               var deps = DEPS.concat([self._options.suggestTemplate.templateName]);
               if (self._options.footerTemplate !== null) {
                  deps = deps.concat([self._options.footerTemplate.templateName]);
               }
               if (self._options.suggestStyle === 'overInput') {
                  deps.push('Controls/Button/Close');
               }
               
               self._dependenciesDeferred = mStubs.require(deps);
            }
            return self._dependenciesDeferred;
         },
         
         resetSizesState: function(self) {
            self._orient = null;
            this.resetHeight(self);
         },
         
         resetHeight: function(self) {
            self._height = 'auto';
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
         _searchDelay: null,
         _dependenciesDeferred: null,
         _loading: false,
   
         _orient: null,
         _height: 'auto',
         
         // <editor-fold desc="LifeCycle">
         
         _beforeMount: function(options) {
            this._searchStart = this._searchStart.bind(this);
            this._searchEnd = this._searchEnd.bind(this);
            this._searchErrback = this._searchErrback.bind(this);
            this._select = this._select.bind(this);
            this._searchDelay = options.searchDelay;
            this._emptyTemplate = options.emptyTemplate;
         },
         
         _afterMount: function() {
            _private.setFilter(this, this._options.filter);
         },
   
         _beforeUnmount: function() {
            this._searchResult = null;
            this._tabsSource = null;
            this._searchStart = null;
            this._searchEnd = null;
            this._searchErrback = null;
            this._select = null;
         },
         
         _beforeUpdate: function(newOptions) {
            if (!newOptions.suggestState) {
               _private.resetSizesState(this);
            }
            
            if (this._options.filter !== newOptions.filter) {
               _private.setFilter(this, newOptions.filter);
            }
         },
   
         _afterUpdate: function() {
            /* 1) checking suggestionsContainer in children, because suggest initializing asynchronously
               2) do not change orientation of suggest, if suggest already showed or data loading now */
            if (this._options.suggestState && this._children.suggestionsContainer && !this._loading) {
               var orient = _private.calcOrient(this);
               var height = _private.calcHeight(this, orient);
               var orientChanged = this._orient !== orient;
               var heightChanged = this._height !== height;
               var needUpdate = orientChanged || heightChanged;
               
               if (orientChanged) {
                  this._orient = orient;
               }
               
               if (heightChanged) {
                  this._height = height;
               }
   
               if (needUpdate) {
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
            /* need clear text on close button click (by standart http://axure.tensor.ru/standarts/v7/строка_поиска__версия_01_.html).
               Notify event only if value is not empty, because event listeners expect, that the value is really changed */
            if (this._searchValue) {
               this._searchValue = '';
               this._notify('valueChanged', ['']);
            }
            _private.close(this);
         },
         
         _changeValueHandler: function(event, value) {
            if (this._options.trim) {
               value = value.trim();
            }
            this._searchValue = _private.shouldSearch(this, value) ? value : '';
            
            /* preload suggest dependencies on value changed */
            _private.loadDependencies(this);
            _private.updateSuggestState(this);
         },
   
         _inputActivated: function() {
            if (this._options.autoDropDown) {
               _private.open(this);
            }
         },
   
         _inputClicked: function() {
            if (this._options.autoDropDown && !this._options.suggestState) {
               _private.open(this);
            }
         },
   
         _tabsSelectedKeyChanged: function(event, key) {
            this._searchDelay = 0;
            
            // change only filter for query, tabSelectedKey will be changed after processing query result,
            // otherwise interface will blink
            if (this._tabsSelectedKey !== key) {
               this._filter = _private.prepareFilter(this, this._options.filter, this._searchValue, key);
            }
            
            // move focus from tabs to input, after change tab
            this.activate();
         },
         
         _select: function(event, item) {
            item = item || event;
            _private.close(this);
            this._notify('choose', [item]);
         },
         
         _searchStart: function() {
            this._loading = true;
            if (this._options.searchStartCallback) {
               this._options.searchStartCallback();
            }
         },
         
         _searchEnd: function(result) {
            this._loading = false;
            this._searchDelay = this._options.searchDelay;
            _private.resetHeight(this);
            _private.precessResultData(this, result);
            if (this._options.searchEndCallback) {
               this._options.searchEndCallback();
            }
            this._forceUpdate();
         },
   
         _searchErrback: function() {
            _private.searchErrback(this);
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
