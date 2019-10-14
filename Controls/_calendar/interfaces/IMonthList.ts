import {TemplateFunction} from 'UI/Base';

export interface IMonthListOptions {
   viewMode: string;
   position?: Date;
   yearTemplate?: TemplateFunction;
   monthTemplate?: TemplateFunction;
}

/**
 * Интерфейс для контролов основанных на Controls/calendar:MonthList.
 * @interface Controls/_calendar/interfaces/IMonthList
 * @public
 */
export interface IMonthList {
   readonly '[Controls/_calendar/interfaces/IMonthList]': boolean;
}

/**
 * @name Controls/_calendar/interfaces/IMonthList#viewMode
 * @cfg {String} Режим отображения элементов. По годам или по месяцам.
 * @variant year Один отображаемый элемент - год.
 * @variant month Один отображаемый элемент - месяц.
 * @example
 * <pre>
 * <Controls.calendar:MonthList
 *     bind:month="_month"
 *     viewMode="month"/>
 * </pre>
 * @see Controls/_calendar/interfaces/IMonthList#yearTemplate
 * @see Controls/_calendar/interfaces/IMonthList#monthTemplate
 */

/**
 * @name Controls/_calendar/interfaces/IMonthList#position
 * @cfg {Date} Год или месяц который отображается первым в верху скролируемой области.
 * При изменении значения лента скролится к новому году\месяцу.
 *
 * @example
 * <pre>
 * <Controls.calendar:MonthList bind:startPosition="_month"/>
 * </pre>
 */

/**
 * @name Controls/_calendar/interfaces/IMonthList#yearTemplate
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
 * <pre>
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
 * </pre>
 * @see Controls/_calendar/interfaces/IMonthList#monthTemplate
 * @see Controls/_calendar/interfaces/IMonthList#viewMode
 */

/**
 * @name Controls/_calendar/interfaces/IMonthList#monthTemplate
 * @cfg {Function} Шаблон месяца.
 *
 * @remark
 * В качестве опций получает date(дата начала месяца) и extData(данные загруженные через источник данных).
 * extData представляет из себя массив из объектов, содержащих данные дня, загруженные через источник данных.
 *
 * @default Controls/calendar:MonthListMonthTemplate
 *
 * @example
 * <pre>
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
 * </pre>
 * @see Controls/_calendar/interfaces/IMonthList#yearTemplate
 * @see Controls/_calendar/interfaces/IMonthList#viewMode
 */
