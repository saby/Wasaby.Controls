/**
 * Интерфейс для шаблона отображения элемента в {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/ списочном контроле}.
 * @interface Controls/list:BaseItemTemplate
 * @author Авраменко А.С.
 */

/**
 * @name Controls/list:BaseItemTemplate#marker
 * @cfg {Boolean} Когда опция установлена в значение true, активный элемент будет выделяться {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/list/select/marker/ маркером}.
 * @default true
 */

/**
 * @name Controls/list:BaseItemTemplate#highlightOnHover
 * @cfg {Boolean} Когда опция установлена в значение true, элемент будет подсвечиваться при наведении курсора мыши.
 * @default true
 */

/**
 * @name Controls/list:BaseItemTemplate#clickable
 * @cfg {Boolean} Устанавливает доступность элемента для клика. В зависимости от выбранного значения изменяется тип {@link https://developer.mozilla.org/ru/docs/Web/CSS/cursor курсора}.
 * @default true
 * @remark
 * Доступные значения:
 * 
 * * **true** — элемент доступен для клика, используется курсор pointer.
 * * **false** — элемент недоступен для клика, используется курсор default.
 */

/**
 * @name Controls/list:BaseItemTemplate#itemActionsClass
 * @cfg {String|Function} Устанавливает положение {@link опций записи} относительно элемента списка.
 * @remark
 * * controls-itemActionsV_position_bottomRight — отображение операций в правом нижнем углу (по умолчанию); 
 * * controls-itemActionsV_position_topRight — отображение операций в правом верхнем углу.
 */

/**
 * @name Controls/list:BaseItemTemplate#contentTemplate
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
 * В следующих примерах показано, как изменять опции шаблона для контрола {@link Controls/list:View}, однако тоже самое справедливо и для других списочных контролов.
 * В примерах №№ 1, 2 и 3 показано, как получить доступ к переменной itemData из области видимости шаблона.
 * 
 * **Пример 1.** Шаблон и контрол сконфигурированы в одном WML-файле.
 * <pre class="brush: html">
 * <!-- file1.wml -->
 * <Controls.list:View>
 *    <ws:itemTemplate>
 *       <ws:partial template="Controls/list:ItemTemplate">
 *          <ws:contentTemplate>
 *             {{contentTemplate.itemData.item.title}}
 *          </ws:contentTemplate>
 *       </ws:partial>
 *    </ws:itemTemplate>
 * </Controls.list:View>
 * </pre>
 * 
 * **Пример 2.** Контрол и шаблоны сконфигурированы в отдельных WML-файлах.
 * <pre class="brush: html">
 * <!-- file1.wml --> 
 * <Controls.list:View>
 *    <ws:itemTemplate>
 *       <ws:partial template="wml!file2" scope="{{itemTemplate}}"/>
 *    </ws:itemTemplate>
 * </Controls.list:View>
 * </pre>
 * 
 * <pre class="brush: html">
 * <!-- file2.wml -->
 * <ws:partial template="Controls/list:ItemTemplate">
 *    <ws:contentTemplate>
 *       {{contentTemplate.itemData.item.title}}
 *    </ws:contentTemplate>
 * </ws:partial>
 * </pre>
 * 
 * **Пример 3.** Шаблон contentTemplate сконфигурирован в отдельном WML-файле.
 * 
 * <pre class="brush: html">
 * <!-- file1.wml --> 
 * <Controls.list:View>
 *    <ws:itemTemplate>
 *       <ws:partial template="Controls/list:ItemTemplate">
 *          <ws:contentTemplate>
 *             <ws:partial template="wml!file2" scope="{{contentTemplate}}"/>
 *          </ws:contentTemplate>
 *       </ws:partial>
 *    </ws:itemTemplate>
 * </Controls.list:View>
 * </pre>
 * 
 * <pre class="brush: html">
 * <!-- file2.wml -->
 * {{contentTemplate.itemData.item.title}}
 * </pre>
 * 
 * **Пример 4.** Для пользовательского шаблона задано отображение опций записи.
 * <pre class="brush: html; highlight: [7]">
 * <!-- file1.wml --> 
 * <Controls.list:View>
 *    <ws:itemTemplate>
 *       <ws:partial template="Controls/list:ItemTemplate">
 *          <ws:contentTemplate>
 *             {{contentTemplate.itemData.item.title}}
 *             <ws:partial template="{{contentTemplate.itemActionsTemplate}}" />
 *          </ws:contentTemplate>
 *       </ws:partial>
 *    </ws:itemTemplate>
 * </Controls.list:View>
 * </pre>
 */

export default interface IBaseItemTemplateOptions {
   highlightOnHover?: boolean;
   clickable?: boolean;
   marker?: boolean;
   itemActionsClass?: string;
   contentTemplate?: string;
}