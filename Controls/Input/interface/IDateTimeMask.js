define('Controls/Input/interface/IDateTimeMask', [
], function() {

   /**
    * Interface for date/time inputs mask.
    *
    * @interface Controls/Input/interface/IDateTimeMask
    * @public
    */

   /**
    * @name Controls/Input/IDateTimeMask#mask
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
