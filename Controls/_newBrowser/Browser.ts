import {Logger} from 'UI/Utils';
import {Model} from 'Types/entity';
import {SyntheticEvent} from 'UI/Vdom';
import {RecordSet} from 'Types/collection';
import {TKey} from 'Controls/_interface/IItems';
import {Control, TemplateFunction} from 'UI/Base';
import {DataSource} from 'Controls/_newBrowser/DataSource';
import {IOptions} from 'Controls/_newBrowser/interfaces/IOptions';
import {ISourceOptions} from 'Controls/_newBrowser/interfaces/ISourceOptions';
import {DetailViewMode, IDetailOptions} from 'Controls/_newBrowser/interfaces/IDetailOptions';
import {MasterVisibilityEnum} from 'Controls/_newBrowser/interfaces/IMasterOptions';
import {BeforeChangeRootResult, IRootsData} from 'Controls/_newBrowser/interfaces/IRootsData';
import {IBrowserViewConfig, NodesPosition} from 'Controls/_newBrowser/interfaces/IBrowserViewConfig';
import {compileSourceOptions, getListConfiguration, ListConfig, TileConfig} from 'Controls/_newBrowser/utils';
//region templates import
// tslint:disable-next-line:ban-ts-ignore
// @ts-ignore
import * as ViewTemplate from 'wml!Controls/_newBrowser/Browser';
// tslint:disable-next-line:ban-ts-ignore
// @ts-ignore
import * as DefaultListItemTemplate from 'wml!Controls/_newBrowser/templates/ListItemTemplate';
// tslint:disable-next-line:ban-ts-ignore
// @ts-ignore
import * as DefaultTileItemTemplate from 'wml!Controls/_newBrowser/templates/TileItemTemplate';
import {QueryWhereExpression} from 'Types/source';

//endregion

interface IReceivedState {
    masterItems?: RecordSet;
    detailItems: RecordSet;
}

/**
 * Компонент реализует стандартную раскладку двухколоночного реестра с master и detail колонками.
 *
 * При получении списка записей для detail-колонки из метаданных ответа вычитывает поле
 * 'listConfiguration', в котором ожидается объект реализующий интерфейс {@link IBrowserViewConfig},
 * и применяет полученную конфигурацию к списку.
 *
 * @class Controls/newBrowser:Browser
 * @extends UI/Base:Control
 * @public
 * @author Уфимцев Д.Ю.
 */
export default class Browser extends Control<IOptions, IReceivedState> {

    //region ⽥ fields
    /**
     * true если explorer загрузил шаблон и модель для плитки.
     * Делает он это при первом переключении в плиточный режим.
     */
    private _isTileLoaded: boolean = false;

    /**
     * Шаблон отображения компонента
     */
    protected _template: TemplateFunction = ViewTemplate;

    /**
     * Enum со списком доступных вариантов отображения контента в detail-колонке.
     * Используется в шаблоне компонента.
     */
    protected _viewModeEnum: typeof DetailViewMode = DetailViewMode;

    /**
     * Enum со списком доступных вариантов отображения master-колонки.
     * Используется в шаблоне компонента.
     */
    protected _masterVisibilityEnum: typeof MasterVisibilityEnum = MasterVisibilityEnum;

    /**
     * Регулирует видимость master-колонки
     */
    protected _masterVisibility: MasterVisibilityEnum;

    /**
     * Текущий режим отображения списка в detail-колонке.
     */
    get viewMode(): DetailViewMode {
        // Режим 'search' самый приоритетный. Во всех остальных случаях
        // используем либо явно заданный _userViewMode либо текущий _viewMode,
        // полученный из метаданных
        return this._viewMode === DetailViewMode.search
            ? this._viewMode
            : (this._userViewMode || this._viewMode);
    }
    // Пользовательский режим отображения, задается опцией сверху
    private _userViewMode: DetailViewMode;
    // Текущий режим отображения, полученный их метаданных ответа,
    // либо выставленный нами явно в 'search' при поиске
    private _viewMode: DetailViewMode;
    protected _appliedViewMode: DetailViewMode;

