import {Logger} from 'UI/Utils';
import {RecordSet} from 'Types/collection';
import {ContextOptions} from 'Controls/context';
import {Control, TemplateFunction} from 'UI/Base';
import {ICrudPlus, QueryWhereExpression} from 'Types/source';
import {ICatalogOptions} from 'Controls/_catalog/interfaces/ICatalogOptions';
import {IListConfiguration} from 'Controls/_catalog/interfaces/IListConfiguration';
import {IImageItemTemplateCfg} from 'Controls/_catalog/interfaces/IImageItemTemplateCfg';
import {CatalogDetailViewMode} from 'Controls/_catalog/interfaces/ICatalogDetailOptions';
import {ISourceControllerOptions, NewSourceController as SourceController} from 'Controls/dataSource';
// tslint:disable-next-line:ban-ts-ignore
// @ts-ignore
import * as ViewTemplate from 'wml!Controls/_catalog/View';
import {IControllerState} from 'Controls/_dataSource/Controller';

interface IReceivedState {
    masterItems: RecordSet;
    detailItems: RecordSet;
}

/**
 * Из метаданных RecordSet возвращает конфигурацию отображения списка
 * в detail-колонке
 */
function getListConfiguration(items: RecordSet): IListConfiguration {
    return items.getMetaData().listConfiguration;
}

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
export default class View extends Control<ICatalogOptions, IReceivedState> {

    //region fields
    /**
     * Шаблон отображения компонента
     */
    protected _template: TemplateFunction = ViewTemplate;

    /**
     * Базовая часть уникального идентификатора контрола, по которому хранится конфигурация в хранилище данных.
     */
    private _basePropStorageId: string;

    private _dataOptionsContext: typeof ContextOptions;

    /**
     * Enum со списком доступных вариантов отображения контента в detail-колонке
     */
    protected _viewModeEnum: typeof CatalogDetailViewMode = CatalogDetailViewMode;

    /**
     * Текущий режим отображения списка в detail-колонке
     */
    protected get _currentViewMode(): CatalogDetailViewMode {
        return this._permanentlyDetailViewMode || this._defaultDetailViewMode;
    }
    protected set _currentViewMode(value: CatalogDetailViewMode) {
        if (this._defaultDetailViewMode === value) {
            return;
        }

        this._defaultDetailViewMode = value;
        // Уведомляем о том, что изменился режим отображения списка в detail-колонке
        this._notify('viewModeChanged', [value]);
    }
    private _defaultDetailViewMode: CatalogDetailViewMode;
    private _permanentlyDetailViewMode: CatalogDetailViewMode;

    /**
     * Идентификатор папки содержимое которой в данный момент отображается
     */
    protected get _root(): string {
        return this._masterMarkedKey;
    }
    protected set _root(value: string) {
        if (this._masterMarkedKey === value) {
            return;
        }

        this._masterMarkedKey = value;
        // Уведомляем о том, что изменилась корневая папка
        this._notify('rootChanged', [value]);

        this._detailSourceController.setRoot(value);
        // Загрузим содержимое папки в detail-колонку
        this.loadDetailData().then();
    }
    private _masterMarkedKey: string = null;

    //region source
    protected _masterSource: ICrudPlus;

    protected _masterKeyProperty: string;

    protected _masterSourceController: SourceController;

    protected _detailSource: ICrudPlus;

    protected _detailKeyProperty: string;

    protected _detailSourceController: SourceController;
    //endregion

    //region item templates options
    /**
     * Шаблон отображения итема плоского списка
     */
    protected _listItemTemplate: TemplateFunction | string;

    /**
     * Шаблон отображения итема плитки
     */
    protected _tileItemTemplate: TemplateFunction | string;

    /**
     * Текущая конфигурация списков, полученная из метаданных последнего запроса
     * к данным для detail-колонки. Заполняется в {@link applyListConfiguration}
     */
    protected _listConfiguration: IListConfiguration;

    /**
     * Настройки отображения картники
     */
    protected _imageItemTemplateCfg: IImageItemTemplateCfg = {};
    //endregion

    /**
     * Опции для списка в master-колонке
     */
    protected _masterTreeOptions: unknown;

    /**
     * Опции для Controls/explorer:View detail-колонке
     */
    protected _detailExplorerOptions: unknown;
    //endregion

    // region life circle hooks
    protected _beforeMount(
        options?: ICatalogOptions,
        contexts?: object,
        receivedState?: IReceivedState
    ): Promise<IReceivedState> | void {

        this.updateState(options);
        this._dataOptionsContext = new ContextOptions(this._detailSourceController.getState());

        if (receivedState) {
            this._masterSourceController.setItems(receivedState.masterItems);
            this._detailSourceController.setItems(receivedState.detailItems);
            this.applyListConfiguration(
                getListConfiguration(receivedState.detailItems),
                options
            );
        } else {
            const detailDataPromise = this.loadDetailData(options);
            const masterDataPromise = this._masterSourceController.load() as Promise<RecordSet>;

            return Promise
                .all([
                    masterDataPromise,
                    detailDataPromise
                ])
                .then(
                    ([masterItems, detailItems]) => ({masterItems, detailItems})
                );
        }
    }

