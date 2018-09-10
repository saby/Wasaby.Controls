define('Controls/Input/TimeInterval', [
], function() {

   /**
    * Input for enter time interval information (with precision from days to minutes).
    * Only ISO_8601 dates can be entered.
    *
    * @class Controls/Input/TimeInterval
    * @mixes Controls/Input/interface/IInputText
    * @mixes Controls/Input/interface/IValidation
    * @mixes Controls/Input/interface/IInputTag
    * @control
    * @public
    * @author Журавлев М.С.
    * @category Input
    */

   /**
    * @name Controls/Input/TimeInterval#mask
    * @cfg {String} Format of the time interval.
    *
    * Allowed mask keys:
    * <ol>в
    *    <li>D - day.</li>
    *    <li>H - hour.</li>
    *    <li>I - minute.</li>
    *    <li>":" - used as a delimiter.</li>
    * </ol>
    * @example
    * <pre>
    *     <option name="mask">DD:HH:II</option>
    * </pre>
    * @variant 'DD:HH:II'
    * @variant 'DD:HH'
    * @variant 'HH:II'
    * @variant 'DDDD:HH:II'
    * @variant 'DDD:HH:II'
    * @variant 'HHHH:II'
    * @variant 'HHH:II'
    * @variant 'DDDD:HH'
    * @variant 'DDD:HH'
    */

});
