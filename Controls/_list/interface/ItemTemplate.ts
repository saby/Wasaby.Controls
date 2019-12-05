/**
 * Шаблон, который по умолчанию используется для отображения элементов в {@link Controls/list:View плоских списках}.
 * @class Controls/list:ItemTemplate
 * @author Авраменко А.С.
 * @see Controls/list:View
 * @see Controls/list
 * @example
 * В следующем примере показано, как изменить параметры шаблона.
 * <pre>
 * <Controls.list:View>
 *    <ws:itemTemplate>
 *       <ws:partial template="Controls/list:ItemTemplate" marker="{{true}}" /> 
 *    </ws:itemTemplate>
 * </Controls.list:View>
 * </pre>
 * @remark
 * Подробнее о работе с шаблоном читайте {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/list/templates/item/ здесь}.
 */

/**
 * @name Controls/list:ItemTemplate#marker
 * @cfg {Boolean} Когда параметр установлен в значение true, активный элемент списка будет выделяться {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/list/select/marker/ маркером}.
 * @default true
 */

/**
 * @name Controls/list:ItemTemplate#highlightOnHover
 * @cfg {Boolean} Когда параметр установлен в значение true, элемент списка будет подсвечиваться при наведении курсора мыши.
 * @default true
 */

/**
 * @name Controls/list:ItemTemplate#clickable
 * @cfg {Boolean} Когда параметр установлен в значение true, используется {@link https://developer.mozilla.org/ru/docs/Web/CSS/cursor курсор} pointer, а в значении false — default.
 * @default true
 */

/**
 * @name Controls/list:ItemTemplate#displayProperty
 * @cfg {String} Имя поля элемента строки. 
 * @remark 
 * Параметр необязательный. 
 * @default title
 */

/**
 * @name Controls/list:ItemTemplate#itemActionsClass
 * @cfg {String|Function} Задает положение операций относительно элемента списка.
 * @remark
 * * controls-itemActionsV_position_bottomRight — отображение операций в правом нижнем углу (по умолчанию); 
 * * controls-itemActionsV_position_topRight — отображение операций в правом верхнем углу.
 */

/**
 * @name Controls/list:ItemTemplate#contentTemplate
 * @cfg {String|Function} Вёрстка, определяющая пользовательское отображение элемента.
 * @remark
 * В области видимости шаблона доступен объект itemData. Из него можно получить доступ к свойству item — это объект, который содержит данные обрабатываемого элемента. Т.е. можно получить доступ к полям и их значениям.
 */
export default interface IItemTemplateOptions {
    displayProperty?: string;
    highlightOnHover?: boolean;
    clickable?: boolean;
    marker?: boolean;
    itemActionsClass?: string;
    contentTemplate?: string;
 }
 