define('Controls/Input/Text/ViewModel',
   [
      'Core/core-simpleExtend',
      'Controls/Input/resources/Helper'
   ],
   function (
      simpleExtend,
      Helper
   ) {
      'use strict';
      /**
       * @class Controls/Input/Text/ViewModel
       * @private
       * @author Баранов М.А.
       */

      var
         _private,
         TextViewModel;

      _private = {
      };

      TextViewModel = simpleExtend.extend({
            constructor: function (options) {
               this._options = options;
            },

            /**
             * Валидирует и подготавливает новое значение по splitValue
             * @param splitValue
             * @returns {{value: (*|String), position: (*|Integer)}}
             */
            prepareData: function (splitValue) {
               var insert = splitValue.insert;

               if (this._options.constraint) {
                  insert = Helper.constraint(insert, this._options.constraint);
               }

               if (this._options.maxLength) {
                  insert = Helper.maxLength(insert, splitValue, this._options.maxLength);
               }

               return {
                  value: splitValue.before + insert + splitValue.after,
                  position: splitValue.before.length + insert.length
               };
            }
         });

      return TextViewModel;
   }
);