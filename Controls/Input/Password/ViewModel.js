define('Controls/Input/Password/ViewModel',
   [
      'Controls/Input/resources/InputRender/BaseViewModel'
   ],
   function(BaseViewModel) {

      'use strict';

      /**
       * @class Controls/Input/Password/ViewModel
       * @private
       * @author Журавлев М.С.
       */
      var ViewModel = BaseViewModel.extend({
         updateOptions: function(newOptions) {
            this._options.autoComplete = newOptions.autoComplete;
            this._options.passwordVisible = newOptions.passwordVisible;

            ViewModel.superclass.updateOptions.call(this, newOptions);
         },

         handleInput: function(splitValue, inputType) {
            splitValue.before = this._options.value.substring(0, splitValue.before.length);
            splitValue.after = this._options.value.substring(this._options.value.length - splitValue.after.length);

            var result = ViewModel.superclass.handleInput.call(this, splitValue, inputType);

            result.value = this.getDisplayValue();

            return result;
         },

         getDisplayValue: function() {
            var displayValue = ViewModel.superclass.getDisplayValue.call(this);
            var autoComplete = this._options.autoComplete;
            var passwordVisible = this._options.passwordVisible;

            /**
             * If auto-completion is true, then the displayed value can be saved to the browser history.
             * Therefore, the field must have a value that is not replaced by •.
             */
            return autoComplete || passwordVisible ? displayValue : '•'.repeat(displayValue.length);
         }
      });

      return ViewModel;
   }
);
