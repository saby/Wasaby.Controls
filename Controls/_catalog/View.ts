import {Logger} from 'UI/Utils';
import {SyntheticEvent} from 'UI/Vdom';
import {RecordSet} from 'Types/collection';
import {Control, TemplateFunction} from 'UI/Base';
import {ICrudPlus, QueryWhereExpression} from 'Types/source';
import {ICatalogOptions} from 'Controls/_catalog/interfaces/ICatalogOptions';
import {IListConfiguration} from 'Controls/_catalog/interfaces/IListConfiguration';
import {CatalogDetailViewMode} from 'Controls/_catalog/interfaces/ICatalogDetailOptions';
import {NewSourceController as SourceController, ISourceControllerOptions} from 'Controls/dataSource';
import * as ViewTemplate from 'wml!Controls/_catalog/View';

/**
 * Компонент реализует стандартную раскладку двухколоночного реестра с master и detail колонками.
 *
 * При получении списка записей для detail-колонки из метаданных ответа вычитывает поле
 * 'listConfiguration', в котором ожидается объект реализующий интерфейст {@link IListConfiguration},
 * и применяет полученную конфиругицию к списку.
 *
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
    private _basePropStorageId: string;

    /**
     * Enum со списком доступных вариантов отображения контента в detail-колонке
     */
    protected _viewModeEnum: typeof CatalogDetailViewMode = CatalogDetailViewMode;

    /**
     * Текущий режим отображения списка в detail-колонке
     */
    protected get _currentViewMode(): CatalogDetailViewMode {
        return this._detailViewMode;
    }
    protected set _currentViewMode(value: CatalogDetailViewMode) {
        const changed = this._detailViewMode !== value;

        if (!changed) {
            return;
        }

        this._detailViewMode = value;
        // Уведомляем о том, что изменился режим отображения списка в detail-колонке
        this._notify('viewModeChanged', [value]);
    }
    private _detailViewMode: CatalogDetailViewMode;

    //region source
    protected _masterSource: ICrudPlus;

    protected _masterKeyProperty: string;

    protected _masterSourceController: SourceController;

    protected _detailSource: ICrudPlus;

    protected _detailKeyProperty: string;

    protected _detailSourceController: SourceController;
    //endregion

    /**
     * Идентификатор записи, выбранной в мастер списке
     */
    protected _masterMarkedKey: string = null;

    /**
     * Опции для списка в master-колонке
     */
    protected _masterTreeOptions: unknown;

    /**
     * Опции для списочного представления списка в detail-колонке
     */
    protected _detailListOptions: unknown;

    /**
     * Опции для табличного представления списка в detail-колонке
     */
    protected _detailTreeOptions: unknown;
    //endregion

    // region life circle hooks
    protected _beforeMount(
        options?: ICatalogOptions,
        contexts?: object,
        receivedState?: [RecordSet, RecordSet]
    ): Promise<[RecordSet, RecordSet]> | void {
        this.updateState(options);

        if (receivedState) {
            this._masterSourceController.setItems(receivedState[0]);
            this._detailSourceController.setItems(receivedState[1]);
        } else {
            const masterDataPromise = this._masterSourceController.load() as Promise<RecordSet>;
            const detailDataPromise = this.loadDetail(options);

            return Promise.all([
                masterDataPromise,
                detailDataPromise
            ]);
        }
    }

    protected _beforeUpdate(newOptions?: ICatalogOptions, contexts?: unknown): void {
        this.updateState(newOptions);
    }
    //endregion

    /**
     * Обновляет текущее состояние контрола в соответствии с переданными опциями
     */
    private updateState(options: ICatalogOptions = this._options): void {
        View.validateOptions(options);

        // Если передан кастомный идентификатор хранилища, то на основании него собираем
        // базовую часть нашего идентификатора для того, что бы в дальнейшем использовать
        // её для генерации ключей в которых будем хранить свои настройки
        if (typeof options.propStorageId === 'string') {
            this._basePropStorageId = `Controls/catalog:View_${options.propStorageId}_`;
        }

        // Присваиваем во внутреннюю переменную, т.к. в данном случае не надо генерить событие
        // об изменении значения, т.к. и так идет синхронизация опций
        this._detailViewMode = options.viewMode;

        //region update master fields
        this._masterSource = options.master?.listSource || options.listSource;
        this._masterKeyProperty = options.master?.keyProperty || options.keyProperty;

        // Если еще не создавался SourceController для master-колонки, то создадим
        if (!this._masterSourceController) {
            this._masterSourceController = new SourceController(
                this.buildScrollControllerOptions('master', options)
            );
        }

        // На основании полученного состояния соберем опции для master-списка
        this._masterTreeOptions = this.buildMasterTreeOption(options);
        //endregion

        //region update detail fields
        this._detailSource = options.detail?.listSource || options.listSource;
        this._detailKeyProperty = options.detail?.keyProperty || options.keyProperty;

        // Если еще не создавался SourceController для detail-колонки, то создадим
        if (!this._detailSourceController) {
            this._detailSourceController = new SourceController(
                this.buildScrollControllerOptions('detail', options)
            );
        }

        // На основании полученного состояния соберем опции для detail-списков
        this._detailTreeOptions = this.buildDetailTreeOption(options);
        this._detailListOptions = this.buildDetailListOption(options);
        //endregion
    }

    protected setMasterMarkedKey(e: SyntheticEvent, value: string): void {
        this._masterMarkedKey = value;
        this.loadDetail().then();
    }

    private loadDetail(options: ICatalogOptions = this._options): Promise<RecordSet> {
        return this._detailSourceController
            .load(
                undefined,
                undefined,
                this.buildDetailFilter(options)
            )
            .then((items: RecordSet) => {
                const listCfg = items.getMetaData().listConfiguration;
                this.applyListConfiguration(listCfg);

                return items;
            })
            .catch((error) => {
                // TODO: processing error
                return error;
            });
    }

    private buildDetailFilter(options: ICatalogOptions = this._options): QueryWhereExpression<unknown> {
        const filter = this._detailSourceController.getFilter();

        if (options.detail?.parentProperty) {
            filter[options.detail.parentProperty] = this._masterMarkedKey;
        }

        return filter;
    }

    private applyListConfiguration(cfg: IListConfiguration): void {
        if (!cfg) {
            return;
        }

        this._currentViewMode = cfg.settings.clientViewMode;
    }

    /**
     * На основании текущего состояния и переданных параметров собирает опции для
     * создания SourceController для master- или detail-колонки.
     */
    private buildScrollControllerOptions(
        target: 'master' | 'detail',
        options: ICatalogOptions
    ): ISourceControllerOptions {
        const master = target === 'master';
        const ops = master ? options.master : options.detail;

        return {
            filter: ops?.filter,
            nodeProperty: ops?.nodeProperty,
            parentProperty: ops?.parentProperty,
            source: master ? this._masterSource : this._detailSource,
            keyProperty: master ? this._masterKeyProperty : this._detailKeyProperty
        };
    }

    //region build lists options
    /**
     * По переданным опциям собирает конфигурацию для Controls/treeGrid:View,
     * расположенном в master-колонке.
     */
    private buildMasterTreeOption(options: ICatalogOptions = this._options): unknown {
        const defaultCfg = {
            style: 'master',
            backgroundStyle: 'master',
            expanderVisibility: undefined,
            hasChildrenProperty: undefined,
            keyProperty: this._masterKeyProperty,
            nodeProperty: options.master?.nodeProperty,
            parentProperty: options.master?.parentProperty,
            sourceController: this._masterSourceController,
            // Так же задаем source, т.к. без него подает ошибка при попытке раскрытия узлов
            // а список всеравно в первую очередь смотрит на sourceController
            source: this._masterSource
        };

        if (options.master?.hasChildrenProperty) {
            defaultCfg.expanderVisibility = 'hasChildren';
            defaultCfg.hasChildrenProperty = options.master.hasChildrenProperty;
        }

        return {...defaultCfg, ...options.master.treeGridView};
    }

    /**
     * По переданным опциям собирает конфигурацию для Controls/list:View,
     * расположенном в detail-колонке.
     */
    private buildDetailListOption(options: ICatalogOptions = this._options): unknown {
        const defaultCfg = this.getDefaultDetailListOptions();

        return {...defaultCfg, ...options.detail.list};
    }

    /**
     * По переданным опциям собирает конфигурацию для Controls/treeGrid:View,
     * расположенном в detail-колонке.
     */
    private buildDetailTreeOption(options: ICatalogOptions = this._options): unknown {
        const defaultCfg = {
            ...this.getDefaultDetailListOptions(),
            nodeProperty: options.detail?.nodeProperty,
            parentProperty: options.detail?.parentProperty
        };

        return {...defaultCfg, ...options.detail.table};
    }

    private getDefaultDetailListOptions(): object {
        return {
            // Так же задаем source, т.к. без него подает ошибка при попытке раскрытия узлов
            // а список всеравно в первую очередь смотрит на sourceController
            source: this._detailSource,
            keyProperty: this._detailKeyProperty,
            sourceController: this._detailSourceController
        };
    }
    //endregion

    //region static utils
    static _theme: string[] = ['Controls/catalog'];

    static getDefaultOptions(): ICatalogOptions {
        return {
            viewMode: CatalogDetailViewMode.list,
            master: {
                visibility: 'hidden'
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

/**
 * @event Событие об изменении режима отображения списка в detail-колонке
 * @name Controls/catalog:View#viewModeChanged
 * @param {CatalogDetailViewMode} viewMode Текущий режим отображения списка
 */
