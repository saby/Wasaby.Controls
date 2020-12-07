import {ICrud} from 'Types/source';
import {Control, TemplateFunction} from 'UI/Base';
import {ICatalogOptions} from 'Controls/_catalog/interfaces/ICatalogOptions';
import * as ViewTemplate from 'wml!Controls/_catalog/View';

/**
 * Компонент реализует стандартную раскладку двухколоночного реестра с master и detail колонками
 * @class Controls/_catalog/View
 * @extends Core/Control
 * @public
 * @author Уфимцев Д.Ю.
 */
export default class View extends Control<ICatalogOptions> {

    //region fields
    protected _template: TemplateFunction = ViewTemplate;

    /**
     * Источник данных для списка, расположенного внутри master-колонки
     */
    protected _masterSource: ICrud;

    /**
     * Источник данных для списка, расположенного внутри detail-колонки
     */
    protected _detailSource: ICrud;
    //endregion

    // region life circle hooks
    protected _beforeMount(options?: ICatalogOptions, contexts?: object, receivedState?: void): Promise<void> | void {
        this.updateState();

        return super._beforeMount(options, contexts, receivedState);
    }

    protected _beforeUpdate(options?: ICatalogOptions, contexts?: any): void {
        this.updateState(options);
    }
    //endregion

    private updateState(options: ICatalogOptions = this._options): void {
        this._masterSource = options.master?.listSource || options.listSource;
        this._detailSource = options.detail?.listSource || options.listSource;
    }

    static getDefaultOptions(): object {
        return {};
    }

}
