import {
    INavigationOptionValue,
    INavigationPageSourceConfig,
    INavigationPositionSourceConfig, INavigationSourceConfig
} from '../../_interface/INavigation';

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
    private readonly _cfg: INavigationOptionValue<INavigationSourceConfig>;
    private readonly _keyProperty: string;

    constructor(cfg: INavigationOptionValue<INavigationSourceConfig>, keyProperty?: string) {
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
    resolve(page: number | unknown[] | unknown, pageSize: number): INavigationOptionValue<INavigationSourceConfig> {
        const options: INavigationOptionValue<INavigationSourceConfig> = {};
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
