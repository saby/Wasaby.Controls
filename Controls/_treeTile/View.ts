import { View as TileView } from 'Controls/tileNew';

export default class View extends TileView {
    protected _getModelConstructor(): string {
        return 'Controls/treeTile:TreeTileCollection';
    }
}
