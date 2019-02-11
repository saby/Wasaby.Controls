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
      'Core/constants',
      'css!theme?Controls/Container/Suggest/Layout'
   ],
   function(Control, template, emptyTemplate, entity, mStubs, clone, getSwitcherStrFromData, Deferred, isEqual, constants) {
      'use strict';
      var CURRENT_TAB_META_FIELD = 'tabsSelectedKey';
      
      /* hot keys, that list (suggestList) will process, do not respond to the press of these keys when suggest is opened */
      var IGNORE_HOT_KEYS = [constants.key.down, constants.key.up, constants.key.enter];
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
               //focus can be moved out while dependencies loading
               if (self._inputActive) {
                  _private.suggestStateNotify(self, true);
               }
            });
         },
         
         inputActivated: function(self) {
            var filter;
            
            if (self._options.autoDropDown && !self._options.readOnly) {
               if (self._options.historyId) {
                  _private.getRecentKeys(self).addCallback(function(keys) {
                     if (keys) {
                        filter = clone(self._options.filter || {});
                        filter['historyKeys'] = keys;
                        _private.setFilter(self, filter);
                     }
                     _private.open(self);
                  });
               } else {
                  _private.updateSuggestState(self);
               }
            }
         },
         
         searchErrback: function(self, error) {
            self._loading = false;
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
            return (searchResult && searchResult.data.getCount()) || self._searchValue && self._options.emptyTemplate;
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
            if (_private.shouldSearch(self, self._searchValue) || self._options.autoDropDown) {
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
                     historyId: self._options.historyId
                  });
                  self._historyServiceLoad.callback(self._historyService);
               });
            }

            return self._historyServiceLoad;
         },
         getRecentKeys: function(self) {
            var deferredWithKeys = new Deferred();

            //toDO Пока что делаем лишний вызов на бл, ждем доработки хелпера от Шубина
            _private.getHistoryService(self).addCallback(function(historyService) {
               historyService.query().addCallback(function(dataSet) {
                  var keys = [];

                  dataSet.getRow().get('recent').each(function(item) {
                     keys.push(item.get('ObjectId'));
                  });

                  deferredWithKeys.callback(keys);
               });

               return historyService;
            });

            return deferredWithKeys;
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
         _showContent: false,
         _inputActive: false,

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
            this._emptyTemplate = _private.getEmptyTemplate(options.emptyTemplate);
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
            var valueChanged = this._options.value !== newOptions.value;
            
            if (!newOptions.suggestState) {
               _private.setCloseState(this);
            }
      
            if (valueChanged) {
               this._searchValue = newOptions.value;
            }
   
            if (valueChanged || !isEqual(this._options.filter, newOptions.filter)) {
               _private.setFilter(this, newOptions.filter);
            }
      
            if (this._options.emptyTemplate !== newOptions.emptyTemplate) {
               this._emptyTemplate = _private.getEmptyTemplate(newOptions.emptyTemplate);
               this._dependenciesDeferred = null;
            }
      
            if (this._options.footerTemplate !== newOptions.footerTemplate) {
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
            if (this._options.trim) {
               value = value.trim();
            }
            this._searchValue = _private.shouldSearch(this, value) ? value : '';

            /* preload suggest dependencies on value changed */
            _private.loadDependencies(this);
            _private.updateSuggestState(this);
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

            // after select from the suggest, focus on input will lost
            // if the focus should be returned, the control (such Input/Suggest) should do it
            this._inputActive = false;
            this._notify('choose', [item]);
            if (this._options.historyId) {
               _private.getHistoryService(this).addCallback(function(historyService) {
                  historyService.update(item, {$_history: true});
                  return historyService;
               });
            }
         },
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
            _private.setFilter(self, self._options.filter);
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
         },

         _keydown: function(event) {
            if (this._options.suggestState && IGNORE_HOT_KEYS.indexOf(event.nativeEvent.keyCode) !== -1) {
               event.preventDefault();
            }
            if (this._children.inputKeydown) {
               this._children.inputKeydown.start(event);
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
