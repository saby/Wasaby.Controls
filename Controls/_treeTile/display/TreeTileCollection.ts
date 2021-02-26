import {Model} from 'Types/entity';
import { mixin } from 'Types/util';
import {TileMixin} from 'Controls/tileNew';
import TreeTileCollectionItem from './TreeTileCollectionItem';
import {ItemsFactory, Tree} from 'Controls/display';
import {IOptions} from "Controls/_tileNew/display/mixins/TileItem";

export default class TreeTileCollection<
    S extends Model = Model,
    T extends TreeTileCollectionItem = TreeTileCollectionItem
> extends mixin<Tree, TileMixin>(Tree, TileMixin) {
    protected _$nodesHeight: number;

    protected _$folderWidth: number;

    getNodesHeight(): number {
        return this._$nodesHeight;
    }

    setNodesHeight(nodesHeight: number): void {
        if (this._$nodesHeight !== nodesHeight) {
            this._$nodesHeight = nodesHeight;
            this._updateItemsNodesHeight(nodesHeight);
            this._nextVersion();
        }
    }

    protected _updateItemsNodesHeight(nodesHeight: number): void {
        this.getViewIterator().each((item: TreeTileCollectionItem<S>) => {
            if (item.setNodesHeight) {
                item.setNodesHeight(nodesHeight);
            }
        });
    }

    getFolderWidth(): number {
        return this._$folderWidth;
    }

    setFolderWidth(folderWidth: number): void {
        if (this._$folderWidth !== folderWidth) {
            this._$folderWidth = folderWidth;
            this._updateItemsFolderWidth(folderWidth);
            this._nextVersion();
        }
    }

    protected _updateItemsFolderWidth(folderWidth: number): void {
        this.getViewIterator().each((item: TreeTileCollectionItem<S>) => {
            if (item.setFolderWidth) {
                item.setFolderWidth(folderWidth);
            }
        });
    }

    protected _getItemsFactory(): ItemsFactory<T> {
        const parent = super._getItemsFactory();

        return function TileItemsFactory(options: IOptions<S>): T {
            const params = this._getItemsFactoryParams(options);
            return parent.call(this, params);
        };
    }

    protected _getItemsFactoryParams(params: any): any {
        super._getItemsFactoryParams(params);

        params.nodesHeight = this.getNodesHeight();
        return params;
    }
}

Object.assign(TreeTileCollection.prototype, {
    '[Controls/_treeTile/TreeTileCollection]': true,
    _moduleName: 'Controls/treeTile:TreeTileCollection',
    _itemModule: 'Controls/treeTile:TreeTileCollectionItem',
    _$nodesHeight: null,
    _$folderWidth: null
});
