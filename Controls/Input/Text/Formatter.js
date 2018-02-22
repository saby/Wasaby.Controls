define('Controls/Input/Text/Formatter',
   [
      'Controls/Input/resources/InputRender/BaseFormatter'
   ],
   function (
      BaseFormatter
   ) {
      'use strict';
      /**
       * @class Controls/Input/Text/Formatter
       * @private
       * @author Баранов М.А.
       */

      var
         _private,
         TextFormatter;

      _private = {
         constraint: function(value, constraint){
            var
               constraintValue = '',
               reg = new RegExp(constraint);

            for(var i = 0; i < value.length; i++){
               if(reg.test(value[i])){
                  constraintValue += value[i];
               }
            }

            return constraintValue;
         },

         maxLength: function(value, splitValue, maxLength){
            return value.substring(0, maxLength - splitValue.before.length - splitValue.after.length);
         }
      };

      TextFormatter = BaseFormatter.extend({
            constructor: function (options) {
               this._options = options;
            },

            /**
             * Валидирует и подготавливает новое значение по splitValue
             * @param splitValue
             * @returns {{value: (*|String), position: (*|Integer)}}
             */
            inputHandler: function (splitValue) {
               var insert = splitValue.insert;

               if (this._options.constraint) {
                  insert = _private.constraint(insert, this._options.constraint);
               }

               if (this._options.maxLength) {
                  insert = _private.maxLength(insert, splitValue, this._options.maxLength);
               }

               return {
                  value: splitValue.before + insert + splitValue.after,
                  position: splitValue.before.length + insert.length
               };
            },

            updateOptions: function(options) {
               this._options.constraint = options.constraint;
               this._options.maxLength = options.maxLength;
            }
         });

      //Приходится записывать _private в свойство, для доступа из unit-тестов
      TextFormatter._private = _private;

      return TextFormatter;
   }
);