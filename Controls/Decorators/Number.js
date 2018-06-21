define('Controls/Decorators/Number',
   [
      'Core/deprecated',
      'Controls/Decorator/Number'
   ],
   function(deprecated, Number) {

      'use strict';

      deprecated.showInfoLog('Модуль Number переехал из папки Decorators в папку Decorator. Controls/Decorators/Number скоро будет удален, используйте Controls/Decorator/Number');

      return Number;
   }
);
