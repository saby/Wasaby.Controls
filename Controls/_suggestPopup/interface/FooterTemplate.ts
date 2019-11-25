/**
 * Шаблон, используемый по умолчанию для построения подвала {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/autocompletion/index/ автодополнения}.
 * @class Controls/suggestPopup:FooterTemplate
 * @author Герасимов А.М.
 * @see Controls/suggestPopup
 * @example
 * Пример:
 * <pre>
 * <ws:partial template="Controls/suggestPopup:FooterTemplate">
 *    <ws:showSelectorButtonTemplate>
 *       <ws:partial template="{{_options.showSelectorButtonTemplate}}" attr:class="myClass"/>
 *    </ws:showSelectorButtonTemplate>
 * </ws:partial>
 * </pre>
 * @remark
 * Дополнительно о шаблоне:
 * 
 * * {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/autocompletion/index/ Руководство разработчика}
 */

/**
 * @name Controls/suggestPopup:FooterTemplate#showMoreButtonTemplate
 * @cfg {function|String} Шаблон кнопки "Показать всё".
 * @default true
 */

/**
 * @name Controls/suggestPopup:FooterTemplate#showSelectorButtonTemplate
 * @cfg {function|String} Шаблон кнопки "Ещё".
 * @default true
 */
export default interface IFooterTemplateOptions {
    showMoreButtonTemplate?: string;
    showSelectorButtonTemplate?: string;
 }
 