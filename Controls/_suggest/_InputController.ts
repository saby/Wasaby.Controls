import Control = require('Core/Control');
import template = require('wml!Controls/_suggest/_InputController/_InputController');
import emptyTemplate = require('wml!Controls/_suggest/_InputController/empty');
import {descriptor} from 'Types/entity';
import mStubs = require('Core/moduleStubs');
import clone = require('Core/core-clone');
import {getSwitcherStrFromData} from 'Controls/search';
import Deferred = require('Core/Deferred');
import isEqual = require('Core/helpers/Object/isEqual');
import Env = require('Env/Env');
import LoadService = require('Controls/History/LoadService');
import 'css!theme?Controls/_suggest/_InputController/InputController';


var CURRENT_TAB_META_FIELD = 'tabsSelectedKey';
var HISTORY_KEYS_FIELD = 'historyKeys';

/* if suggest is opened and marked key from suggestions list was changed,
   we should select this item on enter keydown, otherwise keydown event should be propagated as default. */
var ENTER_KEY = Env.constants.key.enter;

var PROCESSED_KEYDOWN_KEYS = {

   /* hot keys that should processed on input */
   INPUT: [Env.constants.key.esc],

   /* hot keys, that list (suggestList) will process, do not respond to the press of these keys when suggest is opened */
   SUGGESTIONS_LIST: [Env.constants.key.down, Env.constants.key.up, ENTER_KEY]
};

var DEPS = ['Controls/suggestPopup:_ListWrapper', 'Controls/Container/Scroll', 'Controls/search:Misspell', 'Controls/LoadingIndicator'];

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

      // when closing popup we reset the cache with recent keys
      self._historyLoad = null;
      if (self._filter) {
         delete self._filter[HISTORY_KEYS_FIELD];
      }
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
         if (self._inputActive && !self._stackWithSearchResultsOpened) {
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
            } else if (!self._options.suggestState) {
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
         // The delay is needed when searching, when receiving the focus of the input field, open without delay
         self._searchDelay = 0;

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
         requirejs(['tmpl!Controls/_suggest/_InputController/emptyError'], function(result) {
            self._emptyTemplate = result;
            self._forceUpdate();
         });
      }
   },
   shouldSearch: function(self, value) {
      return self._inputActive && value.length >= self._options.minSearchLength;
   },

   prepareValue: function(self, value) {
      return self._options.trim ? value.trim() : value;
   },

   shouldShowSuggest: function(self, searchResult) {
      var hasItems = searchResult && searchResult.data.getCount();

      /* do not suggest if:
       * 1) loaded list is empty and empty template option is doesn't set
       * 2) loaded list is empty and list loaded from history, expect that the list is loaded from history, becouse input field is empty and historyId options is set  */
      return hasItems ||
         hasItems && self._options.historyId && !self._searchValue ||
         (!self._options.historyId || self._searchValue) && self._options.emptyTemplate;
   },
   processResultData: function(self, resultData) {
      self._searchResult = resultData;
      if (resultData) {
         var data = resultData.data;
         var metaData = data && data.getMetaData();
         var result = metaData.results;

         _private.setMissSpellingCaption(self, getSwitcherStrFromData(data));

         if (!data.getCount()) {
            _private.setSuggestMarkedKey(self, null);
         }

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
      if (!self._historyServiceLoad) {
         self._historyServiceLoad = LoadService({
            historyId: self._options.historyId
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
            if (self._historyLoad) {
               var keys = [];
               dataSet.getRow().get('recent').each(function(item) {
                  keys.push(item.get('ObjectId'));
               });
               self._historyLoad.callback(keys);
            }
         });

         return historyService;
      });

      return self._historyLoad;
   }
};

