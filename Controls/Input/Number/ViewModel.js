define('Controls/Input/Number/ViewModel',
   [
      'Controls/Input/resources/InputRender/BaseViewModel'
   ],
   function(
      BaseViewModel
   ) {
      'use strict';

      /**
       * @class Controls/Input/Number/ViewModel
       * @private
       * @author Баранов М.А.
       */

      var
         _private,
         NumberViewModel;

      _private = {

         /**
          * Возвращает готовую строку с разделителями
          * @param splitValue
          * @returns {String}
          */
         getValueWithDelimiters: function(splitValue) {
            var
               clearValSplited = this.getClearValue(splitValue).split('.');

            //Разбиваем на триады только часть до точки
            clearValSplited[0] = clearValSplited[0].replace(/(\d)(?=(\d{3})+$)/g, '$& ');

            return clearValSplited.join('.');
         },

         /**
          * Возвращает значение инпута без разделительных пробелов
          * @param splitValue
          * @returns {String}
          */
         getClearValue: function(splitValue) {
            return this.concatSplitValue(splitValue).replace(/ /g, '');
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
          * Возвращает позицию курсора с учетом разделителей
          * @param splitValue
          * @param shift {Integer} дополнительный сдвиг курсора, на случай если он должен стоять не сразу после введённого значения
          * @returns {Integer}
          */
         getCursorPosition: function(splitValue, shift) {
            var
               beforeNewDelimetersSpacesCnt = _private.concatSplitValue(splitValue).trim().split(' ').length - 1,
               afterNewDelimetersSpacesCnt = _private.getValueWithDelimiters(splitValue).split(' ').length - 1,
               spacesCntDiff = afterNewDelimetersSpacesCnt - beforeNewDelimetersSpacesCnt;

            return splitValue.before.length + splitValue.insert.length + spacesCntDiff + shift;
         },

         /**
          * Валидирует значение splitValue
          * @param clearValue
          * @param onlyPositive
          * @param integersLength
          * @param precision
          * @returns {boolean}
          */
         validate: function(clearValue, onlyPositive, integersLength, precision) {
            if (
               !_private.validators.isNumber(clearValue) ||
               onlyPositive && !_private.validators.onlyPositive(clearValue) ||
               typeof integersLength !== 'undefined' && !_private.validators.maxIntegersLength(clearValue, integersLength) ||
               typeof precision !== 'undefined' && !_private.validators.maxDecimalsLength(clearValue, precision)
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
         }
      };

      NumberViewModel = BaseViewModel.extend({

         /**
             * Валидирует и подготавливает новое значение по splitValue
             * @param splitValue
             * @param inputType
             * @returns {{value: (*|String), position: (*|Integer)}}
             */
         handleInput: function(splitValue, inputType) {
            var
               shift = 0;

               //Если был удалён пробел, то нужно удалить цифру слева от него и сдвинуть курсор на единицу влево
            if (splitValue.delete === ' ') {
               if (inputType === 'deleteForward') {
                  splitValue.after = splitValue.after.substr(1, splitValue.after.length);
               } else if (inputType === 'deleteBackward') {
                  splitValue.before = splitValue.before.substr(0, splitValue.before.length - 1);
                  shift = -1;
               }
            }

            //Если по ошибке вместо точки ввели запятую или "б"  или "ю", то выполним замену
            splitValue.insert = splitValue.insert.toLowerCase().replace(/,|б|ю/, '.');

            //Если в начале строки ввода точка, а до неё ничего нет, то предполагаем что хотят видеть '0.'
            if (splitValue.insert[0] === '.' && !splitValue.before) {
               splitValue.before = '0';
            }

            //Если валидация не прошла, то не даем ничего ввести
            if (!_private.validate(_private.getClearValue(splitValue), this._options.onlyPositive, this._options.integersLength, this._options.precision)) {
               splitValue.insert = '';
            }

            this._options.value = _private.getClearValue(splitValue);

            //Запишет значение в input и поставит курсор в указанное место
            return {
               value: _private.getValueWithDelimiters(splitValue),
               position: _private.getCursorPosition(splitValue, shift)
            };
         },

         getDisplayValue: function() {
            return _private.getValueWithDelimiters({
               before: '',
               insert: this._options.value,
               after: ''
            });
         },

         getValue: function() {
            return this._options.value;
         },

         updateOptions: function(options) {
            this._options.onlyPositive = options.onlyPositive;
            this._options.integersLength = options.integersLength;
            this._options.precision = options.precision;
            this._options.value = options.value;
         }
      });

      return NumberViewModel;
   }
);
