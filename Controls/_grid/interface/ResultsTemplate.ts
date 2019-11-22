/**
 * Шаблон, который по умолчанию используется для отображения строки итогов в {@link Controls/grid:View табличном представлении}.
 * @class Controls/grid:ResultsTemplate
 * @author Авраменко А.С.
 * @see Controls/grid:View#resultsTemplate
 * @see Controls/grid:View#resultsPosition
 * @remark
 * Дополнительно работе с шаблоном читайте {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/grid/templates/result/ здесь}.
 */

/**
 * @name Controls/grid:ResultsTemplate#contentTemplate
 * @cfg {String|Function} Шаблон, описывающий содержимое строки итогов. 
 */

export default interface IResultsTemplateOptions {
   contentTemplate?: string;
}