define('Controls/Input/Number', [
   'Core/Control',
   'Controls/Utils/tmplNotify',
   'tmpl!Controls/Input/Number/Number',
   'WS.Data/Type/descriptor',
   'Controls/Input/Number/ViewModel',
   'Controls/Input/resources/InputHelper',
   'Core/helpers/Function/runDelayed',
   'Core/IoC'
], function(
   Control,
   tmplNotify,
   template,
   types,
   NumberViewModel,
   inputHelper,
   runDelayed,
   IoC
) {

   /**
    * A component are used to let the user enter a number.
    * To control the format of the input numbers, there is a {@link integersLength restriction of the integer part},
    * the {@link precision number of characters} and the {@link showEmptyDecimals display of useless zeros} in the fractional part.
    * <a href="/materials/demo-ws4-input">Демо-пример</a>.
    *
    * @class Controls/Input/Number
    * @extends Core/Control
    * @mixes Controls/Input/interface/IInputNumber
    * @mixes Controls/Input/interface/IInputPlaceholder
    * @mixes Controls/Input/interface/IValidation
    * @mixes Controls/Input/interface/IInputTag
    * @mixes Controls/Input/resources/InputRender/InputRenderStyles
    * @control
    * @public
    * @category Input
    * @demo Controls-demo/Input/Number/Number
    *
    * @author Журавлев Максим Сергеевич
    */

   /**
    * @name Controls/Input/Number#precision
    * @cfg {Number} Number of characters in decimal part.
    */

   /**
    * @name Controls/Input/Number#onlyPositive
    * @cfg {Boolean} Determines whether only positive numbers can be entered in the field.
    */

   /**
    * @name Controls/Input/Number#integersLength
    * @cfg {Number} Maximum integer part length.
    */

   /**
    * @name Controls/Input/Number#showEmptyDecimals
    * @cfg {Boolean} Determines whether trailing zeros are shown in the fractional part.
    */

   /**
    * @name Controls/Input/Number#textAlign
    * @cfg {String} Text align.
    * @variant left
    * @variant right
    * @default left
    */

   'use strict';

   var _private = {
      trimEmptyDecimals: function(self) {
         if (!self._options.showEmptyDecimals) {
            var
               processedVal = self._numberViewModel.getValue().replace(/\.0*$/g, '');
            self._numberViewModel.updateValue(processedVal);
         }
      }
   };

   var NumberInput = Control.extend({
      _template: template,

      _caretPosition: null,

      _notifyHandler: tmplNotify,

      _beforeMount: function(options) {
         if (options.integersLength <= 0) {
            IoC.resolve('ILogger').error('Number', 'Incorrect integers length: ' + options.integersLength + '. Integers length must be greater than 0.');
         }

         this._numberViewModel = new NumberViewModel({
            onlyPositive: options.onlyPositive,
            integersLength: options.integersLength,
            precision: options.precision,
            showEmptyDecimals: options.showEmptyDecimals,
            value: String(options.value)
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
      },

      _inputCompletedHandler: function(event, value) {
         this._notify('inputCompleted', [this._getNumericValue(value)]);
      },

      _valueChangedHandler: function(e, value) {
         this._notify('valueChanged', [this._getNumericValue(value)]);
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

      _focusinHandler: function() {
         var
            self = this,
            value = this._numberViewModel.getValue();

         if (this._options.precision !== 0 && value && value.indexOf('.') === -1) {
            value = this._numberViewModel.updateValue(value + '.0');
            if (!this._options.readOnly) {
               if (this._options.selectOnClick) {
                  runDelayed(function() {
                     self._children.input.select();
                  });
               } else {
                  runDelayed(function() {
                     self._children.input.setSelectionRange(value.length - 2, value.length - 2);
                  });
               }
            }
         }
      },

      _focusoutHandler: function() {
         _private.trimEmptyDecimals(this);
      },

      paste: function(text) {
         this._caretPosition = inputHelper.pasteHelper(this._children['inputRender'], this._children['realArea'], text);
      }
   });

   NumberInput.getDefaultOptions = function() {
      return {
         value: ''
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
