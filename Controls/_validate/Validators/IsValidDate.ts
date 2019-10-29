import dateUtils = require('Controls/Utils/Date');
import cInstance = require('Core/core-instance');
/**
 * Функция проверяет дату и время на валидность.
 * @class
 * @name Controls/_validate/Validators/IsValidDate
 * @public

 * @author Красильников А.С.
 *
 * @remark
 * ## Аргументы функции
 *
 * - value — проверяемое значение.
 * - doNotValidate:Boolean — требуется ли валидация.
 *
 * ## Типы возвращаемых значений
 *
 * - true — значение прошло проверку на валидность.
 * - String — значение не прошло проверку на валидность, возвращается текст сообщения об ошибке.
 *
 * ## Пример использования функции
 *
 * <pre>
 * <Controls.validate:InputContainer name="InputValidate">
 *     <ws:validators>
 *         <ws:Function value="{{_isValidDate}}">Controls/validate:isValidDate</ws:Function>
 *     </ws:validators>
 *     <ws:content>
 *         <Controls.input:Text bind:value="_isValidDate"/>
 *     </ws:content>
 * </Controls.validate:InputContainer>
 * </pre>
 */

export = function (args) {
   if (args.doNotValidate || !args.value || dateUtils.isValidDate(args.value)) {
      return true;
   }

   if ( cInstance.instanceOfModule(args.value, 'Types/entity:Date')) {
      return rk('Дата заполнена некорректно');
   } else if (cInstance.instanceOfModule(args.value, 'Types/entity:Time')) {
      return rk('Время заполнено некорректно');
   }

   return rk('Дата или время заполнены некорректно');
};
