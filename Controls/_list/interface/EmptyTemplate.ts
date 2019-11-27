/**
 * Шаблон, который по умолчанию используется для отображения пустого {@link Controls/list:View списка}.
 * @class Controls/list:EmptyTemplate
 * @author Авраменко А.С.
 * @see Controls/list:View
 * @see Controls/list
 * @example
 * В следующем примере показано, как изменить параметры шаблона.
 * <pre>
 * <Controls.list:View
 *    source="{{_viewSource}}"
 *    keyProperty="id">
 *    <ws:emptyTemplate>
 *       <ws:partial template="Controls/list:EmptyTemplate" topSpacing="xxl" bottomSpacing="m">
 *          <ws:contentTemplate>No data available!</ws:contentTemplate>
 *       </ws:partial>
 *    </ws:emptyTemplate>
 * </Controls.list:View>
 * </pre>
 * @remark
 * Подробнее о работе с шаблоном читайте {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/list/templates/empty/ здесь}.
 */

/**
 * @name Controls/list:EmptyTemplate#contentTemplate
 * @cfg {String|Function} Вёрстка, определяющая пользовательское отображение элемента.
 * @remark
 * В области видимости шаблона доступен объект itemData. Из него можно получить доступ к свойству item — это объект, который содержит данные обрабатываемого элемента. Т.е. можно получить доступ к полям и их значениям.
 */

/**
 * @name Controls/listEmptyTemplate#topSpacing
 * @cfg {String} Расстояние между верхней границей и контентом шаблона.
 * @remark 
 * Доступные значения: null, xs, s, m, l, xl, xxl.
 * 
 * @default l
 * @example
 * <pre>
 * <ws:emptyTemplate>
 *    <ws:partial template="Controls/list:EmptyTemplate" topSpacing="xl">
 *       <ws:contentTemplate>No data available!</ws:contentTemplate>
 *    </ws:partial>
 * </ws:emptyTemplate>
 * </pre>
 */

/**
 * @name Controls/list:EmptyTemplate#bottomSpacing
 * @cfg {String} Расстояние между нижней границей и контентом шаблона.
 * @remark 
 * Доступные значения: null, xs, s, m, l, xl, xxl.
 * 
 * @default l
 * @example
 * <pre>
 * <ws:emptyTemplate>
 *    <ws:partial template="Controls/list:EmptyTemplate" bottomSpacing="m">
 *       <ws:contentTemplate>No data available!</ws:contentTemplate>
 *    </ws:partial>
 * </ws:emptyTemplate>
 * </pre>
 */

export default interface IEmptyTemplateOptions {
    topSpacing?: string;
    bottomSpacing?: string;
    contentTemplate?: string;
 }
 