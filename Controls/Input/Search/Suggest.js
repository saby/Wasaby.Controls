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
         _suggestState: false,
         
         _changeValueHandler: function(event, value) {
            this._notify('valueChanged', [value]);
         },
         
         _choose: function(event, item) {
            this.activate();
            this._notify('choose', [item]);
            this._notify('valueChanged', [item.get(this._options.displayProperty)]);
         },
   
         _resetClick: function() {
            this._suggestState = false;
         },
   
         _deactivated: function() {
            this._suggestState = false;
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
            minSearchLength: 3
         };
      };
      
      return Suggest;
   }
);
