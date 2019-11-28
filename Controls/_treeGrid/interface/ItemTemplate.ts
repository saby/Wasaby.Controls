/**
 * Шаблон, который по умолчанию используется для отображения элементов в {@link Controls/treeGrid:View дереве}.
 * @class Controls/treeGrid:ItemTemplate
 * @author Авраменко А.С.
 * @see Controls/treeGrid:View#itemTemplate
 * @see Controls/treeGrid:View#itemTemplateProperty
 * @example
 * <pre class="brush: html">
 * <Controls.treeGrid:View>
 *    <ws:itemTemplate>
 *       <ws:partial template="Controls/treeGrid:ItemTemplate" levelIndentSize="null" expanderSize="l" expanderIcon="node">
 *          <ws:contentTemplate>
 *             <div title="{{contentTemplate.itemData.item.Name}}">
 *                {{contentTemplate.itemData.item.Name}}
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
 * @cfg {Boolean} Убирает отступы для элементов иерархии.
 * @default false
 * @remark
 * Доступные значения:
 * 
 * * **true** — отступы убраны.
 * * **false** — отступы присутствуют.
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
 * @cfg {String|Function} Устанавливает пользовательский шаблон, описывающий содержимое элемента.
 * @remark
 * В области видимости шаблона доступен объект **itemData**.
 * Из него можно получить доступ к свойству **item** — это объект, который содержит данные обрабатываемого элемента.
 * 
 * Также в области видимости шаблона есть переменная **itemActionsTemplate** — шаблон, который позволяет отобразить панель {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/list/item-actions/ опций записи} в шаблоне.
 * Шаблон достаточно встроить в нужное место contentTemplate с помощью директивы {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/ui-library/template-engine/#ws-partial ws:partial}.
 * Работа с переменной показана в примере № 4.
 * @example
 * **Пример 1.** Шаблон и контрол сконфигурированы в одном WML-файле.
 * <pre class="brush: html">
 * <Controls.grid:View>
 *    <ws:itemTemplate>
 *       <ws:partial template="Controls/treeGrid:ItemTemplate">
 *          <ws:contentTemplate>
 *             {{contentTemplate.itemData.item.title}}
 *          </ws:contentTemplate>
 *       </ws:partial>
 *    </ws:itemTemplate>
 * </Controls.grid:View>
 * </pre>
 * 
 * **Пример 2.** Контрол и шаблоны сконфигурированы в отдельных WML-файлах.
 * <pre class="brush: html">
 * <!-- file1.wml --> 
 * <Controls.grid:View>
 *    <ws:itemTemplate>
 *       <ws:partial template="wml!file2" scope="{{itemTemplate}}"/>
 *    </ws:itemTemplate>
 * </Controls.grid:View>
 * </pre>
 * 
 * <pre class="brush: html">
 * <!-- file2.wml -->
 * <ws:partial template="Controls/treeGrid:ItemTemplate">
 *    <ws:contentTemplate>
 *       {{contentTemplate.itemData.item.title}}
 *    </ws:contentTemplate>
 * </ws:partial>
 * </pre>
 * 
 * **Пример 3.** Шаблон contentTemplate сконфигурирован в отдельном WML-файле.
 * 
 * <pre class="brush: html">
 * <Controls.grid:View>
 *    <ws:itemTemplate>
 *       <ws:partial template="Controls/treeGrid:ItemTemplate">
 *          <ws:contentTemplate>
 *             <ws:partial template="wml!file2" scope="{{contentTemplate}}"/>
 *          </ws:contentTemplate>
 *       </ws:partial>
 *    </ws:itemTemplate>
 * </Controls.grid:View>
 * </pre>
 * 
 * <pre class="brush: html">
 * <!-- file2.wml -->
 * {{contentTemplate.itemData.item.title}}
 * </pre>
 * 
 * **Пример 4.** Для пользовательского шаблона задано отображение опций записи.
 * <pre class="brush: html">
 * <Controls.grid:View>
 *    <ws:itemTemplate>
 *       <ws:partial template="Controls/treeGrid:ItemTemplate">
 *          <ws:contentTemplate>
 *             {{contentTemplate.itemData.item.title}}
 *             <ws:partial template="{{contentTemplate.itemActionsTemplate}}" />
 *          </ws:contentTemplate>
 *       </ws:partial>
 *    </ws:itemTemplate>
 * </Controls.grid:View>
 * </pre>
 */

export default interface IItemTemplateOptions {
   contentTemplate?: string;
   highlightOnHover?: boolean;
   marker?: boolean;
   withoutLevelPadding?: boolean;
   expanderIcon?: string;
   expanderSize?: string;
   levelIndentSize?: string;
   clickable?: boolean;
}