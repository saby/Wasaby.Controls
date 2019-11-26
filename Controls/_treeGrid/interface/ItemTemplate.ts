/**
 * Шаблон, который по умолчанию используется для отображения элементов в {@link Controls/treeGrid:View дереве}.
 * @class Controls/treeGrid:ItemTemplate
 * @author Авраменко А.С.
 * @see Controls/treeGrid:View#itemTemplate
 * @see Controls/treeGrid:View#itemTemplateProperty
 * * Внутри шаблона доступен объект itemData, позволяющий получить доступ к данным для рендеринга (например: item, key, etc.).
 * @example
 * <pre>
 * <Controls.treeGrid:View>
 *    <ws:itemTemplate>
 *       <ws:partial template="Controls/treeGrid:ItemTemplate" levelIndentSize="null" expanderSize="l" expanderIcon="node">
 *          <ws:contentTemplate>
 *             <div title="{{itemTemplate.itemData.item.Name}}">
 *                {{itemTemplate.itemData.item.Name}}
 *             </div>
 *          </ws:contentTemplate>
 *       </ws:partial>
 *    </ws:itemTemplate>
 * </Controls.treeGrid:View>
 * </pre>
 */


/**
 * @name Controls/treeGrid:ItemTemplate#clickable
 * @cfg {Boolean} Устанавливает тип {@link https://developer.mozilla.org/ru/docs/Web/CSS/cursor курсора}.
 * @default true
 * @remark
 * Доступные значения
 * 
 * * **true** — используется курсор pointer.
 * * **false** — используется курсор default.
 */

/**
 * @name Controls/treeGrid:ItemTemplate#levelIndentSize
 * @cfg {String} Устанавливает размер отступа элемента иерархии.
 * @default s
 * @remark
 * Доступные значения s, m, l и xl.
 * 
 */

/**
 * @name Controls/treeGrid:ItemTemplate#expanderSize
 * @cfg {String} Устанавливает размер иконки для узла и скрытого узла.
 * @default s
 * @remark
 * Доступные значения s, m, l и xl.
 * 
 */

/**
 * @name Controls/treeGrid:ItemTemplate#expanderIcon
 * @cfg {String} Устанавливает стиль отображения иконки для узла и скрытого узла.
 * @default undefined
 * @remark
 * Доступные значения:
 * 
 * * **none** — иконки всех узлов не отображаются.
 * * **node** — иконки всех узлов отображаются как иконки узлов.
 * * **hiddenNode** — иконки всех узлов отображаются как иконки скрытых узлов.
 */

/**
 * @name Controls/treeGrid:ItemTemplate#withoutLevelPadding
 * @cfg {Boolean} Убирает отступы в иерархии для вложенных записей.
 * @default false
 * @remark
 * Доступные значения:
 * 
 * * **true** — в дереве отступы убраны.
 * * **false** — дерево отображается как обычно.
 */

/**
 * @name Controls/treeGrid:ItemTemplate#marker
 * @cfg {Boolean} Когда параметр установлен в значение true, активный элемент будет выделяться {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/list/select/marker/ маркером}.
 * @default true
 */
/**
 * @name Controls/treeGrid:ItemTemplate#highlightOnHover
 * @cfg {Boolean} Когда параметр установлен в значение true, элемент таблицы будет подсвечиваться при наведении курсора мыши.
 * @default true
 */
