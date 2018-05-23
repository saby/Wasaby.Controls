define('Controls/Decorators/Money',
   [
      'Core/IoC',
      'Core/Control',
      'WS.Data/Type/descriptor',
      'tmpl!Controls/Decorators/Money/Money',

      'css!Controls/Decorators/Money/Money'
   ],
   function(IoC, Control, descriptor, template) {

      'use strict';

      /**
       * Converts a number to money.
       *
       * @class Controls/Decorators/Money
       * @extends Core/Control
       * @control
       * @public
       * @category Decorators
       *
       * @name Controls/Decorators/Money#number
       * @cfg {Number} Number to convert.
       *
       * @name Controls/Decorators/Money#type
       * @cfg {String} The type with which you want to display money.
       * @variant accentResults
       * @variant noAccentResults
       * @variant group
       * @variant basicRegistry
       * @variant noBasicRegistry
       * @variant accentRegistry
       * @variant noAccentRegistry
       */

      var _private = {
         searchPaths: /([0-9]*?)(\.[0-9]{2})/,

         parseNumber: function(number) {
            var exec = this.searchPaths.exec(number.toFixed(2));

            if (!exec) {
               IoC.resolve('ILogger').error('Controls/Decorators/Money', 'That is not a valid option number: ' + number + '.');
               exec = ['0.00', '0', '.00'];
            }

            return {
               number: exec[0],
               integer: exec[1],
               fraction: exec[2]
            };
         }
      };

      var Money = Control.extend({
         _template: template,

         _parsedNumber: null,

         _beforeMount: function(options) {
            this._parsedNumber = _private.parseNumber(options.number);
         },

         _beforeUpdate: function(newOptions) {
            if (newOptions.number !== this._options.number) {
               this._parsedNumber = _private.parseNumber(newOptions.number);
            }
         }
      });

      Money.getOptionTypes = function() {
         return {
            number: descriptor(Number).required()
         };
      };

      Money._private = _private;

      return Money;
   }
);