    /**
     * Идентификатор текущего корневой узла относительно которого
     * отображаются данные в detail-колонке
     */
    get root(): TKey {
        return this._detailDataSource ? this._detailDataSource.root : null;
    }

    /**
     * Идентификатор текущего корневого узла относительно которого
     * отображаются данные в master-колонке
     */
    protected _masterRoot: TKey;

    masterMarkedKey: TKey;

    protected _loading: boolean = false;

    private _masterLoadPromise: Promise<unknown>;
    private _masterLoadResolver: () => void;

    //region source
    private _detailDataSource: DataSource;

    /**
     * Скомпилированные опции для master-колонки.
     * Результат мерджа одноименных корневых опций и опций в поле master.
     */
    private _masterSourceOptions: ISourceOptions;

    /**
     * Скомпилированные опции для detail-колонки.
     * Результат мерджа одноименных корневых опций и опций в поле detail.
     */
    protected _detailSourceOptions: ISourceOptions;

    /**
     * Поисковая строка введенная в search-input, проставляется
     * когда он генерит событие search или resetSearch
     */
    protected _inputSearchString: string;

    /**
     * Значение опции searchValue, которое прокидывается в explorer
     * проставляется после того как получены результаты поиска
     */
    protected _searchValue: string;

    /**
     * В случае если для detail-списка указана опция searchStartingWith === 'root'
     * то после поиска сбрасывается текущее значение root, которое на время отображения
     * результатов поиска хранится в этом поле для того, что бы после сброса поиска
     * вернуть представление к исходному виду
     */
    protected _rootBeforeSearch: TKey;
    //endregion

    //region templates options
    /**
     * Текущая конфигурация списков, полученная из метаданных последнего запроса
     * к данным для detail-колонки. Заполняется в {@link _applyListConfiguration}
     */
    protected _listConfiguration: IBrowserViewConfig;

    protected _tileCfg: TileConfig;

    protected _listCfg: ListConfig;

    /**
     * Опции для Controls/explorer:View в master-колонке
     */
    protected _masterExplorerOptions: unknown;

    /**
     * Опции для Controls/explorer:View в detail-колонке
     */
    protected _detailExplorerOptions: unknown;

    /**
     * Базовая часть уникального идентификатора контрола,
     * по которому хранится конфигурация в хранилище данных.
     */
    protected _basePropStorageId: string;

    protected _detailBgColor: string = '#ffffff';
    //endregion

    //region private fields
    /**
     * true если контрол смонтирован в DOM
     */
    private _isMounted: boolean = false;
    //endregion
    //endregion

    //region ⎆ life circle hooks

    protected _beforeMount(
        options?: IOptions,
        contexts?: object,
        receivedState?: IReceivedState
    ): Promise<IReceivedState> | void {

        this._onMasterLoaded = this._onMasterLoaded.bind(this);

        this._initState(options);
        let result = Promise.resolve(undefined);

        if (receivedState) {
            this._detailDataSource.setItems(receivedState.detailItems);
            this._processItemsMetadata(receivedState.detailItems, options);
            this._afterViewModeChanged(options);
        } else {
            result = Promise
                .all([
                    this._detailDataSource.loadData()
                ])
                .then(
                    ([detailItems]) => {
                        this._afterViewModeChanged(options);
                        return {detailItems};
                    }
                );
        }

        return result;
    }

    protected _componentDidMount(options?: IOptions, contexts?: unknown): void {
        this._isMounted = true;
    }

