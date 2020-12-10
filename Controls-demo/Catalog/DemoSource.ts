import {DataSet, Memory, Query} from 'Types/source';

export class DemoSource extends Memory {
    query(query?: Query): Promise<DataSet> {
        const templateConfig = getFolderConfig(query);

        return super
            .query(query)
            .then((result) => {
                const rawData = result.getRawData();
                rawData.meta.templateSettings = templateConfig;
                result.setRawData(rawData);
                return result;
            });
    }
}

const LIST_CFG = {
    leaf: {
        countLines: '6',
        viewMode: 'description'
    },
    list: {
        backgroundStyle: 'default'
    },
    node: {
        viewMode: 'default'
    },
    photo: {
        imagePosition: 'left',
        viewMode: 'rectangle'
    }
};

const TILE_CFG = {
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

function getFolderConfig(query?: Query): object {
    const filter = query.getWhere() as any;
    const result = {
        list: LIST_CFG,
        tile: TILE_CFG
    };

    if (filter.parent === null) {
        return {
            settings: {
                access: 'global',
                accountViewMode: 'list',
                clientViewMode: 'list'
            },
            list: LIST_CFG
        };
    }

    if (filter.parent === 1) {
        return {
            settings: {
                access: 'global',
                accountViewMode: 'tile',
                clientViewMode: 'tile'
            },
            tile: TILE_CFG
        };
    }
}
