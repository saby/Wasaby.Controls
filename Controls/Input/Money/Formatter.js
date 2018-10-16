define('Controls/Input/Money/Formatter', 
   [],
   function() {

      'use strict';

      var _private = {
         digitRegExp: /\d/,

         separatorRegExp: /[,.]/,

         getType: function(symbol) {
            var type;

            if (_private.digitRegExp.test(symbol)) {
               type = 'digit';
            } else {
               type = _private.separatorRegExp.test(symbol) ? 'separator' : 'invalid';
            }

            return type;
         },

         reducer: function(result, symbol, index, value) {
            switch (_private.getType(symbol)) {
               case 'separator':
                  result.hasSeparator = true;
                  break;
               case 'digit':
                  if (result.hasSeparator) {
                     result.fraction += symbol;
                  } else if (result.integer === '0') {
                     result.integer = symbol;
                  } else {
                     result.integer += symbol;
                  }
                  break;
               default:
                  break;
            }

            if (index === value.length - 1) {
               delete result.hasSeparator;
            }

            return result;
         }
      };

      var Formatter = {
         toNumber: function(value) {
            return Array.prototype.reduce.call(value, _private.reducer, {
               integer: '',
               fraction: ''
            });
         }
      };

      return Formatter;
   }
);
