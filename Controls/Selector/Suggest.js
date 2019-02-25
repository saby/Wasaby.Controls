define('Controls/Selector/Suggest',
   [
      'Core/Control',
      'wml!Controls/Selector/Suggest/Suggest',
      'Controls/Controllers/SourceController',
      'Controls/Input/resources/InputRender/BaseViewModel',
      'Types/util',
      'Types/entity'
   ],
   function(Control, template, SourceController, BaseViewModel, util, entity) {
      'use strict';

      /**
       * Combobox input that suggests options as you are typing.
       *
       * @class Controls/Input/ComboBox/Suggest
       * @extends Controls/Input/Text
       * @mixes Controls/Input/interface/ISearch
       * @mixes Controls/interface/ISource
       * @mixes Controls/interface/IFilter
       * @mixes Controls/Input/interface/ISuggest
       * @mixes Controls/interface/INavigation
       * @demo Controls-demo/Input/Search/Suggest/SuggestPG
       * @control
       * @public
       * @category Input
       */

      var _private = {
         loadSelectedItem: function(self, options) {
            var filter = {};
            filter[options.keyProperty] = options.selectedKey;
            self._sourceController = new SourceController({
               source: options.source
            });
            return self._sourceController.load(filter).addCallback(function(items) {
               var value = util.object.getPropertyValue(items.at(0), options.displayProperty);
               _private.createViewModel(self, value);
               return items;
            });
         },

         createViewModel: function(self, value) {
            self._value = value;
            self._simpleViewModel = new BaseViewModel({
               value: value
            });
         },

         updateValue: function(self, value) {
            self._value = value;
            self._simpleViewModel.updateOptions({
               value: value
            });
         }
      };


      var Suggest = Control.extend({

         _template: template,
         _suggestState: false,

         _beforeMount: function(options) {
            if (options.selectedKey) {
               return _private.loadSelectedItem(this, options).addCallback(function(items) {
                  return items;
               });
            } else {
               _private.createViewModel(this, options.value || '');
            }
         },

         _changeValueHandler: function(event, value) {
            if (value !== this._value) {
               _private.updateValue(this, value);
               this._notify('valueChanged', [value]);
            }
         },

         _choose: function(event, item) {
            this.activate();
            _private.updateValue(this, item.get(this._options.displayProperty) || '');
            this._notify('selectedKey', [item.get(this._options.keyProperty)]);
            this._notify('valueChanged', [this._value]);
         },

         _beforeUpdate: function(newOptions) {
            if (this._options.suggestState !== newOptions.suggestState) {
               this._suggestState = newOptions.suggestState;
            }
            if (this._options.value !== newOptions.value) {
               _private.updateValue(this, newOptions.value);
            }
            if (newOptions.selectedKey && (newOptions.selectedKey !== this._options.selectedKey ||
               newOptions.source !== this._options.source)) {
               var self = this;
               return _private.loadSelectedItem(this, newOptions).addCallback(function(items) {
                  _private.updateValue(self, self._value);
                  self._forceUpdate();
                  return items;
               });
            }
         },

         _open: function() {
            if (!this._options.autoDropDown) {
               this._suggestState = !this._suggestState;
            } else if (this._suggestState) {
               this._suggestState = false;
            }

            this.activate();
         },

         _suggestStateChanged: function(event, value) {
            this._suggestState = value;
         },

         _deactivated: function() {
            this._suggestState = false;
         }

      });

      Suggest.getOptionTypes = function() {
         return {
            displayProperty: entity.descriptor(String).required(),
            suggestTemplate: entity.descriptor(Object).required(),
            searchParam: entity.descriptor(String).required()
         };
      };

      Suggest.getDefaultOptions = function() {
         return {
            minSearchLength: 3,
            suggestState: false
         };
      };

      return Suggest;
   });
