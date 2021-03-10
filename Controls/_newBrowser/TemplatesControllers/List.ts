import ITemplateControllerOptions from '../interfaces/ITemplateControllerOptions';

export default class ListItemTemplateConfig {
    private _viewConfiguration: ITemplateControllerOptions['viewConfiguration']['list'] = null;

    constructor(options: ITemplateControllerOptions) {
        this._viewConfiguration = options.viewConfiguration.list;
    }

    getDescriptionLines(itemData: any): number {
        const config = itemData.isNode() ? this._viewConfiguration.node : this._viewConfiguration.leaf;
        return config.descriptionLines;
    }

    getImagePosition(): string {
        return this._viewConfiguration.list.imagePosition;
    }

    getImageViewMode(): string {
        return this._viewConfiguration.list.imageViewMode;
    }
}
