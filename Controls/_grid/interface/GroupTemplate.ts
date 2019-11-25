/**
 * Шаблон, который по умолчанию используется для отображения горизонтальной линии-разделителя {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/grid/grouping/ группы} в {@link Controls/grid:View табличном представлении}.
 * @class Controls/grid:GroupTemplate
 * @author Авраменко А.С.
 * @see Controls/grid:View#groupTemplate
 * @example
 * В следующем примере показано, как изменить параметры шаблона.
 * <pre>
 *    <Controls.grid:View>
 *       <ws:groupTemplate>
 *          <ws:partial template="Controls/grid:GroupTemplate" expanderVisible="{{ false }}" textAlign="left">
 *             <ws:contentTemplate>
 *                <ws:if data="{{itemData.item === 'nonexclusive'}}">Неисключительные права</ws:if>
 *                <ws:if data="{{itemData.item === 'works'}}">Работы</ws:if>
 *             </ws:contentTemplate>
 *             <ws:rightTemplate>
 *                <ws:partial template="Controls/list:GroupContentResultsTemplate">
 *                   <ws:contentTemplate>
 *                      {{ itemData.item.title }}
 *                   </ws:contentTemplate>
 *                </ws:partial>
 *             </ws:rightTemplate>
 *          </ws:partial>
 *       </ws:groupTemplate>
 *    </Controls.grid:View>
 * </pre>
 * @remark
 * Дополнительно о работе с шаблоном читайте {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/grid/templates/grouping/ здесь}.
 */

/**
 * @name Controls/grid:GroupTemplate#expanderAlign
 * @cfg {String} Расположение кнопки-экспандера.
 * @default left
 * @remark
 * Кнопка-экспандер, которая позволяет сворачивать/разворачивать группу.
 * Доступные значения:
 * 
 * * **right** — справа от заголовка.
 * * **left** — слева от заголовка.
 */

/**
 * @name Controls/grid:GroupTemplate#expanderVisible
 * @cfg {Boolean} Видимость кнопки-экспандера.
 * @default true
 * @remark
 * Кнопка-экспандер, которая позволяет сворачивать/разворачивать группу.
 * Доступные значения:
 * 
 * * **true** — отображается.
 * * **false** — не отображается.
 */

/**
 * @name Controls/grid:GroupTemplate#textAlign
 * @cfg {String} Горизонтальное выравнивание заголовка группы.
 * @default undefined
 * @remark
 * Когда опций не задана, заголовок выравнивается по центру.
 * Доступные значения:
 * 
 * * **right** — по правому краю.
 * * **left** — по левому краю.
 */

/**
 * @name Controls/grid:GroupTemplate#columnAlignGroup
 * @cfg {Number} Номер колонки, относительно которой происходит горизонтальное выравнивание текста группы.
 * @default undefined
 */

/**
 * @name Controls/grid:GroupTemplate#rightTemplate
 * @cfg {String|Function} Шаблон, выводимый в правой части горизонтальной линии-разделителя (см. separatorVisibility).
 * @default Controls/list:GroupContentResultsTemplate
 * @remark
 * Собственные переменные отсутствуют в области этого шаблона.
 * @example
 * <pre>
 *    <Controls.grid:View>
 *       <ws:groupTemplate>
 *          <ws:partial template="Controls/grid:GroupTemplate" expanderVisible="{{ false }}" textAlign="left">
 *             <ws:rightTemplate>
 *                <ws:partial template="Controls/list:GroupContentResultsTemplate">
 *                   <ws:contentTemplate>
 *                      {{ itemData.item.title }}
 *                   </ws:contentTemplate>
 *                </ws:partial>
 *             </ws:rightTemplate>
 *          </ws:partial>
 *       </ws:groupTemplate>
 *    </Controls.grid:View>
 * </pre>
 */

/**
 * @name Controls/grid:GroupTemplate#separatorVisibility
 * @cfg {Boolean} Видимость горизонтальной линии-разделителя.
 * @default true
 * @remark
 * Доступные значение:
 * 
 * * **true** — отображается.
 * * **false** — скрыта.
 */

/**
 * @name Controls/grid:GroupTemplate#contentTemplate
 * @cfg {String|Function} Шаблон, описывающий заголовок группы.
 * @default true
 * @remark
 * В области видимости шаблона доступна переменная **itemData**, в которой есть свойство **item** — результат того, что возвращено из функции {@link Controls/grid:View#groupingKeyCallback groupingKeyCallback}.
 * @example
 * <pre>
 *    <Controls.grid:View>
 *       <ws:groupTemplate>
 *          <ws:partial template="Controls/grid:GroupTemplate" expanderVisible="{{ false }}" textAlign="left">
 *             <ws:contentTemplate>
 *                <ws:if data="{{itemData.item === 'nonexclusive'}}">Неисключительные права</ws:if>
 *                <ws:if data="{{itemData.item === 'works'}}">Работы</ws:if>
 *             </ws:contentTemplate>
 *          </ws:partial>
 *       </ws:groupTemplate>
 *    </Controls.grid:View>
 * </pre>
 */


export default interface IGroupTemplateOptions {
   expanderAlign?: string;
   expanderVisible?: boolean;
   textAlign?: string;
   columnAlignGroup?: number;
   rightTemplate?: string;
}