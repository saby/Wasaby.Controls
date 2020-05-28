/**
 * Шаблон, используемый по умолчанию для построения подвала {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/autocompletion/index/ автодополнения}.
 * 
 * @remark
 * Полезные ссылки:
 * * <a href="https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/aliases/_suggestPopup.less">переменные тем оформления</a>
 * 
 * @class Controls/suggestPopup:FooterTemplate
 * @author Герасимов А.М.
 * @see Controls/suggestPopup
 * @see Controls/interface/ISuggest#footerTemplate
 * @public
 * @example
 * Пример:
 * <pre>
 * <Controls.suggest:Input>
 *    <ws:footerTemplate templateName="Controls/suggestPopup:FooterTemplate">
 *       <ws:templateOptions>   
 *          <ws:showSelectorButtonTemplate>
 *             <span on:click="_showAllClick()">
 *                <span>Моя кнопка</span>
 *             </span>
 *          </ws:showSelectorButtonTemplate>
 *       </ws:templateOptions>
 *    </ws:footerTemplate>
 * </Controls.suggest:Input>
 * </pre>
 * @remark
 * Подробнее о работе с шаблоном читайте {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/autocompletion/index/ здесь}.
 */

/**
 * @name Controls/suggestPopup:FooterTemplate#showMoreButtonTemplate
 * @cfg {Function|String} Шаблон кнопки "Ещё".
 * @example 
 * <pre>
 * <ws:partial template="Controls/suggestPopup:FooterTemplate">
 *    <ws:showMoreButtonTemplate>
 *       <span on:click="_showAllClick()">
 *          <span>Моя кнопка</span>
 *       </span>
 *    </ws:showMoreButtonTemplate>
 * </ws:partial>
 * </pre>
 */

/**
 * @name Controls/suggestPopup:FooterTemplate#showSelectorButtonTemplate
 * @cfg {Function|String} Шаблон кнопки "Показать всё".
 * @example 
 * <pre>
 * <ws:partial template="Controls/suggestPopup:FooterTemplate">
 *    <ws:showSelectorButtonTemplate>
 *       <span on:click="_showAllClick()">
 *          <span>Моя кнопка</span>
 *       </span>
 *    </ws:showSelectorButtonTemplate>
 * </ws:partial>
 * </pre>
 */
export default interface IFooterTemplateOptions {
    showMoreButtonTemplate?: string;
    showSelectorButtonTemplate?: string;
 }
 