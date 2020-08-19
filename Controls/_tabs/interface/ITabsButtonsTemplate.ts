import {TemplateFunction} from 'UI/Base';
import {IItemTemplateOptions} from 'Controls/interface';
export interface ITabsButtonsTemplate {
    readonly '[Controls/_tabs/interface/ITabsButtonsTemplate]': boolean;
}

/**
 * Интерфейс для шаблонных опций контрола вкладок.
 * @interface Controls/_tabs/interface/ITabsButtonsTemplate
 * @public
 */

export interface ITabsButtonsTemplateOptions extends IItemTemplateOptions {
    leftTemplateProperty?: string;
    rightTemplateProperty?: string;
    tabSpaceTemplate?: TemplateFunction;
    itemRightTemplate?: TemplateFunction;
    itemLeftTemplate?: TemplateFunction;
}

/**
 * @name Controls/_tabs/interface/ITabsButtons#tabSpaceTemplate
 * @cfg {Content} Шаблон, отображаемый между вкладками.
 * @default undefined
 * @remark
 * Вкладка может быть выровнена по левому и правому краю, это определяется свойством align.
 * Если у контрола есть левая и правая вкладки, то tabSpaceTemplate будет расположен между ними.
 * @example
 * Пример вкладок с шаблоном между ними:
 * <pre class="brush: html; highlight: [2]">
 * <Controls.tabs:Buttons
 *     tabSpaceTemplate=".../spaceTemplate" />
 * </pre>
 *
 * <pre class="brush: html;">
 * <!-- spaceTemplate.wml -->
 * <div class="additionalContent">
 *     <Controls.buttons:Button .../>
 *     <Controls.buttons:Button .../>
 *     <Controls.buttons:Button .../>
 * </div>
 * </pre>
 */

/*
 * @name Controls/_tabs/interface/ITabsButtons#tabSpaceTemplate
 * @cfg {Content} Contents of the area near the tabs.
 * @default undefined
 * @remark
 * Tab can be left and right aligned, this is determined by the item property 'align'.
 * If control has left and right tabs then  TabSpaceTemplate will be between them.
 * @example
 * Tabs buttons with space template.
 * <pre>
 *    <Controls.tabs:Buttons
 *       .....
 *       tabSpaceTemplate=".../spaceTemplate'"
 *       .....
 *    />
 * </pre>
 * spaceTemplate:
 * <pre>
 *    <div class="additionalContent">
 *       <Controls.buttons:Button .../>
 *       <Controls.buttons:Button .../>
 *       <Controls.buttons:Button .../>
 *    </div>
 * </pre>
 */

/**
 * @name Controls/_tabs/interface/ITabsButtons#itemTemplate
 * @cfg {Function} Шаблон для рендеринга.
 * @default Base template 'Controls/tabs:buttonsItemTemplate'
 * @remark
 * Чтобы определить шаблон, следует вызвать базовый шаблон 'Controls/tabs:buttonsItemTemplate'.
 * Шаблон помещается в компонент с помощью тега ws:partial с атрибутом template.
 * По умолчанию в шаблоне 'Controls/tabs:buttonsItemTemplate' будет отображаться только поле 'title'. Можно изменить формат отображения записей, задав следующие параметры:
 * <ul>
 *    <li>displayProperty - определяет поле отображения записи.</li>
 * <ul>
 * @example
 * Вкладки со стандартным шаблоном элемента (шаблоном по умолчанию).
 *
 * <pre class="brush: html; highlight: [6,7,8,9,10]">
 * <Controls.tabs:Buttons
 *     bind:selectedKey="SelectedKey3"
 *     keyProperty="id"
 *     style="additional"
 *     source="{{_source3}}">
 *     <ws:itemTemplate>
 *         <ws:partial template="Controls/tabs:buttonsItemTemplate"
 *                     item="{{itemTemplate.item}}"
 *                     displayProperty="caption" />
 *     </ws:itemTemplate>
 * </Controls.tabs:Buttons>
 * </pre>
 * @see itemTemplateProperty
 */

