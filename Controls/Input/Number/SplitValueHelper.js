define('Controls/Input/Number/SplitValueHelper',
   [
      'Core/core-simpleExtend'
   ],
   function(
      simpleExtend
   ) {
      'use strict';

      /**
       * @class Controls/Input/Number/SplitValueHelper
       * @private
       * @author Журавлев М.С.
       */

      var
         SplitValueHelper = simpleExtend.extend({
            constructor: function(splitValue) {
               SplitValueHelper.superclass.constructor.apply(this, arguments);

               this._splitValue = splitValue;
            },

            isInDecimalsPart: function() {
               return this._splitValue.before.indexOf('.') !== -1;
            },

            isInIntegersPart: function() {
               return this._splitValue.after.indexOf('.') !== -1 || this._splitValue.before.indexOf('.') === -1;
            },

            isAtLineStart: function() {
               return this._splitValue.before === '';
            },

            isAtLineEnd: function() {
               return this._splitValue.after === '';
            },

            isEmptyField: function() {
               return this.isAtLineStart() && this.isAtLineEnd();
            },

            hasDot: function() {
               return this._splitValue.before.indexOf('.') !== -1 || this._splitValue.after.indexOf('.') !== -1;
            }


         });

      return SplitValueHelper;
   }
);
