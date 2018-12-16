define('Controls/Input/DateTime/StringValueConverter', [
   'Core/core-simpleExtend',
   'Core/helpers/Date/format',
   'Controls/Utils/Date'
], function(
   cExtend,
   formatDate,
   dateUtils
) {
   'use strict';

   var _private = {
      maskMap: {
         YY: 'year', YYYY: 'year', MM: 'month', DD: 'date', HH: 'hours', mm: 'minutes', ss: 'seconds'
      },

      reAllMaskChars: /[YMDHms]+|[. :-]/g,
      reDateMaskChars: /[YMD]+/,
      reTimeMaskChars: /[Hms]+/,
      reDateTimeMaskChars: /[YMDHms]+/,
      reNumbers: /\d/,

      isFilled: function(self, value) {
         return value && value.indexOf(self._replacer) === -1;
      },

      isEmpty: function(value) {
         return !_private.reNumbers.test(value);
      },

      isPartlyFilled: function(self, value) {
         return value && _private.reNumbers.test(value) && value.indexOf(self._replacer) > -1;
      },

      isValueModelFilled: function(valueModel) {
         for (var value in valueModel) {
            if (valueModel.hasOwnProperty(value) && valueModel[value].valid === false) {
               return false;
            }
         }
         return true;
      },

      parseString: function(self, str) {
         var valueModel = {
               year: { str: null, value: 1900, valid: false },
               month: { str: null, value: 0, valid: false },
               date: { str: null, value: 1, valid: false },
               hours: { str: null, value: 0, valid: false },
               minutes: { str: null, value: 0, valid: false },
               seconds: { str: null, value: 0, valid: false }
            },
            curYear = (new Date()).getFullYear(),
            shortCurYear = curYear % 100,
            curCentury = (curYear - shortCurYear),
            maskItems = self._mask.split(/[.: /]/g),
            strItems = str.split(/[.: /]/g),
            i, valueObject;

         for (i = 0; i < maskItems.length; i++) {
            valueObject = valueModel[_private.maskMap[maskItems[i]]];
            valueObject.str = strItems[i];
            if (_private.isFilled(self, strItems[i])) {
               valueObject.valid = true;
               valueObject.value = parseInt(strItems[i], 10);
               if (maskItems[i] === 'YY') {
                  // Если год задаётся двумя числами, то считаем что это текущий век
                  // если год меньше или равен текущему году + 10, иначе это прошлый век.
                  valueObject.value = valueObject.value <= shortCurYear + 10
                     ? curCentury + valueObject.value : (curCentury - 100) + valueObject.value;
               } else if (maskItems[i] === 'MM') {
                  valueObject.value -= 1;
               }
            }
         }
         return valueModel;
      },

      fillFromBaseValue: function(self, valueModel, baseValue) {
         baseValue = dateUtils.isValidDate(baseValue) ? baseValue : new Date(1900, 0, 1);

         if (valueModel.year.str === null) {
            valueModel.year.value = baseValue.getFullYear();
         }
         if (valueModel.month.str === null) {
            valueModel.month.value = baseValue.getMonth();
         }
         if (valueModel.date.str === null && !self._mask === 'MM/YYYY') {
            // Для контрола с маской MM/YYYY не имеет смысла сохранять дату между вводом дат т.к. это приводит
            // к неожиданным результатам. Например, была программно установлена дата 31.12.2018.
            // меняем месяц на 11. 31.11 несуществует. Можно скорректировать на 30.11.2018. Теперь пользователь
            // вводит 12 в качесте месяца и мы получаем 30.12.2018...
            valueModel.date.value = baseValue.getDate();
         }
         if (valueModel.hours.str === null) {
            valueModel.hours.value = baseValue.getHours();
         }
         if (valueModel.minutes.str === null) {
            valueModel.minutes.value = baseValue.getMinutes();
         }
         if (valueModel.seconds.str === null) {
            valueModel.seconds.value = baseValue.getSeconds();
         }
         for (var value in valueModel) {
            if (valueModel.hasOwnProperty(value) && valueModel[value].str === null) {
               valueModel[value].valid = true;
            }
         }
      },

      autocomplete: function(self, valueModel, autocompleteType, required) {
         var now = new Date(),
            maskType = _private.getMaskType(self._mask);

         var getDate = function(autocompliteDefaultDate) {
            autocompliteDefaultDate = autocompliteDefaultDate || now.getDate();
            if (autocompleteType === 'start') {
               return 1;
            } else if (autocompleteType === 'end') {
               return dateUtils.getEndOfMonth(new Date(valueModel.year.value, valueModel.month.value)).getDate();
            } else {
               return autocompliteDefaultDate;
            }
         };

         var setValue = function(obj, value) {
            obj.value = value;
            obj.valid = true;
         };

         // Автокомплитим только если пользователь частично заполнил поле, либо не заполнил, но поле обязательно
         // для заполнения. Не автокомплитим поля в периодах
         // if (isEmpty && (!required || autocompleteType === 'start' || autocompleteType === 'end')) {
         //    return null;
         // }

         if (maskType === 'date' || maskType === 'datetime') {
            if (required && !valueModel.year.valid && valueModel.month.valid && valueModel.date.valid) {
               setValue(valueModel.year, now.getFullYear());
               setValue(valueModel.month, now.getMonth());
               setValue(valueModel.date, now.getDate());
            } else if (valueModel.year.valid) {
               if (valueModel.year.value === now.getFullYear()) {
                  if (valueModel.month.valid) {
                     if (valueModel.month.value === now.getMonth()) {
                        // Заполнен текущий год и месяц
                        if (!valueModel.date.valid) {
                           setValue(valueModel.date, getDate());
                        }
                     } else {
                        if (!valueModel.date.valid) {
                           setValue(valueModel.date, getDate(1));
                        }
                     }
                  } else {
                     // Current year is filled
                     if (!valueModel.month.valid) {
                        setValue(valueModel.month, now.getMonth());
                     }
                     if (!valueModel.date.valid) {
                        setValue(valueModel.date, getDate());
                     }
                  }
               } else {
                  // A year is different from the current one
                  if (!valueModel.month.valid) {
                     if (autocompleteType === 'end') {
                        setValue(valueModel.month, 11);
                     } else {
                        setValue(valueModel.month, 0);
                     }
                  }
                  if (!valueModel.date.valid) {
                     if (autocompleteType === 'end') {
                        setValue(valueModel.date, 31);
                     } else {
                        setValue(valueModel.date, 1);
                     }
                  }
               }
            } else if (valueModel.date.valid) {
               if (!valueModel.month.valid) {
                  setValue(valueModel.month, now.getMonth());
               }
               if (!valueModel.year.valid) {
                  setValue(valueModel.year, now.getFullYear());
               }
            }
         } else if (maskType === 'time') {
            if (valueModel.hours.valid) {
               if (!valueModel.minutes.valid) {
                  setValue(valueModel.minutes, 0);
               }
            }
         }
      },

      /**
       * Get the type of displayed data: date / time / date and time.
       * @returns (String) Data type ('date' || 'time' || 'datetime').
       */
      getMaskType: function(mask) {
         if (_private.reDateMaskChars.test(mask)) {
            if (_private.reTimeMaskChars.test(mask)) {
               return 'datetime';
            }
            return 'date';
         }
         if (_private.reTimeMaskChars.test(mask)) {
            return 'time';
         }
      },

      /**
       * Creates a date. Unlike the Date constructor, if the year is <100, it does not convert it to 19xx.
       * @param year
       * @param month
       * @param date
       * @param hours
       * @param minutes
       * @param seconds
       * @param autoCorrect If true, then corrects the date if the wrong values of its elements are passed,
       * otherwise it returns null. If a date greater than the maximum date in the current month is transmitted,
       * the maximum date will be set.
       * @returns {Date}
       * @private
       */
      createDate: function(year, month, date, hours, minutes, seconds, autoCorrect) {
         var dateObj, endDateOfMonth;

         if (autoCorrect) {
            endDateOfMonth = dateUtils.getEndOfMonth(new Date(year, month, 1)).getDate();
            if (date > endDateOfMonth) {
               dateObj = endDateOfMonth;
            }
         }

         if (!_private.isValidDate(year, month, date, hours, minutes, seconds)) {
            return new Date('Invalid');
         }

         return new Date(year, month, date, hours, minutes, seconds);
      },

      isValidDate: function(year, month, date, hours, minutes, seconds) {
         var lastMonthDay = dateUtils.getEndOfMonth(new Date(year, month)).getDate();
         return seconds < 60 && minutes < 60 && hours < 24 && month < 12 && month >= 0 &&
            date <= lastMonthDay && date > 0;
      }
   };

   var ModuleClass = cExtend.extend({
      _mask: null,
      _replacer: null,

      /**
       * Updates converter settings.
       * @param options
       */
      update: function(options) {
         this._mask = options.mask;
         this._replacer = options.replacer;
      },

      /**
       * Returns the text displayed value
       * @param value
       * @returns {*}
       */
      getStringByValue: function(value) {
         if (dateUtils.isValidDate(value)) {
            return formatDate(value, this._mask);
         }
         return this._mask.replace(/[DMYHms]/g, this._replacer);
      },

      /**
       * Get the Date object by the String and the mask.
       * @param str Date in accordance with the mask.
       * @param baseValue The base date. Used to fill parts of the date that are not in the mask.
       * @param autoCompleteType Autocomplete mode.
       * @returns {Date} Date object
       */
      getValueByString: function(str, baseValue, autoCompleteType, required) {
         var valueModel;

         if (_private.isEmpty(str)) {
            return null;
         }

         valueModel = _private.parseString(this, str);
         _private.fillFromBaseValue(this, valueModel, baseValue);

         if (_private.isFilled(this, str) && valueModel.year.str === '0000') {
            // Zero year does not exist
            return new Date('Invalid');
         }
         if (autoCompleteType && !_private.isValueModelFilled(valueModel) && !(_private.isEmpty(str))) {
            if (valueModel.hours.valid && !valueModel.minutes.valid) {
               valueModel.minutes.value = parseInt(valueModel.minutes.str, 10) || 0;
               valueModel.minutes.valid = true;
            }
            _private.autocomplete(this, valueModel, autoCompleteType, required);
         }

         if (_private.isValueModelFilled(valueModel)) {
            return _private.createDate(valueModel.year.value, valueModel.month.value, valueModel.date.value,
               valueModel.hours.value, valueModel.minutes.value, valueModel.seconds.value, autoCompleteType);
         }

         return new Date('Invalid');
      },
      getCurrentDate: function(baseValue, mask) {
         var date = dateUtils.isValidDate(baseValue) ? new Date(baseValue) : new Date(1900, 0, 1);
         var now = new Date();
         if (mask.indexOf('YYYY') > -1) {
            date.setFullYear(now.getFullYear());
         } else if (mask.indexOf('YY') > -1) {
            date.setFullYear(now.getFullYear());
         }
         if (mask.indexOf('MM') > -1) {
            date.setMonth(now.getMonth());
         }
         if (mask.indexOf('DD') > -1) {
            date.setDate(now.getDate());
         }
         if (mask.indexOf('HH') > -1) {
            date.setHours(now.getHours());
         }
         if (mask.indexOf('mm') > -1) {
            date.setMinutes(now.getMinutes());
         }
         if (mask.indexOf('ss') > -1) {
            date.setSeconds(now.getSeconds());
         }
         return date;
      }
   });

   return ModuleClass;
});