/*
 * @name Controls/_tabs/interface/ITabsButtons#itemTemplate
 * @cfg {Function} Template for item render.
 * @default Base template 'Controls/tabs:buttonsItemTemplate'
 * @remark
 * To determine the template, you should call the base template 'Controls/tabs:buttonsItemTemplate'.
 * The template is placed in the component using the ws:partial tag with the template attribute.
 * By default, the base template 'Controls/tabs:buttonsItemTemplate' will display only the 'title' field. You can change the display of records by setting their values for the following options:
 * <ul>
 *    <li>displayProperty - defines the display field of the record.</li>
 * <ul>
 * @example
 * Tabs buttons with item template.
 * <pre>
 *    <Controls.tabs:Buttons
 *                   bind:selectedKey='SelectedKey3'
 *                   keyProperty="id"
 *                   style="additional"
 *                   source="{{_source3}}">
 *       <ws:itemTemplate>
 *          <ws:partial template="Controls/tabs:buttonsItemTemplate"
 *                      item="{{itemTemplate.item}}"
 *                      displayProperty="caption"/>
 *       </ws:itemTemplate>
 *    </Controls.tabs:Buttons>
 * </pre>
 */

/**
 * @name Controls/_tabs/interface/ITabsButtons#itemTemplateProperty
 * @cfg {String} Имя поля, которое содержит шаблон отображения элемента.
 * @default Если параметр не задан, вместо него используется itemTemplate.
 * @remark
 * Чтобы определить шаблон, вы должны вызвать базовый шаблон 'Controls/tabs:buttonsItemTemplate'.
 * Шаблон помещается в компонент с помощью тега ws:partial с атрибутом template.
 * По умолчанию в шаблоне 'Controls/tabs:buttonsItemTemplate' будет отображаться только поле 'title'. Можно изменить формат отображения записей, задав следующие параметры:
 * <ul>
 *    <li>displayProperty - определяет поле отображения записи.</li>
 * <ul>
 * @example
 * Вкладки с шаблоном элемента.
 * <pre class="brush: html; highlight: [2]">
 * <Controls.tabs:Buttons
 *     itemTemplateProperty="myTemplate"
 *     source="{{_source}}" />
 * </pre>
 *
 * <pre class="brush: html">
 * <!-- myTemplate.wml -->
 * <div class="controls-Tabs__item_custom">{{item.get(displayProperty || 'title')}}</div>
 * </pre>
 *
 * <pre class="brush: js">
 * _source: null,
 * beforeMount: function() {
 *    this._source: new Memory({
 *       keyProperty: 'id',
 *       data: [
 *          {id: 1, title: 'I agree'},
 *          {id: 2, title: 'I not decide'},
 *          {id: 4, title: 'Will not seem', caption: 'I not agree',  myTemplate: 'wml!.../myTemplate'}
 *       ]
 *    });
 * }
 * </pre>
 * @see itemTemplate
 */

/*
 * @name Controls/_tabs/interface/ITabsButtons#itemTemplateProperty
 * @cfg {String} Name of the item property that contains template for item render.
 * @default If not set, itemTemplate is used instead.
 * @remark
 * To determine the template, you should call the base template 'Controls/tabs:buttonsItemTemplate'.
 * The template is placed in the component using the ws:partial tag with the template attribute.
 * By default, the base template 'Controls/tabs:buttonsItemTemplate' will display only the 'title' field. You can change the display of records by setting their values for the following options:
 * <ul>
 *    <li>displayProperty - defines the display field of the record.</li>
 * <ul>
 * @example
 * Tabs buttons with item template.
 * <pre>
 *    <Controls.tabs:Buttons itemTemplateProperty="myTemplate"
 *                           source="{{_source}}
 *                           ...>
 *    </Controls.tabs:Buttons>
 * </pre>
 * myTemplate
 * <pre>
 *    <div class="controls-Tabs__item_custom">{{item.get(displayProperty || 'title')}}</div>
 * </pre>
 * <pre>
 *    _source: new Memory({
 *              keyProperty: 'id',
 *              data: [
 *                     {id: 1, title: 'I agree'},
 *                     {id: 2, title: 'I not decide'},
 *                     {id: 4, title: 'Will not seem', caption: 'I not agree',  myTemplate: 'wml!.../myTemplate'}
 *              ]
 *    })
 * </pre>
 */

