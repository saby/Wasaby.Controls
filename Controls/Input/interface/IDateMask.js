define('Controls/Input/interface/IDateMask', [
], function() {

   /**
    * Interface for date inputs mask.
    *
    * @interface Controls/Input/interface/IDateMask
    * @public
    */

   /**
    * @name Controls/Input/IDateMask#mask
    * @cfg {String} Data format.
    *
    * One of the listed mask must be choosen. Allowed mask chars:
    * <ol>
    *    <li>D - day.</li>
    *    <li>M - month.</li>
    *    <li>Y - year.</li>
    *    <li>".", "-" - delimiters.</li>
    * </ol>
    * @variant 'DD.MM.YYYY'
    * @variant 'DD.MM.YY'
    * @variant 'YYYY-MM-DD'
    * @variant 'YY-MM-DD'
    */

});
