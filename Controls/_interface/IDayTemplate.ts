import {TemplateFunction} from 'UI/Base';

export interface IDayTemplateOptions {
    dayTemplate?: TemplateFunction;
}

/**
 * Интерфейс для контролов календарей, позволяющих задать шаблон дня
 *
 * @interface Controls/_interface/IDayTemplate
 * @public
 */

export default interface IDayTemplate {
    readonly '[Controls/_interface/IDayTemplate]': boolean;
}

/**
 * @name Controls/_interface/IDayTemplate#dayTemplate
 * @cfg {String|Function} Шаблон дня.
 * @remark
 * В шаблон передается объект value, в котором хранятся:
 * <ul>
 *     <li>date - дата дня</li>
 *     <li>day - порядковый номер дня</li>
 *     <li>today - определяет, является ли день сегодняшним </li>
 *     <li>weekend - определяет, является ли день выходным </li>
 *     <li>extData - данные, загруженные через источник данных</li>
 * </ul>
 * @demo Controls-demo/dateRange/DayTemplate/Index
 */
