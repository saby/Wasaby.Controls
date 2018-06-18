define('Controls/Decorators/WrapURLs',
   [
      'Core/deprecated',
      'Controls/Decorator/WrapURLs'
   ],
   function(deprecated, WrapURLs) {

      'use strict';

      deprecated.showInfoLog('Модуль WrapURLs переехал из папки Decorators в папку Decorator. Controls/Decorators/WrapURLs скоро будет удален, используйте Controls/Decorator/WrapURLs');

      return WrapURLs;
   }
);
