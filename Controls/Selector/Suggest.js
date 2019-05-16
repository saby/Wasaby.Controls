define('Controls/Selector/Suggest',
   [
      'Core/Control',
      'wml!Controls/Selector/Suggest/Suggest',
      'Controls/source',
      'Controls/history',
      'Types/util',
      'Types/entity',
      'Core/core-merge',
      'css!Controls/Selector/Suggest/Suggest'
   ],
   function(Control, template, scroll, history, util, entity, Merge) {
      'use strict';

      /**
       * Combobox input that suggests options as you are typing.
       * <a href="/materials/demo-ws4-selector-suggest">Demo-example</a>.
       *
       * @class Controls/Selector/Suggest
       * @extends Controls/input:Text
       * @mixes Controls/interface/ISearch
       * @mixes Controls/interface/ISource
       * @mixes Controls/interface/IFilter
       * @mixes Controls/interface/ISuggest
       * @mixes Controls/interface/INavigation
       * @demo Controls-demo/Input/Search/Suggest/SuggestPG
       * @control
       * @public
       */

      var _private = {
         loadSelectedItem: function(self, options) {
            var filter = {};
            filter[options.keyProperty] = options.selectedKey;
            self._sourceController = new scroll.Controller({
               source: options.source
            });
            return self._sourceController.load(filter).addCallback(function(items) {
               _private.setValue(self, items.at(0), options.displayProperty);
               return items.at(0);
            });
         },

         setValue: function(self, item, displayProperty) {
            var value = util.object.getPropertyValue(item, displayProperty);
            _private.updateValue(self, value);
         },

         updateValue: function(self, value) {
            self._value = value;
         },

         prepareSuggestTemplate: function(displayProperty, suggestTemplate) {
            var suggestTemplateConfig = { templateOptions: { displayProperty: displayProperty } };
            return Merge(suggestTemplateConfig, suggestTemplate);
         },

         createHistorySource: function(historyId, source) {
            return new history.Source({
               originSource: source,
               historySource: new history.Service({
                  historyId: historyId
               })
            });
         }
      };

      var Suggest = Control.extend({

         _template: template,
         _suggestState: false,
         _searchValue: '',

         _beforeMount: function(options, context, receivedState) {
            this._suggestTemplate = _private.prepareSuggestTemplate(options.displayProperty, options.suggestTemplate);
            if (options.historyId) {
               this._historySource = _private.createHistorySource(options.historyId, options.source);
            }
            if (receivedState) {
               _private.setValue(this, receivedState, options.displayProperty);
            } else if (options.selectedKey) {
               return _private.loadSelectedItem(this, options);
            } else {
               _private.updateValue(this, '');
               this._searchValue = '';
            }
         },

         _changeValueHandler: function(event, value) {
            if (value !== this._value) {
               _private.updateValue(this, value);
               this._searchValue = value;
               this._notify('selectedKeyChanged', [null]);
               this._notify('valueChanged', [value]);
            }
         },

         _choose: function(event, item) {
            this.activate();
            _private.updateValue(this, item.get(this._options.displayProperty) || '');
            if (this._options.historyId && item.get(this._options.keyProperty) !== undefined) {
               this._historySource.update(item, { $_history: true });
            }
            this._searchValue = '';
            this._notify('selectedKeyChanged', [item.get(this._options.keyProperty)]);
            this._notify('valueChanged', [this._value]);
         },

         _beforeUpdate: function(newOptions) {
            if (newOptions.source !== this._options.source && newOptions.historyId) {
               this._historySource = _private.createHistorySource(newOptions.historyId, newOptions.source);
            }
            if (this._options.suggestState !== newOptions.suggestState) {
               this._suggestState = newOptions.suggestState;
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
            suggestState: false,
            suggestTemplate: {
               templateName: 'Controls/suggestPopup:SuggestTemplate'
            }
         };
      };

      Suggest._private = _private;

      return Suggest;
   });
