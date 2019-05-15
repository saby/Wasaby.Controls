define('Controls-demo/Example/Input/Font',
   [
      'Core/Control',
      'wml!Controls-demo/Example/Input/Font/Font',

      'Controls/input',
      'css!Controls-demo/Example/resource/Base',
      'Controls-demo/Example/resource/BaseDemoInput'
   ],
   function(Control, template) {
      'use strict';

      var FILLED_VALUE = 'Text in the input field';
      var FILLED_MONEY_VALUE = '852.45';

      return Control.extend({
         _template: template,

         _filledValue1: FILLED_VALUE,
         _filledValue2: FILLED_VALUE,
         _filledValue3: FILLED_VALUE,
         _filledValueRM: FILLED_VALUE,
         _filledMoneyValue1: FILLED_MONEY_VALUE,
         _filledMoneyValue2: FILLED_MONEY_VALUE,
         _filledMoneyValue3: FILLED_MONEY_VALUE,
         _filledMoneyValueRM: FILLED_MONEY_VALUE
      });
   });
