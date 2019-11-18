/**
 * Шаблон, который по умолчанию используется для отображения выбранных значений в контроле {@link Controls/lookup:Input}.
 * 
 * @interface Controls/lookup:ItemTemplate
 * @author Капустин И.А.
 * 
 * @remark
 * Шаблон поддерживает следующие параметры:
 * <ul>
 *    <li>contentTemplate {Function|String} — шаблон для отображения выбранной записи.</li>
 *    <li>crossTemplate {Function|String} — шаблон крестика удаления элемента.</li>
 *    <li>displayProperty {String} —  название поля, значение которого отображается при выборе элемента.</li>
 *    <li>clickable {Boolean} — позволяет установить кликабельность выбранного значения (допустим только в случае использования contentTemplate по умолчанию).</li>
 *    <li>size {Enum} — размер записей (допустим только в случае использования contentTemplate по умолчанию):</li>
 *    <ul>
 *       <li>m</li>
 *       <li>l</li>
 *       <li>xl</li>
 *       <li>2xl</li>
 *       <li>3xl</li>
 *    </ul>
 *    <li>style {Enum} — стиль записей (допустим только в случае использования contentTemplate по умолчанию).</li>
 *    <ul>
 *       <li>default</li>
 *       <li>bold</li>
 *       <li>accent</li>
 *       <li>primary</li>
 *    </ul>
 * </ul>
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