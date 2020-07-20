/**
 * Шаблон, который по умолчанию используется для отображения элементов в дополнительном меню {@link Controls/toolbars:View тулбара}.
 * @class Controls/toolbars:ItemTemplate
 * @author Красильников А.С.
 * @public
 * @see Controls/toolbars:View
 * @see Controls/toolbars
 * @example
 * В следующем примере показано, как изменить параметры шаблона.
 * <pre class="brush: html">
 * <Controls.toolbars:View source="{{_source}}">
 *    <ws:itemTemplate>
 *       <ws:partial
 *          template="Controls/toolbars:ItemTemplate"
 *          buttonStyle="{{myStyle}}"
 *          buttonReadOnly="{{readOnlyButton}}"
 *          buttonTransparent="{{myButtonTransparent}}"
 *          buttonViewMode="{{myButtonViewMode}}"
 *          displayProperty="title"
 *          iconStyleProperty="iconStyle"
 *          iconProperty="icon"
 *       />
 *    </ws:itemTemplate>
 * </Controls.toolbars:View>
 * </pre>
 * 
 * @remark
 * Полезные ссылки:
 * * <a href="/doc/platform/developmentapl/interface-development/controls/buttons-switches/toolbar/#template-standart">руководство разработчика</a>
 */

export default interface IItemTemplateOptions {

    /**
     * @name Controls/toolbars:ItemTemplate#buttonStyle
     * @cfg {String} Стиль отображения кнопки.
     * @default secondary
     * @variant primary
     * @variant secondary
     * @example
     * <pre class="brush: html; highlight: [5]">
     * <Controls.toolbars:View source="{{_source}}">
     *    <ws:itemTemplate>
     *       <ws:partial
     *          template="Controls/toolbars:ItemTemplate"
     *          buttonStyle="primary"/>
     *    </ws:itemTemplate>
     * </Controls.toolbars:View>
     * </pre>
     */
    buttonStyle?: string;

    /**
     * @name Controls/toolbars:ItemTemplate#buttonReadOnly
     * @cfg {Boolean} Задаёт режим "только для чтения".
     * @default false
     * 
     * @example
     * <pre class="brush: html; highlight: [5]">
     * <Controls.toolbars:View source="{{_source}}">
     *    <ws:itemTemplate>
     *       <ws:partial
     *          template="Controls/toolbars:ItemTemplate"
     *          buttonReadOnly="true"/>
     *    </ws:itemTemplate>
     * </Controls.toolbars:View>
     * </pre>
     */
    buttonReadOnly?: boolean;

    /**
     * @name Controls/toolbars:ItemTemplate#buttonTransparent
     * @cfg {Boolean} Определяет, имеет ли кнопка фон.
     * @default false
     * 
     * @example
     * <pre class="brush: html; highlight: [5]">
     * <Controls.toolbars:View source="{{_source}}">
     *    <ws:itemTemplate>
     *       <ws:partial
     *          template="Controls/toolbars:ItemTemplate"
     *          buttonTransparent="true"/>
     *    </ws:itemTemplate>
     * </Controls.toolbars:View>
     * </pre>
     */ 
    buttonTransparent?: boolean;

    /**
     * @name Controls/toolbars:ItemTemplate#buttonViewMode
     * @cfg {String} Режим отображения кнопки.
     * @default button
     * @variant button Отображается в виде обычной кнопки по-умолчанию.
     * @variant link Отображается в виде гиперссылки.
     * @variant toolButton Отображается в виде кнопки для панели инструментов.
     * 
     * @example
     * <pre class="brush: html; highlight: [5]">
     * <Controls.toolbars:View source="{{_source}}">
     *    <ws:itemTemplate>
     *       <ws:partial
     *          template="Controls/toolbars:ItemTemplate"
     *          buttonViewMode="link"/>
     *    </ws:itemTemplate>
     * </Controls.toolbars:View>
     * </pre>
     */
    buttonViewMode?: string;

    /**
     * @name Controls/toolbars:ItemTemplate#displayProperty
     * @cfg {String} Имя свойства элемента, содержимое которого будет отображаться.
     * @default title
     * 
     * @example
     * <pre class="brush: html; highlight: [5]">
     * <Controls.toolbars:View source="{{_source}}">
     *    <ws:itemTemplate>
     *       <ws:partial
     *          template="Controls/toolbars:ItemTemplate"
     *          displayProperty="title"/>
     *    </ws:itemTemplate>
     * </Controls.toolbars:View>
     * </pre>
     */
    displayProperty?: string;

    /**
     * @name Controls/toolbars:ItemTemplate#iconStyleProperty
     * @cfg {String} Стиль отображения иконки.
     * @default secondary
     * @variant primary
     * @variant secondary
     * @variant success
     * @variant warning
     * @variant danger
     * @variant info
     * @variant default
     * 
     * @example
     * <pre class="brush: html; highlight: [5]">
     * <Controls.toolbars:View source="{{_source}}">
     *    <ws:itemTemplate>
     *       <ws:partial
     *          template="Controls/toolbars:ItemTemplate"
     *          iconStyleProperty="success"/>
     *    </ws:itemTemplate>
     * </Controls.toolbars:View>
     * </pre>
     */
    iconStyleProperty?: string;

    /**
     * @name Controls/toolbars:ItemTemplate#iconProperty
     * @cfg {String} Иконка кнопки.
     * @default undefined
     * @example
     * <pre class="brush: html; highlight: [5]">
     * <Controls.toolbars:View source="{{_source}}">
     *    <ws:itemTemplate>
     *       <ws:partial
     *          template="Controls/toolbars:ItemTemplate"
     *          iconProperty="icon"/>
     *    </ws:itemTemplate>
     * </Controls.toolbars:View>
     * </pre>
     */
    iconProperty?: string;

    /**
     * @name Controls/toolbars:ItemTemplate#contentTemplate
     * @cfg {String|Function} Шаблон, описывающий содержимое кнопки.
     * @remark
     * В области видимости шаблона доступен объект **itemData**. Из него можно получить доступ к свойству **item** - это объект, который содержит данные обрабатываемого элемента.
     * @example
     * <pre class="brush: html">
     * <Controls.toolbars:View contentTemplate="Controls/toolbars:defaultContentTemplate" />
     * </pre>
     */
    contentTemplate?: string;
 }
 