import Control = require('Core/Control');
import template = require('wml!Controls/Search/Input/Container');

/**
 * Special container for component with {@link Controls/Input/interface/IInputField}.
 * Listens for child's "valueChanged" event and notify bubbling event "search".
 * NOTE: must be located inside {@link Controls/Search/Controller}.
 *
 * More information you can read <a href='/doc/platform/developmentapl/interface-development/ws4/components/filter-search/'>here</a>.
 *
 * <a href="/materials/demo/demo-ws4-explorer-with-search">Here</a>. you a demo with search in Controls/Explorer.
 *
 * @class Controls/Search/Input/Container
 * @extends Core/Control
 * @author Герасимов А.М.
 * @control
 * @public
 */



var SearchContainer = Control.extend(/** @lends Controls/Search/Input/Container.prototype */{

   _template: template,
   _value: '',

   _beforeMount: function (newOptions) {
      this._value = newOptions.inputSearchValue;
   },

   _beforeUpdate: function (newOptions) {
      if (this._options.inputSearchValue !== newOptions.inputSearchValue) {
         this._value = newOptions.inputSearchValue;
      }
   },

   _notifySearch: function (value, force) {
      this._notify('search', [value || '', force], {bubbling: true});
   },

   _valueChanged: function (event, value) {
      this._value = value;
      this._notifySearch(value);
   },

   _searchClick: function () {
      this._notifySearch(this._value, true);
   },

   _resetClick: function () {
      this._notifySearch('');
   },

   _keyDown: function (event) {
      if (event.nativeEvent.keyCode === 13) {
         this._notifySearch(this._value, true);
      }
   }
});

SearchContainer.getDefaultOptions = function () {
   return {
      searchValue: ''
   };
};

export = SearchContainer;

