define('js!SBIS3.CONTROLS.ILongOperationsExportableProducer',
   [],

   function () {
   'use strict';

   /**
    * Интерфейс экспортирующего продюсера длительных операций
    * @interface SBIS3.CONTROLS.ILongOperationsExportableProducer
    * @public
    */

   return /** @lends SBIS3.CONTROLS.ILongOperationsExportableProducer.prototype */{
      /**
       * Экспортировать объект из внутреннего представления продюсера в SBIS3.CONTROLS.LongOperationEntry
       * @public
       * @param {WS.Data/Entity/Record} source Экпортируемый объект
       * @return {SBIS3.CONTROLS.LongOperationEntry}
       */
      export: function (source) {
         throw new Error('Method must be implemented');
      }
   };
});
