import dateUtils = require('Controls/Utils/Date');
/**
 * Функция, позволяющая проверить дату и время на валидность.
 *
 * <h2>Аргументы функции</h2>
 *
 * value - значение, которое будет проверяться на валидность.
 * doNotValidate:Boolean -  требуется ли валидация
 *
 * <h2>Возвращаемые значения</h2>
 *
 * <ul>
 *     <li><b>true</b> - значение прошло проверку на валидность </li>
 *     <li><b>String</b> - значение не прошло проверку на валидность, возвращается текст сообщения об ошибке </li>
 * </ul>
 *
 * <h2>Пример использования функции:</h2>
 * <pre>
 *   <Controls.validate:InputContainer name="InputValidate">
 *     <ws:validators>
 *      <ws:Function value="{{_isValidDate}}">Controls/validate:isValidDate</ws:Function>
 *      </ws:validators>
 *      <ws:content>
 *        <Controls.input:Text bind:value="_isValidDate"/>
 *      </ws:content>
 *  </Controls.validate:InputContainer>
 * </pre>
 *
 * @class Controls/_validate/Validators/IsRequired
 * @public

 * @author Красильников А.С.
 */

export = function (args) {
   if (args.doNotValidate || !args.value || dateUtils.isValidDate(args.value)) {
      return true;
   }

   return rk('Дата или время заполнены некорректно.');
};