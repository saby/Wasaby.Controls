define('js!SBIS3.CONTROLS.Utils.RecordSetUtil',[], function () {
   'use strict';
    /**
     * @class SBIS3.CONTROLS.Utils.RecordSetUtil
     * @public
     */
   var RecordSetUtil = /** @lends SBIS3.CONTROLS.Utils.RecordSetUtil.prototype */{
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