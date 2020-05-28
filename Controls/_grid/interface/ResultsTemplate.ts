/**
 * Шаблон, который по умолчанию используется для отображения строки итогов в контроле {@link Controls/grid:View Таблица}.
 * 
 * @remark
 * Полезные ссылки:
 * * <a href="https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/aliases/_grid.less">переменные тем оформления grid</a>
 * * <a href="https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/aliases/_list.less">переменные тем оформления list</a> 
 * 
 * @class Controls/grid:ResultsTemplate
 * @author Авраменко А.С.
 * @see Controls/grid:View#resultsTemplate
 * @see Controls/grid:View#resultsPosition
 * @remark
 * Дополнительно о работе с шаблоном читайте {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/grid/templates/result/ здесь}.
 * @example
 * <pre class="brush: html">
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
 * @public
 */

export default interface IResultsTemplateOptions {
   /**
    * @name Controls/grid:ResultsTemplate#contentTemplate
    * @cfg {String|Function} Пользовательский шаблон, описывающий содержимое строки итогов. 
    * @default undefined
    */
   contentTemplate?: string;
}