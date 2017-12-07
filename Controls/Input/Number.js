define('js!Controls/Input/Number', [
   'Core/Control',
   'tmpl!Controls/Input/Number/Number',
   'js!WS.Data/Type/descriptor',
   'Controls/Input/resources/PrepareData',

   'js!Controls/Input/resources/InputRender/InputRender',
   'tmpl!Controls/Input/resources/input'
], function (Control,
             template,
             types,
             PrepareData) {

   'use strict';
   var
      _private,
      NumberInput;

   _private = {
      /**
       * Валидирует значение splitValue
       * @param splitValue
       * @param onlyPositive
       * @param integersLength
       * @param precision
       * @returns {boolean}
       */
      validate: function(splitValue, onlyPositive, integersLength, precision) {
         var
            clearVal = _private.getClearValue(splitValue);

         if (
            !_private.validators.isNumber(clearVal) ||
            typeof onlyPositive !== 'undefined' && !_private.validators.onlyPositive(clearVal) ||
            typeof integersLength !== 'undefined' && !_private.validators.maxIntegersLength(clearVal, integersLength) ||
            typeof precision !== 'undefined' && !_private.validators.maxDecimalsLength(clearVal, precision)
         ) {
            return false;
         }

         return true;
      },

      //Набор валидаторов для числа
      validators: {
         //Проверяет что строка является числом и не содержит недопустимых символов
         isNumber: function(valueToValidate) {
            return valueToValidate.match(/^\-?\d*(\.\d*)?$/);
         },
         //Только положительные значения
         onlyPositive: function(valueToValidate) {
            return valueToValidate[0] !== '-';
         },
         //Ограничение максимальной длины целой части
         maxIntegersLength: function(valueToValidate, maxLength) {
            var
               integers = valueToValidate.split('.')[0].replace('-', '');
            return !maxLength || integers.length <= maxLength;
         },
         //Ограничение максимальной длины дробной части
         maxDecimalsLength: function(valueToValidate, maxLength) {
            var
               decimals = valueToValidate.split('.')[1] || '';

               //Если дробная часть запрещена, то нельзя давать ввести точку
               if (maxLength === 0) {
                  return !~valueToValidate.indexOf('.');
               }

            return !maxLength || decimals.length <= maxLength;
         }
      },

      /**
       * Возвращает значение инпута без разделительных пробелов
       * @param splitValue
       * @returns {String}
       */
      getClearValue: function(splitValue) {
         return _private.concatSplitValue(splitValue).replace(/ /g, '');
      },

      /**
       * Возвращает значение инпута в виде строки
       * @param splitValue
       * @returns {String}
       */
      concatSplitValue: function(splitValue) {
         return splitValue.before + splitValue.insert + splitValue.after;
      },

      /**
       * Возвращает готовую строку с разделителями
       * @param splitValue
       * @returns {String}
       */
      getValueWithDelimiters: function(splitValue) {
         var
            clearValSplited = _private.getClearValue(splitValue).split('.');

         //Разбиваем на триады только часть до точки
         clearValSplited[0] = clearValSplited[0].replace(/(\d)(?=(\d{3})+$)/g, '$& ');

         return clearValSplited.join('.');
      },

      /**
       * Возвращает позицию курсора с учетом разделителей
       * @param splitValue
       * @param shift {Integer} дополнительный сдвиг курсора, на случай если он должен стоять не сразу после введённого значения
       * @returns {Integer}
       */
      getCursorPosition: function (splitValue, shift) {
         var
            beforeNewDelimetersSpacesCnt = _private.concatSplitValue(splitValue).split(' ').length - 1,
            afterNewDelimetersSpacesCnt = _private.getValueWithDelimiters(splitValue).split(' ').length - 1,
            spacesCntDiff = afterNewDelimetersSpacesCnt - beforeNewDelimetersSpacesCnt;

         return splitValue.before.length + splitValue.insert.length + spacesCntDiff + shift;
      },

      /**
       * Валидирует и подготавливает новое значение по splitValue
       * @param splitValue
       * @returns {{value: (*|String), position: (*|Integer)}}
       */
      prepareData: function (splitValue) {
         var
            shift = 0;

         _private.splitValue = splitValue;

         //Если был удалён пробел, то нужно удалить цифру слева от него и сдвинуть курсор на единицу влево
         if (splitValue.delete === ' ') {
            splitValue.before = splitValue.before.substr(0, splitValue.before.length - 1);
            shift = -1;
         }

         //Если по ошибке вместо точки ввели запятую или "б"  или "ю", то выполним замену
         splitValue.insert = splitValue.insert.toLowerCase().replace(/,|б|ю/, '.');

         //Если в начале строки ввода точка, а до неё ничего нет, то предполагаем что хотят видеть '0.'
         if (splitValue.insert[0] === '.' && !splitValue.before) {
            splitValue.before = '0';
         }

         //Если валидация не прошла, то не даем ничего ввести
         if (!_private.validate(splitValue, this.config.onlyPositive, this.config.integersLength, this.config.precision)) {
            splitValue.insert = '';
         }

         //Запишет значение в input и поставит курсор в указанное место
         return {
            value: _private.getValueWithDelimiters(splitValue),
            position: _private.getCursorPosition(splitValue, shift)
         };
      }
   };

   NumberInput = Control.extend({
      /**
       * Поле ввода числа.
       * @class Controls/Input/Number
       * @extends Controls/Control
       * @mixes Controls/Input/interface/IInputNumber
       * @mixes Controls/Input/interface/IInputPlaceholder
       * @mixes Controls/Input/interface/IValidationError
       * @mixes Controls/Input/interface/IInputTag
       * @control
       * @public
       * @category Input
       */

      /**
       * @name Controls/Input/Number#decimals
       * @cfg {Number} Количество знаков после запятой
       */

      /**
       * @name Controls/Input/Number#onlyPositive
       * @cfg {Boolean} Ввод только положительных чисел
       */

      /**
       * @name Controls/Input/Number#onlyInteger
       * @cfg {Boolean} Ввод только целых чисел
       */

      /**
       * @name Controls/Input/Number#integers
       * @cfg {Number} Количество знаков до запятой
       */

      /**
       * @name Controls/Input/Number#showEmptyDecimals
       * @cfg {Boolean} Показывать нулевую дробную часть
       */

      _template: template,

      constructor: function (options) {
         NumberInput.superclass.constructor.apply(this, arguments);

         this._prepareData = new PrepareData(options, _private.prepareData);
      },

      _beforeUpdate: function (newOptions) {
         this._value = newOptions.value;
      },

      _changeValueHandler: function (event, value) {
         this._value = value;
         this._notify('onChangeValue', value);
      },

      _inputCompletedHandler: function () {
         var
            tmp = this._value.split('.'),
            integers = tmp[0],
            decimals = tmp[1];

         //Если дробная часть пустая или нулевая, то нужно убрать её
         if (!parseInt(decimals, 10)) {
            this._value = integers;
         }

         this._notify('inputCompleted', this._value);
      },

      _notifyHandler: function (event, value) {
         this._notify(value);
      }
   });

   NumberInput.getOptionTypes = function () {
      return {
         precision: types(Number), //Точность (кол-во знаков после запятой)
         integersLength: types(Number), //Длина целой части
         onlyPositive: types(Boolean) //Только положительные значения
      };
   };

   NumberInput._private = _private;

   return NumberInput;
});