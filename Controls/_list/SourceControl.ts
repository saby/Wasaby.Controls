import {Control, TemplateFunction, IControlOptions} from 'UI/Base';
import {ICrud} from 'Types/source';
import {RecordSet} from 'Types/collection';
import {
    INavigationOptionValue, INavigationPageSourceConfig, INavigationPositionSourceConfig
} from 'Controls/_interface/INavigation';
import {ViewConfig, Controller as ErrorController} from 'Controls/_dataSource/error';
import {ISourceErrorConfig, ISourceErrorData} from 'Controls/_dataSource/SourceCrudInterlayer';
import {IPagingOptions} from 'Controls/_paging/Paging';
import {Direction} from 'Controls/_source/interface/IAdditionalQueryParams';

import {ListSourceLoadingController} from './SourceControl/ListSourceLoadingController';

import * as Template from 'wml!Controls/_list/SourceControl/SourceControl';

export interface ISourceControlOptions extends IControlOptions {
    /**
     * @name Controls/_list/SourceControl#content
     * @cfg {Types/source:ICrud} код шаблона, обёрнутый контролом SourceControl
     */
    /*
     * @name Controls/_list/SourceControl#content
     * @cfg {Types/source:ICrud} template code, wrapped by control SourceControl
     */
    content: TemplateFunction;

    /**
     * @name Controls/_list/SourceControl#source
     * @cfg {Types/source:ICrud} Ресурс для запроса данных
     */
    /*
     * @name Controls/_list/SourceControl#source
     * @cfg {Types/source:ICrud} Source to request data
     */
    source: ICrud;

    /**
     * @name Controls/_list/SourceControl#navigation
     * @cfg {Types/source:INavigationOptionValue<INavigationPageSourceConfig | INavigationPositionSourceConfig>} Опции навигации
     */
    /*
     * @name Controls/_list/SourceControl#navigation
     * @cfg {Types/source:INavigationOptionValue<INavigationPageSourceConfig | INavigationPositionSourceConfig>} Navigation options
     */
    navigation?: INavigationOptionValue<INavigationPageSourceConfig | INavigationPositionSourceConfig>;

    /**
     * @name Controls/_list/SourceControl#errorConfig
     * @cfg {Controls/_dataSource/SourceCrudInterlayer:ISourceErrorConfig} настройки для отображения ошибки
     */
    /*
     * @name Controls/_list/SourceControl#errorConfig
     * @cfg {Controls/_dataSource/SourceCrudInterlayer:ISourceErrorConfig} error display configuration
     */
    errorConfig?: ISourceErrorConfig;

    /**
     * @name Controls/_list/SourceControl#errorController
     * @cfg {Controls/_dataSource/error:ErrorController} Экземпляр контроллера ошибки, инициализированный с собственными хандлерами
     */
    /*
     * @name Controls/_list/SourceControl#errorController
     * @cfg {Controls/_dataSource/error:ErrorController} Error controller instance, initialized with Custom handlers
     */
    errorController?: ErrorController;

    /**
     * @name Controls/_list/SourceControl#pagingOptions
     * @cfg {Controls/_paging/Paging:IPagingOptions} Настройки для постраничного пейджера
     */
    /*
     * @name Controls/_list/SourceControl#pagingOptions
     * @cfg {Controls/_paging/Paging:IPagingOptions} Configuration for Per-page Pager
     */
    pagingOptions?: IPagingOptions;

    /**
     * @name Controls/_list/SourceControl#keyProperty
     * @cfg {string} Название поля ключа для Types/source:DataSet
     */
    /*
     * @name Controls/_list/SourceControl#keyProperty
     * @cfg {string} Name of the key property for Types/source:DataSet
     */
    keyProperty?: string;
}

/**
 * Контрол, который предоставляет возможность загрузить данные для списков и перемещаться по ним, использую навигацию Page/Position.
 * @remark
 * Принимает настройки для постраничной навигации и загружает данные, используя
 * NavigationControl для управления состояния навигации и SourceCrudInterlayer для обработки ошибки загрузки данных.
 * В случае ошибки загрузки данных показывает стран6ицу с ошибкой
 *
 * @class Controls/list:SourceControl
 *
 * @control
 * @public
 * @author Аверкиев П.А.
 */
/*
 * Control, that provides ability to load data from source and to navigate through them using per-page/scroll navigation.
 * @remark
 * Accepts settings for per-page/scroll navigation and loads data from source,
 * using NavigationControl to handle navigation state and SourceCrudInterlayer to catch data loading error.
 * It the case of error shows error page
 *
 * @class Controls/list:SourceControl
 *
 * @control
 * @public
 * @author Аверкиев П.А.
 */
export default class SourceControl extends Control<ISourceControlOptions, RecordSet | void> {
    protected _template: TemplateFunction = Template;

    // Полученные записи
    protected _items: RecordSet;

    // Текущая ошибка
    protected _error: ViewConfig;

    // Контроллер загрузки данных в список
    private _listSourceLoader: ListSourceLoadingController;

    protected _beforeMount(options?: ISourceControlOptions, contexts?: object, receivedState?: RecordSet | void): Promise<RecordSet | void> | void {
        this._options = options;
        this._listSourceLoader = new ListSourceLoadingController({
            keyProperty: this._options.keyProperty,
            navigation: this._options.navigation,
            source: this._options.source
        });
        return this._load();
    }

    protected _onClickLoadMore(event: Event) {
        return this._load('down');
    }

    destroy(): void {
        this._listSourceLoader.destroy();
        super.destroy();
    }

    /**
     * Загрузка данных с учётом направления
     * @param direction
     * @private
     */
    private _load(direction?: Direction): Promise<void | RecordSet> {
        // {
        //     sorting: {}, // TODO implement external List/Grid sorting
        //     filter: [], // TODO implement external List/Grid filter
        // }
        this._hideError();
        return this._listSourceLoader.load({direction})
            .then((recordSet: RecordSet) => {
                this._items = recordSet;
            })
            .catch((error: ISourceErrorData) => {
                this._showError(error.errorConfig);
            });
    }

    private _showError(errorConfig: ViewConfig): void {
        this._error = errorConfig;
    }

    private _hideError(): void {
        if (this._error) {
            this._error = null;
        }
    }
}
