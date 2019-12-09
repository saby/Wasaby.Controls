/**
 * Шаблон, который по умолчанию используется для отображения элементов в {@link Controls/list:View плоском списке}.
 * @class Controls/list:ItemTemplate
 * @mixes Controls/list:BaseItemTemplate
 * @author Авраменко А.С.
 * @see Controls/list:View#itemTemplate
 * @see Controls/list:View#itemTemplateProperty
 * @example
 * В следующем примере показано, как изменить параметры шаблона.
 * <pre class="brush: html">
 * <Controls.list:View>
 *    <ws:itemTemplate>
 *       <ws:partial template="Controls/list:ItemTemplate" marker="{{true}}"> 
 *          <ws:contentTemplate>
 *             {{contentTemplate.itemData.item.title}}
 *          </ws:contentTemplate>
 *       </ws:partial>
 *    </ws:itemTemplate>
 * </Controls.list:View>
 * </pre>
 * @remark
 * Подробнее о работе с шаблоном читайте {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/list/templates/item/ здесь}.
 */

/**
 * @name Controls/list:ItemTemplate#displayProperty
 * @cfg {String} Устанавливает имя поля элемента, данные которого будут отображены в шаблоне.
 * @remark
 * Опцию не используют, если задан пользовательский шаблон в опции {@link Controls/list:BaseItemTemplate#contentTemplate}.
 * @default title
 */