define('Controls/Input/Number/InputProcessor',
   [
      'Core/core-simpleExtend'
   ],
   function(
      simpleExtend
   ) {
      'use strict';

      /**
       * @class Controls/Input/Number/InputProcessor
       * @private
       * @author Баранов М.А.
       */

      var
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
             * Возвращает значение инпута в виде строки
             * @param splitValue
             * @returns {String}
             */
            concatSplitValue: function(splitValue) {
               return splitValue.before + splitValue.insert + splitValue.after;
            },

            /**
             * Возвращает значение инпута без разделительных пробелов
             * @param splitValue
             * @returns {String}
             */
            getClearValue: function(splitValue) {
               return this.concatSplitValue(splitValue).replace(/ /g, '');
            },

            //Набор валидаторов для числа
            validators: {

               //Checks if insert is valid (number, dot or minus)
               isValidInsert: function(insertValue) {
                  return insertValue.match(/[\d.-]/);
               },

               //Проверяет что строка является числом и не содержит недопустимых символов
               isNumber: function(valueToValidate) {
                  return valueToValidate.match(/^\-?\d*(\.\d*)?$/);
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
         },
         InputProcessor = simpleExtend.extend({

            /**
             * Insert value handler
             * @param splitValue
             * @param options
             * @param splitValueHelper
             * @return {{value: (*|String), position: (*|Integer)}}
             */
            processInsert: function(splitValue, options, splitValueHelper) {
               var
                  shift = 0;

               if (
                  !_private.validators.isValidInsert(splitValue.insert) ||
                  (options.onlyPositive && splitValue.insert === '-') ||
                  (options.precision === 0 && splitValue.insert === '.')
               ) {
                  splitValue.insert = '';
               } else {
                  //Forbid inserting multiple zeroes at line start
                  if (!splitValueHelper.isEmptyField() && splitValueHelper.isAtLineStart() && splitValue.insert === '0' && splitValue.after[0] !== '.') {
                     splitValue.insert = '';
                  }

                  if (splitValue.insert === '.') {
                     //Inserting dot in emty field results in '0.0'
                     if (splitValueHelper.isEmptyField()) {
                        splitValue.after = '.0';
                        splitValue.insert = '0';
                     } else if (splitValueHelper.isInIntegersPart()) {
                        //Inserting dot in integers part moves cursor to decimals part
                        splitValue.insert = '';
                        shift += splitValue.after.indexOf('.') + 1;
                     }
                  }

                  //If field is empty or number doesn't contain dot, then we should add '.0' at the end
                  if ((splitValueHelper.isEmptyField() || !splitValueHelper.hasDot()) && options.precision !== 0) {
                     splitValue.after += '.0';
                  }

                  if (splitValue.insert === '-') {
                     //Inserting '-' after '0' should result in '-0'
                     if (splitValue.before === '0' && (splitValue.after === '' || splitValue.after === '.0')) {
                        splitValue.before = '-0';
                        splitValue.insert = '';
                     }

                     //Inserting '-' in empty field should result in '-0.0'
                     if (splitValue.before === '' && splitValue.after === '' || splitValue.after === '.0') {
                        splitValue.before = '-0';
                        splitValue.insert = '';
                     }
                  } else {
                     //If before value is '0' and input is valid, then we should delete before value
                     if (splitValue.before === '0' && _private.validators.isValidInsert(_private.getClearValue(splitValue))) {
                        splitValue.before = '';
                     }

                     //if before value is '-0', then we should delete '0'
                     if (splitValue.before === '-0' && _private.validators.isValidInsert(_private.getClearValue(splitValue))) {
                        splitValue.before = '-';
                     }
                  }

                  //If we insert first symbol in decimal part when it already contains '0', then we should erase '0'
                  if (splitValue.after === '0' && splitValue.before[splitValue.before.length - 1] === '.') {
                     splitValue.after = '';
                  }

                  //If we have exceeded the maximum number in integers part, then we should move cursor after dot
                  if (!_private.validators.maxIntegersLength(_private.getClearValue(splitValue), options.integersLength)) {
                     if (options.precision !== 0) {
                        if (splitValue.after[0] === '.') {
                           shift += 2;
                           splitValue.after = splitValue.after.substring(0, 1) + splitValue.insert + splitValue.after.substring(2, splitValue.after.length);
                        } else {
                           if (splitValue.after[1] === ' ') {
                              shift += 2;
                           } else {
                              shift += 1;
                           }
                           splitValue.after = splitValue.insert + splitValue.after.slice(1);
                        }
                     }
                     splitValue.insert = '';
                  }

                  //If we have exceeded the maximum number in decimals part, then we will replace the symbol on the right
                  if (!_private.validators.maxDecimalsLength(_private.getClearValue(splitValue), options.precision)) {
                     if (splitValue.after !== '') {
                        splitValue.before += splitValue.insert;
                        splitValue.after = splitValue.after.slice(splitValue.insert.length);
                     }
                     splitValue.insert = '';
                  }

                  if (!_private.validators.isNumber(_private.getClearValue(splitValue))) {
                     splitValue.insert = '';
                  }
               }

               return {
                  value: _private.getValueWithDelimiters(splitValue),
                  position: _private.getCursorPosition(splitValue, shift)
               };
            },

            /**
             * Delete value handler (fires only when we delete selected range)
             * @param splitValue
             * @return {{value: (*|String), position: (*|Integer)}}
             */
            processDelete: function(splitValue/*, options, splitValueHelper*/) {
               var
                  shift = 0;

               //If all integers were removed, then we need to set first character in integers part to 0
               if (splitValue.before === '' || splitValue.before === '-') {
                  if (splitValue.after === '') {
                     splitValue.before = '';
                  }
                  if (splitValue.after[0] === '.') {
                     if (splitValue.after[1]) {
                        splitValue.before = '0';
                     } else {
                        splitValue.after = '';
                     }
                  }
               }

               return {
                  value: _private.getValueWithDelimiters(splitValue),
                  position: _private.getCursorPosition(splitValue, shift)
               };
            },

            /**
             * Delete value forward handler ('delete' button)
             * @param splitValue
             * @return {{value: (*|String), position: (*|Integer)}}
             */
            processDeleteForward: function(splitValue/*, options, splitValueHelper*/) {
               var
                  shift = 0;

               //If a space was removed, then we need to delete the number to the right of it
               if (splitValue.delete === ' ') {
                  splitValue.after = splitValue.after.substr(1, splitValue.after.length);
               }

               //If deleting a dot then we should move cursor right and delete first symbol in decimal part
               if (splitValue.delete === '.') {
                  if (splitValue.after === '0') {
                     splitValue.after = '.' + splitValue.after;
                  } else {
                     splitValue.before += '.';
                     splitValue.after = splitValue.after.slice(1);
                  }
               }

               //If all integers were removed, then we need to set first character in integers part to 0
               if (splitValue.before === '' || splitValue.before === '-') {
                  if (splitValue.after === '') {
                     splitValue.before = '';
                  }
                  if (splitValue.after[0] === '.') {
                     if (splitValue.after[1]) {
                        splitValue.before = '0';
                     } else {
                        splitValue.after = '';
                     }
                  }
               }

               return {
                  value: _private.getValueWithDelimiters(splitValue),
                  position: _private.getCursorPosition(splitValue, shift)
               };
            },

            /**
             * Delete value backward handler ('backspace' button)
             * @param splitValue
             * @param options
             * @param splitValueHelper
             * @return {{value: (*|String), position: (*|Integer)}}
             */
            processDeleteBackward: function(splitValue, options, splitValueHelper) {
               var
                  shift = 0;

               //If whole decimal part was deleted then we should place '.0'
               if (splitValue.before[splitValue.before.length - 1] === '.' && splitValueHelper.isAtLineEnd()) {
                  shift -= 1;
               }

               //If you erase a point, you need to undo this and move the cursor to the left
               if (splitValue.delete === '.') {
                  splitValue.after = '.' + splitValue.after;
               }

               //If we delete the last character on the left and there is no integers after it, then we need to set it to '0'
               if (splitValue.before === '' || splitValue.before === '-') {
                  if (splitValue.after === '') {
                     splitValue.before = '';
                  }
                  if (splitValue.after[0] === '.') {
                     if (splitValue.after[1]) {
                        splitValue.before = '0';
                     } else {
                        splitValue.after = '';
                     }
                  }
               }

               //If a space was removed, we should delete the number to the left of it and move the cursor one unit to the left
               if (splitValue.delete === ' ') {
                  splitValue.before = splitValue.before.substr(0, splitValue.before.length - 1);
                  shift = -1;
               }

               //If we delete symbol in decimal part and showEmptyDecimals is true, then we should replace this symbol by '0'
               if (splitValueHelper.isInDecimalsPart() && options.showEmptyDecimals) {
                  splitValue.after = splitValue.after + '0'.repeat(splitValue.delete.length);
               }

               return {
                  value: _private.getValueWithDelimiters(splitValue),
                  position: _private.getCursorPosition(splitValue, shift)
               };
            }
         });

      InputProcessor.getValueWithDelimiters = function(splitValue) {
         return _private.getValueWithDelimiters(splitValue);
      };

      return InputProcessor;
   }
);
