var
   regExp = /^(([а-я0-9+_-]+\.)*[а-я0-9+_-]+@[а-я0-9+_-]+(\.[а-я0-9+_-]+)*\.[а-я]{2,9}|([a-z0-9+_-]+\.)*[a-z0-9+_-]+@[a-z0-9+_-]+(\.[a-z0-9+_-]+)*\.[a-z]{2,9}|([a-z0-9+_-]+\.)*[a-z0-9+_-]+@[а-я0-9+_-]+(\.[а-я0-9+_-]+)*\.[а-я]{2,9})$/;


/**
 * Функция, позволяющая проверить введенный email на валидность.
 *
 * <h2>Function argument</h2>
 *
 * value: String - значение, которое будет проверяться на валидность
 *
 * <h2>Returns</h2>
 *
 * <ul>
 *     <li><b>true</b> - валидный email</li>
 *     <li><b>String</b> - невалидный email ( возвращается сообщение об ошибке ) </li>
 * </ul>
 *
 * <h2>Usage example</h2>
 * <pre>
 *   <Controls.validate:InputContainer name="InputValidate">
 *     <ws:validators>
 *      <ws:Function value="{{_valueEmail}}">Controls/validate:isEmail</ws:Function>
 *      </ws:validators>
 *      <ws:content>
 *        <Controls.input:Text bind:value="_valueEmail"/>
 *      </ws:content>
 *  </Controls.validate:InputContainer>
 * </pre>
 *
 * @class Controls/_validate/Validators/IsEmail
 * @public
 * @author Красильников А.С.
 */

export = function (args) {
   //Пустое значение должно быть валидным
   if (!args.value) {
      return true;
   }

   var
      lowerCaseValue = args.value.toLowerCase();

   return regExp.test(lowerCaseValue) || rk('В поле требуется ввести адрес электронной почты');
};