    protected _beforeUpdate(newOptions?: IOptions, contexts?: unknown): void {
        // this._updateState(newOptions);

        this._userViewMode = newOptions.userViewMode;
        this._detailSourceOptions = compileSourceOptions(newOptions, true);
        this._masterSourceOptions = compileSourceOptions(newOptions, false);

        const isDetailRootChanged = this.root !== this._detailSourceOptions.root;

        this._detailDataSource.updateOptions(
            this._buildDetailDataSourceOptions(newOptions)
        );
        this._detailDataSource.setFilter(this._detailSourceOptions.filter);

        this._detailExplorerOptions = this._buildDetailExplorerOptions(newOptions);

        //region update master
        const newMasterVisibility = Browser.calcMasterVisibility(newOptions);
        // Если видимость мастера не меняется, то меняем _masterRoot,
        // т.к. если он есть, то произойдет загрузка новых данных, а если нет,
        // то не произойдет, но _masterRoot будет актуальным
        if (this._masterVisibility === newMasterVisibility) {
            this._masterRoot = newOptions.masterRoot;
        }

        // Если мастера не было и его надо показать, сразу меняем его
        // видимость и _masterRoot, это вызовет его показ и загрузку данных
        if (
            this._masterVisibility === MasterVisibilityEnum.hidden &&
            newMasterVisibility === MasterVisibilityEnum.visible
        ) {
            if (!isDetailRootChanged && (this._isTileLoaded || this.viewMode !== DetailViewMode.tile)) {
                this._masterVisibility = newMasterVisibility;
            }
            this._masterRoot = newOptions.masterRoot;
        }

        // Если мастер есть и скрывается, то ничего не меняем, все изменения
        // произойдут после загрузки данных в detail-список
        if (
            this._masterVisibility === MasterVisibilityEnum.visible &&
            newMasterVisibility === MasterVisibilityEnum.hidden
        ) {
            if (!isDetailRootChanged && (this._isTileLoaded || this.viewMode !== DetailViewMode.tile)) {
                this._masterVisibility = newMasterVisibility;
            }
        }

        this._masterSourceOptions.root = this._masterRoot;
        //endregion
    }

    protected _beforeUnmount(): void {
        this._detailDataSource.destroy();
    }
    //endregion

    //region public methods
    /**
     * Вызывает перезагрузку данных в detail-колонке
     */
    reload(): Promise<RecordSet> {
        return this._detailDataSource.loadData();
    }
    //endregion

    /**
     * Меняет корневую директорию относительно которой отображаются данные.
     * Перед тем как изменить корень генерит событие beforeRootChanged с помощью
     * которого пользователи могут либо отменить смену корня либо подменить корень,
     * в том числе и корень для master-списка.
     *
     * @see BeforeChangeRootResult
     */
    private _setRoot(root: TKey | IRootsData): Promise<void> {
        let roots = root && typeof root === 'object' && (root as IRootsData);
        // По умолчанию master- и detail-root меняются синхронно
        roots = roots || {
            detailRoot: (root as TKey),
            masterRoot: (root as TKey)
        };

        // Перед тем как менять root уведомим об этом пользователя.
        // Что бы он мог либо отменить обработку либо подменить root.
        return Promise.resolve(
            this._notify('beforeRootChanged', [roots])
        )
            // Обработаем результат события
            .then((beforeChangeResult: BeforeChangeRootResult) => {
                // Если вернули false, значит нужно отменить смену root
                if (beforeChangeResult === false) {
                    return undefined;
                }

                // Если вернулся не undefined значит считаем что root сменили
                if (beforeChangeResult !== undefined) {
                    roots = beforeChangeResult;
                }

                return roots;
            })
            // Обрабатываем смену root когда находимся в режиме поиска
            .then((newRoots) => {
                let resultPromise = Promise.resolve(newRoots);

                // Если меняют root когда находимся в режиме поиска, то нужно
                // сбросить поиск и отобразить содержимое нового root
                if (this.viewMode === DetailViewMode.search) {
                    resultPromise = this._detailDataSource
                        .resetSearchString()
                        .then(() => newRoots);
                }

                return resultPromise;
            })
            // Обновим состояние чтобы загрузились новые данные
            .then((newRoots) => {
                this._changeRoot(newRoots);
            });
    }

