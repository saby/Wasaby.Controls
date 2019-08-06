/**
 * Интерфейс для поля ввода времени с маской.
 *
 * @interface Controls/interface/ITimeMask
 * @public
 * @author Красильников А.С.
 */

/*
 * Interface for time inputs mask.
 *
 * @interface Controls/interface/ITimeMask
 * @public
 * @author Красильников А.С.
 */ 
interface ITimeMask {
   readonly _options: {
      /**
       * @name Controls/interface/ITimeMask#mask
       * @cfg {String} Формат ввода даты.
       *
       * Необходимо выбрать одну из перечисленных масок. Разрешенные символы маски:
       * <ol>
       *    <li>H - час.</li>
       *    <li>I - минута.</li>
       *    <li>S - секунда.</li>
       *    <li>U - миллисекунда.</li>
       *    <li>".", "-", ":", "/" - разделитель.</li>
       * </ol>
       * @variant 'HH:II:SS.UUU'
       * @variant 'HH:II:SS'
       * @variant 'HH:II'
       */

      /*
       * @name Controls/interface/ITimeMask#mask
       * @cfg {String} Data format.
       *
       * One of the listed mask must be choosen. Allowed mask chars:
       * <ol>
       *    <li>H - hour.</li>
       *    <li>I - minute.</li>
       *    <li>S - second.</li>
       *    <li>U - millisecond.</li>
       *    <li>".", "-", ":", "/" - delimiters.</li>
       * </ol>
       * @variant 'HH:II:SS.UUU'
       * @variant 'HH:II:SS'
       * @variant 'HH:II'
       */       
      mask: 'HH:II:SS.UUU' | 'HH:II:SS' | 'HH:II';
   };
}

export default ITimeMask;
