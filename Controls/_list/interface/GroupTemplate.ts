/**
 * Шаблон, который по умолчанию используется для группировки элементов в {@link Controls/list:View плоских списках}.
 * @class Controls/list:GroupTemplate
 * @author Авраменко А.С.
 * @see Controls/list:View
 * @see Controls/list
 * @example
 * В следующем примере показано, как изменить параметры шаблона.
 * <pre>
 * <Controls.list:View ... >
 *    <ws:groupTemplate>
 *       <ws:partial template="Controls/list:GroupTemplate"
 *          separatorVisibility="{{ true }}"
 *          expanderVisibility="{{ true }}"
 *          textAlign="left" />
 *    </ws:groupTemplate>
 * </Controls.list:View>
 * </pre>
 * @remark
 * Подробнее о работе с шаблоном читайте {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/list/templates/grouping/ здесь}.
 */

/**
 * @name Controls/list:GroupTemplate#separatorVisibility
 * @cfg {Boolean} Видимость горизонтальной линии-разделителя.
 * @default true
 */

/**
 * @name Controls/list:GroupTemplate#expanderVisibility
 * @cfg {Boolean} Видимость кнопки-экспандера, позволяющей сворачивать/разворачивать группу.
 * @default true
 */

/**
 * @name Controls/list:GroupTemplate#textAlign
 * @cfg {String} Горизонтальное выравнивание текста группы. Доступные значения опции: "left" и "right".
 */

/**
 * @name Controls/list:GroupTemplate#rightTemplate
 * @cfg {String|Function} Шаблон, выводимый в правой части группы. 
 * @remark 
 * Может использоваться, например, для вывода итогов по группе.
 * @default title
 */

export default interface IGroupTemplateOptions {
    separatorVisibility?: boolean;
    expanderVisibility?: boolean;
    textAlign?: string;
    rightTemplate?: string;
 }
 