    private _changeRoot(roots?: IRootsData, afterSearch: boolean = false): void {
        const detailRootChanged = roots?.detailRoot !== this.root;
        const masterRootChanged = roots?.masterRoot !== this._masterRoot;

        /*this._masterRoot = roots.masterRoot;
        this.masterMarkedKey = roots.detailRoot;
        this._detailDataSource.setRoot(roots.detailRoot);*/

        if (detailRootChanged) {
            this._notify('rootChanged', [roots?.detailRoot, afterSearch]);
        }

        if (masterRootChanged) {
            this._masterLoadPromise = new Promise<boolean>((resolve) => {
                this._masterLoadResolver = () => resolve(masterRootChanged);
            });
            this._notify('masterRootChanged', [roots?.masterRoot]);
        }
    }

    private _setViewMode(value: DetailViewMode, options: IOptions = this._options): void {
        let result = value;

        // Если задан пользовательский вид отображения, то всегда используем его.
        // Но если хотят переключится в режим DetailViewMode.search, то позволяем,
        // т.к. он обладает наивысшим приоритетом
        if (this._userViewMode && result !== DetailViewMode.search) {
            result = this._userViewMode;
        }

        if (this._viewMode === result) {
            return;
        }

        this._viewMode = result;
    }

    /**
     * Постобработчик смены viewMode т.к. explorer может менять его не сразу и нам нужно
     * дождаться {@link _onDetailExplorerChangedViewMode| подтверждения смены viewMode от него}.
     * Также используется в {@link _beforeMount} т.к. на сервере событие о смене viewMode не генерится.
     */
    private _afterViewModeChanged(options: IOptions = this._options): void {
        this._appliedViewMode = this.viewMode;
        if (this._appliedViewMode === DetailViewMode.tile) {
            this._isTileLoaded = true;
        }

        this._updateMasterVisibility(options);
        this._updateDetailBgColor(options);
        // Уведомляем о том, что изменился режим отображения списка в detail-колонке
        this._notify('viewModeChanged', [this.viewMode]);
    }

    /**
     * Запоминает значение, введенное в строку поиска, и запускает запрос данных поиска
     */
    private _setSearchString(searchString: string): void {
        this._loading = true;
        this._inputSearchString = searchString;

        this._detailDataSource
            .setSearchString(searchString)
            .then();
    }

    /**
     * После загрузки результатов поиска:
     *  * сменим режим отображения
     *  * проставим searchValue
     *  * сменим root если надо
     *  * обновим фильтр
     */
    private _afterSearchDataLoaded(): void {
        this._loading = false;
        this._searchValue = this._inputSearchString;

        this._setViewMode(DetailViewMode.search);
        this._updateDetailBgColor();

        if (this._options.detail.searchStartingWith !== 'current') {
            this._rootBeforeSearch = this.root;
            this._changeRoot(
                { detailRoot: null, masterRoot: this._masterRoot},
                true
            );
        }

        this._detailDataSource.updateFilterAfterSearch();
        this._setDetailFilter(this._detailDataSource.getFilter());
    }

    private _setDetailFilter(filter: QueryWhereExpression<unknown>): void {
        this._detailSourceOptions.filter = filter;
        this._notify('detailFilterChanged', [filter]);
    }

    private _processItemsMetadata(items: RecordSet, options: IOptions = this._options): void {
        // Не обрабатываем метаданные если отображаем результаты поиска
        if (this._searchValue) {
            return;
        }

        // Применим новую конфигурацию к отображению detail-списка
        this._applyListConfiguration(getListConfiguration(items), options);
    }

    /**
     * Обновляет состояние контрола в соответствии с переданной настройкой отображения списков
     */
    private _applyListConfiguration(cfg: IBrowserViewConfig, options: IOptions = this._options): void {
        if (!cfg) {
            return;
        }

        this._listConfiguration = cfg;
        this._tileCfg = new TileConfig(cfg, options);
        this._listCfg = new ListConfig(cfg, options);

        this._setViewMode(cfg.settings.clientViewMode, options);
        this._updateMasterVisibility(options);

        this._notify('listConfigurationChanged', [cfg]);
    }

