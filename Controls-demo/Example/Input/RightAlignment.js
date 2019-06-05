define('Controls-demo/Example/Input/RightAlignment',
   [
      'Core/Control',
      'wml!Controls-demo/Example/Input/RightAlignment/RightAlignment',

      'Controls/input',
      'Controls-demo/Example/resource/BaseDemoInput'
   ],
   function(Control, template) {
      'use strict';

      var FILLED_VALUE = 'Text in the input field';
      var FILLED_MONEY_VALUE = '852.45';
      var FILLED_NUMBER_VALUE = 123.456;

      return Control.extend({
         _template: template,

         _filledValue1: FILLED_VALUE,
         _filledValueRM: FILLED_VALUE,
         _filledMoneyValue1: FILLED_MONEY_VALUE,
         _filledMoneyValueRM: FILLED_MONEY_VALUE,
         _filledNumberValue1: FILLED_NUMBER_VALUE,
         _filledNumberValueRM: FILLED_NUMBER_VALUE
      });
   });
