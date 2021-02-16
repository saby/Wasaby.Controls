import {Control, TemplateFunction, IControlOptions} from 'UI/Base';
import * as template from 'wml!Controls/_breadcrumbs/Container';
import {ContextOptions as DataOptions} from 'Controls/context';
import calculatePath from 'Controls/_dataSource/calculatePath';
import {ISourceControllerState} from 'Controls/dataSource';
import {SyntheticEvent} from 'Vdom/Vdom';
import {Model} from 'Types/entity';

interface IDataContext {
    dataOptions: ISourceControllerState;
}

export default class BreadCrumbsContainer extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _dataOptions: ISourceControllerState = null;
    protected _items;

    protected _beforeMount(options: IControlOptions, context: IDataContext): void {
        this._dataOptions = context.dataOptions;
        this._setPathItems(options);
    }

    protected _beforeUpdate(options: IControlOptions, context: IDataContext): void {
        this._dataOptions = context.dataOptions;
        this._setPathItems(options);
    }

    protected _itemClickHandler(e: SyntheticEvent, item: Model): void {
        const sourceController = this._dataOptions.sourceController || this._options.sourceController;
        if (sourceController) {
            sourceController.setRoot(item.getKey());
            sourceController.reload();
        }
    }

    private _setPathItems(options): void {
        const sourceController = this._dataOptions.sourceController || options.sourceController;
        if (sourceController) {
            this._items = calculatePath(sourceController.getItems()).path;
        }
    }

    static contextTypes(): IDataContext {
        return {
            dataOptions: DataOptions
        };
    }
}