    //region ⇑ events handlers
    private _onDetailDataLoadCallback(items: RecordSet, direction: string): void {
        // Не обрабатываем последующие загрузки страниц. Нас интересует только
        // загрузка первой страницы
        if (direction) {
            return;
        }

        if (this._inputSearchString) {
            this._afterSearchDataLoaded();
        }

        this.masterMarkedKey = this.root;
        this._processItemsMetadata(items);

        // Если после применения конфигурации мастер скрыт, то руками резолвим его лоадер
        if (this._masterVisibility === MasterVisibilityEnum.hidden) {
            this._runMasterLoadResolver();
        }
    }

    /**
     * Обрабатываем смену viewMode в explorer т.к. она может быть асинхронная если после загрузки
     * переключаются в плиточный режим представления, т.к. шаблон и модель для плитки подтягиваются
     * по требованию отдельной функцией
     */
    protected _onDetailExplorerChangedViewMode(): void {
        this._afterViewModeChanged();
    }

    /**
     * Обработчик клика по итему в detail-списке.
     * Если клик идет по папке, то отменяем дефолтную обработку и сами меняем root.
     */
    protected _onDetailItemClick(
        event: SyntheticEvent,
        item: Model,
        clickEvent: unknown,
        columnIndex?: number
    ): unknown {

        const isNode = item.get(this._detailSourceOptions.nodeProperty) !== null;
        if (isNode) {
            this._setRoot(item.get(this._detailSourceOptions.keyProperty)).then();
            return false;
        }

        // Перегенерим событие, т.к. explorer его без bubbling шлет, что бы пользователи
        // могли открыть карточку при клике по листу дерева
        return this._notify('itemClick', [item, clickEvent, columnIndex]);
    }

    /**
     * Обработчик события которое генерит detail-explorer когда в нем меняется root.
     * Сюда попадем только при клике по хлебным крошкам, т.к. explorer сам обрабатывает клик
     * по ним и ни как его не протаскивает. А клик по итему списка обрабатывается в ф-ии
     * {@link _onDetailItemClick}
     */
    protected _onDetailRootChanged(event: SyntheticEvent, root: TKey): void {
        this._setRoot(root).then();
    }

    protected _onMasterLoaded(items: RecordSet, direction: string): void {
        this._runMasterLoadResolver();

        if (this._options.master.dataLoadCallback) {
            this._options.master.dataLoadCallback(items, direction);
        }
    }

    private _runMasterLoadResolver(): void {
        // Если есть промис, ожидающий загрузки данных в мастере, то зарезолвим его
        if (this._masterLoadResolver) {
            this._masterLoadResolver();
            this._masterLoadResolver = null;
        }
    }

    /**
     * Обработчик события которое генерит master-explorer когда в нем меняется root
     */
    protected _onMasterRootChanged(event: SyntheticEvent, root: TKey): void {
        this._setRoot(root).then();
    }

    protected _onSearch(event: SyntheticEvent, validatedValue: string): void {
        this._setSearchString(validatedValue);
    }

    protected _onSearchReset(): void {
        this._detailDataSource.sourceController.cancelLoading();

        this._detailDataSource
            .resetSearchString()
            .then(() => {
                if (this._options.detail.searchStartingWith !== 'current') {
                    this._changeRoot({
                        detailRoot: this._rootBeforeSearch,
                        masterRoot: this._masterRoot
                    });
                    this._rootBeforeSearch = null;
                }
                this._detailDataSource.updateFilterAfterSearch();
                this._setDetailFilter(this._detailDataSource.getFilter());
                this._searchValue = null;
                this._inputSearchString = null;
            });
    }

    // TODO: implement
    protected _onDetailArrowClick(): void {
        return;
    }
    //endregion

