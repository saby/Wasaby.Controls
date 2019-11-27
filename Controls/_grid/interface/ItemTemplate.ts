/**
 * Шаблон, который по умолчанию используется для отображения элементов в {@link Controls/grid:View табличном представлении}.
 * @class Controls/grid:ItemTemplate
 * @author Авраменко А.С.
 * @see Controls/grid:View#itemTemplate
 * @see Controls/grid:View#itemTemplateProperty
 * @example
 * В следующем примере показано, как изменить параметры шаблона.
 * <pre>
 * <Controls.grid:View>
 *    <ws:itemTemplate>
 *       <ws:partial template="Controls/grid:ItemTemplate"
 *          marker="{{false}}"
 *          highlightOnHover="{{false}}"
 *          clickable="{{false}}">
 *          <ws:contentTemplate>
 *             {{contentTemplate.itemData.item.title}}
 *          </ws:contentTemplate>
 *       </ws:partial>
 *    </ws:itemTemplate>
 * </Controls.grid:View>
 * </pre>
 * @remark
 * Дополнительно о работе с шаблоном читайте {@link https://wi.sbis.ru/doc/platform/doc/platform/developmentapl/interface-development/controls/list/grid/templates/item/ здесь}.
 */

/**
 * @name Controls/grid:ItemTemplate#marker
 * @cfg {Boolean} Когда параметр установлен в значение true, активный элемент будет выделяться {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/list/select/marker/ маркером}.
 * @default true
 */
/**
 * @name Controls/grid:ItemTemplate#highlightOnHover
 * @cfg {Boolean} Когда параметр установлен в значение true, элемент таблицы будет подсвечиваться при наведении курсора мыши.
 * @default true
 */
/**
 * @name Controls/grid:ItemTemplate#clickable
 * @cfg {Boolean} Когда параметр установлен в значение true, используется {@link https://developer.mozilla.org/ru/docs/Web/CSS/cursor курсор} pointer, а в значении false — default.
 * @default true
 */
/**
 * @name Controls/grid:ItemTemplate#contentTemplate
 * @cfg {String|Function} Устанавливает пользовательский шаблон, описывающий содержимое элемента.
 * @default undefined
 * @remark
 * В области видимости шаблона доступен объект **itemData**.
 * Из него можно получить доступ к свойству **item** — это объект, который содержит данные обрабатываемого элемента.
 * 
 * Также в области видимости шаблона есть переменная **itemActionsTemplate** — шаблон, который позволяет отобразить панель {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/list/item-actions/ опций записи} в шаблоне.
 * Шаблон достаточно встроить в нужное место contentTemplate с помощью директивы {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/ui-library/template-engine/#ws-partial ws:partial}.
 * Работа с переменной показана в примере № 4.
 * @example
 * **Пример 1.** Шаблон и контрол сконфигурированы в одном WML-файле.
 * <pre>
 * <Controls.grid:View>
 *    <ws:itemTemplate>
 *       <ws:partial template="Controls/grid:ItemTemplate">
 *          <ws:contentTemplate>
 *             {{contentTemplate.itemData.item.title}}
 *          </ws:contentTemplate>
 *       </ws:partial>
 *    </ws:itemTemplate>
 * </Controls.grid:View>
 * </pre>
 * 
 * **Пример 2.** Контрол и шаблоны сконфигурированы в отдельных WML-файлах.
 * <pre>
 * <!-- file1.wml --> 
 * <Controls.grid:View>
 *    <ws:itemTemplate>
 *       <ws:partial template="wml!file2" scope="{{itemTemplate}}"/>
 *    </ws:itemTemplate>
 * </Controls.grid:View>
 * </pre>
 * 
 * <pre>
 * <!-- file2.wml -->
 * <ws:partial template="Controls/grid:ItemTemplate">
 *    <ws:contentTemplate>
 *       {{contentTemplate.itemData.item.title}}
 *    </ws:contentTemplate>
 * </ws:partial>
 * </pre>
 * 
 * **Пример 3.** Шаблон contentTemplate сконфигурирован в отдельном WML-файле.
 * 
 * <pre>
 * <Controls.grid:View>
 *    <ws:itemTemplate>
 *       <ws:partial template="Controls/grid:ItemTemplate">
 *          <ws:contentTemplate>
 *             <ws:partial template="wml!file2" scope="{{contentTemplate}}"/>
 *          </ws:contentTemplate>
 *       </ws:partial>
 *    </ws:itemTemplate>
 * </Controls.grid:View>
 * </pre>
 * 
 * <pre>
 * <!-- file2.wml -->
 * {{contentTemplate.itemData.item.title}}
 * </pre>
 * 
 * **Пример 4.** Для пользовательского шаблона задано отображение опций записи.
 * <pre>
 * <Controls.grid:View>
 *    <ws:itemTemplate>
 *       <ws:partial template="Controls/grid:ItemTemplate">
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
   marker?: boolean;
   highlightOnHover?: boolean;
   clickable?: boolean;
   contentTemplate?: string;
   itemActionsTemplate?: string;
}