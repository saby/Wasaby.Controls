/**
 * Created by am.gerasimov on 01.02.2016.
 */
define('SBIS3.CONTROLS/Date/RangeBigChoose/resources/Validators', [
   'Core/helpers/String/format',
   'i18n!SBIS3.CONTROLS/Date/RangeBigChoose'
], function (format) {
   'use strict';

   /**
    * SBIS3.CONTROLS/Date/RangeBigChoose/resources/Validators
    * @class SBIS3.CONTROLS/Date/RangeBigChoose/resources/Validators
    * @author Миронов А.Ю.
    */
   return /** @lends SBIS3.CONTROLS/Date/RangeBigChoose/resources/Validators.prototype */{
      //TODO: Доработать и вынести в общие валидаторы
      compareExt: function (controlName, getterName, eType, currentValue) {
         var compareValue, errorString;
         if (currentValue === undefined || currentValue === null) {
            return true;
         }
         try {
            compareValue = this.getParent().getChildControlByName(controlName)[getterName]();
         } catch(e) {
            return false;
         }
         if (eType === '<=') {
            errorString = format(rk('Значение поля должно быть меньше или равно значения поля "$name$s$"'), {name: name});
            return (currentValue <= compareValue) ? true : errorString;
         } else if (eType === '>=') {
            errorString = format(rk('Значение поля должно быть больше или равно значения поля "$name$s$"'), {name: name});
            return (currentValue >= compareValue) ? true : errorString;
         }
      }
   };
});