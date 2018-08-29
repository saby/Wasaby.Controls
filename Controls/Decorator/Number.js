define('Controls/Decorator/Number',
   [
      'Core/Control',
      'WS.Data/Type/descriptor',
      'tmpl!Controls/Decorator/Number/Number'
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
       *
       * @author Журавлев Максим Сергеевич
       */

      /**
       * @name Controls/Decorator/Number#number
       * @cfg {Number} Number to divide into triads.
       */

      /**
       * @name Controls/Decorator/Number#fractionSize
       * @cfg {Number} Number of decimal places. Range from 0 to 20.
       */

      var _private = {
         formatNumber: function(number, fractionSize) {
            if (typeof fractionSize === 'number') {
               number = number.toFixed(fractionSize);
            } else {
               number = String(number);
            }

            /**
             * Create an array of integer and fractional parts.
             * Divide the integer part into triads.
             */
            number = number.split('.');
            number[0] = number[0].replace(/(\d)(?=(\d{3})+$)/g, '$& ');

            return number.join('.');
         }
      };

      var NumberDecorator = Control.extend({
         _template: template,

         _formattedNumber: null,

         _beforeMount: function(options) {
            this._formattedNumber = _private.formatNumber(options.number, options.fractionSize);
         },

         _beforeUpdate: function(newOptions) {
            if (newOptions.number !== this._options.number || newOptions.fractionSize !== this._options.fractionSize) {
               this._formattedNumber = _private.formatNumber(newOptions.number, newOptions.fractionSize);
            }
         }
      });

      NumberDecorator.getOptionTypes = function() {
         return {
            number: descriptor(Number).required(),
            fractionSize: descriptor(Number)
         };
      };

      NumberDecorator._private = _private;

      return NumberDecorator;
   }
);
