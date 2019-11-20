/**
 * Шаблон, который по умолчанию используется для отображения разделителя {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/grid/grouping/ группы} в {@link Controls/grid:View табличном представлении}.
 * @class Controls/grid:GroupTemplate
 * @author Авраменко А.С.
 * @see Controls/grid:View#groupTemplate
 * @example
 * В следующем примере показано, как изменить параметры шаблона.
 * <pre>
 *    <Controls.grid:View>
 *       <ws:groupTemplate>
 *          <ws:partial
 *             template="Controls/grid:GroupTemplate"
 *             expanderVisible="{{ false }}"
 *             expanderAlign="right"
 *             textAlign="left"
 *             columnAlignGroup="1">
 *             <ws:rightTemplate>
 *                Примечание отобразится справа от кнопки-экспандера.
 *             </ws:rightTemplate>
 *          </ws:partial>
 *       </ws:groupTemplate>
 *    </Controls.grid:View>
 * </pre>
 * @remark
 * Подробнее о шаблоне:
 * 
 * * {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/grid/templates/grouping/ Руководство разработчика}
 */

/**
 * @name Controls/grid:GroupTemplate#expanderAlign
 * @cfg {String} Расположение кнопки-экспандера. Доступные значения опции: hidden, right и left.
 * @default left
 */

/**
 * @name Controls/grid:GroupTemplate#expanderVisible
 * @cfg {Boolean} Видимость кнопки-экспандера.
 * @default true
 */

/**
 * @name Controls/grid:GroupTemplate#textAlign
 * @cfg {String} Горизонтальное выравнивание текста группы. По умолчанию выравнивается по центру. Доступные значения опции: "left" и "right".
 */

/**
 * @name Controls/grid:GroupTemplate#columnAlignGroup
 * @cfg {Number} Номер колонки, относительно которой происходит горизонтальное выравнивание текста группы.
 * @default 0
 */

/**
 * @name Controls/grid:GroupTemplate#rightTemplate
 * @cfg {String|Function} Шаблон, выводимый в правой части группы. Может использоваться, например, для вывода итогов по группе.
 * @default Controls/list:GroupContentResultsTemplate
 */


export default interface IGroupTemplateOptions {
   expanderAlign?: string;
   expanderVisible?: boolean;
   textAlign?: string;
   columnAlignGroup?: number;
   rightTemplate?: string;
}