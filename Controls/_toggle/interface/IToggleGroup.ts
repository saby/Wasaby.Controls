export interface IToggleGroupOptions {
    direction?: string;
    itemTemplate?: string | Function;
    itemTemplateProperty?: string;
}

/**
 * Interface for group of toggle control.
 *
 * @interface Controls/_toggle/interface/IToggleGroup
 * @public
 * @author Михайловский Д.С.
 */

export interface IToggleGroup {
    readonly '[Controls/_toggle/interface/IToggleGroup]': boolean;
    /**
     * @name Controls/_toggle/interface/IToggleGroup#direction
     * @cfg {string} Arrangement of elements in the container.
     * @variant horizontal Elements are located one after another.
     * @variant vertical Elements are located one under another.
     * @default horizontal
     * @example
     * Vertical orientation.
     * <pre>
     *    <Controls.toggle:RadioGroup direction="vertical"/>
     * </pre>
     */

    /**
     * @name Controls/_toggle/interface/IToggleGroup#itemTemplate
     * @cfg {Function} Template for item render.
     * @default Base template
     * @remark
     * To determine the template, you should call the base template.
     * The template is placed in the component using the <ws:partial> tag with the template attribute.
     *
     * By default, the base template will display only the 'title' field.
     * You can change the display of records by setting their values for the following options:
     * <ul>
     *    <li>displayProperty - defines the display field of the record.</li>
     * </ul>
     * You can redefine content using the contentTemplate option.
     * You can change the display of records by setting their values for the following options:
     * <ul>
     *    <li>selected - defines the display field in selected or unselected states.</li>
     *    <li>readOnly - defines the display field in readOnly or non readOnly states.</li>
     * </ul>
     * @example
     * RadioGroup with iteemTemplate and contentTemplate.
     * <pre>
     *    <Controls.toggle:RadioGroup ... >
     *       <ws:itemTemplate>
     *          <ws:partial
     *             template="wml!Controls/_toggle/RadioGroup/resources/ItemTemplate" >
     *             <ws:contentTemplate>
     *                <span attr:class="controls-RadioItem__caption_{{selected ? 'selected' : 'unselected'}}_{{readOnly ? 'disabled' : 'enabled'}}_custom controls-RadioItem__caption_custom">
     *                </span>
     *             </ws:contentTemplate>
     *          </ws:partial>
     *       </ws:itemTemplate>
     *    </Controls.toggle:RadioGroup>
     * </pre>
     * @see itemTemplateProperty
     */

    /**
     * @name Controls/_toggle/interface/IToggleGroup#itemTemplateProperty
     * @cfg {String} Name of the item property that contains template for item render.
     * @default If not set, itemTemplate is used instead.
     * @remark
     * To determine the template, you should call the base template "wml!Controls/_toggle/RadioGroup/resources/ItemTemplate".
     * The template is placed in the component using the <ws:partial> tag with the template attribute.
     *
     * By default, the base template wml!Controls/_dropdown/itemTemplate will display only the 'title' field.
     * You can change the display of records by setting their values for the following options:
     * <ul>
     *    <li>displayProperty - defines the display field of the record.</li>
     * </ul>
     * You can redefine content using the contentTemplate option.
     * You can change the display of records by setting their values for the following options:
     * <ul>
     *    <li>selected - defines the display field in selected or unselected states.</li>
     *    <li>readOnly - defines the display field in readOnly or non readOnly states.</li>
     * </ul>
     * @example
     * Example description.
     * <pre>
     *    <Controls.toggle:RadioGroup itemTemplateProperty="myTemplate" source="{{_source}}...>
     *    </Controls.toggle:RadioGroup>
     * </pre>
     * myTemplate
     * <pre>
     *    <ws:partial
     *       template="wml!Controls/_toggle/RadioGroup/resources/ItemTemplate" >
     *       <ws:contentTemplate>
     *          <span attr:class="controls-RadioItem__caption_{{selected ? 'selected' : 'unselected'}}_{{readOnly ? 'disabled' : 'enabled'}} controls-RadioItem__caption">
     *             {{item['caption']}}
     *          </span>
     *       </ws:contentTemplate>
     *    </ws:partial>
     * </pre>
     * <pre>
     *    _source: new Memory({
    *       idProperty: 'id',
    *       data: [
    *          {id: 1, title: 'I agree'},
    *          {id: 2, title: 'I not decide'},
    *          {id: 4, title: 'Will not seem', caption: 'I not agree',  myTemplate: 'wml!.../myTemplate'}
    *       ]
    *    })
     * </pre>
     * @see itemTemplate
     */
}
