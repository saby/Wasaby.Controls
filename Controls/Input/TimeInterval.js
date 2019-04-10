define('Controls/Input/TimeInterval',
   [
      'Core/IoC',
      'Controls/Input/Base',
      'Controls/Input/TimeInterval/ViewModel',
      'wml!Controls/Input/Base/Base',
      'wml!Controls/Input/TimeInterval/TimeInterval',
      'css!Controls/Input/TimeInterval/TimeInterval'
   ],
   function(IoC, Base, ViewModel, baseTemplate, template) {
      'use strict';

      /**
       * Controls that allows user to enter some amount of time with the accuracy from day to seconds.
       * <a href="/materials/demo-ws4-input-timeinterval">Demo examples.</a>.
       *
       * @class Controls/Input/TimeInterval
       * @extends Core/Control
       * @mixes Controls/Input/interface/ITimeInterval
       * @mixes Controls/Input/interface/IInputBase
       * @mixes Controls/Input/interface/IInputField
       * @mixes Controls/Input/interface/IInputTag
       *
       * @control
       * @public
       * @demo Controls-demo/Input/TimeInterval/TimeIntervalPG
       * @author Водолазских А.А.
       * @category Input
       */

      var _private = {
         validateOptions: function(options) {
            if (typeof options.value !== 'object') {
               options.value = null;
               IoC.resolve('ILogger').error('TimeInterval', 'Value option should be object of TimeInterval.');
            }
         }
      };

      var TimeIntervalInput = Base.extend({
         _template: template,
         _baseTemplate: baseTemplate,
         _getViewModelOptions: function(options) {
            _private.validateOptions(options);
            return {
               value: options.value,
               mask: options.mask
            };
         },

         _getViewModelConstructor: function() {
            return ViewModel;
         },

         _changeHandler: function() {
            this._viewModel._autoComplete();
            TimeIntervalInput.superclass._changeHandler.apply(this, arguments);
            this._notifyValueChanged();
         },
         _focusInHandler: function() {
            TimeIntervalInput.superclass._focusInHandler.apply(this, arguments);
            this._viewModel.userEnter = true;
            this._notifyValueChanged();
         },

         _focusOutHandler: function() {
            TimeIntervalInput.superclass._focusOutHandler.apply(this, arguments);
            this._viewModel.userEnter = false;
            this._viewModel._autoComplete();
            this._notifyValueChanged();
         }
      });

      TimeIntervalInput.getDefaultOptions = function() {
         var defaultOptions = Base.getDefaultOptions();
         defaultOptions.value = null;
         return defaultOptions;
      };

      TimeIntervalInput.getOptionTypes = function() {
         var optionTypes = Base.getOptionTypes();
         delete optionTypes.value;
         return optionTypes;
      };

      return TimeIntervalInput;
   });
