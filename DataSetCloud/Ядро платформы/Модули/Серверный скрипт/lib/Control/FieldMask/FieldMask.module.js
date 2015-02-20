/**
 * Created with JetBrains PhpStorm.
 * User: su.filippov
 * Date: 05.12.14
 * Time: 12:05
 * To change this template use File | Settings | File Templates.
 */
define("js!SBIS3.CORE.FieldMask", ["js!SBIS3.CORE.FieldFormatAbstract"], function( FieldFormatAbstract ) {

   "use strict";

   /**
    * Поля с фиксированной маской
    * @class $ws.proto.FieldMask
    * @extends $ws.proto.FieldFormatAbstract
    * @control
    * @category Fields
    * @initial
    * <component data-component='SBIS3.CORE.FieldMask' style='width: 100px'>
    * </component>
    */
   $ws.proto.FieldMask = FieldFormatAbstract.extend(/** @lends $ws.proto.FieldMask.prototype */{
      /**
       * @event onInputEnd При вводе последнего символа
       * При этом ввод может быть осуществлён как полностью, так и частично.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @example
       * При завершении ввода перевести фокус на следующий контрол (nextField), который найден заранее.
       * <pre>
       *    myField.subscribe('onInputEnd', function() {
       *       nextField.setActive(true);
       *    });
       * </pre>
       */
      /**
       * @event onChangePure При вводе текста в поле
       * Событие возникает даже тогда, когда значение поля в контексте не изменилось, но при этом текстовое значение внутри поля поменялось.
       * Например, не до конца ввели дату, но ввод какой-то её части был произведён.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {String} value Текущее значение элемента управления.
       * @example
       * Если не введено ни одного пробела, то провалидировать поле (myField).
       * <pre>
       *    myField.subscribe('onChangePure', function() {
       *       if(this.getStringValue().indexOf(' ') === -1) {
       *          this.validate();
       *       }
       *    });
       * </pre>
       */
      $protected : {
         _options : {
            cssClassName: 'ws-field-format',
            cssClass: 'ws-field-format'
         }
      }
   });

   return $ws.proto.FieldMask;

});
