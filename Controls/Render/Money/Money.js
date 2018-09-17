define('Controls/Render/Money/Money', [
   'Core/Control',
   'tmpl!Controls/Render/Money/Money',
   'css!?Controls/Render/Money/Money'

], function(Control, Template) {

   'use strict';

   var
      _private = {
         getPartsOfNumber: function(text, alwaysFraction) {
            text = text + '';
            var
               integer,
               fraction =  text.split('.')[1] || (alwaysFraction ? '00' : ''),
               numReg = /^-?([0]*)(\d+)\.?\d*\D*$/,
               regResult;
            if (!text.match(numReg)) {
               integer = '0';
            }
            regResult = text.replace(numReg, '$2');
            integer = integer === '0' ? integer : (text.substr(0, 1) === '-' ? '-' : '') + (regResult.replace(/(?=(\d{3})+$)/g, ' ').trim());
            if (fraction.length == 1 && alwaysFraction) {
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

         constructor: function(cfg) {
            this._options = cfg;
            Money.superclass.constructor.apply(this, arguments);
         },

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
