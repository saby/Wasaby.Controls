import {DataSet, Memory, Query} from 'Types/source';
import {
    BackgroundStyle,
    CatalogDetailViewMode,
    IListConfiguration, ImageEffect,
    ImagePosition, ImageViewMode,
    ItemViewMode, TileSize
} from 'Controls/catalog';

export class DemoSource extends Memory {
    query(query?: Query): Promise<DataSet> {
        const templateConfig = getFolderConfig(query);

        return super
            .query(query)
            .then((result) => {
                const rawData = result.getRawData();
                rawData.meta.listConfiguration = templateConfig;
                result.setRawData(rawData);
                return result;
            });
    }
}

const LIST_CFG = {
    leaf: {
        countLines: '3',
        viewMode: ItemViewMode.description
    },
    list: {
        backgroundStyle: BackgroundStyle.gray
    },
    node: {
        viewMode: ItemViewMode.description
    },
    photo: {
        imagePosition: ImagePosition.left,
        viewMode: ImageViewMode.ellipse
    }
};

const TILE_CFG = {
    leaf: {
        countLines: '3',
        viewMode: ItemViewMode.description
    },
    node: {
        countLines: '5',
        viewMode: ItemViewMode.default
    },
    photoLeaf: {
        height: '50',
        effect: ImageEffect.default,
        viewMode: ImageViewMode.circle
    },
    photoNode: {
        height: '100',
        effect: ImageEffect.default,
        viewMode: ImageViewMode.circle
    },
    tile: {
        backgroundStyle: BackgroundStyle.gray,
        imagePosition: ImagePosition.top,
        size: TileSize.m
    }
};

const TABLE_CFG = {
    leaf: {
        countLines: '2',
        viewMode: ItemViewMode.default
    },
    photo: {
        viewMode: ImageViewMode.rectangle
    }
};

function getFolderConfig(query?: Query): IListConfiguration {
    const filter = query.getWhere() as any;
    const result = {
        settings: {
            access: 'global',
            accountViewMode: CatalogDetailViewMode.list,
            clientViewMode: CatalogDetailViewMode.list
        },
        list: LIST_CFG,
        tile: TILE_CFG,
        table: TABLE_CFG
    };

    if (filter.parent == null) {
        result.settings.clientViewMode = CatalogDetailViewMode.list;
        return result;
    }

    if (filter.parent === 1) {
        result.settings.clientViewMode = CatalogDetailViewMode.tile;
        return result;
    }
}
