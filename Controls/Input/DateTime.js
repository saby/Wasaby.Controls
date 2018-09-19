define('Controls/Input/DateTime', [
], function() {

   /**
    * Control for entering date and time.
    * Depending on {@link mask mask} can be used to enter:
    * <ol>
    *    <li>just date,</li>
    *    <li>just time,</li>
    *    <li>date and time.</li>
    * </ol>
    * @class Controls/Input/DateTime
    * @mixes Controls/Input/interface/IInputText
    * @mixes Controls/Input/interface/IInputDateTime
    * @mixes Controls/Input/interface/IValidation
    * @control
    * @public
    * @author Журавлев М.С.
    * @category Input
    */

   /**
    * @name Controls/Input/DateTime#mask
    * @cfg {String} Data format.
    *
    * One of the listed mask must be choosen. Allowed mask chars:
    * <ol>
    *    <li>D - day.</li>
    *    <li>M - month.</li>
    *    <li>Y - year.</li>
    *    <li>H - hour.</li>
    *    <li>I - minute.</li>
    *    <li>S - second.</li>
    *    <li>U - millisecond.</li>
    *    <li>".", "-", ":", "/" - delimiters.</li>
    * </ol>
    * @variant 'DD.MM.YYYY'
    * @variant 'DD.MM.YY'
    * @variant 'DD.MM'
    * @variant 'YYYY-MM-DD'
    * @variant 'YY-MM-DD'
    * @variant 'HH:II:SS.UUU'
    * @variant 'HH:II:SS'
    * @variant 'HH:II'
    * @variant 'DD.MM.YYYY HH:II:SS.UUU'
    * @variant 'DD.MM.YYYY HH:II:SS'
    * @variant 'DD.MM.YYYY HH:II'
    * @variant 'DD.MM.YY HH:II:SS.UUU'
    * @variant 'DD.MM.YY HH:II:SS'
    * @variant 'DD.MM.YY HH:II'
    * @variant 'DD.MM HH:II:SS.UUU'
    * @variant 'DD.MM HH:II:SS'
    * @variant 'DD.MM HH:II'
    * @variant 'YYYY-MM-DD HH:II:SS.UUU'
    * @variant 'YYYY-MM-DD HH:II:SS'
    * @variant 'YYYY-MM-DD HH:II'
    * @variant 'YY-MM-DD HH:II:SS.UUU'
    * @variant 'YY-MM-DD HH:II:SS'
    * @variant 'YY-MM-DD HH:II'
    * @variant 'YYYY'
    * @variant 'MM/YYYY'
    */
});