    protected _beforeUpdate(newOptions?: ICatalogOptions, contexts?: unknown): void {
        this.updateState(newOptions);
    }

    protected _beforeUnmount(): void {
        this._masterSourceController.destroy();
        this._detailSourceController.destroy();
    }
    //endregion

    _getChildContext(): object {
        return {
            dataOptions: this._dataOptionsContext
        };
    }

    private _updateContext(sourceControllerState: IControllerState): void {
        const curContext = this._dataOptionsContext;

        for (const i in sourceControllerState) {
            if (sourceControllerState.hasOwnProperty(i)) {
                curContext[i] = sourceControllerState[i];
            }
        }
        curContext.updateConsumers();
    }

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
        this._defaultDetailViewMode = options.viewMode;
        // Обновляем root из опций только в том случае, если он задан,
        // в пртивном случае берем то, что лежит у нас в состоянии
        this._masterMarkedKey = options.root !== undefined ? options.root : this._root;

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

        // На основании полученного состояния соберем опции для detail-explorer
        this._detailExplorerOptions = this.buildDetailExplorerOptions(options);

        this._listItemTemplate = options.detail.listItemTemplate || 'wml!Controls/_catalog/templates/ListItemTemplate';
        this._tileItemTemplate = options.detail.tileItemTemplate || 'wml!Controls/_catalog/templates/TileItemTemplate';
        //endregion
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
            root: options.root,
            filter: ops?.filter,
            source: master ? this._masterSource : this._detailSource,
            keyProperty: master ? this._masterKeyProperty : this._detailKeyProperty,
            nodeProperty: master ? options.master.treeGridView.nodeProperty : options.detail.nodeProperty,
            parentProperty: master ? options.master.treeGridView.parentProperty : options.detail.parentProperty
        };
    }

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
            sourceController: this._masterSourceController,
            // Так же задаем source, т.к. без него подает ошибка при попытке раскрытия узлов
            // а список всеравно в первую очередь смотрит на sourceController
            source: this._masterSource
        };

        return {...defaultCfg, ...options.master.treeGridView};
    }

    private buildDetailExplorerOptions(options: ICatalogOptions = this._options): unknown {
        const def = {
            // Так же задаем source, т.к. без него подает ошибка при попытке раскрытия узлов
            // а список всеравно в первую очередь смотрит на sourceController
            source: this._detailSource,
            keyProperty: this._detailKeyProperty,
            sourceController: this._detailSourceController
        };

        return {...def, ...options.detail};
    }

    private loadDetailData(options: ICatalogOptions = this._options): Promise<RecordSet> {
        return this._detailSourceController
            .load(undefined, this._root)
            .then((items: RecordSet) => {
                // Применим новую конфигурацию к отображению detail-списка
                this.applyListConfiguration(getListConfiguration(items), options);
                this._detailSourceController.setItems(items);

                // Обновим данные detail-списка
                this._updateContext(this._detailSourceController.getState());

                return items;
            })
            .catch((error) => {
                Logger.error('Возникла ошибка при загрузке данных detail-колонки', this, error);
                return error;
            });
    }

    private buildDetailFilter(options: ICatalogOptions = this._options): QueryWhereExpression<unknown> {
        const filter = this._detailSourceController.getFilter() || {};

        if (options.detail?.parentProperty) {
            filter[options.detail.parentProperty] = this._root;
        }

        return filter;
    }

    /**
     * Обновляет состояние контрола в соответствии с переданной настройкой отображения списков
     */
    private applyListConfiguration(
        cfg: IListConfiguration,
        options: ICatalogOptions = this._options
    ): void {
        if (!cfg) {
            return;
        }

        this._listConfiguration = cfg;
        this._imageItemTemplateCfg = {};
        this._currentViewMode = cfg.settings.clientViewMode;

        if (this._currentViewMode === CatalogDetailViewMode.list) {
            this._imageItemTemplateCfg.viewMode = cfg.list.photo.viewMode;
            this._imageItemTemplateCfg.position = cfg.list.photo.imagePosition;
            this._imageItemTemplateCfg.imageProperty = options.detail.imageProperty;
        }
    }

    //region static utils
    static _theme: string[] = [
        'Controls/listTemplates',
        'Controls/catalog'
    ];

    static getDefaultOptions(): ICatalogOptions {
        return {
            viewMode: CatalogDetailViewMode.list,
            master: {
                treeGridView: {},
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

/**
 * @event Событие об изменении текущей корнево папки
 * @name Controls/catalog:View#rootChanged
 * @param {string} root Текущая корневая папка
 */
