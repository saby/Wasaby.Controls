define('Controls/Input/interface/ITimeInterval', [
], function() {

   /**
    * Interface for TimeInterval input mask.
    *
    * @interface Controls/Input/interface/ITimeInterval
    * @public
    * @author Водолазских А.А.
    */

   /**
    * @name Controls/Input/interface/ITimeInterval#mask
    * @cfg {String} TimeInterval.
    *
    * @variant 'HH:mm'
    * @variant 'HHH:mm'
    * @variant 'HHHH:mm'
    * @variant 'HH:mm:ss'
    * @variant 'HHH:mm:ss'
    * @variant 'HHHH:mm:ss'
    * @remark
    * Allowed mask chars:
    * <ol>
    *    <li>H - hours.</li>
    *    <li>m - minutes.</li>
    *    <li>s - seconds.</li>
    *    <li>":" - delimiters.</li>
    * </ol>
    * If some part of the TimeInterval is missing, they will be autocompleted.
    * For example, for mask 'HH:mm:ss' - input of '1 : 1: 1' will be transformed to '01:01:01' value.
    */
   /**
    * @name Controls/Input/interface/ITimeInterval#value
    * @cfg {Object} TimeInterval.
    *
    * @remark
    * TimeInterval value should be set with TimeInterval object usage:
    * For example: value = new TimeInterval('P20DT3H1M5S'),  value = new TimeInterval({days: 1, minutes: 5}) e t.c.
    * More information in Core/TimeInterval
    * @see Core/TimeInterval
    */
});
