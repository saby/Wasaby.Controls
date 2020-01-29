import {Control, TemplateFunction, IControlOptions} from 'UI/Base';
import {ICrud, DataSet, Query} from 'Types/source';
import {RecordSet} from 'Types/collection';
import {SyntheticEvent} from 'Vdom/Vdom';
import * as cInstance from 'Core/core-instance';
import {Logger} from 'UI/Utils';

import {NavigationController} from 'Controls/_source/NavigationController';
import {
    INavigationOptionValue, INavigationPageSourceConfig, INavigationPositionSourceConfig
} from 'Controls/_interface/INavigation';
import {ViewConfig, Controller as ErrorController} from 'Controls/_dataSource/error';
import {
    SourceCrudInterlayer,
    ISourceErrorData,
    ISourceErrorConfig,
    ISourceCrudInterlayerOptions
} from 'Controls/_dataSource/SourceCrudInterlayer';
import {IPagingOptions} from 'Controls/_paging/Paging';

import {IDirection} from './interface/IVirtualScroll';

import * as Template from 'wml!Controls/_list/SourceControl/SourceControl';

/**
 * Настройки для страницы по умолчанию
 */
const INITIAL_PAGES_COUNT = 1;
const INITIAL_PAGE_NUMBER = 1;
const INITIAL_PER_PAGE = 100;
const DEFAULT_KEY_PROPERTY = 'id';

/**
 * Функция-помощник для инициализации настроек контрола пейджера
 * @param pagingOptions
 */
const initPagingOptions = (pagingOptions: IPagingOptions): IPagingOptions => {
    return {
        pagesCount: INITIAL_PAGES_COUNT,
        showDigits: true,
        selectedPage: INITIAL_PAGE_NUMBER,
        stateBegin: 'disabled',
        stateEnd: 'disabled',
        stateNext: 'normal',
        statePrev: 'normal',
        ...pagingOptions
    };
};

/**
 * Функция-помощник для инициализации настроек контроллера навигации
 * @param navigationOptions
 */
