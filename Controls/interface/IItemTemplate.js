define('Controls/interface/IItemTemplate', [
], function() {
   
   /**
    * Interface for components with customizable display of elements.
    *
    * @interface Controls/interface/IItemTemplate
    * @public
    */
   
   /**
    * @name Controls/interface/IItemTemplate#itemTemplate
    * @cfg {Function} Template for item render.
    * @default Base template "tmpl!Controls\Toggle\RadioGroup\resources\ItemTemplate"
    * @remark
    * To determine the template, you should call the base template "wml!Controls\Toggle\RadioGroup\resources\ItemTemplate".
    * The template is placed in the component using the <ws:partial> tag with the template attribute.
    *
    * By default, the base template wml!Controls/Dropdown/resources/template/itemTemplate will display only the 'title' field.
    * You can change the display of records by setting their values ​​for the following options:
    * <ul>
    *    <li>displayProperty - defines the display field of the record.</li>
    * </ul>
    * You can redefine content using the contentTemplate option.
    * You can change the display of records by setting their values ​​for the following options:
    * <ul>
    *    <li>selected - defines the display field in selected or unselected states.</li>
    *    <li>readOnly - defines the display field in readOnly or non readOnly states.</li>
    * </ul>
    * @example
    * RadioGroup with iteemTemplate and contentTemplate.
    * <pre>
    *    <Controls.Toggle.RadioGroup ... >
    *       <ws:itemTemplate>
    *          <ws:partial
    *             template="wml!Controls/Toggle/RadioGroup/resources/ItemTemplate" >
    *             <ws:contentTemplate>
    *                <span attr:class="controls-RadioItem__caption_{{selected ? 'selected' : 'unselected'}}_{{readOnly ? 'disabled' : 'enabled'}}_custom controls-RadioItem__caption_custom">
    *                </span>
    *             </ws:contentTemplate>
    *          </ws:partial>
    *       </ws:itemTemplate>
    *    </Controls.Toggle.RadioGroup>
    * </pre>
    * @see itemTemplateProperty
    */
   
   /**
    * @name Controls/interface/IItemTemplate#itemTemplateProperty
    * @cfg {String} Name of the item property that contains template for item render.
    * @default If not set, itemTemplate is used instead.
    * @remark
    * To determine the template, you should call the base template "wml!Controls\Toggle\RadioGroup\resources\ItemTemplate".
    * The template is placed in the component using the <ws:partial> tag with the template attribute.
    *
    * By default, the base template wml!Controls/Dropdown/resources/template/itemTemplate will display only the 'title' field.
    * You can change the display of records by setting their values ​​for the following options:
    * <ul>
    *    <li>displayProperty - defines the display field of the record.</li>
    * </ul>
    * You can redefine content using the contentTemplate option.
    * You can change the display of records by setting their values ​​for the following options:
    * <ul>
    *    <li>selected - defines the display field in selected or unselected states.</li>
    *    <li>readOnly - defines the display field in readOnly or non readOnly states.</li>
    * </ul>
    * @example
    * Example description.
    * <pre>
    *    <Controls.Toggle.RadioGroup itemTemplateProperty="myTemplate" source="{{_source}}...>
    *    </Controls.Toggle.RadioGroup>
    * </pre>
    * myTemplate
    * <pre>
    *    <ws:partial
    *       template="wml!Controls/Toggle/RadioGroup/resources/ItemTemplate" >
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
   
});
