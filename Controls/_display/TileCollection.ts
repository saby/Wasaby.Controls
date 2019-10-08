import Collection from './Collection';
import TileCollectionItem from './TileCollectionItem';

import { register } from 'Types/di';

const DEFAULT_TILE_HEIGHT = 200;
const DEFAULT_TILE_WIDTH = 250;
const DEFAULT_COMPRESSION_COEFF = 0.7;

export default class TileCollection<S, T extends TileCollectionItem<S> = TileCollectionItem<S>> extends Collection<S, T> {
    protected _$tileMode: string;

    protected _$tileHeight: number;

    protected _$imageProperty: string;

    protected _$tileScalingMode: string;

    getTileMode(): string {
        return this._$tileMode;
    }

    getTileHeight(): number {
        return this._$tileHeight;
    }

    getTileWidth(): number {
        return DEFAULT_TILE_WIDTH;
    }

    getImageProperty(): string {
        return this._$imageProperty;
    }

    getTileScalingMode(): string {
        return this._$tileScalingMode;
    }

    getCompressionCoefficient(): number {
        return DEFAULT_COMPRESSION_COEFF;
    }

    getShadowVisibility(): string {
        return 'visible';
    }
}

Object.assign(TileCollection.prototype, {
    '[Controls/_display/TileCollection]': true,
    _moduleName: 'Controls/display:TileCollection',
    _instancePrefix: 'tile-item-',
    _itemModule: 'Controls/display:TileCollectionItem',
    _$tileMode: 'static',
    _$tileHeight: DEFAULT_TILE_HEIGHT,
    _$imageProperty: '',
    _$tileScalingMode: 'none'
});

register('Controls/display:TileCollection', TileCollection, {instantiate: false});