    //region 🗘 update state
    /**
     * Обновляет текущее состояние контрола в соответствии с переданными опциями
     */
    private _initState(options: IOptions, oldOptions?: IOptions): void {
        Browser.validateOptions(options);

        // Присваиваем во внутреннюю переменную, т.к. в данном случае не надо генерить событие
        // об изменении значения, т.к. и так идет синхронизация опций
        this._userViewMode = options.userViewMode;
        this._detailSourceOptions = compileSourceOptions(options, true);
        this._masterSourceOptions = compileSourceOptions(options, false);

        if (this.viewMode === DetailViewMode.tile) {
            this._isTileLoaded = true;
        }

        //region update master fields
        this._masterRoot = this._masterSourceOptions.root;
        // На основании полученного состояния соберем опции для master-списка
        this._masterExplorerOptions = this._buildMasterExplorerOption(options);
        //endregion

        //region update detail fields
        this._detailDataSource = new DataSource(
            this._buildDetailDataSourceOptions(options)
        );

        // На основании полученного состояния соберем опции для detail-explorer
        this._detailExplorerOptions = this._buildDetailExplorerOptions(options);
        //endregion

        // Если передан кастомный идентификатор хранилища, то на основании него собираем
        // базовую часть нашего идентификатора для того, что бы в дальнейшем использовать
        // её для генерации ключей в которых будем хранить свои настройки
        if (typeof options.propStorageId === 'string') {
            this._basePropStorageId = `Controls.newBrowser:Browser_${options.propStorageId}_`;
        }
    }

    private _buildDetailDataSourceOptions(options: IOptions): IDetailOptions {
        return {
            ...options.detail,
            ...this._detailSourceOptions,
            dataLoadCallback: (items: RecordSet, direction: string) => {
                this._onDetailDataLoadCallback(items, direction);

                if (options.detail.dataLoadCallback) {
                    options.detail.dataLoadCallback(items, direction);
                }
            }
        } as IDetailOptions;
    }

    /**
     * По переданным опциям собирает конфигурацию для Controls/explorer:View,
     * расположенном в master-колонке.
     */
    private _buildMasterExplorerOption(options: IOptions = this._options): unknown {
        const defaultCfg = {
            style: 'master',
            backgroundStyle: 'master',
            viewMode: DetailViewMode.table,
            markItemByExpanderClick: true,
            markerVisibility: 'onactivated',
            expanderVisibility: 'hasChildren',

            ...this._masterSourceOptions
        };

        if (options.master?.treeGridView) {
            return {...defaultCfg, ...options.master.treeGridView};
        }

        return defaultCfg;
    }

    /**
     * По переданным опциям собирает конфигурацию для Controls/explorer:View,
     * расположенном в detail-колонке.
     */
    private _buildDetailExplorerOptions(options: IOptions = this._options): unknown {
        const result: any = {
            // Дефолтные опции
            style: 'default',

            // Пользовательские опции
            ...options.detail,
            // Опции собранные на основании корневых и detail
            ...this._detailSourceOptions,

            // Наш sourceController для того что-бы контролировать загрузку данных
            sourceController: this._detailDataSource.sourceController
        };

        // Если кастомный шаблон отображения итема списка не задан, то используем наш дефолтный
        result.itemTemplate = result.itemTemplate || DefaultListItemTemplate;
        // Если кастомный шаблон отображения плитки не задан, то используем наш дефолтный
        result.tileItemTemplate = result.tileItemTemplate || DefaultTileItemTemplate;

        return result;
    }

    /**
     * Обновляет видимость master-колонки на основании опций и текущей конфигурации представления.
     * Если конфигурация не задана, то видимость вычисляется на основании опций, в противном
     * случае на основании конфигурации.
     */
    private _updateMasterVisibility(options: IOptions = this._options): void {
        // В режиме поиска не обновляем видимость мастера, т.к. если он был, то должен остаться
        // если нет, то нет
        if (this._appliedViewMode === DetailViewMode.search) {
            return;
        }

        this._masterVisibility = Browser.calcMasterVisibility({
            master: options.master,
            userViewMode: this._appliedViewMode,
            listConfiguration: this._listConfiguration
        });
    }

    private _updateDetailBgColor(options: IOptions = this._options): void {
        // Для таблицы и режима поиска (по сути та же таблица) фон должен быть белый
        if (this.viewMode === DetailViewMode.search || this.viewMode === DetailViewMode.table) {
            this._detailBgColor = '#ffffff';
        } else {
            this._detailBgColor = options.detail.backgroundColor || '#ffffff';
        }
    }
    //endregion

