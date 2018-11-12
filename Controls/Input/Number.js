define('Controls/Input/Number',
   [
      'Core/Control',
      'Controls/Utils/tmplNotify',
      'wml!Controls/Input/Number/Number',
      'WS.Data/Type/descriptor',
      'Controls/Input/Number/ViewModel',
      'Controls/Input/resources/InputHelper',
      'Core/helpers/Function/runDelayed',
      'Core/IoC',
      'Core/detection'
   ],
   function(Control, tmplNotify, template, types, NumberViewModel, inputHelper, runDelayed, IoC, detection) {

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
         trimEmptyDecimals: function(self, target) {
            if (!self._options.showEmptyDecimals) {
               var processedVal = self._numberViewModel.getValue().replace(/\.0*$/g, '');
               var selectionStart = target.selectionStart;
               var selectionEnd = target.selectionEnd;

               self._numberViewModel.updateValue(processedVal);

               // Не меняется value у dom-элемента, при смене аттрибута value
               // Ошибка: https://online.sbis.ru/opendoc.html?guid=b29cc6bf-6574-4549-9a6f-900a41c58bf9
               target.value = self._numberViewModel.getDisplayValue();

               /**
                * If you change the value from code, as we do above, the selection is set to the end. Therefore, it must be restored.
                * In ie, if the selection changes, the field will be automatically focused.
                * If the current method is called during the focus out, the focus field will not lose. Therefore, remember the selection.
                *
                * Changing the value in the focus out field is only in the number field. Therefore, the code is not needed for all fields.
                */
               if (detection.isIE) {
                  self._selectionStart = selectionStart;
                  self._selectionEnd = selectionEnd;
               } else {
                  target.selectionStart = selectionStart;
                  target.selectionEnd = selectionEnd;
               }
            }
         }
      };

      var NumberInput = Control.extend({
         _template: template,

         _caretPosition: null,

         // We should store previous value, so we could notify it when only '-' left in a field
         _previousValue: undefined,

         _notifyHandler: tmplNotify,

         _beforeMount: function(options) {
            if (options.integersLength <= 0) {
               IoC.resolve('ILogger').error('Number', 'Incorrect integers length: ' + options.integersLength + '. Integers length must be greater than 0.');
            }
            var value = options.value !== null ? String(options.value) : '';
            this._previousValue = String(options.value);

            this._numberViewModel = new NumberViewModel({
               onlyPositive: options.onlyPositive,
               integersLength: options.integersLength,
               precision: options.precision,
               showEmptyDecimals: options.showEmptyDecimals,
               value: value
            });
         },

         _beforeUpdate: function(newOptions) {
            var
               value;

            if (newOptions.integersLength <= 0) {
               IoC.resolve('ILogger').error('Number', 'Incorrect integers length: ' + newOptions.integersLength + '. Integers length must be greater than 0.');
            }

            //If the old and new values are the same, then the model is changed from outside, and we shouldn't update it's value
            if (this._options.value === newOptions.value) {
               value = this._numberViewModel.getValue();
            } else {
               value = newOptions.value !== undefined ? String(newOptions.value) : '';
            }

            this._numberViewModel.updateOptions({
               onlyPositive: newOptions.onlyPositive,
               integersLength: newOptions.integersLength,
               precision: newOptions.precision,
               showEmptyDecimals: newOptions.showEmptyDecimals,
               value: value
            });
         },

         _afterUpdate: function() {
            if (this._caretPosition) {
               this._children['input'].setSelectionRange(this._caretPosition, this._caretPosition);
               this._caretPosition = null;
            }

            //Если произошла фокусировка, то нужно выделить текст и поменять значение из модели.
            if (this._isFocus) {
               this._children.input.select();
               this._isFocus = false;
            }
         },

         _inputCompletedHandler: function(event, value) {
            // Convert different interpretations of null(like -0, 0000, -000) to '0'.
            if (this._options.precision === 0 && this._getNumericValue(value) === 0) {
               value = '0';
               this._numberViewModel.updateValue(value);
            }
            this._notify('inputCompleted', [this._getNumericValue(value)]);
         },

         _valueChangedHandler: function(e, value) {
            if (value === '-') {
               this._notify('valueChanged', [this._getNumericValue(this._previousValue)]);
            } else {
               this._notify('valueChanged', [this._getNumericValue(value)]);
            }

            this._previousValue = value;
         },

         /**
       * Transforms value with delimiters into number
       * @param value
       * @return {*}
       * @private
       */
         _getNumericValue: function(value) {
            var
               val = parseFloat(value.replace(/ /g, ''));
            return isNaN(val) ? undefined : val;
         },

         _focusinHandler: function(e) {
            var
               self = this,
               value = this._numberViewModel.getValue();

            if (this._options.precision !== 0 && value && value.indexOf('.') === -1) {
               value = this._numberViewModel.updateValue(value + '.0');

               // Не меняется value у dom-элемента, при смене аттрибута value
               // Ошибка: https://online.sbis.ru/opendoc.html?guid=b29cc6bf-6574-4549-9a6f-900a41c58bf9
               e.target.value = this._numberViewModel.getDisplayValue();

               if (!this._options.readOnly) {
                  if (this._options.selectOnClick) {
                     this._isFocus = true;
                  } else {
                  // TODO: сделать аналогично как input.select() https://online.sbis.ru/opendoc.html?guid=6136ae81-ef5a-4267-9d04-a416eabacfdc
                     runDelayed(function() {
                        self._children.input.setSelectionRange(value.length - 2, value.length - 2);
                     });
                  }
               }
            }
         },

         _focusoutHandler: function(e) {
            _private.trimEmptyDecimals(this, e.target);
         },

         paste: function(text) {
            var field = this._children.input;
            var selection;

            /**
             * In ie and inactive state the selection is stored on the instance.
             */
            if (!this._active && detection.isIE) {
               selection = {
                  start: this._selectionStart,
                  end: this._selectionEnd
               };
            }

            this._caretPosition = inputHelper.pasteHelper(this._children.inputRender, this._children.input, text, selection);
         }
      });

      NumberInput.getDefaultOptions = function() {
         return {
            value: '',
            selectOnClick: false
         };
      };

      NumberInput.getOptionTypes = function() {
         return {
            precision: types(Number), //Точность (кол-во знаков после запятой)
            integersLength: types(Number), //Длина целой части
            onlyPositive: types(Boolean), //Только положительные значения
            showEmptyDecimals: types(Boolean) //Показывать нули в конце дробной части
         };
      };

      NumberInput._private = _private;

      return NumberInput;
   });
