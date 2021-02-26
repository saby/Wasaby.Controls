import View from 'Controls/_treeTile/View';
import TreeTileCollection from 'Controls/_treeTile/display/TreeTileCollection';
import TreeTileCollectionItem from 'Controls/_treeTile/display/TreeTileCollectionItem';
import {register} from 'Types/di';
import * as FolderTemplate from 'wml!Controls/_treeTile/render/Folder';

export {
    View,
    FolderTemplate
};

register('Controls/treeTile:TreeTileCollection', TreeTileCollection, {instantiate: false});
register('Controls/treeTile:TreeTileCollectionItem', TreeTileCollectionItem, {instantiate: false});
