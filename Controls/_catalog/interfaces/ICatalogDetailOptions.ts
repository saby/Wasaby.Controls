import {ICrud} from 'Types/source';
import {ICatalogColumnOptions} from 'Controls/_catalog/interfaces/ICatalogColumnOptions';

/**
 * Enum со списком доступных вариантов отображения контента в detail-колонке
 */
export enum CatalogDetailViewMode {
    list = 'list',
    tile = 'tile',
    table = 'table'
}

/**
 * Интерфейс описывает структуру настроек detail-колонки компонента {@link Controls/_catalog/View|Control/catalog:View}
 * @interface Controls/_catalog/interfaces/ICatalogDetailOptions
 * @public
 * @author Уфимцев Д.Ю.
 */
export interface ICatalogDetailOptions extends ICatalogColumnOptions {
    /**
     * Источник данных, который будет использован списочным представлением внутри detail-колонки.
     * Если не задан, то будет использован источник данных, который указан в основной конфигурации
     * {@link Controls/_catalog/View/ICatalogOptions#listSource|listSource}
     *
     * @see {@link Controls/_catalog/View/ICatalogOptions#listSource|ICatalogOptions#listSource}
     */
    listSource?: ICrud;

    /**
     * Режим отображения списка
     * @default CatalogDetailViewMode.list
     */
    viewMode: CatalogDetailViewMode;
}
