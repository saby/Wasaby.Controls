import entity = require('Types/entity');
import Env = require('Env/Env');
import {Base, TextViewModel as ViewModel} from 'Controls/input';
import buttonsTemplate = require('wml!Controls/_search/Input/Buttons');
import Vdom = require('Vdom/Vdom');


/**
 * Controls that allows user to enter single-line text.
 * These are functionally identical to text inputs, but may be styled differently.
 *
 * <a href="/materials/demo-ws4-search-container">Demo with Input/Search and List control</a>.
 * <a href="/materials/demo-ws4-filter-search-new">Demo with Filter/Button, Input/Search and List control</a>.
 *
 * @class Controls/_search/Input/Search
 * @mixes Controls/Input/interface/IInputField
 * @mixes Controls/interface/IInputText
 * @mixes Controls/interface/IInputBase
 * @mixes Controls/interface/IPaste
 * @mixes Controls/interface/IInputPlaceholder
 * @mixes Controls/interface/ITooltip
 *
 * @ignoreOptions style
 *
 * @control
 * @public
 * @demo Controls-demo/Input/Search/SearchPG
 *
 * @category Input
 * @author Золотова Э.Е.
 */

/**
 * @name Controls/_search/Input/Search#searchButtonVisible
 * @cfg {Boolean} Determines whether to show the search icon.
 */

/**
 * @event Controls/_search/Input/Search#searchClick Occurs when search button is clicked.
 * @event Controls/Input/resetClick#resetClick Occurs when reset button is clicked.
 */

var _private = {
   isVisibleResetButton: function() {
      return !!this._options.value && !this._options.readOnly;
   },

   calculateStateButton: function() {
      return this._options.readOnly ? '_readOnly' : '';
   }
};

var Search = Base.extend({
   _roundBorder: true,

   get _renderStyle() {
      return 'search';
   },

   _getViewModelOptions: function(options) {
      return {
         maxLength: options.maxLength,
         constraint: options.constraint
      };
   },

   _getViewModelConstructor: function() {
      return ViewModel;
   },

   _initProperties: function() {
      Search.superclass._initProperties.apply(this, arguments);

      var CONTROL_NAME = 'Search';
      this._field.scope.controlName = CONTROL_NAME;
      this._readOnlyField.scope.controlName = CONTROL_NAME;

      this._afterFieldWrapper.template = buttonsTemplate;
      this._afterFieldWrapper.scope.isVisibleReset = _private.isVisibleResetButton.bind(this);
      this._afterFieldWrapper.scope.calculateState = _private.calculateStateButton.bind(this);
   },

   _changeHandler: function() {
      if (this._options.trim) {
         var trimmedValue = this._viewModel.displayValue.trim();

         if (trimmedValue !== this._viewModel.displayValue) {
            this._viewModel.displayValue = trimmedValue;
            this._notifyValueChanged();
         }
      }

      Search.superclass._changeHandler.apply(this, arguments);
   },

   _resetClick: function() {
      if (this._options.readOnly) {
         return;
      }

      this._notify('resetClick');

      this._viewModel.displayValue = '';
      this._notifyValueChanged();

      // move focus from clear button to input
      this.activate();
   },

   _searchClick: function() {
      if (this._options.readOnly) {
         return;
      }

      this._notify('searchClick');

      // move focus from search button to input
      this.activate();
   },
   _keyDownHandler: function(event) {
      // Это костыль, код будет удален в процесс выполнения проекта по горячим клавишам
      // https://online.sbis.ru/opendoc.html?guid=a2e1122b-ce07-4a61-9c04-dc9b6402af5d
      // если isTrusted = false, значит это мы запустили событие по горячим клавишам, его не надо повторно обрабатывать
      // клавиши home и end не обрабатываем, у поля ввода есть реакция на эти клавиши
      if (event.nativeEvent.isTrusted) {
         if (
            event.nativeEvent.which === Env.constants.key.pageDown ||
            event.nativeEvent.which === Env.constants.key.pageUp ||
            event.nativeEvent.which === Env.constants.key.down ||
            event.nativeEvent.which === Env.constants.key.up
         ) {

            var parents = Vdom.DOMEnvironment._goUpByControlTree(this._container);
            for (var i = 0; i < parents.length; i++) {
               var parent = parents[i];
               if (parent._$defaultActions && parent._$defaultActions[event.nativeEvent.which]) {
                  parent._$defaultActions[event.nativeEvent.which].action();
                  break;
               }
            }
         }
      }
   },
   _keyUpHandler: function(event) {
      if (event.nativeEvent.which === Env.constants.key.enter) {
         this._searchClick();
      }

      Search.superclass._keyUpHandler.apply(this, arguments);
   }
});

Search._theme.push('Controls/search');

Search.getOptionTypes = function getOptionsTypes() {
   var optionTypes = Base.getOptionTypes();

   /**
    * https://online.sbis.ru/opendoc.html?guid=00ca0ce3-d18f-4ceb-b98a-20a5dae21421
    * optionTypes.maxLength = descriptor(Number|null);
    */
   optionTypes.trim = entity.descriptor(Boolean);
   optionTypes.constraint = entity.descriptor(String);

   return optionTypes;
};

Search.getDefaultOptions = function getDefaultOptions() {
   var defaultOptions = Base.getDefaultOptions();

   defaultOptions.value = '';
   defaultOptions.trim = false;
   defaultOptions.placeholder = rk('Найти') + '...';
   defaultOptions.searchButtonVisible = true;

   return defaultOptions;
};

Search._private = _private;

export = Search;

