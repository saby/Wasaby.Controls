/**
 * Created by am.gerasimov on 01.02.2016.
 */
define('js!SBIS3.CONTROLS.DateRangeBigChoose.Validators', [
   'js!Core/helpers/string-helpers',
   'i18n!SBIS3.CONTROLS.DateRangeBigChoose'
], function (stringHelpers) {
   'use strict';

   /**
    * SBIS3.CONTROLS.DateRangeBigChoose.Validators
    * @class SBIS3.CONTROLS.DateRangeBigChoose.Validators
    * @author Миронов Александр Юрьевич
    */
   return /** @lends SBIS3.CONTROLS.DateRangeBigChoose.Validators.prototype */{
      //TODO: Доработать и вынести в общие валидаторы
      compareExt: function (controlName, getterName, eType, currentValue) {
         var compareValue, errorString;
         if (currentValue === undefined || currentValue === null) {
            return true;
         }
         try {
            compareValue = this.getTopParent().getChildControlByName(controlName)[getterName]();
         } catch(e) {
            return false;
         }
         if (eType === '<=') {
            errorString = stringHelpers.format(rk('Значение поля должно быть меньше или равно значения поля "$name$s$"'), {name: name});
            return (currentValue <= compareValue) ? true : errorString;
         } else if (eType === '>=') {
            errorString = stringHelpers.format(rk('Значение поля должно быть больше или равно значения поля "$name$s$"'), {name: name});
            return (currentValue >= compareValue) ? true : errorString;
         }
      }
   };
});