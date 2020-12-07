import {ICrud} from 'Types/source';
import {ICatalogColumnOptions} from 'Controls/_catalog/interfaces/ICatalogColumnOptions';

/**
 * Интерфейс описывает структуру настроек master-колонки компонента {@link Controls/_catalog/View|Control.catalog:View}
 * @interface Controls/_catalog/interfaces/ICatalogMasterOptions
 * @public
 * @author Уфимцев Д.Ю.
 */
export interface ICatalogMasterOptions extends ICatalogColumnOptions {
    /**
     * Регулирует видимость master-колонки
     * @default 'visible'
     */
    visibility?: 'visible' | 'hidden';

    /**
     * Источник данных, который будет использован списочным представлением внутри master-колонки.
     * Если не задан, то будет использован источник данных, который указан в основной конфигурации
     * {@link Controls/_catalog/View/ICatalogOptions#listSource|listSource}
     * @see {@link Controls/_catalog/View/ICatalogOptions#listSource|ICatalogOptions#listSource}
     */
    listSource?: ICrud;
}
