import dateUtils = require('Controls/Utils/Date');
/**
 * Функция, позволяющая проверить период на валидность.
 * @class
 * @name Controls/_validate/Validators/IsValidDateRange
 * @public
 * @author Красильников А.С.
 *
 * @remark
 * <h2>Аргументы функции</h2>
 *
 * startValue - начало периода.
 * endValue - конец периода.
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
 *      <ws:Function startValue="{{_startValue}}" endValue="{{_endValue}}">Controls/validate:isValidDateRange</ws:Function>
 *      </ws:validators>
 *      <ws:content>
 *        <Controls.dateRange:Input bind:startValue="_startValue" bind:endValue="_endValue"/>
 *      </ws:content>
 *  </Controls.validate:InputContainer>
 * </pre>
 *
 */

function isValidDate(startValue: Date, endValue: Date): boolean {
   const start = new Date(startValue.getTime());
   const end = new Date(endValue.getTime());
   start.setHours(0, 0, 0, 0); // Убираю часы, минуты, секунды
   end.setHours(0, 0, 0, 0); // Убираю часы, минуты, секунды
   return start.getTime() <= end.getTime();
}

export default function isValidDateRange(args): boolean {
   if (args.doNotValidate || !args.startValue || !args.endValue ||
       !dateUtils.isValidDate(args.startValue) || !dateUtils.isValidDate(args.endValue) ||
       isValidDate(args.startValue, args.endValue)) {
      return true;
   }

   return rk('Дата конца периода должна быть больше даты начала');
}
