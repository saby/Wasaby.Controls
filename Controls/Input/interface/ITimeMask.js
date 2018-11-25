define('Controls/Input/interface/ITimeMask', [
], function() {

   /**
    * Interface for time inputs mask.
    *
    * @interface Controls/Input/interface/ITimeMask
    * @public
    * @author Миронов А.Ю.
    */

   /**
    * @name Controls/Input/ITimeMask#mask
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

});