const initNavigationOptions = (navigationOptions: INavigationOptionValue): INavigationOptionValue => {
    const options: INavigationOptionValue = {};
    const defaultPagesSourceConfig: INavigationPageSourceConfig = {
        hasMore: false,
        page: INITIAL_PAGE_NUMBER - 1,
        pageSize: INITIAL_PER_PAGE
    };
    options.source = navigationOptions && navigationOptions.source || 'page';
    options.view = navigationOptions && navigationOptions.view || 'pages';
    options.sourceConfig = navigationOptions && navigationOptions.sourceConfig || defaultPagesSourceConfig;
    return options;
};

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
     * @cfg {Types/source:INavigationOptionValue} Опции навигации
     */
    /*
     * @name Controls/_list/SourceControl#navigation
     * @cfg {Types/source:INavigationOptionValue} Navigation options
     */
    navigation?: INavigationOptionValue;

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
 * @class Controls/_listRender/SourceControl
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
 * @class Controls/_listRender/SourceControl
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

    // Ресурс данных с перехватчиком ошибок
    private _itemsSource: ICrud;

    // Экземпляр контроллера, управляющего навигацией по записям
    protected _navigationController: NavigationController;

    // Конфигурация навигации для передачи в контроллер
    protected _navigationOptions: INavigationOptionValue;

    // Настройки пейджинатора
    protected _pagingOptions: IPagingOptions;

    // текущая загрузка
    private _request: Promise<void | RecordSet>;

    protected _beforeMount(options?: ISourceControlOptions, contexts?: object, receivedState?: RecordSet | void): Promise<RecordSet | void> | void {
        this._options = options;
        this._items = new RecordSet();
        this._itemsSource = new SourceCrudInterlayer(this._options as ISourceCrudInterlayerOptions);
        this._navigationOptions = initNavigationOptions(this._options.navigation);
        this._navigationController = new NavigationController({
            navigation: this._navigationOptions
        });
        if (!this._options.keyProperty) {
            this._options.keyProperty = DEFAULT_KEY_PROPERTY;
        }
        return this._load();
    }

    destroy(): void {
        super.destroy();
        this._navigationController.destroy();
    }

    /**
     * Нажата страница в контроле навигации
     * @param e
     * @param page
     * @private
     */
    protected _onPagingChangePage(e: SyntheticEvent<Event>, page: number): void {
        this._pagingOptions.selectedPage = page;
        let to = page ? page - 1 : 0;
        if ('page' in this._navigationOptions.sourceConfig) {
            (this._navigationOptions.sourceConfig as INavigationPageSourceConfig).page = to;

        } else if ('position' in this._navigationOptions.sourceConfig) {
            const limit = (this._navigationOptions.sourceConfig as INavigationPositionSourceConfig).limit;
            to = to * limit;
            (this._navigationOptions.sourceConfig as INavigationPositionSourceConfig).position = to;
        }
        this._navigationController.updatePage(to);
        this._load();
    }

    /**
     * Нажата стрелка в контроле навигации
     * @param e
     * @param btnName
     * @private
     */
    protected _onPagingArrowClick(e: SyntheticEvent<Event>, btnName: string): void {
        if (btnName === 'Next') {
            this._navigationController.calculateState(this._items, 'down');

        } else if (btnName === 'Prev') {
            this._navigationController.calculateState(this._items, 'up');
        }
        this._load();
    }

    /**
     * Обработчик события "Загрузить ещё"
     * @param e
     * @param direction
     * @private
     */
    protected _loadMore(e: SyntheticEvent<Event>, direction: IDirection): void {
        this._load(direction);
    }

    /**
     * Строит запрос данных на основе переданных параметров filter и sorting и возвращает Promise<RecordSet>.
     * Если в опцию navigation был передан объект INavigationOptionValue, его filter, sorting и настрйоки пейджинации
     * также одбавляются в запрос.
     * @param filter {Types/source:QueryWhere} Настрйоки фильтрации
     * @param sorting {Types/source:QueryOrderSelector} Настрйки сортировки
     * @param direction {Direction} Направление навигации
     */
    /*
     * Builds a query based on passed filter and sorting params and returns Promise<RecordSet>.
     * If INavigationOptionValue is set into the class navigation property, its filter, sorting and pagination settings
     * will also be added to query
     * @param filter {Types/source:QueryWhere} filter settings
     * @param sorting {Types/source:QueryOrderSelector} sorting settings
     * @param direction {Direction} navigation direction
     */
    protected _load(direction?: IDirection): Promise<void | RecordSet> {
        const filter = {};
        const sorting = [{id: true}];
        this._hideError();
        this._cancelLoading();
        const query = this._navigationController.buildQuery(direction, filter, sorting);
        this._request = this._callQuery(query)
            .then((recordSet: RecordSet) => {
                this._navigationController.calculateState(recordSet, direction);
                this._items = recordSet;
                if (!this._pagingOptions) {
                    this._pagingOptions = this._calculatePagingOptions(this._items);
                }
                return this._items;
            })
            .catch((error: ISourceErrorData) => {
                this._showError(error.errorConfig);
            });
        return this._request;
    }

    /**
     * Проверяет, загружаются ли в данный момент данные
     */
    /*
     * Checks if data is currently loading
     */
    isLoading(): boolean {
        // Promise в проекте работает как Deferred (@see WS.Core/core/polyfill/PromiseAPIDeferred).
        return this._request && !this._request.isReady();
    }

    /**
     * Отменяет текущую загрузку данных
     * @private
     */
    private _cancelLoading(): void {
        // Promise в проекте работает как Deferred (@see WS.Core/core/polyfill/PromiseAPIDeferred).
        if (this._request && !this._request.isReady()) {
            this._request.cancel();
        }
    }

    /**
     * Выполняет запрос данных DataSet методом ICrud.query()
     * Возвращает Promise<RecordSet> с результатом выполнения DataSet.getAll()
     * @param {string} keyProperty Свойство, используемое в качестве ключа в DataSet
     * @param {Types/source:Query} query исполняемый запрос с учётом сортировки, фильтрации, параметров пейджинации
     * @private
     */
    /*
     * Performs the DataSet request using ICrud.query()
     * and returns Promise<RecordSet> with result of calling DataSet.getAll()
     * @param {string} keyProperty key property for DataSet
     * @param {Types/source:Query} query A query built based on sorting, filter and pagination params
     * @private
     */
    private _callQuery(query: Query): Promise<RecordSet> {
        let sourceQuery: Promise<RecordSet>;
        // Promise в проекте работает как Deferred (@see WS.Core/core/polyfill/PromiseAPIDeferred).
        const queryDeferred = this._itemsSource.query(query)
            .addCallback((dataSet: DataSet) => {
                if (this._options.keyProperty && this._options.keyProperty !== dataSet.getKeyProperty()) {
                    dataSet.setKeyProperty(this._options.keyProperty);
                }
                return dataSet.getAll ? dataSet.getAll() : dataSet;
            })
            .catch(() => {
                Logger.error('NavigationController: Data is unable to be queried');
            });
        /**
         * Deferred с синхронным кодом статического источника выполняется сихронно.
         * в итоге в callback релоада мы приходим в тот момент, когда еще не отработал _beforeMount и заполнение опций,
         * и не можем обратиться к this._options.
         */
        if (cInstance.instanceOfModule(this._itemsSource, 'Types/source:Memory')) {
            sourceQuery = new Promise((resolve) => {
                setTimeout(() => {
                    resolve(queryDeferred);
                }, 0);
            });
        } else {
            sourceQuery = queryDeferred;
        }
        return sourceQuery;
    }

    /**
     * Считает кол-во страниц для пейджера, основываясь на pageSize и RecordSet.meta.total
     * @private
     */
    private _calculatePagingOptions(items: RecordSet): IPagingOptions {
        const metaData = items.getMetaData();
        const count = metaData.total;
        let pagesCount: number;
        if ('pageSize' in this._navigationOptions.sourceConfig) {
            const pageSize = (this._navigationOptions.sourceConfig as INavigationPageSourceConfig).pageSize;
            pagesCount = Math.ceil(count / pageSize);

        } else if ('position' in this._navigationOptions.sourceConfig) {
            const limit = (this._navigationOptions.sourceConfig as INavigationPositionSourceConfig).limit;
            pagesCount = Math.ceil(count / limit);
        }
        return initPagingOptions({
            ...this._options.pagingOptions,
            pagesCount
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
