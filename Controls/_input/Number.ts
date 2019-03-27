import Env = require('Env/Env');
import Base = require('Controls/_input/Base');
import entity = require('Types/entity');
import ViewModel = require('Controls/_input/Number/ViewModel');


      /**
       * Controls that allows user to enter single-line number.
       * <a href="/materials/demo-ws4-input">Demo example.</a>.
       *
       * @class Controls/_input/Number
       * @extends Controls/_input/Base
       *
       * @mixes Controls/_input/interface/IInputBase
       * @mixes Controls/_input/interface/IOnlyPositive
       * @mixes Controls/_input/interface/IInputNumber
       *
       * @public
       * @demo Controls-demo/Input/Number/NumberPG
       *
       * @author Журавлев М.С.
       */

      /**
       * @name Controls/_input/Number#precision
       * @cfg {Number} Number of characters in decimal part.
       * @remark
       * If the fractional part is not fully filled, the missing signs will be replaced by 0.
       * When the value is not set, the number of signs is unlimited.
       * @example
       * In this example you the _inputValue state of the control will store a number with a fractional part of equal 2 signs.
       * <pre>
       *    <Controls._input.Number bind:value="_inputValue" precision="{{2}}"/>
       * </pre>
       */

      /**
       * @name Controls/_input/Number#integersLength
       * @cfg {Number} Maximum integer part length.
       * @remark
       * When the value is not set, the integer part length is unlimited.
       * @example
       * In this example you the _inputValue in the control state will store a number with a integer part of no more than 10 signs.
       * <pre>
       *    <Controls._input.Number bind:value="_inputValue" integersLength="{{10}}"/>
       * </pre>
       */

      /**
       * @name Controls/_input/Number#showEmptyDecimals
       * @cfg {Boolean} Determines whether trailing zeros are shown in the fractional part.
       * @default false
       * @remark
       * The option is applied after the completed of the input.
       * true - trailing zeros are shown in the fractional part.
       * false - trailing zeros are hidden in the fractional part.
       * @example
       * In this example you the _inputValue in the control state will store a number with a trailing  zeros in the fractional part.
       * <pre>
       *    <Controls._input.Number bind:value="_inputValue" showEmptyDecimals="{{true}}"/>
       * </pre>
       */

      /**
       * @name Controls/_input/Number#useGrouping
       * @cfg {Boolean} Determines whether to use grouping separators, such as thousands separators.
       * @default true
       * @remark
       * true - the number is separated into grouping.
       * false - does not do anything.
       */

      var _private = {
         validateOptions: function(options) {
            if (options.integersLength <= 0) {
               Env.IoC.resolve('ILogger').error('Number', 'Incorrect integers length: ' + options.integersLength + '. Integers length must be greater than 0.');
            }
         },
         convertToNumber: function (value) {
             return value === null ? void 0 : value;
         }
      };

      var NumberInput = Base.extend({
         _getViewModelOptions: function(options) {
            _private.validateOptions(options);

            return {
               precision: _private.convertToNumber(options.precision),
               useGrouping: options.useGrouping,
               onlyPositive: options.onlyPositive,
               integersLength: _private.convertToNumber(options.integersLength),
               showEmptyDecimals: options.showEmptyDecimals
            };
         },

         _getViewModelConstructor: function() {
            return ViewModel;
         },

         _changeHandler: function() {
            if (this._viewModel.trimTrailingZeros(true)) {
               this._notifyValueChanged();
            }

            NumberInput.superclass._changeHandler.apply(this, arguments);
         },

         _focusInHandler: function() {
            if (this._viewModel.addTrailingZero()) {
               this._notifyValueChanged();
            }

            NumberInput.superclass._focusInHandler.apply(this, arguments);
         },

         _focusOutHandler: function() {
            if (this._viewModel.trimTrailingZeros(false)) {
               this._notifyValueChanged();
            }

            NumberInput.superclass._focusOutHandler.apply(this, arguments);
         }
      });

      NumberInput.getDefaultOptions = function() {
         var defaultOptions = Base.getDefaultOptions();

         defaultOptions.value = 0;
         defaultOptions.useGrouping = true;
         defaultOptions.onlyPositive = false;
         defaultOptions.showEmptyDecimals = false;

         return defaultOptions;
      };

      NumberInput.getOptionTypes = function() {
         var optionTypes = Base.getOptionTypes();

         /**
          * https://online.sbis.ru/opendoc.html?guid=00ca0ce3-d18f-4ceb-b98a-20a5dae21421
          * optionTypes.value = descriptor(Number|null);
          * optionTypes.precision = descriptor(Number|null);
          * optionTypes.integersLength = descriptor(Number|null);
          */
         delete optionTypes.value;

         optionTypes.useGrouping = entity.descriptor(Boolean);
         optionTypes.onlyPositive = entity.descriptor(Boolean);
         optionTypes.showEmptyDecimals = entity.descriptor(Boolean);

         return optionTypes;
      };

      export = NumberInput;
   
