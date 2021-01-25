import {Logger} from 'UI/Utils';
import {SyntheticEvent} from 'UI/Vdom';
import {RecordSet} from 'Types/collection';
import {TKey} from 'Controls/_interface/IItems';
import {Control, TemplateFunction} from 'UI/Base';
import {DataSource} from 'Controls/_newBrowser/DataSource';
import {IOptions} from 'Controls/_newBrowser/interfaces/IOptions';
import {IControllerOptions} from 'Controls/_dataSource/Controller';
import {NewSourceController as SourceController} from 'Controls/dataSource';
import {ISourceOptions} from 'Controls/_newBrowser/interfaces/ISourceOptions';
import {DetailViewMode} from 'Controls/_newBrowser/interfaces/IDetailOptions';
import {MasterVisibilityEnum} from 'Controls/_newBrowser/interfaces/IMasterOptions';
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
import {BeforeChangeRootResult, IRootsData} from 'Controls/_newBrowser/interfaces/IRootsData';
import {Model} from 'Types/entity';

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
    // Предыдущий _viewMode
    private _prevViewMode: DetailViewMode;

    /**
     * Идентификатор текущего корневой узел относительно которого
     * отображаются данные в detail-колонке
     */
    get root(): TKey {
        return this._detailDataSource?.root || null;
    }

    /**
     * Идентификатор текущего корневого узла относительно которого
     * отображаются данные в master-колонке
     */
    get masterRoot(): TKey {
        return this._masterSourceController?.getRoot() || null;
    }

    //region source
    protected _masterSourceController: SourceController;

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

        this._updateState(options);
        let result = Promise.resolve(undefined);

        if (receivedState) {
            // Итемов master-списка может не быть если master-колонка скрыта
            if (receivedState.masterItems) {
                this._masterSourceController.setItems(receivedState.masterItems);
            }

            this._detailDataSource.setItems(receivedState.detailItems);
            this._processItemsMetadata(receivedState.detailItems, options);
        } else {
            const detailDataPromise = this._detailDataSource.loadData();
            // Если master-колонка скрыта, то незачем запрашивать данные для неё
            const masterDataPromise = this._masterVisibility === MasterVisibilityEnum.visible
                ? this._masterSourceController.load() as Promise<RecordSet>
                : Promise.resolve(undefined);

            result = Promise
                .all([
                    masterDataPromise,
                    detailDataPromise
                ])
                .then(
                    ([masterItems, detailItems]) => ({masterItems, detailItems})
                );
        }

        return result;
    }

    protected _componentDidMount(options?: IOptions, contexts?: unknown): void {
        this._isMounted = true;
    }

    protected _beforeUpdate(newOptions?: IOptions, contexts?: unknown): void {
        this._updateState(newOptions);
    }

    protected _beforeUnmount(): void {
        this._detailDataSource.destroy();
        this._masterSourceController.destroy();
    }
    //endregion

    /**
     * Меняет корневую директорию относительно которой отображаются данные.
     * Перед тем как изменить корень генерит событие beforeRootChanged с помощью
     * которого пользователи могут либо отменить смену корня либо подменить корень,
     * в том числе и корень для master-списка.
     */
    setRoot(root: TKey, noLoad: boolean = false): Promise<RecordSet> {
        // Перед тем как менять root уведомим об этом пользователя.
        // Что бы он мог либо отменить обработку либо подменить root.
        return Promise.resolve(
            this._notify('beforeRootChanged', [root])
        )
            // Обработаем результат события
            .then((beforeChangeResult: BeforeChangeRootResult) => {
                // Если вернули false, значит нужно отменить смену root
                if (beforeChangeResult === false) {
                    return undefined;
                }

                // По умолчанию master- и detail-root меняются синхронно
                let newRoots: IRootsData = {
                    detailRoot: root,
                    masterRoot: root
                };
                // Если вернулся не undefined значит считаем что root сменили
                if (beforeChangeResult !== undefined) {
                    newRoots = beforeChangeResult;
                }

                return newRoots;
            })
            // Загрузим данные если нужно
            .then((newRoots) => {
                const hasRoots = newRoots !== undefined;
                const detailRootChanged = hasRoots ? this.root !== newRoots.detailRoot : false;
                const masterRootChanged = hasRoots ? this.masterRoot !== newRoots.masterRoot : false;

                this._detailDataSource.setRoot(newRoots.detailRoot);
                this._masterSourceController.setRoot(newRoots.masterRoot);

                // Уведомим об изменении root
                if (detailRootChanged) {
                    this._notify('rootChanged', [newRoots.detailRoot]);
                }

                // Уведомим об изменении masterRoot
                if (masterRootChanged) {
                    this._notify('masterRootChanged', [newRoots.masterRoot]);
                }

                // Перезапросим данные
                // return this._detailDataSource.loadData();
                return undefined;
            })
            // Обработаем загруженные данные
            .then((items) => {
                /*// Применим конфигурацию из метаданных, только если требовалась загрузка
                if (!noLoad) {
                    this._processItemsMetadata(items);
                }

                return items;*/

                return undefined;
            });
    }

    setSearchString(searchString: string): Promise<RecordSet> {
        return this._detailDataSource
            .setSearchString(searchString)
            .then((items) => {
                this._setViewMode(
                    searchString ? DetailViewMode.search : this._prevViewMode
                );

                return items;
            });
    }

    private _processItemsMetadata(items: RecordSet, options: IOptions = this._options): void {
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

        // Если не в режиме поиска, то нужно применить viewMode из конфига
        if (this.viewMode !== DetailViewMode.search) {
            this._setViewMode(cfg.settings.clientViewMode);
            this._updateMasterVisibility(options);
        }
    }

    private _setViewMode(value: DetailViewMode): void {
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

        this._prevViewMode = this._viewMode;
        this._viewMode = result;

        // Обновим видимость мастера, т.к. она зависит от viewMode
        this._updateMasterVisibility();

        // Уведомляем о том, что изменился режим отображения списка в detail-колонке
        this._notify('viewModeChanged', [result]);
    }

    //region ⇑ events handlers
    protected _onDetailItemClick(
        event: SyntheticEvent,
        item: Model,
        clickEvent: unknown,
        columnIndex?: number
    ): unknown {
        event.stopPropagation();
        // Перегенерим событие т.к. explorer его без bubbling шлет
        return this._notify('itemClick', [item, clickEvent, columnIndex]);
    }

    protected _onDetailArrowClick(): void {
        return;
    }

    /**
     * Обработчик события которое генерит detail-explorer когда в нем меняется root
     */
    protected _onDetailRootChanged(event: SyntheticEvent, root: TKey): void {
        // Не загружаем данные т.к. список сам загрузит
        this.setRoot(root, true).then();
    }

    /**
     * Обработчик события которое генерит master-explorer когда в нем меняется root
     */
    protected _onMasterRootChanged(event: SyntheticEvent, root: TKey): void {
        // Не загружаем данные т.к. список сам загрузит
        this.setRoot(root, true).then();
    }

    /**
     * Обработчик события которое генерит master-explorer когда в нем меняется
     * выбранный итем
     */
    protected _onMasterMarkedKeyChanged(event: SyntheticEvent, root: TKey): void {
        this.setRoot(root).then();
    }

    protected _onSearch(event: SyntheticEvent, validatedValue: string): void {
        this.setSearchString(validatedValue).then();
    }

    protected _onSearchReset(): void {
        this.setSearchString(null).then();
    }
    //endregion

    //region 🗘 update state
    /**
     * Обновляет текущее состояние контрола в соответствии с переданными опциями
     */
    private _updateState(options: IOptions = this._options): void {
        Browser.validateOptions(options);

        // Присваиваем во внутреннюю переменную, т.к. в данном случае не надо генерить событие
        // об изменении значения, т.к. и так идет синхронизация опций
        this._userViewMode = options.userViewMode;
        this._updateMasterVisibility(options);

        this._detailSourceOptions = compileSourceOptions(options, true);
        this._masterSourceOptions = compileSourceOptions(options, false);

        //region update master fields
        // Если еще не создавался SourceController для master-колонки, то создадим
        if (!this._masterSourceController) {
            this._masterSourceController = new SourceController(this._masterSourceOptions as IControllerOptions);
        } else {
            this._masterSourceController.setRoot(this._masterSourceOptions.root);
        }

        // На основании полученного состояния соберем опции для master-списка
        this._masterExplorerOptions = this._buildMasterExplorerOption(options);
        //endregion

        //region update detail fields
        // Если еще не создавался DataSource для detail-колонки, то создадим
        if (!this._detailDataSource) {
            this._detailDataSource = new DataSource({
                ...this._detailSourceOptions,
                dataLoadCallback: (items: RecordSet) => {
                    this._processItemsMetadata(items);
                }
            });
        } else {
            this._detailDataSource.setRoot(this._detailSourceOptions.root);
        }

        // На основании полученного состояния соберем опции для detail-explorer
        this._detailExplorerOptions = this._buildDetailExplorerOptions(options);
        //endregion

        // Если передан кастомный идентификатор хранилища, то на основании него собираем
        // базовую часть нашего идентификатора для того, что бы в дальнейшем использовать
        // её для генерации ключей в которых будем хранить свои настройки
        if (typeof options.propStorageId === 'string') {
            this._basePropStorageId = `Controls/newBrowser:Browser_${options.propStorageId}_`;
        }
    }

    /**
     * По переданным опциям собирает конфигурацию для Controls/explorer:View,
     * расположенном в master-колонке.
     */
    private _buildMasterExplorerOption(options: IOptions = this._options): unknown {
        const defaultCfg = {
            style: 'master',
            backgroundStyle: 'master',
            expanderVisibility: undefined,
            viewMode: DetailViewMode.table,

            // Так же задаем source, т.к. без него подает ошибка при попытке раскрытия узлов
            // а список все равно в первую очередь смотрит на sourceController
            ...this._masterSourceOptions,
            sourceController: this._masterSourceController
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
            backgroundStyle: 'transparent',

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
        this._masterVisibility = !options.master ? MasterVisibilityEnum.hidden : options.master.visibility;

        if (!this._listConfiguration || !this.viewMode || this.viewMode === DetailViewMode.search) {
            return;
        }

        const nodesPosition =
            this._listConfiguration[this.viewMode].node?.position ||
            this._listConfiguration.nodesPosition;

        this._masterVisibility = nodesPosition === NodesPosition.left
            ? MasterVisibilityEnum.visible
            : MasterVisibilityEnum.hidden;

        if (
            this._masterVisibility === MasterVisibilityEnum.visible
            && !this._masterSourceController.getItems()
        ) {
            this._masterSourceController.load().then();
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

    //region static utils
    static _theme: string[] = [
        'Controls/listTemplates',
        'Controls/newBrowser'
    ];

    static getDefaultOptions(): IOptions {
        return {
            master: {
                treeGridView: {},
                visibility: MasterVisibilityEnum.hidden
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
 * @param {TKey} root Текущий корневой узел
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
