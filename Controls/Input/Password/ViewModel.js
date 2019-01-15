define('Controls/Input/Password/ViewModel',
   [
      'Controls/Input/Base/ViewModel'
   ],
   function(BaseViewModel) {
      'use strict';

      /**
       * @class Controls/Input/Password/ViewModel
       * @extends Controls/Input/Base/ViewModel
       *
       * @private
       *
       * @author Журавлев М.С.
       */

      var _private = {
         replaceOnAsterisks: function(value) {
            return '•'.repeat(value.length);
         },
         isReplaceWithAsterisks: function(options) {
            return !(options.autoComplete || options.passwordVisible);
         },
         calcCachedValue: function(splitValue, value) {
            var cachedValue = value.substring(0, splitValue.before.length);
            cachedValue += splitValue.insert;
            cachedValue += value.substring(value.length - splitValue.after.length);

            return cachedValue;
         },
         calcDisplayValue: function(replaceWithAsterisks, value) {
            return replaceWithAsterisks ? _private.replaceOnAsterisks(value) : value;
         }
      };

      var ViewModel = BaseViewModel.extend({
         _cachedValue: null,

         _convertToValue: function(displayValue) {
            if (this._cachedValue === null) {
               return displayValue;
            }

            return this._cachedValue;
         },

         _convertToDisplayValue: function(value) {
            var replaceWithAsterisks = _private.isReplaceWithAsterisks(this._options);

            return _private.calcDisplayValue(replaceWithAsterisks, value);
         },

         handleInput: function(splitValue, inputType) {
            var replaceWithAsterisks = _private.isReplaceWithAsterisks(this._options);

            this._cachedValue = _private.calcCachedValue(splitValue, this._value);

            if (replaceWithAsterisks) {
               this._cachedValue = _private.calcCachedValue(splitValue, this._value);
               splitValue.insert = _private.replaceOnAsterisks(splitValue.insert);
            }

            var result = ViewModel.superclass.handleInput.call(this, splitValue, inputType);

            this._cachedValue = null;

            return result;
         }
      });

      return ViewModel;
   });
