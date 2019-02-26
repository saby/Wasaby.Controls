define('Controls/Container/Suggest/Layout',
   [
      'Core/Control',
      'wml!Controls/Container/Suggest/Layout',
      'wml!Controls/Container/Suggest/Layout/empty',
      'Types/entity',
      'Core/moduleStubs',
      'Core/core-clone',
      'Controls/Search/Misspell/getSwitcherStrFromData',
      'Core/Deferred',
      'Core/helpers/Object/isEqual',
      'Env/Env',
      'css!theme?Controls/Container/Suggest/Layout'
   ],
   function(Control, template, emptyTemplate, entity, mStubs, clone, getSwitcherStrFromData, Deferred, isEqual, Env) {
      'use strict';
      
      var CURRENT_TAB_META_FIELD = 'tabsSelectedKey';
      var HISTORY_KEYS_FIELD = 'historyKeys';
      var COUNT_HISTORY_ITEMS = 12;
      
      /* if suggest is opened and marked key from suggestions list was changed,
         we should select this item on enter keydown, otherwise keydown event should be propagated as default. */
      var ENTER_KEY = Env.constants.key.enter;
      
      /* hot keys, that list (suggestList) will process, do not respond to the press of these keys when suggest is opened */
      var IGNORE_HOT_KEYS = [Env.constants.key.down, Env.constants.key.up, ENTER_KEY];
      
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
            } else {
               self._forceUpdate();
            }
         },
         setCloseState: function(self) {
            self._showContent = false;
            self._loading = null;
         },
         
         setSuggestMarkedKey: function(self, key) {
            var currentMarkedKey = self._suggestMarkedKey;
            self._suggestMarkedKey = key;
            
            if (currentMarkedKey !== self._suggestMarkedKey) {
               self._notify('suggestMarkedKeyChanged', [key]);
            }
         },
         
         close: function(self) {
            this.setCloseState(self);
            this.suggestStateNotify(self, false);
         },
         open: function(self) {
            _private.loadDependencies(self).addCallback(function() {
               //focus can be moved out while dependencies loading
               if (self._inputActive) {
                  _private.suggestStateNotify(self, true);
               }
            });
         },
         
         openWithHistory: function(self) {
            var historyKeys = self._filter && self._filter[HISTORY_KEYS_FIELD];
            var filter;
            
            if (!historyKeys) {
               return _private.getRecentKeys(self).addCallback(function(keys) {
                  if (keys && keys.length) {
                     filter = clone(self._options.filter || {});
                     filter[HISTORY_KEYS_FIELD] = keys;
                     _private.setSearchValue(self, '');
                     _private.setFilter(self, filter);
                     _private.open(self);
                  }
                  return keys;
               });
            } else {
               if (!self._options.suggestState) {
                  _private.open(self);
               }
               return Deferred.success(historyKeys);
            }
         },
         
         setSearchValue: function(self, value) {
            self._searchValue = value;
         },
         
         inputActivated: function(self) {
            if (self._options.autoDropDown && !self._options.readOnly) {
               if (self._options.historyId && !self._searchValue) {
                  _private.openWithHistory(self);
               } else if (!self._options.suggestState) {
                  _private.updateSuggestState(self);
               }
            }
         },
         
         searchErrback: function(self, error) {
            //aborting of the search may be caused before the search start, because of the delay before searching
            if (self._loading !== null) {
               self._loading = false;
            }
            if (!error || !error.canceled) {
               requirejs(['tmpl!Controls/Container/Suggest/Layout/emptyError'], function(result) {
                  self._emptyTemplate = result;
                  self._forceUpdate();
               });
            }
         },
         shouldSearch: function(self, value) {
            return self._active && value.length >= self._options.minSearchLength;
         },
         shouldShowSuggest: function(self, searchResult) {
            var hasItems = searchResult && searchResult.data.getCount();
            
            /* do not suggest if:
             * 1) loaded list is empty and empty template option is doesn't set
             * 2) loaded list is empty and list loaded from history, expect that the list is loaded from history, becouse input field is empty and historyId options is set  */
            return hasItems ||
                   hasItems && self._options.historyId && !self._searchValue ||
                   !self._options.historyId && self._options.emptyTemplate;
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
         getEmptyTemplate: function(emptyTemplate) {
            return emptyTemplate && emptyTemplate.templateName ? emptyTemplate.templateName : emptyTemplate;
         },
         updateSuggestState: function(self) {
            if (_private.shouldSearch(self, self._searchValue) || self._options.autoDropDown && !self._options.suggestState) {
               _private.setFilter(self, self._options.filter);
               _private.open(self);
            } else if (!self._options.autoDropDown) {
               //autoDropDown - close only on Esc key or deactivate
               _private.close(self);
            }
         },
         loadDependencies: function(self) {
            var getTemplatesToLoad = function(options) {
               var templatesToCheck = ['footerTemplate', 'suggestTemplate', 'emptyTemplate'];
               var templatesToLoad = [];
               templatesToCheck.forEach(function(tpl) {
                  if (options[tpl] && options[tpl].templateName) {
                     templatesToLoad.push(options[tpl].templateName);
                  }
               });
               return templatesToLoad;
            };
            
            if (!self._dependenciesDeferred) {
               self._dependenciesDeferred = mStubs.require(DEPS.concat(getTemplatesToLoad(self._options).concat([self._options.layerName])));
            }
            return self._dependenciesDeferred;
         },
         setMissSpellingCaption: function(self, value) {
            self._misspellingCaption = value;
         },
         getHistoryService: function(self) {
            if (!self._historyService) {
               self._historyServiceLoad = new Deferred();
               require(['Controls/History/Service'], function(HistoryService) {
                  self._historyService = new HistoryService({
                     historyId: self._options.historyId,
                     recent: COUNT_HISTORY_ITEMS
                  });
                  self._historyServiceLoad.callback(self._historyService);
               });
            }

            return self._historyServiceLoad;
         },
         getRecentKeys: function(self) {
            if (self._historyLoad) {
               return self._historyLoad;
            }
   
            self._historyLoad = new Deferred();

            //toDO Пока что делаем лишний вызов на бл, ждем доработки хелпера от Шубина
            _private.getHistoryService(self).addCallback(function(historyService) {
               historyService.query().addCallback(function(dataSet) {
                  var keys = [];

                  dataSet.getRow().get('recent').each(function(item) {
                     keys.push(item.get('ObjectId'));
                  });
   
                  self._historyLoad.callback(keys);
               });

               return historyService;
            });

            return self._historyLoad;
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
         _historyService: null,
         _historyLoad: null,
         _showContent: false,
         _inputActive: false,
         _suggestMarkedKey: null,

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
            this._searchDelay = options.searchDelay;
            this._emptyTemplate = _private.getEmptyTemplate(options.emptyTemplate);
            this._tabsSelectedKeyChanged = this._tabsSelectedKeyChanged.bind(this);
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
         },
         _beforeUpdate: function(newOptions) {
            var valueChanged = this._options.value !== newOptions.value;
            var valueCleared = valueChanged && !newOptions.value && typeof newOptions.value === 'string';
            var needSearchOnValueChanged = valueChanged && _private.shouldSearch(this, newOptions.value);

            if (!newOptions.suggestState) {
               _private.setCloseState(this);
               _private.setSuggestMarkedKey(this, null);
            } else if (this._options.suggestState !== newOptions.suggestState) {
               _private.open(this);
            }

            if (needSearchOnValueChanged || valueCleared) {
               this._searchValue = newOptions.value;
            }

            if (needSearchOnValueChanged || valueCleared || !isEqual(this._options.filter, newOptions.filter)) {
               _private.setFilter(this, newOptions.filter);
            }

            if (this._options.emptyTemplate !== newOptions.emptyTemplate) {
               this._emptyTemplate = _private.getEmptyTemplate(newOptions.emptyTemplate);
               this._dependenciesDeferred = null;
            }
      
            if (!isEqual(this._options.footerTemplate, newOptions.footerTemplate)) {
               this._dependenciesDeferred = null;
            }
            
            if (this._options.searchDelay !== newOptions.searchDelay) {
               this._searchDelay = newOptions.searchDelay;
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
            _private.close(this);
         },
         _changeValueHandler: function(event, value) {
            var historyId = this._options.historyId;
            var self = this;
            var shouldSearch;
            
            if (this._options.trim) {
               value = value.trim();
            }
   
            shouldSearch = _private.shouldSearch(this, value);

            /* preload suggest dependencies on value changed */
            _private.loadDependencies(this);
            
            if (!shouldSearch && historyId) {
               _private.openWithHistory(this).addCallback(function(res) {
                  if (!res.length && self._options.suggestState) {
                     _private.close(self);
                  }
      
                  return res;
               });
            } else {
               _private.setSearchValue(self, shouldSearch ? value : '');
               _private.updateSuggestState(this);
            }
         },
         _inputActivated: function() {
            this._inputActive = true;
            _private.inputActivated(this);
         },
   
         _inputDeactivated: function() {
            this._inputActive = false;
         },
         
         _inputClicked: function() {
            if (!this._options.suggestState) {
               _private.inputActivated(this);
            }
         },
         _tabsSelectedKeyChanged: function(key) {
            this._searchDelay = 0;
            _private.setSuggestMarkedKey(this, null);

            // change only filter for query, tabSelectedKey will be changed after processing query result,
            // otherwise interface will blink
            if (this._tabsSelectedKey !== key) {
               this._filter = _private.prepareFilter(this, this._options.filter, this._searchValue, key);
            }

            // move focus from tabs to input, after change tab
            this.activate();
            
            /* because activate() does not call _forceUpdate and _tabsSelectedKeyChanged is callback function,
               we should call _forceUpdate, otherwise child controls (like suggestionsList) does not get new filter */
            this._forceUpdate();
         },
   
         // <editor-fold desc="List handlers">
         
         _select: function(event, item) {
            item = item || event;
            _private.close(this);

            // after select from the suggest, focus on input will lost
            // if the focus should be returned, the control (such Input/Suggest) should do it
            this._inputActive = false;
            this._notify('choose', [item]);
            if (this._options.historyId) {
               this._historyLoad = null;
               _private.getHistoryService(this).addCallback(function(historyService) {
                  historyService.update(item, {$_history: true});
                  return historyService;
               });
            }
         },
   
         _markedKeyChangedHandler: function(event, key) {
            _private.setSuggestMarkedKey(this, key);
         },
   
         // </editor-fold>
         
         _searchStart: function() {
            this._loading = true;
            this._children.indicator.show();
            if (this._options.searchStartCallback) {
               this._options.searchStartCallback();
            }
         },
         _searchEnd: function(result) {
            if (this._options.suggestState) {
               this._loading = false;
               
               // _searchEnd may be called synchronously, for example, if local source is used,
               // then we must check, that indicator was created
               if (this._children.indicator) {
                  this._children.indicator.hide();
               }
            }
            this._searchDelay = this._options.searchDelay;
            _private.precessResultData(this, result);
            if (this._options.searchEndCallback) {
               this._options.searchEndCallback();
            }
            this._forceUpdate();
         },
         _searchErrback: function(error) {
            _private.searchErrback(this, error);
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
               но нам интересен только resize у window, поэтому проверяем.
               event'a может не быть, если resize не нативный, котрый может быть вызван через registrator просто при изменении размеров контрола. */
            if (event && event.target === window) {
               _private.close(this);
            }
         },
         _missSpellClick: function() {
            this._notify('valueChanged', [this._misspellingCaption]);
            _private.setMissSpellingCaption(this, '');
         },

         _keydown: function(event) {
            var eventKeyCode = event.nativeEvent.keyCode;
            var needProcessKey = eventKeyCode === ENTER_KEY ? this._suggestMarkedKey !== null : IGNORE_HOT_KEYS.indexOf(eventKeyCode) !== -1;
            
            if (this._options.suggestState && needProcessKey) {
               event.preventDefault();
               
               if (this._children.inputKeydown) {
                  this._children.inputKeydown.start(event);
               }
            }
         }

         // </editor-fold>
      });

      // <editor-fold desc="OptionsDesc">
      SuggestLayout.getOptionTypes = function() {
         return {
            searchParam: entity.descriptor(String).required()
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
