define('Controls/Input/Text/ViewModel',
   [
      'Controls/Input/Base/ViewModel'
   ],
   function(BaseViewModel) {
      'use strict';

      /**
       * @class Controls/Input/Text/ViewModel
       * @extends Controls/Input/Base/ViewModel
       *
       * @private
       *
       * @author Журавлев М.С.
       */

      var _private = {
         constraint: function(splitValue, constraint) {
            var constraintRegExp = new RegExp(constraint, 'g');
            var match = splitValue.insert.match(constraintRegExp);

            splitValue.insert = match ? match.join('') : '';
         },

         maxLength: function(splitValue, maxLength) {
            var maxInsertionLength = maxLength - splitValue.before.length - splitValue.after.length;

            splitValue.insert = splitValue.insert.substring(0, maxInsertionLength);
         }
      };

      var ViewModel = BaseViewModel.extend({
         handleInput: function(splitValue, inputType) {
            if (inputType === 'insert') {
               if (this.options.constraint) {
                  _private.constraint(splitValue, this.options.constraint);
               }
               if (this.options.maxLength) {
                  _private.maxLength(splitValue, this.options.maxLength);
               }
            }

            return ViewModel.superclass.handleInput.call(this, splitValue, inputType);
         }
      });

      return ViewModel;
   });
