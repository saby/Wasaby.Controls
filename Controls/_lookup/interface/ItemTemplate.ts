/**
 * Шаблон, который по умолчанию используется для отображения выбранных значений в контроле {@link Controls/lookup:Input}.
 * 
 * @class Controls/lookup:ItemTemplate
 * @author Капустин И.А.
 * @see Controls/lookup
 * @see Controls/lookup:Input
 * @remark
 *
 * Если вы переопределите contentTemplate/crossTemplate, вы не будете уведомлены о событиях itemClick/crossClick.
 * Для правильной работы необходимо пометить свой контент классами:
 * <ul>
 *    <li>js-controls-SelectedCollection__item__caption</li>
 *    <li>js-controls-SelectedCollection__item__cross</li>
 * </ul>
 *
 * @example
 * WML:
 * <pre>
 *    <Controls.lookup:Selector
 *          source="{{_source}}"
 *          keyProperty="id">
 *       <ws:itemTemplate>
 *          <ws:partial template="Controls/lookup:ItemTemplate"
 *                      style="primary"
 *                      size="xl"
 *                      displayProperty="title"
 *                      clickable="{{true}}"/>
 *       </ws:itemTemplate>
 *    </Controls.lookup:Selector>
 * </pre>
 */

/**
 * @name Controls/lookup:ItemTemplate#contentTemplate
 * @cfg {String|Function} Шаблон для отображения выбранной записи.
 * @remark
 * В области видимости шаблона доступна переменная **itemData**, в которой есть свойство **item** — выбранный элемент.
 * @example
 * <pre>
 * <Controls.lookup:Input>
 *    <ws:itemTemplate>
 *       <ws:partial template="Controls/lookup:ItemTemplate">
 *          <ws:contentTemplate> 
 *             <span>{{itemTemplate.item.categoryNumber}}</span>
 *             <span>{{itemTemplate.item.category}}</span>
 *          </ws:contentTemplate>
 *       </ws:partial>
 *    </ws:itemTemplate>
 * </Controls.lookup:Input>
 * </pre>
 */

/**
 * @name Controls/lookup:ItemTemplate#crossTemplate
 * @cfg {String|Function} Шаблон крестика удаления элемента.
 * @remark
 * Использование опции неактуально, когда контрол работает в режиме чтения (опция {@link https://wi.sbis.ru/docs/js/Controls/heading/Title/options/readOnly/?v=20.1000 readOnly} в значении true).
 * @example
 * <pre>
 * <Controls.lookup:Selector>
 *    <ws:itemTemplate>
 *       <ws:partial template="Controls/lookup:ItemTemplate">
 *          <ws:crossTemplate>
 *             Это мой шаблон крестика.
 *          </ws:crossTemplate>
 *       </ws:partial>
 *    </ws:itemTemplate>
 * </Controls.lookup:Selector>
 * </pre>
 */
 
/**
 * @name Controls/lookup:ItemTemplate#displayProperty
 * @cfg {String} Название поля, значение которого отображается при выборе элемента.
 * @default undefined
 * @example
 * <pre>
 *    <Controls.lookup:Selector>
 *       <ws:itemTemplate>
 *          <ws:partial template="Controls/lookup:ItemTemplate"
 *                      displayProperty="title"
 *                      ... />
 *       </ws:itemTemplate>
 *    </Controls.lookup:Selector>
 * </pre>
 */

/**
 * @name Controls/lookup:ItemTemplate#clickable
 * @cfg {Boolean} Позволяет установить кликабельность выбранного значения.
 * @remark 
 * Допускается задавать параметр только в случае, когда contentTemplate используется по умолчанию.
 * Также, по умолчанию выставляется в true, когда опции {@link Controls/lookup:Input#multiselect multiselect} и {@link UI/Base:Control#readOnly readOnly} выставлены в true и false соответственно.
 * @default true
 * @example
 * <pre>
 *    <Controls.lookup:Selector>
 *       <ws:itemTemplate>
 *          <ws:partial template="Controls/lookup:ItemTemplate"
 *                      clickable="{{false}}"
 *                      ... />
 *       </ws:itemTemplate>
 *    </Controls.lookup:Selector>
 * </pre>
 */

/**
 * @name Controls/lookup:ItemTemplate#size
 * @cfg {String} Размер записей.
 * @remark 
 * Допускается задавать параметр только в случае, когда contentTemplate используется по умолчанию.
 * Доступные значения: m, l, xl, 2xl, 3xl. В зависимости от {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/themes/ темы оформления} значениям задаются собственные величины px.
 * @default default
 * @example
 * <pre>
 *    <Controls.lookup:Selector>
 *       <ws:itemTemplate>
 *          <ws:partial template="Controls/lookup:ItemTemplate"
 *                      size="xl"
 *                      ... />
 *       </ws:itemTemplate>
 *    </Controls.lookup:Selector>
 * </pre>
 */

/**
 * @name Controls/lookup:ItemTemplate#style
 * @cfg {String} Стиль записей.
 * @remark 
 * Допустим только в случае использования contentTemplate по умолчанию.
 * Доступные значения: default, bold, accent, primary.
 * @default default
 * @example
 * <pre>
 *    <Controls.lookup:Selector>
 *       <ws:itemTemplate>
 *          <ws:partial template="Controls/lookup:ItemTemplate"
 *                      style="primary"
 *                      ... />
 *       </ws:itemTemplate>
 *    </Controls.lookup:Selector>
 * </pre>
 */

export default interface IItemTemplateOptions {
    crossTemplate?: string;
    displayProperty?: string;
    clickable?: boolean;
    size?: string;
    style?: string;
    contentTemplate?: string;
 }

 