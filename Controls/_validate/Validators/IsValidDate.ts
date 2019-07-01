import dateUtils = require('Controls/Utils/Date');
/**
 * Функция, позволяющая проверить дату и время на валидность.
 *
 * <h2>Function argument</h2>
 *
 * value - значение, которое будет проверяться на валидность.
 * doNotValidate: Boolean -  требуется ли валидация
 *
 * <h2>Returns</h2>
 *
 * <ul>
 *     <li><b>true</b> - валидное значение</li>
 *     <li><b>String</b> - не валидное значение ( возвращается сообщение об ошибке ) </li>
 * </ul>
 *
 * <h2>Usage example</h2>
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