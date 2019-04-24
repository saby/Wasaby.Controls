
import Control = require('Core/Control');
import template = require('wml!Controls/_search/Controller');
import DataOptions = require('Controls/Container/Data/ContextOptions');
import clone = require('Core/core-clone');
import _SearchController = require('Controls/Controllers/_SearchController');
import isEqual = require('Core/helpers/Object/isEqual');
import getSwitcherStrFromData = require('Controls/_search/Misspell/getSwitcherStrFromData');


var _private = {
   getSearchController: function (self) {
      var options = self._dataOptions;

      if (!self._searchController) {
         self._searchController = new _SearchController({
            searchParam: self._options.searchParam,
            minSearchLength: self._options.minSearchLength,
            searchDelay: self._options.searchDelay,
            filter: clone(options.filter),
            source: options.source,
            sorting: options.sorting,
            navigation: options.navigation,
            searchCallback: _private.searchCallback.bind(self, self),
            abortCallback: _private.abortCallback.bind(self, self),
            searchStartCallback: _private.searchStartCallback.bind(self, self)
         });
      }

      return self._searchController;
   },

   searchCallback: function (self, result, filter) {
      var switcherStr = getSwitcherStrFromData(result.data);

      self._loading = false;

      if (self._viewMode !== 'search') {
         self._previousViewMode = self._viewMode;
         self._viewMode = 'search';
      }

      self._searchValue = filter[self._options.searchParam] || '';
      self._forceUpdate();
      self._notify('filterChanged', [filter]);
      self._notify('itemsChanged', [result.data]);

      if (switcherStr) {
         self._misspellValue = switcherStr;
      }
   },

   abortCallback: function (self, filter) {
      self._loading = false;
      if (self._viewMode === 'search') {
         self._viewMode = self._previousViewMode;
         self._previousViewMode = null;
         self._searchValue = '';
         self._inputSearchValue = '';
         self._misspellValue = '';
         self._forceUpdate();
         self._notify('filterChanged', [filter]);
      }
   },

   searchStartCallback: function (self) {
      self._loading = true;

      /* need to call _forceUpdate, because searchStartCallback is not event handler,
         this is callback function that called asynchronously. */
      self._forceUpdate();
   },

   needUpdateSearchController: function (options, newOptions) {
      return !isEqual(options.navigation, newOptions.navigation) ||
         !isEqual(options.sorting, newOptions.sorting) ||
         options.searchDelay !== newOptions.searchDelay ||
         options.source !== newOptions.source ||
         options.searchParam !== newOptions.searchParam ||
         options.minSearchLength !== newOptions.minSearchLength;
   },
   itemOpenHandler: function () {
      _private.getSearchController(this).abort();
   }
};

/**
 * The search controller allows you to search data in a {@link Controls/list:View}
 * using any component with {@link Controls/Input/interface/IInputField} interface.
 * Search controller allows you:
 * 1) set delay before searching
 * 2) set number of characters
 * 3) set search parameter
 * 4) change the keyboard layout for an unsuccessful search
 * Note: Component with {@link Controls/Input/interface/IInputField} interface must be located in {@link Controls/_search/Input/Container}.
 *
 * More information you can read <a href='/doc/platform/developmentapl/interface-development/controls/filter-search/'>here</a>.
 *
 * <a href="/materials/demo/demo-ws4-explorer-with-search">Here</a>. you a demo with search in Controls/Explorer.
 *
 * @class Controls/_search/Controller
 * @extends Core/Control
 * @mixes Controls/interface/ISearch
 * @mixes Controls/interface/ISource
 * @mixes Controls/interface/IFilter
 * @mixes Controls/interface/INavigation
 * @author Герасимов А.М.
 * @control
 * @public
 */

var Container = Control.extend(/** @lends Controls/_search/Container.prototype */{

   _template: template,
   _dataOptions: null,
   _itemOpenHandler: null,
   _previousViewMode: null,
   _viewMode: null,
   _searchValue: null,
   _misspellValue: null,

   constructor: function () {
      this._itemOpenHandler = _private.itemOpenHandler.bind(this);
      Container.superclass.constructor.apply(this, arguments);
   },

   _beforeMount: function (options, context) {
      this._dataOptions = context.dataOptions;
      this._previousViewMode = this._viewMode = options.viewMode;

      if (options.searchValue) {
         this._search(null, options.searchValue);
      }
   },

   _beforeUpdate: function (newOptions, context) {
      var currentOptions = this._dataOptions;
      var filter;

      this._dataOptions = context.dataOptions;

      if (!isEqual(this._options.filter, newOptions.filter)) {
         filter = newOptions.filter;
      }

      if (this._searchController) {
         if (_private.needUpdateSearchController(currentOptions, this._dataOptions) || _private.needUpdateSearchController(this._options, newOptions)) {
            this._searchController.abort();
            this._searchController = null;
         } else if (filter) {
            this._searchController.setFilter(clone(filter));
         }
      }

      if (this._options.searchValue !== newOptions.searchValue) {
         this._search(null, newOptions.searchValue);
      }
   },

   _search: function (event, value, force) {
      _private.getSearchController(this).search(value, force);
      this._inputSearchValue = value;
   },

   _beforeUnmount: function () {
      if (this._searchController) {
         this._searchController.abort();
         this._searchController = null;
      }
      this._dataOptions = null;
   },

   _misspellCaptionClick: function () {
      this._search(null, this._misspellValue);
      this._misspellValue = '';
   }
});

Container.contextTypes = function () {
   return {
      dataOptions: DataOptions
   };
};

Container.getDefaultOptions = function () {
   return {
      minSearchLength: 3,
      searchDelay: 500
   };
};

Container._private = _private;

export = Container;


