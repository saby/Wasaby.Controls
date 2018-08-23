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

         /**
          * TODO: Добавлено по https://online.sbis.ru/opendoc.html?guid=7f1dc55d-86c1-4f9b-ac07-b9f9e8284671
          * Избавиться от костыля по https://online.sbis.ru/opendoc.html?guid=6136ae81-ef5a-4267-9d04-a416eabacfdc
          */
         if (this._isFocus) {
            //Пробуем выделить текст, если он уже поменялся в поле.
            //Если не поменялся, то пробуем снова
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

      _focusinHandler: function() {
         var
            self = this,
            value = this._numberViewModel.getValue();

         if (this._options.precision !== 0 && value && value.indexOf('.') === -1) {
            value = this._numberViewModel.updateValue(value + '.0');
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
