define('Controls/Input/Number', [
   'Core/Control',
   'tmpl!Controls/Input/Number/Number',
   'WS.Data/Type/descriptor',
   'Controls/Input/Number/ViewModel',
   'Controls/Input/resources/InputHelper',

   'Controls/Input/resources/InputRender/InputRender',
   'tmpl!Controls/Input/resources/input'
], function (Control,
             template,
             types,
             NumberViewModel,
             inputHelper) {

   'use strict';
   var
      _private,
      NumberInput;

   _private = {
   };

   NumberInput = Control.extend({
      /**
       * Поле ввода числа.
       * @class Controls/Input/Number
       * @extends Controls/Control
       * @mixes Controls/Input/interface/IInputNumber
       * @mixes Controls/Input/interface/IInputPlaceholder
       * @mixes Controls/Input/interface/IValidation
       * @mixes Controls/Input/interface/IInputTag
       * @control
       * @public
       * @category Input
       */

      /**
       * @name Controls/Input/Number#precision
       * @cfg {Number} Количество знаков после запятой
       */

      /**
       * @name Controls/Input/Number#onlyPositive
       * @cfg {Boolean} Ввод только положительных чисел
       */

      /**
       * @name Controls/Input/Number#integersLength
       * @cfg {Number} Количество знаков до запятой
       */

      /**
       * @name Controls/Input/Number#showEmptyDecimals
       * @cfg {Boolean} Показывать нулевую дробную часть
       */

      _template: template,

      _caretPosition: null,

      constructor: function (options) {
         NumberInput.superclass.constructor.apply(this, arguments);

         this._value = options.value;

         this._numberViewModel = new NumberViewModel({
            onlyPositive: options.onlyPositive,
            integersLength: options.integersLength,
            precision: options.precision
         });
      },

      _beforeMount: function(options) {
         if (!this._numberViewModel.validate(options.value.replace(/ /g, ''))) {
            this._value = '';
         }
      },

      _beforeUpdate: function(newOptions) {
         if (this._options.value !== newOptions.value) {
            if (!this._numberViewModel.validate(newOptions.value.replace(/ /g, ''))) {
               this._value = '';
            } else {
               this._value = newOptions.value;
            }
         }
      },

      _afterUpdate: function(oldOptions) {
         if ((oldOptions.value !== this._options.value) && this._caretPosition) {
            this._children['input'].setSelectionRange(this._caretPosition, this._caretPosition);
            this._caretPosition = null;
         }

         this._numberViewModel.updateOptions({
            onlyPositive: this._options.onlyPositive,
            integersLength: this._options.integersLength,
            precision: this._options.precision
         });
      },

      _inputCompletedHandler: function () {
         var
            clearValue = this._value.replace(/ /g, ''),
            tmp = clearValue.split('.'),
            integers = tmp[0],
            decimals = tmp[1];

         //Если дробная часть пустая или нулевая, то нужно убрать её
         if (!parseInt(decimals, 10)) {
            this._notify('inputCompleted', [parseInt(integers, 10)]);
         } else {
            this._notify('inputCompleted', [parseFloat(clearValue)]);
         }
      },

      _notifyHandler: function (event, value) {
         this._notify(value);
      },

      _valueChangedHandler: function(e, value) {
         this._notify('valueChanged', [value]);
      },

      paste: function(text) {
         this._caretPosition = inputHelper.pasteHelper(this._children['inputRender'], this._children['realArea'], text);
      }
   });

   NumberInput.getOptionTypes = function () {
      return {
         precision: types(Number), //Точность (кол-во знаков после запятой)
         integersLength: types(Number), //Длина целой части
         onlyPositive: types(Boolean) //Только положительные значения
      };
   };

   return NumberInput;
});