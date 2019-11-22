define('Controls/Render/Money/Money', [
   'Core/Control',
   'wml!Controls/Render/Money/Money',
   'css!theme?Controls/Render/Money/Money'
], function(Control, Template) {
   'use strict';

   var
      _private = {
         getPartsOfNumber: function(text, alwaysFraction) {
            var newText = text + '';
            var
               integer,
               fraction = newText.split('.')[1] || (alwaysFraction ? '00' : ''),
               numReg = /^-?([0]*)(\d+)\.?\d*\D*$/,
               regResult;
            if (!newText.match(numReg)) {
               integer = '0';
            }
            regResult = newText.replace(numReg, '$2');
            integer = integer === '0' ? integer : (newText.substr(0, 1) === '-' ? '-' : '') + (regResult.replace(/(?=(\d{3})+$)/g, ' ').trim());
            if (fraction.length === 1 && alwaysFraction) {
               fraction = fraction + '0';
            }
            return {
               integer: integer,
               fraction: fraction
            };
         }
      },

      Money = Control.extend({
         _template: Template,

         getModel: function() {
            var
               type = 'default',
               text = this._options.text - 0,
               numberObj = _private.getPartsOfNumber(text.toFixed(2), true);
            if (this._options.type) {
               type = this._options.type;
            }
            return {
               integer: numberObj.integer,
               fraction: numberObj.fraction,
               title: numberObj.integer + '.' + numberObj.fraction,
               type: type
            };
         }
      });

   return Money;
});
