define('Controls/Input/resources/ConfigBinder',
   [],
   function() {
      'use strict';
      /**
       * Класс позволяющий связать функцию с необходимым ей конфигом
       * @class Controls/Input/resources/ConfigBinder
       * @private
       * @author Баранов М.А.
       * @param config {Object} объект с конфигурацией
       * @param executeFunc {Object} функция, в которой необходим будет доступ к конфигу
       */
      return function ConfigBinder(config, executeFunc) {
         this.config = config;
         this.execute = executeFunc;
      }
   }
);