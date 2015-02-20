/**
 * Created with JetBrains PhpStorm.
 * User: tm.baeva
 * Date: 21.04.13
 * Time: 20:21
 * To change this template use File | Settings | File Templates.
 */
define("js!SBIS3.CORE.FieldMoney", ["js!SBIS3.CORE.FieldNumeric"], function( FieldNumeric ) {

   "use strict";

   /**
    * Поле ввода денежных значений
    * @class $ws.proto.FieldMoney
    * @extends $ws.proto.FieldNumeric
    * @control
    * @initial
    * <component data-component='SBIS3.CORE.FieldMoney' style='width: 100px'>
    * </component>
    * @category Fields
    * @designTime actions SBIS3.CORE.FieldString/design/design
    * @ignoreOptions decimals
    */
   $ws.proto.FieldMoney = FieldNumeric.extend(/** @lends $ws.proto.FieldMoney.prototype */{
       $protected : {
         _options : {
            /**
             * @cfg {Number} Количество знаков после запятой
             * Отрицательное значение опции - количество знаков после запятой не ограничено
             * <wiTag group='Управление'>
             */
            decimals: 2,
            cssClassName: 'ws-field-numeric ws-field-money'
         }
      },
      /**
       * Обработка денежного значения
       * @param {String} value входное значение
       * @returns {String} value обработанное значение на выходе
       * @protected
       */
      _valueInternalProcessing: function(value){
         if (value === null) {
            value = undefined;
         }
         return $ws.proto.FieldMoney.superclass._valueInternalProcessing.apply(this, [value]);
      }
   });

   return $ws.proto.FieldMoney;

});
