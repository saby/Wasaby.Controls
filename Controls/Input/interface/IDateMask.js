define('Controls/Input/interface/IDateMask', [
], function() {

   /**
    * Interface for date inputs mask.
    *
    * @interface Controls/Input/interface/IDateMask
    * @public
    * @author Миронов А.Ю.
    */

   /**
    * @name Controls/Input/interface/IDateMask#mask
    * @cfg {String} Date format.
    *
    * @variant 'DD.MM.YYYY'
    * @variant 'DD.MM.YY'
    * @variant 'YYYY-MM-DD'
    * @variant 'YY-MM-DD'
    * @remark
    * Allowed mask chars:
    * <ol>
    *    <li>D - day.</li>
    *    <li>M - month.</li>
    *    <li>Y - year.</li>
    *    <li>".", "-" - delimiters.</li>
    * </ol>
    * If some part of the date is missing, it will be saved from the previously established value of the value option.
    * If the previous value of the control was null, then the following date are used 01.01.1900 00: 00.000
    * @example
    * In this example, the mask is set so that only the time can be entered in the input field.
    * After a user has entered a “01:01:2018”, the value of the _inputValue will be equal 01.01:2018 00:00.000
    * <pre>
    *    <Controls.Input.Date.Picker bind:value="_inputValue" mask=”DD.MM.YYYY”/>
    * </pre>
    * <pre>
    *    Control.extend({
    *       _inputValue: null
    *    });
    * </pre>
    * In next example after a user has entered a “01:01:2018”, the value of the _inputValue will be equal “01.01.2018 14:15.000.
    * <pre>
    *    <Controls.Input.Date.Picker bind:value="_inputValue" mask=”DD.MM.YYYY”/>
    * </pre>
    * <pre>
    *    Control.extend({
    *       _inputValue: ew Date(2001, 2, 10, 14, 15 )
    *    });
    * </pre>
    */

});
