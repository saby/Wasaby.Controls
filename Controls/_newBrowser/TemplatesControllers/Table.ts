import ITemplateControllerOptions from '../interfaces/ITemplateControllerOptions';

export default class ListItemTemplateConfig {
    private _viewConfiguration: ITemplateControllerOptions['viewConfiguration']['table'] = null;

    constructor(options: ITemplateControllerOptions) {
        this._viewConfiguration = options.viewConfiguration.table;
    }

    getDescriptionLines(): number {
        return this._viewConfiguration.leaf.descriptionLines;
    }

    getImageViewMode(): string {
        return this._viewConfiguration.leaf.imageViewMode;
    }
}