/**
 * Container for Input's that using suggest.
 *
 * @class Controls/_suggest/_InputController
 * @extends Core/Control
 * @mixes Controls/Input/interface/ISearch
 * @mixes Controls/interface/ISource
 * @mixes Controls/interface/IFilter
 * @mixes Controls/Input/interface/ISuggest
 * @mixes Controls/interface/INavigation
 * @control
 * @public
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
   _historyLoad: null,
   _showContent: false,
   _inputActive: false,
   _suggestMarkedKey: null,
   _stackWithSearchResultsOpened: false,

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
      var needSearchOnValueChanged = valueChanged && _private.shouldSearch(this, _private.prepareValue(this, newOptions.value));

      if (newOptions.suggestState !== this._options.suggestState) {
         if (newOptions.suggestState) {
            _private.open(this);
         } else {
            _private.setCloseState(this);
            _private.setSuggestMarkedKey(this, null);
         }
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

      value = _private.prepareValue(self, value);
      shouldSearch = _private.shouldSearch(this, value);

      /* preload suggest dependencies on value changed */
      _private.loadDependencies(this);
      this._searchDelay = this._options.searchDelay;

      if (!shouldSearch && historyId) {
         _private.openWithHistory(this).addCallback(function(res) {
            if (!res.length && self._options.suggestState) {
               _private.close(self);
            }

            return res;
         });
      } else {
         _private.setSearchValue(self, shouldSearch ? value : '');
         _private.setFilter(self, self._options.filter);
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
      this._inputActive = true;
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

   //FIXME remove after https://online.sbis.ru/opendoc.html?guid=e321216a-61c6-4b3c-aed8-587dc524c8cd
   _stackWithSearchResultsClosed: function() {
      this._stackWithSearchResultsOpened = false;
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
      _private.processResultData(this, result);
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

      //FIXME remove after https://online.sbis.ru/opendoc.html?guid=e321216a-61c6-4b3c-aed8-587dc524c8cd
      //popup manager moves focus to control after closing panel asynchronously, because of this, there are problems with focus
      //if we close suggest popup and instantly open stack with search results, focus will moved to input, and suggest will opened (if autodropdown option is setter to true)
      this._stackWithSearchResultsOpened = true;

      //loading showAll templates
      requirejs(['Controls/suggestPopup'], function() {
         self._children.stackOpener.open();
      });
      _private.close(this);
   },

   _missSpellClick: function() {
      // Return focus to the input field by changing the keyboard layout
      this.activate();
      this._notify('valueChanged', [this._misspellingCaption])
      this._changeValueHandler(null, this._misspellingCaption);
      _private.setMissSpellingCaption(this, '');
   },

   _keydown: function(event) {
      var eventKeyCode = event.nativeEvent.keyCode;
      var isInputKey = PROCESSED_KEYDOWN_KEYS.INPUT.indexOf(eventKeyCode) !== -1;
      var isListKey = eventKeyCode === ENTER_KEY ? this._suggestMarkedKey !== null : PROCESSED_KEYDOWN_KEYS.SUGGESTIONS_LIST.indexOf(eventKeyCode) !== -1;

      if (this._options.suggestState) {
         if (isListKey || isInputKey) {
            event.preventDefault();
            event.stopPropagation();
         }

         if (isListKey) {
            if (this._children.inputKeydown) {
               this._children.inputKeydown.start(event);
            }
         } else if (isInputKey) {
            if (eventKeyCode === Env.constants.key.esc) {
               _private.close(this);
            }
         }
      }
   }

   // </editor-fold>
});

// <editor-fold desc="OptionsDesc">
SuggestLayout.getOptionTypes = function() {
   return {
      searchParam: descriptor(String).required()
   };
};
SuggestLayout.getDefaultOptions = function() {
   return {
      emptyTemplate: emptyTemplate,
      footerTemplate: {
         templateName: 'Controls/suggestPopup:FooterTemplate'
      },
      suggestStyle: 'default',
      suggestState: false,
      minSearchLength: 3
   };
};

// </editor-fold>
SuggestLayout._private = _private;
export = SuggestLayout;

