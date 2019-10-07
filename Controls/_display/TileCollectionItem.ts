import CollectionItem from './CollectionItem';
import { register } from 'Types/di';
import { TileCollection } from '../display';

export default class TileCollectionItem<T> extends CollectionItem<T> {
    protected _$owner: TileCollection<T>;

    getTileWidth(templateWidth: number): number {
        return templateWidth || this._$owner.getTileWidth();
    }

    getTileHeight(): number {
        return this._$owner.getTileHeight();
    }

    getCompressionCoefficient(): number {
        return this._$owner.getCompressionCoefficient();
    }
}

Object.assign(TileCollectionItem.prototype, {
    '[Controls/_display/TileCollectionItem]': true,
    _moduleName: 'Controls/display:TileCollectionItem',
    _instancePrefix: 'tile-item-'
});

register('Controls/display:TileCollectionItem', TileCollectionItem, {instantiate: false});
