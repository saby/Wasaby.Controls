define('js!SBIS3.CONTROLS.Utils.RecordSetUtil',[], function () {
   'use strict';
   var RecordSetUtil = {
      /**
       * Возвращает массив значений переданных записей по указанному полю
       * @param {Array} records массив записей
       * @param {String} field поле, из которого получаем значение
       * @returns {Array}
       */
      getRecordsValue: function(records, field){
         var result = [];
         for (var i = 0, l = records.length; i < l; i++){
            result.push(records[i].get(field));
         }
         return result;
      }
   };

   return RecordSetUtil;
});