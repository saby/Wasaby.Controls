define('Controls/Input/OldText/OldViewModel',
   [
      'Controls/_input/resources/InputRender/BaseViewModel'
   ],
   function(
      BaseViewModel
   ) {
      'use strict';

      /**
       * @class Controls/input:TextViewModel
       * @private
       * @author Журавлев М.С.
       */

      var
         _private,
         TextViewModel;

      _private = {
         constraint: function(value, constraint) {
            var
               constraintValue = '',
               reg = new RegExp(constraint);

            for (var i = 0; i < value.length; i++) {
               if (reg.test(value[i])) {
                  constraintValue += value[i];
               }
            }

            return constraintValue;
         },

         maxLength: function(value, splitValue, maxLength) {
            return value.substring(0, maxLength - splitValue.before.length - splitValue.after.length);
         }
      };

      TextViewModel = BaseViewModel.extend({
         constructor: function(options) {
            this._options = options;
         },

         /**
          * Валидирует и подготавливает новое значение по splitValue
          * @param splitValue
          * @returns {{value: (*|String), position: (*|Integer)}}
          */
         handleInput: function(splitValue) {
            var insert = splitValue.insert;

            if (this._options.constraint) {
               insert = _private.constraint(insert, this._options.constraint);
            }

            if (this._options.maxLength) {
               insert = _private.maxLength(insert, splitValue, this._options.maxLength);
            }

            this._options.value = splitValue.before + insert + splitValue.after;
            this._nextVersion();

            return {
               value: splitValue.before + insert + splitValue.after,
               position: splitValue.before.length + insert.length
            };
         },
         updateOptions: function(options) {
            var oldValue = this._options.value;
            this._options.value = options.value;

            // если ничего не поменялось - не надо изменять версию
            if (oldValue !== options.value) {
               this._nextVersion();
            }

            var oldMaxLength = this._options.maxLength;
            this._options.maxLength = options.maxLength;

            // если ничего не поменялось - не надо изменять версию
            if (oldMaxLength !== options.maxLength) {
               this._nextVersion();
            }

            var oldConstraint = this._options.constraint;
            this._options.constraint = options.constraint;

            // если ничего не поменялось - не надо изменять версию
            if (oldConstraint !== options.constraint) {
               this._nextVersion();
            }
         }
      });

      // Приходится записывать _private в свойство, для доступа из unit-тестов
      TextViewModel._private = _private;

      return TextViewModel;
   });
