define('Controls/Input/Number', [
   'Core/Control',
   'tmpl!Controls/Input/Number/Number',
   'WS.Data/Type/descriptor',
   'Controls/Input/Number/ViewModel',
   'Controls/Input/resources/InputHelper',
   'Core/helpers/Function/runDelayed',

   'Controls/Input/resources/InputRender/InputRender',
   'tmpl!Controls/Input/resources/input'
], function(
   Control,
   template,
   types,
   NumberViewModel,
   inputHelper,
   runDelayed) {

   'use strict';
   var
      _private,
      NumberInput;

   _private = {
      trimEmptyDecimals: function(self) {
         if (!self._options.showEmptyDecimals) {
            var
               processedVal = self._numberViewModel.getValue().replace(/\.0*$/g, '');
            self._numberViewModel.updateValue(processedVal);
         }
      }
   };

   NumberInput = Control.extend({

      /**
       * Number input.
       *
       * @class Controls/Input/Number
       * @extends Core/Control
       * @mixes Controls/Input/interface/IInputNumber
       * @mixes Controls/Input/interface/IInputPlaceholder
       * @mixes Controls/Input/interface/IValidation
       * @mixes Controls/Input/interface/IInputTag
       * @control
       * @public
       * @category Input
       * @author Баранов М.А.
       * @demo Controls-demo/Input/Number/Number
       */

      /**
       * @name Controls/Input/Number#precision
       * @cfg {Number} Number of characters in decimal part.
       */

      /**
       * @name Controls/Input/Number#onlyPositive
       * @cfg {Boolean} Allow only positive numbers.
       */

      /**
       * @name Controls/Input/Number#integersLength
       * @cfg {Number} Maximum integer part length.
       */

      /**
       * @name Controls/Input/Number#showEmptyDecimals
       * @cfg {Boolean} Show zeros when decimal part wasn't entered.
       */

      /**
       * @name Controls/Input/Number#textAlign
       * @cfg {String} Text align.
       * @variant 'left' default
       * @variant 'right'
       */

      _template: template,

      _caretPosition: null,

      constructor: function(options) {
         NumberInput.superclass.constructor.apply(this, arguments);

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

      _notifyHandler: function(event, value) {
         this._notify(value);
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
         value: types(String),
         precision: types(Number), //Точность (кол-во знаков после запятой)
         integersLength: types(Number), //Длина целой части
         onlyPositive: types(Boolean), //Только положительные значения
         showEmptyDecimals: types(Boolean) //Показывать нули в конце дробной части
      };
   };

   NumberInput._private = _private;

   return NumberInput;
});
