/**
 * Шаблон, который по умолчанию используется для отображения разделителя группы в {@link Controls/list:View плоских списках}.
 * @class Controls/list:GroupTemplate
 * @mixes Controls/list:BaseGroupTemplate
 * @author Авраменко А.С.
 * @see Controls/interface/IGroupedGrid#groupTemplate
 * @example
 * В следующем примере показано, как изменить параметры шаблона.
 * <pre class="brush: html">
 * <Controls.list:View>
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
 * Дополнительно о работе с шаблоном читайте {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/list/templates/grouping/ здесь}.
 */
 