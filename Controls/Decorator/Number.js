define('Controls/Decorator/Number',
   [
      'Core/Control',
      'WS.Data/Type/descriptor',
      'wml!Controls/Decorator/Number/Number'
   ],
   function(Control, descriptor, template) {

      'use strict';

      /**
       * Divide the number into triads.
       *
       * @class Controls/Decorator/Number
       * @extends Core/Control
       * @control
       * @public
       * @category Decorator
       * @demo Controls-demo/Decorators/Number/Number
       *
       * @author Журавлев М.С.
       */

      /**
       * @name Controls/Decorator/Number#number
       * @cfg {Number} Number to divide into triads.
       */

      /**
       * @name Controls/Decorator/Number#fractionSize
       * @cfg {Number} Number of decimal places. Range from 0 to 20.
       */

      /**
       * @name Controls/Decorator/Number#roundMode
       * @cfg {String} The mode of formatting the fractional part of the number.
       * @variant round The number is rounded if necessary, and the fractional part is padded with zeros if necessary
       * so that it has the specified length.
       * @variant trunc Truncates (cuts off) the digits to the right of dot so that fractional part has the specified length,
       * no matter whether the argument is a positive or negative number.
       * @default trunc
       */

      var _private = {

         /**
          * Casting a number to a format with division on triads.
          * @param number {@link number}
          * @param roundMode {@link roundMode}
          * @param [fractionSize] {@link fractionSize}
          */
         formatNumber: function(number, roundMode, fractionSize) {
            if (typeof fractionSize === 'number') {
               number = _private[roundMode](number, fractionSize);
            } else {
               number = number.toString();
            }

            /**
             * Create an array of integer and fractional parts.
             * Divide the integer part into triads.
             */
            number = number.split('.');
            number[0] = number[0].replace(/(\d)(?=(\d{3})+$)/g, '$& ');

            return number.join('.');
         },

         /**
          * {@link roundMode} round
          * @param number {@link number}
          * @param fractionSize {@link fractionSize}
          * @returns {String}
          */
         round: function(number, fractionSize) {
            return number.toFixed(fractionSize);
         },

         /**
          * {@link roundMode} trunc
          * @param number {@link number}
          * @param fractionSize {@link fractionSize}
          * @returns {String}
          */
         trunc: function(number, fractionSize) {
            if (fractionSize) {
               var regExp = new RegExp('-?\\d+.?\\d{0,' + fractionSize + '}');

               number = String.prototype.match.call(number, regExp)[0];
            } else {
               number = Math.trunc(number).toString();
            }

            return number;
         }
      };

      var NumberDecorator = Control.extend({
         _template: template,

         _formattedNumber: null,

         _beforeMount: function(options) {
            this._formattedNumber = _private.formatNumber(options.number, options.roundMode, options.fractionSize);
         },

         _beforeUpdate: function(newOptions) {
            if (
               newOptions.number !== this._options.number ||
               newOptions.fractionSize !== this._options.fractionSize ||
               newOptions.roundMode !== this._options.roundMode
            ) {
               this._formattedNumber = _private.formatNumber(newOptions.number, newOptions.roundMode, newOptions.fractionSize);
            }
         }
      });

      NumberDecorator.getDefaultOptions = function() {
         return {
            roundMode: 'trunc'
         };
      };

      NumberDecorator.getOptionTypes = function() {
         return {
            number: descriptor(Number).required(),
            fractionSize: descriptor(Number),
            roundMode: descriptor(String).oneOf([
               'trunc',
               'round'
            ])
         };
      };

      NumberDecorator._private = _private;

      return NumberDecorator;
   }
);
