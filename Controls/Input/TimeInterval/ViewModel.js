define('Controls/Input/TimeInterval/ViewModel', [
   'Core/TimeInterval',
   'Controls/Input/Base/ViewModel',
   'Controls/Input/Mask/Formatter',
   'Controls/Input/Mask/InputProcessor',
   'Controls/Input/Mask/FormatBuilder'
], function(TimeInterval, BaseViewModel, Formatter, InputProcessor, FormatBuilder) {
   'use strict';

   /**
       * @class Controls/Input/TimeInterval/ViewModel
       * @private
       * @author Водолазских А.А.
       */

   var _private = {
      prepareData: function(result) {
         var position = result.position;
         return {
            before: result.value.substring(0, position),
            after: result.value.substring(position, result.value.length),
            insert: '',
            delete: ''
         };
      },

      displayValueParser: function(self, value) {
         var clearValue;
         var clearArray = [];
         self._format = FormatBuilder.getFormat(self._options.mask, self.formatMaskChars, self.replacer);
         clearValue = Formatter.getClearData(self._format, value);
         for (var i = 0; i < clearValue.value.length; i++) {
            var item = parseInt(clearValue.value[i]);
            if (typeof item === 'number' && !isNaN(item)) {
               clearArray.push(item);
            } else {
               clearArray.push(self.replacer);
            }
         }
         return clearArray;
      },

      timeIntervalToValueConverter: function(self, value) {
         var tiValue = value._normIntervalObj, hours, minutes, seconds, preResult;
         hours = tiValue.days * 24 + tiValue.hours;
         while (hours.toString().length < self._options.mask.match(/H/g).length) {
            hours = '0' + hours.toString();
         }
         if (tiValue.minutes.toString().length === 1) {
            minutes = '0' + tiValue.minutes.toString();
         } else {
            minutes = tiValue.minutes.toString();
         }
         if (self._options.mask.match(/s/g) !== null) {
            if (tiValue.seconds.toString().length === 1) {
               seconds = '0' + tiValue.seconds.toString();
            } else {
               seconds = tiValue.seconds.toString();
            }
            preResult = hours + minutes + seconds;
         } else {
            preResult = hours + minutes;
         }
         return preResult;
      },

      valueToTimeIntervalConverter: function(self, displayValue) {
         var hours = '',
            minutes = '',
            seconds = '';
         var clearArray = [];
         var fullArray = _private.displayValueParser(self, displayValue);
         var resultTimeInterval = null;
         for (var i = 0; i < fullArray.length; i++) {
            if (fullArray[i] === self.replacer) {
               clearArray.push(0);
            } else {
               clearArray.push(fullArray[i]);
            }
         }
         var numHours = self._options.mask.match(/H/g).length;
         var numMinutes = self._options.mask.match(/m/g).length;
         var numSeconds = self._options.mask.match(/s/g);
         for (var j = 0; j < numHours; j++) {
            if (fullArray[j] !== self.replacer) {
               hours = hours + clearArray[j];
            }
         }
         if (hours.length === 0) {
            hours = 0;
         }
         for (var k = 0; k < numMinutes; k++) {
            if (fullArray[k + numHours] !== self.replacer) {
               minutes = minutes + clearArray[k + numHours].toString();
            }
            if (minutes.length === 0) {
               minutes = 0;
            }
            if (minutes > 59) {
               minutes = 59;
            }
         }
         if (numSeconds !== null) {
            for (var t = 0; t < numSeconds.length; t++) {
               if (fullArray[t + numHours + numSeconds.length] !== self.replacer) {
                  seconds = seconds + clearArray[t + numHours + numSeconds.length].toString();
               }
               if (seconds.length === 0) {
                  seconds = 0;
               }
               if (seconds > 59) {
                  seconds = 59;
               }
            }
            resultTimeInterval =  new TimeInterval('P0DT' + parseInt(hours) + 'H' + parseInt(minutes) + 'M' + parseInt(seconds) + 'S');
         } else {
            resultTimeInterval =  new TimeInterval('P0DT' + parseInt(hours) + 'H' + parseInt(minutes) + 'M');
         }
         return resultTimeInterval;
      }
   };

   var ViewModel = BaseViewModel.extend({
      userEnter: false,
      formatMaskChars: {
         'D': '[0-9]',
         'H': '[0-9]',
         'm': '[0-9]',
         's': '[0-9]',
         'U': '[0-9]'
      },
      replacer: ' ',

      _autoComplete: function() {
         if (this.value !== null) {
            if (this.value._normIntervalStr !== 'P0DT0H0M0S') {
               this.displayValue = this._convertToDisplayValue(this.value);
            }
         }
      },

      _convertToValue: function(displayValue) {
         var result;
         if (typeof displayValue === 'string') {
            result = _private.valueToTimeIntervalConverter(this, displayValue);
         } else {
            result = displayValue;
         }
         return result;
      },

      _convertToDisplayValue: function(value) {
         var preResult;
         if (value === null) {
            preResult = this._options.mask.replace(/H|m|s/g, this.replacer);
         } else {
            if (!this.userEnter) {
               preResult = _private.timeIntervalToValueConverter(this, value);
               if (preResult.length !== this._options.mask.replace(/:/g, '').length) {
                  preResult = this._options.mask.replace(/H/g, 9);
                  preResult = preResult.replace(/mm/g, 59);
                  preResult = preResult.replace(/ss/g, 59);
               }
            } else {
               preResult = this.displayValue;
            }
         }
         var result, clearResult;
         this._format = FormatBuilder.getFormat(this._options.mask, this.formatMaskChars, this.replacer);
         clearResult = Formatter.getClearData(this._format, preResult);
         result = Formatter.getFormatterData(this._format, {
            value: clearResult.value,
            position: 0
         }).value;
         return result;
      },

      handleInput: function(splitValue, inputType) {
         var result;
         this._format = FormatBuilder.getFormat(this._options.mask, this.formatMaskChars, this.replacer);
         result = InputProcessor.input(splitValue, inputType, this.replacer, this._format, this._format);
         return ViewModel.superclass.handleInput.call(this, _private.prepareData(result), inputType);
      }
   });
   ViewModel._private = _private;
   return ViewModel;
});
