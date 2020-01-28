import {Control, TemplateFunction, IControlOptions} from 'UI/Base';
import {ICrud} from 'Types/source';
import {RecordSet} from 'Types/collection';
import {SyntheticEvent} from 'Vdom/Vdom';
import {Model} from 'Types/entity';
import {create as diCreate} from 'Types/di';

import {NavigationController} from 'Controls/_source/NavigationController';
import {
    INavigationOptionValue, INavigationPageSourceConfig, INavigationPositionSourceConfig
} from 'Controls/_interface/INavigation';
import {ViewConfig, Controller as ErrorController} from 'Controls/_dataSource/error';
import {SourceWrapper, ISourceErrorData, ISourceErrorConfig} from 'Controls/_dataSource/SourceWrapper';
import {IPagingOptions} from 'Controls/_paging/Paging';
import {IViewOptions} from 'Controls/_listRender/View';
import {default as Collection} from 'Controls/_display/Collection';

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

// TODO наследование от IViewOptions это костыль, т.к. установка collection происхожит
//  в дочерних контролах, которые extends View
export interface ISourceControlOptions extends IViewOptions {
    /**
     * @name Controls/_listRender/SourceControl#content
     * @cfg {Types/source:ICrud} код шаблона, обёрнутый контролом SourceControl
     */
    /*
     * @name Controls/_listRender/SourceControl#content
     * @cfg {Types/source:ICrud} template code, wrapped by control SourceControl
     */
    content: TemplateFunction;

    /**
     * @name Controls/_listRender/SourceControl#source
     * @cfg {Types/source:ICrud} Ресурс для запроса данных
     */
    /*
     * @name Controls/_listRender/SourceControl#source
     * @cfg {Types/source:ICrud} Source to request data
     */
    source: ICrud;

    /**
     * @name Controls/_listRender/SourceControl#navigation
     * @cfg {Types/source:INavigationOptionValue} Опции навигации
     */
    /*
     * @name Controls/_listRender/SourceControl#navigation
     * @cfg {Types/source:INavigationOptionValue} Navigation options
     */
    navigation?: INavigationOptionValue;

    /**
     * @name Controls/_listRender/SourceControl#errorConfig
     * @cfg {Controls/_dataSource/SourceWrapper:ISourceErrorConfig} настройки для отображения ошибки
     */
    /*
     * @name Controls/_listRender/SourceControl#errorConfig
     * @cfg {Controls/_dataSource/SourceWrapper:ISourceErrorConfig} error display configuration
     */
    errorConfig?: ISourceErrorConfig;

    /**
     * @name Controls/_listRender/SourceControl#errorController
     * @cfg {Controls/_dataSource/error:ErrorController} Экземпляр контроллера ошибки, инициализированный с собственными хандлерами
     */
    /*
     * @name Controls/_listRender/SourceControl#errorController
     * @cfg {Controls/_dataSource/error:ErrorController} Error controller instance, initialized with Custom handlers
     */
    errorController?: ErrorController;

    /**
     * @name Controls/_listRender/SourceControl#pagingOptions
     * @cfg {Controls/_paging/Paging:IPagingOptions} Настройки для постраничного пейджера
     */
    /*
     * @name Controls/_listRender/SourceControl#pagingOptions
     * @cfg {Controls/_paging/Paging:IPagingOptions} Configuration for Per-page Pager
     */
    pagingOptions?: IPagingOptions;

    /**
     * @name Controls/_listRender/SourceControl#keyProperty
     * @cfg {string} Название поля ключа для Types/source:DataSet
     */
    /*
     * @name Controls/_listRender/SourceControl#keyProperty
     * @cfg {string} Name of the key property for Types/source:DataSet
     */
    keyProperty?: string;
}

/**
 * Контрол, который предоставляет возможность загрузить данные для списков и перемещаться по ним, использую навигацию Page/Position.
 * @remark
 * Принимает настройки для постраничной навигации и загружает данные, используя
 * NavigationControl для управления состояния навигации и SourceWrapper для обработки ошибки загрузки данных.
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
 * using NavigationControl to handle navigation state and SourceWrapper to catch data loading error.
 * It the case of error shows error page
 *
 * @class Controls/_listRender/SourceControl
 *
 * @control
 * @public
 * @author Аверкиев П.А.
 */
export default class SourceControl extends Control<ISourceControlOptions> {
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

    // Коллекцияя со списком записей. Управляется ScrollContainer
    // TODO это костыль, т.к. это же самое происходит в дочерних контролах, которые extends View
    protected _collection: Collection<Model>;

    protected _beforeMount(options?: ISourceControlOptions, contexts?: object, receivedState?: void): Promise<void> | void {
        this._options = options;
        this._items = new RecordSet();

        // TODO это костыль, т.к. это же самое происходит в дочерних контролах, которые extends View
        this._collection = this._createCollection(this._options.collection, this._items, this._options);

        this._itemsSource = new SourceWrapper(
            this._options.source,
            this._options.errorConfig,
            this._options.errorController
        );
        this._navigationOptions = initNavigationOptions(this._options.navigation);
        this._navigationController = new NavigationController({
            keyProperty: this._options.keyProperty || DEFAULT_KEY_PROPERTY,
            source: this._itemsSource,
            navigation: this._navigationOptions
        });
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
        (this._navigationOptions.sourceConfig as INavigationPageSourceConfig).page = page ? page - 1 : 0;
        this._navigationController.rebuildState(this._navigationOptions.sourceConfig);
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
        this._collection.setHasMoreData(this._navigationController.hasMoreData(direction));
        this._load(direction);
    }

    /**
     * Загружаем данные списка через контроллер навигации
     * @private
     */
    protected _load(direction?: IDirection): Promise<void> {
        const filter = {};
        const sorting = [{id: true}];
        this._hideError();
        return this._navigationController.load(filter, sorting, direction)
            .then((recordSet: RecordSet) => {
                this._updateCollection(recordSet);
                if (!this._pagingOptions) {
                    this._pagingOptions = this._calculatePagingOptions(this._items);
                }
            })
            .catch((error: ISourceErrorData) => {
                this._showError(error.errorConfig);
            });
    }

    /**
     * Обновляет набор отображаемых записей
     * @param recordSet
     * @private
     */
    private _updateCollection(recordSet: RecordSet): void {
        this._items = recordSet;
        if (this._collection) {
            this._collection.destroy();
        }
        this._collection = this._createCollection(this._options.collection, this._items, this._options);
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

    // TODO это костыль, т.к. это же самое происходит в дочерних контролах, которые extends View
    private _createCollection(
        module: string,
        items: RecordSet,
        collectionOptions: IViewOptions
    ): Collection<Model> {
        return diCreate(module, { ...collectionOptions, collection: items });
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
