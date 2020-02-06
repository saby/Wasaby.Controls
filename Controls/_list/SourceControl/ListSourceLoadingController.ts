import {RecordSet} from 'Types/collection';
import {DataSet, QueryOrderSelector, QueryWhere} from 'Types/source';
import {ObservableMixin} from 'Types/entity';
import {Logger} from 'UI/Utils';

import {IDirection} from 'Controls/_list/interface/IVirtualScroll';
import {NavigationController} from 'Controls/_source/NavigationController';
import {
    INavigationOptionValue,
    INavigationPageSourceConfig,
    INavigationPositionSourceConfig
} from 'Controls/_interface/INavigation';

import {
    SourceCrudInterlayer,
    ISourceCrudInterlayerOptions
} from 'Controls/_dataSource/SourceCrudInterlayer';

/**
 * Настройки для страницы по умолчанию
 */
const INITIAL_PAGE_NUMBER = 1;
const INITIAL_PER_PAGE = 100;

export interface ISourceControlQueryParams {
    direction?: IDirection;
    filter?: QueryWhere;
    sorting?: QueryOrderSelector;
}

/**
 * Резолвер настроек контроллера навигации
 *
 * @class Controls/_list/SourceControl/ListSourceLoadingController:NavigationOptionsResolver
 *
 * @private
 * @author Аверкиев П.А.
 */
/*
 * Navigation controller options resolver
 *
 * @class Controls/_list/SourceControl/ListSourceLoadingController:NavigationOptionsResolver
 *
 * @private
 * @author Аверкиев П.А.
 */
export class NavigationOptionsResolver {
    private readonly _cfg: INavigationOptionValue<INavigationPageSourceConfig | INavigationPositionSourceConfig>;
    private readonly _keyProperty: string;

    constructor(cfg: INavigationOptionValue<INavigationPageSourceConfig | INavigationPositionSourceConfig>, keyProperty?: string) {
        this._cfg = cfg;
        this._keyProperty = keyProperty;
    }

    /**
     * Возвращает опции по умолчанию для контроллера навигации в зависимости от выбранного
     * алгоритма работы с источником данных (source)
     * @remark
     * По умолчанию возвращает настройки для "Page" алгоритма
     * @param page
     * @param pageSize
     */
    /*
     * Returns default options for navigation controller depending on chosen data source managing algorithm (source)
     * @remark
     * By default returns options for "Page" data source managing algorithm
     * @param page
     * @param pageSize
     */
    resolve(page: number | unknown[] | unknown, pageSize: number): INavigationOptionValue<INavigationPageSourceConfig | INavigationPositionSourceConfig> {
        const options: INavigationOptionValue<INavigationPageSourceConfig | INavigationPositionSourceConfig> = {};
        options.source = this._cfg && this._cfg.source || 'page';
        if (this._cfg && this._cfg.sourceConfig) {
            options.sourceConfig = this._cfg.sourceConfig;
        } else {
            options.sourceConfig = (options.source === 'position' ?
                this._resolveDefaultPositionConfig(page, pageSize) :
                this._resolveDefaultPageConfig(page as number, pageSize));
        }
        if (this._cfg && this._cfg.view) {
            options.view = this._cfg.view;
        } else {
            options.view = options.source === 'position' ? 'infinity' : 'demand';
        }
        if (this._cfg && this._cfg.viewConfig) {
            options.viewConfig = this._cfg.viewConfig;
        }
        return options;
    }

    private _resolveDefaultPositionConfig(position: unknown[] | unknown, limit: number): INavigationPositionSourceConfig {
        return {
            position,
            limit,
            direction: 'after',
            field: this._keyProperty
        };
    }

    private _resolveDefaultPageConfig(page: number, pageSize: number): INavigationPageSourceConfig {
        return {
            hasMore: false,
            page,
            pageSize
        };
    }
}

export interface IListSourceLoaderOptions extends ISourceCrudInterlayerOptions {
    /**
     * @name Controls/_list/SourceControl/ListSourceLoader:IListSourceLoaderOptions#navigation
     * @cfg {Types/source:INavigationOptionValue<INavigationPageSourceConfig | INavigationPositionSourceConfig>} Опции навигации
     */
    /*
     * @name Controls/_list/SourceControl/ListSourceLoader:IListSourceLoaderOptions#navigation
     * @cfg {Types/source:INavigationOptionValue<INavigationPageSourceConfig | INavigationPositionSourceConfig>} Navigation options
     */
    navigation?: INavigationOptionValue<INavigationPageSourceConfig | INavigationPositionSourceConfig>;

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

    private readonly _navigationController: NavigationController;

    private readonly _navigationOptions: INavigationOptionValue<INavigationPageSourceConfig | INavigationPositionSourceConfig>;

    private readonly _keyProperty: string;

    private readonly _source: SourceCrudInterlayer;

    // текущая загрузка
    private _request: Promise<void | RecordSet>;

    constructor(cfg: IListSourceLoaderOptions) {
        ObservableMixin.call(this, cfg);
        this._keyProperty = cfg.keyProperty;
        const navigationOptionsResolver = new NavigationOptionsResolver(cfg.navigation, this._keyProperty);
        this._navigationOptions = navigationOptionsResolver.resolve(INITIAL_PAGE_NUMBER - 1, INITIAL_PER_PAGE);
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
    load(params?: ISourceControlQueryParams): Promise<void | RecordSet> {
        const filter = params && params.filter || {};
        const sorting = params && params.sorting || [{[this._keyProperty]: true}];
        const direction: IDirection = params && params.direction || undefined;

        this.cancelLoading();

        const query = this._navigationController.getQueryParams(direction, filter, sorting);
        this._request = this._source.query(query).then((dataSet: DataSet) => {
            if (this._keyProperty && this._keyProperty !== dataSet.getKeyProperty()) {
                dataSet.setKeyProperty(this._keyProperty);
            }
            if (!dataSet || !('getAll' in dataSet)) {
                Logger.error('ListSourceLoader: Wrong data received', 'Controls/_list/SourceControl/ListSourceLoader');
            }
            const recordSet = dataSet.getAll();
            this._navigationController.calculateState(recordSet, direction);

            return recordSet;
        });
        return this._request;
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
