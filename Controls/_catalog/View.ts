import {Logger} from 'UI/Utils';
import {Control, TemplateFunction} from 'UI/Base';
import {ICatalogOptions} from 'Controls/_catalog/interfaces/ICatalogOptions';
import {CatalogDetailViewMode} from 'Controls/_catalog/interfaces/ICatalogDetailOptions';
import * as ViewTemplate from 'wml!Controls/_catalog/View';

/**
 * Компонент реализует стандартную раскладку двухколоночного реестра с master и detail колонками
 * @class Controls/catalog:View
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
     * Базовая часть уникального идентификатора контрола, по которому хранится конфигурация в хранилище данных.
     */
    protected _propStorageId: string;

    /**
     * Enum со списком доступных вариантов отображения контента в detail-колонке
     */
    protected _viewModeEnum: typeof CatalogDetailViewMode = CatalogDetailViewMode;

    /**
     * Опции для списка в master-колонке
     */
    protected _masterTreeOptions: unknown;

    /**
     * Опции для табличного представления списка в detail-колонке
     */
    protected _detailTreeOptions: unknown;
    //endregion

    // region life circle hooks
    protected _beforeMount(options?: ICatalogOptions, contexts?: object, receivedState?: void): Promise<void> | void {
        this.updateState(options);
    }

    protected _beforeUpdate(options?: ICatalogOptions, contexts?: unknown): void {
        this.updateState(options);
    }
    //endregion

    /**
     * Обновляет текущее состояние контрола в соответствии с переданными опциями
     */
    private updateState(options: ICatalogOptions = this._options): void {
        View.validateOptions(options);

        this._masterTreeOptions = this.buildMasterTreeOption(options);
        this._detailTreeOptions = this.buildDetailTreeOption(options);

        // Если передан кастомный идентификатор хранилища, то на основании него собираем
        // базовую часть нашего идентификатора для того, что бы в дальнейшем использовать
        // её для генерации ключей в которых будем хранить свои настройки
        if (typeof options.propStorageId === 'string') {
            this._propStorageId = `Controls/catalog:View_${options.propStorageId}_`;
        }
    }

    /**
     * По переданным опциям собирает конфигурацию для Controls/treeGrid:View, расположенном в master-колонке.
     */
    private buildMasterTreeOption(options: ICatalogOptions = this._options): unknown {
        const defaultCfg = {
            style: 'master',
            backgroundStyle: 'master',
            source: options.master?.listSource || options.listSource,
            keyProperty: options.master?.keyProperty || options.keyProperty
        };

        return {...defaultCfg, ...options.master.treeGridView};
    }

    /**
     * По переданным опциям собирает конфигурацию для Controls/treeGrid:View, расположенном в detail-колонке.
     */
    private buildDetailTreeOption(options: ICatalogOptions = this._options): unknown {
        const defaultCfg = {
            source: options.detail?.listSource || options.listSource,
            keyProperty: options.detail?.keyProperty || options.keyProperty
        };

        return {...defaultCfg, ...options.detail.table};
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
