import {Logger} from 'UI/Utils';
import {ICrud} from 'Types/source';
import {Control, TemplateFunction} from 'UI/Base';
import {ICatalogOptions} from 'Controls/_catalog/interfaces/ICatalogOptions';
import {CatalogDetailViewMode} from 'Controls/_catalog/interfaces/ICatalogDetailOptions';
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
    /**
     * Шаблон отображения компонента
     */
    protected _template: TemplateFunction = ViewTemplate;

    /**
     * Enum со списком доступных вариантов отображения контента в detail-колонке
     */
    protected _viewModeEnum: typeof CatalogDetailViewMode = CatalogDetailViewMode;

    //region source fields
    /**
     * Источник данных для списка, расположенного внутри master-колонки
     */
    protected _masterSource: ICrud;

    /**
     * Имя свойства, содержащего информацию об идентификаторе текущей строки списка колонки master.
     */
    protected _masterKeyProperty: string;

    /**
     * Источник данных для списка, расположенного внутри detail-колонки
     */
    protected _detailSource: ICrud;

    /**
     * Имя свойства, содержащего информацию об идентификаторе текущей строки списка колонки detail.
     */
    protected _detailKeyProperty: string;
    //endregion
    //endregion

    // region life circle hooks
    protected _beforeMount(options?: ICatalogOptions, contexts?: object, receivedState?: void): Promise<void> | void {
        this.updateState(options);
    }

    protected _beforeUpdate(options?: ICatalogOptions, contexts?: any): void {
        this.updateState(options);
    }
    //endregion

    /**
     * Обновляет текущее состояние контрола в соответствии с переданными опциями
     */
    private updateState(options: ICatalogOptions = this._options): void {
        View.validateOptions(options);

        this._masterSource = options.master?.listSource || options.listSource;
        this._masterKeyProperty = options.master?.keyProperty || options.keyProperty;

        this._detailSource = options.detail.listSource || options.listSource;
        this._detailKeyProperty = options.detail.keyProperty || options.keyProperty;
    }

    //region static utils
    static _theme: string[] = ['Controls/catalog'];

    static getDefaultOptions(): ICatalogOptions {
        return {
            master: {
                visibility: 'hidden'
            },
            detail: {
                viewMode: CatalogDetailViewMode.list
            }
        };
    }

    static validateOptions(options: ICatalogOptions): void {
        // Если базовый источник данных не задан, то проверим
        // заданы ли источники данных для master и detail колонок
        if (!options.listSource) {
            if (options.master && !options.master.listSource) {
                Logger.error(
                    'Controls/catalog:View: Не задан источник данных для master-колонки. ' +
                    'Необходимо указать либо базовый источник данных в опции listSource либо источник данных ' +
                    'для master-колонки в опции master.listSource.'
                );
            }

            if (options.detail && !options.detail.listSource) {
                Logger.error(
                    'Controls/catalog:View: Не задан источник данных для detail-колонки. ' +
                    'Необходимо указать либо базовый источник данных в опции listSource либо источник данных ' +
                    'для detail-колонки в опции detail.listSource.'
                );
            }
        }

        // Если базовый keyProperty не задан, то проверим
        // задан ли он для master и detail колонок
        if (!options.keyProperty) {
            if (options.master && !options.master.keyProperty) {
                Logger.error(
                    'Controls/catalog:View: Не задано keyProperty для master-колонки. ' +
                    'Необходимо указать либо базовый keyProperty в опции keyProperty либо keyProperty ' +
                    'для master-колонки в опции master.keyProperty.'
                );
            }

            if (options.detail && !options.detail.keyProperty) {
                Logger.error(
                    'Controls/catalog:View: Не задано keyProperty для detail-колонки. ' +
                    'Необходимо указать либо базовый keyProperty в опции keyProperty либо keyProperty ' +
                    'для detail-колонки в опции detail.keyProperty.'
                );
            }
        }
    }
    //endregion

}
