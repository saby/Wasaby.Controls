define('Controls/Search/Input/Container',
   [
      'Core/Control',
      'wml!Controls/Search/Input/Container'
   ],
   
   function(Control, template) {
      
      /**
       * Special container for component with {@link Controls/Input/interface/IInputText}.
       * Listens for child's "valueChanged" event and notify bubbling event "search".
       * NOTE: must be located inside {@link Controls/Search/Controller}.
       *
       * More information you can read <a href='/doc/platform/developmentapl/interface-development/ws4/components/filter-search/'>here</a>.
       *
       * @class Controls/Search/Input/Container
       * @extends Core/Control
       * @author Герасимов А.М.
       * @control
       * @public
       */
      
      'use strict';
      
      var SearchContainer = Control.extend(/** @lends Controls/Search/Input/Container.prototype */{
         
         _template: template,
         _value: '',

         _beforeMount: function(newOptions) {
            this._value = newOptions.searchValue;
         },

         _beforeUpdate: function(newOptions) {
            if (this._options.searchValue !== newOptions.searchValue) {
               this._value = newOptions.searchValue;
            }
         },

         _notifySearch: function(value) {
            this._notify('search', [value], {bubbling: true});
         },
         
         _valueChanged: function(event, value) {
            this._value = value;
            this._notifySearch(value);
         },
         
         _searchClick: function() {
            this._notifySearch(this._value);
         },
         
         _resetClick: function() {
            this._notifySearch('');
         },
         
         _keyDown: function(event) {
            if (event.nativeEvent.keyCode === 13) {
               this._notifySearch(this._value);
            }
         }
      });

      SearchContainer.getDefaultOptions = function() {
         return {
            searchValue: ''
         };
      };

      return SearchContainer;
   });
