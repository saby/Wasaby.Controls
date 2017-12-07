define('Controls/Input/resources/PrepareData',
   [],
   function() {
      'use strict';

      return function PrepareData(config, executeFunc) {
         this.config = config;
         this.execute = executeFunc;
      }
   }
);