/**
 * Интерфейс для футера в дополнительном меню {@link Controls/toolbars:View тулбара}.
 *
 * @interface Controls/_dropdown/interface/IFooterTemplate
 * @public
 * @author Бондарь А.В.
 */

export default interface IFooterTemplate {
    readonly '[Controls/_toolbars/interfaces/IFooterTemplate]': boolean;
}

/**
 * @name Controls/_toolbars/interfaces/IFooterTemplate#footerTemplate
 * @cfg {Function | String} Шаблон футера дополнительного меню тулбара.
 */

export interface IFooterTemplateOptions {
    footerTemplate?: String | Function;
}
