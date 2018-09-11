define('Controls/Input/Suggest',
   [
      'Core/Control',
      'wml!Controls/Input/Suggest/Suggest',
      'WS.Data/Type/descriptor',
      'Controls/Input/Text/ViewModel',
      'Controls/Input/resources/InputRender/BaseViewModel',
      'Controls/Utils/tmplNotify',
      'css!Controls/Input/Suggest/Suggest'
   ],
   function(Control, template, types, BaseViewModel, tmplNotify) {
      
      /**
       * Input that suggests options as you are typing. Options are available for selection through the drop-down list.
       * Once selected, the selected value is displayed in the field. The field can be cleared by clicking on the appropriate icon.
       * <a href="/materials/demo-ws4-input">Демо-пример</a>.
       *
       * @class Controls/Input/Suggest
       * @extends Core/Control
       * @mixes Controls/Input/interface/ISearch
       * @mixes Controls/interface/ISource
       * @mixes Controls/interface/IFilter
       * @mixes Controls/Input/interface/ISuggest
       * @mixes Controls/interface/INavigation
       * @mixes Controls/Input/Suggest/SuggestStyles
       * @mixes Controls/Input/resources/InputRender/InputRenderStyles
       * @control
       * @public
       * @category Input
       * @demo Controls-demo/Input/Suggest/Suggest
       * @author Журавлев М.С.
       */
      
      'use strict';
      
      var _private = {
         initViewModel: function(self, options) {
            self._simpleViewModel = new BaseViewModel(this.getViewModelOptions(options));
         },

         getViewModelOptions: function(options) {
            return {
               value: options.value,
               maxLength: options.maxLength
            };
         }
      };
      
      var Suggest = Control.extend({
         
         _template: template,
         _notifyHandler: tmplNotify,
         _suggestState: false,
         _searchState: false,
         
         // <editor-fold desc="LifeCycle">
         
         _beforeMount: function(options) {
            this._searchStart = this._searchStart.bind(this);
            this._searchEnd = this._searchEnd.bind(this);
            _private.initViewModel(this, options || {});
         },
         
         _beforeUpdate: function(newOptions) {
            this._simpleViewModel.updateOptions(_private.getViewModelOptions(newOptions));
         },
         
         // </editor-fold>
         
         
         // <editor-fold desc="handlers">
         
         _changeValueHandler: function(event, value) {
            this._notify('valueChanged', [value]);
         },
         
         _choose: function(event, item) {
            /* move focus to input after select, because focus will be lost after closing popup  */
            this.activate();
            this._notify('choose', [item]);
            this._notify('valueChanged', [item.get(this._options.displayProperty)]);
         },
         
         _clearClick: function() {
            /* move focus to input after clear text, because focus will be lost after hiding cross  */
            this.activate();
            this._suggestState = false;
            this._notify('valueChanged', ['']);
         },
         
         _deactivated: function() {
            this._suggestState = false;
         },
   
         _searchStart: function() {
            this._searchState = true;
         },
         
         _searchEnd: function() {
            this._searchState = false;
         }
         
         // </editor-fold>
         
      });
      
      
      // <editor-fold desc="OptionsDesc">
      
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
      
      // </editor-fold>
      
      Suggest._private = _private;
      return Suggest;
   }
);
