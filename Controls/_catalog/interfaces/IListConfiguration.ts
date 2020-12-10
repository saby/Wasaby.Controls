import {CatalogDetailViewMode} from 'Controls/_catalog/interfaces/ICatalogDetailOptions';

/**
 * Интерфейс описывает структуру конфигурации списка в detail-колонки
 * @interface Controls/catalog:IListConfiguration
 * @public
 * @author Уфимцев Д.Ю.
 */
export interface IListConfiguration {
    settings: {
        access: 'global',
        accountViewMode: CatalogDetailViewMode,
        clientViewMode: CatalogDetailViewMode
    };
    tile: {
        leaf: {
            countLines: '3',
            viewMode: 'description'
        },
        node: {
            countLines: '5',
            viewMode: 'default'
        },
        photoLeaf: {
            effect: 'default',
            height: '50',
            viewMode: 'circle'
        },
        photoNode: {
            effect: 'default',
            height: '100',
            viewMode: 'circle'
        },
        tile: {
            backgroundStyle: 'gray',
            imagePosition: 'top',
            size: 'm'
        }
    };
}
