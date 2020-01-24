import {Control, TemplateFunction} from 'UI/Base';
import {RecordSet} from 'Types/collection';
import {Memory, ICrud} from 'Types/source';
import {IPagingOptions} from 'Controls/_paging/Paging';
import {SyntheticEvent} from 'Vdom/Vdom';
import {INavigationOptionValue} from 'Controls/interface';

// Importing new controllers
import {error as ErrorModule, SourceWrapper, ISourceErrorData, ISourceErrorConfig} from 'Controls/dataSource';

import {NavigationController} from 'Controls/source';

import * as Template from 'wml!Controls-demo/listRender/ColumnsView/ColumnsView';

const NUMBER_OF_ITEMS = 100;

/**
 * Генератор данных
 * @param n
 */
const generateRawData = (n: number): any[] => {
    const rawData = [];
    for (let i = 0; i < n; i++) {
        rawData.push({
            id: i,
            title: `${i} item`
        });
    }
    return rawData;
};

/**
 * http://localhost:3000/Controls-demo/app/Controls-demo%2FList%2FRenderContainer%2FIndex
 * http://localhost:3000/Controls-demo/app/Controls-demo%2FlistRender%2FColumnsView%2FIndex
 */
export default class RenderColumnsViewContainerDemo extends Control {
    protected _template: TemplateFunction = Template;

    protected _children = {
        errorContainer: ErrorModule.Container
    };

    protected _items: RecordSet;
    protected _itemsSource: ICrud;

    protected _itemActions: any[];

    /**
     * Настройки пейджинатора
     */
    protected _pagingCfg: IPagingOptions;

    private _navigationOptions: INavigationOptionValue;

    /**
     * Текущая ошибка
     */
    private _error: ErrorModule.ViewConfig;

    /**
     * Экземпляр контроллера, управляющего навигацией по записям (NavigationController)
     */
    protected _navigationController: NavigationController;

    protected _beforeMount(options?: {}, contexts?: object, receivedState?: void): Promise<void> | void {
        // Initializing items
        this._items = new RecordSet();
        // Initializing source
        const _itemsSource = new Memory({
            data: generateRawData(NUMBER_OF_ITEMS),
            keyProperty: 'id'
        });
        this._itemsSource = new SourceWrapper(_itemsSource);
        // Initializing paging and navigation
        this._pagingCfg = {
            pagesCount: 2,
            showDigits: true,
            selectedPage: 1,
            stateBegin: 'disabled',
            stateEnd: 'disabled',
            stateNext: 'normal',
            statePrev: 'normal'
        };
        this._navigationOptions = this._calcNavigationOptions(1, false);
        // Initializing NavigationController
        this._navigationController = new NavigationController({
            keyProperty: 'id',
            source: this._itemsSource,
            navigation: this._navigationOptions
        });
        // initializing item actions
        this._itemActions = [
            {
                id: 1,
                icon: 'icon-PhoneNull',
                title: 'phone',
                style: 'success',
                iconStyle: 'success',
                showType: 0,
                handler: (item) => alert(`phone clicked at ${item.getId()}`)
            },
            {
                id: 2,
                icon: 'icon-Edit',
                title: 'fake',
                style: 'danger',
                iconStyle: 'danger',
                showType: 0
            }
        ];
        return this._load();
    }

    /**
     * Нажата страница в контроле навигации
     * @param e
     * @param page
     * @private
     */
    private _onPagingChangePage(e: SyntheticEvent<Event>, page: number) {
        this._pagingCfg.selectedPage = page;
        this._navigationOptions = this._calcNavigationOptions(page, false);
        this._navigationController.rebuildState(this._navigationOptions.sourceConfig);
        this._load();
    }

    /**
     * Нажата стрелка в контроле навигации
     * @param e
     * @param btnName
     * @private
     */
    private _onPagingArrowClick(e: SyntheticEvent<Event>, btnName: string) {
        if (btnName === 'Next') {
            this._navigationController.calculateState(this._items, 'down');
        } else if (btnName === 'Prev') {
            this._navigationController.calculateState(this._items, 'up');
        }
        this._load();
    }

    /**
     * Рассчитывает опции для навигации
     * @param page
     * @param hasMore
     * @private
     */
    private _calcNavigationOptions(page: number, hasMore?: boolean): INavigationOptionValue {
        return {
            source: 'page',
            view: 'pages',
            sourceConfig: {
                direction: 'after',
                hasMore: hasMore || false,
                page: page ? page - 1 : 0,
                pageSize: Math.ceil(NUMBER_OF_ITEMS / this._pagingCfg.pagesCount)
            }
        };
    }

    /**
     * Загружаем данные списка через контрол навигации
     * @private
     */
    private _load(): Promise<void> {
        return this._navigationController.load()
            .then((recordSet: RecordSet) => {
                this._items = recordSet;
            })
            .catch((error) => {
                console.log(error);
            });
    }
}
