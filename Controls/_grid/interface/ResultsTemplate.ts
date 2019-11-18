/**
 * Шаблон, который по умолчанию используется для отображения строки итогов в {@link Controls/grid:View Табличном представлении}.
 * @class Controls/grid:ResultsTemplate
 * @author Авраменко А.С.
 * @see Controls/grid:View#resultsTemplate
 * @see Controls/grid:View#resultsPosition
 * @remark
 * Дополнительно о шаблоне:
 * 
 * * {@link Controls/grid:IResultsTemplateOptions Параметры шаблона}
 * * {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/grid/templates/result/ Руководство разработчика}
 */

/**
 * Интерфейс для {@link Controls/grid:ResultsTemplate шаблона строки итогов} в табличном представлении.
 * @interface Controls/grid:IResultsTemplateOptions
 * @author Авраменко А.С.
 */

/**
 * @name Controls/grid:IResultsTemplateOptions#contentTemplate
 * @cfg {String|Function} Вёрстка, описывающая содержимое шаблона. 
 */

export default interface IResultsTemplateOptions {
   contentTemplate?: string;
}