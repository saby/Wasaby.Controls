define('Controls/Container/Input/Search',
   [
      'Core/Control',
      'wml!Controls/Container/Input/Search/Search',
      'UI/Utils'
   ],

   function(Control, template, UIUtils) {
      'use strict';

      var SearchContainer = Control.extend({

         _template: template,
         _value: '',

         constructor: function() {
            UIUtils.Logger.error('Controls/Container/Input/Search: Component is deprecated and will be deleted in 3.18.600, use Controls/search:InputContainer instead.', this);
            SearchContainer.superclass.constructor.apply(this, arguments);
         },

         _notifySearch: function(value) {
            this._notify('search', [value], { bubbling: true });
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

      return SearchContainer;
   });
