define('Controls/Input/Number',
   [
      'Controls/Input/Base',
      'WS.Data/Type/descriptor',
      'Controls/Input/Number/ViewModel'
   ],
   function(Base, descriptor, ViewModel) {
      'use strict';

      /**
       * Controls that allows user to enter single-line number.
       * <a href="/materials/demo-ws4-input">Demo example.</a>.
       *
       * @class Controls/Input/Number
       * @extends Core/Control
       *
       * @mixes Controls/Input/interface/IInputTag
       * @mixes Controls/Input/interface/IPaste
       * @mixes Controls/Input/interface/IInputBase
       * @mixes Controls/Input/interface/IInputNumber
       * @mixes Controls/Input/interface/IInputPlaceholder
       * @mixes Controls/Input/resources/InputRender/InputRenderStyles
       *
       * @public
       * @demo Controls-demo/Input/Number/NumberPG
       *
       * @author Колесова П.С.
       */

      /**
       * @name Controls/Input/Number#precision
       * @cfg {Number} Number of characters in decimal part.
       * @remark
       * If the fractional part is not fully filled, the missing signs will be replaced by 0.
       * When the value is not set, the number of signs is unlimited.
       * @example
       * In this example you the _inputValue state of the control will store a number with a fractional part of equal 2 signs.
       * <pre>
       *    <Controls.Input.Number bind:value="_inputValue" precision="{{2}}"/>
       * </pre>
       */

      /**
       * @name Controls/Input/Number#onlyPositive
       * @cfg {Boolean} Determines whether only positive numbers can be entered in the field..
       * @variant true - only positive numbers can be entered in the field.
       * @variant false - positive and negative numbers can be entered in the field.
       * @default false
       * @example
       * In this example you _inputValue in the control state will store only a positive number.
       * <pre>
       *    <Controls.Input.Number bind:value="_inputValue" onlyPositive="{{true}}"/>
       * </pre>
       */

      /**
       * @name Controls/Input/Number#integersLength
       * @cfg {Number} Maximum integer part length.
       * @remark
       * When the value is not set, the integer part length is unlimited.
       * @example
       * In this example you the _inputValue in the control state will store a number with a integer part of no more than 10 signs.
       * <pre>
       *    <Controls.Input.Number bind:value="_inputValue" integersLength="{{10}}"/>
       * </pre>
       */

      /**
       * @name Controls/Input/Number#showEmptyDecimals
       * @cfg {Boolean} Determines whether trailing zeros are shown in the fractional part.
       * @variant true - trailing zeros are hidden in the fractional part.
       * @variant false - trailing zeros are shown in the fractional part.
       * @default false
       * @remark
       * The option is applied after the completed of the input.
       * @example
       * In this example you the _inputValue in the control state will store a number with a trailing  zeros in the fractional part.
       * <pre>
       *    <Controls.Input.Number bind:value="_inputValue" showEmptyDecimals="{{true}}"/>
       * </pre>
       */

      var _private = {
         hideEmptyDecimals: function(self) {
            if (self._viewModel.trimTrailingZeros()) {
               self._notifyValueChanged();
            }
         }
      };

      var NumberInput = Base.extend({
         _getViewModelOptions: function(options) {
            return {
               precision: options.precision,
               onlyPositive: options.onlyPositive,
               integersLength: options.integersLength
            };
         },

         _getViewModelConstructor: function() {
            return ViewModel;
         },

         _changeHandler: function() {
            if (!this._options.showEmptyDecimals) {
               _private.hideEmptyDecimals(this);
            }

            NumberInput.superclass._changeHandler.apply(this, arguments);
         },

         _focusInHandler: function() {
            NumberInput.superclass._focusInHandler.apply(this, arguments);

            this._viewModel.reactOnFocusIn();
         },

         _focusOutHandler: function() {
            NumberInput.superclass._focusOutHandler.apply(this, arguments);

            this._viewModel.reactOnFocusOut();
         }
      });

      NumberInput.getDefaultOptions = function() {
         var defaultOptions = Base.getDefaultOptions();

         defaultOptions.value = 0;
         defaultOptions.onlyPositive = false;
         defaultOptions.showEmptyDecimals = false;

         return defaultOptions;
      };

      NumberInput.getDefaultTypes = function() {
         var optionTypes = Base.getDefaultTypes();

         optionTypes.value = descriptor(Number);
         optionTypes.precision = descriptor(Number);
         optionTypes.onlyPositive = descriptor(Boolean);
         optionTypes.integersLength = descriptor(Number);
         optionTypes.showEmptyDecimals = descriptor(Boolean);

         return optionTypes;
      };

      return NumberInput;
   });