    //region base control overrides
    protected _notify(eventName: string, args?: unknown[], options?: { bubbling?: boolean }): unknown {
        if (!this._isMounted) {
            return;
        }

        return super._notify(eventName, args, options);
    }
    //endregion

    //region • static utils
    static _theme: string[] = [
        'Controls/listTemplates',
        'Controls/newBrowser'
    ];

    static calcMasterVisibility(options: IOptions): MasterVisibilityEnum {
        let masterVisibility = options.master?.visibility || MasterVisibilityEnum.hidden;

        if (options.listConfiguration && options.userViewMode) {
            const nodesPosition = options.listConfiguration[options.userViewMode].node?.position;
            masterVisibility = nodesPosition === NodesPosition.left
                ? MasterVisibilityEnum.visible
                : MasterVisibilityEnum.hidden;
        }

        return masterVisibility;
    }

    static getDefaultOptions(): IOptions {
        return {
            master: {
                treeGridView: {},
                visibility: MasterVisibilityEnum.hidden
            },
            detail: {
                searchStartingWith: 'root'
            }
        };
    }

    static validateOptions(options: IOptions): void {
        // Если базовый источник данных не задан, то проверим
        // заданы ли источники данных для master и detail колонок
        if (!options.source) {
            if (options.master && !options.master.source) {
                Logger.error(
                    'Не задан источник данных для master-колонки. ' +
                    'Необходимо указать либо базовый источник данных в опции source либо источник данных ' +
                    'для master-колонки в опции master.source.',
                    this
                );
            }

            if (options.detail && !options.detail.source) {
                Logger.error(
                    'Не задан источник данных для detail-колонки. ' +
                    'Необходимо указать либо базовый источник данных в опции source либо источник данных ' +
                    'для detail-колонки в опции detail.source.',
                    this
                );
            }
        }

        // Если базовый keyProperty не задан, то проверим
        // задан ли он для master и detail колонок
        if (!options.keyProperty) {
            if (options.master && !options.master.keyProperty) {
                Logger.error(
                    'Не задано keyProperty для master-колонки. ' +
                    'Необходимо указать либо базовый keyProperty в опции keyProperty либо keyProperty ' +
                    'для master-колонки в опции master.keyProperty.',
                    this
                );
            }

            if (options.detail && !options.detail.keyProperty) {
                Logger.error(
                    'Не задано keyProperty для detail-колонки. ' +
                    'Необходимо указать либо базовый keyProperty в опции keyProperty либо keyProperty ' +
                    'для detail-колонки в опции detail.keyProperty.',
                    this
                );
            }
        }
    }
    //endregion

}

/**
 * @event Событие об изменении режима отображения списка в detail-колонке
 * @name Controls/newBrowser:Browser#viewModeChanged
 * @param {DetailViewMode} viewMode Текущий режим отображения списка
 */

/**
 * @event Событие, которое генерируется перед сменой root. Вы можете использовать это событие
 * что бы:
 *  * отменить смету root - вернуть false из обработчика события
 *  * подменить root - вернуть объект с полями masterRoot и detailRoot
 * Также результатом выполнения обработчика может быть Promise, который резолвится
 * выше описанными значениями.
 *
 * @name Controls/newBrowser:Browser#beforeRootChanged
 * @param {IRootsData} roots Новые id корневых директорий для master- и detail-списков
 */

/**
 * @event Событие об изменении корня в detail-списке
 * @name Controls/newBrowser:Browser#rootChanged
 * @param {TKey} root Текущий корневой узел
 */

/**
 * @event Событие об изменении корня в master-списке
 * @name Controls/newBrowser:Browser#masterRootChanged
 * @param {TKey} root Текущий корневой узел
 */

/**
 * @event Событие об изменении текущей корневого папки в detail-колонке
 * @name Controls/newBrowser:Browser#detailRootChanged
 * @param {string} root Текущая корневая папка
 */

Object.defineProperty(Browser, 'defaultProps', {
   enumerable: true,
   configurable: true,

   get(): object {
      return Browser.getDefaultOptions();
   }
});
