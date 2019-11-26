/**
 * Шаблон, который по умолчанию используется для отображения разделителя группы в {@link Controls/list:View плоских списках}.
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
 *          separatorVisibility="{{ false }}"
 *          expanderVisible="{{ false }}"
 *          textAlign="left">
 *          <ws:contentTemplate>
 *             <ws:if data="{{itemData.item === 'nonexclusive'}}">Неисключительные права</ws:if>
 *             <ws:if data="{{itemData.item === 'works'}}">Работы</ws:if>
 *          </ws:contentTemplate>
 *       </ws:partial>
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
 * @remark
 * Доступные значение:
 * 
 * * **true** — отображается.
 * * **false** — скрыта.
 */

/**
 * @name Controls/list:GroupTemplate#expanderVisibile
 * @cfg {Boolean} Видимость кнопки-экспандера, позволяющей сворачивать/разворачивать группу.
 * @remark
 * Доступные значения:
 * 
 * * **true** — отображается.
 * * **false** — скрыта.
 * 
 * @default true
 */

/**
 * @name Controls/list:GroupTemplate#textAlign
 * @cfg {String} Горизонтальное выравнивание заголовка группы. 
 * @default undefined 
 * @remark
 * Когда значение опции не задано, заголовок выравнивается по центру.
 * Доступные значения:
 * 
 * * **right** — по правому краю.
 * * **left** — по левому краю.
 */

/**
 * @name Controls/list:GroupTemplate#rightTemplate
 * @cfg {String|Function} Шаблон, выводимый в правой части горизонтальной линии-разделителя.  
 * @default Controls/list:GroupContentResultsTemplate
 * @remark 
 * Собственные переменные отсутствуют в области этого шаблона. Может использоваться, например, для вывода итогов по группе.
 * @example
 * <pre>
 *    <Controls.list:View>
 *       <ws:groupTemplate>
 *          <ws:partial template="Controls/list:GroupTemplate">
 *             <ws:rightTemplate>
 *                <ws:partial template="Controls/list:GroupContentResultsTemplate">
 *                   <ws:contentTemplate>
 *                      {{ itemData.item.title }}
 *                   </ws:contentTemplate>
 *                </ws:partial>
 *             </ws:rightTemplate>
 *          </ws:partial>
 *       </ws:groupTemplate>
 *    </Controls.list:View>
 * </pre>
 */

/**
 * @name Controls/list:GroupTemplate#contentTemplate
 * @cfg {String|Function} Шаблон, описывающий заголовок группы.
 * @default true
 * @remark
 * В области видимости шаблона доступна переменная **itemData**, в которой есть свойство **item** — результат того, что возвращено из функции {@link Controls/grid:View#groupingKeyCallback groupingKeyCallback}.
 * @example
 * <pre>
 *    <Controls.list:View>
 *       <ws:groupTemplate>
 *          <ws:partial template="Controls/list:GroupTemplate" expanderVisible="{{ false }}" textAlign="left">
 *             <ws:contentTemplate>
 *                <ws:if data="{{itemData.item === 'nonexclusive'}}">Неисключительные права</ws:if>
 *                <ws:if data="{{itemData.item === 'works'}}">Работы</ws:if>
 *             </ws:contentTemplate>
 *          </ws:partial>
 *       </ws:groupTemplate>
 *    </Controls.list:View>
 * </pre>
 */

export default interface IGroupTemplateOptions {
    separatorVisibility?: boolean;
    expanderVisible?: boolean;
    textAlign?: string;
    rightTemplate?: string;
    contentTemplate?: string;
 }
 