/**
 * @name Controls/_tabs/interface/ITabsButtons#rightTemplateProperty
 * @cfg {String} Имя поля, которое содержит шаблон отображения элемента, находящегося справа от основного содержимого.
 * @example
 * <pre class="brush: html; highlight: [2]">
 * <Controls.tabs:Buttons
 *     rightTemplateProperty="myTemplate"
 *     source="{{_source}}" />
 * </pre>
 *
 * <pre class="brush: html">
 * <!-- myTemplate.wml -->
 * <div class="{{item.get('icon')}} icon-small controls-icon_style-{{item.get('iconStyle')}}_theme-{{_options.theme}}"></div>
 * </pre>
 *
 * <pre class="brush: js">
 * _source: null,
 * beforeMount: function() {
 *    this._source: new Memory({
 *       keyProperty: 'id',
 *       data: [
 *          {id: 1, title: 'I agree'},
 *          {id: 2, title: 'I not decide'},
 *          {id: 4, title: 'Will not seem', caption: 'I not agree',  myTemplate: 'wml!.../myTemplate'}
 *       ]
 *    });
 * }
 * </pre>
 * @see leftTemplateProperty
 */

/**
 * @name Controls/_tabs/interface/ITabsButtons#leftTemplateProperty
 * @cfg {String} Имя поля, которое содержит шаблон отображения элемента, находящегося слева от основного содержимого.
 * @example
 * <pre class="brush: html; highlight: [2]">
 * <Controls.tabs:Buttons
 *     leftTemplateProperty="myTemplate"
 *     source="{{_source}}" />
 * </pre>
 *
 * <pre class="brush: html">
 * <!-- myTemplate.wml -->
 * <div class="{{item.get('icon')}} icon-small controls-icon_style-{{item.get('iconStyle')}}_theme-{{_options.theme}}"></div>
 * </pre>
 *
 * <pre class="brush: js">
 * _source: null,
 * beforeMount: function() {
 *    this._source: new Memory({
 *       keyProperty: 'id',
 *       data: [
 *          {id: 1, title: 'I agree'},
 *          {id: 2, title: 'I not decide'},
 *          {id: 4, title: 'Will not seem', caption: 'I not agree',  myTemplate: 'wml!.../myTemplate'}
 *       ]
 *    });
 * }
 * </pre>
 * @see rightTemplateProperty
 */

/**
 * @name Controls/_tabs/interface/ITabsButtons#itemRightTemplate
 * @cfg {String} Шаблон элемента, находящегося справа от основного содержимого.
 * @remark
 * Базовый шаблон itemRightTemplate поддерживает следующие параметры:
 *
 * - item {Model} — запись текущей вкладки;
 * - selected {Boolean} — выбрана ли вкладка, на которой располагается шаблон;
 * @example
 * <pre class="brush: html; highlight: [2,3,4,5,6]">
 * <Controls.tabs:Buttons bind:selectedKey="_mySelectedKey" keyProperty="id" source="{{_mySource}}">
 *     <ws:itemRightTemplate>
 *         <ws:if data="{{_counter}}">
 *             <ws:partial template="{{ _myRightTpl }}" item="{{itemRightTemplate.item}}" counter="{{_counter}}" />
 *         </ws:if>
 *     </ws:itemRightTemplate>
 * </Controls.tabs:Buttons>
 * </pre>
 * @see itemLeftTemplate
 */

/**
 * @name Controls/_tabs/interface/ITabsButtons#itemLeftTemplate
 * @cfg {String} Шаблон элемента, находящегося слева от основного содержимого.
 * @remark
 * Базовый шаблон itemLeftTemplate поддерживает следующие параметры:
 *
 * - item {Model} — запись текущей вкладки.
 * - selected {Boolean} — выбрана ли вкладка, на которой располагается шаблон.
 * @example
 * <pre class="brush: html;highlight: [2,3,4,5,6]">
 * <Controls.tabs:Buttons bind:selectedKey="_mySelectedKey" keyProperty="id" source="{{_mySource}}">
 *     <ws:itemLeftTemplate>
 *         <ws:if data="{{_counter}}">
 *             <ws:partial template="{{ _myRightTpl }}" item="{{itemLeftTemplate.item}}" counter="{{_counter}}" />
 *         </ws:if>
 *     </ws:itemRightTemplate>
 * </Controls.tabs:Buttons>
 * </pre>
 * @see itemRightTemplate
 */
