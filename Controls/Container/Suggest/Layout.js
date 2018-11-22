define('Controls/Container/Suggest/Layout',
   [
      'Core/Control',
      'wml!Controls/Container/Suggest/Layout',
      'wml!Controls/Container/Suggest/Layout/empty',
      'WS.Data/Type/descriptor',
      'Core/moduleStubs',
      'Core/core-clone',
      'Controls/Search/Misspell/getSwitcherStrFromData',
      'css!theme?Controls/Container/Suggest/Layout'
   ],
   function(Control, template, emptyTemplate, types, mStubs, clone, getSwitcherStrFromData) {
      'use strict';
      var CURRENT_TAB_META_FIELD = 'tabsSelectedKey';
      var DEPS = ['Controls/Container/Suggest/Layout/_SuggestListWrapper', 'Controls/Container/Scroll', 'Controls/Search/Misspell', 'Controls/Container/LoadingIndicator'];
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
         setCloseState: function(self) {
            self._showContent = false;
            self._loading = null;
         },
         close: function(self) {
            this.setCloseState(self);
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
               _private.setMissSpellingCaption(self, getSwitcherStrFromData(data));
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
            if (_private.shouldSearch(self, self._searchValue) || self._options.autoDropDown) {
               _private.setFilter(self, self._options.filter);
               _private.open(self);
            } else if (!self._options.autoDropDown) {
               //autoDropDown - close only on Esc key or deactivate
               _private.close(self);
            }
         },
         loadDependencies: function(self) {
            if (!self._dependenciesDeferred) {
               var deps = DEPS.concat([self._options.suggestTemplate.templateName, self._options.layerName]);
               if (self._options.footerTemplate !== null) {
                  deps = deps.concat([self._options.footerTemplate.templateName]);
               }
               self._dependenciesDeferred = mStubs.require(deps);
            }
            return self._dependenciesDeferred;
         },
         setMissSpellingCaption: function(self, value) {
            self._misspellingCaption = value;
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
         _inputValue: '',
         _isFooterShown: false,
         _tabsSource: null,
         _filter: null,
         _tabsSelectedKey: null,
         _searchResult: null,
         _searchDelay: null,
         _dependenciesDeferred: null,
         _showContent: false,

         /**
          * three state flag
          * null - loading is not initiated
          * true - loading data now
          * false - data loading ended
          */
         _loading: null,

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
               _private.setCloseState(this);
            }
            if (this._options.filter !== newOptions.filter) {
               _private.setFilter(this, newOptions.filter);
            }

            if (this._options.value !== newOptions.value) {
               this._searchValue = newOptions.value;
            }

            if (this._emptyTemplate !== newOptions.emptyTemplate) {
               this._emptyTemplate = newOptions.emptyTemplate;
            }
         },
         _afterUpdate: function() {
            if (this._options.suggestState && this._loading === false && !this._showContent) {
               this._showContent = true;
               this._forceUpdate();
            }
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
            this._children.indicator.toggleIndicator(this._loading = true);
            if (this._options.searchStartCallback) {
               this._options.searchStartCallback();
            }
         },
         _searchEnd: function(result) {
            if (this._options.suggestState) {
               this._children.indicator.toggleIndicator(this._loading = false);
            }
            this._searchDelay = this._options.searchDelay;
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
               self._children.stackOpener.open({ opener: self }); // TODO: убрать, когда сделают https://online.sbis.ru/opendoc.html?guid=48ab258a-2675-4d16-987a-0261186d8661
            });
            _private.close(this);
         },

         /* По стандарту все выпадающие списки закрываются при скроле.
            Мы не можем понять, что вызвало изменение положения элемента, ресайз или скролл,
            поэтому при ресайзе тоже закрываем. */
         _resize: function(syntheticEvent, event) {
            /* событие resize могут вызывать компоненты при изменении своего размера,
               но нам интересен только resize у window, поэтому проверяем */
            if (event.target === window) {
               _private.close(this);
            }
         },
         _missSpellClick: function() {
            this._notify('valueChanged', [this._misspellingCaption]);
            _private.setMissSpellingCaption(this, '');
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
               templateName: 'wml!Controls/Container/Suggest/Layout/footer'
            },
            suggestStyle: 'default',
            suggestState: false,
            minSearchLength: 3
         };
      };

      // </editor-fold>
      SuggestLayout._private = _private;
      return SuggestLayout;
   });
