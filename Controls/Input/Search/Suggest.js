define('Controls/Input/Search/Suggest',
   [
      'Core/Control',
      'tmpl!Controls/Input/Search/Suggest',
      'WS.Data/Type/descriptor',
      'Controls/Input/Search'
   ],
   function(Control, template, types) {
      
      'use strict';
   
      /**
       * Search input that suggests options as you are typing.
       *
       * @class Controls/Input/Suggest
       * @extends Controls/Input/Text
       * @mixes Controls/Input/interface/ISearch
       * @mixes Controls/interface/ISource
       * @mixes Controls/interface/IFilter
       * @mixes Controls/Input/interface/ISuggest
       * @mixes Controls/interface/INavigation
       * @control
       * @public
       * @category Input
       */
   
   
      var Suggest = Control.extend({
         
         _template: template,
         
         _changeValueHandler: function(event, value) {
            this._notify('valueChanged', [value]);
         },
         
         _choose: function(event, item) {
            this.activate();
            this._notify('choose', [item]);
            this._notify('valueChanged', [item.get(this._options.displayProperty)]);
         },
   
         _suggestStateChanged: function(event, value) {
            this._notify('suggestStateChanged', [value]);
         },
   
         _deactivated: function() {
            this._notify('suggestStateChanged', [false]);
         },
   
         _searchClick: function() {
            this._notify('searchClick');
         },
         
         _resetClick: function() {
            this._notify('resetClick');
         }
         
      });
   
      Suggest.getOptionTypes = function() {
         return {
            displayProperty: types(String).required(),
            suggestTemplate: types(Object).required(),
            searchParam: types(String).required()
         };
      };
   
      Suggest.getDefaultOptions = function() {
         return {
            minSearchLength: 3,
            suggestState: false
         };
      };
      
      return Suggest;
   }
);
