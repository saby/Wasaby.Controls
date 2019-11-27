/**
 * Шаблон, который по умолчанию используется для отображения строки итогов в {@link Controls/grid:View табличном представлении}.
 * @class Controls/grid:ResultsTemplate
 * @author Авраменко А.С.
 * @see Controls/grid:View#resultsTemplate
 * @see Controls/grid:View#resultsPosition
 * @remark
 * Дополнительно работе с шаблоном читайте {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/grid/templates/result/ здесь}.
 * @example
 * <pre>
 * <Controls.grid:View>
 *    <ws:resultsTemplate>
 *       <ws:partial template="Controls/grid:ResultsTemplate">
 *          <ws:contentTemplate>
 *             <div style="color: #313E78;">
 *                Итого: 2 страны с населением более миллиарда человек.
 *             </div>
 *          </ws:contentTemplate>
 *       </ws:partial>
 *    </ws:resultsTemplate>
 * </Controls.grid:View>
 * </pre>
 */

/**
 * @name Controls/grid:ResultsTemplate#contentTemplate
 * @cfg {String|Function} Устанавливает пользовательский шаблон, описывающий содержимое строки итогов. 
 * @default undefined
 */

export default interface IResultsTemplateOptions {
   contentTemplate?: string;
}