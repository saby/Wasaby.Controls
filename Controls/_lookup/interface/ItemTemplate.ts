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
 *          <ws:partial template="Controls.lookup:ItemTemplate"
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
 * @cfg {String} Шаблон для отображения выбранной записи.
 * @example
 * <pre>
 * <Controls.lookup:Selector
 *    contentTemplate="Controls/Template:MyContentTemplate">
 * </Controls.lookup:Selector>
 * </pre>
 */

/**
 * @name Controls/lookup:ItemTemplate#crossTemplate
 * @cfg {String} Шаблон крестика удаления элемента.
 * @example
 * <pre>
 * <Controls.lookup:Selector
 *    crossTemplate="Controls/Template:MyCrossTemplate">
 * </Controls.lookup:Selector>
 * </pre>
 */
 
/**
 * @name Controls/lookup:ItemTemplate#displayProperty
 * @cfg {String} Название поля, значение которого отображается при выборе элемента.
 * @example
 * <pre>
 *    <Controls.lookup:Selector>
 *       <ws:itemTemplate>
 *          <ws:partial template="Controls.lookup:ItemTemplate"
 *                      displayProperty="title"
 *                      ... />
 *       </ws:itemTemplate>
 *    </Controls.lookup:Selector>
 * </pre>
 */

/**
 * @name Controls/lookup:ItemTemplate#clickable
 * @cfg {Boolean} Позволяет установить кликабельность выбранного значения (допустим только в случае использования contentTemplate по умолчанию).
 * @example
 * <pre>
 *    <Controls.lookup:Selector>
 *       <ws:itemTemplate>
 *          <ws:partial template="Controls.lookup:ItemTemplate"
 *                      clickable="{{true}}"
 *                      ... />
 *       </ws:itemTemplate>
 *    </Controls.lookup:Selector>
 * </pre>
 */

/**
 * @name Controls/lookup:ItemTemplate#size
 * @cfg {String} Размер записей (допустим только в случае использования contentTemplate по умолчанию).
 * @remark 
 * Доступные значения: m, l, xl, 2xl, 3xl.
 * @example
 * <pre>
 *    <Controls.lookup:Selector>
 *       <ws:itemTemplate>
 *          <ws:partial template="Controls.lookup:ItemTemplate"
 *                      size="xl"
 *                      ... />
 *       </ws:itemTemplate>
 *    </Controls.lookup:Selector>
 * </pre>
 */

/**
 * @name Controls/lookup:ItemTemplate#style
 * @cfg {String} Стиль записей (допустим только в случае использования contentTemplate по умолчанию).
 * @remark 
 * Доступные значения: default, bold, accent, primary.
 * @example
 * <pre>
 *    <Controls.lookup:Selector>
 *       <ws:itemTemplate>
 *          <ws:partial template="Controls.lookup:ItemTemplate"
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

 