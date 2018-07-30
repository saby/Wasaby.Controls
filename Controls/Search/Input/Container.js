define('Controls/Search/Input/Container',
   [
      'Core/Control',
      'tmpl!Controls/Search/Input/Container'
   ],
   
   function(Control, template) {
      
      /**
       * Container component for Input
       * Notify bubbling event "search".
       * Should be located inside Controls/Search/Container.
       *
       * Here you can see a <a href="/materials/demo-ws4-filter-search-new">demo</a>.
       *
       * @class Controls/Search/Input/Container
       * @extends Core/Control
       * @author Герасимов Александр
       * @control
       * @public
       */
      
      'use strict';
      
      var SearchContainer = Control.extend(/** @lends Controls/Search/Input/Container.prototype */{
         
         _template: template,
         _value: '',
         
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
      
      return SearchContainer;
   });
