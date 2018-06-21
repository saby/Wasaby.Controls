define('Controls/Decorators/Money',
   [
      'Core/deprecated',
      'Controls/Decorator/Money'
   ],
   function(deprecated, Money) {

      'use strict';

      deprecated.showInfoLog('Модуль Money переехал из папки Decorators в папку Decorator. Controls/Decorators/Money скоро будет удален, используйте Controls/Decorator/Money');

      return Money;
   }
);
