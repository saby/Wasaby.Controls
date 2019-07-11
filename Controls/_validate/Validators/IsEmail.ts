var
   regExp = /^(([а-я0-9+_-]+\.)*[а-я0-9+_-]+@[а-я0-9+_-]+(\.[а-я0-9+_-]+)*\.[а-я]{2,9}|([a-z0-9+_-]+\.)*[a-z0-9+_-]+@[a-z0-9+_-]+(\.[a-z0-9+_-]+)*\.[a-z]{2,9}|([a-z0-9+_-]+\.)*[a-z0-9+_-]+@[а-я0-9+_-]+(\.[а-я0-9+_-]+)*\.[а-я]{2,9})$/;


/**
 * Функция, позволяющая проверить введенный email на валидность.
 *
 * <h2>Аргументы функции</h2>
 *
 * value - значение, которое будет проверяться на валидность.
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
 *      <ws:Function value="{{_valueEmail}}">Controls/validate:isEmail</ws:Function>
 *      </ws:validators>
 *      <ws:content>
 *        <Controls.input:Text bind:value="_valueEmail"/>
 *      </ws:content>
 *  </Controls.validate:InputContainer>
 * </pre>
 *
 * @class
 * @name Controls/_validate/Validators/IsEmail
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