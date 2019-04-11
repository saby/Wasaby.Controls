/**
 * Interface for TimeInterval input mask.
 *
 * @interface Controls/_input/interface/ITimeInterval
 * @public
 * @author Миронов А.Ю.
 */

/**
 * @name Controls/_input/interface/ITimeInterval#mask
 * @cfg {String} TimeInterval.
 *
 * @variant 'HH:MM'
 * @variant 'HHH:MM'
 * @variant 'HHHH:MM'
 * @variant 'HH:MM:SS'
 * @variant 'HHH:MM:SS'
 * @variant 'HHHH:MM:SS'
 * @remark
 * Allowed mask chars:
 * <ol>
 *    <li>H - hours.</li>
 *    <li>M - minutes.</li>
 *    <li>S - seconds.</li>
 *    <li>":" - delimiters.</li>
 * </ol>
 * If some part of the TimeInterval is missing, they will be autocompleted.
 * For example, for mask 'HH:mm:ss' - input of '1 : 1: 1' will be transformed to '01:01:01' value.
 */
/**
 * @name Controls/_input/interface/ITimeInterval#value
 * @cfg {Object} TimeInterval.
 *
 * @remark
 * TimeInterval value should be set with TimeInterval object usage:
 * For example: value = new TimeInterval('P20DT3H1M5S'),  value = new TimeInterval({days: 1, minutes: 5}) e t.c.
 * More information in Core/TimeInterval
 * @see Core/TimeInterval
 */
