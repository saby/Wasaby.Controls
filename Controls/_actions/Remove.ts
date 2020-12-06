import IAction, {IActionOptions} from 'Controls/_actions/interface/IAction';
import {RemoveController} from 'Controls/list';

/**
 * Действие "удаление записи"
 * @class Controls/_actions/Remove
 * @implements Controls/_actions/interface/IAction
 * @public
 * @author Крайнов Д.О.
 */
export default class Remove implements IAction<IActionOptions> {
    private _removeController: RemoveController;
    private _options: IActionOptions;

    constructor(options: IActionOptions) {
        this._options = options;
        this._removeController = new RemoveController({
            source: this._options.source
        });
    }

    execute(): Promise<'fullReload'> {
        return this._removeController.remove(this._options.selection, this._options.filter).then(() => 'fullReload');
    }
}
