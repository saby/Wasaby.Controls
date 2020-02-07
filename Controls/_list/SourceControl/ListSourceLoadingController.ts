import {RecordSet} from 'Types/collection';
import {DataSet, QueryOrderSelector, QueryWhere} from 'Types/source';
import {ObservableMixin} from 'Types/entity';
import {Logger} from 'UI/Utils';

import {IDirection} from 'Controls/_list/interface/IVirtualScroll';
import {NavigationController} from 'Controls/_source/NavigationController';
import {INavigationOptionValue, INavigationSourceConfig} from 'Controls/_interface/INavigation';

import {
    SourceCrudInterlayer,
    ISourceCrudInterlayerOptions
} from 'Controls/_dataSource/SourceCrudInterlayer';

import {NavigationOptionsResolver} from './NavigationOptionsResolver';
import * as ErrorModule from 'Controls/_dataSource/error';

export interface ISourceControlQueryParams {
    direction?: IDirection;
    filter?: QueryWhere;
    sorting?: QueryOrderSelector;
}

export interface IListSourceLoaderOptions extends ISourceCrudInterlayerOptions {
    /**
     * @name Controls/_list/SourceControl/ListSourceLoader:IListSourceLoaderOptions#navigation
     * @cfg {Types/source:INavigationOptionValue<INavigationSourceConfig>} Опции навигации
     */
    /*
     * @name Controls/_list/SourceControl/ListSourceLoader:IListSourceLoaderOptions#navigation
     * @cfg {Types/source:INavigationOptionValue<INavigationSourceConfig>} Navigation options
     */
    navigation?: INavigationOptionValue<INavigationSourceConfig>;

    /**
     * @name Controls/_list/SourceControl/ListSourceLoader:IListSourceLoaderOptions#keyProperty
     * @cfg {string} Название поля ключа для Types/source:DataSet
     */
    /*
     * @name Controls/_list/SourceControl/ListSourceLoader:IListSourceLoaderOptions#keyProperty
     * @cfg {string} Name of the key property for Types/source:DataSet
     */
    keyProperty?: string;
}

/**
 * Контроллер загрузки данных списков
 * @remark
 * Предоставляет метод load() для начала загрузки данных и метод cancelLoading() для сброса процесса загрузки
 *
 * @class Controls/_list/SourceControl/ListSourceLoadingController:NavigationOptionsResolver
 *
 * @private
 * @author Аверкиев П.А.
 */
/*
 * List source data loading controller
 * @remark
 * Provides method load()
 *
 * @class Controls/_list/SourceControl/ListSourceLoadingController:NavigationOptionsResolver
 *
 * @private
 * @author Аверкиев П.А.
 */
export class ListSourceLoadingController {

    // Контроллер навигации
    private readonly _navigationController: NavigationController;

    // Опции для контроллера навигации
    private readonly _navigationOptions: INavigationOptionValue<INavigationSourceConfig>;

    // Ключевое свойство RecordSet
    private readonly _keyProperty: string;

    // Прослойке с ресурсом, возвращающая конфиг для ошибки
    private readonly _source: SourceCrudInterlayer;

    // текущая загрузка
    private _request: Promise<void | RecordSet>;

    constructor(cfg: IListSourceLoaderOptions) {
        ObservableMixin.call(this, cfg);
        this._keyProperty = cfg.keyProperty;
        const navigationOptionsResolver = new NavigationOptionsResolver(cfg.navigation, this._keyProperty);
        this._navigationOptions = navigationOptionsResolver.resolve();
        this._navigationController = new NavigationController({
            navigation: this._navigationOptions
        });
        this._source = new SourceCrudInterlayer(cfg as ISourceCrudInterlayerOptions);
    }

    /**
     * Запрашивает данные из ресурса данных, используя параметры filter, sorting, direction.
     * @param params {Controls/_list/SourceControl:ISourceControlQueryParams} параметры построения запроса
     */
    /*
     * Requests data from source using params filter, sorting, direction
     * @param params {Controls/_list/SourceControl:ISourceControlQueryParams} query params
     */
    load(params?: ISourceControlQueryParams): Promise<{data: RecordSet; error: ErrorModule.ViewConfig}> {
        const filter = params && params.filter || {};
        const sorting = params && params.sorting || [{[this._keyProperty]: true}];
        const direction: IDirection = params && params.direction || undefined;

        this.cancelLoading();
        const query = this._navigationController.getQueryParams(direction, filter, sorting);

        this._request = this._source.query(query)
            .then((dataSet: DataSet) => {
                if (this._keyProperty && this._keyProperty !== dataSet.getKeyProperty()) {
                    dataSet.setKeyProperty(this._keyProperty);
                }
                if (!dataSet || !('getAll' in dataSet)) {
                    Logger.error('ListSourceLoader: Wrong data received', 'Controls/_list/SourceControl/ListSourceLoader');
                }
                const recordSet = dataSet.getAll();
                this._navigationController.updateCalculationParams(recordSet, direction);

                return recordSet;
            });
        return this._request
            .then((data: RecordSet) => ({data, error: null}))
            .catch((error: ErrorModule.ViewConfig) => Promise.resolve({data: null, error}));
    }

    /**
     * Отменяет текущую загрузку данных
     * @private
     */
    /*
     * Cancel current data loading
     * @private
     */
    cancelLoading(): void {
        // Promise в проекте работает как Deferred (@see WS.Core/core/polyfill/PromiseAPIDeferred).
        // @ts-ignore
        if (this._request && !this._request.isReady()) {
            // @ts-ignore
            this._request.cancel();
        }
    }

    destroy(): void {
        this._navigationController.destroy();
    }
}