/**
 * @name Controls/treeGrid:ItemTemplate#contentTemplate
 * @cfg {String|Function} Шаблон, описывающий содержимое элемента.
 * @default undefined
 * @remark
 * В области видимости шаблона доступен объект **itemData**.
 * Из него можно получить доступ к свойству **item** — это объект, который содержит данные обрабатываемого элемента.
 * @example
 * 
 * **Пример 1.** Шаблон строки в конфигурации родительского контрола.
 * 
 * <pre>
 * <Controls.treeGrid:View>
 *    <ws:itemTemplate>
 *       <ws:partial template="Controls/treeGrid:ItemTemplate">
 *          <ws:contentTemplate>
 *             <div title="{{itemTemplate.itemData.item.Name}}">
 *                {{itemTemplate.itemData.item.Name}}
 *             </div>
 *          </ws:contentTemplate>
 *       </ws:partial>
 *    </ws:itemTemplate>
 * </Controls.treeGrid:View>
 * </pre>
 * 
 * **Пример 2.** Шаблон строки описан в отдельном файле, импортирован в родительский контрол и передан в опцию.
 * 
 * <pre class="brush: html">
 * <!-- Child.wml -->
 * <ws:partial template="Controls/treeGrid:ItemTemplate" scope="{{_options}}">
 *    <ws:contentTemplate>
 *       <div title="{{itemData.item.Name}}">
 *          {{itemData.item.Name}}
 *       </div>
 *    </ws:contentTemplate>
 * </ws:partial>
 * </pre>
 * 
 * <pre class="brush: html">
 * <!-- Parent.wml -->
 * <Controls.treeGrid:View itemTemplate="{{ myTemplate }}" />
 * </pre>
 * 
 * <pre class="brush: js">
 * define('MyControl',
 *    ['UI/Base', 'wml!Parent', 'wml!Child'], 
 *    function(Base, template, myTemplate) {
 *    var ModuleClass = Base.Control.extend({
 *       _template: template,
 *       myTemplate: myTemplate,
 *       // логика работы контрола
 *    });
 *    return ModuleClass;
 * });
 * </pre>
 */
/**
 * @name Controls/treeGrid:ItemTemplate#itemActionsTemplate
 * @cfg {String|Function} Шаблон позволяет отобразить панель {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/list/item-actions/ опций записи}, когда задан пользовательский шаблон (см. contentTemplate) в Controls/treeGrid:ItemTemplate.
 * Шаблон достаточно встроить в нужное место contentTemplate с помощью директивы {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/ui-library/template-engine/#ws-partial ws:partial}.
 * @default wml!Controls/_list/ItemActions/resources/ItemActionsTemplate
 * @example
 * **Пример 1.** Шаблон строки задан в конфигурации родительского контрола.
 * В этом случае доступ к переменной itemData происходит через itemTemplate.
 * 
 * <pre>
 * <Controls.treeGrid:View>
 *    <ws:itemTemplate>
 *       <ws:partial template="Controls/treeGrid:ItemTemplate">
 *          <ws:contentTemplate>
 *             {{itemTemplate.itemData.item.Name}}
 *             <ws:partial template="{{itemTemplate.itemActionsTemplate}}" />
 *          </ws:contentTemplate>
 *       </ws:partial>
 *    </ws:itemTemplate>
 * </Controls.treeGrid:View>
 * </pre>
 * 
 * **Пример 2.** Шаблон строки описан в отдельном файле, импортирован в родительский контрол и передан в опцию.
 * В этом случае для доступа к переменной itemData нужно дополнительно передать опцию scope.
 * 
 * <pre class="brush: html">
 * <!-- Child.wml -->
 * <ws:partial template="Controls/treeGrid:ItemTemplate" scope="{{_options}}">
 *    <ws:contentTemplate>
 *       {{itemData.item.Name}}
 *       <ws:partial template="{{itemActionsTemplate}}" />
 *    </ws:contentTemplate>
 * </ws:partial>
 * </pre>
 * 
 * <pre class="brush: html">
 * <!-- Parent.wml -->
 * <Controls.treeGrid:View itemTemplate="{{ myTemplate }}" />
 * </pre>
 * 
 * <pre class="brush: js">
 * define('MyControl',
 *    ['UI/Base', 'wml!Parent', 'wml!Child'], 
 *    function(Base, template, myTemplate) {
 *    var ModuleClass = Base.Control.extend({
 *       _template: template,
 *       myTemplate: myTemplate,
 *       // логика работы контрола
 *    });
 *    return ModuleClass;
 * });
 * </pre>
 */

export default interface IItemTemplateOptions {
   contentTemplate?: string;
   itemActionsTemplate?: string;
   highlightOnHover?: boolean;
   marker?: boolean;
   withoutLevelPadding?: boolean;
   expanderIcon?: string;
   expanderSize?: string;
   levelIndentSize?: string;
   clickable?: boolean;
}