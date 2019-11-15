/**
 * Шаблон, который по умолчанию используется для отображения разделителя {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/grid/grouping/ группы} в {@link Controls/grid:View табличном представлении}.
 * @class Controls/grid:GroupTemplate
 * @author Авраменко А.С.
 * @demo Controls-demo/List/Grid/WI/Group
 * @see Controls/grid:View#groupTemplate
 * @example
 * В следующем примере показано, как изменить параметры шаблона.
 * <pre>
 *    <Controls.grid:View>
 *       <ws:groupTemplate>
 *          <ws:partial template="Controls/grid:GroupTemplate" expanderVisible="{{ false }}" />
 *       </ws:groupTemplate>
 *    </Controls.grid:View>
 * </pre>
 * @remark
 * Подробнее о шаблоне:
 * 
 * * {@link Controls/grid:GroupTemplate Параметры шаблона}
 * * {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/grid/templates/grouping/ Руководство разработчика}
 */


/**
 * Интерфейс для {@link Controls/grid:GroupTemplate шаблона разделителя группы} в табличном представлении.
 * @interface Controls/grid:IGroupTemplateOptions
 * @author Авраменко А.С.
 */

/**
 * @name Controls/grid:IGroupTemplateOptions#expanderAlign
 * @cfg {String} Расположение кнопки-экспандера. Доступные значения опции: hidden, right и left.
 * @default left
 */

/**
 * @name Controls/grid:IGroupTemplateOptions#expanderVisible
 * @cfg {Boolean} Видимость кнопки-экспандера.
 * @default true
 */

/**
 * @name Controls/grid:IGroupTemplateOptions#textAlign
 * @cfg {String} Горизонтальное выравнивание текста группы. По умолчанию выравнивается по центру. Доступные значения опции: "left" и "right".
 */

/**
 * @name Controls/grid:IGroupTemplateOptions#rightTemplate
 * @cfg {String|Function} Шаблон, выводимый в правой части группы. Может использоваться, например, для вывода итогов по группе.
 */
/**
 * @name Controls/grid:IGroupTemplateOptions#columnAlignGroup
 * @cfg {Number} Номер колонки, относительно которой происходит горизонтальное выравнивание текста группы.
 * 
 */
export default interface IGroupTemplateOptions {
   expanderAlign?: string;
   expanderVisible?: boolean;
   textAlign?: string;
   rightTemplate?: string;
   columnAlignGroup?: number;
}