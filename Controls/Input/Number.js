define('Controls/Input/Number', [
   'Core/Control',
   'Controls/Utils/tmplNotify',
   'tmpl!Controls/Input/Number/Number',
   'WS.Data/Type/descriptor',
   'Controls/Input/Number/ViewModel',
   'Controls/Input/resources/InputHelper',
   'Core/helpers/Function/runDelayed',

   'Controls/Input/resources/InputRender/InputRender',
   'tmpl!Controls/Input/resources/input'
], function(
   Control,
   tmplNotify,
   template,
   types,
   NumberViewModel,
   inputHelper,
   runDelayed) {

   /**
    * Number input.
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

   'use strict';

   var _private = {
      trimEmptyDecimals: function(self, target) {
         if (!self._options.showEmptyDecimals) {
            var
               processedVal = self._numberViewModel.getValue().replace(/\.0*$/g, '');
            self._numberViewModel.updateValue(processedVal);

            // Не меняется value у dom-элемента, при смене аттрибута value
            // Ошибка: https://online.sbis.ru/opendoc.html?guid=b29cc6bf-6574-4549-9a6f-900a41c58bf9
            target.value = self._numberViewModel.getDisplayValue();
         }
      }
   };

   var NumberInput = Control.extend({
      _template: template,

      _caretPosition: null,

      _notifyHandler: tmplNotify,

      _beforeMount: function(options) {
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

         //Если произошла фокусировка, то нужно выделить текст и поменять значение из модели.
         if (this._isFocus) {
            /**
             * TODO
             * В библиотеке dom.js есть ошибка, из-за которой на этапе _afterUpdate в инпуте может находиться старое значение
             * В 500-й версии перешли на библиотеку inferno, где этой ошибки нет
             * Добавляем у себя костыль с попытками повторно выделить текст, если он ещё не поменялся
             * В 500 костыль удален
             */
            trySelect.call(this, 0);
         }

         function trySelect(callCount) {
            //Подстраховка от зацикливания
            if (callCount > 20) {
               return;
            }

            if (this._children.input.value === this._numberViewModel.getValue()) {
               this._children.input.select();
               this._isFocus = false;
            } else {
               runDelayed(trySelect.bind(this, ++callCount));
            }
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

                  /*runDelayed(function() {
                     self._children.input.select();
                  });*/
               } else {
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
         this._caretPosition = inputHelper.pasteHelper(this._children.inputRender, this._children.realArea, text);
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
