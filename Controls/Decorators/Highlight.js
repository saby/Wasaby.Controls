define('Controls/Decorators/Highlight',
   [
      'Core/deprecated',
      'Controls/Decorator/Highlight'
   ],
   function(deprecated, Highlight) {

      'use strict';

      deprecated.showInfoLog('Модуль Highlight переехал из папки Decorators в папку Decorator. Controls/Decorators/Highlight скоро будет удален, используйте Controls/Decorator/Highlight');

      return Highlight;
   }
);
