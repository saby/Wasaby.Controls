/**
 * Шаблон, который по умолчанию используется для отображения месяца в MonthList.
 * @class Controls/calendar:MonthListMonthTemplate
 * @public
 */

/*
 * @name Controls/calendar:MonthListMonthTemplate#bodyTemplate
 * @cfg {String|Function} Шаблон отображения месяца
 * @remark
 * В шблон будет переданы date - дата месяа и extData.
 * @example
 * <pre>
 * <Controls.calendar:MonthList>
 *           <ws:monthTemplate>
 *              <ws:partial template="Controls/calendar:MonthListMonthTemplate">
 *                  <ws:bodyTemplate>
 *                      <Controls.calendar:MonthView/>
 *                  </ws:bodyTemplate>
 *              </ws:partial>
 *          </ws:monthTemplate>
 * </Controls.calendar:MonthList>
 * </pre>
 */
