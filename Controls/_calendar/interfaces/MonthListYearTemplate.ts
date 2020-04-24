/**
 * Шаблон, который по умолчанию используется для отображения года в MonthList.
 * @class Controls/calendar:MonthListMonthTemplate
 * @public
 */

/*
 * @name Controls/calendar:MonthListMonthTemplate#bodyTemplate
 * @cfg {String|Function} Шаблон отображения года
 * @remark
 * В шблон будет переданы date - дата месяа и extData.
 * @example
 * <pre>
 * <Controls.calendar:MonthList>
 *           <ws:yearTemplate>
 *              <ws:partial template="Controls/calendar:MonthListYearTemplate">
 *                  <ws:bodyTemplate>
 *                      <ws:for data="month in 12">
 *                          <Controls.calendar:MonthView/>
 *                      </ws:for>
 *                  </ws:bodyTemplate>
 *              </ws:partial>
 *          </ws:yearTemplate>
 * </Controls.calendar:MonthList>
 * </pre>
 */
