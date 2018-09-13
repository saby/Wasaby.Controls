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
       * @author Журавлев М.С.
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

               // Разбиваем на триады только часть до точки
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

            processDeletionOfAllIntegers: function(splitValue) {
               // If all integers were removed, then we need to set first character in integers part to 0
               if (splitValue.before === '' || splitValue.before === '-') {
                  // If we have decimals part right after cursor position, then we should add '0' at line start
                  if (splitValue.after[0] === '.') {
                     if (splitValue.before === '-') {
                        splitValue.before = '-0';
                     } else {
                        splitValue.before = '0';
                     }
                  }
               }
            },

            /**
             * Returns the number of characters remaining until the maximum integers length is reached
             * Can return negative values
             * @param splitValue
             * @param integersLength
             * @return {number}
             */
            integersLeftToMaxLength: function(splitValue, integersLength) {
               var
                  integers = _private.getClearValue(splitValue).split('.')[0];

               return integersLength - integers.length;
            },

            /**
             * Returns the number of characters remaining until the maximum decimals length is reached
             * Can return negative values
             * @param splitValue
             * @param precision
             * @return {number}
             */
            decimalsLeftToMaxLength: function(splitValue, precision) {
               var
                  decimals = _private.getClearValue(splitValue).split('.')[1];

               return precision - decimals.length;
            },

            // Набор валидаторов для числа
            validators: {

               // Checks if insert is valid (number, dot or minus)
               isValidInsert: function(insertValue) {
                  return insertValue.match(/[\d.-]/);
               },

               // Проверяет что строка является числом и не содержит недопустимых символов
               isNumber: function(valueToValidate) {
                  return valueToValidate.match(/^\-?\d*(\.\d*)?$/);
               },

               // Ограничение максимальной длины целой части
               maxIntegersLength: function(valueToValidate, maxLength) {
                  var
                     integers = valueToValidate.split('.')[0].replace('-', '');
                  return !maxLength || integers.length <= maxLength;
               },

               // Ограничение максимальной длины дробной части
               maxDecimalsLength: function(valueToValidate, maxLength) {
                  var
                     decimals = valueToValidate.split('.')[1] || '';

                  // Если дробная часть запрещена, то нельзя давать ввести точку
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
               splitValue.cursorShift = 0;

               // Логика вставки числа с точкой будет переделана после того, как сделают новый стандарт.
               // Поручение: https://online.sbis.ru/opendoc.html?guid=af0a4214-593a-4205-9c5d-b8dd26652734
               // Check if we are trying to insert a float number
               if (splitValue.insert.length > 1 && splitValue.insert.indexOf('.') !== -1) {
                  // We must insert integers part into integers part, and decimals part into decimals part (right after dot)
                  if (splitValueHelper.isInIntegersPart()) {
                     var
                        insertIntegers = splitValue.insert.split('.')[0],
                        insertDecimals = splitValue.insert.split('.')[1];

                     // First, insert the integer part at the cursor position
                     splitValue.insert = insertIntegers;
                     this.processIntegersInsert(splitValue, options, splitValueHelper);

                     // Then generate a new splitValue object and insert the decimals part after the dot
                     var val = _private.getValueWithDelimiters(splitValue);
                     splitValue.before = val.split('.')[0] + '.';
                     splitValue.after = val.split('.')[1];
                     splitValue.insert = insertDecimals;
                     this.processIntegersInsert(splitValue, options, splitValueHelper);
                  } else {
                     // When inserting float number into decimals part
                     // we should remove dot and insert all symbols
                     splitValue.insert = splitValue.insert.replace('.', '');
                     this.processIntegersInsert(splitValue, options, splitValueHelper);
                  }
               } else {
                  this.processIntegersInsert(splitValue, options, splitValueHelper);
               }


               return {
                  value: _private.getValueWithDelimiters(splitValue),
                  position: _private.getCursorPosition(splitValue, splitValue.cursorShift)
               };
            },

            /**
             * Handles insert, but only integer values. Used by 'processInsert' method
             * @param splitValue
             * @param options
             * @param splitValueHelper
             */
            processIntegersInsert: function(splitValue, options, splitValueHelper) {
               var
                  shift = 0;

               // Remove delimiters from insert
               splitValue.insert = splitValue.insert.replace(/ /g, '');

               if (
                  !_private.validators.isValidInsert(splitValue.insert) ||
                  (options.onlyPositive && splitValue.insert === '-') ||
                  (options.precision === 0 && splitValue.insert === '.') ||
                  options.integersLength <= 0
               ) {
                  splitValue.insert = '';
               } else {
                  // Forbid inserting multiple zeroes at line start
                  if (!splitValueHelper.isEmptyField() && splitValueHelper.isAtLineStart() && splitValue.insert === '0' && splitValue.after[0] !== '.') {
                     splitValue.insert = '';
                  }

                  if (splitValue.insert === '.') {
                     // Inserting dot in emty field results in '0.0'
                     if (splitValueHelper.isEmptyField()) {
                        splitValue.after = '.0';
                        splitValue.insert = '0';
                     } else if (splitValueHelper.isInIntegersPart()) {
                        // Inserting dot in integers part moves cursor to decimals part
                        splitValue.insert = '';
                        shift += splitValue.after.indexOf('.') + 1;
                     }
                  }

                  // If field is empty or number doesn't contain dot, then we should add '.0' at the end
                  if ((splitValueHelper.isEmptyField() || !splitValueHelper.hasDot()) && options.precision !== 0) {
                     splitValue.after += '.0';
                  }

                  if (splitValue.insert === '-') {
                     // Inserting '-' after '0' should result in '-0'
                     if (splitValue.before === '0' && splitValue.after === '.0') {
                        splitValue.before = '-0';
                        splitValue.insert = '';
                     }

                     // Inserting '-' in empty field should result in '-0.0'
                     if (splitValue.before === '' && splitValue.after === '.0') {
                        splitValue.before = '-0';
                        splitValue.insert = '';
                     }
                  } else {
                     // If before value is '0' and input is valid, then we should delete before value
                     if (splitValue.before === '0' && splitValue.insert.length && _private.validators.isValidInsert(_private.getClearValue(splitValue))) {
                        splitValue.before = '';
                     }

                     // if before value is '-0', then we should delete '0'
                     if (splitValue.before === '-0' && _private.validators.isValidInsert(_private.getClearValue(splitValue))) {
                        splitValue.before = '-';
                     }
                  }

                  // If we insert first symbol in decimal part when it already contains '0', then we should erase '0'
                  if (splitValue.after === '0' && splitValue.before[splitValue.before.length - 1] === '.') {
                     splitValue.after = '';
                  }

                  // If we have exceeded the maximum number in integers part, then we should move cursor after dot
                  if (!_private.validators.maxIntegersLength(_private.getClearValue(splitValue), options.integersLength)) {
                     // If we insert more than one character, then we just need to slice insert value, if necessary
                     if (splitValue.insert.length > 1) {
                        var integersLeftToMaxLength = Math.abs(_private.integersLeftToMaxLength(splitValue, options.integersLength));
                        var dotPosition = splitValue.after.indexOf('.');
                        var integerAfterLength = dotPosition === -1
                           ? splitValue.after.length
                           : splitValue.after.substring(0, splitValue.after.indexOf('.')).length;

                        /**
                         * Do not insert more than the allowed length.
                         */
                        if (integerAfterLength < integersLeftToMaxLength) {
                           splitValue.insert = splitValue.insert.slice(0, integerAfterLength - integersLeftToMaxLength);
                        }
                        splitValue.after = splitValue.after.substring(0, integerAfterLength).slice(integersLeftToMaxLength) + splitValue.after.substring(integerAfterLength);
                     } else {
                        // If we insert single character and precision is not zero,
                        // then we need to jump over a dot and insert character in decimals part
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
                  }

                  // This block must be executed when we know for sure that in the next step the number can not become non-valid
                  if (!_private.validators.isNumber(_private.getClearValue(splitValue))) {
                     splitValue.insert = '';
                  }

                  // If we have exceeded the maximum number in decimals part, then we will replace the symbol on the right
                  if (!_private.validators.maxDecimalsLength(_private.getClearValue(splitValue), options.precision)) {
                     // If we insert value not at the end of the line, then we need to replace symbols on the right
                     if (splitValue.after !== '') {
                        splitValue.after = splitValue.after.slice(splitValue.insert.length);
                     }

                     // Check whether we have exceeded the allowed number symbols in decimals part
                     // and slice the extra if it is necessary
                     var decimalsLeftToMaxLength = _private.decimalsLeftToMaxLength(splitValue, options.precision);
                     if (decimalsLeftToMaxLength < 0) {
                        splitValue.insert = splitValue.insert.slice(0, decimalsLeftToMaxLength);
                     }
                  }

                  if (!_private.validators.isNumber(_private.getClearValue(splitValue))) {
                     splitValue.insert = '';
                  }
               }

               splitValue.cursorShift = shift;
            },

            /**
             * Delete value handler (fires only when we delete selected range)
             * @param splitValue
             * @param options
             * @return {{value: (*|String), position: (*|Integer)}}
             */
            processDelete: function(splitValue, options) {
               var
                  shift = 0;

               if (options.precision !== 0) {
                  _private.processDeletionOfAllIntegers(splitValue);
               }

               return {
                  value: _private.getValueWithDelimiters(splitValue),
                  position: _private.getCursorPosition(splitValue, shift)
               };
            },

            /**
             * Delete value forward handler ('delete' button)
             * @param splitValue
             * @param options
             * @return {{value: (*|String), position: (*|Integer)}}
             */
            processDeleteForward: function(splitValue, options) {
               var
                  shift = 0;

               // If a space was removed, then we need to delete the number to the right of it
               if (splitValue.delete === ' ') {
                  splitValue.after = splitValue.after.substr(1, splitValue.after.length);
               }

               // If deleting a dot then we should move cursor right and delete first symbol in decimal part
               if (splitValue.delete === '.') {
                  if (splitValue.after === '0') {
                     splitValue.after = '.' + splitValue.after;
                  } else {
                     splitValue.before += '.';
                     splitValue.after = splitValue.after.slice(1);
                  }
               }

               if (options.precision !== 0) {
                  _private.processDeletionOfAllIntegers(splitValue);
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

               // If whole decimal part was deleted then we should place '.0'
               if (splitValue.before[splitValue.before.length - 1] === '.' && splitValueHelper.isAtLineEnd()) {
                  shift -= 1;
               }

               // If you erase a point, you need to undo this and move the cursor to the left
               if (splitValue.delete === '.') {
                  splitValue.after = '.' + splitValue.after;
               }

               // If we delete a single zero in integers part, and there is a minus before it,
               // then we need to undo this and move the cursor to the left
               if (splitValue.delete === '0' && splitValue.before === '-') {
                  splitValue.after = '0' + splitValue.after;
               }

               if (options.precision !== 0) {
                  _private.processDeletionOfAllIntegers(splitValue);
               }

               // If a space was removed, we should delete the number to the left of it and move the cursor one unit to the left
               if (splitValue.delete === ' ') {
                  splitValue.before = splitValue.before.substr(0, splitValue.before.length - 1);
                  shift = -1;
               }

               // If we delete symbol in decimal part and showEmptyDecimals is true, then we should replace this symbol by '0'
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
