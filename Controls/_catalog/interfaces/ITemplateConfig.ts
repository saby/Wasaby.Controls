import {CatalogDetailViewMode} from 'Controls/_catalog/interfaces/ICatalogDetailOptions';

export interface ITemplateConfig {
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
