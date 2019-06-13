import BaseViewModel = require('Controls/_input/Base/ViewModel');
      

      /**
       * @class Controls/_input/Password/ViewModel
       * @extends Controls/_input/Base/ViewModel
       *
       * @private
       *
       * @author Krasilnikov A.S.
       */

      var _private = {
         replaceOnAsterisks: function(value) {
            return '•'.repeat(value.length);
         },
         isReplaceWithAsterisks: function(options) {
            return !(options.autoComplete || options.passwordVisible);
         },
         adjustSplitValue: function(splitValue, value) {
            splitValue.before = value.substring(0, splitValue.before.length);
            splitValue.after = value.substring(value.length - splitValue.after.length);
         },
         calcDisplayValue: function(replaceWithAsterisks, value) {
            return replaceWithAsterisks ? _private.replaceOnAsterisks(value) : value;
         }
      };

      var ViewModel = BaseViewModel.extend({
         _convertToDisplayValue: function(value) {
            var replaceWithAsterisks = _private.isReplaceWithAsterisks(this._options);
            var displayValue = ViewModel.superclass._convertToDisplayValue.call(this, value);

            return _private.calcDisplayValue(replaceWithAsterisks, displayValue);
         },

         handleInput: function(splitValue, inputType) {
            var replaceWithAsterisks = _private.isReplaceWithAsterisks(this._options);

            if (replaceWithAsterisks) {
               _private.adjustSplitValue(splitValue, this._value);
            }

            var result = ViewModel.superclass.handleInput.call(this, splitValue, inputType);

            this._displayValue = _private.calcDisplayValue(replaceWithAsterisks, this._value);
            this._nextVersion();

            return result;
         }
      });

      export = ViewModel;
   
