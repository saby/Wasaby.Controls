import ITemplateControllerOptions from '../interfaces/ITemplateControllerOptions';
import {ITileConfig} from '../interfaces/IBrowserViewConfig'

export default class TileItemTemplateConfig {
    private _viewConfiguration: ITemplateControllerOptions['viewConfiguration']['tile'] = null;

    constructor(options: ITemplateControllerOptions) {
        this._viewConfiguration = options.viewConfiguration.tile;
    }

    private _getConfigByItemData(itemData: any): ITileConfig['node'] | ITileConfig['leaf'] {
        return itemData.isNode() ? this._viewConfiguration.node : this._viewConfiguration.leaf;
    }

    getDescriptionLines(itemData: any): number {
        return this._getConfigByItemData(itemData).descriptionLines;
    }

    getImagePosition(): string {
        return this._viewConfiguration.tile.imagePosition;
    }

    getImageViewMode(itemData: any): string {
        return this._getConfigByItemData(itemData).imageViewMode;
    }

    getImageProportion(itemData: any): string {
        return this._getConfigByItemData(itemData).imageProportion;
    }

    getImageGradient(itemData: any): string {
        return this._getConfigByItemData(itemData).imageGradient;
    }
}
