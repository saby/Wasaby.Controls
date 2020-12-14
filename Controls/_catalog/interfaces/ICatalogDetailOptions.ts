import {ICrudPlus} from 'Types/source';
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
 * Интерфейс описывает структуру настроек detail-колонки компонента {@link Controls/catalog:View}
 * @interface Controls/catalog:ICatalogDetailOptions
 * @public
 * @author Уфимцев Д.Ю.
 */
export interface ICatalogDetailOptions extends ICatalogColumnOptions {
    //region source options
    /**
     * Источник данных, который будет использован списочным представлением внутри detail-колонки.
     * Если не задан, то будет использован источник данных, который указан в основной конфигурации
     * {@link ICatalogOptions.listSource}
     *
     * @see ICatalogOptions.listSource
     */
    listSource?: ICrudPlus;

    /**
     * Имя свойства записи detail-списка, содержащего информацию о её идентификаторе.
     */
    keyProperty?: string;
    //endregion

    //region display options
    /**
     * Опции для компонента {@link Controls/list:View}, который отображается
     * в detail-колонке в режиме {@link CatalogDetailViewMode.list}
     *
     * Данные опции перекрывают опции, вычисленные на основании конфигурации
     * {@link ICatalogOptions.detail|detail-колонки}
     *
     * @see viewMode
     */
    list?: object;

    /**
     * Опции для компонента {@link Controls/treeGrid:View}, который отображается
     * в detail-колонке в режиме {@link CatalogDetailViewMode.table}
     *
     * Данные опции перекрывают опции, вычисленные на основании конфигурации
     * {@link ICatalogOptions.detail|detail-колонки}
     *
     * @see viewMode
     */
    table?: object;
    //endregion

    nodeProperty?: string;

    parentProperty?: string;

    filter?: {[key: string]: unknown};
}
