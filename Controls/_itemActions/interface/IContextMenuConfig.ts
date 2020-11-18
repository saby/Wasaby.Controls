import {TemplateFunction} from 'UI/Base';
import {RecordSet} from 'Types/collection';

/**
 * Интерфейс конфигурации для меню опции записи.
 * @remark
 * Набор опций передается объектом. Заданный объект мержится с минимальным объектом опций, отдаваемых в меню по-умолчанию.
 * @interface Controls/_itemActions/interface/IContextMenuConfig
 * @public
 * @author Аверкиев П.А.
 */
/*ENG
 * Context menu configuration interface
 * @interface Controls/_itemActions/interface/IContextMenuConfig
 * @default true
 * @public
 * @author Аверкиев П.А.
 */
export interface IContextMenuConfig {
    /**
     * @name Controls/_itemActions/interface/IContextMenuConfig#items
     * @cfg {Types/collection:RecordSet} Набор элементов для замены в контекстном меню.
     */
    items?: RecordSet;
    /**
     * @name Controls/_itemActions/interface/IContextMenuConfig#groupTemplate
     * @cfg {UI/Base:TemplateFunction|string} Шаблон для установки группировки.
     */
    groupTemplate?: TemplateFunction|string;
    /**
     * @name Controls/_itemActions/interface/IContextMenuConfig#groupProperty
     * @cfg {string} Свойство записи для установки группировки.
     */
    groupProperty?: string;
    /**
     * @name Controls/_itemActions/interface/IContextMenuConfig#itemTemplate
     * @cfg {UI/Base:TemplateFunction|string} Шаблон элемента меню.
     */
    itemTemplate?: TemplateFunction|string;
    /**
     * @name Controls/_itemActions/interface/IContextMenuConfig#footerTemplate
     * @cfg {UI/Base:TemplateFunction|string} Шаблон футера.
     */
    footerTemplate?: TemplateFunction|string;
    /**
     * @name Controls/_itemActions/interface/IContextMenuConfig#headerTemplate
     * @cfg {UI/Base:TemplateFunction|string} Шаблон шапки.
     */
    headerTemplate?: TemplateFunction|string;
    /**
     * @name Controls/_itemActions/interface/IContextMenuConfig#iconSize
     * @cfg {string} Размер иконок в выпадающем меню.
     */
    iconSize?: string;
}
