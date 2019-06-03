  /*Eng
   * An interface for controls based on Controls/calendar:MonthList and allowing you to draw your data
   * on the cells of the month.
   * @interface Controls/_calendar/interface/IMonthListSource
   * @public
   */

  /**
   * Интерфейс для контролов основанных на Controls/calendar:MonthList и позволяющих настраивать отображение годов,
   * месяцев и дней.
   * @interface Controls/_calendar/interface/IMonthListSource
   * @public
   */

  /**
   * @name Controls/_calendar/interface/IMonthListSource#viewMode
   * @cfg {String} Режим отображения элементов. По годам или по месяцам.
   * @variant year Один отображаемый элемент - год.
   * @variant month Один отображаемый элемент - месяц.
   * @example
   * <pre class="brush:xml">
   * <Controls.calendar:MonthList
   *     bind:month="_month"
   *     viewMode="month"/>
   * </pre>
   * @see Controls/_calendar/interface/IMonthListSource#yearTemplate
   * @see Controls/_calendar/interface/IMonthListSource#monthTemplate
   * @see Controls/_calendar/interface/IMonthListSource#source
   */

  /**
   * @name Controls/_calendar/interface/IMonthListSource#startPosition
   * @cfg {Date} Год или месяц который отображается первым в верху скролируемой области.
   *
   * @example
   * <pre class="brush:xml">
   * <Controls.calendar:MonthList bind:startPosition="_month"/>
   *
   */

  /**
   * @name Controls/_calendar/interface/IMonthListSource#source
   * @cfg {Types/source:ICrud} Источник данных которые используются для отображения дней.
   * @remark
   * Должен поддерживать списочный метод с навигацией по курсору. В качестве идентификатора используется
   * дата начала месяца. Каждый элемент это месяц. Ответ должен содержать список объектов в котором есть поле extData.
   * extData это массив объектов собержищих данные дня. Эти объекты будут переданы в шаблон дня.
   * @example
   * <pre class="brush:xml">
   *
   *  <Controls.calendar:MonthList
   *      startPosition="_month"
   *      source="{{_source}}">
   *     <ws:yearTemplate>
   *         <ws:partial template="Controls/calendar:MonthListYearTemplate">
   *            <ws:dayTemplate>
   *               <ws:partial template="Controls/calendar:MonthViewDayTemplate">
   *                  <ws:contentTemplate>
   *                     <div class="{{value.extData.isEven ? 'someClass'}}">
   *                        {{value.day}}
   *                     </div>
   *                  </ws:contentTemplate>
   *               </ws:partial>
   *            </ws:dayTemplate>
   *         </ws:partial>
   *      </ws:yearTemplate>
   * </Controls.calendar:MonthList>
   * @see Controls/_calendar/interface/IMonthListSource#yearTemplate
   * @see Controls/_calendar/interface/IMonthListSource#monthTemplate
   * @see Controls/_calendar/interface/IMonthListSource#viewMode
   */

  /*Eng
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
   * @name Controls/_calendar/interface/IMonthListSource#yearTemplate
   * @cfg {Function} Шаблон года.
   *
   * @remark
   * Отображается только в режиме года(viewMode: 'year'). В качестве опций получает date(дата начала года) и
   * extData(данные загруженные через источник данных). extData представляет из себя массив, содержащий месяцы.
   * Каждый месяц это массив содержащий данные дня загруженные через источник данных.
   *
   * @default Controls/calendar:MonthListYearTemplate
   *
   * @example
   * <pre class="brush:xml">
   * <Controls.calendar:MonthList>
   *     <ws:yearTemplate>
   *         <ws:partial template="Controls/calendar:MonthListYearTemplate">
   *            <ws:dayTemplate>
   *               <ws:partial template="Controls/calendar:MonthViewDayTemplate">
   *                  <ws:contentTemplate>
   *                     <div class="{{value.extData.isEven ? 'someClass'}}">
   *                        {{value.day}}
   *                     </div>
   *                  </ws:contentTemplate>
   *               </ws:partial>
   *            </ws:dayTemplate>
   *         </ws:partial>
   *      </ws:yearTemplate>
   * </Controls.calendar:MonthList>
   * @see Controls/_calendar/interface/IMonthListSource#monthTemplate
   * @see Controls/_calendar/interface/IMonthListSource#viewMode
   * @see Controls/_calendar/interface/IMonthListSource#source
   */

  /**
   * @name Controls/_calendar/interface/IMonthListSource#monthTemplate
   * @cfg {Function} Шаблон месяца.
   *
   * @remark
   * В качестве опций получает date(дата начала месяца) и extData(данные загруженные через источник данных).
   * extData представляет из себя массив из объектов, содержащих данные дня, загруженные через источник данных.
   *
   * @default Controls/calendar:MonthListMonthTemplate
   *
   * @example
   * <pre class="brush:xml">
   * <Controls.calendar:MonthList>
   *     <ws:monthTemplate>
   *         <ws:partial template="Controls/calendar:MonthListMonthTemplate">
   *            <ws:dayTemplate>
   *               <ws:partial template="Controls/calendar:MonthViewDayTemplate">
   *                  <ws:contentTemplate>
   *                     <div class="{{value.extData.isEven ? 'someClass'}}">
   *                        {{value.day}}
   *                     </div>
   *                  </ws:contentTemplate>
   *               </ws:partial>
   *            </ws:dayTemplate>
   *         </ws:partial>
   *      </ws:monthTemplate>
   * </Controls.calendar:MonthList>
   * @see Controls/_calendar/interface/IMonthListSource#yearTemplate
   * @see Controls/_calendar/interface/IMonthListSource#viewMode
   * @see Controls/_calendar/interface/IMonthListSource#source
   */

  /*Eng
   * @name Controls/_calendar/interface/IMonthListSource#dayTemplate
   * @cfg {Function} Day template.
   * @example
   * <pre class="brush:xml">
   * <Controls.calendar:MonthList
   *     bind:month="_month"
   *     source="{{_source}}">
   *     <ws:dayTemplate>
   *         <ws:partial template="Controls/calendar:MonthViewDayTemplate">
   *             <ws:contentTemplate>
   *                 <ws:partial template="{{_dayTemplate}}"/>
   *             </ws:contentTemplate>
   *         </ws:partial>
   *     </ws:dayTemplate>
   * </Controls.calendar:MonthList>
   * @see Controls/_calendar/interface/IMonthListSource#source
   * @see Controls/_calendar/interface/IMonthListSource#itemMode
   */
