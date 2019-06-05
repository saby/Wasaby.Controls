  /**
   * An interface for controls based on Controls/calendar:MonthList and allowing you to draw your data
   * on the cells of the month.
   * @interface Controls/_calendar/interface/IMonthListCustomDays
   * @public
   */

  /**
   * @name Controls/_calendar/interface/IMonthListCustomDays#calendarSource
   * @cfg {Types/source:Base} Object that implements ISource interface for data access.
   * @remark
   * Must support a list method with paging by cursor. Years are used as identifiers. Each item is a year.
   * It must contain the extData field which is an array of 12 elements from the corresponding months.
   * Each element is an array with the objects to be transferred to the day template.
   * @example
   * <pre class="brush:xml">
   *     <option name="source">_source</option>
   * </pre>
   */

  /**
   * @name Controls/_calendar/interface/IMonthListCustomDays#dayTemplate
   * @cfg {Function} Day template.
   * @example
   * <pre class="brush:xml">
   *     <option name="source">_source</option>
   *     <ws:dayTemplate>
   *         <ws:partial template="wml!Controls/Date/MonthView/dayTemplate"
   *                     value="{{dayTemplate.value}}"
   *         >
   *             <ws:contentTemplate>
   *                 <ws:partial template="{{_dayTemplate}}" value="{{dayTemplate.value}}"/>
   *             </ws:contentTemplate>
   *         </ws:partial>
   *     </ws:dayTemplate>
   * </pre>
   */
