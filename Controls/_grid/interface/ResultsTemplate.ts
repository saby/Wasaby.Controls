/**
 * Шаблон, который по умолчанию используется для отображения строки итогов в {@link Controls/grid:View Табличном представлении}.
 * @class Controls/grid:ResultsTemplate
 * @author Авраменко А.С.
 * @see Controls/grid:View#resultsTemplate
 * @see Controls/grid:View#resultsPosition
 * @remark
 * Дополнительно о шаблоне:
 * 
 * * {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/grid/templates/result/ Руководство разработчика}
 */

/**
 * @name Controls/grid:ResultsTemplate#contentTemplate
 * @cfg {String|Function} Вёрстка, описывающая содержимое шаблона. 
 */

export default interface IResultsTemplateOptions {
   contentTemplate?: string;
}