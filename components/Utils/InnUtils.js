/**
 * Created by kraynovdo on 23.05.2018.
 */
define('SBIS3.CONTROLS/Utils/InnUtils', [], function() {
   function getValueForValidation(ctlValue) {
      if (ctlValue === undefined || ctlValue === null || ctlValue === '') {
         return '';
      }
      return ctlValue;
   }

   function innCheckSum (self){
      var value = getValueForValidation(self.getValue());
      return innCheckValue(value);
   }

   function innCheckValue(value){
      if(value === ''){
         return true;
      }

      if (value === '000000000000' || value === '0000000000'){
         return rk('ИНН не может состоять из одних нулей');
      }

      var
         koef = [3,7,2,4,10,3,5,9,4,6,8],
         val = value.toString(),
         sum = 0, i, j;

      if (val.length === 12) {
         for(i = 0,j = 1; i < 10; i++, j++){
            sum += val.charAt(i) * koef[j];
         }
         if((sum % 11) % 10 == val.charAt(10)){
            sum = 0;
            for(i = 0, j = 0; i < 11; i++, j++){
               sum += val.charAt(i) * koef[j];
            }
            if((sum % 11) % 10 == val.charAt(11))
               return true;
         }
      } else {
         if( val.length === 10 ){// 10 digits
            for(i = 0, j = 2; i < 9; i++, j++){
               sum += val.charAt(i) * koef[j];
            }
            if((sum % 11) % 10 == val.charAt(9)){
               return true;
            }
         } else {
            return true;
         }
      }
      return rk('Неверная контрольная сумма ИНН');
   }

   var res = {
      /**
       * Проверяет строку на соответствие формату идентификационного номера налогоплательщика (ИНН).
       * @param {Number|String} [innLen] Устанавливает длину строки, которой должен соответствовать введённый ИНН.
       * @returns {Boolean|String}
       * <ol>
       *    <li>В случае прохождения валидации возвращает true.</li>
       *    <li>В случае не прохождения валидации возвращает сообщение "ИНН должен состоять из 10 или 12 цифр".</li>
       * </ol>
       * @see innCheckValue
       * @see innCheckSum
       */
      inn : function(innLen) {
         innLen = parseInt(innLen, 10) || 0;
         var value = getValueForValidation(this.getValue());
         if(value === ''){
            return true;
         }

         var
            valLen = ('' + value).length,
            isNumbers = (/^([0-9]+)$/).test(value),
            isCorrectLength = (innLen > 0) ?  (('' + value).length == innLen) : (valLen === 10 || valLen === 12);
         if(!isNumbers || !isCorrectLength){
            return rk('ИНН должен состоять из') + ' ' + (innLen > 0 ? innLen : rk('10 или 12')) + ' ' + rk('цифр');
         }

         return innCheckSum( this );
      },
   };
   return res;
});