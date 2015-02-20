/**
 * Created with JetBrains PhpStorm.
 * User: tm.baeva
 * Date: 21.04.13
 * Time: 20:16
 * To change this template use File | Settings | File Templates.
 */
define('js!SBIS3.CORE.FieldInteger', ['js!SBIS3.CORE.FieldNumeric'], function( FieldNumeric ) {

   'use strict';

   /**
    * Поле ввода целочисленных значений
    * @class $ws.proto.FieldInteger
    * @extends $ws.proto.FieldNumeric
    * @control
    * @initial
    * <component data-component='SBIS3.CORE.FieldInteger' style='width: 100px'>
    * </component>
    * @category Fields
    * @designTime actions SBIS3.CORE.FieldString/design/design
    * @ignoreOptions decimals
    * @ignoreOptions hideEmptyDecimals
    * @ignoreOptions showEmptyDecimalsOnFocus
    */
   $ws.proto.FieldInteger = FieldNumeric.extend(/** @lends $ws.proto.FieldInteger.prototype */{
      $protected : {
         _options : {
            cssClass: 'ws-field-numeric ws-field-integer'
         }
      },
      /**
       * Обработка целочисленного значения
       * @param {String} value входное значение
       * @returns {String} value обработанное значение на выходе
       * @protected
       */
      _valueInternalProcessing: function(value){
         var
            v = value + '',
            dotPos = v.indexOf('.');
         if (dotPos !== -1) {
            v = v.substr(0, dotPos);
         }
         if (v === 'null') {
            v = '';
         }
         return $ws.proto.FieldInteger.superclass._valueInternalProcessing.apply(this, [v]);
      }
   });

   return $ws.proto.FieldInteger;

});